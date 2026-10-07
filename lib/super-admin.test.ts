import { describe, expect, it } from "bun:test";
import { getSuperAdminEmails, isSuperAdmin } from "./super-admin";

describe("super-admin helper", () => {
	it("identifies super admins from SUPER_ADMIN_EMAILS env", () => {
		process.env.SUPER_ADMIN_EMAILS = "owner@test.com, admin@test.com ";

		expect(isSuperAdmin({ email: "owner@test.com" })).toBe(true);
		expect(isSuperAdmin({ email: "ADMIN@TEST.COM" })).toBe(true);
		expect(isSuperAdmin({ email: "other@test.com" })).toBe(false);
		expect(isSuperAdmin(null)).toBe(false);
		expect(isSuperAdmin({})).toBe(false);
	});

	it("falls back to ADMIN_EMAIL when SUPER_ADMIN_EMAILS is empty", () => {
		delete process.env.SUPER_ADMIN_EMAILS;
		delete process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAILS;
		process.env.ADMIN_EMAIL = "sole-admin@test.com";

		expect(isSuperAdmin({ email: "sole-admin@test.com" })).toBe(true);
		expect(isSuperAdmin({ email: "other@test.com" })).toBe(false);
	});

	it("parses email lists accurately", () => {
		process.env.SUPER_ADMIN_EMAILS = "  First@test.com, SECOND@test.com, ";
		const emails = getSuperAdminEmails();
		expect(emails).toEqual(["first@test.com", "second@test.com"]);
	});
});
