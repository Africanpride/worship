import { createHash, randomInt } from "node:crypto";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { sendWhatsappOtp } from "@/lib/notify/whatsapp";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  phone: z.string().min(8).max(20), // E.164 validated loosely; phone-input ensures +...
});

function hashCode(code: string): string {
  return createHash("sha256").update(code).digest("hex");
}

// POST /api/user/phone/request { phone }
export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body: unknown = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid phone",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const phone = parsed.data.phone.trim();
  // Rate limit: max 5 requests per hour per user
  const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const recentCount = await prisma.phoneVerification.count({
    where: { userId: session.user.id, createdAt: { gt: hourAgo } },
  });
  if (recentCount >= 5) {
    return NextResponse.json(
      { error: "Too many attempts, try again later" },
      { status: 429 },
    );
  }

  const code = String(randomInt(100000, 1000000)); // 6 digits
  const codeHash = hashCode(code);
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await prisma.phoneVerification.create({
    data: { userId: session.user.id, phone, codeHash, expiresAt },
  });

  // Update phone on profile optimistically (unverified)
  await prisma.profile.upsert({
    where: { userId: session.user.id },
    create: { userId: session.user.id, phone },
    update: { phone },
  });
  //   console.log(phone, code);
  await sendWhatsappOtp(phone, code);

  return NextResponse.json({ success: true, expiresAt });
}
