import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
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
      author: true,
      publishedAt: true,
    },
  });
  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  const body = await req.json();
  const post = await prisma.blogPost.create({
    data: {
      title: body.title,
      slug:
        body.slug ||
        body.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
      category: body.category,
      excerpt: body.excerpt,
      content: body.content,
      image: body.image,
      author: body.author,
      featured: body.featured ?? false,
      published: body.published ?? false,
      publishedAt: body.published ? new Date() : null,
    },
  });
  return NextResponse.json(post, { status: 201 });
}
