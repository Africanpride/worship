"use client";
import { motion, useInView } from "framer-motion";
import { Calendar, Mic2, Play, Users } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { VideoPlayer } from "@/components/video-player";

type VideoType = "VOD" | "LIVE";

interface Video {
	id: string;
	title: string;
	url: string;
	thumbnail: string | null;
	type: VideoType;
	createdAt: Date;
}

interface Minister {
	id: string;
	name: string;
	role: string | null;
	image: string | null;
}

interface Event {
	id: string;
	title: string;
	slug: string;
	startDate: Date;
	endDate: Date;
	poster: string | null;
	description: string | null;
	ministers: Minister[];
	sponsors: any[];
}

interface LiveStatusResponse {
	videos: Video[];
	activeEvent: Event | null;
	nextEvent: Event | null;
	serverTime: string;
}

interface LiveDashboardProps {
	initialVideos: Video[];
	initialEvents: Event[];
}

const fetcher = (url: string) => {
	if (process.env.NODE_ENV === "development") {
		console.log(
			`[SYNC] Refreshing live status: ${new Date().toLocaleTimeString()}`,
		);
	}
	return fetch(url).then(async (res) => {
		if (!res.ok) {
			const errorText = await res.text();
			throw new Error(`API error: ${res.status} - ${errorText}`);
		}
		return res.json();
	});
};

// Helper: format a duration (ms) into a human-friendly string
// • > 1 day  → "X days, HH:MM:SS"  (or "1 day, HH:MM:SS")
// • ≤ 1 day  → "HH:MM:SS"
// • ≤ 1 hour → "MM:SS"
function formatDuration(ms: number): string {
	if (ms <= 0) return "00:00";
	const totalSecs = Math.floor(ms / 1000);
	const days = Math.floor(totalSecs / 86400);
	const h = Math.floor((totalSecs % 86400) / 3600);
	const m = Math.floor((totalSecs % 3600) / 60);
	const s = totalSecs % 60;

	const hh = h.toString().padStart(2, "0");
	const mm = m.toString().padStart(2, "0");
	const ss = s.toString().padStart(2, "0");

	if (days >= 1) {
		return `${days} ${days === 1 ? "day" : "days"}, ${hh}:${mm}:${ss}`;
	}
	if (h >= 1) {
		return `${hh}:${mm}:${ss}`;
	}
	return `${mm}:${ss}`;
}

export function LiveDashboard({
	initialVideos,
	initialEvents,
}: LiveDashboardProps) {
	const nowRef = new Date();

	// Derive initial active/next events from the server-fetched list
	const initialActiveEvent =
		initialEvents.find(
			(e) => new Date(e.startDate) <= nowRef && new Date(e.endDate) >= nowRef,
		) || null;
	const initialNextEvent =
		initialEvents
			.filter((e) => new Date(e.startDate) > nowRef)
			.sort(
				(a, b) =>
					new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
			)[0] || null;

	// Poll for live status every 60 seconds
	const { data: status } = useSWR<LiveStatusResponse>("/api/v1/sync", fetcher, {
		refreshInterval: 60000,
		fallbackData: {
			videos: initialVideos,
			activeEvent: initialActiveEvent,
			nextEvent: initialNextEvent,
			serverTime: nowRef.toISOString(),
		},
		revalidateOnMount: true,
	});

	const videos = status?.videos || initialVideos;
	const liveStream = videos.find((video) => video.type === "LIVE");
	const vods = videos.filter((video) => video.type === "VOD");

	const [selectedVideo, setSelectedVideo] = useState<Video | null>(
		liveStream || vods[0] || null,
	);

	// Fix: auto-switch when a live stream appears (removed impossible nested condition)
	useEffect(() => {
		if (liveStream && (!selectedVideo || selectedVideo.type !== "LIVE")) {
			if (process.env.NODE_ENV === "development") {
				console.log(
					`[SYNC] Auto-switching to live stream: ${liveStream.title}`,
				);
			}
			setSelectedVideo(liveStream);
		}
	}, [liveStream?.id]);

	// --- Dynamic Banner State ---
	const activeEvent = status?.activeEvent;
	const nextEvent = status?.nextEvent ?? initialNextEvent;

	// Ticking clock: updates every second for countdown & elapsed time
	const [tick, setTick] = useState(() => new Date());
	useEffect(() => {
		const timer = setInterval(() => setTick(new Date()), 1000);
		return () => clearInterval(timer);
	}, []);

	// Derived from tick
	const countdown =
		nextEvent && !activeEvent
			? formatDuration(new Date(nextEvent.startDate).getTime() - tick.getTime())
			: null;
	const elapsed = activeEvent
		? formatDuration(tick.getTime() - new Date(activeEvent.startDate).getTime())
		: null;

	// Fluctuating visitor count (feels alive)
	const [visitorCount, setVisitorCount] = useState(1243);
	useEffect(() => {
		const interval = setInterval(() => {
			setVisitorCount((prev) =>
				Math.max(
					800,
					prev +
						(Math.random() > 0.45 ? 1 : -1) * Math.floor(Math.random() * 7),
				),
			);
		}, 4000);
		return () => clearInterval(interval);
	}, []);

	const formatVisitors = (n: number) =>
		n >= 1000 ? `+${(n / 1000).toFixed(1)}k` : `+${n}`;

	// --- Scroll-triggered stagger animation refs ---
	const vodsRef = useRef(null);
	const vodsInView = useInView(vodsRef, { once: true, margin: "-80px" });
	const eventsRef = useRef(null);
	const eventsInView = useInView(eventsRef, { once: true, margin: "-80px" });

	// Shared animation variants
	const staggerContainer = (stagger = 0.08) => ({
		hidden: {},
		visible: { transition: { staggerChildren: stagger } },
	});
	const fadeUpCard = (duration = 0.5) => ({
		hidden: { opacity: 0, y: 32, scale: 0.97 },
		visible: {
			opacity: 1,
			y: 0,
			scale: 1,
			transition: {
				duration,
				ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
			},
		},
	});

	return (
		<div className="min-h-screen bg-background text-foreground selection:bg-red-600 selection:text-white pb-24">
			{/* Hero Player Section */}
			<section className="w-full relative pt-8 px-2 md:px-8 max-w-[1600px] mx-auto">
				<div className="relative z-10 w-full mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
					{/* Main Video Player Container */}
					<div className="lg:col-span-4 space-y-6">
						{/* Dynamic Priority Banner: LIVE → UP NEXT → CONTINUOUS */}
						{(activeEvent || nextEvent) && (
							<div
								className={`rounded-2xl p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-700 border ${
									activeEvent
										? "bg-red-600/10 border-red-600/20"
										: "bg-amber-500/10 border-amber-500/20"
								}`}
							>
								<div className="flex items-center gap-4">
									{/* Avatar / Icon */}
									<div className="relative shrink-0">
										<div
											className={`size-12 md:size-16 rounded-full overflow-hidden border-2 ${
												activeEvent
													? "bg-red-600 border-red-600 animate-pulse"
													: "bg-amber-500 border-amber-500"
											}`}
										>
											{(activeEvent ?? nextEvent)!.ministers?.[0]?.image ? (
												<div className="relative w-full h-full">
													<Image
														src={
															(activeEvent ?? nextEvent)!.ministers[0].image!
														}
														alt={(activeEvent ?? nextEvent)!.ministers[0].name}
														fill
														className="object-cover"
													/>
												</div>
											) : (
												<div className="flex items-center justify-center h-full">
													{activeEvent ? (
														<Mic2 className="size-6 text-white" />
													) : (
														<Calendar className="size-6 text-white" />
													)}
												</div>
											)}
										</div>
										<div
											className={`absolute -bottom-1 -right-1 text-[10px] font-black px-1.5 py-0.5 rounded text-white uppercase tracking-tighter shadow-lg ${
												activeEvent ? "bg-red-600" : "bg-amber-500"
											}`}
										>
											{activeEvent ? "Live" : "Soon"}
										</div>
									</div>

									{/* Text Info */}
									<div>
										<div className="flex items-center gap-2 mb-1">
											{activeEvent ? (
												<span className="text-red-500 text-xs font-black uppercase tracking-widest flex items-center gap-1.5">
													<span className="relative flex h-2 w-2">
														<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
														<span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
													</span>
													Now Playing
													{elapsed && (
														<span className="text-neutral-400 font-normal normal-case tracking-normal ml-1">
															· {elapsed}
														</span>
													)}
												</span>
											) : (
												<span className="text-amber-500 text-xs font-black uppercase tracking-widest flex items-center gap-1.5">
													<span className="relative flex h-2 w-2">
														<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
														<span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
													</span>
													Up Next
												</span>
											)}
										</div>
										<h2 className="text-xl md:text-2xl font-bold line-clamp-1">
											{(activeEvent ?? nextEvent)!.title}
										</h2>
										{activeEvent ? (
											<p className="text-sm text-neutral-500 font-medium">
												Ministering:{" "}
												<span className="text-foreground">
													{activeEvent.ministers
														?.map((m) => m.name)
														.join(", ") || "The Body of Christ"}
												</span>
											</p>
										) : (
											<p className="text-sm text-neutral-500 font-medium">
												Starts in:{" "}
												<span className="text-amber-400 font-mono font-bold tabular-nums">
													{countdown}
												</span>
												{" · "}
												{new Date(nextEvent!.startDate).toLocaleDateString(
													undefined,
													{ weekday: "short", month: "short", day: "numeric" },
												)}
											</p>
										)}
									</div>
								</div>

								{/* Right Side: Visitors (live only) / Countdown (upcoming) */}
								<div className="hidden md:flex flex-col items-end text-right shrink-0">
									{activeEvent ? (
										<>
											<div className="flex items-center gap-2 text-neutral-400 text-xs font-bold uppercase tracking-wider mb-2">
												<Users className="size-4" />
												Worshipping globally
											</div>
											<div className="flex -space-x-3 items-center">
												{[1, 2, 3, 4].map((i) => (
													<div
														key={i}
														className="size-8 rounded-full border-2 border-background bg-neutral-800 overflow-hidden"
													>
														<Image
															src={`https://i.pravatar.cc/100?u=${i + 10}`}
															alt="worshipper"
															width={32}
															height={32}
															className="w-full h-full grayscale opacity-60"
														/>
													</div>
												))}
												<div className="size-8 rounded-full border-2 border-background bg-red-600 flex items-center justify-center text-[10px] font-bold text-white transition-all duration-700">
													{formatVisitors(visitorCount)}
												</div>
											</div>
										</>
									) : (
										<>
											<div className="text-xs font-bold uppercase  text-neutral-400 mb-1">
												Starting In
											</div>
											<div className="font-mono text-2xl font-black text-amber-400 tabular-nums tracking-tight">
												{countdown}
											</div>
											<div className="text-xs text-neutral-500 mt-1">
												{new Date(nextEvent!.startDate).toLocaleTimeString(
													undefined,
													{ hour: "2-digit", minute: "2-digit" },
												)}
												{" · "}
												{new Date(nextEvent!.startDate).toLocaleDateString(
													undefined,
													{ month: "long", day: "numeric", year: "numeric" },
												)}
											</div>
										</>
									)}
								</div>
							</div>
						)}

						{selectedVideo ? (
							<>
								<div className="rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/5 bg-neutral-900 group/player relative">
									<VideoPlayer
										key={selectedVideo.id}
										url={selectedVideo.url}
										isLive={selectedVideo.type === "LIVE"}
										playing={true}
										thumbnail={selectedVideo.thumbnail}
									/>
									{!activeEvent && selectedVideo.type === "LIVE" && (
										<div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 z-30">
											<p className="text-xs font-bold text-white flex items-center gap-2">
												<span className="relative flex h-2 w-2">
													<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
													<span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
												</span>
												Continuous Praise & Worship is Active
											</p>
										</div>
									)}
								</div>

								<div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mt-6">
									<div>
										<h1 className="text-3xl md:text-5xl font-bebas uppercase tracking-tight">
											{selectedVideo.title}
										</h1>
										<div className="flex items-center gap-3 mt-3">
											<span
												className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${selectedVideo.type === "LIVE" ? "bg-red-600 text-white" : "bg-neutral-800 text-neutral-400"}`}
											>
												{selectedVideo.type}
											</span>
											<p className="text-neutral-500 text-sm font-medium">
												{selectedVideo.type === "LIVE"
													? "Broadcasting live from The Non-Stop Series™"
													: `Recorded session from ${new Date(selectedVideo.createdAt).toLocaleDateString()}`}
											</p>
										</div>
									</div>
									{liveStream && selectedVideo.id !== liveStream.id && (
										<button
											onClick={() => setSelectedVideo(liveStream)}
											className="group flex items-center gap-2 px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white text-sm font-black uppercase rounded-full transition-all hover:scale-105 active:scale-95 shadow-xl shadow-red-600/30 shrink-0 cursor-pointer"
										>
											<span className="relative flex h-2.5 w-2.5">
												<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
												<span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
											</span>
											View Live Stream
										</button>
									)}
								</div>
							</>
						) : (
							<div className="w-full aspect-video bg-neutral-900 rounded-xl flex items-center justify-center font-medium text-neutral-500">
								No videos available.
							</div>
						)}
					</div>
				</div>
			</section>

			{/* VOD Grid Section */}
			<section
				ref={vodsRef}
				className="w-full relative z-10 px-2 md:px-8 max-w-[1600px] mx-auto mt-16"
			>
				<motion.h2
					className="text-2xl font-semibold mb-6"
					initial={{ opacity: 0, y: 16 }}
					animate={vodsInView ? { opacity: 1, y: 0 } : {}}
					transition={{ duration: 0.5, ease: "easeOut" }}
				>
					Past Ministrations
				</motion.h2>

				{vods.length > 0 ? (
					<motion.div
						className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
						variants={staggerContainer(0.08)}
						initial="hidden"
						animate={vodsInView ? "visible" : "hidden"}
					>
						{vods.map((video) => (
							<motion.div
								key={video.id}
								variants={fadeUpCard(0.5)}
								onClick={() => setSelectedVideo(video)}
								className={`group relative aspect-video bg-neutral-900 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:ring-2 hover:ring-white/50 hover:shadow-2xl ${selectedVideo?.id === video.id ? "ring-2 ring-red-600" : "ring-1 ring-white/10"}`}
							>
								<div className="relative w-full h-full">
									<Image
										src={
											video.thumbnail ||
											"/images/placeholders/original/1600x1200-video.png"
										}
										alt={video.title}
										fill
										className="object-cover transition-opacity duration-300 group-hover:opacity-60"
									/>
								</div>

								{/* Overlay Play Icon */}
								<div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
									<div className="bg-red-600 p-4 rounded-full shadow-lg">
										<Play className="size-6 text-white fill-white ml-1" />
									</div>
								</div>

								{/* Title overlay gradient */}
								<div className=" absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black to-transparent">
									<p className="font-medium truncate text-white">
										{video.title}
									</p>
								</div>

								{/* Playing Indicator */}
								{selectedVideo?.id === video.id && (
									<div className="absolute top-2 right-2 bg-red-600 text-xs font-bold px-2 py-1 rounded shadow-md uppercase tracking-wider">
										Playing
									</div>
								)}
							</motion.div>
						))}
					</motion.div>
				) : (
					<div className="w-full py-12 text-center text-neutral-500 border border-white/10 border-dashed rounded-xl">
						Check back later for past ministrations and recorded sessions.
					</div>
				)}
			</section>

			{/* Upcoming Events Section */}
			<section
				ref={eventsRef}
				className="w-full relative z-10 px-2 md:px-8 max-w-[1600px] mx-auto mt-24"
			>
				{/* Header Section */}
				<motion.div
					className="text-left mb-16"
					initial={{ opacity: 0, y: 24 }}
					animate={eventsInView ? { opacity: 1, y: 0 } : {}}
					transition={{ duration: 0.6, ease: "easeOut" }}
				>
					<h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
						Upcoming Ministrations
					</h2>
					<p className="text-muted-foreground text-lg">
						Discover upcoming gatherings and experiences crafted for
						unforgettable moments in His presence.
					</p>
				</motion.div>

				{initialEvents.length > 0 ? (
					<>
						{/* Event Cards Grid */}
						<motion.div
							className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16"
							variants={staggerContainer(0.12)}
							initial="hidden"
							animate={eventsInView ? "visible" : "hidden"}
						>
							{initialEvents.map((event, idx) => {
								const fallbackImages = [
									"/nonstop/nonstop-032.jpg",
									"/nonstop/nonstop-038.jpg",
									"/nonstop/nonstop-054.jpg",
									"/nonstop/nonstop-009.jpg",
									"/nonstop/nonstop-011.jpg",
								];
								const displayPoster =
									event.poster || fallbackImages[idx % fallbackImages.length];

								return (
									<motion.div
										key={event.id}
										variants={fadeUpCard(0.6)}
										className="bg-none dark:bg-white/5 rounded-3xl border border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20 transition-all duration-300 overflow-hidden group flex flex-col"
									>
										<div className="relative overflow-hidden h-64 sm:h-72 w-full">
											<Image
												src={displayPoster}
												alt={event.title}
												fill
												className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
											/>
											<div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl px-3.5 py-2 text-center shadow-xl">
												<div className="text-2xl font-black text-black leading-none">
													{new Date(event.startDate).getDate()}
												</div>
												<div className="text-xs text-neutral-600 font-bold uppercase mt-1">
													{new Date(event.startDate).toLocaleString("default", {
														month: "short",
													})}
												</div>
											</div>
										</div>
										<div className="p-6 md:p-8 flex flex-col flex-grow">
											<h3 className="text-xl md:text-2xl font-bold text-foreground mb-3 group-hover:text-primary cursor-pointer  dark:group-hover:text-yellow-400 transition-colors">
												{event.title}
											</h3>
											<p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-6 line-clamp-3">
												{event.description ||
													"Join us for a powerful time of worship, prayer, and ministry as we keep the altar burning."}
											</p>

											<div className="mt-auto pt-4 flex items-center justify-between border-t border-black/10 dark:border-white/10">
												<a
													href={`/schedule#${event.slug || event.id}`}
													className="inline-flex items-center text-sm font-semibold text-teal-500 hover:text-teal-400 transition-colors group/link cursor-pointer"
												>
													View Details
													<svg
														className="ml-1.5 w-4 h-4 transition-transform group-hover/link:translate-x-1"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth="2.5"
															d="M9 5l7 7-7 7"
														></path>
													</svg>
												</a>
											</div>
										</div>
									</motion.div>
								);
							})}
						</motion.div>

						{/* See More Button */}
						<motion.div
							className="text-center"
							initial={{ opacity: 0, y: 16 }}
							animate={eventsInView ? { opacity: 1, y: 0 } : {}}
							transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
						>
							<a
								href="/schedule"
								className="inline-flex items-center px-8 py-4 text-sm font-bold text-foreground bg-transparent border-2 border-black/20 dark:border-white/20 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300 cursor-pointer"
							>
								<span>See Full Schedule</span>
								<svg
									className="ml-2 w-4 h-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2.5"
										d="M9 5l7 7-7 7"
									></path>
								</svg>
							</a>
						</motion.div>
					</>
				) : (
					<div className="w-full py-20 text-center text-muted-foreground border border-black/10 dark:border-white/10 border-dashed rounded-3xl bg-black/5 dark:bg-white/5">
						Stay tuned for our upcoming spiritual gatherings.
					</div>
				)}
			</section>
		</div>
	);
}
