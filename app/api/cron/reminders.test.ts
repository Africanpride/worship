import { describe, expect, it } from "bun:test";

describe("channelForOffset whatsapp", () => {
	it("maps <=30 to whatsapp only", async () => {
		const src = await Bun.file("app/api/cron/reminders/route.ts").text();
		expect(src).toContain('"whatsapp"');
		expect(src).toContain("channelForOffset");
		expect(src.match(/return \["whatsapp"\]/)).toBeTruthy();
		expect(src).not.toContain('"sms"');
	});
});
