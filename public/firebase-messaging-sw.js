// FCM background handler — keep empty if foreground only, but required at domain root for FCM JS SDK (https://firebase.google.com/docs/cloud-messaging/js/receive#handle_background_messages)
importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js");

// Firebase config injected via query param or falls back to fetch — for SW we use minimal init via global; actual config comes from client getToken registration.
// If you serve this file, add your config here or let the SDK use the auto-initialized app via `firebase.initializeApp` in the page (FCM will still use this SW for background).
self.addEventListener("push", (event) => {
  // FCM compat already handles data messages; this fallback ensures icon/badge consistent with public/sw.js
  let data = { title: "The NonStop", body: "", url: "/profile", icon: "/logos/logo.png", badge: "/logos/logo.png" };
  try {
    if (event.data) {
      const json = event.data.json();
      // FCM sends { notification: {title,body,image}, data: {url}, fcmOptions: {link}, webpush: {notification:{icon,badge}} }
      if (json.notification) data = { ...data, title: json.notification.title ?? data.title, body: json.notification.body ?? data.body, icon: json.notification.image ?? data.icon };
      if (json.data?.url) data.url = json.data.url;
      if (json.webpush?.notification?.icon) data.icon = json.webpush.notification.icon;
      if (json.fcmOptions?.link) data.url = json.fcmOptions.link;
      // Also support legacy flat payload from lib/notify/push.ts
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
      const allClients = await clients.matchAll({ type: "window", includeUncontrolled: true });
      for (const c of allClients) {
        if (c.url.includes(self.location.origin) && "focus" in c) return c.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })(),
  );
});
