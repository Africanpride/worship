import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withDbRetry } from "@/lib/with-db-retry";

// Polled frequently (live indicator) — serve from the cache between revalids
// instead of hitting Atlas on every request.
export const revalidate = 30;

export async function GET() {
	try {
		const now = new Date();
		const liveEvent = await withDbRetry(() =>
			prisma.event.findFirst({
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
			}),
		);

		return NextResponse.json({ isLive: !!liveEvent });
	} catch (error) {
		console.error("[LIVE_CHECK_GET]", error);
		return NextResponse.json({ isLive: false });
	}
}
