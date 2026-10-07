export const dynamic = "force-dynamic";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AuditLogConsole } from "@/components/admin/audit-log-console";
import { auth } from "@/lib/auth";
import { isSuperAdmin } from "@/lib/super-admin";

export default async function AuditTrailPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session || !isSuperAdmin(session.user)) {
		redirect("/dashboard");
	}

	return (
		<div className="flex-1 space-y-4">
			<AuditLogConsole />
		</div>
	);
}
