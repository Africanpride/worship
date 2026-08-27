import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const webPushSchema = z.object({
	endpoint: z.string().url(),
	p256dh: z.string().min(10),
	auth: z.string().min(10),
});

const fcmSchema = z.object({
	fcmToken: z.string().min(10),
	fid: z.string().optional(),
	platform: z.enum(["web", "android", "ios"]).optional(),
});

const schema = z.union([webPushSchema, fcmSchema]);

// POST /api/user/push/subscribe — accepts either {fcmToken} (FCM web/android/ios) or {endpoint,p256dh,auth} (legacy VAPID)
export async function POST(req: NextRequest) {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const body: unknown = await req.json().catch(() => ({}));
	const parsed = schema.safeParse(body);
	if (!parsed.success) {
		return NextResponse.json(
			{
				error:
					"Invalid subscription — send {fcmToken} or {endpoint,p256dh,auth}",
				fieldErrors: parsed.error.flatten().fieldErrors,
			},
			{ status: 400 },
		);
	}

	const data = parsed.data as Record<string, string | undefined>;

	// FCM path
	if ("fcmToken" in data && data.fcmToken) {
		const existing = await prisma.pushSubscription.findUnique({
			where: { fcmToken: data.fcmToken },
		});
		if (existing && existing.userId !== session.user.id) {
			await prisma.pushSubscription.delete({
				where: { fcmToken: data.fcmToken },
			});
		}
		await prisma.pushSubscription.upsert({
			where: { fcmToken: data.fcmToken },
			create: {
				userId: session.user.id,
				fcmToken: data.fcmToken,
				fid: data.fid,
				platform: data.platform ?? "web",
			},
			update: {
				userId: session.user.id,
				fid: data.fid,
				platform: data.platform ?? "web",
			},
		});
		return NextResponse.json({ success: true, provider: "fcm" });
	}

	// Legacy VAPID path
	const wp = data as { endpoint: string; p256dh: string; auth: string };
	const existing = await prisma.pushSubscription.findUnique({
		where: { endpoint: wp.endpoint },
	});
	if (existing && existing.userId !== session.user.id) {
		await prisma.pushSubscription.delete({ where: { endpoint: wp.endpoint } });
	}
	await prisma.pushSubscription.upsert({
		where: { endpoint: wp.endpoint },
		create: {
			userId: session.user.id,
			endpoint: wp.endpoint,
			p256dh: wp.p256dh,
			auth: wp.auth,
			platform: "web",
		},
		update: {
			userId: session.user.id,
			endpoint: wp.endpoint,
			p256dh: wp.p256dh,
			auth: wp.auth,
		},
	});
	return NextResponse.json({ success: true, provider: "webpush" });
}
