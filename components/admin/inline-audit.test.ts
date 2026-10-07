import { describe, expect, it } from "bun:test";

describe("inline audit integration", () => {
	it("slot history dialog queries and integrates unified audit trail", async () => {
		const src = await Bun.file(
			"components/admin/slot-history-dialog.tsx",
		).text();
		expect(src).toContain("/api/admin/audit/entity");
	});

	it("user management includes an audit history trigger with cursor-pointer", async () => {
		const src = await Bun.file("components/admin/user-management.tsx").text();
		expect(src).toContain("Audit History");
		expect(src).toContain("cursor-pointer");
	});
});
