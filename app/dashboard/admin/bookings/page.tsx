export const dynamic = "force-dynamic";

import { BookingSettingsForm } from "@/components/admin/booking-settings-form";
import { BookingsAgenda } from "@/components/admin/bookings-agenda";
import { NotificationSettingsForm } from "@/components/admin/notification-settings-form";

export default async function BookingSettingsPage({
	searchParams,
}: {
	searchParams: Promise<{ track?: string }>;
}) {
	const { track } = await searchParams;
	// Each sidebar entry pins its own track — no mixed view.
	const initialTrack = track === "bible-reading" ? "bible-reading" : "worship";

	return (
		<div className="flex-1 space-y-4 p-8 pt-6">
			<div className="grid items-start gap-6 lg:grid-cols-3">
				<div className="lg:col-span-1 space-y-6">
					<BookingSettingsForm />
					<NotificationSettingsForm />
				</div>
				<div className="lg:col-span-2">
					<BookingsAgenda initialTrack={initialTrack} />
				</div>
			</div>
		</div>
	);
}
