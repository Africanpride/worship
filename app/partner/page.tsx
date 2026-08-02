"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { DonationOptions } from "@/components/DonationOptions";
import { Button } from "@/components/ui/button";

export default function PartnerPage() {
	const scrollToDonations = () => {
		document.getElementById("give")?.scrollIntoView({ behavior: "smooth" });
	};

	return (
		<main className="flex flex-col min-h-screen w-full relative">
			<section className="bg-background sm:py-16 lg:py-24 ">
				<div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
					<motion.div
						className="grid grid-cols-1 gap-9 lg:grid-cols-2"
						initial="hidden"
						whileInView="show"
						viewport={{ once: false, amount: 0.1 }}
						variants={{
							hidden: { opacity: 0 },
							show: {
								opacity: 1,
								transition: { staggerChildren: 0.15 },
							},
						}}
					>
						<div
							className="flex flex-col gap-9 "
							data-scroll
							data-scroll-delay="-0.1"
						>
							<div className="flex items-center gap-6 overflow-hidden">
								<div className="to-amber-500 h-52 w-4 bg-gradient-to-t from-transparent" />
								<motion.div
									variants={{
										hidden: { opacity: 0, y: 40 },
										show: {
											opacity: 1,
											y: 0,
											transition: { duration: 0.8, ease: "easeOut" },
										},
									}}
								>
									<div className="space-y-4">
										<h2 className="text-2xl font-semibold md:text-3xl lg:text-4xl flex items-center gap-3">
											Partner With Us
											<span className="bg-amber-500/10 text-amber-500 text-[10px] py-1 px-3 rounded-full border border-amber-500/20 font-bold tracking-widest uppercase">
												Silver Jubilee
											</span>
										</h2>
										<p className="text-muted-foreground text-xl font-semibold md:text-3xl">
											Celebrating 25 Years of Fueling the Vision of Recovery,
											Revival, and Restoration.{" "}
											<span className="text-amber-500 inline-block">
												Join The Non-Stop.
											</span>
										</p>
									</div>
								</motion.div>
							</div>
							<motion.div
								variants={{
									hidden: { opacity: 0, y: 40 },
									show: {
										opacity: 1,
										y: 0,
										transition: { duration: 0.8, ease: "easeOut" },
									},
								}}
							>
								<div className="relative max-h-91 lg:h-[400px] w-full rounded-lg overflow-hidden">
									<Image
										src="/images/live-worship.jpg"
										alt="worship ministration"
										fill
										className="object-cover object-top"
									/>
								</div>
							</motion.div>
						</div>
						<div
							className="flex flex-col gap-6"
							data-scroll
							data-scroll-speed="-0.2"
						>
							<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
								<motion.div
									variants={{
										hidden: { opacity: 0, scale: 0.95 },
										show: {
											opacity: 1,
											scale: 1,
											transition: { duration: 0.8, ease: "easeOut" },
										},
									}}
								>
									<div className="relative overflow-hidden rounded-md h-52 w-full">
										<Image
											src="/images/uche.jpg"
											alt="ministry service"
											fill
											className="object-cover object-top"
										/>
									</div>
								</motion.div>
								<motion.div
									variants={{
										hidden: { opacity: 0, scale: 0.95 },
										show: {
											opacity: 1,
											scale: 1,
											transition: { duration: 0.8, ease: "easeOut" },
										},
									}}
								>
									<div className="relative overflow-hidden rounded-md h-52 w-full">
										<Image
											src="/images/mass-choir7.jpg"
											alt="worship atmosphere"
											fill
											className="object-cover object-top"
										/>
									</div>
								</motion.div>
							</div>
							<div className="flex flex-1 flex-col justify-center gap-9">
								<motion.div
									variants={{
										hidden: { opacity: 0, y: 30 },
										show: {
											opacity: 1,
											y: 0,
											transition: { duration: 0.8, ease: "easeOut" },
										},
									}}
								>
									<p className="text-muted-foreground text-xl leading-relaxed">
										Partnering with the Non-Stop Series is a sacred covenant
										investment into an unbroken altar of praise, worship,
										prayer, and Scripture reading. As we gather worshippers
										across nations for 144 continuous hours, your support
										enables high-definition global broadcasting, venue
										logistics, hospitality for hundreds of psalmists &amp;
										intercessors, technical infrastructure, and community
										outreach. By partnering with us, you become a foundational
										part of this historic 25th Anniversary landmark edition.
									</p>
								</motion.div>
								<motion.div
									variants={{
										hidden: { opacity: 0, y: 30 },
										show: {
											opacity: 1,
											y: 0,
											transition: { duration: 0.8, ease: "easeOut" },
										},
									}}
								>
									<div className="grid gap-10 sm:grid-cols-3">
										<div className="flex flex-col items-center gap-2.5">
											<h3 className="text-foreground text-4xl font-medium">
												144
											</h3>
											<p className="text-muted-foreground text-center font-medium">
												Hours of Worship
											</p>
										</div>
										<div className="flex flex-col items-center gap-2.5">
											<h3 className="text-foreground text-4xl font-medium">
												1M+
											</h3>
											<p className="text-muted-foreground text-center font-medium">
												Global Reach
											</p>
										</div>
										<div className="flex flex-col items-center gap-2.5">
											<h3 className="text-foreground text-4xl font-medium">
												50+
											</h3>
											<p className="text-muted-foreground text-center font-medium">
												Nations Joined
											</p>
										</div>
									</div>
								</motion.div>
								<motion.div
									variants={{
										hidden: { opacity: 0, y: 30 },
										show: {
											opacity: 1,
											y: 0,
											transition: { duration: 0.8, ease: "easeOut" },
										},
									}}
								>
									<div className="flex items-center justify-between gap-6">
										<div className="flex -space-x-3">
											<span
												data-slot="avatar"
												data-size="default"
												className="group/avatar relative flex shrink-0 overflow-hidden rounded-full select-none data-[size=lg]:size-10 data-[size=sm]:size-6 ring-background size-12 ring-2"
											>
												<Image
													data-slot="avatar-image"
													className="aspect-square size-full object-cover"
													alt="worshipper"
													src="/images/david.jpg"
													fill
												/>
											</span>
											<span
												data-slot="avatar"
												data-size="default"
												className="group/avatar relative flex shrink-0 overflow-hidden rounded-full select-none data-[size=lg]:size-10 data-[size=sm]:size-6 ring-background size-12 ring-2"
											>
												<Image
													data-slot="avatar-image"
													className="aspect-square size-full object-cover"
													alt="lead singer"
													src="/images/samuel.jpg"
													fill
												/>
											</span>
											<span
												data-slot="avatar"
												data-size="default"
												className="group/avatar relative flex shrink-0 overflow-hidden rounded-full select-none data-[size=lg]:size-10 data-[size=sm]:size-6 ring-background size-12 ring-2"
											>
												<Image
													data-slot="avatar-image"
													className="aspect-square size-full object-cover"
													alt="musician"
													src="/images/marion.jpg"
													fill
												/>
											</span>
											<span
												data-slot="avatar"
												data-size="default"
												className="group/avatar relative flex shrink-0 overflow-hidden rounded-full select-none data-[size=lg]:size-10 data-[size=sm]:size-6 ring-background size-12 ring-2"
											>
												<Image
													data-slot="avatar-image"
													className="aspect-square size-full object-cover"
													alt="volunteer"
													src="/images/mama-t.jpg"
													fill
												/>
											</span>
										</div>

										<Button
											onClick={scrollToDonations}
											className="shrink-0 rounded-full bg-amber-500 hover:bg-amber-600 text-white shadow-xs h-12 px-8 uppercase tracking-wider active:scale-95 transition-all"
										>
											Partner Now
										</Button>
									</div>
								</motion.div>
							</div>
						</div>
					</motion.div>
				</div>
			</section>

			<section className="py-8">
				<div
					id="give"
					className="pt-12 scroll-mt-24 max-w-7xl mx-auto md:px-6 lg:px-8"
				>
					<div className="mb-8">
						<h3 className="text-3xl font-bebas tracking-wider mb-2">
							Ways to Give - 25th Year Jubilee
						</h3>
						<p className="text-muted-foreground">
							Choose your preferred method of contribution to this landmark
							edition.
						</p>
					</div>
					<div className="bg-secondary/10 border border-border rounded-3xl p-2 sm:p-8">
						<DonationOptions />
					</div>
				</div>
			</section>

			{/* ── Section 3: Become An Asaph ──────────────────────────── */}
			<section className="bg-background py-8 sm:py-16 lg:py-24 mx-auto sm:px-6 lg:px-8 max-w-7xl">
				<div className="container space-y-10 lg:space-y-20">
					<div className="grid grid-cols-1 gap-4 space-y-12 lg:grid-cols-6 lg:space-y-0">
						<div className="order-2 col-span-2 lg:order-none lg:pr-16 lg:pl-10 flex">
							<p className="text-foreground/60 text-xl md:text-xl">
								"So, he left Asaph and his brothers there before the ark of the
								covenant of the Lord to minister before the ark regularly, as
								every day's work required."
								<br />— 1 Chronicles 16:37
							</p>
						</div>
						<div className="order-1 col-span-4 lg:order-none lg:mt-0 lg:pl-6">
							<h2 className="text-3xl font-medium lg:text-4xl leading-relaxed mb-6">
								Become An Asaph for This Generation
							</h2>
							<p className="text-muted-foreground text-lg leading-relaxed">
								King David appointed Asaph and others to minister continually
								before the Ark of the Covenant. The ministry of worship required
								people who were willing to support and sustain the vision.
								Today, we invite you to become an "Asaph" for this generation by
								helping establish and maintain continuous worship before the
								Lord.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* ── Section 4: Ways To Partner ──────────────────────────── */}
			<section className="bg-background py-8 sm:py-16 lg:py-24 mx-auto sm:px-6 lg:px-8 max-w-7xl">
				<div className="container">
					<h2 className="text-3xl font-medium lg:text-4xl leading-relaxed mb-12 text-center">
						Ways To Partner
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
						{[
							{
								title: "Sponsor A Watch",
								desc: "Help sustain one or more worship watches during the 144-hour altar. Your sponsorship supports worship teams, prayer teams, Scripture readers, and logistics.",
							},
							{
								title: "Support The Livestream",
								desc: "Help extend the sound of the altar to homes, churches, workplaces, and nations around the world through live broadcasting.",
							},
							{
								title: "Support Worship & Prayer Teams",
								desc: "Partner toward the practical needs of the many ministers, volunteers, musicians, and intercessors who serve throughout the 144 hours.",
							},
							{
								title: "Support The Movement",
								desc: "Help strengthen the long-term vision of establishing continuous worship, prayer, and Scripture reading beyond a single event.",
							},
						].map((item) => (
							<div
								key={item.title}
								className="p-6 rounded-xl bg-muted/40 border border-border/50"
							>
								<h3 className="font-semibold text-lg mb-2">{item.title}</h3>
								<p className="text-sm text-muted-foreground">{item.desc}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ── Section 5: Other Ways to Give ───────────────────────── */}
			<section className="bg-background py-8 sm:py-16 lg:py-24 mx-auto sm:px-6 lg:px-8 max-w-7xl">
				<div className="container">
					<h2 className="text-3xl font-medium lg:text-4xl leading-relaxed mb-12 text-center">
						Other Ways to Give
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
						{[
							{
								title: "Service",
								desc: "Volunteer your time, skills, and expertise to sustain the altar.",
							},
							{
								title: "Equipment & Resources",
								desc: "Support with technical equipment, media resources, transportation, hospitality, and logistics.",
							},
							{
								title: "Prayer & Advocacy",
								desc: "Commit to praying for the vision and share it with your church, ministry, family, and networks.",
							},
						].map((item) => (
							<div
								key={item.title}
								className="p-6 rounded-xl bg-muted/40 border border-border/50 text-center"
							>
								<h3 className="font-semibold text-lg mb-2">{item.title}</h3>
								<p className="text-sm text-muted-foreground">{item.desc}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ── Section 6: Our Commitment ───────────────────────────── */}
			<section className="bg-background py-8 sm:py-16 lg:py-24 mx-auto sm:px-6 lg:px-8 max-w-7xl">
				<div className="container text-center space-y-8">
					<h2 className="text-3xl font-medium lg:text-4xl leading-relaxed">
						Our Commitment
					</h2>
					<p className="text-muted-foreground text-lg max-w-2xl mx-auto">
						We are committed to stewarding every partnership and contribution
						with integrity, accountability, and faithfulness to the vision
						entrusted to us. Our desire is not simply to host an event but to
						build a lasting legacy of worship that glorifies God and impacts
						generations.
					</p>
					<div className="flex flex-wrap justify-center gap-4">
						<Link href="/get-involved">
							<Button
								size="lg"
								className="rounded-full font-bold uppercase tracking-widest text-xs"
							>
								Join The Movement
							</Button>
						</Link>
					</div>
				</div>
			</section>

			<section className="bg-background sm:py-16 lg:py-24 mx-auto  sm:px-6 lg:px-8 max-w-7xl">
				<div className="container space-y-10 lg:space-y-20">
					<div
						data-usal="fade-u duration-500"
						className="relative mt-4 h-64 md:h-140 w-full rounded-2xl overflow-hidden shadow-lg transition-all duration-700"
					>
						<Image
							alt="Community worship"
							fill
							className="object-cover object-center"
							src="/nonstop/nonstop-063.jpg"
						/>
					</div>
					<div
						className="grid grid-cols-1 gap-4 space-y-12 lg:grid-cols-6 lg:space-y-0"
						data-usal="fade-u duration-500"
					>
						<div className="order-2 col-span-2 lg:order-none lg:pr-16 lg:pl-10 flex ">
							<p className="text-foreground/60 text-xl md:text-xl ">
								Sacrifice is the Language of Worship. Your contribution fuels
								the continuous flow of worship.
							</p>
						</div>
						<div className="order-1 col-span-4 lg:order-none lg:mt-0 lg:pl-6 space-y-8">
							<p className="text-3xl font-medium lg:text-4xl leading-relaxed ">
								Whether you offer cash or donate logistics, provisions, and
								livestock, your generous support forms a fundamental pillar of
								this eternal altar. Together, we celebrate two-and-a-half
								decades of building a throne for the King and transforming
								nations.
							</p>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
