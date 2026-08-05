"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HeroHeadlineProps {
	className?: string;
	text1?: string;
	text2?: string;
	text3?: string;
	imageSrc?: string;
}

export default function HeroHeadline({
	className,
	text1 = "Recovery, Revival",
	text2 = "and the Restoration",
	text3 = "of David's Tabernacle",
	imageSrc = "/images/cs.jpg",
}: HeroHeadlineProps) {
	return (
		<div
			className={cn(
				"  py-20 flex flex-col md:flex-row justify-center items-center gap-10 overflow-hidden",
				className,
			)}
		>
			<div className="flex-1">
				<h1 className="text-[12vw] sm:text-[10vw] md:text-[8vw] lg:text-[7.5vw] font-bebas leading-[0.85] tracking-[-0.03em] uppercase ">
					<motion.div
						initial={{ opacity: 0, x: -50 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
						className="block h-fit overflow-hidden"
					>
						{text1}
					</motion.div>

					<div className="flex items-baseline gap-[1vw] sm:gap-[1.5vw]">
						<motion.div
							initial={{ width: 0, opacity: 0 }}
							animate={{ width: "12vw", opacity: 1 }}
							transition={{ duration: 4, ease: [0.22, 1, 0.36, 1], delay: 0.7 }}
							className="relative h-[8vw] sm:h-[7vw] md:h-[6vw] lg:h-[5.5vw] mt-[0.5vw] items-baseline rounded-[1vw] overflow-hidden bg-primary/10 border border-primary/5"
						>
							<Image
								src={imageSrc}
								alt="Highlight"
								fill
								sizes="20vw"
								className="object-cover object-top scale-110"
								priority
							/>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, x: -50 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{
								duration: 0.8,
								ease: [0.22, 1, 0.36, 1],
								delay: 0.1,
							}}
							className="block"
						>
							{text2}
						</motion.div>
					</div>

					<motion.div
						initial={{ opacity: 0, x: -50 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
						className="block"
					>
						{text3}
					</motion.div>
				</h1>
				<motion.p
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
					className="text-xs sm:text-sm font-medium tracking-[0.3em] uppercase opacity-50 mt-4 text-amber-500"
				>
					25th Year • Silver Jubilee Edition
				</motion.p>
				<div className="flex flex-wrap gap-3 mt-6">
					<Link href="/watches" className="cursor-pointer">
						<Button
							size="lg"
							className="rounded-full font-bold uppercase tracking-widest text-xs"
						>
							Take Your Watch
						</Button>
					</Link>
					<Link href="/live" className="cursor-pointer">
						<Button
							size="lg"
							variant="ghost"
							className="rounded-full font-bold uppercase tracking-widest text-xs border-white/30 text-white "
						>
							Watch Live
						</Button>
					</Link>
					<Link href="/get-involved" className="cursor-pointer">
						<Button
							size="lg"
							variant="ghost"
							className="rounded-full font-bold uppercase tracking-widest text-xs border-white/30 text-white "
						>
							Register
						</Button>
					</Link>
					<Link href="/start-an-altar" className="cursor-pointer">
						<Button
							size="lg"
							variant="ghost"
							className="rounded-full font-bold uppercase tracking-widest text-xs border-white/30 text-white "
						>
							Start an Altar
						</Button>
					</Link>
				</div>
			</div>

			<div className="hidden lg:block ">
				<motion.div
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					whileHover={{ y: 10, opacity: 0.8 }}
					transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
					onClick={() => {
						const element = document.getElementById("why-the-tabernacle");
						element?.scrollIntoView({ behavior: "smooth" });
					}}
					className="rounded-full flex items-center justify-center p-3 opacity-20 hover:opacity-100 transition-all cursor-pointer "
				>
					{/* Inserting logo here using <Image /> tage */}
					<Image
						src="/logos/logo.png"
						alt="Highlight"
						width={200}
						height={200}
						className="object-cover object-top scale-110 rounded-3xl"
						priority
					/>
				</motion.div>
			</div>
		</div>
	);
}
