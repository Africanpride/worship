import type { Metadata } from "next";
import React from "react";
import { GalleryMain } from "@/components/gallery-main";

export const metadata: Metadata = {
	title: "Gallery — Moments of Non-Stop Worship",
	description:
		"Browse photos and videos from The Non-Stop Series™ — capturing the glory, the atmosphere, and the power of 144 hours of continuous praise and worship.",
	alternates: { canonical: "https://thenonstop.org/gallery" },
	openGraph: {
		url: "https://thenonstop.org/gallery",
		title: "Gallery — 25 Years of Non-Stop Worship",
		description:
			"A Quarter-Century of Glory: Photos and videos from Africa's greatest continuous worship experience — The Non-Stop Series™.",
	},
};

export default function GalleryPage() {
	return (
		<>
			<GalleryMain />
		</>
	);
}
