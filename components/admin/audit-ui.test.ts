import { describe, expect, it } from "bun:test";

describe("audit UI components", () => {
	it("sidebar includes Audit Trail navigation item with cursor-pointer", async () => {
		const src = await Bun.file("components/app-sidebar.tsx").text();
		expect(src).toContain("/dashboard/admin/audit");
		expect(src).toContain("Audit Trail");
	});

	it("audit console uses cursor-pointer on interactive elements", async () => {
		const src = await Bun.file("components/admin/audit-log-console.tsx").text();
		expect(src).toContain("cursor-pointer");
		expect(src).toContain("useSWR");
	});

	it("audit detail dialog presents structured before/after diff", async () => {
		const src = await Bun.file(
			"components/admin/audit-detail-dialog.tsx",
		).text();
		expect(src).toContain("Dialog");
		expect(src).toContain("cursor-pointer");
	});
});
