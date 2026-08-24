import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/admin/logs?level=&source=&q=&cursor=
// Cursor-paginated application logs, newest first. Admin-only.
export async function GET(req: NextRequest) {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session || session.user.role !== "admin" || session.user.banned) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { searchParams } = new URL(req.url);
		const level = searchParams.get("level");
		const source = searchParams.get("source");
		const q = searchParams.get("q")?.trim();
		const cursor = searchParams.get("cursor");
		const limit = 50;

		const where: Record<string, unknown> = {};
		if (level && ["error", "warn", "info", "debug"].includes(level)) {
			where.level = level;
		}
		if (source) where.source = source;
		if (q) {
			where.OR = [
				{ message: { contains: q } },
				{ detail: { contains: q } },
				{ source: { contains: q } },
				{ requestId: { contains: q } },
			];
		}

		const logs = await prisma.appLog.findMany({
			where,
			orderBy: { ts: "desc" },
			take: limit + 1,
			...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
		});

		const hasMore = logs.length > limit;
		const page = hasMore ? logs.slice(0, limit) : logs;
		const nextCursor = hasMore ? (page[page.length - 1]?.id ?? null) : null;

		return NextResponse.json({ logs: page, nextCursor });
	} catch (error) {
		console.error("[ADMIN_LOGS_GET]", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
