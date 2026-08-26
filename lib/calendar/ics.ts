// ICS calendar generation for worship slots
// Extracted from app/api/user/slots/ics/route.ts — shared by download + token feed

export type IcsSlot = {
	id: string;
	startTime: Date;
	endTime: Date;
	track: string;
	updatedAt?: Date;
	event: { title: string; location: string | null };
};

export function icsDate(d: Date): string {
	return `${d.toISOString().replace(/[-:]/g, "").split(".")[0]}Z`;
}

export function escapeIcs(text: string): string {
	return text
		.replace(/\\/g, "\\\\")
		.replace(/;/g, "\\;")
		.replace(/,/g, "\\,")
		.replace(/\n/g, "\\n");
}

function trackLabelFor(track: string): string {
	return track === "bible-reading" ? "Bible Reading" : "Worship";
}

/**
 * Build VCALENDAR lines for a set of slots.
 * @param userName calendar owner display name
 * @param slots upcoming booked slots
 * @param reminderOffsets minutes before start for VALARM (e.g. [1440,60,30])
 */
export function buildVCalendar(
	userName: string,
	slots: IcsSlot[],
	reminderOffsets: number[] = [1440, 60],
): string[] {
	const lines = [
		"BEGIN:VCALENDAR",
		"VERSION:2.0",
		"PRODID:-//The NonStop Series//Bookings//EN",
		"CALSCALE:GREGORIAN",
		"METHOD:PUBLISH",
		`X-WR-CALNAME:${escapeIcs(`Worship Slots — ${userName}`)}`,
		"X-PUBLISHED-TTL:PT1H",
		"REFRESH-INTERVAL;VALUE=DURATION:PT1H",
	];

	const dtstamp = icsDate(new Date());

	for (const slot of slots) {
		const trackLabel = trackLabelFor(slot.track);
		const seq = slot.updatedAt
			? Math.floor(slot.updatedAt.getTime() / 1000)
			: 0;
		const lastModified = slot.updatedAt ? icsDate(slot.updatedAt) : dtstamp;

		lines.push(
			"BEGIN:VEVENT",
			`UID:${slot.id}@thenonstop.org`,
			`DTSTAMP:${dtstamp}`,
			`LAST-MODIFIED:${lastModified}`,
			`SEQUENCE:${seq}`,
			`DTSTART:${icsDate(slot.startTime)}`,
			`DTEND:${icsDate(slot.endTime)}`,
			`SUMMARY:${escapeIcs(`${trackLabel} — ${slot.event.title}`)}`,
			`LOCATION:${escapeIcs(slot.event.location ?? "")}`,
			`DESCRIPTION:${escapeIcs(
				`Your ${trackLabel.toLowerCase()} hour for ${slot.event.title}. Manage it at https://thenonstop.org/dashboard/events`,
			)}`,
		);

		for (const offset of reminderOffsets) {
			// VALARM TRIGGER is negative duration before start
			lines.push(
				"BEGIN:VALARM",
				`TRIGGER:-PT${offset}M`,
				"ACTION:DISPLAY",
				`DESCRIPTION:${escapeIcs(`Reminder: ${trackLabel} — ${slot.event.title} in ${offset} minutes`)}`,
				"END:VALARM",
			);
		}

		lines.push("END:VEVENT");
	}

	lines.push("END:VCALENDAR");
	return lines;
}

export function buildIcsContent(
	userName: string,
	slots: IcsSlot[],
	reminderOffsets?: number[],
): string {
	return buildVCalendar(userName, slots, reminderOffsets).join("\r\n");
}
