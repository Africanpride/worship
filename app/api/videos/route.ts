import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { log } from "@/lib/logger";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
	try {
		const videos = await prisma.video.findMany({
			orderBy: { createdAt: "desc" },
		});
		return NextResponse.json(videos);
	} catch (error) {
		log.error("system", "Videos fetch failed", {
			detail: error instanceof Error ? error.message : String(error),
		});
		return NextResponse.json(
			{ error: "Failed to fetch videos" },
			{ status: 500 },
		);
	}
}

export async function POST(req: NextRequest) {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session || session.user.role !== "admin") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { title, url, thumbnail, type } = await req.json();

		if (!title || !url) {
			return NextResponse.json(
				{ error: "Title and URL are required" },
				{ status: 400 },
			);
		}

		const video = await prisma.video.create({
			data: {
				title,
				url,
				thumbnail,
				type: type || "VOD",
			},
		});

		return NextResponse.json(video);
	} catch (error) {
		log.error("system", "Video creation failed", {
			detail: error instanceof Error ? error.message : String(error),
		});
		return NextResponse.json(
			{ error: "Failed to create video" },
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

		const { id, title, url, thumbnail, type } = await req.json();

		if (!id) {
			return NextResponse.json({ error: "ID is required" }, { status: 400 });
		}

		const video = await prisma.video.update({
			where: { id },
			data: {
				title,
				url,
				thumbnail,
				type,
			},
		});

		return NextResponse.json(video);
	} catch (error) {
		log.error("system", "Video update failed", {
			detail: error instanceof Error ? error.message : String(error),
		});
		return NextResponse.json(
			{ error: "Failed to update video" },
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
			return NextResponse.json({ error: "ID is required" }, { status: 400 });
		}

		await prisma.video.delete({
			where: { id },
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		log.error("system", "Video deletion failed", {
			detail: error instanceof Error ? error.message : String(error),
		});
		return NextResponse.json(
			{ error: "Failed to delete video" },
			{ status: 500 },
		);
	}
}
