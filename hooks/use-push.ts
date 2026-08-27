"use client";

import { useCallback, useEffect, useState } from "react";
import { getFcmVapidKey, getFirebaseApp, isFirebaseConfigured } from "@/lib/firebase";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
  return outputArray;
}

export function usePush() {
  const [supported, setSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">("default");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "";
  const fcmVapidKey = getFcmVapidKey();
  const useFcm = isFirebaseConfigured() && !!fcmVapidKey;

  useEffect(() => {
    const ok = "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
    setSupported(ok);
    if (ok) setPermission(Notification.permission);
    // Foreground FCM messages — show via SW or directly
    if (ok && useFcm) {
      (async () => {
        try {
          const { getMessaging, onMessage } = await import("firebase/messaging");
          const app = getFirebaseApp();
          if (!app) return;
          const messaging = getMessaging(app);
          onMessage(messaging, (payload) => {
            // Fallback foreground notification if SW not handling (page in focus)
            if (Notification.permission === "granted" && payload.notification) {
              try {
                new Notification(payload.notification.title ?? "The NonStop", {
                  body: payload.notification.body ?? "",
                  icon: (payload.notification.image as string) ?? "/logos/logo.png",
                });
              } catch {}
            }
          });
        } catch {}
      })();
    }
    // Check existing subscription: FCM token or web-push
    if (ok && Notification.permission === "granted") {
      if (useFcm) {
        (async () => {
          try {
            const { getMessaging, getToken } = await import("firebase/messaging");
            const app = getFirebaseApp();
            if (!app) return;
            const messaging = getMessaging(app);
            // Need SW registration for getToken
            const reg = await navigator.serviceWorker.register("/firebase-messaging-sw.js", { scope: "/" });
            await navigator.serviceWorker.ready;
            const token = await getToken(messaging, { vapidKey: fcmVapidKey, serviceWorkerRegistration: reg });
            setSubscribed(!!token);
          } catch {}
        })();
      } else {
        navigator.serviceWorker.ready
          .then((reg) => reg.pushManager.getSubscription())
          .then((sub) => setSubscribed(!!sub))
          .catch(() => {});
      }
    }
  }, [useFcm, fcmVapidKey]);

  const subscribe = useCallback(async () => {
    if (!supported) throw new Error("Push not supported — use HTTPS or localhost");
    if (useFcm) {
      if (!fcmVapidKey) throw new Error("FCM VAPID key not configured (NEXT_PUBLIC_FCM_VAPID_KEY or NEXT_PUBLIC_VAPID_PUBLIC_KEY)");
      setLoading(true);
      try {
        const perm = await Notification.requestPermission();
        setPermission(perm);
        if (perm !== "granted") throw new Error(`Permission ${perm} — allow notifications in browser settings`);
        if (!isFirebaseConfigured()) throw new Error("Firebase not configured (NEXT_PUBLIC_FIREBASE_* env)");

        const { getMessaging, getToken } = await import("firebase/messaging");
        const app = getFirebaseApp();
        if (!app) throw new Error("Firebase init failed — check env");
        const messaging = getMessaging(app);

        // Register FCM SW (required) — scope "/" so it controls all pages
        const reg = await navigator.serviceWorker.register("/firebase-messaging-sw.js", { scope: "/" });
        await navigator.serviceWorker.ready;

        // getToken handles FID + token via FCM Registration API (auto enables https://console.cloud.google.com/apis/library/fcmregistrations.googleapis.com)
        const token = await getToken(messaging, { vapidKey: fcmVapidKey, serviceWorkerRegistration: reg });
        if (!token) throw new Error("FCM token empty — check Web Push certificate in Firebase Console > Cloud Messaging");

        const res = await fetch("/api/user/push/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fcmToken: token, platform: "web" }),
        });
        if (!res.ok) throw new Error((await res.json()).error ?? "Subscribe failed (server)");
        setSubscribed(true);
        return token as unknown as PushSubscription;
      } finally {
        setLoading(false);
      }
    }

    // Legacy VAPID web-push fallback (kept until FCM fully rolled out)
    if (!vapidPublicKey) throw new Error("VAPID_PUBLIC_KEY not configured (restart dev server after .env change)");
    setLoading(true);
    try {
      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm !== "granted") throw new Error(`Permission ${perm} — allow notifications in browser settings`);

      const reg = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
      await navigator.serviceWorker.ready;
      const existing = await reg.pushManager.getSubscription();
      if (existing) {
        try {
          await existing.unsubscribe();
        } catch {}
        try {
          await fetch("/api/user/push/unsubscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ endpoint: existing.endpoint }),
          });
        } catch {}
        await new Promise((r) => setTimeout(r, 300));
      }

      const decoded = urlBase64ToUint8Array(vapidPublicKey);
      if (decoded.length !== 65) throw new Error(`Bad VAPID key (decoded ${decoded.length} != 65)`);
      if (!isSecureContext) throw new Error("Not a secure context — push requires HTTPS or localhost");

      let sub: PushSubscription;
      try {
        sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: decoded as unknown as ArrayBuffer,
        });
      } catch (err: unknown) {
        const e = err as DOMException;
        console.error("[push] subscribe failed", {
          name: e?.name,
          message: e?.message,
          vapidLen: vapidPublicKey.length,
          permission: Notification.permission,
          supported,
          isSecureContext,
          protocol: location.protocol,
        });
        throw e;
      }

      const rawKey = sub.getKey("p256dh");
      const authKey = sub.getKey("auth");
      if (!rawKey || !authKey) throw new Error("Missing subscription keys (browser bug)");

      const toB64 = (buf: ArrayBuffer) => {
        const bytes = new Uint8Array(buf);
        let binary = "";
        for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
        return btoa(binary);
      };
      const p256dh = toB64(rawKey);
      const auth = toB64(authKey);

      const res = await fetch("/api/user/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint: sub.endpoint, p256dh, auth }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Subscribe failed (server)");
      setSubscribed(true);
      return sub;
    } finally {
      setLoading(false);
    }
  }, [supported, vapidPublicKey, fcmVapidKey, useFcm, permission]);

  const unsubscribe = useCallback(async () => {
    setLoading(true);
    try {
      if (useFcm) {
        let token: string | null = null;
        try {
          const { getMessaging, getToken, deleteToken } = await import("firebase/messaging");
          const app = getFirebaseApp();
          if (app) {
            const messaging = getMessaging(app);
            const reg = await navigator.serviceWorker.ready;
            token = await getToken(messaging, { vapidKey: fcmVapidKey, serviceWorkerRegistration: reg }).catch(() => null);
            await deleteToken(messaging).catch(() => {});
          }
        } catch {}
        if (token) {
          await fetch("/api/user/push/unsubscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fcmToken: token }),
          }).catch(() => {});
        }
      } else {
        const reg = await navigator.serviceWorker.ready;
        const sub = await reg.pushManager.getSubscription();
        if (sub) {
          await fetch("/api/user/push/unsubscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ endpoint: sub.endpoint }),
          });
          await sub.unsubscribe();
        }
      }
      setSubscribed(false);
    } finally {
      setLoading(false);
    }
  }, [useFcm, fcmVapidKey]);

  return { supported, permission, subscribed, loading, subscribe, unsubscribe, vapidConfigured: useFcm ? !!fcmVapidKey : !!vapidPublicKey, provider: useFcm ? "fcm" : "webpush" } as const;
}
