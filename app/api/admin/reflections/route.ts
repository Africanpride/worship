import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { log } from "@/lib/logger";
import { prisma } from "@/lib/prisma";

// GET admin list of all reflections
export async function GET(req: NextRequest) {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session || session.user.role !== "admin") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { searchParams } = new URL(req.url);
		const status = searchParams.get("status");

		const reflections = await prisma.reflection.findMany({
			where: status ? { status } : {},
			include: {
				user: {
					select: {
						name: true,
						email: true,
						image: true,
					},
				},
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		return NextResponse.json(reflections);
	} catch (error) {
		log.error("system", "Reflections fetch failed", {
			detail: error instanceof Error ? error.message : String(error),
		});
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}

// PATCH admin moderation (status, featured)
export async function PATCH(req: NextRequest) {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session || session.user.role !== "admin") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await req.json();
		const { id, status, featured } = body;

		if (!id) {
			return NextResponse.json(
				{ error: "Missing reflection ID" },
				{ status: 400 },
			);
		}

		const updateData: any = {};
		if (status !== undefined) updateData.status = status;
		if (featured !== undefined) updateData.featured = featured;

		const reflection = await prisma.reflection.update({
			where: { id },
			data: updateData,
		});

		return NextResponse.json(reflection);
	} catch (error) {
		log.error("system", "Reflection update failed", {
			detail: error instanceof Error ? error.message : String(error),
		});
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}

// DELETE admin reflection
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
			return NextResponse.json(
				{ error: "Missing reflection ID" },
				{ status: 400 },
			);
		}

		await prisma.reflection.delete({
			where: { id },
		});

		return NextResponse.json({ message: "Reflection deleted successfully" });
	} catch (error) {
		log.error("system", "Reflection deletion failed", {
			detail: error instanceof Error ? error.message : String(error),
		});
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
