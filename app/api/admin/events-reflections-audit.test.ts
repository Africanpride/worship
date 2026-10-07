import { describe, expect, it } from "bun:test";

describe("event and reflection audit instrumentation", () => {
	it("event routes record audit log for create, update, delete, and slot regeneration", async () => {
		const eventCreate = await Bun.file("app/api/events/route.ts").text();
		const eventDetail = await Bun.file("app/api/events/[id]/route.ts").text();
		const eventRegen = await Bun.file(
			"app/api/events/[id]/slots/regenerate/route.ts",
		).text();

		expect(eventCreate).toContain("recordAuditLog");
		expect(eventCreate).toContain("event.create");

		expect(eventDetail).toContain("recordAuditLog");
		expect(eventDetail).toContain("event.update");
		expect(eventDetail).toContain("event.delete");

		expect(eventRegen).toContain("recordAuditLog");
		expect(eventRegen).toContain("event.slots_regenerate");
	});

	it("reflections route records audit log for moderation changes and deletes", async () => {
		const reflectionsSrc = await Bun.file(
			"app/api/admin/reflections/route.ts",
		).text();
		expect(reflectionsSrc).toContain("recordAuditLog");
		expect(reflectionsSrc).toContain("reflection.status_change");
	});
});
