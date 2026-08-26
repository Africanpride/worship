import { type NextRequest, NextResponse } from "next/server";
import { buildVCalendar } from "@/lib/calendar/ics";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/calendar/[token]/ics — subscribable feed, no auth (token is the secret)
export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ token: string }> },
) {
	const { token } = await params;

	if (!token || token.length < 10) {
		return new NextResponse("Not found", { status: 404 });
	}

	const calToken = await prisma.calendarToken.findUnique({
		where: { token },
		include: { user: { select: { name: true, email: true } } },
	});

	if (!calToken || calToken.revokedAt) {
		return new NextResponse("Not found", { status: 404 });
	}

	// Touch lastAccessedAt best-effort (don't await blocking)
	prisma.calendarToken
		.update({
			where: { id: calToken.id },
			data: { lastAccessedAt: new Date() },
		})
		.catch(() => {});

	const [slots, settings] = await Promise.all([
		prisma.eventSlot.findMany({
			where: {
				assignedUserId: calToken.userId,
				status: "booked",
				// Include 1 day back for clients that ignore TTL
				startTime: { gt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
			},
			orderBy: { startTime: "asc" },
			include: { event: { select: { title: true, location: true } } },
		}),
		prisma.adminNotificationSettings.findUnique({
			where: { singleton: "singleton" },
			select: { reminderOffsets: true },
		}),
	]);

	// Only future slots in feed (past window kept for debugging only)
	const upcoming = slots.filter(
		(s) => s.startTime.getTime() > Date.now() - 24 * 60 * 60 * 1000,
	);
	const offsets = settings?.reminderOffsets ?? [1440, 60];

	const lines = buildVCalendar(
		calToken.user.name ?? calToken.user.email,
		upcoming.map((s) => ({
			id: s.id,
			startTime: s.startTime,
			endTime: s.endTime,
			track: s.track,
			updatedAt: s.updatedAt,
			event: s.event,
		})),
		offsets,
	);

	// Filter to only future for actual feed
	const futureOnly = upcoming.filter((s) => s.startTime.getTime() > Date.now());
	const futureLines =
		futureOnly.length === upcoming.length
			? lines
			: buildVCalendar(
					calToken.user.name ?? calToken.user.email,
					futureOnly.map((s) => ({
						id: s.id,
						startTime: s.startTime,
						endTime: s.endTime,
						track: s.track,
						updatedAt: s.updatedAt,
						event: s.event,
					})),
					offsets,
				);

	return new NextResponse(futureLines.join("\r\n"), {
		headers: {
			"Content-Type": "text/calendar; charset=utf-8",
			"Content-Disposition": 'inline; filename="worship.ics"',
			"Cache-Control": "private, max-age=300",
			"X-Robots-Tag": "noindex",
		},
	});
}
