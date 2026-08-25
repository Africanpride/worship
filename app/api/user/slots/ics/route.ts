import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function icsDate(d: Date): string {
	return `${d.toISOString().replace(/[-:]/g, "").split(".")[0]}Z`;
}

function escapeIcs(text: string): string {
	return text
		.replace(/\\/g, "\\\\")
		.replace(/;/g, "\\;")
		.replace(/,/g, "\\,")
		.replace(/\n/g, "\\n");
}

// GET /api/user/slots/ics
// A single VCALENDAR with every upcoming booked hour — one click adds all.
export async function GET(req: NextRequest) {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session || session.user.banned) {
		return new NextResponse("Unauthorized", { status: 401 });
	}

	const slots = await prisma.eventSlot.findMany({
		where: {
			assignedUserId: session.user.id,
			status: "booked",
			startTime: { gt: new Date() },
		},
		orderBy: { startTime: "asc" },
		include: {
			event: { select: { title: true, location: true } },
		},
	});

	const lines = [
		"BEGIN:VCALENDAR",
		"VERSION:2.0",
		"PRODID:-//The NonStop Series//Bookings//EN",
		"CALSCALE:GREGORIAN",
		"METHOD:PUBLISH",
		`X-WR-CALNAME:${escapeIcs(`Worship Slots — ${session.user.name}`)}`,
	];

	for (const slot of slots) {
		const trackLabel =
			slot.track === "bible-reading" ? "Bible Reading" : "Worship";
		lines.push(
			"BEGIN:VEVENT",
			`UID:${slot.id}@thenonstop.org`,
			`DTSTAMP:${icsDate(new Date())}`,
			`DTSTART:${icsDate(slot.startTime)}`,
			`DTEND:${icsDate(slot.endTime)}`,
			`SUMMARY:${escapeIcs(`${trackLabel} — ${slot.event.title}`)}`,
			`LOCATION:${escapeIcs(slot.event.location ?? "")}`,
			`DESCRIPTION:${escapeIcs(
				`Your ${trackLabel.toLowerCase()} hour for ${slot.event.title}. Manage it at https://thenonstop.org/dashboard/events`,
			)}`,
			"END:VEVENT",
		);
	}
	lines.push("END:VCALENDAR");

	const stamp = new Date().toISOString().slice(0, 10);
	return new NextResponse(lines.join("\r\n"), {
		headers: {
			"Content-Type": "text/calendar; charset=utf-8",
			"Content-Disposition": `attachment; filename="my-worship-slots-${stamp}.ics"`,
		},
	});
}
