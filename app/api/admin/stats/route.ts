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

		// 1. Total User Metrics
		const totalUsers = await prisma.user.count();
		const recentUsers = await prisma.user.findMany({
			take: 5,
			orderBy: { createdAt: "desc" },
			select: {
				id: true,
				name: true,
				email: true,
				image: true,
				createdAt: true,
				role: true,
			},
		});

		// 2. Volunteer Metrics
		const totalVolunteers = await prisma.profile.count({
			where: {
				volunteerAreas: {
					isEmpty: false,
				},
			},
		});

		// 3. Event Metrics
		const totalEvents = await prisma.event.count();
		const upcomingEvents = await prisma.event.findMany({
			where: {
				startDate: {
					gt: new Date(),
				},
			},
			take: 3,
			orderBy: { startDate: "asc" },
		});

		// 4. Hero Visibility (What the public sees)
		const heroSettings = await prisma.heroSettings.findFirst();

		return NextResponse.json({
			stats: {
				totalUsers,
				totalVolunteers,
				totalEvents,
				upcomingEventsCount: upcomingEvents.length,
			},
			recentUsers,
			upcomingEvents,
			heroSettings,
		});
	} catch (error) {
		console.error("[STATS_GET]", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
