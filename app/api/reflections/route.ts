import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET public approved reflections
export async function GET(req: NextRequest) {
	try {
		const reflections = await prisma.reflection.findMany({
			where: {
				status: "approved",
			},
			include: {
				user: {
					select: {
						name: true,
						image: true,
					},
				},
			},
			orderBy: {
				featured: "desc",
			},
		});

		return NextResponse.json(reflections);
	} catch (error) {
		console.error("[REFLECTIONS_GET]", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}

// POST user submission
export async function POST(req: NextRequest) {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { content } = await req.json();

		if (!content || content.length < 10) {
			return NextResponse.json(
				{ error: "Reflection must be at least 10 characters long." },
				{ status: 400 },
			);
		}

		const reflection = await prisma.reflection.create({
			data: {
				userId: session.user.id,
				content,
				status: "pending",
			},
		});

		return NextResponse.json(reflection);
	} catch (error) {
		console.error("[REFLECTIONS_POST]", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
