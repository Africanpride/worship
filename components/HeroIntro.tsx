import Image from "next/image";
import React from "react";

export type HeroImage = {
	src: string;
	alt: string;
	/** Optional Tailwind bg color class for the image wrapper, e.g. "bg-primary" */
	bgClass?: string;
};

export type HeroIntroProps = {
	heading: string;
	description: string;
	ctaLabel?: string;
	ctaHref?: string;
	/** Up to 6 images displayed in the right-hand mosaic grid */
	images?: HeroImage[];
	/** Optional badge labels rendered as floating pins */
	pins?: { label: string; className?: string }[];
};

const DEFAULT_IMAGES: HeroImage[] = [
	{
		src: "https://cdn.shadcnstudio.com/ss-assets/blocks/marketing/about-us/image-37.png",
		alt: "image-37",
		bgClass: "bg-primary",
	},
	{
		src: "https://cdn.shadcnstudio.com/ss-assets/blocks/marketing/about-us/image-38.png",
		alt: "image-38",
		bgClass: "bg-amber-600/60 dark:bg-amber-400/60",
	},
	{
		src: "https://cdn.shadcnstudio.com/ss-assets/blocks/marketing/about-us/image-39.png",
		alt: "image-39",
		bgClass: "bg-sky-600/60 dark:bg-sky-400/60",
	},
	{
		src: "https://cdn.shadcnstudio.com/ss-assets/blocks/marketing/about-us/image-40.png",
		alt: "image-40",
		bgClass: "bg-primary/60",
	},
	{
		src: "https://cdn.shadcnstudio.com/ss-assets/blocks/marketing/about-us/image-41.png",
		alt: "image-41",
		bgClass: "bg-sky-600/60 dark:bg-sky-400/60",
	},
	{
		src: "https://cdn.shadcnstudio.com/ss-assets/blocks/marketing/about-us/image-42.png",
		alt: "image-42",
		bgClass: "bg-destructive/60",
	},
	{
		src: "https://cdn.shadcnstudio.com/ss-assets/blocks/marketing/about-us/image-43.png",
		alt: "image-43",
		bgClass: "bg-green-600/60 dark:bg-green-400/60",
	},
];

// Split images into rows of 2, 3, 2
function chunkImages(images: HeroImage[]) {
	const rows: HeroImage[][] = [];
	const sizes = [2, 3, 2];
	let i = 0;
	for (const size of sizes) {
		rows.push(images.slice(i, i + size));
		i += size;
		if (i >= images.length) break;
	}
	return rows;
}

export default function HeroIntro({
	heading,
	description,
	ctaLabel = "Read more",
	ctaHref = "#",
	images = DEFAULT_IMAGES,
	pins,
}: HeroIntroProps) {
	const rows = chunkImages(images);
	const rowClasses = [
		"bg-background flex items-center gap-2.5 max-sm:flex-wrap",
		"bg-background flex items-center gap-2.5 max-sm:order-1 max-sm:flex-wrap max-sm:justify-center",
		"bg-background flex items-center gap-2.5 max-sm:flex-wrap",
	];

	return (
		<section id="hero-intro" className="py-2 sm:py-4 lg:py-8">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 items-center gap-12 max-xl:justify-items-center sm:gap-16 lg:gap-24 xl:grid-cols-2">
					{/* Text content */}
					<div className="space-y-4">
						<h2
							className="text-2xl font-semibold md:text-3xl lg:text-4xl"
							style={{ filter: "blur(0px)", opacity: 1, transform: "none" }}
						>
							{heading}
						</h2>
						<p
							className="text-muted-foreground text-xl"
							style={{ filter: "blur(0px)", opacity: 1, transform: "none" }}
						>
							{description}
						</p>
						<div style={{ filter: "blur(0px)", opacity: 1, transform: "none" }}>
							<a
								href={ctaHref}
								data-slot="button"
								data-variant="default"
								data-size="lg"
								className="focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex shrink-0 items-center justify-center gap-2 font-medium whitespace-nowrap transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 group relative overflow-hidden rounded-lg text-base before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.5)_50%,transparent_75%,transparent_100%)] before:bg-[length:250%_250%,100%_100%] before:bg-[position:200%_0,0_0] before:bg-no-repeat before:transition-[background-position_0s_ease] before:duration-1000 hover:before:bg-[position:-100%_0,0_0] has-[>svg]:px-6 dark:before:bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.2)_50%,transparent_75%,transparent_100%)]"
							>
								{ctaLabel}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width={24}
									height={24}
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth={2}
									strokeLinecap="round"
									strokeLinejoin="round"
									className="lucide lucide-arrow-right transition-transform duration-200 group-hover:translate-x-0.5"
									aria-hidden="true"
								>
									<path d="M5 12h14" />
									<path d="m12 5 7 7-7 7" />
								</svg>
							</a>
						</div>
					</div>

					{/* Image mosaic */}
					<div className="relative flex w-full max-w-140 flex-col items-center gap-2.5">
						{/* Decorative SVGs */}
						<div
							className="text-border absolute top-6 left-48.5 max-md:hidden"
							style={{ filter: "blur(0px)", opacity: 1 }}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width={174}
								height={327}
								viewBox="0 0 174 327"
								fill="none"
							>
								<path
									d="M86.3438 0.604492V91.9772M86.3438 91.9772H30.2278C13.8678 91.9772 0.605469 105.24 0.605469 121.6L0.605469 188.25C0.605469 204.61 13.8678 217.872 30.2278 217.872H86.3438M86.3438 91.9772H143.125C159.485 91.9772 172.747 105.24 172.747 121.599V188.25C172.747 204.61 159.485 217.872 143.125 217.872H86.3438M86.3438 217.872V326.104"
									stroke="currentColor"
									strokeWidth="1.20907"
									strokeLinecap="round"
									strokeDasharray="12.7 12.7"
								/>
							</svg>
						</div>
						<div
							className="text-border absolute right-22 bottom-15 -z-1 max-md:hidden"
							style={{ filter: "blur(0px)", opacity: 1 }}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width={39}
								height={74}
								viewBox="0 0 39 74"
								fill="none"
							>
								<path
									d="M37.6055 0.60498C36.336 42.7844 45.3807 51.5256 0.605469 72.605"
									stroke="currentColor"
									strokeWidth="1.21"
									strokeLinecap="round"
									strokeDasharray="8.7 8.7"
								/>
							</svg>
						</div>
						<div
							className="text-border absolute top-16 left-21 -z-1 max-md:hidden"
							style={{ filter: "blur(0px)", opacity: 1 }}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width={36}
								height={61}
								viewBox="0 0 36 61"
								fill="none"
							>
								<path
									d="M32.5607 0.605257C6.30817 22.4964 -3.82479 21.1848 2.34349 59.8594"
									stroke="currentColor"
									strokeWidth="1.21"
									strokeLinecap="round"
									strokeDasharray="8.7 8.7"
								/>
							</svg>
						</div>

						{/* Optional floating pin badges */}
						{pins?.map((pin, i) => (
							<div
								key={i}
								className={`bg-primary text-primary-foreground absolute z-1 flex items-center justify-center rounded-md px-2 py-0.5 text-xs max-sm:hidden ${pin.className ?? ""}`}
								style={{ filter: "blur(0px)", opacity: 1 }}
							>
								{pin.label}
							</div>
						))}

						{/* Photo rows */}
						{rows.map((row, ri) => (
							<div key={ri} className={rowClasses[ri] ?? rowClasses[0]}>
								{row.map((img) => (
									<div
										key={img.src}
										style={{
											filter: "blur(0px)",
											opacity: 1,
											transform: "none",
										}}
									>
										<div
											className={`group relative h-27 w-38.25 overflow-hidden rounded-lg ${img.bgClass ?? ""}`}
										>
											<Image
												src={img.src}
												alt={img.alt}
												fill
												className="w-full origin-bottom transition-transform duration-300 group-hover:scale-105 object-cover"
											/>
										</div>
									</div>
								))}
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
