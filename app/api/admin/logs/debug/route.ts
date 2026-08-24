import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// DELETE /api/admin/logs/debug — the template's "Clear Debug" action.
export async function DELETE(req: NextRequest) {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session || session.user.role !== "admin" || session.user.banned) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const result = await prisma.appLog.deleteMany({
			where: { level: "debug" },
		});

		return NextResponse.json({ deleted: result.count });
	} catch (error) {
		console.error("[ADMIN_LOGS_CLEAR_DEBUG]", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
