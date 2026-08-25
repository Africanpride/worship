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
		const userIds = [
			...new Set(
				history.flatMap((h) =>
					[h.previousUserId, h.newUserId].filter((x): x is string =>
						Boolean(x),
					),
				),
			),
		];
		const [admins, users] = await Promise.all([
			prisma.user.findMany({
				where: { id: { in: adminIds } },
				select: { id: true, name: true },
			}),
			prisma.user.findMany({
				where: { id: { in: userIds } },
				select: {
					id: true,
					name: true,
					email: true,
					profile: { select: { displayName: true } },
				},
			}),
		]);
		const nameById = new Map(admins.map((a) => [a.id, a.name]));
		const userLabel = (id?: string | null) => {
			if (!id) return null;
			const u = users.find((x) => x.id === id);
			return u?.profile?.displayName || u?.name || `${id.slice(0, 6)}…`;
		};

		const [slot] = history.length
			? await prisma.eventSlot.findMany({
					where: { id: slotId },
					select: { track: true, startTime: true, endTime: true },
					take: 1,
				})
			: [];

		return NextResponse.json({
			slot: slot
				? {
						track: slot.track,
						startTime: slot.startTime.toISOString(),
						endTime: slot.endTime.toISOString(),
					}
				: null,
			history: history.map((h) => ({
				id: h.id,
				createdAt: h.createdAt.toISOString(),
				previousUserId: h.previousUserId,
				newUserId: h.newUserId,
				previousUserName: userLabel(h.previousUserId),
				newUserName: userLabel(h.newUserId),
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
