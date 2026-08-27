import type { Metadata } from "next";
import type React from "react";

export const metadata: Metadata = {
	title: "About — Our Story & Mission",
	description:
		"Learn about The Non-Stop Series™ — 25 years of continuous praise and worship organised by the Logos-Rhema Foundation. Discover the story behind Africa's premier 144-hour non-stop worship experience.",
	alternates: { canonical: "https://thenonstop.org/about" },
	openGraph: {
		url: "https://thenonstop.org/about",
		title: "About The Non-Stop Series™ — 25 years of Continuous Worship",
		description:
			"For 25 years the Logos-Rhema Foundation has led the world in continuous praise and worship. Discover the mission of recovery, revival, and restoration behind The Non-Stop Series.",
	},
};

const layouts = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="px-2 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 pt-20 container max-w-(--breakpoint-xl) mx-auto ">
			{children}
		</div>
	);
};

export default layouts;
