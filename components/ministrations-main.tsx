"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { CarouselApi } from "@/components/ui/carousel";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

const ministrationsHomeProp = [
	{
		id: 1,
		title: "Sunrise Mercies: A New Sound for a New Day",
		location: "Main Sanctuary",
		year: "2024",
		category: "Recovery",
		description:
			"Welcoming the dawn with the first fruits of our lips. A refreshing session focused on the recovery of peace and the renewal of the weary soul.",
		image: "/images/24elders.jpg",
	},
	{
		id: 2,
		title: "The Midnight Altar: Deep Intercessory Worship",
		location: "Main Sanctuary",
		year: "2024",
		category: "Intercession",
		description:
			"When the world falls silent, the fire burns brightest. Experience the weight of the Presence during the quietest hours of the 144-hour sacrifice.",
		image: "/images/mass-choir8.jpg",
	},
	{
		id: 3,
		title: "Living Water: The Bible Reading Series",
		location: "Global Stream",
		year: "2024",
		category: "The Word",
		description:
			"Scripture isn't just read; it is proclaimed over our city. Witness the atmosphere shift as the Word of God is spoken without end, chapter by chapter.",
		image: "/nonstop/nonstop-055.jpg",
	},
	{
		id: 4,
		title: "New Songs: The Restoration of the Altar",
		location: "Zion Altar",
		year: "2024",
		category: "Prophetic",
		description:
			"Beyond the rehearsal—this is the sound of spontaneous revival. Catch the unscripted moments where the Spirit led us into new dimensions of spiritual recovery.",
		image: "/images/mass-choir10.jpg",
	},
	{
		id: 5,
		title: "The Sound of Victory: Mass Choir Highlights",
		location: "The Tabernacle",
		year: "2024",
		category: "High Praise",
		description:
			"A unified roar of praise that breaks every chain. Watch as hundreds of voices join together to rebuild the fallen shelter of David through high-energy exaltation.",
		image: "/images/mass-choir3.jpg",
	},
];

interface ministrationsHomeProps {
	className?: string;
}

const Ministration = ({ className }: ministrationsHomeProps) => {
	const [carouselApi, setCarouselApi] = useState<CarouselApi>();
	const [canScrollPrev, setCanScrollPrev] = useState(false);
	const [canScrollNext, setCanScrollNext] = useState(false);

	useEffect(() => {
		if (!carouselApi) return;
		const updateSelection = () => {
			setCanScrollPrev(carouselApi.canScrollPrev());
			setCanScrollNext(carouselApi.canScrollNext());
		};
		updateSelection();
		carouselApi.on("select", updateSelection);
		return () => {
			carouselApi.off("select", updateSelection);
		};
	}, [carouselApi]);

	return (
		<section className={cn("py-8", className)}>
			<div className="w-full" data-usal="fade-u duration-500">
				<div className="mb-16 max-w-6xl">
					<h1 className="text-3xl lg:text-6xl">Ministrations Spotlight</h1>
					<div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
						<p>
							In the original Tabernacle of David, the music was never meant to
							have an ending. It was a continuous, living sound designed to host
							the Presence of God. Our{" "}
							<span className="text-foreground font-medium">
								Ministrations Spotlight
							</span>{" "}
							is a window into that same eternal rhythm.
						</p>
						<p>
							Here, we celebrate the diverse voices, choirs, and ministers who
							have stepped into the 144-hour gap to offer their "sacrifice of
							praise." These are not merely performances; they are prophetic
							moments of{" "}
							<span className="italic">
								Recovery, Revival, and Restoration.
							</span>
						</p>
					</div>
				</div>
				<div className="relative w-full">
					<Carousel
						setApi={setCarouselApi}
						opts={{
							align: "start",
							loop: false,
							breakpoints: {
								"(max-width: 768px)": {
									dragFree: true,
								},
							},
						}}
						className="w-full"
					>
						<CarouselContent>
							{ministrationsHomeProp.map((project) => (
								<CarouselItem key={project.id} className="basis-auto pl-4">
									<div className="w-[350px] md:w-[600px] lg:w-[700px] space-y-4">
										<div className="aspect-video overflow-hidden rounded-xl bg-muted relative">
											<Image
												src={project.image || "/placeholder.svg"}
												alt={project.title}
												fill
												className="h-full w-full object-top object-cover transition-transform duration-500 hover:scale-105"
											/>
										</div>
										<div className="space-y-3">
											<div className="flex items-start justify-between gap-4">
												<div>
													<h2 className="text-xl md:text-2xl font-normal  ">
														{project.title}
													</h2>
													<p className="text-sm text-muted-foreground mt-1">
														{project.description}
													</p>
												</div>
												<span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
													{project.category}
												</span>
											</div>
										</div>
									</div>
								</CarouselItem>
							))}
						</CarouselContent>
					</Carousel>

					{/* Navigation Buttons */}
					<div className="pointer-events-none absolute top-[calc(50%-3rem)] left-0 right-0 z-10 flex justify-between px-4 sm:px-8">
						<Button
							size="icon"
							variant="outline"
							onClick={() => carouselApi?.scrollPrev()}
							disabled={!canScrollPrev}
							className="pointer-events-auto cursor-pointer h-12 w-12 rounded-full border-gray-200 bg-white shadow-sm hover:bg-white disabled:opacity-0 transition-opacity"
						>
							<ArrowLeft className="h-5 w-5" />
						</Button>
						<Button
							size="icon"
							variant="outline"
							onClick={() => carouselApi?.scrollNext()}
							disabled={!canScrollNext}
							className="pointer-events-auto cursor-pointer h-12 w-12 rounded-full border-gray-200 bg-white shadow-sm hover:bg-white disabled:opacity-0 transition-opacity"
						>
							<ArrowRight className="h-5 w-5" />
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
};

export { Ministration };
