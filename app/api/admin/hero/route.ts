import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { recordAuditLog } from "@/lib/audit";
import { auth } from "@/lib/auth";
import { log } from "@/lib/logger";
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
		log.error("system", "Hero settings fetch failed", {
			detail: error instanceof Error ? error.message : String(error),
		});
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

		await recordAuditLog({
			actor: {
				id: session.user.id,
				email: session.user.email,
				name: session.user.name,
				role: session.user.role,
			},
			action: "settings.hero_update",
			entityType: "hero_settings",
			entityId: settings.id,
			entityLabel: "Hero Video Banner",
			before: currentSettings
				? {
						videoSource: currentSettings.videoSource,
						videoId: currentSettings.videoId,
						videoUrl: currentSettings.videoUrl,
						startTime: currentSettings.startTime,
					}
				: null,
			after: {
				videoSource: settings.videoSource,
				videoId: settings.videoId,
				videoUrl: settings.videoUrl,
				startTime: settings.startTime,
			},
			req,
		});

		return NextResponse.json(settings);
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		log.error("system", "Hero settings update failed", { detail: message });
		return NextResponse.json(
			{
				error: "Internal Error",
				message,
				stack:
					process.env.NODE_ENV === "development" && error instanceof Error
						? error.stack
						: undefined,
			},
			{ status: 500 },
		);
	}
}
