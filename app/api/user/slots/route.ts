import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/user/slots
// The caller's booked worship slots across all events (with event info),
// used by the "My bookings" panel in the user dashboard.
export async function GET(_req: NextRequest) {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		if (session.user.banned) {
			return NextResponse.json({ error: "Account suspended" }, { status: 403 });
		}

		const slots = await prisma.eventSlot.findMany({
			where: {
				assignedUserId: session.user.id,
				status: "booked",
			},
			orderBy: { startTime: "asc" },
			include: {
				event: {
					select: {
						id: true,
						title: true,
						slug: true,
						location: true,
					},
				},
			},
		});

		return NextResponse.json(slots);
	} catch (error) {
		console.error("[USER_SLOTS_GET]", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
