import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/admin/slots/batch
// Body: { slotIds: string[], action: "block" | "unblock" }
// Allows admins to block or unblock multiple slots at once.
export async function POST(req: NextRequest) {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (session?.user.role !== "admin" || session.user.banned) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await req.json().catch(() => null);
		const slotIds: unknown = body?.slotIds;
		const action: unknown = body?.action;

		if (!Array.isArray(slotIds) || slotIds.length === 0) {
			return NextResponse.json(
				{ error: "slotIds must be a non-empty array of strings" },
				{ status: 400 },
			);
		}

		if (action !== "block" && action !== "unblock") {
			return NextResponse.json(
				{ error: "action must be either 'block' or 'unblock'" },
				{ status: 400 },
			);
		}

		const validSlotIds = slotIds.filter(
			(id): id is string => typeof id === "string" && id.length > 0,
		);

		if (validSlotIds.length === 0) {
			return NextResponse.json(
				{ error: "No valid slot IDs provided" },
				{ status: 400 },
			);
		}

		if (action === "block") {
			const result = await prisma.eventSlot.updateMany({
				where: { id: { in: validSlotIds } },
				data: {
					status: "blocked",
					blockedByAdminId: session.user.id,
				},
			});

			return NextResponse.json({
				success: true,
				action: "block",
				count: result.count,
			});
		}

		// Action === "unblock"
		const result = await prisma.$transaction([
			// 1. Unblock slots that have no assigned user (become "open")
			prisma.eventSlot.updateMany({
				where: {
					id: { in: validSlotIds },
					assignedUserId: null,
				},
				data: {
					status: "open",
					blockedByAdminId: null,
				},
			}),
			// 2. Unblock slots that already have an assigned user (revert to "booked")
			prisma.eventSlot.updateMany({
				where: {
					id: { in: validSlotIds },
					assignedUserId: { not: null },
				},
				data: {
					status: "booked",
					blockedByAdminId: null,
				},
			}),
		]);

		return NextResponse.json({
			success: true,
			action: "unblock",
			requested: validSlotIds.length,
			count: result[0].count + result[1].count,
		});
	} catch (error) {
		console.error("[ADMIN_SLOTS_BATCH]", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
