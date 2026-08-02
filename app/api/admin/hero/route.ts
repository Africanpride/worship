import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
	try {
		const h = await headers();
		const session = await auth.api.getSession({
			headers: h,
		});

		if (!session || session.user.role !== "admin") {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const settings = await prisma.heroSettings.findFirst();
		return NextResponse.json(
			settings || { videoId: "bDk_nNbccnc", startTime: 108 },
		);
	} catch (error) {
		console.error("[ADMIN_HERO_GET]", error);
		return new NextResponse("Internal Error", { status: 500 });
	}
}

export async function POST(req: Request) {
	try {
		const h = await headers();
		const session = await auth.api.getSession({
			headers: h,
		});

		if (!session || session.user.role !== "admin") {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const body = await req.json();

		const { videoId, startTime, videoSource, videoUrl } = body;

		const currentSettings = await prisma.heroSettings.findFirst();

		const data = {
			videoSource: videoSource || "youtube",
			videoId: videoId || null,
			videoUrl: videoUrl || null,
			startTime: parseInt(startTime) || 0,
		};

		let settings;
		if (currentSettings) {
			settings = await prisma.heroSettings.update({
				where: { id: currentSettings.id },
				data,
			});
		} else {
			settings = await prisma.heroSettings.create({
				data,
			});
		}

		return NextResponse.json(settings);
	} catch (error: any) {
		console.error("[ADMIN_HERO_POST]", error);
		return NextResponse.json(
			{
				error: "Internal Error",
				message: error.message,
				stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
			},
			{ status: 500 },
		);
	}
}
