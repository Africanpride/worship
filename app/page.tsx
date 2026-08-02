import type { Metadata } from "next";
import { AboutCompliment } from "@/components/about-compliment";
import FAQ from "@/components/faq";
import FeaturedReflections from "@/components/featured-reflections";
import HeroSection from "@/components/hero-section";
import { Ministration } from "../components/ministrations-main";

export const metadata: Metadata = {
	title: "Home",
	description:
		"Welcome to The Non-Stop Series™ — Africa's premier 144-hour continuous praise and worship experience. Celebrating our historic 25th Silver Jubilee Anniversary Edition: 6 days and 6 nights of unbroken worship, intercession, and the Word of God, streaming live to the world from Accra, Ghana.",
	alternates: { canonical: "https://thenonstop.org" },
	openGraph: {
		url: "https://thenonstop.org",
		title: "The Non-Stop Series™ — 25th Anniversary Silver Jubilee Edition",
		description:
			"25 Years of Faith. 6 days. 6 nights. 144 Hours of non-stop praise, worship, and intercession from Accra, Ghana. Join the landmark Silver Jubilee celebration.",
	},
};

export default function Page() {
	return (
		<main className="w-full relative">
			<HeroSection />
			<section className="px-2 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 pt-20 container max-w-(--breakpoint-xl) mx-auto ">
				<AboutCompliment />

				<Ministration />
				<FeaturedReflections />
			</section>
			<section
				id="faq"
				className="px-2 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 container max-w-(--breakpoint-xl) mx-auto"
			>
				<FAQ />
			</section>
		</main>
	);
}
