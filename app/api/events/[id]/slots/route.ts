import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
	getBookingSettings,
	normalizeVisibility,
	redactSlots,
	resolveAssigneeName,
} from "@/lib/slots";

// GET /api/events/:eventId/slots
// Lists slots for an event. Non-admins get a list redacted per
// BookingSettings.slotVisibility; admins always see everything.
export async function GET(
	_req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		const isAdmin = session?.user?.role === "admin";

		const { id } = await params;
		if (!id) {
			return NextResponse.json({ error: "Missing event ID" }, { status: 400 });
		}

		const event = await prisma.event.findUnique({ where: { id } });
		if (!event) {
			return NextResponse.json({ error: "Event not found" }, { status: 404 });
		}

		const settings = await getBookingSettings();
		const visibility = normalizeVisibility(settings.slotVisibility);

		const slots = await prisma.eventSlot.findMany({
			where: { eventId: id },
			orderBy: { startTime: "asc" },
			include: {
				assignedUser: {
					select: {
						name: true,
						profile: { select: { displayName: true } },
					},
				},
			},
		});

		const redacted = redactSlots(
			slots,
			isAdmin,
			visibility,
			(u) =>
				resolveAssigneeName(
					u as {
						name?: string | null;
						profile?: { displayName?: string | null } | null;
					},
				),
			session?.user?.id ?? null,
		);

		return NextResponse.json({
			eventId: id,
			visibility,
			slots: redacted,
		});
	} catch (error) {
		console.error("[EVENT_SLOTS_GET]", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
