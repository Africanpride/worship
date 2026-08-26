import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
	phone: z.string().min(8).max(20),
	code: z.string().regex(/^\d{6}$/),
});

function hashCode(code: string): string {
	return createHash("sha256").update(code).digest("hex");
}

// POST /api/user/phone/verify { phone, code }
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

	const { phone, code } = parsed.data;
	const codeHash = hashCode(code);

	const verification = await prisma.phoneVerification.findFirst({
		where: {
			userId: session.user.id,
			phone,
			expiresAt: { gt: new Date() },
		},
		orderBy: { createdAt: "desc" },
	});

	if (!verification) {
		return NextResponse.json({ error: "Code expired or not found" }, { status: 400 });
	}

	if (verification.attempts >= 5) {
		return NextResponse.json({ error: "Too many attempts" }, { status: 429 });
	}

	if (verification.codeHash !== codeHash) {
		await prisma.phoneVerification.update({
			where: { id: verification.id },
			data: { attempts: { increment: 1 } },
		});
		return NextResponse.json({ error: "Invalid code" }, { status: 400 });
	}

	// Success — mark verified and clean up
	await prisma.$transaction([
		prisma.profile.update({
			where: { userId: session.user.id },
			data: { phone, phoneVerifiedAt: new Date() },
		}),
		prisma.phoneVerification.deleteMany({
			where: { userId: session.user.id, phone },
		}),
	]);

	return NextResponse.json({ success: true });
}
