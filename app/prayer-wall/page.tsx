"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PrayerWallPage() {
	return (
		<main className="flex flex-col min-h-screen w-full relative pt-12 md:pt-16">
			{/* ── Section 1: Hero Grid (Matches app/get-involved design) ──────────── */}
			<section className="bg-background py-8 sm:py-16 lg:py-24 ">
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
						{/* Left Column */}
						<div className="flex flex-col gap-9 ">
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
										<h1 className="text-2xl font-semibold md:text-3xl lg:text-4xl">
											The Prayer Wall
										</h1>
										<p className="text-muted-foreground text-xl font-semibold md:text-3xl">
											Standing in the Gap.{" "}
											<span className="text-amber-500 inline-block">
												Continuous Intercession for Nations &amp; Families.
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
								<div className="relative max-h-91 h-[400px] w-full rounded-lg overflow-hidden">
									<Image
										src="/nonstop/nonstop-029.jpg"
										alt="Intercession and Prayer"
										fill
										sizes="100vw"
										className="object-cover object-top"
										priority
									/>
								</div>
							</motion.div>
						</div>

						{/* Right Column */}
						<div className="flex flex-col gap-6">
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
											src="/nonstop/nonstop-032.jpg"
											alt="Intercessors praying"
											fill
											sizes="(max-width: 640px) 100vw, 50vw"
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
											src="/nonstop/nonstop-007.jpg"
											alt="Prayer altar"
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
										"My house shall be called a house of prayer for all
										nations." (Isaiah 56:7). Throughout the 144 hours,
										intercessory watchmen pray over submitted requests, national
										revival, and family restoration.
									</p>
								</motion.div>

								{/* Stats row */}
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
												24/7
											</h3>
											<p className="text-muted-foreground text-center font-medium">
												Intercession
											</p>
										</div>
										<div className="flex flex-col items-center gap-2.5">
											<h3 className="text-foreground text-4xl font-medium">
												10k+
											</h3>
											<p className="text-muted-foreground text-center font-medium">
												Testimonies
											</p>
										</div>
										<div className="flex flex-col items-center gap-2.5">
											<h3 className="text-foreground text-4xl font-medium">
												100%
											</h3>
											<p className="text-muted-foreground text-center font-medium">
												Faith Agreement
											</p>
										</div>
									</div>
								</motion.div>

								{/* Avatars & CTA */}
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
											{[
												"/nonstop/nonstop-001.jpg",
												"/nonstop/nonstop-048.jpg",
												"/nonstop/nonstop-022.jpg",
												"/nonstop/nonstop-047.jpg",
											].map((src, idx) => (
												<span
													key={idx}
													className="group/avatar relative flex shrink-0 overflow-hidden rounded-full select-none size-12 ring-2 ring-background"
												>
													<Image
														className="aspect-square size-full object-cover"
														alt="intercessor"
														src={src}
														fill
														sizes="48px"
													/>
												</span>
											))}
										</div>
										<Button
											asChild
											className="shrink-0 rounded-full bg-amber-500 hover:bg-amber-600 text-white h-12 px-8 uppercase tracking-wider font-bold"
										>
											<Link href="/contact" className="cursor-pointer">Submit Prayer Request</Link>
										</Button>
									</div>
								</motion.div>
							</div>
						</div>
					</motion.div>
				</div>
			</section>

			{/* ── Section 2: Full-bleed image / Callout ─────────────────────────── */}
			<section className="bg-background py-8 sm:py-16 lg:py-24 mx-auto sm:px-6 lg:px-8 max-w-7xl">
				<div className="container space-y-10 lg:space-y-20">
					<div
						data-usal="fade-u duration-500"
						className="relative mt-4 h-96 md:h-140 w-full rounded-2xl overflow-hidden shadow-xl"
					>
						<Image
							alt="Corporate Prayer Atmosphere"
							fill
							className="object-cover object-center"
							src="/nonstop/nonstop-043.jpg"
						/>
					</div>
					<div
						className="grid grid-cols-1 gap-4 space-y-12 lg:grid-cols-6 lg:space-y-0"
						data-usal="fade-u duration-500"
					>
						<div className="order-2 col-span-2 lg:order-none lg:pr-16 lg:pl-10 flex ">
							<p className="text-foreground/60 text-xl md:text-xl ">
								Prayer wall intercessors stand in agreement for personal
								breakthroughs, national revival, and bodily healing.
							</p>
						</div>
						<div className="order-1 col-span-4 lg:order-none lg:mt-0 lg:pl-6">
							<p className="text-3xl font-medium lg:text-4xl leading-relaxed ">
								Every prayer request submitted during the 144 hours is carried
								before the altar by dedicated prayer teams across nations.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* ── Section 3: Submit Your Prayer Request ────────────────── */}
			<section className="bg-background py-8 sm:py-16 lg:py-24 mx-auto sm:px-6 lg:px-8 max-w-7xl">
				<div className="container space-y-10 lg:space-y-20">
					<div className="grid grid-cols-1 gap-4 space-y-12 lg:grid-cols-6 lg:space-y-0">
						<div className="order-2 col-span-2 lg:order-none lg:pr-16 lg:pl-10 flex">
							<p className="text-foreground/60 text-xl md:text-xl">
								"Again, I say to you that if two of you agree on earth
								concerning anything that they ask, it will be done for them by
								My Father in heaven."
								<br />— Matthew 18:19
							</p>
						</div>
						<div className="order-1 col-span-4 lg:order-none lg:mt-0 lg:pl-6">
							<h2 className="text-3xl font-medium lg:text-4xl leading-relaxed mb-6">
								Submit Your Prayer Request
							</h2>
							<p className="text-muted-foreground text-lg leading-relaxed mb-4">
								We invite you to share your prayer needs with us. Whether you
								are believing God for:
							</p>
							<div className="grid grid-cols-2 gap-2 mb-6">
								{[
									"Healing and restoration",
									"Family and relationships",
									"Salvation of loved ones",
									"Employment and provision",
									"Academic success",
									"Ministry and leadership",
									"Business and career growth",
									"Breakthrough and direction",
									"Peace and encouragement",
									"National and global concerns",
								].map((item) => (
									<span key={item} className="text-sm text-muted-foreground">
										• {item}
									</span>
								))}
							</div>
							<p className="text-muted-foreground text-lg leading-relaxed">
								Our intercessors will stand in agreement with you during the
								continuous prayer watches.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* ── Section 4: Prayer For the Nations ───────────────────── */}
			<section className="bg-background py-8 sm:py-16 lg:py-24 mx-auto sm:px-6 lg:px-8 max-w-7xl">
				<div className="container">
					<h2 className="text-3xl font-medium lg:text-4xl leading-relaxed mb-12 text-center">
						Prayer For the Nations
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{[
							{
								title: "Nations and Governments",
								desc: "Leadership, wisdom, and divine direction",
							},
							{
								title: "Peace and Justice",
								desc: "Conflict resolution and righteous governance",
							},
							{
								title: "Revival and Awakening",
								desc: "Spiritual renewal across communities",
							},
							{
								title: "Families and Communities",
								desc: "Restoration, unity, and healing",
							},
							{
								title: "Education and Leadership",
								desc: "Godly wisdom in institutions",
							},
							{
								title: "Economic Transformation",
								desc: "Provision and stewardship",
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

			{/* ── Section 5: Share Your Testimony ─────────────────────── */}
			<section className="bg-background py-8 sm:py-16 lg:py-24 mx-auto sm:px-6 lg:px-8 max-w-7xl">
				<div className="container space-y-10 lg:space-y-20">
					<div className="grid grid-cols-1 gap-4 space-y-12 lg:grid-cols-6 lg:space-y-0">
						<div className="col-span-4 lg:mt-0 lg:pr-6">
							<h2 className="text-3xl font-medium lg:text-4xl leading-relaxed mb-6">
								Share Your Testimony
							</h2>
							<p className="text-muted-foreground text-lg leading-relaxed">
								Has God answered your prayer? Has the Lord healed, restored,
								provided, protected, or transformed your life? We would love to
								hear your testimony. Your testimony strengthens faith,
								encourages others, and gives glory to God.
							</p>
						</div>
						<div className="col-span-2 flex">
							<p className="text-foreground/60 text-xl md:text-xl">
								"Let the redeemed of the Lord tell their story."
								<br />— Psalm 107:2
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* ── Section 6: How You Can Participate ──────────────────── */}
			<section className="bg-background py-8 sm:py-16 lg:py-24 mx-auto sm:px-6 lg:px-8 max-w-7xl">
				<div className="container">
					<h2 className="text-3xl font-medium lg:text-4xl leading-relaxed mb-12 text-center">
						How You Can Participate
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
						{[
							{
								title: "Submit a Prayer Request",
								desc: "Share your need confidentially with our prayer teams.",
							},
							{
								title: "Pray For Others",
								desc: "Stand in faith for fellow believers and nations.",
							},
							{
								title: "Share a Testimony",
								desc: "Encourage others by declaring what the Lord has done.",
							},
							{
								title: "Join A Prayer Watch",
								desc: "Become part of the continuous chain of intercession.",
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

			{/* ── Section 7: We Are Praying with You CTA ──────────────── */}
			<section className="bg-background py-8 sm:py-16 lg:py-24 mx-auto sm:px-6 lg:px-8 max-w-7xl">
				<div className="container text-center space-y-8">
					<h2 className="text-3xl font-medium lg:text-4xl leading-relaxed">
						We Are Praying with You
					</h2>
					<p className="text-muted-foreground text-lg max-w-2xl mx-auto">
						Whatever season you may be facing, know that you are not standing
						alone. Together, we lift our voices, our prayers, and our faith
						before the Lord. The altar remains open.
					</p>
					<div className="flex flex-wrap justify-center gap-4">
						<Link href="/contact" className="cursor-pointer">
							<Button
								size="lg"
								className="rounded-full font-bold uppercase tracking-widest text-xs"
							>
								Submit Your Request
							</Button>
						</Link>
						<Link href="/watches" className="cursor-pointer">
							<Button
								size="lg"
								variant="outline"
								className="rounded-full font-bold uppercase tracking-widest text-xs"
							>
								Join A Prayer Watch
							</Button>
						</Link>
					</div>
				</div>
			</section>
		</main>
	);
}
