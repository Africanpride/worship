import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
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

		return NextResponse.json(updated);
	} catch (error) {
		console.error("[ADMIN_SLOT_BLOCK]", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
