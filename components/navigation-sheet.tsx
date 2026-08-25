"use client";

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { Heart, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { useCurrentSession } from "@/lib/use-current-session";
import InsideScrollDialog from "./InsideScrollDialog";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const navItems = [
	{ label: "Home", href: "/" },
	{ label: "About", href: "/about" },
	{ label: "Watches", href: "/watches" },
	{ label: "Music & Worship", href: "/music-and-worship" },
	{ label: "Prayer Wall", href: "/prayer-wall" },
	{ label: "Scripture Reading", href: "/scripture-reading" },
	{ label: "Daily Devotionals", href: "/blog" },
	{ label: "Start an Altar", href: "/start-an-altar" },
	{ label: "Schedule", href: "/schedule" },
	{ label: "Partner", href: "/partner" },
	{ label: "Live", href: "/live" },
	{ label: "Gallery", href: "/gallery" },
	{ label: "Get Involved", href: "/get-involved" },
	{ label: "Contact", href: "/contact" },
];

const containerVariants: Variants = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.07,
			delayChildren: 0.15,
		},
	},
	exit: {
		opacity: 0,
		transition: {
			staggerChildren: 0.04,
			staggerDirection: -1,
		},
	},
};

const itemVariants: Variants = {
	hidden: { opacity: 0, y: 40, skewY: 4 },
	show: {
		opacity: 1,
		y: 0,
		skewY: 0,
		transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
	},
	exit: {
		opacity: 0,
		y: -20,
		transition: { duration: 0.2, ease: "easeIn" },
	},
};

export const NavigationSheet = () => {
	const { user, isAuthenticated } = useCurrentSession();
	const [open, setOpen] = useState(false);

	const { data } = useSWR("/api/events/live", fetcher, {
		refreshInterval: 60000,
	});

	const isLive = data?.isLive || false;

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<VisuallyHidden>
				<SheetTitle>Navigation Menu</SheetTitle>
			</VisuallyHidden>

			<SheetTrigger asChild>
				<Button
					className="rounded-full text-white bg-transparent border-white/10 hover:bg-white/10 hover:text-white cursor-pointer"
					size="icon"
					variant="ghost"
				>
					<Menu className="h-6 w-6" />
				</Button>
			</SheetTrigger>

			<SheetContent
				side="top"
				className="h-dvh w-full border-none bg-black p-0 text-white [&>button]:hidden"
			>
				{/* Header */}
				<div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
					<Logo />
					<button
						onClick={() => setOpen(false)}
						className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:bg-white/10 cursor-pointer"
						aria-label="Close menu"
					>
						<X className="h-5 w-5" />
					</button>
				</div>

				{/* Nav Links */}
				<AnimatePresence>
					{open && (
						<motion.nav
							className="flex flex-col h-[calc(100dvh-73px)] px-6 pt-2 pb-8 overflow-hidden"
							variants={containerVariants}
							initial="hidden"
							animate="show"
							exit="exit"
						>
							<div className="flex-1 overflow-y-auto overscroll-contain min-h-0">
								<div className="flex flex-col gap-0.5 py-4">
									{navItems.map((item, i) => (
										<motion.div
											key={item.label}
											variants={itemVariants}
											className="shrink-0 border-b border-white/5 last:border-none  "
										>
											<Link
												href={item.href}
												onClick={() => setOpen(false)}
												className="group flex items-center justify-between py-2.5 transition-colors hover:text-white/60 cursor-pointer"
											>
												<div className="flex items-center gap-3">
													<span
														className="text-2xl font-medium tracking-tight text-white leading-none"
														style={{ fontFamily: "var(--font-bebas)" }}
													>
														{item.label}
													</span>
													{item.label === "Live" && isLive && (
														<span className="relative flex h-2.5 w-2.5">
															<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
															<span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500"></span>
														</span>
													)}
												</div>
												<span className="text-[10px] font-mono text-white/20 tabular-nums uppercase underline underline-offset-4 decoration-white/5">
													0{i + 1}
												</span>
											</Link>
										</motion.div>
									))}
								</div>
							</div>

							{/* Footer of sheet */}
							<motion.div
								variants={itemVariants}
								className="pt-8 flex flex-col gap-5 shrink-0"
							>
								<div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-white/40 text-[10px] font-bold uppercase tracking-widest">
									<a
										href="https://www.facebook.com/nonstopseries/"
										target="_blank"
										className="hover:text-white transition-colors cursor-pointer"
										rel="noopener"
									>
										Facebook
									</a>
									<a
										href="https://twitter.com/thenonstopserie"
										target="_blank"
										className="hover:text-white transition-colors cursor-pointer"
										rel="noopener"
									>
										Twitter (X)
									</a>
									<a
										href="https://www.youtube.com/channel/UCszsGdub8qkbJOz_rdx-5IA"
										target="_blank"
										className="hover:text-white transition-colors cursor-pointer"
										rel="noopener"
									>
										YouTube
									</a>
									<a
										href="https://www.tiktok.com/@thenonstopseries"
										target="_blank"
										className="hover:text-white transition-colors cursor-pointer"
										rel="noopener"
									>
										TikTok
									</a>
								</div>

								<div className="grid grid-cols-2 gap-3">
									<Link
										href="/partner#give"
										onClick={() => setOpen(false)}
										className="text-center rounded-full bg-amber-500 py-3 text-[11px] font-bold uppercase tracking-widest text-white transition-all hover:bg-amber-600 active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 cursor-pointer"
									>
										<Heart className="size-3.5 fill-white" />
										Donate
									</Link>

									{!isAuthenticated ? (
										<Link
											href="/login"
											onClick={() => setOpen(false)}
											className="text-center rounded-full bg-white py-3 text-[11px] font-bold uppercase tracking-widest text-black transition-all hover:bg-white/90 active:scale-95 shadow-lg cursor-pointer"
										>
											Sign In
										</Link>
									) : user?.role === "admin" ? (
										<Link
											href="/dashboard"
											onClick={() => setOpen(false)}
											className="text-center rounded-full bg-slate-800 py-3 text-[11px] font-bold uppercase tracking-widest text-white transition-all hover:bg-slate-700 active:scale-95 border border-white/10 shadow-lg cursor-pointer"
										>
											Dashboard
										</Link>
									) : (
										<Link
											href="/profile"
											onClick={() => setOpen(false)}
											className="text-center rounded-full bg-white py-3 text-[11px] font-bold uppercase tracking-widest text-black transition-all hover:bg-white/90 active:scale-95 shadow-lg cursor-pointer"
										>
											Profile
										</Link>
									)}
								</div>
							</motion.div>
						</motion.nav>
					)}
				</AnimatePresence>
			</SheetContent>
		</Sheet>
	);
};
