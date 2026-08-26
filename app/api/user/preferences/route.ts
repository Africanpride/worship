import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/user/preferences — returns NotificationPreference (auto-create defaults)
export async function GET(_req: NextRequest) {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	let pref = await prisma.notificationPreference.findUnique({
		where: { userId: session.user.id },
	});

	if (!pref) {
		pref = await prisma.notificationPreference.create({
			data: { userId: session.user.id },
		});
	}

	return NextResponse.json(pref);
}

const updateSchema = z.object({
	emailReminders: z.boolean().optional(),
	pushReminders: z.boolean().optional(),
	smsReminders: z.boolean().optional(),
});

// PATCH /api/user/preferences
export async function PATCH(req: NextRequest) {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const body: unknown = await req.json().catch(() => ({}));
	const parsed = updateSchema.safeParse(body);
	if (!parsed.success) {
		return NextResponse.json(
			{
				error: "Invalid preferences payload",
				fieldErrors: parsed.error.flatten().fieldErrors,
			},
			{ status: 400 },
		);
	}

	// Enforce sms opt-in requires verified phone
	if (parsed.data.smsReminders === true) {
		const profile = await prisma.profile.findUnique({
			where: { userId: session.user.id },
			select: { phoneVerifiedAt: true, phone: true },
		});
		if (!profile?.phoneVerifiedAt) {
			return NextResponse.json(
				{
					error: "Phone verification required for SMS reminders",
					fieldErrors: { smsReminders: ["Verify phone first"] },
				},
				{ status: 400 },
			);
		}
	}

	const updated = await prisma.notificationPreference.upsert({
		where: { userId: session.user.id },
		create: { userId: session.user.id, ...parsed.data },
		update: parsed.data,
	});

	return NextResponse.json(updated);
}
