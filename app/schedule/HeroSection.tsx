"use client";

import type { Event } from "@prisma/client";
import { format } from "date-fns";
import { motion } from "framer-motion";
import Image from "next/image";
import { BookingDialog } from "@/components/slots/booking-dialog";

interface HeroSectionProps {
	nextEvent: Event;
}

export default function HeroSection({ nextEvent }: HeroSectionProps) {
	const startDate = new Date(nextEvent.startDate);
	const day = format(startDate, "dd");
	const month = format(startDate, "MMM");
	const year = format(startDate, "yyyy");

	return (
		<div className="w-full min-h-dvh relative flex flex-col justify-end pt-32 pb-12 sm:pb-20 overflow-hidden">
			<div className="absolute inset-0 scale-110">
				<Image
					src="/images/community_worship2.jpg"
					alt="Background worship atmosphere"
					fill
					sizes="100vw"
					priority
					className="object-cover"
					style={{
						filter: "blur(1.5px)",
					}}
				/>
			</div>
			<div className="absolute inset-0 bg-black/60" />

			{/* Hero Content */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8, ease: "easeOut" }}
				className="relative z-10 max-w-5xl mx-auto w-full px-4 mb-8 sm:mb-12"
			>
				<p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-primary mb-2 font-bold">
					Next Event
				</p>
				<h1 className="text-4xl sm:text-7xl font-bebas text-white leading-tight tracking-wider">
					{nextEvent.title}
				</h1>
			</motion.div>

			{/* Main Event Card */}
			<motion.div
				initial={{ opacity: 0, y: 40 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
				className="max-w-6xl mx-auto w-full px-4 relative z-20"
			>
				<div className="flex flex-col md:flex-row rounded-3xl overflow-hidden shadow-2xl bg-card text-card-foreground border border-white/10 md:border-4">
					{/* Date Strip */}
					<div className="flex flex-row items-center justify-center gap-3 md:flex-col md:justify-center md:items-center py-6 px-8 md:py-12 md:w-1/4 bg-primary text-primary-foreground font-bebas shrink-0">
						<div className="text-xl md:text-3xl">{month}</div>
						<div className="text-5xl md:text-9xl font-bold leading-none">
							{day}
						</div>
						<div className="text-xl md:text-2xl">{year}</div>
					</div>

					{/* Content Column */}
					<div className="p-6 sm:p-10 flex flex-col gap-6 flex-1 bg-black backdrop-blur-xl">
						<div className="space-y-2">
							<h2 className="text-2xl sm:text-4xl font-bebas tracking-wide text-white">
								{nextEvent.tagline || nextEvent.title}
							</h2>
							{nextEvent.category && (
								<div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest border border-primary/20">
									{nextEvent.category}
								</div>
							)}
						</div>

						<div className="text-sm sm:text-base text-gray-300 leading-relaxed space-y-4">
							{nextEvent.description ? (
								<div
									className="prose prose-invert max-w-none text-gray-300"
									dangerouslySetInnerHTML={{
										__html: nextEvent.description.replace(/\n/g, "<br/>"),
									}}
								/>
							) : (
								<p>
									Experience unbroken worship, deep intercession, and the raw
									presence of God. Join us as we press into the heart of the
									Father together.
								</p>
							)}
						</div>

						<div className="pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-gray-400">
							<div className="flex items-center gap-3">
								<div className="bg-white/5 p-2 rounded-lg">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="18"
										height="18"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
										className="text-primary"
									>
										<rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
										<line x1="16" x2="16" y1="2" y2="6" />
										<line x1="8" x2="8" y1="2" y2="6" />
										<line x1="3" x2="21" y1="10" y2="10" />
									</svg>
								</div>
								<div className="grid grid-cols-2 gap-4 flex-1">
									<div>
										<p className="font-bold text-white">Starts</p>
										<p className="font-medium text-gray-300 leading-tight">
											{format(startDate, "MMMM d, yyyy")}
											<span className="block text-xs text-gray-500 mt-0.5 tracking-wider">
												@ {format(startDate, "h:mm aa")}
											</span>
										</p>
									</div>
									<div>
										<p className="font-bold text-white">Ends</p>
										<p className="font-medium text-gray-300 leading-tight">
											{format(new Date(nextEvent.endDate), "MMMM d, yyyy")}
											<span className="block text-xs text-gray-500 mt-0.5 tracking-wider">
												@ {format(new Date(nextEvent.endDate), "h:mm aa")}
											</span>
										</p>
									</div>
								</div>
							</div>
							<div className="flex items-center gap-3">
								<div className="bg-white/5 p-2 rounded-lg">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="18"
										height="18"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
										className="text-primary"
									>
										<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
										<circle cx="12" cy="10" r="3" />
									</svg>
								</div>
								<div>
									<p className="font-bold text-white">Location</p>
									<p className="text-gray-300">
										{nextEvent.location || "Online / To Be Announced"}
									</p>
								</div>
							</div>
						</div>

						<div className="pt-4 flex flex-wrap items-center gap-3">
							{nextEvent.registrationUrl && (
								<a
									href={nextEvent.registrationUrl}
									target="_blank"
									className="inline-flex h-14 px-10 rounded-full bg-primary text-primary-foreground items-center font-bebas text-xl tracking-wider hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-95 cursor-pointer"
									rel="noopener"
								>
									Register Now
								</a>
							)}
							{nextEvent.bookingOpen && (
								<BookingDialog
									eventId={nextEvent.id}
									eventTitle={nextEvent.title}
									className="h-14 px-10 rounded-full font-bebas text-xl tracking-wider bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all active:scale-95"
								/>
							)}
						</div>
					</div>
				</div>
			</motion.div>
		</div>
	);
}
