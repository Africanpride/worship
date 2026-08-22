export const dynamic = "force-dynamic";

import { BookingSettingsForm } from "@/components/admin/booking-settings-form";

export default function BookingSettingsPage() {
	return (
		<div className="flex-1 space-y-4 p-8 pt-6">
			<BookingSettingsForm />
		</div>
	);
}
