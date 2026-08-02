import type { Metadata } from "next";
import type React from "react";

export const metadata: Metadata = {
	title: "Music & Worship — Continuous Praise Before the Lord",
	description:
		"Explore the sound of The Non-Stop Series™ — 144 hours of continuous worship, choir ministrations, instrumental praise, and prophetic songs from multiple nations.",
	alternates: { canonical: "https://thenonstop.org/music-and-worship" },
	openGraph: {
		url: "https://thenonstop.org/music-and-worship",
		title: "Music & Worship — A Sacred Continuous Offering",
		description:
			"From choirs to soloists, instruments to spontaneous songs — the sound of the altar rises continuously.",
	},
};

const MusicLayout = ({ children }: { children: React.ReactNode }) => {
	return <>{children}</>;
};

export default MusicLayout;
