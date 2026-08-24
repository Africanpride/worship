export const dynamic = "force-dynamic";

import { LogsConsole } from "@/components/admin/logs-console";

export default function ApplicationLogsPage() {
	return (
		<div className="flex-1 space-y-4 p-4 md:p-6">
			<LogsConsole />
		</div>
	);
}
