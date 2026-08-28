import { describe, expect, it, mock } from "bun:test";

mock.module("server-only", () => ({}));

describe("toChatId", () => {
	it("strips + and appends @c.us", async () => {
		const { toChatId } = await import("./whatsapp");
		expect(toChatId("+1 (555) 123-4567")).toBe("15551234567@c.us");
	});
});

describe("truncateWa", () => {
	it("caps at 4096-ish but truncates long", async () => {
		const { truncateWa } = await import("./whatsapp");
		expect(truncateWa("a".repeat(5000)).length).toBeLessThan(4097);
	});
});
