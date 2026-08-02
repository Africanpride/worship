import type { Metadata } from "next";
import type React from "react";

export const metadata: Metadata = {
	title: "The Watches — 144-Hour Worship Schedule",
	description:
		"Join a worship watch during The Non-Stop Series™ — 144 hours of continuous praise, worship, prayer, and Scripture reading from Accra, Ghana. Choose your watch and take your place before the Lord.",
	alternates: { canonical: "https://thenonstop.org/watches" },
	openGraph: {
		url: "https://thenonstop.org/watches",
		title: "The Watches — Take Your Place Before the Lord",
		description:
			"Prophetic worship watches across 144 continuous hours. Worship, prayer, Scripture, and intercession — day and night.",
	},
};

const WatchLayout = ({ children }: { children: React.ReactNode }) => {
	return <>{children}</>;
};

export default WatchLayout;
