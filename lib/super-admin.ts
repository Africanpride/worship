/**
 * Super Admin authorization helper.
 * Super admins have exclusive access to high-sensitivity administrative views
 * such as the unified Audit Trail (/dashboard/admin/audit).
 */

export function getSuperAdminEmails(): string[] {
	const raw =
		process.env.SUPER_ADMIN_EMAILS ||
		process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAILS ||
		process.env.ADMIN_EMAIL ||
		"";

	return raw
		.split(",")
		.map((e) => e.trim().toLowerCase())
		.filter(Boolean);
}

export function isSuperAdmin(
	user?: { email?: string | null; role?: string | null } | null,
): boolean {
	if (!user?.email) return false;
	const allowed = getSuperAdminEmails();
	return allowed.includes(user.email.trim().toLowerCase());
}
