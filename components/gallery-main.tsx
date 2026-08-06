"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";

import { cn } from "@/lib/utils";

interface GalleryMainProps {
	className?: string;
}

const GalleryMain = ({ className }: GalleryMainProps) => {
	const column1Images = [
		{
			src: "/gallery/gallery-001.jpg",
			alt: "Gallery Image 1",
			height: "23rem",
		},
		{
			src: "/gallery/gallery-002.jpg",
			alt: "Gallery Image 2",
			height: "28rem",
		},
		{
			src: "/gallery/gallery-003.jpg",
			alt: "Gallery Image 3",
			height: "12rem",
		},
		{
			src: "/gallery/gallery-004.jpg",
			alt: "Gallery Image 4",
			height: "18rem",
		},
		{
			src: "/gallery/gallery-019.jpg",
			alt: "Gallery Image 19",
			height: "15rem",
		},
		// Nonstop photos — Column 1
		{ src: "/nonstop/nonstop-001.jpg", alt: "Nonstop 1", height: "20rem" },
		{ src: "/nonstop/nonstop-005.jpg", alt: "Nonstop 5", height: "26rem" },
		{ src: "/nonstop/nonstop-009.jpg", alt: "Nonstop 9", height: "14rem" },
		{ src: "/nonstop/nonstop-013.jpg", alt: "Nonstop 13", height: "22rem" },
		{ src: "/nonstop/nonstop-017.jpg", alt: "Nonstop 17", height: "18rem" },
		{ src: "/nonstop/nonstop-021.jpg", alt: "Nonstop 21", height: "28rem" },
		{ src: "/nonstop/nonstop-025.jpg", alt: "Nonstop 25", height: "16rem" },
		{ src: "/nonstop/nonstop-029.jpg", alt: "Nonstop 29", height: "24rem" },
		{ src: "/nonstop/nonstop-033.jpg", alt: "Nonstop 33", height: "20rem" },
		{ src: "/nonstop/nonstop-037.jpg", alt: "Nonstop 37", height: "30rem" },
		{ src: "/nonstop/nonstop-041.jpg", alt: "Nonstop 41", height: "18rem" },
		{ src: "/nonstop/nonstop-045.jpg", alt: "Nonstop 45", height: "22rem" },
		{ src: "/nonstop/nonstop-049.jpg", alt: "Nonstop 49", height: "16rem" },
	];

	const column2Images = [
		{ src: "/nonstop/nonstop-014.jpg", alt: "Nonstop 14", height: "28rem" },
		{ src: "/gallery/akosua.jpg", alt: "Gallery Image 5", height: "13rem" },
		{
			src: "/gallery/gallery-007.jpg",
			alt: "Gallery Image 7",
			height: "18rem",
		},
		{
			src: "/gallery/gallery-008.jpg",
			alt: "Gallery Image 8",
			height: "20rem",
		},
		// Nonstop photos — Column 2
		{ src: "/nonstop/nonstop-002.jpg", alt: "Nonstop 2", height: "26rem" },
		{ src: "/nonstop/nonstop-006.jpg", alt: "Nonstop 6", height: "20rem" },
		{
			src: "/gallery/gallery-012.jpg",
			alt: "Gallery Image 12",
			height: "25rem",
		},
		{ src: "/nonstop/nonstop-010.jpg", alt: "Nonstop 10", height: "16rem" },
		{ src: "/nonstop/nonstop-018.jpg", alt: "Nonstop 18", height: "22rem" },
		{ src: "/nonstop/nonstop-022.jpg", alt: "Nonstop 22", height: "18rem" },
		{ src: "/nonstop/nonstop-026.jpg", alt: "Nonstop 26", height: "24rem" },
		{ src: "/nonstop/nonstop-030.jpg", alt: "Nonstop 30", height: "14rem" },
		{ src: "/nonstop/nonstop-034.jpg", alt: "Nonstop 34", height: "20rem" },
		{ src: "/nonstop/nonstop-038.jpg", alt: "Nonstop 38", height: "26rem" },
		{ src: "/nonstop/nonstop-042.jpg", alt: "Nonstop 42", height: "18rem" },
		{ src: "/nonstop/nonstop-046.jpg", alt: "Nonstop 46", height: "22rem" },
		{ src: "/nonstop/nonstop-050.jpg", alt: "Nonstop 50", height: "28rem" },
	];

	const column3Images = [
		{
			src: "/gallery/gallery-006.jpg",
			alt: "Gallery Image 6",
			height: "32rem",
		},
		{
			src: "/gallery/gallery-009.jpg",
			alt: "Gallery Image 9",
			height: "32rem",
		},
		{
			src: "/gallery/gallery-010.jpg",
			alt: "Gallery Image 10",
			height: "22rem",
		},
		{
			src: "/gallery/gallery-011.jpg",
			alt: "Gallery Image 11",
			height: "15rem",
		},
		{
			src: "/gallery/gallery-013.jpg",
			alt: "Gallery Image 13",
			height: "18rem",
		},
		// Nonstop photos — Column 3
		{ src: "/nonstop/nonstop-003.jpg", alt: "Nonstop 3", height: "24rem" },
		{ src: "/nonstop/nonstop-007.jpg", alt: "Nonstop 7", height: "16rem" },
		{ src: "/nonstop/nonstop-011.jpg", alt: "Nonstop 11", height: "28rem" },
		{ src: "/nonstop/nonstop-015.jpg", alt: "Nonstop 15", height: "20rem" },
		{ src: "/nonstop/nonstop-019.jpg", alt: "Nonstop 19", height: "14rem" },
		{ src: "/nonstop/nonstop-023.jpg", alt: "Nonstop 23", height: "26rem" },
		{ src: "/nonstop/nonstop-027.jpg", alt: "Nonstop 27", height: "18rem" },
		{ src: "/nonstop/nonstop-031.jpg", alt: "Nonstop 31", height: "22rem" },
		{ src: "/nonstop/nonstop-035.jpg", alt: "Nonstop 35", height: "30rem" },
		{ src: "/nonstop/nonstop-039.jpg", alt: "Nonstop 39", height: "16rem" },
		{ src: "/nonstop/nonstop-043.jpg", alt: "Nonstop 43", height: "24rem" },
		{ src: "/nonstop/nonstop-047.jpg", alt: "Nonstop 47", height: "20rem" },
		{ src: "/nonstop/nonstop-051.jpg", alt: "Nonstop 51", height: "18rem" },
	];

	const column4Images = [
		{
			src: "/gallery/gallery-014.jpg",
			alt: "Gallery Image 14",
			height: "13rem",
		},
		{
			src: "/gallery/gallery-015.jpg",
			alt: "Gallery Image 15",
			height: "22.5rem",
		},
		{
			src: "/gallery/gallery-016.jpg",
			alt: "Gallery Image 16",
			height: "22rem",
		},
		{
			src: "/gallery/gallery-017.jpg",
			alt: "Gallery Image 17",
			height: "28rem",
		},
		{
			src: "/gallery/gallery-018.jpg",
			alt: "Gallery Image 18",
			height: "12rem",
		},
		// Nonstop photos — Column 4
		{ src: "/nonstop/nonstop-004.jpg", alt: "Nonstop 4", height: "18rem" },
		{ src: "/nonstop/nonstop-008.jpg", alt: "Nonstop 8", height: "26rem" },
		{ src: "/nonstop/nonstop-012.jpg", alt: "Nonstop 12", height: "20rem" },
		{ src: "/nonstop/nonstop-016.jpg", alt: "Nonstop 16", height: "14rem" },
		{ src: "/nonstop/nonstop-020.jpg", alt: "Nonstop 20", height: "28rem" },
		{ src: "/nonstop/nonstop-024.jpg", alt: "Nonstop 24", height: "22rem" },
		{ src: "/nonstop/nonstop-028.jpg", alt: "Nonstop 28", height: "16rem" },
		{ src: "/nonstop/nonstop-032.jpg", alt: "Nonstop 32", height: "24rem" },
		{ src: "/nonstop/nonstop-036.jpg", alt: "Nonstop 36", height: "20rem" },
		{ src: "/nonstop/nonstop-040.jpg", alt: "Nonstop 40", height: "30rem" },
		{ src: "/nonstop/nonstop-044.jpg", alt: "Nonstop 44", height: "18rem" },
		{ src: "/nonstop/nonstop-048.jpg", alt: "Nonstop 48", height: "26rem" },
		{ src: "/nonstop/nonstop-052.jpg", alt: "Nonstop 52", height: "16rem" },
	];

	return (
		<section className={cn("py-16 ", className)}>
			<div className="relative container">
				<h1 className="text-4xl tracking-tight lg:mb-6 uppercase font-bebas">
					A Quarter-Century of Glory
				</h1>
				<p className="mb-12 max-w-4xl text-lg text-muted-foreground lg:text-xl">
					Celebrating 25 years of faith: A glimpse into the heart of the
					Non-Stop Series™. These are the moments of prayer, praise, and pure
					devotion we've shared together over two-and-a-half decades. It's more
					than just a gallery—it's a journey of worship that never stops.
				</p>
				<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
					{/* Column 1 */}
					<div className="flex flex-col gap-4">
						{column1Images.map((image, index) => (
							<motion.div
								initial={{ opacity: 0, scale: 0.9, y: 50 }}
								whileInView={{ opacity: 1, scale: 1, y: 0 }}
								transition={{ duration: 0.5, delay: index * 0.1 }}
								key={index}
								className="relative w-full overflow-hidden rounded-2xl bg-muted"
								style={{ height: image.height }}
							>
								<Image
									className="rounded-2xl object-cover object-top"
									src={image.src}
									alt={image.alt}
									fill
									sizes="(max-width: 768px) 100vw, 25vw"
									priority={index === 0}
									loading={index === 0 ? undefined : "lazy"}
								/>
							</motion.div>
						))}
					</div>

					{/* Column 2 */}
					<div className="flex flex-col gap-4">
						{column2Images.map((image, index) => (
							<motion.div
								initial={{ opacity: 0, scale: 0.9, y: -50 }}
								whileInView={{ opacity: 1, scale: 1, y: 0 }}
								transition={{ duration: 0.5, delay: index * 0.1 }}
								key={index}
								className="relative w-full overflow-hidden rounded-2xl bg-muted"
								style={{ height: image.height }}
							>
								<Image
									className="rounded-2xl object-cover object-top"
									src={image.src}
									alt={image.alt}
									fill
									sizes="(max-width: 768px) 100vw, 25vw"
									priority={index === 0}
									loading={index === 0 ? undefined : "lazy"}
								/>
							</motion.div>
						))}
					</div>

					{/* Column 3 */}
					<div className="flex flex-col gap-4">
						{column3Images.map((image, index) => (
							<motion.div
								initial={{ opacity: 0, scale: 0.9, y: 50 }}
								whileInView={{ opacity: 1, scale: 1, y: 0 }}
								transition={{ duration: 0.5, delay: index * 0.1 }}
								key={index}
								className="relative w-full overflow-hidden rounded-2xl bg-muted"
								style={{ height: image.height }}
							>
								<Image
									className="rounded-2xl object-cover object-top"
									src={image.src}
									alt={image.alt}
									fill
									sizes="(max-width: 768px) 100vw, 25vw"
									priority={index === 0}
									loading={index === 0 ? undefined : "lazy"}
								/>
							</motion.div>
						))}
					</div>

					{/* Column 4 */}
					<div className="flex flex-col gap-4">
						{column4Images.map((image, index) => (
							<motion.div
								initial={{ opacity: 0, scale: 0.9, y: -50 }}
								whileInView={{ opacity: 1, scale: 1, y: 0 }}
								transition={{ duration: 0.5, delay: index * 0.1 }}
								key={index}
								className="relative w-full overflow-hidden rounded-2xl bg-muted"
								style={{ height: image.height }}
							>
								<Image
									className="rounded-2xl object-cover"
									src={image.src}
									alt={image.alt}
									fill
									sizes="(max-width: 768px) 100vw, 25vw"
									priority={index === 0}
									loading={index === 0 ? undefined : "lazy"}
								/>
							</motion.div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
};

export { GalleryMain };
