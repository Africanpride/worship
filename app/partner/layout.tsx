import type { Metadata } from "next";
import type React from "react";

export const metadata: Metadata = {
	title: "Partner With Us — Help Keep the Fire Burning",
	description:
		"Support The Non-Stop Series™ through donations, sponsorship, and partnership. Help sustain 144 hours of continuous worship, prayer, and Scripture reading.",
	alternates: { canonical: "https://thenonstop.org/partner" },
	openGraph: {
		url: "https://thenonstop.org/partner",
		title: "Partner With Us — Sustain the Altar",
		description:
			"Become part of a movement. Your partnership helps keep the fire burning across 144 hours of non-stop worship.",
	},
};

const PartnerLayout = ({ children }: { children: React.ReactNode }) => {
	return <>{children}</>;
};

export default PartnerLayout;
