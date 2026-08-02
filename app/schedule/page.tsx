import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";

import UpcomingEventsList from "@/components/upcoming-events-list";
import HeroSection from "./HeroSection";

export const metadata: Metadata = {
	title: "Schedule — Upcoming Ministrations",
	description:
		"View the upcoming schedule for The Non-Stop Series™ — including dates, locations, and registration details for the next 144-hour continuous praise and worship event.",
	alternates: { canonical: "https://thenonstop.org/schedule" },
	openGraph: {
		url: "https://thenonstop.org/schedule",
		title: "Schedule — 25th Anniversary Silver Jubilee Edition",
		description:
			"25 Years of Ministry. Find out when our landmark 144-hour Silver Jubilee celebration is happening. Register now and be part of history.",
	},
};

export default async function SchedulePage() {
	const now = new Date();

	const [upcomingEvents, pastEvents] = await Promise.all([
		prisma.event.findMany({
			where: { status: "published", endDate: { gte: now } },
			orderBy: { startDate: "asc" },
		}),
		prisma.event.findMany({
			where: { status: "published", endDate: { lt: now } },
			orderBy: { startDate: "desc" },
		}),
	]);

	const nextEvent = upcomingEvents[0];
	const otherUpcoming = upcomingEvents.slice(1);

	if (!nextEvent) {
		return (
			<main className="w-full py-16 text-center">
				<h1 className="text-4xl font-bebas mb-4">Silver Jubilee Schedule</h1>
				<p className="text-muted-foreground">
					Stay tuned! We are finalizing our upcoming gathering dates.
				</p>
				{pastEvents.length > 0 && (
					<div className="mt-16">
						<UpcomingEventsList events={pastEvents} heading="Past Gatherings" isPast />
					</div>
				)}
				<div className="mt-10">
					<a
						href="/get-involved"
						className="inline-flex h-12 px-8 rounded-full bg-primary text-primary-foreground items-center font-bold text-sm cursor-pointer"
					>
						Get Involved
					</a>
				</div>
			</main>
		);
	}

	return (
		<main className="w-full" id="UpNextCard">
			<HeroSection nextEvent={nextEvent} />

			{otherUpcoming.length > 0 && (
				<div className="mt-20">
					<UpcomingEventsList events={otherUpcoming} />
				</div>
			)}

			{pastEvents.length > 0 && (
				<div className="mt-16 opacity-75">
					<UpcomingEventsList events={pastEvents} heading="Past Gatherings" isPast />
				</div>
			)}

			{/* CTA section preserved */}
			<div className="max-w-5xl mx-auto py-10 px-2 md:px-0">
				<div className="rounded-3xl p-4 sm:p-14 bg-neutral-900 border-white/10 text-center relative overflow-hidden">
					<div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
					<h2 className="text-3xl md:text-5xl font-bebas mb-4 text-white">
						Sustain the Fire
					</h2>
					<p className="text-neutral-400 mb-8 max-w-2xl mx-auto text-base sm:text-lg">
						Every hour of worship is a collective sacrifice. Join our community
						of intercessors, worshippers, and builders.
					</p>
					<a
						href="/get-involved"
						className="inline-flex items-center justify-center h-10 px-12 rounded-full bg-white text-black font-bebas text-xl tracking-wider hover:bg-neutral-200 transition-colors cursor-pointer"
					>
						Get Involved
					</a>
				</div>
			</div>
		</main>
	);
}
