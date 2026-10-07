import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { recordAuditLog } from "@/lib/audit";
import { auth } from "@/lib/auth";
import { log } from "@/lib/logger";
import { prisma } from "@/lib/prisma";

// POST /api/admin/slots/:slotId/block
// Blocks a slot (admin-controlled). Blocking does not clear an existing
// assignment; admins can still assign blocked slots.
export async function POST(
	_req: NextRequest,
	{ params }: { params: Promise<{ slotId: string }> },
) {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session || session.user.role !== "admin" || session.user.banned) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { slotId } = await params;
		if (!slotId) {
			return NextResponse.json({ error: "Missing slot ID" }, { status: 400 });
		}

		const slot = await prisma.eventSlot.findUnique({
			where: { id: slotId },
		});
		if (!slot) {
			return NextResponse.json({ error: "Slot not found" }, { status: 404 });
		}

		const updated = await prisma.eventSlot.update({
			where: { id: slotId },
			data: {
				status: "blocked",
				blockedByAdminId: session.user.id,
			},
		});

		await recordAuditLog({
			actor: {
				id: session.user.id,
				email: session.user.email,
				name: session.user.name,
				role: session.user.role,
			},
			action: "slot.block",
			entityType: "slot",
			entityId: slotId,
			entityLabel: `${slot.track} (${slot.startTime.toISOString()})`,
			before: { status: slot.status },
			after: { status: "blocked", blockedByAdminId: session.user.id },
			req: _req,
		});

		return NextResponse.json(updated);
	} catch (error) {
		log.error("slots", "Slot block failed", {
			detail: error instanceof Error ? error.message : String(error),
		});
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}

// DELETE /api/admin/slots/:slotId/block
// Unblocks a slot: returns it to "open" and clears the blocking admin.
// An existing assignment (if any) is left untouched.
export async function DELETE(
	_req: NextRequest,
	{ params }: { params: Promise<{ slotId: string }> },
) {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session || session.user.role !== "admin" || session.user.banned) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { slotId } = await params;
		if (!slotId) {
			return NextResponse.json({ error: "Missing slot ID" }, { status: 400 });
		}

		const slot = await prisma.eventSlot.findUnique({
			where: { id: slotId },
		});
		if (!slot) {
			return NextResponse.json({ error: "Slot not found" }, { status: 404 });
		}
		if (slot.status !== "blocked") {
			return NextResponse.json(
				{ error: "Slot is not blocked." },
				{ status: 409 },
			);
		}

		const updated = await prisma.eventSlot.update({
			where: { id: slotId },
			data: {
				status: slot.assignedUserId ? "booked" : "open",
				blockedByAdminId: null,
			},
		});

		await recordAuditLog({
			actor: {
				id: session.user.id,
				email: session.user.email,
				name: session.user.name,
				role: session.user.role,
			},
			action: "slot.unblock",
			entityType: "slot",
			entityId: slotId,
			entityLabel: `${slot.track} (${slot.startTime.toISOString()})`,
			before: { status: slot.status, blockedByAdminId: slot.blockedByAdminId },
			after: { status: updated.status, blockedByAdminId: null },
			req: _req,
		});

		return NextResponse.json(updated);
	} catch (error) {
		log.error("slots", "Slot unblock failed", {
			detail: error instanceof Error ? error.message : String(error),
		});
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
