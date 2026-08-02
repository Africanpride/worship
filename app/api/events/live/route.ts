import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
	try {
		const now = new Date();
		const liveEvent = await prisma.event.findFirst({
			where: {
				startDate: {
					lte: now,
				},
				endDate: {
					gte: now,
				},
				status: {
					not: "archived",
				},
			},
			select: {
				id: true,
			},
		});

		return NextResponse.json({ isLive: !!liveEvent });
	} catch (error) {
		console.error("[LIVE_CHECK_GET]", error);
		return NextResponse.json({ isLive: false });
	}
}
