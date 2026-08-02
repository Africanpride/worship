import { MessageSquareQuote, Sparkles } from "lucide-react";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

async function getFeaturedReflections() {
	try {
		return await prisma.reflection.findMany({
			where: {
				status: "approved",
				featured: true,
			},
			include: {
				user: {
					select: {
						name: true,
						image: true,
					},
				},
			},
			orderBy: {
				updatedAt: "desc",
			},
		});
	} catch (error) {
		console.error("Failed to fetch featured reflections", error);
		return [];
	}
}

const CreateCard = ({ card }: { card: any }) => (
	<div className="p-4 rounded-2xl mx-4 bg-background/50 backdrop-blur-sm border border-border/50  shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)] w-[300px] shrink-0 relative overflow-hidden group">
		{/* Subtle gradient overlay on hover */}
		<div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 via-transparent to-amber-500/0 group-hover:from-amber-500/5 group-hover:to-amber-500/10 transition-colors duration-500 rounded-2xl" />

		<div className="flex gap-3 mb-4">
			<div className="relative">
				{card.user?.image ? (
					<Image
						className="size-11 rounded-full object-cover border border-border"
						src={card.user.image}
						alt={card.user.name || "User"}
						width={44}
						height={44}
						unoptimized
					/>
				) : (
					<div className="size-11 rounded-full bg-muted flex items-center justify-center border border-border">
						<span className="font-bold text-muted-foreground">
							{card.user?.name?.[0] || "?"}
						</span>
					</div>
				)}
				<div className="absolute -bottom-1 -right-1 bg-amber-500 rounded-full p-0.5 border-2 border-background">
					<Sparkles className="size-2.5 text-white" />
				</div>
			</div>
			<div className="flex flex-col justify-center">
				<div className="flex items-center gap-1">
					<p className="font-bold text-sm tracking-tight">
						{card.user?.name || "Participant"}
					</p>
				</div>
				<span className="text-xs text-muted-foreground">Participant</span>
			</div>
		</div>
		<div className="relative">
			<MessageSquareQuote className="absolute -top-1 -left-1 size-5 text-muted/30 rotate-180" />
			<p className="text-xs py-1 text-foreground/80 font-medium line-clamp-4 relative z-10">
				"{card.content}"
			</p>
		</div>
	</div>
);

export default async function FeaturedReflections() {
	let cardsData = await getFeaturedReflections();

	// Hide the entire section if no featured reflections exist
	if (!cardsData || cardsData.length === 0) {
		return null;
	}

	// If there are only a few reflections, duplicate them to ensure smooth marquee scrolling
	if (cardsData.length > 0 && cardsData.length < 6) {
		const duplicated = [...cardsData];
		while (duplicated.length < 6) {
			duplicated.push(...cardsData);
		}
		cardsData = duplicated;
	}

	return (
		<div
			className="w-full py-20 pb-24 overflow-hidden"
			data-usal="fade-u duration-500"
		>
			<div className="container mx-auto mb-10 lg:text-left">
				<h2 className="text-3xl md:text-5xl mb-4">
					One Sacrifice, Global <span className="text-primary">Voices</span>
				</h2>
				<p className="text-muted-foreground md:text-lg max-w-3xl">
					Experience the stories of transformation and breakthrough from the
					Non-Stop Series&trade; unbroken sacrifice of praise. Read what God is
					doing across the globe.
				</p>
			</div>

			<style>{`
        @keyframes marqueeScroll {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
        }

        .marquee-inner {
            animation: marqueeScroll 45s linear infinite;
        }

        .marquee-inner:hover {
            animation-play-state: paused;
        }

        .marquee-reverse {
            animation-direction: reverse;
        }
      `}</style>

			{/* Primary Forward Scrolling Marquee */}
			<div className="marquee-row w-full mx-auto max-w-[100vw] overflow-hidden relative">
				<div className="absolute left-0 top-0 h-full w-24 md:w-48 z-10 pointer-events-none bg-gradient-to-r from-background to-transparent"></div>
				<div className="marquee-inner flex transform-gpu min-w-[200%] pt-2 pb-5">
					{/* Double the array to ensure seamless infinite looping */}
					{[...cardsData, ...cardsData].map((card, index) => (
						<CreateCard key={`forward-${card.id}-${index}`} card={card} />
					))}
				</div>
				<div className="absolute right-0 top-0 h-full w-24 md:w-48 z-10 pointer-events-none bg-gradient-to-l from-background to-transparent"></div>
			</div>

			{cardsData.length > 3 && (
				<div className="marquee-row w-full mx-auto max-w-[100vw] overflow-hidden relative -mt-2">
					<div className="absolute left-0 top-0 h-full w-24 md:w-48 z-10 pointer-events-none bg-gradient-to-r from-background to-transparent"></div>
					<div className="marquee-inner marquee-reverse flex transform-gpu min-w-[200%] pt-2 pb-5">
						{[...cardsData, ...cardsData].reverse().map((card, index) => (
							<CreateCard key={`reverse-${card.id}-${index}`} card={card} />
						))}
					</div>
					<div className="absolute right-0 top-0 h-full w-24 md:w-48 z-10 pointer-events-none bg-gradient-to-l from-background to-transparent"></div>
				</div>
			)}
		</div>
	);
}
