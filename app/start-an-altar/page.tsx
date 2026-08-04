"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function StartAnAltarPage() {
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
											Start an Altar
										</h1>
										<p className="text-muted-foreground text-xl font-semibold md:text-3xl">
											Multiply the Fire.{" "}
											<span className="text-amber-500 inline-block">
												Establish Continuous Worship in Your City &amp; Nation.
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
										src="/nonstop/nonstop-051.jpg"
										alt="Gathering around the altar"
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
											src="/nonstop/nonstop-046.jpg"
											alt="Campus altar gathering"
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
											src="/nonstop/nonstop-049.jpg"
											alt="Community worship room"
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
										The vision extends far beyond Accra. Our desire is to
										inspire homes, churches, campuses, and cities to establish
										their own continuous altars of praise, prayer, and scripture
										reading.
									</p>
								</motion.div>

								{/* Steps summary */}
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
									<div className="grid gap-6 sm:grid-cols-3">
										<div className="flex flex-col items-center gap-2.5">
											<h3 className="text-foreground text-4xl font-medium">
												1
											</h3>
											<p className="text-muted-foreground text-center font-medium">
												Gather Watchmen
											</p>
										</div>
										<div className="flex flex-col items-center gap-2.5">
											<h3 className="text-foreground text-4xl font-medium">
												2
											</h3>
											<p className="text-muted-foreground text-center font-medium">
												Set Watches
											</p>
										</div>
										<div className="flex flex-col items-center gap-2.5">
											<h3 className="text-foreground text-4xl font-medium">
												3
											</h3>
											<p className="text-muted-foreground text-center font-medium">
												Connect Global
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
														alt="altar builder"
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
											<Link href="/contact" className="cursor-pointer">Register Your Altar</Link>
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
							alt="Global Altar Movement"
							fill
							className="object-cover object-center"
							src="/nonstop/nonstop-060.jpg"
						/>
					</div>
					<div
						className="grid grid-cols-1 gap-4 space-y-12 lg:grid-cols-6 lg:space-y-0"
						data-usal="fade-u duration-500"
					>
						<div className="order-2 col-span-2 lg:order-none lg:pr-16 lg:pl-10 flex ">
							<p className="text-foreground/60 text-xl md:text-xl ">
								Raising continuous worship altars across every neighborhood,
								city, and continent.
							</p>
						</div>
						<div className="order-1 col-span-4 lg:order-none lg:mt-0 lg:pl-6">
							<p className="text-3xl font-medium lg:text-4xl leading-relaxed ">
								Whether starting a 24-hour worship night or establishing a
								permanent prayer room, we provide guidance, training, and global
								network coverage to help keep the fire burning.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* ── Section 3: Suggested Models ──────────────────────────── */}
			<section className="bg-background py-8 sm:py-16 lg:py-24 mx-auto px-2 sm:px-6 lg:px-8 max-w-7xl">
				<div className="container mx-auto">
					<h2 className="text-3xl font-medium lg:text-4xl leading-relaxed mb-12 text-center">
						Suggested Models
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{[
							{
								title: "Family Altar",
								duration: "1–3 Hours",
								desc: "Worship, prayer, Bible reading, and thanksgiving. Perfect for families and close friends.",
							},
							{
								title: "Community Altar",
								duration: "3–6 Hours",
								desc: "Bring together families, neighbours, local churches, and prayer groups for community transformation.",
							},
							{
								title: "Church Worship Watch",
								duration: "6–12 Hours",
								desc: "Organize rotating teams for worship, prayer, and Scripture reading. Great for monthly or quarterly gatherings.",
							},
							{
								title: "City Altar",
								duration: "12–24 Hours",
								desc: "Bring churches and ministries together in one continuous expression of worship and prayer.",
							},
							{
								title: "Regional & National",
								duration: "24 Hours+",
								desc: "Mobilize churches, ministries, worship teams, and intercessors across a region or nation.",
							},
							{
								title: "The Four Expressions",
								duration: "Any Duration",
								desc: "Every altar should include: Praise & Worship, Prayer & Intercession, Bible Reading, and Thanksgiving.",
							},
						].map((item) => (
							<div
								key={item.title}
								className="p-6 rounded-xl bg-muted/40 border border-border/50"
							>
								<span className="text-amber-500 text-xs font-mono font-bold uppercase">
									{item.duration}
								</span>
								<h3 className="font-semibold text-lg mb-2 mt-1">
									{item.title}
								</h3>
								<p className="text-sm text-muted-foreground">{item.desc}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ── Section 4: Resources To Help You Start ───────────────── */}
			<section className="bg-background py-8 sm:py-16 lg:py-24 mx-auto px-2 sm:px-6 lg:px-8 max-w-7xl">
				<div className="container mx-auto">
					<h2 className="text-3xl font-medium lg:text-4xl leading-relaxed mb-12 text-center">
						Resources To Help You Start
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{[
							{
								title: "Starter Guide",
								desc: "A practical introduction to planning your first worship and prayer gathering.",
							},
							{
								title: "Host Manual",
								desc: "Step-by-step guidance for organizing a Non-Stop event in your context.",
							},
							{
								title: "Watch Planning Templates",
								desc: "Sample schedules for 3, 6, 12, and 24-hour gatherings.",
							},
							{
								title: "Scripture Reading Plans",
								desc: "Suggested Bible reading schedules for different durations.",
							},
							{
								title: "Prayer Focus Guides",
								desc: "Themes and prayer points for individuals, families, and communities.",
							},
							{
								title: "Promotional Materials",
								desc: "Editable flyers, graphics, videos, and communication templates.",
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

			{/* ── Section 5: The Fire Must Spread ──────────────────────── */}
			<section className="bg-background py-8 sm:py-16 lg:py-24 mx-auto px-2 sm:px-6 lg:px-8 max-w-7xl">
				<div className="container mx-auto space-y-10 lg:space-y-20">
					<div className="grid grid-cols-1 gap-4 space-y-12 lg:grid-cols-6 lg:space-y-0">
						<div className="col-span-4 lg:mt-0 lg:pr-6">
							<h2 className="text-3xl font-medium lg:text-4xl leading-relaxed mb-6">
								The Fire Must Spread
							</h2>
							<p className="text-muted-foreground text-lg leading-relaxed">
								Our prayer is not merely for one successful annual gathering.
								Our prayer is that worship, prayer, and the Word would take root
								in homes, churches, campuses, communities, cities, and nations.
								One family, one church, one community, one city, one nation at a
								time.
							</p>
						</div>
						<div className="col-span-2 flex">
							<p className="text-foreground/60 text-xl md:text-xl">
								"On that day I will raise up the tabernacle of David which has
								fallen down."
								<br />— Amos 9:11
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* ── Section 6: Start An Altar Today CTA ──────────────────── */}
			<section className="bg-background py-8 sm:py-16 lg:py-24 mx-auto px-2 sm:px-6 lg:px-8 max-w-7xl">
				<div className="container mx-auto text-center space-y-8">
					<h2 className="text-3xl font-medium lg:text-4xl leading-relaxed">
						Start An Altar Today
					</h2>
					<p className="text-muted-foreground text-lg max-w-2xl mx-auto">
						You do not need to wait for the perfect moment. Gather people. Open
						the Scriptures. Lift your voice. Pray together. Worship together.
						Build an altar. Recover. Revive. Restore.
					</p>
					<div className="flex flex-wrap justify-center gap-4">
						<Link href="/contact" className="cursor-pointer">
							<Button
								size="lg"
								className="rounded-full font-bold uppercase tracking-widest text-xs"
							>
								Register Your Altar
							</Button>
						</Link>
						<Link href="/watches" className="cursor-pointer">
							<Button
								size="lg"
								variant="outline"
								className="rounded-full font-bold uppercase tracking-widest text-xs"
							>
								See Example Watches
							</Button>
						</Link>
					</div>
				</div>
			</section>
		</main>
	);
}
