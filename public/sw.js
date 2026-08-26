self.addEventListener("push", (event) => {
	let data = { title: "The NonStop", body: "", url: "/dashboard/events" };
	try {
		if (event.data) data = { ...data, ...event.data.json() };
	} catch (_) {}
	event.waitUntil(
		self.registration.showNotification(data.title, {
			body: data.body,
			icon: "/favicon.ico",
			badge: "/favicon.ico",
			data: { url: data.url },
		}),
	);
});

self.addEventListener("notificationclick", (event) => {
	event.notification.close();
	const url = event.notification.data?.url ?? "/dashboard/events";
	event.waitUntil(
		(async () => {
			const allClients = await clients.matchAll({ type: "window", includeUncontrolled: true });
			for (const c of allClients) {
				if (c.url.includes(self.location.origin) && "focus" in c) return c.focus();
			}
			if (clients.openWindow) return clients.openWindow(url);
		})(),
	);
});
