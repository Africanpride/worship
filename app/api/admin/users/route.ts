import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { recordAuditLog } from "@/lib/audit";
import { auth } from "@/lib/auth";
import { log } from "@/lib/logger";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session || session.user.role !== "admin") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const users = await prisma.user.findMany({
			include: {
				profile: true,
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		return NextResponse.json(users);
	} catch (error) {
		log.error("auth", "Users fetch failed", {
			detail: error instanceof Error ? error.message : String(error),
		});
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}

export async function PATCH(req: NextRequest) {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session || session.user.role !== "admin") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await req.json();
		const { id, role, banned, pendingDeletion } = body;

		if (!id) {
			return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
		}

		const previous = await prisma.user.findUnique({ where: { id } });
		if (!previous) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		const updateData: Record<string, string | boolean> = {};
		if (role !== undefined) updateData.role = role;
		if (banned !== undefined) updateData.banned = banned;
		if (pendingDeletion !== undefined)
			updateData.pendingDeletion = pendingDeletion;

		const user = await prisma.user.update({
			where: {
				id,
			},
			data: updateData,
		});

		const actor = {
			id: session.user.id,
			email: session.user.email,
			name: session.user.name,
			role: session.user.role,
		};
		const base = {
			actor,
			entityType: "user",
			entityId: previous.id,
			entityLabel: previous.email,
			req,
		} as const;

		if (role !== undefined && role !== previous.role) {
			await recordAuditLog({
				...base,
				action: "user.role_change",
				before: { role: previous.role },
				after: { role },
			});
		}

		if (banned !== undefined && banned !== previous.banned) {
			await recordAuditLog({
				...base,
				action: banned ? "user.ban" : "user.unban",
				before: { banned: previous.banned },
				after: {
					banned,
					banReason: previous.banReason ?? null,
					banExpires: previous.banExpires ?? null,
				},
			});
		}

		if (
			pendingDeletion !== undefined &&
			pendingDeletion !== previous.pendingDeletion
		) {
			await recordAuditLog({
				...base,
				action: "user.delete",
				before: {
					name: previous.name,
					email: previous.email,
					pendingDeletion: previous.pendingDeletion,
				},
				after: { pendingDeletion },
				metadata: { kind: "pending_deletion_flag" },
			});
		}

		return NextResponse.json(user);
	} catch (error) {
		log.error("auth", "User update failed", {
			detail: error instanceof Error ? error.message : String(error),
		});
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}

export async function DELETE(req: NextRequest) {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session || session.user.role !== "admin") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { searchParams } = new URL(req.url);
		const id = searchParams.get("id");

		if (!id) {
			return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
		}

		const previous = await prisma.user.findUnique({ where: { id } });
		if (!previous) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		await prisma.user.delete({
			where: {
				id,
			},
		});

		await recordAuditLog({
			actor: {
				id: session.user.id,
				email: session.user.email,
				name: session.user.name,
				role: session.user.role,
			},
			action: "user.delete",
			entityType: "user",
			entityId: previous.id,
			entityLabel: previous.email,
			before: { name: previous.name, email: previous.email },
			req,
		});

		return NextResponse.json({ message: "User deleted successfully" });
	} catch (error) {
		log.error("auth", "User deletion failed", {
			detail: error instanceof Error ? error.message : String(error),
		});
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
