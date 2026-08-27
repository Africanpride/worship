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
		if (!supported) throw new Error("Push not supported — use HTTPS or localhost");
		if (!vapidPublicKey) throw new Error("VAPID_PUBLIC_KEY not configured (restart dev server after .env change)");
		setLoading(true);
		try {
			const perm = await Notification.requestPermission();
			setPermission(perm);
			if (perm !== "granted") throw new Error(`Permission ${perm} — allow notifications in browser settings`);

			// Ensure service worker is registered at root scope; update if already present
			const reg = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
			await navigator.serviceWorker.ready;
			// Clear stale subscription from a previous VAPID key — common cause of "push service error"
			const existing = await reg.pushManager.getSubscription();
			if (existing) {
				try {
					await existing.unsubscribe();
				} catch {}
				// Also clear server copy best-effort
				try {
					await fetch("/api/user/push/unsubscribe", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ endpoint: existing.endpoint }),
					});
				} catch {}
				// Push service needs a tick to release the old subscription
				await new Promise((r) => setTimeout(r, 300));
			}

			// Verbose diagnostic before subscribe (Phase 1 evidence) — check SW file reachable
			try {
				const swRes = await fetch("/sw.js", { method: "HEAD" });
				console.log("[push] sw.js HEAD", swRes.status, swRes.headers.get("content-type"));
			} catch (e) {
				console.warn("[push] sw.js fetch failed", e);
			}
			console.log("[push] diag", {
				isSecureContext,
				protocol: location.protocol,
				hostname: location.hostname,
				href: location.href,
				permission: Notification.permission,
				supported,
				vapidLen: vapidPublicKey.length,
				vapidPrefix: vapidPublicKey.slice(0, 8),
				regScope: reg.scope,
				regActive: reg.active?.state ?? null,
				regWaiting: !!reg.waiting,
				regInstalling: !!reg.installing,
				controller: !!navigator.serviceWorker.controller,
			});
			const decoded = urlBase64ToUint8Array(vapidPublicKey);
			console.log("[push] applicationServerKey decoded len", decoded.length, decoded.length === 65 ? "OK" : "FAIL");
			if (!isSecureContext) throw new Error(`Not a secure context — push requires HTTPS or localhost (protocol:${location.protocol} host:${location.hostname})`);
			if (location.protocol === "http:" && !/^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname)) {
				console.warn("[push] http non-localhost may be treated as insecure despite isSecureContext true");
			}

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
					stack: (e as Error)?.stack?.slice(0, 500),
					vapidLen: vapidPublicKey.length,
					vapidConfigured: !!vapidPublicKey,
					permission: Notification.permission,
					supported,
					isSecureContext,
					protocol: location.protocol,
					hostname: location.hostname,
					decodedLen: decoded.length,
					regScope: reg.scope,
					regActive: reg.active?.state ?? null,
				});
				throw new Error(`${e?.name ?? "PushError"}: ${e?.message ?? String(err)} — ${location.protocol}//${location.hostname} isSecureContext:${isSecureContext} decodedLen:${decoded.length} reg:${reg.scope}`);
			}

			const rawKey = sub.getKey("p256dh");
			const authKey = sub.getKey("auth");
			if (!rawKey || !authKey) throw new Error("Missing subscription keys (browser bug)");

			// Avoid spread on large buffers — use loop for btoa
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
	}, [supported, vapidPublicKey, permission]);

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
