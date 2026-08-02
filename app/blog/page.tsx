import { prisma } from "@/lib/prisma";
import { BlogPageClient } from "./blog-page-client";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
	const posts = await prisma.blogPost.findMany({
		where: { published: true },
		orderBy: { publishedAt: "desc" },
		select: {
			id: true,
			title: true,
			slug: true,
			category: true,
			excerpt: true,
			image: true,
			publishedAt: true,
		},
	});

	return <BlogPageClient posts={posts} />;
}
