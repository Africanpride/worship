import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const EXPORT_CAP = 5000;

// GET /api/admin/logs/export?format=json|csv&level=&source=&q=
// Streams the current filter (capped) as a download.
export async function GET(req: NextRequest) {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session || session.user.role !== "admin" || session.user.banned) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { searchParams } = new URL(req.url);
		const format = searchParams.get("format") === "csv" ? "csv" : "json";
		const level = searchParams.get("level");
		const source = searchParams.get("source");
		const q = searchParams.get("q")?.trim();

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
			take: EXPORT_CAP,
		});

		const stamp = new Date().toISOString().replace(/[:.]/g, "-");

		if (format === "json") {
			return new NextResponse(JSON.stringify(logs, null, 2), {
				headers: {
					"Content-Type": "application/json",
					"Content-Disposition": `attachment; filename="app-logs-${stamp}.json"`,
				},
			});
		}

		const escapeCsv = (v: unknown) => {
			const str =
				v === null || v === undefined
					? ""
					: typeof v === "object"
						? JSON.stringify(v)
						: String(v);
			return `"${str.replace(/"/g, '""')}"`;
		};

		const header = "id,ts,level,source,message,detail,requestId,userId,meta";
		const rows = logs.map((l) =>
			[
				l.id,
				l.ts.toISOString(),
				l.level,
				l.source,
				l.message,
				l.detail,
				l.requestId,
				l.userId,
				l.meta,
			]
				.map(escapeCsv)
				.join(","),
		);

		return new NextResponse([header, ...rows].join("\n"), {
			headers: {
				"Content-Type": "text/csv; charset=utf-8",
				"Content-Disposition": `attachment; filename="app-logs-${stamp}.csv"`,
			},
		});
	} catch (error) {
		console.error("[ADMIN_LOGS_EXPORT]", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
