import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
	endpoint: z.string().url(),
	p256dh: z.string().min(10),
	auth: z.string().min(10),
});

// POST /api/user/push/subscribe
export async function POST(req: NextRequest) {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const body: unknown = await req.json().catch(() => ({}));
	const parsed = schema.safeParse(body);
	if (!parsed.success) {
		return NextResponse.json(
			{ error: "Invalid subscription", fieldErrors: parsed.error.flatten().fieldErrors },
			{ status: 400 },
		);
	}

	// Upsert — endpoint is globally unique
	const existing = await prisma.pushSubscription.findUnique({
		where: { endpoint: parsed.data.endpoint },
	});

	if (existing && existing.userId !== session.user.id) {
		// Reassign to new owner
		await prisma.pushSubscription.delete({ where: { endpoint: parsed.data.endpoint } });
	}

	await prisma.pushSubscription.upsert({
		where: { endpoint: parsed.data.endpoint },
		create: { userId: session.user.id, ...parsed.data },
		update: { userId: session.user.id, ...parsed.data },
	});

	return NextResponse.json({ success: true });
}
