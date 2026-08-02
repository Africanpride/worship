import type { Metadata } from "next";
import type React from "react";

export const metadata: Metadata = {
	title: "Scripture Reading — The Voice of God at the Centre",
	description:
		"The continuous public reading of Scripture during The Non-Stop Series™ — 144 hours of God's Word proclaimed over nations, families, and communities.",
	alternates: { canonical: "https://thenonstop.org/scripture-reading" },
	openGraph: {
		url: "https://thenonstop.org/scripture-reading",
		title: "Scripture Reading — Proclaiming the Living Word",
		description:
			"From Genesis to Revelation — the Word of God read continuously throughout 144 hours of worship.",
	},
};

const ScriptureLayout = ({ children }: { children: React.ReactNode }) => {
	return <>{children}</>;
};

export default ScriptureLayout;
