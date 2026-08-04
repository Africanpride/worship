"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ScriptureReadingPage() {
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
											Scripture Reading
										</h1>
										<p className="text-muted-foreground text-xl font-semibold md:text-3xl">
											The Public Reading of Scripture.{" "}
											<span className="text-amber-500 inline-block">
												Proclaiming the Living Word Day &amp; Night.
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
										src="/nonstop/nonstop-036.jpg"
										alt="Public Reading of Scripture"
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
											src="/nonstop/nonstop-038.jpg"
											alt="Scripture reader at altar"
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
											src="/nonstop/nonstop-041.jpg"
											alt="Atmosphere of the Word"
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
										"Until I come, devote yourself to the public reading of
										Scripture..." (1 Tim 4:13). For 144 continuous hours,
										believers take turns declaring God's Word aloud over the
										congregation and global stream.
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
												Hours of Word
											</p>
										</div>
										<div className="flex flex-col items-center gap-2.5">
											<h3 className="text-foreground text-4xl font-medium">
												66
											</h3>
											<p className="text-muted-foreground text-center font-medium">
												Books Declared
											</p>
										</div>
										<div className="flex flex-col items-center gap-2.5">
											<h3 className="text-foreground text-4xl font-medium">
												100+
											</h3>
											<p className="text-muted-foreground text-center font-medium">
												Volunteers
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
														alt="reader"
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
											<Link href="/get-involved" className="cursor-pointer">Sign Up to Read</Link>
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
							alt="Scripture Reading Session"
							fill
							className="object-cover object-center object-top"
							src="/nonstop/nonstop-039.jpg"
						/>
					</div>
					<div
						className="grid grid-cols-1 gap-4 space-y-12 lg:grid-cols-6 lg:space-y-0"
						data-usal="fade-u duration-500"
					>
						<div className="order-2 col-span-2 lg:order-none lg:pr-16 lg:pl-10 flex ">
							<p className="text-foreground/60 text-xl md:text-xl ">
								Public reading of scripture saturates the spiritual atmosphere
								with divine truth and authority.
							</p>
						</div>
						<div className="order-1 col-span-4 lg:order-none lg:mt-0 lg:pl-6">
							<p className="text-3xl font-medium lg:text-4xl leading-relaxed ">
								From Genesis to Revelation, the Word of God is proclaimed
								without interruption, establishing righteousness, light, and
								spiritual strength across the convocation.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* ── Section 3: Why Continuous Scripture Reading? ─────────── */}
			<section className="bg-background py-8 sm:py-16 lg:py-24 mx-auto px-2 sm:px-6 lg:px-8 max-w-7xl">
				<div className="container mx-auto space-y-10 lg:space-y-20">
					<div className="grid grid-cols-1 gap-4 space-y-12 lg:grid-cols-6 lg:space-y-0">
						<div className="order-2 col-span-2 lg:order-none lg:pr-16 lg:pl-10 flex">
							<p className="text-foreground/60 text-xl md:text-xl">
								"Your word is a lamp to my feet and a light to my path."
								<br />— Psalm 119:105
							</p>
						</div>
						<div className="order-1 col-span-4 lg:order-none lg:mt-0 lg:pl-6">
							<h2 className="text-3xl font-medium lg:text-4xl leading-relaxed mb-6">
								Why Continuous Scripture Reading?
							</h2>
							<p className="text-muted-foreground text-lg leading-relaxed">
								The Word of God is living, powerful, and transformative. When
								the Scriptures are read aloud: faith is strengthened, hearts are
								encouraged, truth is established, minds are renewed, God's
								purposes are proclaimed, and His presence is magnified. The
								Non-Stop Series seeks to restore the centrality of God's Word
								within the life of worship.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* ── Section 4: Reading The Whole Counsel of God ──────────── */}
			<section className="bg-background py-8 sm:py-16 lg:py-24 mx-auto px-2 sm:px-6 lg:px-8 max-w-7xl">
				<div className="container mx-auto">
					<h2 className="text-3xl font-medium lg:text-4xl leading-relaxed mb-12 text-center">
						Reading The Whole Counsel of God
					</h2>
					<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
						{[
							"Psalms",
							"The Gospels",
							"Acts",
							"Prophetic Books",
							"Wisdom Literature",
							"Epistles",
							"Worship Passages",
							"Revival Scriptures",
						].map((book) => (
							<div
								key={book}
								className="p-4 rounded-xl bg-muted/40 border border-border/50 text-center"
							>
								<span className="font-semibold text-sm">{book}</span>
							</div>
						))}
					</div>
					<p className="text-muted-foreground text-lg text-center mt-8">
						Each reading contributes to the atmosphere of worship and spiritual
						renewal throughout the event.
					</p>
				</div>
			</section>

			{/* ── Section 5: Scripture And Revival ─────────────────────── */}
			<section className="bg-background py-8 sm:py-16 lg:py-24 mx-auto px-2 sm:px-6 lg:px-8 max-w-7xl">
				<div className="container mx-auto space-y-10 lg:space-y-20">
					<div className="grid grid-cols-1 gap-4 space-y-12 lg:grid-cols-6 lg:space-y-0">
						<div className="col-span-4 lg:mt-0 lg:pr-6">
							<h2 className="text-3xl font-medium lg:text-4xl leading-relaxed mb-6">
								Scripture And Revival
							</h2>
							<p className="text-muted-foreground text-lg leading-relaxed">
								Throughout history, revival has often been accompanied by a
								renewed hunger for God's Word. The Non-Stop Series embraces the
								conviction that genuine revival requires both the Spirit of God
								and the Word of God working together. As Scripture is
								continuously proclaimed during the 144 hours, we pray for
								spiritual awakening, personal transformation, national renewal,
								and a deeper love for God and His Word.
							</p>
						</div>
						<div className="col-span-2 flex">
							<p className="text-foreground/60 text-xl md:text-xl">
								"The grass withers, the flower fades, but the word of our God
								stands forever."
								<br />— Isaiah 40:8
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* ── Section 6: Join The Reading ──────────────────────────── */}
			<section className="bg-background py-8 sm:py-16 lg:py-24 mx-auto px-2 sm:px-6 lg:px-8 max-w-7xl">
				<div className="container mx-auto">
					<h2 className="text-3xl font-medium lg:text-4xl leading-relaxed mb-12 text-center">
						Join The Reading
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{[
							{
								title: "Read Assigned Passages",
								desc: "Participate by reading Scripture during a watch.",
							},
							{
								title: "Join Scripture Reading Watches",
								desc: "Sign up for a dedicated Scripture reading slot.",
							},
							{
								title: "Meditate on Daily Readings",
								desc: "Follow along with the daily reading plan.",
							},
							{
								title: "Follow the Schedule Online",
								desc: "View the full reading schedule from anywhere.",
							},
							{
								title: "Declare God's Promises",
								desc: "Speak Scripture over families and communities.",
							},
							{
								title: "Pray the Scriptures",
								desc: "Let the Word guide your prayer and intercession.",
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

			{/* ── Section 7: The Word Will Continue CTA ────────────────── */}
			<section className="bg-background py-8 sm:py-16 lg:py-24 mx-auto px-2 sm:px-6 lg:px-8 max-w-7xl">
				<div className="container mx-auto text-center space-y-8">
					<h2 className="text-3xl font-medium lg:text-4xl leading-relaxed">
						The Word Will Continue
					</h2>
					<p className="text-muted-foreground text-lg max-w-2xl mx-auto">
						For 144 hours, the Scriptures will be proclaimed. The voice of God
						will continue to be heard. Join us as we honour, declare, and
						celebrate the living Word of God.
					</p>
					<div className="flex flex-wrap justify-center gap-4">
						<Link href="/get-involved" className="cursor-pointer">
							<Button
								size="lg"
								className="rounded-full font-bold uppercase tracking-widest text-xs"
							>
								Sign Up to Read
							</Button>
						</Link>
						<Link href="/live" className="cursor-pointer">
							<Button
								size="lg"
								variant="outline"
								className="rounded-full font-bold uppercase tracking-widest text-xs"
							>
								Follow Along Live
							</Button>
						</Link>
					</div>
				</div>
			</section>
		</main>
	);
}
