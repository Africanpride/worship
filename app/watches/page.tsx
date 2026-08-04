"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function WatchesPage() {
	return (
		<main className="flex flex-col min-h-screen w-full relative pt-12 md:pt-16">
			{/* ── Section 1: Hero Grid (Matches app/get-involved design) ──────────── */}
			<section className="bg-background py-8 sm:py-16 lg:py-24 ">
				<div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
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
											The Watches
										</h1>
										<p className="text-muted-foreground text-xl font-semibold md:text-3xl">
											The Fire Must Not Go Out.{" "}
											<span className="text-amber-500 inline-block">
												Stand Your Watch Before the Lord.
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
										src="/nonstop/nonstop-018.jpg"
										alt="Worship Watch"
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
											src="/nonstop/nonstop-014.jpg"
											alt="Intercession watch"
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
											src="/nonstop/nonstop-020.jpg"
											alt="Midnight watch"
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
										For 144 continuous hours, the altar remains active before
										the Lord through unbroken praise, worship, prayer, and Bible
										reading. Just as King David appointed ministers to serve
										before the Ark continually (1 Chron 16:37), every watch
										carries a sacred assignment.
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
												144
											</h3>
											<p className="text-muted-foreground text-center font-medium">
												Continuous Hours
											</p>
										</div>
										<div className="flex flex-col items-center gap-2.5">
											<h3 className="text-foreground text-4xl font-medium">
												24/7
											</h3>
											<p className="text-muted-foreground text-center font-medium">
												Unbroken Sound
											</p>
										</div>
										<div className="flex flex-col items-center gap-2.5">
											<h3 className="text-foreground text-4xl font-medium">
												6 &amp; 6
											</h3>
											<p className="text-muted-foreground text-center font-medium">
												Days &amp; Nights
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
														alt="worshipper"
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
											<Link href="/get-involved" className="cursor-pointer">Take Your Watch</Link>
										</Button>
									</div>
								</motion.div>
							</div>
						</div>
					</motion.div>
				</div>
			</section>

			{/* ── Section 2: Full-bleed image / Callout ─────────────────────────── */}
			<section className="bg-background py-8 sm:py-16 lg:py-24 mx-auto px-2 sm:px-6 lg:px-8 max-w-7xl">
				<div className="container mx-auto space-y-10 lg:space-y-20">
					<div
						data-usal="fade-u duration-500"
						className="relative mt-4 h-96 md:h-140 w-full rounded-2xl overflow-hidden shadow-xl"
					>
						<Image
							alt="Night watches"
							fill
							className="object-cover object-center"
							src="/nonstop/nonstop-045.jpg"
						/>
					</div>
					<div
						className="grid grid-cols-1 gap-4 space-y-12 lg:grid-cols-6 lg:space-y-0"
						data-usal="fade-u duration-500"
					>
						<div className="order-2 col-span-2 lg:order-none lg:pr-16 lg:pl-10 flex ">
							<p className="text-foreground/60 text-xl md:text-xl ">
								"I have set watchmen on your walls, O Jerusalem; they shall
								never hold their peace day or night." — Isaiah 62:6
							</p>
						</div>
						<div className="order-1 col-span-4 lg:order-none lg:mt-0 lg:pl-6">
							<p className="text-3xl font-medium lg:text-4xl leading-relaxed ">
								Particular emphasis is placed on the night and midnight watches
								— moments of intense consecration, deep spiritual alertness, and
								standing in the gap for families, cities, and nations. Watch by
								watch, hour by hour, we build an unbroken sound before the Lord.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* ── Section 3: What Is a Watch ─────────────────────────── */}
			<section className="bg-background py-8 sm:py-16 lg:py-24 mx-auto px-2 sm:px-6 lg:px-8 max-w-7xl">
				<div className="container mx-auto space-y-10 lg:space-y-20">
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
								What Is a Watch?
							</h2>
							<p className="text-muted-foreground text-lg leading-relaxed mb-6">
								A watch is a dedicated period of continuous ministry unto the
								Lord. Each watch becomes a moment of worship, a time of
								intercession, a gathering around God's presence, and a spiritual
								assignment carried by worshippers and watchmen.
							</p>
							<p className="text-muted-foreground text-lg leading-relaxed">
								Throughout the 144 hours, the altar remains active continuously
								with simultaneous expressions of: Praise &amp; Worship, Prayer
								&amp; Intercession, Bible Reading, and Thanksgiving &amp;
								Adoration. Every watch contributes to sustaining the continuous
								sound ascending before the Lord.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* ── Section 4: The Structure of the Watches ─────────────── */}
			<section className="bg-background py-8 sm:py-16 lg:py-24 mx-auto px-2 sm:px-6 lg:px-8 max-w-7xl">
				<div className="container mx-auto">
					<h2 className="text-3xl font-medium lg:text-4xl leading-relaxed mb-12 text-center">
						The Structure of the Watches
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
						{[
							{
								title: "Corporate Praise",
								desc: "United voices exalting the Lord together",
							},
							{
								title: "Deep Worship",
								desc: "Intimate moments of adoration and surrender",
							},
							{
								title: "Scripture Reading",
								desc: "The Word of God proclaimed continuously",
							},
							{
								title: "Intercession",
								desc: "Standing in the gap for nations and families",
							},
							{
								title: "Prophetic Songs",
								desc: "Spirit-led musical expressions",
							},
							{
								title: "Instrumental Worship",
								desc: "Musical ministry without words",
							},
							{ title: "Thanksgiving", desc: "Celebrating God's faithfulness" },
							{
								title: "Declarations",
								desc: "Proclaiming God's promises over the earth",
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

			{/* ── Section 5: The Night Watches ────────────────────────── */}
			<section className="bg-background py-8 sm:py-16 lg:py-24 mx-auto px-2 sm:px-6 lg:px-8 max-w-7xl">
				<div className="container mx-auto space-y-10 lg:space-y-20">
					<div className="grid grid-cols-1 gap-4 space-y-12 lg:grid-cols-6 lg:space-y-0">
						<div className="col-span-4 lg:mt-0 lg:pr-6">
							<h2 className="text-3xl font-medium lg:text-4xl leading-relaxed mb-6">
								The Night Watches
							</h2>
							<p className="text-muted-foreground text-lg leading-relaxed mb-6">
								Particular emphasis is placed on the night watches. Throughout
								Scripture, the night watches were moments of prayer, spiritual
								alertness, divine encounters, intercession, and worship before
								the Lord.
							</p>
							<p className="text-muted-foreground text-lg leading-relaxed">
								The midnight and early morning watches become powerful moments
								of consecration, deep worship, and standing in the gap for
								nations, families, communities, and generations.
							</p>
						</div>
						<div className="col-span-2 flex">
							<p className="text-foreground/60 text-xl md:text-xl">
								"I have set watchmen on your walls, O Jerusalem; they shall
								never hold their peace day or night."
								<br />— Isaiah 62:6
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* ── Section 6: A Place for Everyone ─────────────────────── */}
			<section className="bg-background py-8 sm:py-16 lg:py-24 mx-auto px-2 sm:px-6 lg:px-8 max-w-7xl">
				<div className="container mx-auto">
					<h2 className="text-3xl font-medium lg:text-4xl leading-relaxed mb-12 text-center">
						A Place for Everyone
					</h2>
					<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
						{[
							"Worshipper",
							"Intercessor",
							"Musician",
							"Choir Member",
							"Scripture Reader",
							"Volunteer",
							"Watch Leader",
							"Partner",
						].map((role) => (
							<div
								key={role}
								className="p-4 rounded-xl bg-muted/40 border border-border/50 text-center"
							>
								<span className="font-semibold text-sm">{role}</span>
							</div>
						))}
					</div>
					<p className="text-muted-foreground text-lg text-center mt-8">
						The altar is not sustained by one person or one ministry alone. It
						is carried collectively by worshippers from different backgrounds
						and nations united in one purpose — to glorify the Lord
						continuously.
					</p>
				</div>
			</section>

			{/* ── Section 7: Take Your Watch CTA ──────────────────────── */}
			<section className="bg-background py-8 sm:py-16 lg:py-24 mx-auto px-2 sm:px-6 lg:px-8 max-w-7xl">
				<div className="container mx-auto text-center space-y-8">
					<h2 className="text-3xl font-medium lg:text-4xl leading-relaxed">
						Take Your Watch
					</h2>
					<p className="text-muted-foreground text-lg max-w-2xl mx-auto">
						This is more than attendance. It is participation. It is responding
						to the call to stand before the Lord and minister unto Him. Whether
						during the day or through the midnight hours, every watch matters.
					</p>
					<div className="flex flex-wrap justify-center gap-4">
						<Link href="/get-involved" className="cursor-pointer">
							<Button
								size="lg"
								className="rounded-full font-bold uppercase tracking-widest text-xs"
							>
								Join The Altar
							</Button>
						</Link>
						<Link href="/prayer-wall" className="cursor-pointer">
							<Button
								size="lg"
								variant="outline"
								className="rounded-full font-bold uppercase tracking-widest text-xs"
							>
								Submit Prayer Request
							</Button>
						</Link>
					</div>
				</div>
			</section>
		</main>
	);
}
