import type { Metadata } from "next";
import type React from "react";

export const metadata: Metadata = {
	title: "Daily Blog & Devotionals — Reflections from the Altar",
	description:
		"Daily devotionals, teachings, and testimonies from The Non-Stop Series™. Grow in worship, prayer, and Scripture meditation throughout the year.",
	alternates: { canonical: "https://thenonstop.org/blog" },
	openGraph: {
		url: "https://thenonstop.org/blog",
		title: "Blog & Devotionals — Daily Bread for Worshippers",
		description:
			"Reflections, teachings, and testimonies from the altar. Nourish your spirit with daily insights.",
	},
};

const BlogLayout = ({ children }: { children: React.ReactNode }) => {
	return <>{children}</>;
};

export default BlogLayout;
