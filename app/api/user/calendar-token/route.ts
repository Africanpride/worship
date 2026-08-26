import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function buildUrls(token: string, host: string) {
	const httpsUrl = `${host}/api/calendar/${token}/ics`;
	const webcalUrl = httpsUrl
		.replace(/^https:\/\//, "webcal://")
		.replace(/^http:\/\//, "webcal://");
	return { url: httpsUrl, webcalUrl };
}

function getHost(req: NextRequest): string {
	const forwarded = req.headers.get("x-forwarded-host");
	const host = forwarded ?? req.headers.get("host") ?? "localhost:3000";
	const proto = req.headers.get("x-forwarded-proto") ?? "https";
	// Prefer env app url if set
	if (process.env.NEXT_PUBLIC_APP_URL)
		return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
	return `${proto}://${host}`;
}

// GET /api/user/calendar-token — returns current token + urls or null
export async function GET(req: NextRequest) {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const existing = await prisma.calendarToken.findFirst({
		where: { userId: session.user.id, revokedAt: null },
		orderBy: { createdAt: "desc" },
	});

	if (!existing) {
		return NextResponse.json({ token: null, url: null, webcalUrl: null });
	}

	const host = getHost(req);
	const { url, webcalUrl } = buildUrls(existing.token, host);
	return NextResponse.json({ token: existing.token, url, webcalUrl });
}

// POST /api/user/calendar-token { action: "create" | "rotate" | "revoke" }
export async function POST(req: NextRequest) {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const body = (await req.json().catch(() => ({}))) as { action?: string };
	const action = body.action ?? "create";

	if (!["create", "rotate", "revoke"].includes(action)) {
		return NextResponse.json({ error: "Invalid action" }, { status: 400 });
	}

	if (action === "revoke") {
		await prisma.calendarToken.updateMany({
			where: { userId: session.user.id, revokedAt: null },
			data: { revokedAt: new Date() },
		});
		return NextResponse.json({ token: null, url: null, webcalUrl: null });
	}

	if (action === "rotate") {
		const token = crypto.randomUUID().replace(/-/g, "");
		const result = await prisma.$transaction(async (tx) => {
			await tx.calendarToken.updateMany({
				where: { userId: session.user.id, revokedAt: null },
				data: { revokedAt: new Date() },
			});
			const created = await tx.calendarToken.create({
				data: { userId: session.user.id, token },
			});
			return created;
		});
		const host = getHost(req);
		const { url, webcalUrl } = buildUrls(result.token, host);
		return NextResponse.json({ token: result.token, url, webcalUrl });
	}

	// create — return existing if present, else create
	const existing = await prisma.calendarToken.findFirst({
		where: { userId: session.user.id, revokedAt: null },
		orderBy: { createdAt: "desc" },
	});
	if (existing) {
		const host = getHost(req);
		const { url, webcalUrl } = buildUrls(existing.token, host);
		return NextResponse.json({ token: existing.token, url, webcalUrl });
	}

	const token = crypto.randomUUID().replace(/-/g, "");
	const created = await prisma.calendarToken.create({
		data: { userId: session.user.id, token },
	});
	const host = getHost(req);
	const { url, webcalUrl } = buildUrls(created.token, host);
	return NextResponse.json({ token: created.token, url, webcalUrl });
}
