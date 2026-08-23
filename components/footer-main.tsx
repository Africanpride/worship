import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggleFooter } from "./theme-toggle-foofter";

interface NavItem {
	name: string;
	href: string;
}

interface SocialItem {
	name: string;
	href: string;
}

interface FooterComponentProps {
	heading?: string;
	description?: string;
	ctaText?: string;
	ctaHref?: string;
	navigation?: NavItem[];
	social?: SocialItem[];
	legal?: NavItem[];
	brandName?: string;
	className?: string;
}

const FooterComponent = ({
	heading = "Join the 25th Anniversary Sacrifice of Praise",
	description = "Experience unbroken worship, deep intercession, and the raw presence of God as we celebrate 25 years of The Non-Stop Series.",
	ctaText = "Get Involved",
	ctaHref = "/get-involved",
	navigation = [
		{ name: "Watches", href: "/watches" },
		{ name: "Music & Worship", href: "/music-and-worship" },
		{ name: "Prayer Wall", href: "/prayer-wall" },
		{ name: "Scripture Reading", href: "/scripture-reading" },
		{ name: "Daily Devotionals", href: "/blog" },
		{ name: "Start an Altar", href: "/start-an-altar" },
		{ name: "Partner", href: "/partner" },
		{ name: "Get Involved", href: "/get-involved" },
		{ name: "Contact", href: "/contact" },
	],
	social = [
		{ name: "Facebook", href: "https://www.facebook.com/nonstopseries/" },
		{
			name: "YouTube",
			href: "https://www.youtube.com/channel/UCszsGdub8qkbJOz_rdx-5IA",
		},
		{ name: "TikTok", href: "https://www.tiktok.com/@thenonstopseries" },
		{ name: "Twitter", href: "https://twitter.com/thenonstopserie" },
	],
	legal = [
		{ name: "Terms of Service", href: "/terms" },
		{ name: "Privacy Policy", href: "/privacy" },
		{ name: "DMCA Policy", href: "/dmca" },
		{ name: "Cookies Policy", href: "/cookies" },
		{ name: "FAQs", href: "/#faq" },
	],
	brandName = "NONSTOP",
	className,
}: FooterComponentProps) => {
	return (
		<footer
			className={cn(
				"flex flex-col items-center px-2 gap-14 pt-28 lg:pt-32",
				className,
			)}
		>
			<div className="container space-y-3 text-center">
				<h2 className="text-2xl md:text-5xl lg:text-6xl">{heading}</h2>
				<p className="mx-auto max-w-xl leading-snug text-balance text-muted-foreground">
					{description}
				</p>
				<div>
					<Button size="lg" className="mt-4 cursor-pointer" asChild>
						<a href={ctaHref} className="cursor-pointer">
							{ctaText}
						</a>
					</Button>
				</div>
			</div>

			<nav className="container flex flex-col items-center gap-4">
				<ul className="flex flex-wrap items-center justify-center gap-6">
					{navigation.map((item, i) => (
						<motion.li
							key={item.name}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: false }}
							transition={{ duration: 0.5, delay: i * 0.1 }}
						>
							<Link
								href={item.href}
								className="font-medium transition-opacity hover:opacity-75 cursor-pointer"
							>
								{item.name}
							</Link>
						</motion.li>
					))}
				</ul>
				<ul className="flex flex-wrap items-center justify-center gap-6">
					{social.map((item, i) => (
						<motion.li
							key={item.name}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: i * 0.1 }}
						>
							<Link
								href={item.href}
								className="flex items-center gap-0.5 font-medium transition-opacity hover:opacity-75 cursor-pointer"
							>
								{item.name} <ArrowUpRight className="size-4" />
							</Link>
						</motion.li>
					))}
				</ul>{" "}
				<ul className="flex flex-wrap items-center justify-center gap-6">
					{legal.map((item) => (
						<li key={item.name}>
							<Link
								href={item.href}
								className="text-sm text-muted-foreground transition-opacity hover:opacity-75 cursor-pointer"
							>
								{item.name}
							</Link>
						</li>
					))}
				</ul>
				<div className="text-xs md:text-sm text-muted-foreground text-center md:text-left transition-opacity hover:opacity-75 pt-2 ">
					&copy; {new Date().getFullYear()}{" "}
					<a href="/" className="font-semibold cursor-pointer">
						{" The Nonstop Series"}
					</a>
					. <span className="capitalize">All rights reserved.</span>
				</div>
				<div className="py-2">
					<ThemeToggleFooter />
				</div>
			</nav>

			<svg
				width="100%"
				height="auto"
				viewBox="0 0 1200 300" // adjust viewBox to fit your desired proportions
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				className="w-full flex justify-center items-center pr-5 opacity-20"
				aria-label="NONSTOP"
				data-usal="fade-u duration-600 delay-200"
			>
				<defs>
					<linearGradient
						id="paint0_linear_FooterComponent"
						x1="600"
						y1="0"
						x2="600"
						y2="218.5"
						gradientUnits="userSpaceOnUse"
					>
						<stop stopColor="currentColor" />
						<stop offset="1" stopColor="currentColor" stopOpacity="0.2" />
					</linearGradient>
				</defs>

				<text
					x="600"
					y="220"
					textAnchor="middle"
					dominantBaseline="middle"
					fill="url(#paint0_linear_FooterComponent)"
					fontFamily="Suisse Intl, system-ui, sans-serif"
					fontSize="270"
					fontWeight="500"
					letterSpacing="-0.04em"
				>
					NONSTOP
				</text>
			</svg>
		</footer>
	);
};

export { FooterComponent };
