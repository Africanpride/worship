import "server-only";
import { log } from "@/lib/logger";
import { prisma } from "@/lib/prisma";

type PushPayload = { title: string; body?: string; url?: string; icon?: string; badge?: string };

function getVapidConfig(): { publicKey: string; privateKey: string; subject: string } | null {
	const pub = process.env.VAPID_PUBLIC_KEY;
	const priv = process.env.VAPID_PRIVATE_KEY;
	const subject = process.env.VAPID_SUBJECT ?? "mailto:no-reply@thenonstop.org";
	if (!pub || !priv) return null;
	return { publicKey: pub, privateKey: priv, subject };
}

export async function sendPushToUser(
	userId: string,
	payload: PushPayload,
): Promise<{ sent: number; failed: number }> {
	const vapid = getVapidConfig();
	if (!vapid) {
		log.debug("system", "push skipped — VAPID not configured", { meta: { userId } });
		return { sent: 0, failed: 0 };
	}

	const subs = await prisma.pushSubscription.findMany({ where: { userId } });
	if (subs.length === 0) return { sent: 0, failed: 0 };

	const webPush = await import("web-push");
	webPush.setVapidDetails(vapid.subject, vapid.publicKey, vapid.privateKey);

	let sent = 0;
	let failed = 0;
	const data = JSON.stringify({
		title: payload.title,
		body: payload.body,
		url: payload.url,
		icon: payload.icon ?? "/logos/logo.png",
		badge: payload.badge ?? "/logos/logo.png",
	});

	await Promise.allSettled(
		subs.map(async (sub) => {
			try {
				await webPush.sendNotification(
					{ endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
					data,
					{ TTL: 60 * 60 },
				);
				sent += 1;
			} catch (error: unknown) {
				const statusCode =
					typeof error === "object" && error !== null && "statusCode" in error
						? (error as { statusCode: number }).statusCode
						: 0;
				// 410 Gone / 404 Not Found — subscription stale, remove
				if (statusCode === 410 || statusCode === 404) {
					await prisma.pushSubscription.delete({ where: { endpoint: sub.endpoint } }).catch(() => {});
					log.info("system", "push subscription removed (410/404)", { meta: { endpoint: sub.endpoint.slice(0, 32) } });
				} else {
					log.warn("system", "push send failed", {
						detail: error instanceof Error ? error.message : String(error),
						meta: { userId, statusCode: String(statusCode) },
					});
				}
				failed += 1;
			}
		}),
	);

	return { sent, failed };
}
