import "server-only";
import { log } from "@/lib/logger";
import { prisma } from "@/lib/prisma";

type PushPayload = { title: string; body?: string; url?: string; icon?: string; badge?: string };

function getVapidConfig(): { publicKey: string; privateKey: string; subject: string } | null {
  const pub = process.env.VAPID_PUBLIC_KEY ?? "";
  const priv = process.env.VAPID_PRIVATE_KEY ?? "";
  const subject = process.env.VAPID_SUBJECT ?? "mailto:no-reply@thenonstop.org";
  if (!pub || !priv) return null;
  return { publicKey: pub, privateKey: priv, subject };
}

export async function sendPushToUser(
  userId: string,
  payload: PushPayload,
): Promise<{ sent: number; failed: number }> {
  const subs = await prisma.pushSubscription.findMany({ where: { userId } });
  if (subs.length === 0) return { sent: 0, failed: 0 };

  const icon = payload.icon ?? "/logos/logo.png";
  const badge = payload.badge ?? "/logos/logo.png";
  const url = payload.url ?? "/profile";

  let sent = 0;
  let failed = 0;

  const fcmSubs = subs.filter((s) => !!s.fcmToken);
  const webSubs = subs.filter((s) => !!s.endpoint && !!s.p256dh && !!s.auth);

  // FCM path — for web + future Android/iOS (single Admin SDK, same project)
  if (fcmSubs.length > 0) {
    const { getFirebaseAdminApp } = await import("@/lib/firebase-admin");
    const app = getFirebaseAdminApp();
    if (!app) {
      log.warn("system", "push skipped — Firebase Admin not configured (FIREBASE_SERVICE_ACCOUNT_JSON)", { meta: { userId } });
    } else {
      const { getMessaging } = await import("firebase-admin/messaging");
      const messaging = getMessaging(app);
      await Promise.allSettled(
        fcmSubs.map(async (sub) => {
          try {
            await messaging.send({
              token: sub.fcmToken!,
              notification: { title: payload.title, body: payload.body, imageUrl: icon },
              webpush: {
                notification: { title: payload.title, body: payload.body, icon, badge },
                fcmOptions: { link: url },
              },
              // For Android/iOS clients later: same payload, OS picks notification vs data
              data: { url, title: payload.title, body: payload.body ?? "" },
            });
            sent += 1;
          } catch (error: unknown) {
            const code = typeof error === "object" && error !== null && "code" in error ? String((error as { code: string }).code) : "";
            const msg = error instanceof Error ? error.message : String(error);
            // Invalid token / unregistered — prune
            if (code.includes("invalid-registration-token") || code.includes("registration-token-not-registered") || msg.includes("Requested entity was not found")) {
              await prisma.pushSubscription.delete({ where: { id: sub.id } }).catch(() => {});
              log.info("system", "FCM token removed (invalid/unregistered)", { meta: { endpoint: sub.fcmToken?.slice(0, 24) } });
            } else {
              log.warn("system", "FCM send failed", { detail: msg, meta: { userId, code } });
            }
            failed += 1;
          }
        }),
      );
    }
  }

  // Legacy Web Push (VAPID) — keep until all clients migrated to FCM
  if (webSubs.length > 0) {
    const vapid = getVapidConfig();
    if (!vapid) {
      log.debug("system", "legacy web-push skipped — VAPID not configured", { meta: { userId } });
    } else {
      const webPush = await import("web-push");
      webPush.setVapidDetails(vapid.subject, vapid.publicKey, vapid.privateKey);
      const data = JSON.stringify({ title: payload.title, body: payload.body, url, icon, badge });
      await Promise.allSettled(
        webSubs.map(async (sub) => {
          try {
            await webPush.sendNotification(
              { endpoint: sub.endpoint!, keys: { p256dh: sub.p256dh!, auth: sub.auth! } },
              data,
              { TTL: 60 * 60 },
            );
            sent += 1;
          } catch (error: unknown) {
            const statusCode =
              typeof error === "object" && error !== null && "statusCode" in error ? (error as { statusCode: number }).statusCode : 0;
            if (statusCode === 410 || statusCode === 404) {
              await prisma.pushSubscription.delete({ where: { id: sub.id } }).catch(() => {});
              log.info("system", "push subscription removed (410/404)", { meta: { endpoint: sub.endpoint?.slice(0, 32) } });
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
    }
  }

  return { sent, failed };
}
