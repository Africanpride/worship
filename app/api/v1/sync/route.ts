import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
	const now = new Date();
	const headList = await headers();
	const referer = headList.get("referer");
	const origin = headList.get("origin");
	const userAgent = headList.get("user-agent") || "";

	// 1. Basic Protection: Origin/Referer check
	// Ensures people cannot easily embed your live data status on their own sites
	const allowedPattern = /thenonstop\.(org|net|com)|vercel\.app/;
	const isAllowedDomain =
		process.env.NODE_ENV === "development" ||
		!referer || // Allow direct or same-origin if referer is somehow missing
		allowedPattern.test(referer) ||
		(origin && allowedPattern.test(origin));

	if (!isAllowedDomain) {
		return NextResponse.json(
			{ error: "Unauthorized access source" },
			{ status: 403 },
		);
	}

	// 2. Scraping Protection: Basic User-Agent check
	// Blocks generic python/curl/automated tools that hit the endpoint without a browser UA
	const isAutomated =
		!userAgent.includes("Mozilla") && !userAgent.includes("AppleWebKit");
	if (isAutomated && process.env.NODE_ENV !== "development") {
		return NextResponse.json(
			{ error: "Automated requests are blocked" },
			{ status: 403 },
		);
	}

	try {
		const [videos, activeEvent, nextEvent] = await Promise.all([
			// Fetch all videos, ordering newest first
			prisma.video.findMany({
				orderBy: {
					createdAt: "desc",
				},
			}),
			// Find the currently active event (Now Playing)
			prisma.event.findFirst({
				where: {
					startDate: { lte: now },
					endDate: { gte: now },
					status: "published",
				},
				include: {
					ministers: true,
					sponsors: true,
				},
			}),
			// Find the next upcoming event
			prisma.event.findFirst({
				where: {
					startDate: { gt: now },
					status: "published",
				},
				orderBy: {
					startDate: "asc",
				},
				include: {
					ministers: true,
					sponsors: true,
				},
			}),
		]);

		return NextResponse.json({
			videos: videos || [],
			activeEvent: activeEvent || null,
			nextEvent: nextEvent || null,
			serverTime: now.toISOString(),
		});
	} catch (error) {
		console.error("Error in live status API:", error);
		return NextResponse.json(
			{ error: "Failed to fetch live status" },
			{ status: 500 },
		);
	}
}
