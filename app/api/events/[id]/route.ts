import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
					data: ministers.map((m: any) => ({
						name: m.name,
						role: m.role,
						image: m.image,
						eventId: id,
					})),
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

		return NextResponse.json(updatedEvent);
	} catch (error) {
		console.error("[EVENT_PATCH]", error);
		return new NextResponse("Internal Error", { status: 500 });
	}
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
		console.error("[EVENT_DELETE]", error);
		return new NextResponse("Internal Error", { status: 500 });
	}
}
