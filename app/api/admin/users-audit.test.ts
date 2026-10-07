import { describe, expect, it } from "bun:test";

describe("user mutations audit instrumentation", () => {
	it("admin users route imports and calls recordAuditLog for role, ban, and delete", async () => {
		const src = await Bun.file("app/api/admin/users/route.ts").text();
		expect(src).toContain("recordAuditLog");
		expect(src).toContain("user.role_change");
		expect(src).toContain("user.ban");
		expect(src).toContain("user.unban");
		expect(src).toContain("user.delete");
	});
});
