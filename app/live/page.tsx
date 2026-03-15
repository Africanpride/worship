import { prisma } from "@/lib/prisma";
import { LiveDashboard } from "./live-dashboard";

export const dynamic = "force-dynamic"; // Ensure fresh data on load

export default async function LivePage() {
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
  const videos = data.map((video) => ({
    id: video.id,
    title: video.title,
    url: video.url,
    thumbnail: video.thumbnail,
    type: video.type, // VOD | LIVE
    createdAt: video.createdAt,
  }));

  const events = eventsData.map((event) => ({
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

  return <LiveDashboard videos={videos} events={events} />;
}
