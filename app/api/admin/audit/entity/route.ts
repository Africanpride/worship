import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/admin/audit/entity?type=<entityType>&id=<entityId>
// Admin-only chronological audit timeline for a single entity.
export async function GET(req: NextRequest) {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session || session.user.role !== "admin" || session.user.banned) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { searchParams } = new URL(req.url);
		const entityType = searchParams.get("type")?.trim();
		const entityId = searchParams.get("id")?.trim();

		if (!entityType || !entityId) {
			return NextResponse.json(
				{ error: "type and id are required" },
				{ status: 400 },
			);
		}

		const items = await prisma.auditLog.findMany({
			where: {
				entityType,
				entityId,
			},
			orderBy: { createdAt: "desc" },
			take: 100,
		});

		return NextResponse.json({ items });
	} catch (error) {
		console.error("[ADMIN_AUDIT_ENTITY_GET]", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
