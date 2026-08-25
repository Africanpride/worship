import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/user/notifications
// Recent notifications + unread count for the signed-in user.
export async function GET(req: NextRequest) {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const [notifications, unreadCount] = await Promise.all([
			prisma.notification.findMany({
				where: { userId: session.user.id },
				orderBy: { createdAt: "desc" },
				take: 20,
			}),
			prisma.notification.count({
				where: { userId: session.user.id, read: false },
			}),
		]);

		return NextResponse.json({ notifications, unreadCount });
	} catch (error) {
		console.error("[NOTIFICATIONS_GET]", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}

// POST /api/user/notifications/read  { id?: string, all?: boolean }
export async function POST(req: NextRequest) {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = (await req.json().catch(() => ({}))) as {
			id?: string;
			all?: boolean;
		};

		const result = await prisma.notification.updateMany({
			where: body.all
				? { userId: session.user.id, read: false }
				: {
						id: String(body.id ?? ""),
						userId: session.user.id,
					},
			data: { read: true },
		});

		return NextResponse.json({ updated: result.count });
	} catch (error) {
		console.error("[NOTIFICATIONS_READ]", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
