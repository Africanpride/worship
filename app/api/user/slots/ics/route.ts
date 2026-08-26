import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { buildVCalendar } from "@/lib/calendar/ics";
import { prisma } from "@/lib/prisma";

// GET /api/user/slots/ics
// A single VCALENDAR with every upcoming booked hour — one click adds all.
export async function GET(req: NextRequest) {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session || session.user.banned) {
		return new NextResponse("Unauthorized", { status: 401 });
	}

	const [slots, settings] = await Promise.all([
		prisma.eventSlot.findMany({
			where: {
				assignedUserId: session.user.id,
				status: "booked",
				startTime: { gt: new Date() },
			},
			orderBy: { startTime: "asc" },
			include: {
				event: { select: { title: true, location: true } },
			},
		}),
		prisma.adminNotificationSettings.findUnique({
			where: { singleton: "singleton" },
			select: { reminderOffsets: true },
		}),
	]);

	const offsets = settings?.reminderOffsets ?? [1440, 60];

	const lines = buildVCalendar(
		session.user.name ?? session.user.email,
		slots.map((s) => ({
			id: s.id,
			startTime: s.startTime,
			endTime: s.endTime,
			track: s.track,
			updatedAt: s.updatedAt,
			event: s.event,
		})),
		offsets,
	);

	const stamp = new Date().toISOString().slice(0, 10);
	return new NextResponse(lines.join("\r\n"), {
		headers: {
			"Content-Type": "text/calendar; charset=utf-8",
			"Content-Disposition": `attachment; filename="my-worship-slots-${stamp}.ics"`,
			"Cache-Control": "private, max-age=300",
			"X-Robots-Tag": "noindex",
		},
	});
}
