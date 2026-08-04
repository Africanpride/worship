"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { BlogPostCard } from "@/components/blog-post-card";

interface Post {
	id: string;
	title: string;
	slug: string;
	category: string;
	excerpt: string;
	image?: string | null;
	publishedAt?: Date | null;
}

export function BlogPageClient({ posts }: { posts: Post[] }) {
	return (
		<main className="flex flex-col min-h-screen w-full relative pt-12 md:pt-16">
			{/* ── Section 1: Hero Grid ──────────── */}
			<section className="bg-background py-8 sm:py-16 lg:py-24">
				<div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
					<motion.div
						className="grid grid-cols-1 gap-9 lg:grid-cols-2"
						initial="hidden"
						whileInView="show"
						viewport={{ once: false, amount: 0.1 }}
						variants={{
							hidden: { opacity: 0 },
							show: { opacity: 1, transition: { staggerChildren: 0.15 } },
						}}
					>
						{/* Left Column */}
						<div className="flex flex-col gap-9">
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
											Blog &amp; Devotionals
										</h1>
										<p className="text-muted-foreground text-xl font-semibold md:text-3xl">
											Reflections from the Altar.{" "}
											<span className="text-amber-500 inline-block">
												Daily Insights, Teachings &amp; Testimonies.
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
										src="/nonstop/nonstop-003.jpg"
										alt="Devotional study"
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
										Nourish your spirit with daily devotionals, scriptural
										revelations, and powerful testimonies documented during the
										144 hours of non-stop worship.
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
									<div className="grid gap-4">
										{posts.map((post) => (
											<BlogPostCard
												key={post.id}
												title={post.title}
												slug={post.slug}
												category={post.category}
												excerpt={post.excerpt}
												image={post.image}
												publishedAt={post.publishedAt?.toString() ?? null}
											/>
										))}
										{posts.length === 0 && (
											<p className="text-muted-foreground text-sm text-center py-8">
												No posts yet. Check back soon!
											</p>
										)}
									</div>
								</motion.div>
							</div>
						</div>
					</motion.div>
				</div>
			</section>

			{/* ── Section 2: Full-bleed image / Callout ───────── */}
			<section className="bg-background py-8 sm:py-16 lg:py-24 mx-auto px-2 sm:px-6 lg:px-8 max-w-7xl">
				<div className="container mx-auto space-y-10 lg:space-y-20">
					<div className="relative mt-4 h-96 md:h-140 w-full rounded-2xl overflow-hidden shadow-xl">
						<Image
							alt="Atmosphere of Learning & Teaching"
							fill
							className="object-cover object-center"
							src="/nonstop/nonstop-023.jpg"
						/>
					</div>
					<div className="grid grid-cols-1 gap-4 space-y-12 lg:grid-cols-6 lg:space-y-0">
						<div className="order-2 col-span-2 lg:order-none lg:pr-16 lg:pl-10 flex">
							<p className="text-foreground/60 text-xl md:text-xl">
								Capturing divine encounters and spiritual revelations from 144
								hours before the Lord.
							</p>
						</div>
						<div className="order-1 col-span-4 lg:order-none lg:mt-0 lg:pl-6">
							<p className="text-3xl font-medium lg:text-4xl leading-relaxed">
								Each devotional article provides deep biblical teaching, helping
								believers integrate continuous worship into their daily lives
								long after the convocation concludes.
							</p>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
