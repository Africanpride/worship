import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getRequestId, log } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import {
	checkBookingRules,
	getBookingSettings,
	normalizeVisibility,
} from "@/lib/slots";

// POST /api/events/:eventId/slots/:slotId/book
// Books an open slot for the signed-in, non-banned user.
export async function POST(
	_req: NextRequest,
	{ params }: { params: Promise<{ id: string; slotId: string }> },
) {
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

		const { id: eventId, slotId } = await params;
		if (!eventId || !slotId) {
			return NextResponse.json(
				{ error: "Missing event or slot ID" },
				{ status: 400 },
			);
		}

		const slot = await prisma.eventSlot.findUnique({
			where: { id: slotId },
		});
		if (!slot || slot.eventId !== eventId) {
			return NextResponse.json({ error: "Slot not found" }, { status: 404 });
		}

		const event = await prisma.event.findUnique({
			where: { id: eventId },
			select: { bookingOpen: true, startDate: true, endDate: true },
		});
		if (!event?.bookingOpen) {
			return NextResponse.json(
				{ error: "Bookings for this event haven't opened yet." },
				{ status: 403 },
			);
		}
		if (event.endDate.getTime() <= Date.now()) {
			return NextResponse.json(
				{ error: "This event has ended." },
				{ status: 403 },
			);
		}

		if (slot.status !== "open") {
			return NextResponse.json(
				{ error: "This slot is no longer available." },
				{ status: 409 },
			);
		}
		if (slot.startTime.getTime() <= Date.now()) {
			return NextResponse.json(
				{ error: "This slot has already started." },
				{ status: 400 },
			);
		}

		const settings = await getBookingSettings();
		if (
			session.user.role !== "admin" &&
			normalizeVisibility(settings.slotVisibility) === "admin_only"
		) {
			return NextResponse.json(
				{
					error:
						"Bookings for this event are managed by the admins. Please contact us to reserve a slot.",
				},
				{ status: 403 },
			);
		}

		// Multi-slot rules are per track: a worship booking never consumes
		// a Bible Reading slot (the two run in parallel).
		const currentBookedCount = await prisma.eventSlot.count({
			where: {
				eventId,
				track: slot.track,
				status: "booked",
				assignedUserId: session.user.id,
			},
		});
		const rules = checkBookingRules(settings, currentBookedCount);
		if (!rules.allowed) {
			return NextResponse.json({ error: rules.reason }, { status: 409 });
		}

		// Concurrency guard: only succeeds if the slot is still open.
		const booked = await prisma.$transaction(async (tx) => {
			const result = await tx.eventSlot.updateMany({
				where: { id: slotId, status: "open" },
				data: {
					status: "booked",
					assignedUserId: session.user.id,
					blockedByAdminId: null,
				},
			});
			return result.count === 1;
		});

		if (!booked) {
			log.warn("slots", "Booking conflict — slot taken concurrently", {
				detail: `Slot ${slotId} on event ${eventId}`,
				requestId: getRequestId() ?? undefined,
				userId: session.user.id,
			});
			return NextResponse.json(
				{ error: "Someone just took this slot. Pick another one." },
				{ status: 409 },
			);
		}

		log.info("slots", "Slot booked", {
			detail: `Slot ${slotId} · ${new Date(slot.startTime).toISOString()}`,
			userId: session.user.id,
			meta: { eventId, slotId },
		});

		const updated = await prisma.eventSlot.findUnique({
			where: { id: slotId },
		});
		return NextResponse.json(updated);
	} catch (error) {
		log.error("slots", "Slot booking failed", {
			detail: error instanceof Error ? error.message : String(error),
		});
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}

// DELETE /api/events/:eventId/slots/:slotId/book
// Cancels the caller's own booking any time before the slot starts.
export async function DELETE(
	_req: NextRequest,
	{ params }: { params: Promise<{ id: string; slotId: string }> },
) {
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

		const { id: eventId, slotId } = await params;
		if (!eventId || !slotId) {
			return NextResponse.json(
				{ error: "Missing event or slot ID" },
				{ status: 400 },
			);
		}

		const slot = await prisma.eventSlot.findUnique({
			where: { id: slotId },
		});
		if (!slot || slot.eventId !== eventId) {
			return NextResponse.json({ error: "Slot not found" }, { status: 404 });
		}
		if (slot.assignedUserId !== session.user.id || slot.status !== "booked") {
			return NextResponse.json(
				{ error: "You do not hold this booking." },
				{ status: 403 },
			);
		}
		if (slot.startTime.getTime() <= Date.now()) {
			return NextResponse.json(
				{
					error:
						"This slot has already started and can no longer be cancelled.",
				},
				{ status: 400 },
			);
		}

		await prisma.$transaction(async (tx) => {
			await tx.eventSlot.updateMany({
				where: {
					id: slotId,
					status: "booked",
					assignedUserId: session.user.id,
				},
				data: { status: "open", assignedUserId: null },
			});
		});

		const updated = await prisma.eventSlot.findUnique({
			where: { id: slotId },
		});
		return NextResponse.json(updated);
	} catch (error) {
		log.error("slots", "Slot cancellation failed", {
			detail: error instanceof Error ? error.message : String(error),
		});
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
