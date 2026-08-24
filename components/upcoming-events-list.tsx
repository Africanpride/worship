"use client";

import type { Event } from "@prisma/client";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Calendar, ExternalLink, MapPin } from "lucide-react";
import Link from "next/link";
import { BookingDialog } from "@/components/slots/booking-dialog";

interface UpcomingEventsListProps {
	events: Event[];
	heading?: string;
	isPast?: boolean;
}

const statusStyles = {
	available: "bg-primary text-primary-foreground hover:opacity-90 shadow-sm",
	"sold-out":
		"bg-neutral-800 text-neutral-400 border border-white/5 cursor-default",
	presale: "bg-white/5 text-neutral-300 border border-white/10 italic",
	past: "bg-neutral-800/10  border border-white/10 cursor-default",
};

const statusLabels = {
	available: "Register",
	"sold-out": "Full Capacity",
	presale: "Coming Soon",
	past: "Concluded",
};

export default function UpcomingEventsList({
	events,
	heading = "More Silver Jubilee Gatherings",
	isPast = false,
}: UpcomingEventsListProps) {
	if (events.length === 0) return null;

	return (
		<div className="w-full py-6 px-2 md:px-0">
			<div className="max-w-5xl mx-auto">
				<div className="flex items-center gap-4 mb-8">
					<h2 className="text-3xl md:text-5xl font-bebas tracking-wider uppercase">
						{heading}
					</h2>
					<div className="h-[2px] bg-border flex-grow mt-2" />
				</div>

				<div className="space-y-4">
					{events.map((event, i) => {
						const date = new Date(event.startDate);
						const day = format(date, "dd");
						const month = format(date, "MMM").toUpperCase();

						const status: keyof typeof statusStyles = isPast
							? "past"
							: event.registrationUrl
								? "available"
								: "presale";

						return (
							<motion.div
								key={event.id}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.5, delay: i * 0.08 }}
								className={`flex flex-col md:flex-row md:items-center md:justify-between group rounded-2xl p-6 border bg-card/50 backdrop-blur-sm hover:border-primary/50 hover:shadow-lg transition-all duration-300 ${
									event.status === "sold-out" ? "opacity-50" : ""
								}`}
							>
								{/* Date column */}
								<div className="flex-shrink-0 mb-4 md:mb-0 md:mr-10 flex flex-row md:flex-col items-center md:items-start gap-2 md:gap-0">
									<div className="text-4xl md:text-5xl font-bebas text-amber-400 leading-none">
										{day}
									</div>
									<div className="text-sm font-opensans text-muted-foreground uppercase tracking-widest">
										{month}
									</div>
								</div>

								{/* Info column */}
								<div className="flex-grow space-y-1">
									<div className="flex items-center gap-2 text-[10px] md:text-xs font-opensans text-primary/70 uppercase tracking-[0.2em] font-bold">
										<MapPin className="size-3 text-amber-400/70" />
										{event.location || "To Be Announced"}
									</div>
									<h3 className="text-2xl md:text-3xl font-bebas text-foreground group-hover:text-primary transition-colors">
										{event.title}
									</h3>
									<div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] md:text-xs font-opensans text-muted-foreground/80 font-medium">
										<span className="flex items-center gap-1">
											<Calendar className="size-3 text-amber-400/60" />
											{format(date, "MMM d, yyyy")} @ {format(date, "h:mm aa")}
										</span>
										<span className="flex items-center gap-1 text-amber-400/40 text-[8px] uppercase tracking-widest font-bold">
											until
										</span>
										<span className="flex items-center gap-1">
											<Calendar className="size-3 text-amber-400/60" />
											{format(new Date(event.endDate), "MMM d, yyyy")} @{" "}
											{format(new Date(event.endDate), "h:mm aa")}
										</span>
									</div>
									{event.tagline && (
										<p className="text-[11px] md:text-[13px] font-opensans text-muted-foreground/60 line-clamp-1 italic">
											{event.tagline}
										</p>
									)}
								</div>

								{/* Action column */}
								<div className="flex-shrink-0 mt-6 md:mt-0 flex items-center gap-3">
									{!isPast &&
										event.bookingOpen &&
										new Date(event.endDate).getTime() > Date.now() && (
											<BookingDialog
												eventId={event.id}
												eventTitle={event.title}
												variant="outline"
												className="rounded-full font-opensans font-bold text-xs uppercase tracking-wider px-6"
											/>
										)}
									{event.registrationUrl ? (
										<Link
											href={event.registrationUrl}
											target="_blank"
											className={`inline-flex items-center gap-2 px-8 py-3 rounded-full font-opensans font-bold text-xs uppercase tracking-wider transition-all transform active:scale-95 cursor-pointer ${statusStyles[status]}`}
										>
											{statusLabels[status]}
											<ExternalLink size={14} />
										</Link>
									) : (
										<span
											className={`inline-flex items-center gap-2 px-8 py-3 rounded-full font-opensans font-bold text-xs uppercase tracking-wider ${statusStyles[status]}`}
										>
											{statusLabels[status]}
										</span>
									)}
								</div>
							</motion.div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
