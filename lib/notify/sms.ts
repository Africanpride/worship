import "server-only";
import { log } from "@/lib/logger";
import { prisma } from "@/lib/prisma";

function getTwilioConfig(): {
	accountSid: string;
	authToken: string;
	from: string;
} | null {
	const sid = process.env.TWILIO_ACCOUNT_SID;
	const token = process.env.TWILIO_AUTH_TOKEN;
	const from = process.env.TWILIO_FROM_NUMBER;
	if (!sid || !token || !from) return null;
	return { accountSid: sid, authToken: token, from };
}

function truncateSms(body: string): string {
	// Keep under 1600 for Twilio concatenated, but aim ~160 for cost
	if (body.length <= 320) return body;
	return `${body.slice(0, 317)}…`;
}

export async function sendSmsToUser(
	userId: string,
	body: string,
): Promise<boolean> {
	const twilio = getTwilioConfig();
	if (!twilio) {
		log.debug("system", "sms skipped — TWILIO not configured", {
			meta: { userId },
		});
		return false;
	}

	const profile = await prisma.profile.findUnique({
		where: { userId },
		select: { phone: true, phoneVerifiedAt: true },
	});
	if (!profile?.phone || !profile.phoneVerifiedAt) {
		log.debug("system", "sms skipped — phone not verified", {
			meta: { userId },
		});
		return false;
	}

	const text = truncateSms(body);

	try {
		const client = (await import("twilio")).default(
			twilio.accountSid,
			twilio.authToken,
		);
		await client.messages.create({
			body: text,
			from: twilio.from,
			to: profile.phone,
		});
		log.info("system", "sms sent", {
			meta: { userId, phone: profile.phone.slice(-4) },
		});
		return true;
	} catch (error) {
		log.warn("system", "sms send failed", {
			detail: error instanceof Error ? error.message : String(error),
			meta: { userId },
		});
		return false;
	}
}

// OTP helper used by phone verification — thin wrapper so routes don't import twilio directly
export async function sendOtpSms(
	phone: string,
	code: string,
): Promise<boolean> {
	const twilio = getTwilioConfig();
	const body = `The NonStop verification code: ${code} (expires in 5 minutes). Reply STOP to opt out.`;
	if (!twilio) {
		// Dev fallback — log instead of sending
		log.info("system", "otp sms (dev stub)", {
			meta: { phone: phone.slice(-4), code },
		});
		return true;
	}
	try {
		const client = (await import("twilio")).default(
			twilio.accountSid,
			twilio.authToken,
		);
		await client.messages.create({ body, from: twilio.from, to: phone });
		return true;
	} catch (error) {
		log.warn("system", "otp sms failed", {
			detail: error instanceof Error ? error.message : String(error),
			meta: { phone: phone.slice(-4) },
		});
		return false;
	}
}
