import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { log } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { withDbRetry } from "@/lib/with-db-retry";

// GET /api/admin/slots/agenda?days=30&eventId=...&status=all
// Admin command-center view: worship hours across events, with booker identities
// (never redacted for admins), event filtering, and time horizon controls.
export async function GET(req: NextRequest) {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (session?.user.role !== "admin" || session.user.banned) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { searchParams } = new URL(req.url);
		const eventId = searchParams.get("eventId") || undefined;
		const timeframe =
			searchParams.get("timeframe") || searchParams.get("days") || "all";
		const status = searchParams.get("status") || "all";

		const now = new Date();
		const whereClause: Record<string, unknown> = {};

		if (eventId && eventId !== "all") {
			whereClause.eventId = eventId;
		}

		if (status && status !== "all") {
			whereClause.status = status;
		}

		// Calculate date window based on timeframe
		if (timeframe !== "all") {
			const parsedDays = Number.parseInt(timeframe.replace("d", ""), 10);
			const days = Number.isInteger(parsedDays) ? Math.max(parsedDays, 1) : 30;

			const windowStart = new Date(now);
			windowStart.setHours(0, 0, 0, 0);
			const windowEnd = new Date(windowStart);
			windowEnd.setDate(windowEnd.getDate() + days);

			whereClause.startTime = { gte: windowStart, lt: windowEnd };
		}

		const [slots, events] = await Promise.all([
			withDbRetry(() =>
				prisma.eventSlot.findMany({
					where: whereClause,
					orderBy: { startTime: "asc" },
					include: {
						event: {
							select: {
								id: true,
								title: true,
								location: true,
								startDate: true,
								endDate: true,
								bookingOpen: true,
							},
						},
						assignedUser: {
							select: {
								id: true,
								name: true,
								email: true,
								image: true,
								profile: { select: { displayName: true } },
							},
						},
					},
				}),
			),
			withDbRetry(() =>
				prisma.event.findMany({
					orderBy: { startDate: "asc" },
					select: {
						id: true,
						title: true,
						startDate: true,
						endDate: true,
						bookingOpen: true,
						location: true,
						_count: {
							select: { slots: true },
						},
					},
				}),
			),
		]);

		return NextResponse.json({
			timeframe,
			eventId: eventId ?? "all",
			generatedAt: now.toISOString(),
			slots,
			events,
		});
	} catch (error) {
		log.error("slots", "Agenda query failed", {
			detail: error instanceof Error ? error.message : String(error),
		});
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
