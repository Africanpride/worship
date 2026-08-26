import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { log } from "@/lib/logger";
import { prisma } from "@/lib/prisma";

const DEFAULT_OFFSETS = [1440, 60];

async function getOrCreateSettings() {
	let settings = await prisma.adminNotificationSettings.findUnique({
		where: { singleton: "singleton" },
	});
	if (!settings) {
		settings = await prisma.adminNotificationSettings.create({
			data: { singleton: "singleton", reminderOffsets: DEFAULT_OFFSETS },
		});
	}
	return settings;
}

// GET /api/admin/notification-settings
export async function GET(_req: NextRequest) {
	try {
		const session = await auth.api.getSession({ headers: await headers() });
		if (!session || session.user.role !== "admin" || session.user.banned) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		const settings = await getOrCreateSettings();
		return NextResponse.json(settings);
	} catch (error) {
		log.error("settings", "Notification settings fetch failed", {
			detail: error instanceof Error ? error.message : String(error),
		});
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}

const updateSchema = z.object({
	emailEnabled: z.boolean().optional(),
	pushEnabled: z.boolean().optional(),
	smsEnabled: z.boolean().optional(),
	reminderOffsets: z
		.array(z.number().int().min(5).max(10080))
		.min(1)
		.max(5)
		.optional(),
});

// PATCH /api/admin/notification-settings
export async function PATCH(req: NextRequest) {
	try {
		const session = await auth.api.getSession({ headers: await headers() });
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

		const current = await getOrCreateSettings();

		// Ensure offsets are sorted and unique
		let offsets = parsed.data.reminderOffsets ?? current.reminderOffsets;
		if (parsed.data.reminderOffsets) {
			offsets = [...new Set(parsed.data.reminderOffsets)].sort((a, b) => b - a);
		}

		const updated = await prisma.adminNotificationSettings.update({
			where: { id: current.id },
			data: {
				emailEnabled: parsed.data.emailEnabled ?? current.emailEnabled,
				pushEnabled: parsed.data.pushEnabled ?? current.pushEnabled,
				smsEnabled: parsed.data.smsEnabled ?? current.smsEnabled,
				reminderOffsets: offsets,
				updatedById: session.user.id,
			},
		});

		log.info("settings", "notification settings updated", {
			userId: session.user.id,
			detail: `email:${updated.emailEnabled} push:${updated.pushEnabled} sms:${updated.smsEnabled} offsets:${offsets.join(",")}`,
		});

		return NextResponse.json(updated);
	} catch (error) {
		log.error("settings", "Notification settings update failed", {
			detail: error instanceof Error ? error.message : String(error),
		});
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}

// Support PUT alias
export async function PUT(req: NextRequest) {
	return PATCH(req);
}
