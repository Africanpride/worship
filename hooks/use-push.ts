"use client";

import { useCallback, useEffect, useState } from "react";

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

	useEffect(() => {
		const ok = "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
		setSupported(ok);
		if (ok) setPermission(Notification.permission);
		// Check existing subscription best-effort
		if (ok && Notification.permission === "granted") {
			navigator.serviceWorker.ready
				.then((reg) => reg.pushManager.getSubscription())
				.then((sub) => setSubscribed(!!sub))
				.catch(() => {});
		}
	}, []);

	const subscribe = useCallback(async () => {
		if (!supported) throw new Error("Push not supported");
		if (!vapidPublicKey) throw new Error("VAPID_PUBLIC_KEY not configured");
		setLoading(true);
		try {
			const perm = await Notification.requestPermission();
			setPermission(perm);
			if (perm !== "granted") throw new Error("Permission denied");

			const reg = await navigator.serviceWorker.register("/sw.js");
			await navigator.serviceWorker.ready;
			const sub = await reg.pushManager.subscribe({
				userVisibleOnly: true,
				applicationServerKey: urlBase64ToUint8Array(vapidPublicKey) as unknown as ArrayBuffer,
			});

			const rawKey = sub.getKey("p256dh");
			const authKey = sub.getKey("auth");
			if (!rawKey || !authKey) throw new Error("Missing subscription keys");

			const p256dh = btoa(String.fromCharCode(...new Uint8Array(rawKey)));
			const auth = btoa(String.fromCharCode(...new Uint8Array(authKey)));

			const res = await fetch("/api/user/push/subscribe", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ endpoint: sub.endpoint, p256dh, auth }),
			});
			if (!res.ok) throw new Error((await res.json()).error ?? "Subscribe failed");
			setSubscribed(true);
			return sub;
		} finally {
			setLoading(false);
		}
	}, [supported, vapidPublicKey]);

	const unsubscribe = useCallback(async () => {
		setLoading(true);
		try {
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
			setSubscribed(false);
		} finally {
			setLoading(false);
		}
	}, []);

	return { supported, permission, subscribed, loading, subscribe, unsubscribe, vapidConfigured: !!vapidPublicKey };
}
