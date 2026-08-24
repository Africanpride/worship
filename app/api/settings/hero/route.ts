import { NextResponse } from "next/server";
import { log } from "@/lib/logger";
import { prisma } from "@/lib/prisma";

export async function GET() {
	try {
		const settings = await prisma.heroSettings.findFirst();
		// Default values if no settings found (using the latest video ID)
		return NextResponse.json(
			settings || { videoId: "bDk_nNbccnc", startTime: 108 },
		);
	} catch (error) {
		log.error("system", "Hero settings fetch failed", {
			detail: error instanceof Error ? error.message : String(error),
		});
		// Fallback defaults on error
		return NextResponse.json({ videoId: "bDk_nNbccnc", startTime: 108 });
	}
}
