import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { log } from "@/lib/logger";
import { notify } from "@/lib/notify";
import { prisma } from "@/lib/prisma";
import { syncEventSlots } from "@/lib/slots";

export async function PATCH(
	req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session || session.user.role !== "admin") {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const { id } = await params;
		const body = await req.json();
		const {
			title,
			startDate,
			endDate,
			poster,
			description,
			location,
			status,
			ministers,
			sponsorIds,
			bookingOpen,
		} = body;

		if (!id) {
			return new NextResponse("Event ID is required", { status: 400 });
		}

		// Get existing event to handle slug generation if fields are missing
		const existingEvent = await prisma.event.findUnique({
			where: { id },
		});

		if (!existingEvent) {
			return new NextResponse("Event not found", { status: 404 });
		}

		const newTitle = title || existingEvent.title;
		const newStartDate = startDate || existingEvent.startDate;
		const dateSuffix = new Date(newStartDate).toISOString().split("T")[0];

		const slug = `${newTitle
			.toLowerCase()
			.replace(/[^\w ]+/g, "")
			.replace(/ +/g, "-")}-${dateSuffix}`;

		// Update the event
		const event = await prisma.event.update({
			where: {
				id,
			},
			data: {
				title,
				slug,
				startDate: startDate ? new Date(startDate) : undefined,
				endDate: endDate ? new Date(endDate) : undefined,
				poster,
				description,
				location,
				status,
				sponsorIds: sponsorIds || [],
				...(typeof bookingOpen === "boolean" ? { bookingOpen } : {}),
			},
		});

		// Sync ministers: Simple approach - delete and recreate
		if (ministers && Array.isArray(ministers)) {
			await prisma.minister.deleteMany({
				where: {
					eventId: id,
				},
			});

			if (ministers.length > 0) {
				await prisma.minister.createMany({
					data: ministers.map(
						(m: { name: string; role?: string; image?: string }) => ({
							name: m.name,
							role: m.role,
							image: m.image,
							eventId: id,
						}),
					),
				});
			}
		}

		// Union-regenerate slots when the event window moved (best-effort):
		// only ADDS missing hourly slots; bookings/blocks are never deleted.
		const datesChanged =
			(startDate &&
				new Date(startDate).getTime() !== existingEvent.startDate.getTime()) ||
			(endDate &&
				new Date(endDate).getTime() !== existingEvent.endDate.getTime());
		if (datesChanged) {
			try {
				await syncEventSlots(id);
			} catch (error) {
				log.error("events", "Slot regeneration after date change failed", {
					detail: error instanceof Error ? error.message : String(error),
				});
			}
		}

		const updatedEvent = await prisma.event.findUnique({
			where: { id },
			include: {
				ministers: true,
				sponsors: true,
			},
		});

		// Fan-out: if schedule-impacting fields changed, notify booked holders (best-effort)
		const scheduleChanged =
			Boolean(title && title !== existingEvent.title) ||
			Boolean(location !== undefined && location !== existingEvent.location) ||
			Boolean(status && status !== existingEvent.status) ||
			Boolean(
				typeof bookingOpen === "boolean" &&
					bookingOpen !== existingEvent.bookingOpen,
			) ||
			datesChanged;
		if (scheduleChanged) {
			slotNotifyFanOut(id, updatedEvent?.title ?? newTitle).catch((e) =>
				log.warn("events", "event fan-out failed", {
					detail: e instanceof Error ? e.message : String(e),
					meta: { eventId: id },
				}),
			);
		}

		return NextResponse.json(updatedEvent);
	} catch (error) {
		log.error("events", "Event update failed", {
			detail: error instanceof Error ? error.message : String(error),
		});
		return new NextResponse("Internal Error", { status: 500 });
	}
}

async function slotNotifyFanOut(eventId: string, eventTitle: string) {
	const slots = await prisma.eventSlot.findMany({
		where: { eventId, status: "booked", assignedUserId: { not: null } },
		select: { assignedUserId: true },
	});
	const uniqueUserIds = [
		...new Set(slots.map((s) => s.assignedUserId).filter(Boolean) as string[]),
	];
	if (uniqueUserIds.length === 0) return;
	await Promise.allSettled(
		uniqueUserIds.map((userId) =>
			notify(userId, {
				title: `Update: ${eventTitle}`,
				body: `Schedule for ${eventTitle} changed. Check your booked hours.`,
				link: "/dashboard/events",
				eventId,
				channels: ["inapp", "email"],
			}),
		),
	);
}

export async function DELETE(
	req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session || session.user.role !== "admin") {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const { id } = await params;

		if (!id) {
			return new NextResponse("Event ID is required", { status: 400 });
		}

		const event = await prisma.event.delete({
			where: {
				id,
			},
		});

		return NextResponse.json(event);
	} catch (error) {
		log.error("events", "Event deletion failed", {
			detail: error instanceof Error ? error.message : String(error),
		});
		return new NextResponse("Internal Error", { status: 500 });
	}
}
