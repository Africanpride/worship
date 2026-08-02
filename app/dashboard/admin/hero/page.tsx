export const dynamic = "force-dynamic";

import { HeroManagement } from "@/components/admin/hero-management";

export default function HeroSettingsPage() {
	return (
		<div className="flex-1 space-y-4 p-8 pt-6">
			<HeroManagement />
		</div>
	);
}
