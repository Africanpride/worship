import { format } from "date-fns";
import { Calendar, MapPin } from "lucide-react";
import Image from "next/image";
import type React from "react";

interface Minister {
	name: string;
	role?: string | null;
	image?: string | null;
}

interface Event {
	id: string;
	title: string;
	slug: string;
	startDate: Date | string;
	endDate: Date | string;
	poster?: string | null;
	description?: string | null;
	tagline?: string | null;
	location?: string | null;
	category?: string | null;
	registrationUrl?: string | null;
	status: string;
	ministers?: Minister[];
}

interface UpNextCardProps {
	event: Event;
}

export const UpNextCard: React.FC<UpNextCardProps> = ({ event }) => {
	const start = new Date(event.startDate);
	const end = new Date(event.endDate);

	return (
		<div className="flex flex-col md:flex-row rounded-2xl overflow-hidden border shadow-sm bg-card text-card-foreground hover:shadow-md transition-shadow duration-300">
			{/* Date Strip — horizontal on mobile, vertical column on md+ */}
			<div className="flex flex-row items-center justify-center gap-3 md:flex-col md:justify-center md:items-center py-6 px-6 md:py-10 md:w-32 lg:w-40 bg-primary text-primary-foreground font-bold uppercase leading-none shrink-0">
				<div className="text-sm md:text-xl opacity-90">
					{format(start, "MMM")}
				</div>
				<div className="text-4xl md:text-6xl lg:text-7xl font-black tabular-nums">
					{format(start, "d")}
				</div>
				<div className="text-sm md:text-lg opacity-80">
					{format(start, "yyyy")}
				</div>
			</div>

			{/* Content Column */}
			<div className="p-6 sm:p-8 flex flex-col gap-5 w-full">
				<div className="flex flex-col gap-2">
					{event.category && (
						<span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary w-fit uppercase tracking-wider">
							{event.category}
						</span>
					)}
					<h2 className="text-2xl sm:text-3xl lg:text-4xl text-foreground">
						{event.title}
					</h2>
					{event.tagline && (
						<p className="text-sm sm:text-base text-primary/80 italic font-medium">
							{event.tagline}
						</p>
					)}
				</div>

				{event.description && (
					<div className="text-sm sm:text-base text-muted-foreground leading-relaxed line-clamp-3">
						{event.description}
					</div>
				)}

				<div className="pt-4 border-t flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-muted-foreground">
					<div className="flex items-center gap-2">
						<Calendar className="shrink-0 h-4 w-4 text-primary" />
						<span className="font-medium">
							{format(start, "MMMM d")} – {format(end, "d, yyyy")} &bull;{" "}
							{format(start, "p")}
						</span>
					</div>
					<div className="flex items-center gap-2">
						<MapPin className="shrink-0 h-4 w-4 text-primary" />
						<span className="font-medium">
							{event.location || "Location To Be Announced"}
						</span>
					</div>
				</div>

				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-2">
					{event.ministers && event.ministers.length > 0 && (
						<div className="flex -space-x-2 overflow-hidden">
							{event.ministers.map((minister, idx) => (
								<div
									key={idx}
									className="inline-block relative group"
									title={`${minister.name}${minister.role ? ` - ${minister.role}` : ""}`}
								>
									{minister.image ? (
										<div className="h-10 w-10 relative">
											<Image
												src={minister.image}
												alt={minister.name}
												fill
												sizes="40px"
												className="rounded-full border-2 border-background object-cover ring-1 ring-border"
											/>
										</div>
									) : (
										<div className="h-10 w-10 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-bold ring-1 ring-border">
											{minister.name.charAt(0)}
										</div>
									)}
								</div>
							))}
						</div>
					)}

					{event.registrationUrl && (
						<a
							href={event.registrationUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
						>
							Register Now
						</a>
					)}
				</div>
			</div>
		</div>
	);
};
