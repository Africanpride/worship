import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
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
		console.error("[USERS_GET]", error);
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

		const updateData: any = {};
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

		return NextResponse.json(user);
	} catch (error) {
		console.error("[USERS_PATCH]", error);
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

		await prisma.user.delete({
			where: {
				id,
			},
		});

		return NextResponse.json({ message: "User deleted successfully" });
	} catch (error) {
		console.error("[USERS_DELETE]", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
