import { describe, expect, it } from "bun:test";

describe("slot mutation audit instrumentation", () => {
	it("slot assign route records audit log with correct action types", async () => {
		const src = await Bun.file(
			"app/api/admin/slots/[slotId]/assign/route.ts",
		).text();
		expect(src).toContain("recordAuditLog");
		expect(src).toContain("slot.assign");
		expect(src).toContain("slot.reassign");
		expect(src).toContain("slot.clear");
	});

	it("slot block route records audit log with block and unblock", async () => {
		const src = await Bun.file(
			"app/api/admin/slots/[slotId]/block/route.ts",
		).text();
		expect(src).toContain("recordAuditLog");
		expect(src).toContain("slot.block");
		expect(src).toContain("slot.unblock");
	});

	it("slot batch route records audit log with slot.batch_action", async () => {
		const src = await Bun.file("app/api/admin/slots/batch/route.ts").text();
		expect(src).toContain("recordAuditLog");
		expect(src).toContain("slot.batch_action");
	});
});
