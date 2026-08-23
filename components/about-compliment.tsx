"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import type {
	JSXElementConstructor,
	ReactElement,
	ReactNode,
	ReactPortal,
} from "react";
import {
	Marquee,
	MarqueeContent,
	MarqueeFade,
	MarqueeItem,
} from "@/components/kibo-ui/marquee";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MotionImage = motion.create(Image);

interface AboutComplimentProps {
	className?: string;
	title?: string;
	description?: string;
	mainImage?: {
		src: string;
		alt: string;
	};
	secondaryImage?: {
		src: string;
		alt: string;
	};
	breakout?: {
		src?: string;
		alt?: string;
		title?: string;
		description?: string;
		buttonText?: string;
		buttonUrl?: string;
	};
	companies?: Array<{
		src: string;
		alt: string;
	}> | null;
	achievementsTitle?: string;
	achievementsDescription?: string;
	achievements?: Array<{
		label: string;
		value: string;
	}>;
	contentSections?: Array<{
		title: string;
		content: string;
	}>;
}

const AboutCompliment = ({
	className,
	title = "Why the Tabernacle of David?",
	description = "Thousands of years ago, King David set a precedent: 24/7 worship without a veil. He understood that God inhabits the praises of His people. At The Non-Stop, we are stepping into that ancient rhythm. For 144 hours, we remove the distractions of the world to sit at His feet, just as they did in the city of Zion. When the worship is non-stop, the atmosphere changes. Lives are recovered. Spirits are revived.",
	mainImage = {
		src: "/nonstop/nonstop-040.jpg",
		alt: "worship group",
	},
	secondaryImage = {
		src: "/images/akosua.jpg",
		alt: "worship ministration",
	},
	breakout = {
		src: "/images/music2.svg",
		alt: "logo",
		title: "Logos-Rhema Foundation",
		description:
			"For 22 years, the Logos-Rhema Foundation has spearheaded spiritual revival through the Non-Stop Series across Ghana and beyond.",
		buttonText: "Our Mission",
		buttonUrl: "/about/#mission",
	},
	companies = [
		{
			src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-1.svg",
			alt: "Arc",
		},
		{
			src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-2.svg",
			alt: "Descript",
		},
		// {
		//   src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-3.svg",
		//   alt: "Mercury",
		// },
		// {
		//   src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-4.svg",
		//   alt: "Ramp",
		// },
		// {
		//   src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-5.svg",
		//   alt: "Retool",
		// },
		// {
		//   src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-6.svg",
		//   alt: "Watershed",
		// },
	],
	achievementsTitle = "A Legacy of Sacred Worship",
	achievementsDescription = "What began as a 24-hour sacrifice has grown into a 144-hour global movement, restoring the altar of praise and transforming countless lives.",
	achievements = [
		{ label: "Faithful Years ", value: "22+" },
		{ label: "Hours per Session", value: "144h" },
		{ label: "Global Souls Met", value: "500k+" },
		{ label: "Ministries United", value: "30+" },
	],
	contentSections = [
		{
			title: "Vision Statement: The Altar of Restoration",
			content: `"In that day I will restore David’s fallen shelter—I will repair its broken walls and restore its ruins—and will rebuild it as it used to be." — Amos 9:11

       The Non-Stop is more than a gathering; it is a prophetic response to a divine mandate. Just as King David established a tent where worship ascended 24/7 without a veil, we are setting a stage for Recovery, Revival, and Restoration.`,
		},
		{
			title: "The Non-Stop is more than a gathering",
			content: `For 144 hours, we refuse to let the fire go out. We believe that as we saturate the atmosphere with the Word (Bible Reading) and the Sound (Praise & Worship), the "fallen shelter" is repaired in our personal lives, our families, and our nation.`,
		},
	],
}: AboutComplimentProps) => {
	return (
		<section id="why-the-tabernacle" className={cn("py-16 ", className)}>
			<div className="container space-y-7">
				<div
					className="mb-14 flex flex-col gap-5 lg:w-4/5 "
					data-usal="fade-u split-delay-10"
				>
					<h1 className="text-5xl lg:text-6xl">{title}</h1>
					<p className="text-xl text-muted-foreground md:text-xl">
						{description}
					</p>
				</div>
				<motion.div
					className="grid gap-4 lg:grid-cols-3"
					initial="hidden"
					whileInView="show"
					viewport={{ once: false, amount: 0.2 }}
					variants={{
						hidden: { opacity: 0 },
						show: {
							opacity: 1,
							transition: {
								staggerChildren: 0.2,
							},
						},
					}}
				>
					<div className="relative aspect-square md:aspect-video lg:aspect-auto lg:col-span-2 overflow-hidden rounded-xl lg:min-h-[500px]">
						<motion.div
							className="relative size-full"
							variants={{
								hidden: { opacity: 0, y: 50 },
								show: {
									opacity: 1,
									y: 0,
									transition: { duration: 0.8, ease: "easeOut" },
								},
							}}
						>
							<Image
								src={mainImage.src}
								alt={mainImage.alt}
								fill
								priority
								sizes="(max-width: 1024px) 100vw, 66vw"
								className="object-cover object-top"
							/>
						</motion.div>
					</div>
					<div className="flex flex-col gap-4 md:flex-row lg:flex-col lg:h-full ">
						<motion.div
							className="flex flex-col justify-between gap-6 rounded-xl bg-muted p-7 md:w-1/2 lg:w-auto"
							variants={{
								hidden: { opacity: 0, y: 50 },
								show: {
									opacity: 1,
									y: 0,
									transition: { duration: 0.8, ease: "easeOut" },
								},
							}}
						>
							<div className="relative h-12 w-32 dark:invert">
								<Image
									src={breakout.src || ""}
									alt={breakout.alt || ""}
									fill
									sizes="128px"
									className="object-contain object-left"
								/>
							</div>
							<div>
								<p className="mb-2 text-xl font-semibold">{breakout.title}</p>
								<p className="text-muted-foreground">{breakout.description}</p>
							</div>
							<Button variant="outline" className="mr-auto" asChild>
								<a
									href={breakout.buttonUrl}
									target="_blank"
									rel="noopener"
									className="cursor-pointer"
								>
									{breakout.buttonText}
								</a>
							</Button>
						</motion.div>
						<div className="relative grow rounded-xl overflow-hidden min-h-80 md:w-1/2 lg:w-auto lg:min-h-0 lg:h-full">
							<motion.div
								className="relative size-full min-h-[300px]"
								variants={{
									hidden: { opacity: 0, y: 50 },
									show: {
										opacity: 1,
										y: 0,
										transition: { duration: 0.8, ease: "easeOut" },
									},
								}}
							>
								<Image
									src={secondaryImage.src}
									alt={secondaryImage.alt}
									fill
									sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
									className="object-cover object-top"
								/>
							</motion.div>
						</div>
					</div>
				</motion.div>
				<div className="hidden">
					{companies && (
						<div className="py-16 ">
							<Marquee>
								<MarqueeContent speed={40}>
									{companies.map((company, idx) => (
										<MarqueeItem
											key={company.src + idx}
											className="mx-8 flex items-center"
										>
											<div className="relative h-7 w-24 md:h-8 dark:invert">
												<Image
													src={company.src || ""}
													alt={company.alt || ""}
													fill
													sizes="96px"
													className="object-contain"
												/>
											</div>
										</MarqueeItem>
									))}
								</MarqueeContent>
								<MarqueeFade side="left" />
								<MarqueeFade side="right" />
							</Marquee>
						</div>
					)}
				</div>
				<div
					className="relative overflow-hidden rounded-xl bg-muted p-7 md:p-16"
					data-usal="fade-u duration-500"
				>
					<div className="flex flex-col gap-4 text-center md:text-left mb-8 border-b border-border/40 pb-8">
						<span className="text-amber-500 font-mono text-xs uppercase tracking-widest font-bold">
							144 Hours • Multiple Nations • One Altar • One King
						</span>
						<h2 className="text-3xl font-medium md:text-4xl">
							The Fire Must Not Go Out
						</h2>
						<p className="text-muted-foreground text-base md:text-lg max-w-3xl leading-relaxed">
							For over two decades, the Non-Stop Series has brought together
							believers from around the world to sustain continuous worship
							before the Lord. What began as a 24-hour gathering has grown into
							a global movement of praise, worship, prayer, and Scripture
							reading — calling individuals, families, communities, cities, and
							nations to recover, revive, and restore the Tabernacle of David in
							our generation.
						</p>
					</div>
					<div className="flex flex-col gap-4 text-center md:text-left">
						<h3 className="text-2xl font-medium md:text-3xl">
							{achievementsTitle}
						</h3>
						<p className="max-w-xl text-muted-foreground">
							{achievementsDescription}
						</p>
					</div>
					<div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 md:flex md:flex-wrap md:justify-between">
						{achievements.map(
							(
								item: {
									label:
										| string
										| number
										| bigint
										| boolean
										| ReactElement<unknown, string | JSXElementConstructor<any>>
										| Iterable<ReactNode>
										| ReactPortal
										| Promise<
												| string
												| number
												| bigint
												| boolean
												| ReactPortal
												| ReactElement<
														unknown,
														string | JSXElementConstructor<any>
												  >
												| Iterable<ReactNode>
												| null
												| undefined
										  >
										| null
										| undefined;
									value:
										| string
										| number
										| bigint
										| boolean
										| ReactElement<unknown, string | JSXElementConstructor<any>>
										| Iterable<ReactNode>
										| ReactPortal
										| Promise<
												| string
												| number
												| bigint
												| boolean
												| ReactPortal
												| ReactElement<
														unknown,
														string | JSXElementConstructor<any>
												  >
												| Iterable<ReactNode>
												| null
												| undefined
										  >
										| null
										| undefined;
								},
								idx: any,
							) => (
								<div
									className="flex flex-col gap-2 text-center md:text-left"
									key={item.label + idx}
								>
									<span className="font-mono text-4xl font-semibold md:text-5xl">
										{item.value}
									</span>
									<p className="text-sm md:text-base">{item.label}</p>
								</div>
							),
						)}
					</div>
				</div>
			</div>
		</section>
	);
};

export { AboutCompliment };
