import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/admin/slots/agenda?days=7
// Admin command-center view: every worship hour in the next `days` days
// across all events, with booker identities (never redacted for admins).
export async function GET(req: NextRequest) {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session || session.user.role !== "admin" || session.user.banned) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { searchParams } = new URL(req.url);
		const parsedDays = Number.parseInt(searchParams.get("days") ?? "7", 10);
		const days = Number.isInteger(parsedDays)
			? Math.min(Math.max(parsedDays, 1), 14)
			: 7;

		const now = new Date();
		const windowStart = new Date(now);
		windowStart.setHours(0, 0, 0, 0);
		const windowEnd = new Date(windowStart);
		windowEnd.setDate(windowEnd.getDate() + days);

		const slots = await prisma.eventSlot.findMany({
			where: {
				startTime: { gte: windowStart, lt: windowEnd },
			},
			orderBy: { startTime: "asc" },
			include: {
				event: { select: { id: true, title: true, location: true } },
				assignedUser: {
					select: { id: true, name: true, image: true },
				},
			},
		});

		return NextResponse.json({
			windowDays: days,
			generatedAt: now.toISOString(),
			slots,
		});
	} catch (error) {
		console.error("[ADMIN_SLOTS_AGENDA]", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
