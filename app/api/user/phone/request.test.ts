import { describe, expect, it } from "bun:test";

describe("phone request via whatsapp", () => {
	it("imports sendWhatsappOtp not sendOtpSms", async () => {
		const src = await Bun.file("app/api/user/phone/request/route.ts").text();
		expect(src).toContain("sendWhatsappOtp");
		expect(src).not.toContain("sendOtpSms");
	});
});
