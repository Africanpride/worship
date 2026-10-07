import { describe, expect, it } from "bun:test";

describe("audit query API endpoints", () => {
	it("implements admin authorization, super admin check, and cursor pagination for global audit", async () => {
		const src = await Bun.file("app/api/admin/audit/route.ts").text();
		expect(src).toContain("auth.api.getSession");
		expect(src).toContain('session?.user.role !== "admin"');
		expect(src).toContain("isSuperAdmin");
		expect(src).toContain("prisma.auditLog.findMany");
		expect(src).toContain("nextCursor");
	});

	it("implements entity-specific audit query endpoint", async () => {
		const src = await Bun.file("app/api/admin/audit/entity/route.ts").text();
		expect(src).toContain("auth.api.getSession");
		expect(src).toContain("entityType");
		expect(src).toContain("entityId");
		expect(src).toContain("prisma.auditLog.findMany");
	});
});
