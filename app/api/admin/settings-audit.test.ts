import { describe, expect, it } from "bun:test";

describe("settings audit instrumentation", () => {
	it("booking settings route records settings.booking_update", async () => {
		const src = await Bun.file(
			"app/api/admin/booking-settings/route.ts",
		).text();
		expect(src).toContain("recordAuditLog");
		expect(src).toContain("settings.booking_update");
	});

	it("hero settings route records settings.hero_update", async () => {
		const src = await Bun.file("app/api/admin/hero/route.ts").text();
		expect(src).toContain("recordAuditLog");
		expect(src).toContain("settings.hero_update");
	});

	it("notification settings route records settings.notification_update", async () => {
		const src = await Bun.file(
			"app/api/admin/notification-settings/route.ts",
		).text();
		expect(src).toContain("recordAuditLog");
		expect(src).toContain("settings.notification_update");
	});
});
