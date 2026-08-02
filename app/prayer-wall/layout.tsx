import type { Metadata } from "next";
import type React from "react";

export const metadata: Metadata = {
	title: "Prayer Wall — Stand Together Before the Lord",
	description:
		"Submit your prayer requests and stand in faith with believers worldwide during The Non-Stop Series™ — 144 hours of continuous prayer and intercession.",
	alternates: { canonical: "https://thenonstop.org/prayer-wall" },
	openGraph: {
		url: "https://thenonstop.org/prayer-wall",
		title: "Prayer Wall — A Place to Stand Together",
		description:
			"Share your prayer needs. Join the continuous chain of intercession. No burden is too small.",
	},
};

const PrayerLayout = ({ children }: { children: React.ReactNode }) => {
	return <>{children}</>;
};

export default PrayerLayout;
