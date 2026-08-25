import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/admin/slots/[slotId]/history
// Audit trail for one slot, newest first, with the acting admin's name.
export async function GET(
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

		const history = await prisma.slotBookingHistory.findMany({
			where: { slotId },
			orderBy: { createdAt: "desc" },
		});

		const adminIds = [...new Set(history.map((h) => h.changedByAdminId))];
		const admins = await prisma.user.findMany({
			where: { id: { in: adminIds } },
			select: { id: true, name: true },
		});
		const nameById = new Map(admins.map((a) => [a.id, a.name]));

		return NextResponse.json({
			history: history.map((h) => ({
				id: h.id,
				createdAt: h.createdAt.toISOString(),
				previousUserId: h.previousUserId,
				newUserId: h.newUserId,
				reason: h.reason,
				changedBy: nameById.get(h.changedByAdminId) ?? "Admin",
			})),
		});
	} catch (error) {
		console.error("[SLOT_HISTORY_GET]", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
