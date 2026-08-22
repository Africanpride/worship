import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getBookingSettings, normalizeVisibility } from "@/lib/slots";

// GET /api/admin/booking-settings
export async function GET(_req: NextRequest) {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session || session.user.role !== "admin" || session.user.banned) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const settings = await getBookingSettings();
		return NextResponse.json(settings);
	} catch (error) {
		console.error("[BOOKING_SETTINGS_GET]", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}

const updateSchema = z.object({
	allowMultipleSlotsPerUser: z.boolean().optional(),
	maxSlotsPerUser: z.number().int().min(1).nullable().optional(),
	slotVisibility: z
		.enum(["full_public", "availability_only", "admin_only"])
		.optional(),
});

// PUT /api/admin/booking-settings
export async function PUT(req: NextRequest) {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session || session.user.role !== "admin" || session.user.banned) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body: unknown = await req.json();
		const parsed = updateSchema.safeParse(body);
		if (!parsed.success) {
			return NextResponse.json(
				{
					error: "Invalid settings payload",
					fieldErrors: parsed.error.flatten().fieldErrors,
				},
				{ status: 400 },
			);
		}

		const current = await getBookingSettings();

		if (
			parsed.data.allowMultipleSlotsPerUser === false &&
			parsed.data.maxSlotsPerUser !== undefined
		) {
			parsed.data.maxSlotsPerUser = null;
		}

		const updated = await prisma.bookingSettings.update({
			where: { id: current.id },
			data: {
				allowMultipleSlotsPerUser:
					parsed.data.allowMultipleSlotsPerUser ??
					current.allowMultipleSlotsPerUser,
				maxSlotsPerUser:
					parsed.data.maxSlotsPerUser !== undefined
						? parsed.data.maxSlotsPerUser
						: current.maxSlotsPerUser,
				slotVisibility:
					parsed.data.slotVisibility !== undefined
						? normalizeVisibility(parsed.data.slotVisibility)
						: current.slotVisibility,
			},
		});

		return NextResponse.json(updated);
	} catch (error) {
		console.error("[BOOKING_SETTINGS_PUT]", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
