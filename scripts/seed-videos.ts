// scripts\seed-videos.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	console.log("Seeding videos...");

	// Delete existing videos to prevent duplicates during testing
	await prisma.video.deleteMany({});

	const videos = [
		{
			title: "The Non-Stop Live Stream",
			url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
			thumbnail: "/images/john_shofar.jpg",
			type: "LIVE" as const,
		},
		{
			title: "Night 1: The Gathering",
			url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
			thumbnail: "/images/community_worship.jpg",
			type: "VOD" as const,
		},
		{
			title: "Morning Intercession",
			url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
			thumbnail: "/images/24elders.jpg",
			type: "VOD" as const,
		},
		{
			title: "Mass Choir Exaltation",
			url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
			thumbnail: "/images/mass-choir3.jpg",
			type: "VOD" as const,
		},
		{
			title: "Prophetic Worship Session",
			url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
			thumbnail: "/images/mass-choir10.jpg",
			type: "VOD" as const,
		},
	];

	for (const video of videos) {
		const created = await prisma.video.create({
			data: video,
		});
		console.log(`Created video: ${created.title}`);
	}

	console.log("Seeding finished.");
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
