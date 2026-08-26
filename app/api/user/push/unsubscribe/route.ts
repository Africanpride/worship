import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
	endpoint: z.string().url(),
});

// POST /api/user/push/unsubscribe
export async function POST(req: NextRequest) {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const body: unknown = await req.json().catch(() => ({}));
	const parsed = schema.safeParse(body);
	if (!parsed.success) {
		return NextResponse.json(
			{ error: "Invalid payload", fieldErrors: parsed.error.flatten().fieldErrors },
			{ status: 400 },
		);
	}

	await prisma.pushSubscription.deleteMany({
		where: { endpoint: parsed.data.endpoint, userId: session.user.id },
	});

	return NextResponse.json({ success: true });
}
