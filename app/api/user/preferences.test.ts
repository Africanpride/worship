import { describe, expect, it } from "bun:test";

describe("user preferences whatsapp", () => {
	it("pref route and ui use whatsappReminders", async () => {
		const a = await Bun.file("app/api/user/preferences/route.ts").text();
		const b = await Bun.file(
			"components/profile-page/components/notification-preferences.tsx",
		).text();
		expect(a).toContain("whatsappReminders");
		expect(a).not.toContain("smsReminders");
		expect(b).toContain("WhatsApp");
		expect(b).not.toContain("SMS Reminders");
	});
});
