import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/admin/audit
// Admin-only global audit log query with filtering and cursor pagination.
export async function GET(req: NextRequest) {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session || session.user.role !== "admin" || session.user.banned) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { searchParams } = new URL(req.url);
		const action = searchParams.get("action")?.trim();
		const entityType = searchParams.get("entityType")?.trim();
		const entityId = searchParams.get("entityId")?.trim();
		const actorId = searchParams.get("actorId")?.trim();
		const q = searchParams.get("q")?.trim();
		const from = searchParams.get("from");
		const to = searchParams.get("to");
		const cursor = searchParams.get("cursor");
		const limit = Math.min(
			Number.parseInt(searchParams.get("limit") || "50", 10),
			100,
		);

		const where: Record<string, unknown> = {};

		if (action && action !== "all") {
			if (action.endsWith(".*")) {
				where.action = { startsWith: action.slice(0, -2) };
			} else {
				where.action = action;
			}
		}

		if (entityType && entityType !== "all") {
			where.entityType = entityType;
		}

		if (entityId) {
			where.entityId = entityId;
		}

		if (actorId) {
			where.actorId = actorId;
		}

		if (from || to) {
			const dateFilter: Record<string, Date> = {};
			if (from) dateFilter.gte = new Date(from);
			if (to) dateFilter.lte = new Date(to);
			where.createdAt = dateFilter;
		}

		if (q) {
			where.OR = [
				{ actorName: { contains: q, mode: "insensitive" } },
				{ actorEmail: { contains: q, mode: "insensitive" } },
				{ entityLabel: { contains: q, mode: "insensitive" } },
				{ action: { contains: q, mode: "insensitive" } },
			];
		}

		const [items, totalCount] = await Promise.all([
			prisma.auditLog.findMany({
				where,
				orderBy: { createdAt: "desc" },
				take: limit + 1,
				...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
			}),
			prisma.auditLog.count({ where }),
		]);

		const hasMore = items.length > limit;
		const page = hasMore ? items.slice(0, limit) : items;
		const nextCursor = hasMore ? (page[page.length - 1]?.id ?? null) : null;

		return NextResponse.json({
			items: page,
			nextCursor,
			totalCount,
		});
	} catch (error) {
		console.error("[ADMIN_AUDIT_GET]", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
