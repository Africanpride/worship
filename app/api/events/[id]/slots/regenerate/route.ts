import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { log } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { syncEventSlots } from "@/lib/slots";

// POST /api/events/:eventId/slots/regenerate
// Admin action: union-regenerates hourly slots for the event.
// Only ADDS missing slots — existing (incl. booked/blocked) are never touched.
export async function POST(
	_req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session || session.user.role !== "admin" || session.user.banned) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { id } = await params;
		if (!id) {
			return NextResponse.json({ error: "Missing event ID" }, { status: 400 });
		}

		const exists = await prisma.event.findUnique({
			where: { id },
			select: { id: true },
		});
		if (!exists) {
			return NextResponse.json({ error: "Event not found" }, { status: 404 });
		}

		const result = await syncEventSlots(id);
		return NextResponse.json(result);
	} catch (error) {
		if (error instanceof Error && error.message === "EVENT_NOT_FOUND") {
			return NextResponse.json({ error: "Event not found" }, { status: 404 });
		}
		log.error("events", "Slot regeneration failed", {
			detail: error instanceof Error ? error.message : String(error),
		});
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
