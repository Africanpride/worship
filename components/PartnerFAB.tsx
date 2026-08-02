"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Heart } from "lucide-react";
import { usePathname } from "next/navigation";
import React from "react";
import { DonationDialog } from "./DonationDialog";

export function PartnerFAB() {
	const pathname = usePathname();

	// Hide FAB on the actual partner page to avoid redundancy
	// if (pathname === "/partner") return null;
	return null;

	return (
		<AnimatePresence>
			<motion.div
				initial={{ opacity: 0, scale: 0.8, y: 20 }}
				animate={{ opacity: 1, scale: 1, y: 0 }}
				exit={{ opacity: 0, scale: 0.8, y: 20 }}
				className="fixed bottom-6 left-6 z-[60] md:bottom-10 md:left-10"
			>
				<DonationDialog>
					<button
						className="group relative flex items-center justify-center h-14 w-14 md:h-16 md:w-16 rounded-full bg-amber-500 hover:bg-amber-600 text-white shadow-2xl shadow-amber-500/40 transition-all active:scale-90 cursor-pointer overflow-hidden"
						aria-label="Partner with us"
					>
						{/* Background ripple effect */}
						<span className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-150 transition-transform duration-700 rounded-full" />

						<motion.div
							animate={{
								scale: [1, 1.15, 1],
							}}
							transition={{
								duration: 2,
								repeat: Infinity,
								ease: "easeInOut",
							}}
						>
							<Heart className="size-6 md:size-8 fill-white group-hover:drop-shadow-lg" />
						</motion.div>

						{/* Tooltip hint on hover */}
						<span className="absolute right-full mr-4 px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-md text-white text-xs font-bold uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden md:block">
							Partner with Us
						</span>
					</button>
				</DonationDialog>
			</motion.div>
		</AnimatePresence>
	);
}
