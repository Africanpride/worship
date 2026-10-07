export const dynamic = "force-dynamic";

import { AuditLogConsole } from "@/components/admin/audit-log-console";

export default function AuditTrailPage() {
	return (
		<div className="flex-1 space-y-4">
			<AuditLogConsole />
		</div>
	);
}
