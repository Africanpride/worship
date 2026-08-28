import { describe, expect, it } from "bun:test";

describe("admin notification-settings whatsapp", () => {
	it("schema expects whatsappEnabled not smsEnabled", async () => {
		const src = await Bun.file(
			"app/api/admin/notification-settings/route.ts",
		).text();
		expect(src).toContain("whatsappEnabled");
		expect(src).not.toMatch(/smsEnabled/);
	});
});
