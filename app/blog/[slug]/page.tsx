import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

type Props = {
	params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params;
	const post = await prisma.blogPost.findUnique({
		where: { slug },
		select: { title: true, excerpt: true },
	});
	if (!post) return {};
	return {
		title: `${post.title} — Blog`,
		description: post.excerpt,
		alternates: { canonical: `https://thenonstop.org/blog/${slug}` },
		openGraph: {
			url: `https://thenonstop.org/blog/${slug}`,
			title: post.title,
			description: post.excerpt,
		},
	};
}

export default async function BlogPostPage({ params }: Props) {
	const { slug } = await params;
	const post = await prisma.blogPost.findUnique({
		where: { slug, published: true },
	});
	if (!post) notFound();

	const dateStr = post.publishedAt
		? new Date(post.publishedAt).toLocaleDateString("en-US", {
				year: "numeric",
				month: "long",
				day: "numeric",
			})
		: "";

	return (
		<main className="flex flex-col min-h-screen w-full relative pt-12 md:pt-16">
			<article className="bg-background py-8 sm:py-16 lg:py-24">
				<div className="mx-auto max-w-3xl px-2 sm:px-6 lg:px-8">
					{/* Back link */}
					<Link href="/blog" className="mb-8 inline-block cursor-pointer">
						<Button variant="ghost" size="sm" className="rounded-full">
							← Back to Blog
						</Button>
					</Link>

					{/* Category + Date */}
					<div className="mb-4">
						<span className="text-amber-500 text-xs font-mono font-bold uppercase">
							{post.category}
							{dateStr && ` • ${dateStr}`}
						</span>
					</div>

					{/* Title */}
					<h1 className="text-3xl font-semibold md:text-4xl lg:text-5xl mb-6">
						{post.title}
					</h1>

					{/* Author */}
					{post.author && (
						<p className="text-muted-foreground text-sm mb-8">
							By {post.author}
						</p>
					)}

					{/* Featured Image */}
					{post.image && (
						<div className="relative h-64 md:h-96 w-full rounded-2xl overflow-hidden mb-12">
							<Image
								src={post.image}
								alt={post.title}
								fill
								sizes="(max-width: 768px) 100vw, 768px"
								className="object-cover object-top"
								priority
							/>
						</div>
					)}

					{/* Content */}
					<div
						className="prose prose-lg dark:prose-invert max-w-none"
						dangerouslySetInnerHTML={{ __html: post.content }}
					/>

					{/* CTA */}
					<div className="mt-16 text-center space-y-4">
						<p className="text-muted-foreground text-lg">
							Continue the journey. Explore more reflections from the altar.
						</p>
						<div className="flex flex-wrap justify-center gap-4">
							<Link href="/blog" className="cursor-pointer">
								<Button className="rounded-full font-bold uppercase tracking-widest text-xs">
									More Devotionals
								</Button>
							</Link>
							<Link href="/prayer-wall" className="cursor-pointer">
								<Button
									variant="outline"
									className="rounded-full font-bold uppercase tracking-widest text-xs"
								>
									Submit a Prayer Request
								</Button>
							</Link>
						</div>
					</div>
				</div>
			</article>
		</main>
	);
}
