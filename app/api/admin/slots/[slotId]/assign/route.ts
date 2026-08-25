import { render } from "@react-email/components";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { resend } from "@/lib/email/resend";
import SlotReassignedEmail from "@/lib/email/SlotReassigned";
import { getRequestId, log } from "@/lib/logger";
import { prisma } from "@/lib/prisma";

// POST /api/admin/slots/:slotId/assign
// Body: { userId: string | null, reason?: string }
// Assigns/reassigns a slot to a user (or clears it with null) regardless of
// slot state (open/booked/blocked — blocking is admin-controlled).
// Writes an audit row and notifies anyone who lost the slot (email-only).
export async function POST(
	req: NextRequest,
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

		const body = await req.json();
		const userId: unknown = body?.userId ?? null;
		const reason: string =
			typeof body?.reason === "string" && body.reason.trim()
				? body.reason.trim()
				: "admin_override";

		let targetUser: {
			id: string;
			email: string;
			name: string;
			banned: boolean | null;
		} | null = null;
		if (userId !== null) {
			if (typeof userId !== "string" || !userId) {
				return NextResponse.json(
					{ error: "userId must be a non-empty string or null" },
					{ status: 400 },
				);
			}
			targetUser = await prisma.user.findUnique({
				where: { id: userId },
				select: { id: true, email: true, name: true, banned: true },
			});
			if (!targetUser) {
				return NextResponse.json({ error: "User not found" }, { status: 404 });
			}
			if (targetUser.banned) {
				return NextResponse.json(
					{ error: "Cannot assign a slot to a banned user." },
					{ status: 400 },
				);
			}
		}

		type AssignResult = {
			slot: { id: string; startTime: Date; endTime: Date; track: string };
			previousUserId: string | null;
		};

		const result: AssignResult | null = await prisma.$transaction(
			async (tx) => {
				const slot = await tx.eventSlot.findUnique({
					where: { id: slotId },
				});
				if (!slot) return null;

				await tx.slotBookingHistory.create({
					data: {
						slotId,
						previousUserId: slot.assignedUserId,
						newUserId: targetUser?.id ?? null,
						changedByAdminId: session.user.id,
						reason,
					},
				});

				await tx.eventSlot.update({
					where: { id: slotId },
					data: {
						status: targetUser ? "booked" : "open",
						assignedUserId: targetUser?.id ?? null,
						blockedByAdminId:
							targetUser && slot.status === "blocked"
								? slot.blockedByAdminId
								: null,
					},
				});

				return {
					slot: {
						id: slot.id,
						startTime: slot.startTime,
						endTime: slot.endTime,
						track: slot.track,
					},
					previousUserId: slot.assignedUserId,
				};
			},
		);

		if (!result) {
			return NextResponse.json({ error: "Slot not found" }, { status: 404 });
		}

		log.info(
			"slots",
			targetUser ? "Slot assigned by admin" : "Slot assignment cleared",
			{
				detail: `Slot ${slotId} · previous=${result.previousUserId ?? "none"} → new=${targetUser?.id ?? "none"} · by ${session.user.id}`,
				requestId: getRequestId() ?? undefined,
				userId: session.user.id,
				meta: { slotId, reason },
			},
		);

		// Notify anyone who lost the slot (previous assignee), per approved scope:
		// fires on reassignment AND on clearing. Email failure never fails the request.
		if (result.previousUserId && result.previousUserId !== targetUser?.id) {
			try {
				const [previousUser, event] = await Promise.all([
					prisma.user.findUnique({
						where: { id: result.previousUserId },
						select: { email: true, name: true },
					}),
					prisma.event.findFirst({
						where: { slots: { some: { id: slotId } } },
						select: { title: true },
					}),
				]);

				if (previousUser?.email) {
					const trackLabel =
						result.slot.track === "bible-reading" ? "Bible Reading" : "Worship";
					const html = await render(
						SlotReassignedEmail({
							name: previousUser.name,
							eventTitle: event?.title ?? "an upcoming event",
							startTime: result.slot.startTime,
							endTime: result.slot.endTime,
							reassignedToName: targetUser?.name ?? null,
							trackLabel,
						}),
					);
					await resend.emails.send({
						from: "no-reply@thenonstop.org",
						to: previousUser.email,
						subject: `Your ${trackLabel.toLowerCase()} slot was reassigned — ${event?.title ?? "The NonStop Series"}`,
						html,
					});
				}
			} catch (error) {
				log.error("email", "Reassignment notification email failed", {
					detail: error instanceof Error ? error.message : String(error),
				});
			}
		}

		const updated = await prisma.eventSlot.findUnique({
			where: { id: slotId },
			include: {
				assignedUser: { select: { id: true, name: true, email: true } },
			},
		});
		return NextResponse.json(updated);
	} catch (error) {
		log.error("slots", "Slot assignment failed", {
			detail: error instanceof Error ? error.message : String(error),
		});
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
