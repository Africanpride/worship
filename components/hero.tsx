"use client";
import { ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import HeroHeadline from "./hero-headline";

const Hero = () => {
	return (
		<section
			id="heading"
			className="relative h-screen w-full overflow-hidden flex items-center justify-center"
		>
			{/* Background Video */}
			<video
				autoPlay
				loop
				muted
				playsInline
				className="absolute top-0 left-0 w-full h-full object-cover z-0 bg-black"
			>
				<source
					src="https://www.youtube.com/watch?v=w34sNb74sJs"
					type="video/mp4"
				/>
				Your browser does not support the video tag.
			</video>

			{/* Overlay */}
			<div className="absolute top-0 left-0 w-full h-full z-10 bg-black" />

			{/* Content */}
			<HeroHeadline className="z-50 px-4 md:px-16  xl:px-32 2xl:px-40 text-white" />

			{/* Scroll Indicator */}
			<motion.div
				animate={{ y: [0, 10, 0] }}
				transition={{ duration: 2, repeat: Infinity }}
				className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
			>
				<div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
					<div className="w-1 h-2 bg-white rounded-full" />
				</div>
			</motion.div>
		</section>
	);
};

export default Hero;
