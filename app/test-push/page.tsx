"use client";

import { useState } from "react";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
	const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
	const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
	const rawData = atob(base64);
	const outputArray = new Uint8Array(rawData.length);
	for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
	return outputArray;
}

export default function TestPushPage() {
	const [log, setLog] = useState<string[]>([]);
	const [vapid] = useState(() => process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "");

	const add = (s: string) => setLog((l) => [...l, `${new Date().toLocaleTimeString()} ${s}`]);

	const run = async () => {
		setLog([]);
		add(`href=${location.href} isSecureContext=${isSecureContext} protocol=${location.protocol} hostname=${location.hostname}`);
		add(`vapid len=${vapid.length} prefix=${vapid.slice(0, 8)} supported=${"serviceWorker" in navigator && "PushManager" in window}`);
		add(`permission=${Notification.permission}`);
		try {
			const swHead = await fetch("/sw.js", { method: "HEAD" });
			add(`sw.js HEAD ${swHead.status} ${swHead.headers.get("content-type")}`);
		} catch (e) {
			add(`sw.js fetch failed ${String(e)}`);
		}
		try {
			const reg = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
			add(`register scope=${reg.scope} active=${reg.active?.state} waiting=${!!reg.waiting}`);
			await navigator.serviceWorker.ready;
			add(`ready active=${reg.active?.state} controller=${!!navigator.serviceWorker.controller}`);
			const existing = await reg.pushManager.getSubscription();
			add(`existing=${!!existing} endpoint=${existing?.endpoint.slice(0, 30) ?? "none"}`);
			if (existing) {
				await existing.unsubscribe();
				add(`unsubscribed existing`);
				await new Promise((r) => setTimeout(r, 300));
			}
			const decoded = urlBase64ToUint8Array(vapid);
			add(`decoded len=${decoded.length} ${decoded.length === 65 ? "OK" : "FAIL"}`);
			const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: decoded as unknown as ArrayBuffer });
			add(`subscribed endpoint=${sub.endpoint.slice(0, 40)}...`);
			const rawKey = sub.getKey("p256dh");
			add(`p256dh len=${rawKey?.byteLength} auth len=${sub.getKey("auth")?.byteLength}`);
			add("SUCCESS");
		} catch (e) {
			const err = e as DOMException;
			add(`FAIL ${err.name}: ${err.message}`);
			console.error("[test-push] fail", e);
		}
	};

	return (
		<div className="max-w-2xl mx-auto p-6 space-y-4">
			<h1 className="text-lg font-bold">Push Diagnostic — /test-push</h1>
			<p className="text-xs text-muted-foreground">Run on http://localhost:3000/test-push, not http://127.0.0.1:3000/test-push or http://&lt;lan-ip&gt;:3000 (isSecureContext must be true).</p>
			<button onClick={run} className="px-4 py-2 rounded bg-primary text-primary-foreground text-sm cursor-pointer">
				Run push subscribe test
			</button>
			<pre className="bg-muted p-3 rounded text-xs whitespace-pre-wrap break-all border max-h-96 overflow-auto">{log.join("\n") || "idle"}</pre>
			<p className="text-xs text-muted-foreground">Also check chrome://serviceworker-internals and chrome://gcm-internals. Try incognito + allow notifications. Brave/Firefox private may block push.</p>
		</div>
	);
}
