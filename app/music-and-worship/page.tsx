"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MusicAndWorshipPage() {
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
										<h1 className="text-2xl md:text-3xl lg:text-4xl">
											Music &amp; Worship
										</h1>
										<p className="text-muted-foreground text-xl font-semibold md:text-3xl">
											Ministering Unto the Lord.{" "}
											<span className="text-amber-500 inline-block">
												A Sacred Continuous Offering.
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
										src="/nonstop/nonstop-040.jpg"
										alt="Sacred Worship Ministration"
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
											src="/nonstop/nonstop-026.jpg"
											alt="Choir ministration"
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
											src="/nonstop/nonstop-010.jpg"
											alt="Instrumental soaking"
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
										Music is treated not as performance or entertainment, but as
										sacred ministry before God's presence. Drawing inspiration
										from 1 Chronicles 25:1, psalmists, choirs, and
										instrumentalists minister continuously day and night.
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
												Hours of Praise
											</p>
										</div>
										<div className="flex flex-col items-center gap-2.5">
											<h3 className="text-foreground text-4xl font-medium">
												15+
											</h3>
											<p className="text-muted-foreground text-center font-medium">
												Global Nations
											</p>
										</div>
										<div className="flex flex-col items-center gap-2.5">
											<h3 className="text-foreground text-4xl font-medium">
												30+
											</h3>
											<p className="text-muted-foreground text-center font-medium">
												Ministries United
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
												"/nonstop/nonstop-004.jpg",
												"/nonstop/nonstop-012.jpg",
												"/nonstop/nonstop-022.jpg",
												"/nonstop/nonstop-063.jpg",
											].map((src, idx) => (
												<span
													key={idx}
													className="group/avatar relative flex shrink-0 overflow-hidden rounded-full select-none size-12 ring-2 ring-background"
												>
													<Image
														className="aspect-square size-full object-cover"
														alt="psalmist"
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
											<Link href="/live" className="cursor-pointer">
												Listen Live
											</Link>
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
							alt="Global Worship Ministration"
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
								Presence-centered worship that transcends performance, bringing
								together sounds from diverse nations into one unified throne
								room offering.
							</p>
						</div>
						<div className="order-1 col-span-4 lg:order-none lg:mt-0 lg:pl-6">
							<p className="text-3xl font-medium lg:text-4xl leading-relaxed ">
								Whether through acoustic soaking, corporate praise, prophetic
								song, or choir ministrations, every note rises to gladden the
								heart of God and restore the Tabernacle of David.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* ── Section 3: The Sound of the Altar ───────────────────── */}
			<section className="bg-background py-8 sm:py-16 lg:py-24 mx-auto px-2 sm:px-6 lg:px-8 max-w-7xl">
				<div className="container mx-auto space-y-10 lg:space-y-20">
					<div className="grid grid-cols-1 gap-4 space-y-12 lg:grid-cols-6 lg:space-y-0">
						<div className="order-2 col-span-2 lg:order-none lg:pr-16 lg:pl-10 flex">
							<p className="text-foreground/60 text-xl md:text-xl">
								"David and the leaders of the army set apart for the ministry
								some of the sons of Asaph, Heman, and Jeduthun, who were to
								prophesy with lyres, harps and cymbals."
								<br />— 1 Chronicles 25:1
							</p>
						</div>
						<div className="order-1 col-span-4 lg:order-none lg:mt-0 lg:pl-6">
							<h2 className="text-3xl font-medium lg:text-4xl leading-relaxed mb-6">
								The Sound of The Altar
							</h2>
							<p className="text-muted-foreground text-lg leading-relaxed">
								For 144 continuous hours, a living sound rises before the Lord
								through praise, worship, instrumental ministry, spontaneous
								songs, scripture songs, prophetic expressions, corporate
								adoration, thanksgiving, and prayer &amp; intercession. This
								sound is carried by worshippers, choirs, psalmists,
								instrumentalists, worship leaders, and musicians from different
								churches, ministries, backgrounds, and nations united together
								for one purpose — to glorify the Lord continuously.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* ── Section 4: A Davidic Worship Expression ──────────────── */}
			<section className="bg-background py-8 sm:py-16 lg:py-24 mx-auto px-2 sm:px-6 lg:px-8 max-w-7xl">
				<div className="container mx-auto">
					<h2 className="text-3xl font-medium lg:text-4xl leading-relaxed mb-12 text-center">
						A Davidic Worship Expression
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{[
							{
								title: "Presence-Centered",
								desc: "Worship built around the presence of God, not personalities or performances",
							},
							{
								title: "Continuous Ministry",
								desc: "Unbroken offering of praise, adoration, and devotion unto the Lord",
							},
							{
								title: "Musical Excellence",
								desc: "Spiritual depth combined with musical skill and devotion",
							},
							{
								title: "Worship & Scripture",
								desc: "Songs joined with prayer and the Word of God",
							},
							{
								title: "Prophetic Expressions",
								desc: "Spirit-led songs, declarations, and musical moments",
							},
							{
								title: "Corporate Unity",
								desc: "Multiple nations, backgrounds, and expressions united in one sound",
							},
						].map((item) => (
							<div
								key={item.title}
								className="p-6 rounded-xl bg-muted/40 border border-border/50"
							>
								<h3 className="text-lg mb-2">{item.title}</h3>
								<p className="text-sm text-muted-foreground">{item.desc}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ── Section 5: Sounds From the Nations ──────────────────── */}
			<section className="bg-background py-8 sm:py-16 lg:py-24 mx-auto px-2 sm:px-6 lg:px-8 max-w-7xl">
				<div className="container mx-auto space-y-10 lg:space-y-20">
					<div className="grid grid-cols-1 gap-4 space-y-12 lg:grid-cols-6 lg:space-y-0">
						<div className="col-span-4 lg:mt-0 lg:pr-6">
							<h2 className="text-3xl font-medium lg:text-4xl leading-relaxed mb-6">
								Sounds From the Nations
							</h2>
							<p className="text-muted-foreground text-lg leading-relaxed">
								Over the years, the Non-Stop Series has hosted ministers,
								choirs, and worshippers from multiple nations across Africa and
								the world. This gathering of sounds, languages, instruments,
								cultures, and worship expressions reflects the prophetic picture
								of nations worshipping together before God.
							</p>
						</div>
						<div className="col-span-2 flex">
							<p className="text-foreground/60 text-xl md:text-xl">
								"Let the peoples praise You, O God; let all the peoples praise
								You."
								<br />— Psalm 67:3
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* ── Section 6: The Role of Music in Revival ──────────────── */}
			<section className="bg-background py-8 sm:py-16 lg:py-24 mx-auto px-2 sm:px-6 lg:px-8 max-w-7xl">
				<div className="container mx-auto">
					<h2 className="text-3xl font-medium lg:text-4xl leading-relaxed mb-12 text-center">
						The Role of Music in Revival
					</h2>
					<p className="text-muted-foreground text-lg text-center max-w-3xl mx-auto mb-8">
						We believe worship is not merely inspirational — it is
						transformational. Throughout Scripture, worship shifted atmospheres,
						opened heavens, released victory, brought healing, gathered people
						into God's presence, and prepared hearts for revival.
					</p>
					<p className="text-muted-foreground text-lg text-center max-w-3xl mx-auto">
						As continuous worship rises before the Lord, we believe hearts are
						awakened, lives are renewed, and nations are impacted by the glory
						of God.
					</p>
				</div>
			</section>

			{/* ── Section 7: Join The Sound CTA ───────────────────────── */}
			<section className="bg-background py-8 sm:py-16 lg:py-24 mx-auto px-2 sm:px-6 lg:px-8 max-w-7xl">
				<div className="container mx-auto text-center space-y-8">
					<h2 className="text-3xl font-medium lg:text-4xl leading-relaxed">
						Join The Sound
					</h2>
					<p className="text-muted-foreground text-lg max-w-2xl mx-auto">
						Whether you are a singer, musician, psalmist, worshipper, choir
						member, or simply someone who desires to minister unto the Lord,
						there is a place for you on the altar. Come and take your watch.
						Lift your sound.
					</p>
					<div className="flex flex-wrap justify-center gap-4">
						<Link href="/live" className="cursor-pointer">
							<Button
								size="lg"
								className="rounded-full font-bold uppercase tracking-widest text-xs"
							>
								Listen Live
							</Button>
						</Link>
						<Link href="/get-involved" className="cursor-pointer">
							<Button
								size="lg"
								variant="outline"
								className="rounded-full font-bold uppercase tracking-widest text-xs"
							>
								Take Your Watch
							</Button>
						</Link>
					</div>
				</div>
			</section>
		</main>
	);
}
