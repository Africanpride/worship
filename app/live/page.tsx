import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { LiveDashboard } from "./live-dashboard";

export const metadata: Metadata = {
	title: "Live — Watch Non-Stop Praise & Worship",
	description:
		"Watch The Non-Stop Series™ live stream — 24/7 unbroken praise and worship, intercession, and the Word. Experience continuous worship from anywhere in the world.",
	alternates: { canonical: "https://thenonstop.org/live" },
	openGraph: {
		url: "https://thenonstop.org/live",
		title: "Live Stream — 24/7 Non-Stop Praise & Worship",
		description:
			"Watch live: 144 hours of unbroken praise and worship, intercession, and the Word streaming from Accra, Ghana.",
	},
};

export const dynamic = "force-dynamic"; // Ensure fresh data on load

export default async function LivePage() {
	let videos: any[] = [];
	let events: any[] = [];

	try {
		// Fetch all videos, ordering newest first
		const [data, eventsData] = await Promise.all([
			prisma.video.findMany({
				orderBy: {
					createdAt: "desc",
				},
			}),
			prisma.event.findMany({
				where: {
					status: "published",
					endDate: {
						gt: new Date(),
					},
				},
				include: {
					ministers: true,
					sponsors: true,
				},
				orderBy: {
					startDate: "asc",
				},
			}),
		]);

		// Prisma objects to POJOs for passing to Client Component
		videos = data.map((video) => ({
			id: video.id,
			title: video.title,
			url: video.url,
			thumbnail: video.thumbnail,
			type: video.type, // VOD | LIVE
			createdAt: video.createdAt,
		}));

		events = eventsData.map((event) => ({
			id: event.id,
			title: event.title,
			slug: event.slug,
			startDate: event.startDate,
			endDate: event.endDate,
			poster: event.poster,
			description: event.description,
			status: event.status,
			ministers: event.ministers,
			sponsors: event.sponsors,
		}));
	} catch (err) {
		console.error("LivePage Data Fetch Error:", err);
		// Silent fail or potentially handle in UI with empty arrays
	}

	return <LiveDashboard initialVideos={videos} initialEvents={events} />;
}
