import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  endpoint: z.string().url().optional(),
  fcmToken: z.string().min(10).optional(),
}).refine((d) => !!d.endpoint || !!d.fcmToken, { message: "Provide endpoint or fcmToken" });

// POST /api/user/push/unsubscribe — accepts {endpoint} or {fcmToken}
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

  if (parsed.data.fcmToken) {
    await prisma.pushSubscription.deleteMany({ where: { fcmToken: parsed.data.fcmToken, userId: session.user.id } });
  } else {
    await prisma.pushSubscription.deleteMany({ where: { endpoint: parsed.data.endpoint, userId: session.user.id } });
  }

  return NextResponse.json({ success: true });
}
