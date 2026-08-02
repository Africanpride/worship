import type { Metadata } from "next";
import type React from "react";

export const metadata: Metadata = {
	title: "Get Involved — Join the Worship Movement",
	description:
		"Step into the gap and help keep the fire burning. Join The Non-Stop Series™ as a worship leader, intercessor, volunteer, or supporter. 144 hours of continuous worship needs the whole body of Christ.",
	alternates: { canonical: "https://thenonstop.org/get-involved" },
	openGraph: {
		url: "https://thenonstop.org/get-involved",
		title: "Get Involved — Join The Non-Stop Series™",
		description:
			"Serve, lead, or support 144 hours of non-stop praise and worship. There is a place for you in Africa's greatest continuous worship experience.",
	},
};

const layouts = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="px-2 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 pt-20 container max-w-(--breakpoint-2xl) mx-auto ">
			{children}
		</div>
	);
};

export default layouts;
