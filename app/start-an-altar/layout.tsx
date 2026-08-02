import type { Metadata } from "next";
import type React from "react";

export const metadata: Metadata = {
	title: "Start an Altar — Multiply the Fire",
	description:
		"Establish continuous worship and prayer in your city, church, campus, or community. Resources and guidance to help you start your own altar.",
	alternates: { canonical: "https://thenonstop.org/start-an-altar" },
	openGraph: {
		url: "https://thenonstop.org/start-an-altar",
		title: "Start an Altar — Establish Continuous Worship",
		description:
			"Don't just attend the altar. Build an altar. Resources to help you establish worship in your sphere of influence.",
	},
};

const StartAltarLayout = ({ children }: { children: React.ReactNode }) => {
	return <>{children}</>;
};

export default StartAltarLayout;
