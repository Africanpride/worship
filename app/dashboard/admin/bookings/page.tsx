export const dynamic = "force-dynamic";

import { BookingSettingsForm } from "@/components/admin/booking-settings-form";
import { BookingsAgenda } from "@/components/admin/bookings-agenda";

export default function BookingSettingsPage() {
	return (
		<div className="flex-1 space-y-4 p-8 pt-6">
			<div className="flex items-center justify-between mb-8">
				<div>
					<h1 className="text-3xl">Bookings &amp; Slots</h1>
					<p className="text-muted-foreground">Manage booking slots and scheduling settings.</p>
				</div>
			</div>
			<div className="grid items-start gap-6 lg:grid-cols-3">
				<div className="lg:col-span-1">
					<BookingSettingsForm />
				</div>
				<div className="lg:col-span-2">
					<BookingsAgenda />
				</div>
			</div>
		</div>
	);
}
