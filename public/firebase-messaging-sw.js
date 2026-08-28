// FCM background handler — served from domain root for FCM JS SDK
// Resilient version: importScripts is wrapped so CSP/offline never causes "ServiceWorker script evaluation failed"

// Try to load Firebase compat SDKs — failure is non-fatal (fallback push handler below still works)
try {
	importScripts(
		"https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js",
	);
	importScripts(
		"https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js",
	);
} catch (e) {
	// CSP or network may block gstatic; SW still usable for our own push payloads
	console.warn("[sw] firebase compat load skipped", e);
}

// If compat loaded, initialize Firebase for FCM background messages.
// Config is public (NEXT_PUBLIC_*) — keep in sync with .env
try {
	// eslint-disable-next-line no-undef
	if (typeof firebase !== "undefined" && firebase.initializeApp) {
		const fbConfig = {
			apiKey: "AIzaSyAasRP5yxXrInp_jJ-PpwA3JQpao6RGWrk",
			authDomain: "the-non-stop-series.firebaseapp.com",
			projectId: "the-non-stop-series",
			storageBucket: "the-non-stop-series.firebasestorage.app",
			messagingSenderId: "884343548336",
			appId: "1:884343548336:web:1bcd6037f3122e4ba00e75",
			measurementId: "G-P7JD6M1S02",
		};
		if (!firebase.apps.length) firebase.initializeApp(fbConfig);
		// Background message handler for FCM `notification` messages (data messages go via `push` event below)
		const messaging = firebase.messaging();
		messaging.onBackgroundMessage((payload) => {
			const title = payload.notification?.title ?? payload.data?.title ?? "The NonStop";
			const body = payload.notification?.body ?? payload.data?.body ?? "";
			const url = payload.data?.url ?? payload.fcmOptions?.link ?? "/profile";
			const icon = payload.notification?.image ?? payload.data?.icon ?? "/logos/logo.png";
			self.registration.showNotification(title, {
				body,
				icon,
				badge: "/logos/logo.png",
				data: { url },
			});
		});
	}
} catch (e) {
	console.warn("[sw] firebase init skipped", e);
}

// Fallback / unified push handler — works for both FCM data messages and our legacy web-push payloads
self.addEventListener("push", (event) => {
	let data = {
		title: "The NonStop",
		body: "",
		url: "/profile",
		icon: "/logos/logo.png",
		badge: "/logos/logo.png",
	};
	try {
		if (event.data) {
			const json = event.data.json();
			// FCM shapes: { notification: {title,body,image}, data: {url}, fcmOptions: {link}, webpush: {notification:{icon,badge}} }
			if (json.notification)
				data = {
					...data,
					title: json.notification.title ?? data.title,
					body: json.notification.body ?? data.body,
					icon: json.notification.image ?? data.icon,
				};
			if (json.data?.url) data.url = json.data.url;
			if (json.webpush?.notification?.icon) data.icon = json.webpush.notification.icon;
			if (json.fcmOptions?.link) data.url = json.fcmOptions.link;
			// Legacy flat payload from lib/notify/push.ts / firebase-admin
			if (json.title) data.title = json.title;
			if (json.body) data.body = json.body;
			if (json.url) data.url = json.url;
			if (json.icon) data.icon = json.icon;
			if (json.badge) data.badge = json.badge;
		}
	} catch {}
	event.waitUntil(
		self.registration.showNotification(data.title, {
			body: data.body,
			icon: data.icon || "/logos/logo.png",
			badge: data.badge || "/logos/logo.png",
			data: { url: data.url },
		}),
	);
});

self.addEventListener("notificationclick", (event) => {
	event.notification.close();
	const url = event.notification.data?.url ?? "/profile";
	event.waitUntil(
		(async () => {
			const allClients = await clients.matchAll({
				type: "window",
				includeUncontrolled: true,
			});
			for (const c of allClients) {
				if (c.url.includes(self.location.origin) && "focus" in c)
					return c.focus();
			}
			if (clients.openWindow) return clients.openWindow(url);
		})(),
	);
});
