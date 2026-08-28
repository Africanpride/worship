import "server-only";

import { log } from "@/lib/logger";
import { prisma } from "@/lib/prisma";

function getConfig() {
	const base = (process.env.OPENWA_BASE_URL ?? "http://localhost:2785").replace(
		/\/$/,
		"",
	);
	const session =
		process.env.OPENWA_SESSION_ID ?? "181c53f2-4092-47c3-9eb6-f8e42eff59e8";
	const apiKey = process.env.OPENWA_API_KEY;
	if (!base) return null;
	return { base, session, apiKey };
}

export function toChatId(phone: string): string {
	const digits = phone.replace(/\D/g, "");
	return `${digits}@c.us`;
}

export function truncateWa(body: string): string {
	if (body.length <= 4096) return body;
	return `${body.slice(0, 4093)}…`;
}

async function postSend(chatId: string, message: string): Promise<boolean> {
	const cfg = getConfig();
	if (!cfg) {
		log.debug("system", "whatsapp skipped — OPENWA not configured", {
			meta: { chatId: chatId.slice(-8) },
		});
		return false;
	}
	const text = truncateWa(message);
	const urls = [
		`${cfg.base}/api/sessions/${cfg.session}/messages/send-text`,
		`${cfg.base}/api/sessions/${cfg.session}/messages`,
		`${cfg.base}/api/${cfg.session}/sendMessage`,
		`${cfg.base}/api/sendMessage`,
		`${cfg.base}/sendMessage`,
		`${cfg.base}/api/${cfg.session}/sendText`,
	];
	const headers: Record<string, string> = {
		"Content-Type": "application/json",
	};
	if (cfg.apiKey) {
		headers.Authorization = `Bearer ${cfg.apiKey}`;
		headers["x-api-key"] = cfg.apiKey;
	}
	const payloads = [
		{ chatId, text },
		{ chatId, message: text },
		{ chatId, message: text, sessionId: cfg.session },
		{ phone: chatId.replace("@c.us", ""), message: text },
	];
	for (const url of urls) {
		for (const body of payloads) {
			try {
				const res = await fetch(url, {
					method: "POST",
					headers,
					body: JSON.stringify(body),
				});
				if (res.ok || res.status === 200 || res.status === 201) {
					log.info("system", "whatsapp sent", {
						meta: { chatId: chatId.slice(-4) },
					});
					return true;
				}
				if (res.status === 404) continue;
				const txt = await res.text().catch(() => "");
				log.warn("system", "whatsapp send failed", {
					detail: `${res.status} ${txt.slice(0, 200)}`,
					meta: { chatId: chatId.slice(-4) },
				});
				return false;
			} catch {
				/* try next url */
			}
		}
	}
	log.warn("system", "whatsapp send failed all variants", {
		meta: { chatId: chatId.slice(-4) },
	});
	return false;
}

export async function sendWhatsappRaw(chatId: string, message: string) {
	return postSend(chatId, message);
}

export async function sendWhatsappToUser(
	userId: string,
	body: string,
): Promise<boolean> {
	const profile = await prisma.profile.findUnique({
		where: { userId },
		select: { phone: true, phoneVerifiedAt: true },
	});
	if (!profile?.phone || !profile.phoneVerifiedAt) {
		log.debug("system", "whatsapp skipped — phone not verified", {
			meta: { userId },
		});
		return false;
	}
	return postSend(toChatId(profile.phone), body);
}

export async function sendWhatsappOtp(
	phone: string,
	code: string,
): Promise<boolean> {
	const body = `The NonStop verification code: ${code} (expires in 5 minutes).`;
	const ok = await postSend(toChatId(phone), body);
	if (!ok && process.env.NODE_ENV !== "production") {
		log.info("system", "otp whatsapp (dev stub)", {
			meta: { phone: phone.slice(-4), code },
		});
		return true;
	}
	return ok;
}
