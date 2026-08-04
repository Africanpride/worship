# Blog System: Local Content with Admin CRUD

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the 3 hardcoded blog stubs with a real blog system that stores posts in the database, has admin CRUD, and renders individual post pages.

**Architecture:** Add a `BlogPost` Prisma model, create API routes for CRUD, build admin management in the existing dashboard, and render public blog pages with individual post routes.

**Tech Stack:** Next.js App Router, TypeScript, Prisma (MongoDB), Tailwind CSS v4, Framer Motion

## Global Constraints

- Database: MongoDB via Prisma (existing setup)
- Auth: Better Auth (existing — admin role required for CRUD)
- Styling: Tailwind CSS v4, single quotes, 2-line indent
- Images: Use `next/image` with explicit `width`/`height`
- Admin pages go under `app/dashboard/admin/` (existing pattern)
- Public pages use the same hero grid layout as other pillar pages

---

## File Structure

| Action | File | Purpose |
|--------|------|---------|
| Modify | `prisma/schema.prisma` | Add `BlogPost` model |
| Create | `app/api/blog/route.ts` | GET (list) + POST (create) API |
| Create | `app/api/blog/[id]/route.ts` | GET (single) + PUT + DELETE API |
| Create | `app/dashboard/admin/blog/page.tsx` | Admin blog management page |
| Create | `app/dashboard/admin/blog/new/page.tsx` | Create new post page |
| Create | `app/dashboard/admin/blog/[id]/edit/page.tsx` | Edit post page |
| Modify | `app/blog/page.tsx` | Fetch posts from API, render dynamically |
| Create | `app/blog/[slug]/page.tsx` | Individual blog post page |
| Create | `components/blog-post-card.tsx` | Reusable blog card component |

---

### Task 1: Add BlogPost model to Prisma schema

**Files:**
- Modify: `prisma/schema.prisma`

- [ ] **Step 1: Add the BlogPost model**

Append to `prisma/schema.prisma`:

```prisma
model BlogPost {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  title       String
  slug        String   @unique
  category    String   // "Devotional", "Teaching", "Vision", "Testimony"
  excerpt     String
  content     String   @db.String(max: 10000)
  image       String?
  author      String?
  featured    Boolean  @default(false)
  published   Boolean  @default(false)
  publishedAt DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

- [ ] **Step 2: Run Prisma generate**

Run: `bunx prisma generate`
Expected: Prisma Client generated successfully.

- [ ] **Step 3: Commit**

```bash
git add prisma/schema.prisma
git commit -m "feat: add BlogPost model to Prisma schema"
```

---

### Task 2: Create blog API routes

**Files:**
- Create: `app/api/blog/route.ts`
- Create: `app/api/blog/[id]/route.ts`

- [ ] **Step 1: Create list/create API**

Create `app/api/blog/route.ts`:

```ts
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
      slug: body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
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
```

- [ ] **Step 2: Create single post API with update/delete**

Create `app/api/blog/[id]/route.ts`:

```ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const post = await prisma.blogPost.update({
    where: { id },
    data: {
      title: body.title,
      slug: body.slug,
      category: body.category,
      excerpt: body.excerpt,
      content: body.content,
      image: body.image,
      author: body.author,
      featured: body.featured,
      published: body.published,
      publishedAt: body.published && !body.publishedAt ? new Date() : body.publishedAt,
    },
  });
  return NextResponse.json(post);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.blogPost.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
```

- [ ] **Step 3: Test API routes**

Run: `bun run dev` then:
```bash
curl -X POST http://localhost:3000/api/blog -H "Content-Type: application/json" -d '{"title":"Test Post","category":"Devotional","excerpt":"Test excerpt","content":"Test content","published":true}'
curl http://localhost:3000/api/blog
```
Expected: Post created and returned in list.

- [ ] **Step 4: Commit**

```bash
git add app/api/blog/route.ts app/api/blog/[id]/route.ts
git commit -m "feat: add blog API routes for CRUD operations"
```

---

### Task 3: Seed blog with initial posts

**Files:**
- Create: `prisma/seed-blog.ts`

- [ ] **Step 1: Create seed script**

Create `prisma/seed-blog.ts`:

```ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const posts = [
  {
    title: "Recovering the Altar of David",
    slug: "recovering-the-altar-of-david",
    category: "Devotional",
    excerpt: "Why Davidic worship removes every veil and opens continuous access to God's manifested presence.",
    content: `<p>The Tabernacle of David was unlike any other worship structure in Scripture. While the Tabernacle of Moses placed barriers between God's presence and His people — courts, veils, and restricted access — David's tabernacle removed every barrier.</p>
<p>David understood something profound: worship is not an activity reserved for special occasions. It is a lifestyle, a rhythm, a continuous offering before the Lord. He appointed musicians, singers, and gatekeepers to minister before the Ark continually — not for an hour, not for a day, but perpetually.</p>
<h3>Why This Matters Today</h3>
<p>In our generation, the call to recover the Tabernacle of David is not about recreating a physical tent. It is about restoring the heart of worship — a heart that longs for God's presence above all else, that offers praise not because of circumstances but because of who He is.</p>
<p>When we worship continuously, we align ourselves with what is already happening in heaven. Revelation 4:8 declares that the living creatures never cease saying, "Holy, holy, holy is the Lord God Almighty." The Non-Stop Series exists to reflect that heavenly pattern on earth.</p>
<h3>A Prayer</h3>
<p>Lord, restore in us the heart of David. Let our worship not be confined to Sunday mornings or special events, but let it become the rhythm of our lives. May praise, prayer, and Your Word flow continuously from our hearts, our homes, and our communities.</p>`,
    image: "/nonstop/nonstop-003.jpg",
    author: "The Non-Stop Series Team",
    featured: true,
    published: true,
    publishedAt: new Date("2026-07-01"),
  },
  {
    title: "The Mystery of the Night Watch",
    slug: "the-mystery-of-the-night-watch",
    category: "Teaching",
    excerpt: "Understanding the spiritual power of standing before the Lord during the midnight and early morning hours.",
    content: `<p>Throughout Scripture, the night watches hold special spiritual significance. It was during the night that God spoke to Jacob, gave dreams to Joseph, delivered Israel from Egypt, and revealed His purposes to prophets.</p>
<p>Psalm 63:6 declares: "On my bed I remember you; I think of you through the watches of the night." David understood that the night hours are not merely for sleep — they are moments of spiritual encounter.</p>
<h3>Why the Night Watches Matter</h3>
<p>In the ancient world, the night was divided into four watches. Each watch was a period of alertness, prayer, and spiritual vigilance. The midnight watch, in particular, was associated with divine intervention.</p>
<p>When Paul and Silas were imprisoned, they prayed and sang hymns at midnight — and God shook the foundations of the prison (Acts 16:25-26). The midnight hour carries prophetic weight.</p>
<h3>The Night Watches in the Non-Stop Series</h3>
<p>During the 144 hours, the night watches become moments of deep consecration. As the world sleeps, worshippers and intercessors stand before the Lord, carrying the needs of nations and families. These are the hours when heaven draws near, when spiritual breakthroughs are birthed, when the fire on the altar burns brightest.</p>
<h3>A Prayer</h3>
<p>Lord, teach us to watch and pray. May the night hours become moments of encounter with You. Raise up watchmen who will not be silent, who will stand on the walls until You establish praise in the earth.</p>`,
    image: "/nonstop/nonstop-006.jpg",
    author: "The Non-Stop Series Team",
    featured: false,
    published: true,
    publishedAt: new Date("2026-07-03"),
  },
  {
    title: "Why 144 Hours? Scriptural Completion",
    slug: "why-144-hours-scriptural-completion",
    category: "Vision",
    excerpt: "Exploring the biblical number symbolism of 24 elders, 120 priests, and 144 hours of unbroken ministry.",
    content: `<p>The number 144 is rich with biblical significance. It is the sum of 24 and 120 — two numbers that carry profound meaning in Scripture.</p>
<h3>24: The Elders in Heaven</h3>
<p>Revelation 4:4 describes 24 elders surrounding God's throne, leading continuous worship. The number 24 represents the completeness of heavenly worship — an unbroken cycle of adoration before the Lord.</p>
<h3>120: Priesthood and Restoration</h3>
<p>The number 120 appears throughout Scripture in contexts of priesthood, restoration, and divine timing:</p>
<ul>
<li>120 days of grace given for man to repent before the flood (Genesis 6:3)</li>
<li>120 priests assigned to lead worship when the Ark returned to Jerusalem (2 Chronicles 5:12)</li>
<li>120 believers who waited for the Holy Spirit after Jesus' ascension (Acts 1:15)</li>
</ul>
<h3>144: The Ultimate Outcome</h3>
<p>When you add 24 (heavenly worship) and 120 (earthly priesthood), you get 144. The Non-Stop Series represents the ultimate desired outcome: priesthood on earth that mirrors heavenly worship. For 144 hours — one full week — the altar remains active, reflecting the continuous worship of heaven.</p>
<h3>A Prayer</h3>
<p>Lord, as we offer 144 hours of continuous worship, may heaven and earth join together. Let our praise mirror the sound of Your throne room. Let our prayers rise as incense before You. Let Your Word go forth with power across the nations.</p>`,
    image: "/nonstop/nonstop-017.jpg",
    author: "The Non-Stop Series Team",
    featured: false,
    published: true,
    publishedAt: new Date("2026-07-05"),
  },
];

async function main() {
  for (const post of posts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
    console.log(`✓ Upserted: ${post.title}`);
  }
  console.log("Blog seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

- [ ] **Step 2: Run the seed script**

Run: `bunx tsx prisma/seed-blog.ts`
Expected: "✓ Upserted: Recovering the Altar of David" × 3 posts.

- [ ] **Step 3: Verify posts exist**

Run: `curl http://localhost:3000/api/blog`
Expected: JSON array with 3 posts.

- [ ] **Step 4: Commit**

```bash
git add prisma/seed-blog.ts
git commit -m "feat: seed blog with initial devotional posts"
```

---

### Task 4: Create blog post card component

**Files:**
- Create: `components/blog-post-card.tsx`

- [ ] **Step 1: Create the component**

Create `components/blog-post-card.tsx`:

```tsx
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface BlogPostCardProps {
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  image?: string | null;
  publishedAt?: string | null;
}

export function BlogPostCard({
  title,
  slug,
  category,
  excerpt,
  image,
  publishedAt,
}: BlogPostCardProps) {
  const dateStr = publishedAt
    ? new Date(publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <div className='p-4 rounded-xl bg-muted/40 border border-border/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
      <div className='flex-1 min-w-0'>
        <span className='text-amber-500 text-xs font-mono font-bold uppercase'>
          {category}
          {dateStr && ` • ${dateStr}`}
        </span>
        <h3 className='font-semibold text-lg mt-1'>{title}</h3>
        <p className='text-xs text-muted-foreground line-clamp-1 mt-1'>{excerpt}</p>
      </div>
      <Link href={`/blog/${slug}`} className='shrink-0'>
        <Button variant='outline' size='sm' className='rounded-full'>
          Read
        </Button>
      </Link>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/blog-post-card.tsx
git commit -m "feat: add reusable blog post card component"
```

---

### Task 5: Update blog page to fetch from API

**Files:**
- Modify: `app/blog/page.tsx`

- [ ] **Step 1: Convert to server component that fetches posts**

Replace the entire content of `app/blog/page.tsx` with a server component that fetches from the database directly (since it's simpler than an API call for a server component):

```tsx
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
```

- [ ] **Step 2: Create the client component**

Create `app/blog/blog-page-client.tsx`:

```tsx
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
    <main className='flex flex-col min-h-screen w-full relative pt-12 md:pt-16'>
      {/* ── Section 1: Hero Grid ──────────── */}
      <section className='bg-background py-8 sm:py-16 lg:py-24'>
        <div className='mx-auto max-w-7xl sm:px-6 lg:px-8'>
          <motion.div
            className='grid grid-cols-1 gap-9 lg:grid-cols-2'
            initial='hidden'
            whileInView='show'
            viewport={{ once: false, amount: 0.1 }}
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.15 } },
            }}
          >
            {/* Left Column */}
            <div className='flex flex-col gap-9'>
              <div className='flex items-center gap-6 overflow-hidden'>
                <div className='to-amber-500 h-52 w-4 bg-gradient-to-t from-transparent' />
                <motion.div variants={{ hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } }}>
                  <div className='space-y-4'>
                    <h1 className='text-2xl font-semibold md:text-3xl lg:text-4xl'>
                      Blog &amp; Devotionals
                    </h1>
                    <p className='text-muted-foreground text-xl font-semibold md:text-3xl'>
                      Reflections from the Altar.{" "}
                      <span className='text-amber-500 inline-block'>
                        Daily Insights, Teachings &amp; Testimonies.
                      </span>
                    </p>
                  </div>
                </motion.div>
              </div>
              <motion.div variants={{ hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } }}>
                <div className='relative max-h-91 h-[400px] w-full rounded-lg overflow-hidden'>
                  <Image
                    src='/nonstop/nonstop-003.jpg'
                    alt='Devotional study'
                    fill
                    sizes='100vw'
                    className='object-cover object-top'
                    priority
                  />
                </div>
              </motion.div>
            </div>

            {/* Right Column */}
            <div className='flex flex-col gap-6'>
              <div className='flex flex-1 flex-col justify-center gap-9'>
                <motion.div variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } }}>
                  <p className='text-muted-foreground text-xl leading-relaxed'>
                    Nourish your spirit with daily devotionals, scriptural revelations, and powerful testimonies documented during the 144 hours of non-stop worship.
                  </p>
                </motion.div>

                <motion.div variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } }}>
                  <div className='grid gap-4'>
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
                      <p className='text-muted-foreground text-sm text-center py-8'>
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
      <section className='bg-background py-8 sm:py-16 lg:py-24 mx-auto sm:px-6 lg:px-8 max-w-7xl'>
        <div className='container space-y-10 lg:space-y-20'>
          <div className='relative mt-4 h-96 md:h-140 w-full rounded-2xl overflow-hidden shadow-xl'>
            <Image
              alt='Atmosphere of Learning & Teaching'
              fill
              className='object-cover object-center'
              src='/nonstop/nonstop-023.jpg'
            />
          </div>
          <div className='grid grid-cols-1 gap-4 space-y-12 lg:grid-cols-6 lg:space-y-0'>
            <div className='order-2 col-span-2 lg:order-none lg:pr-16 lg:pl-10 flex'>
              <p className='text-foreground/60 text-xl md:text-xl'>
                Capturing divine encounters and spiritual revelations from 144 hours before the Lord.
              </p>
            </div>
            <div className='order-1 col-span-4 lg:order-none lg:mt-0 lg:pl-6'>
              <p className='text-3xl font-medium lg:text-4xl leading-relaxed'>
                Each devotional article provides deep biblical teaching, helping believers integrate continuous worship into their daily lives long after the convocation concludes.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
```

- [ ] **Step 3: Verify blog page renders with posts**

Run: `bun run dev` and navigate to `/blog`.
Expected: 3 blog post cards rendered from database.

- [ ] **Step 4: Commit**

```bash
git add app/blog/page.tsx app/blog/blog-page-client.tsx
git commit -m "feat: update blog page to fetch posts from database"
```

---

### Task 6: Create individual blog post page

**Files:**
- Create: `app/blog/[slug]/page.tsx`

- [ ] **Step 1: Create the dynamic route**

Create `app/blog/[slug]/page.tsx`:

```tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
    <main className='flex flex-col min-h-screen w-full relative pt-12 md:pt-16'>
      <article className='bg-background py-8 sm:py-16 lg:py-24'>
        <div className='mx-auto max-w-3xl sm:px-6 lg:px-8'>
          {/* Back link */}
          <Link href='/blog' className='mb-8 inline-block'>
            <Button variant='ghost' size='sm' className='rounded-full'>
              ← Back to Blog
            </Button>
          </Link>

          {/* Category + Date */}
          <div className='mb-4'>
            <span className='text-amber-500 text-xs font-mono font-bold uppercase'>
              {post.category}
              {dateStr && ` • ${dateStr}`}
            </span>
          </div>

          {/* Title */}
          <h1 className='text-3xl font-semibold md:text-4xl lg:text-5xl mb-6'>
            {post.title}
          </h1>

          {/* Author */}
          {post.author && (
            <p className='text-muted-foreground text-sm mb-8'>By {post.author}</p>
          )}

          {/* Featured Image */}
          {post.image && (
            <div className='relative h-64 md:h-96 w-full rounded-2xl overflow-hidden mb-12'>
              <Image
                src={post.image}
                alt={post.title}
                fill
                className='object-cover object-top'
                priority
              />
            </div>
          )}

          {/* Content */}
          <div
            className='prose prose-lg dark:prose-invert max-w-none'
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* CTA */}
          <div className='mt-16 text-center space-y-4'>
            <p className='text-muted-foreground text-lg'>
              Continue the journey. Explore more reflections from the altar.
            </p>
            <div className='flex flex-wrap justify-center gap-4'>
              <Link href='/blog'>
                <Button className='rounded-full font-bold uppercase tracking-widest text-xs'>
                  More Devotionals
                </Button>
              </Link>
              <Link href='/prayer-wall'>
                <Button variant='outline' className='rounded-full font-bold uppercase tracking-widest text-xs'>
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
```

- [ ] **Step 2: Verify individual post page works**

Run: `bun run dev` and navigate to `/blog/recovering-the-altar-of-david`.
Expected: Full blog post with title, image, content, and back link.

- [ ] **Step 3: Commit**

```bash
git add "app/blog/[slug]/page.tsx"
git commit -m "feat: add individual blog post page with SEO metadata"
```

---

### Task 7: Create admin blog management page

**Files:**
- Create: `app/dashboard/admin/blog/page.tsx`
- Create: `app/dashboard/admin/blog/blog-table.tsx`
- Create: `app/dashboard/admin/blog/new/page.tsx`
- Create: `app/dashboard/admin/blog/[id]/edit/page.tsx`

- [ ] **Step 1: Create admin blog list page**

Create `app/dashboard/admin/blog/page.tsx`:

```tsx
import { prisma } from "@/lib/prisma";
import { BlogTable } from "./blog-table";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold'>Blog Posts</h1>
          <p className='text-muted-foreground text-sm'>Manage devotionals, teachings, and testimonies.</p>
        </div>
        <a
          href='/dashboard/admin/blog/new'
          className='rounded-full bg-primary px-4 py-2 text-xs font-bold uppercase tracking-widest text-primary-foreground hover:bg-primary/90'
        >
          New Post
        </a>
      </div>
      <BlogTable posts={posts} />
    </div>
  );
}
```

- [ ] **Step 2: Create blog table component**

Create `app/dashboard/admin/blog/blog-table.tsx`:

```tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Post {
  id: string;
  title: string;
  slug: string;
  category: string;
  published: boolean;
  createdAt: Date;
}

export function BlogTable({ posts }: { posts: Post[] }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    setDeleting(id);
    await fetch(`/api/blog/${id}`, { method: "DELETE" });
    router.refresh();
  };

  return (
    <div className='rounded-xl border border-border/50 overflow-hidden'>
      <table className='w-full text-sm'>
        <thead>
          <tr className='border-b border-border/50 bg-muted/30'>
            <th className='text-left p-3 font-medium'>Title</th>
            <th className='text-left p-3 font-medium'>Category</th>
            <th className='text-left p-3 font-medium'>Status</th>
            <th className='text-right p-3 font-medium'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id} className='border-b border-border/50 last:border-none'>
              <td className='p-3 font-medium'>{post.title}</td>
              <td className='p-3 text-muted-foreground'>{post.category}</td>
              <td className='p-3'>
                <span className={`text-xs font-bold uppercase ${post.published ? "text-green-600" : "text-yellow-600"}`}>
                  {post.published ? "Published" : "Draft"}
                </span>
              </td>
              <td className='p-3 text-right space-x-2'>
                <button
                  onClick={() => router.push(`/dashboard/admin/blog/${post.id}/edit`)}
                  className='text-xs font-medium underline hover:no-underline'
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  disabled={deleting === post.id}
                  className='text-xs font-medium text-red-500 underline hover:no-underline disabled:opacity-50'
                >
                  {deleting === post.id ? "..." : "Delete"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {posts.length === 0 && (
        <p className='text-center text-muted-foreground text-sm py-8'>No posts yet.</p>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Create new post page**

Create `app/dashboard/admin/blog/new/page.tsx`:

```tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewBlogPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    category: "Devotional",
    excerpt: "",
    content: "",
    image: "",
    author: "",
    published: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/blog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    router.push("/dashboard/admin/blog");
  };

  return (
    <div className='max-w-2xl space-y-6'>
      <h1 className='text-2xl font-bold'>New Blog Post</h1>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label className='text-sm font-medium'>Title</label>
          <input
            type='text'
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className='w-full rounded-lg border border-border bg-background px-3 py-2 text-sm mt-1'
            required
          />
        </div>
        <div>
          <label className='text-sm font-medium'>Category</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className='w-full rounded-lg border border-border bg-background px-3 py-2 text-sm mt-1'
          >
            <option>Devotional</option>
            <option>Teaching</option>
            <option>Vision</option>
            <option>Testimony</option>
          </select>
        </div>
        <div>
          <label className='text-sm font-medium'>Excerpt</label>
          <textarea
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            className='w-full rounded-lg border border-border bg-background px-3 py-2 text-sm mt-1'
            rows={2}
            required
          />
        </div>
        <div>
          <label className='text-sm font-medium'>Content (HTML)</label>
          <textarea
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            className='w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-mono mt-1'
            rows={12}
            required
          />
        </div>
        <div>
          <label className='text-sm font-medium'>Image URL</label>
          <input
            type='text'
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            className='w-full rounded-lg border border-border bg-background px-3 py-2 text-sm mt-1'
            placeholder='/nonstop/nonstop-003.jpg'
          />
        </div>
        <div>
          <label className='text-sm font-medium'>Author</label>
          <input
            type='text'
            value={form.author}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
            className='w-full rounded-lg border border-border bg-background px-3 py-2 text-sm mt-1'
          />
        </div>
        <div className='flex items-center gap-2'>
          <input
            type='checkbox'
            checked={form.published}
            onChange={(e) => setForm({ ...form, published: e.target.checked })}
            id='published'
          />
          <label htmlFor='published' className='text-sm font-medium'>Publish immediately</label>
        </div>
        <div className='flex gap-3'>
          <button
            type='submit'
            disabled={loading}
            className='rounded-full bg-primary px-4 py-2 text-xs font-bold uppercase tracking-widest text-primary-foreground hover:bg-primary/90 disabled:opacity-50'
          >
            {loading ? "Creating..." : "Create Post"}
          </button>
          <button
            type='button'
            onClick={() => router.back()}
            className='rounded-full border border-border px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-muted/50'
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
```

- [ ] **Step 4: Create edit post page**

Create `app/dashboard/admin/blog/[id]/edit/page.tsx`:

```tsx
"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    category: "Devotional",
    excerpt: "",
    content: "",
    image: "",
    author: "",
    published: false,
  });

  useEffect(() => {
    fetch(`/api/blog/${id}`)
      .then((r) => r.json())
      .then((post) => {
        setForm({
          title: post.title,
          slug: post.slug,
          category: post.category,
          excerpt: post.excerpt,
          content: post.content,
          image: post.image ?? "",
          author: post.author ?? "",
          published: post.published,
        });
        setFetching(false);
      });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch(`/api/blog/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    router.push("/dashboard/admin/blog");
  };

  if (fetching) return <p className='text-muted-foreground text-sm'>Loading...</p>;

  return (
    <div className='max-w-2xl space-y-6'>
      <h1 className='text-2xl font-bold'>Edit Blog Post</h1>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label className='text-sm font-medium'>Title</label>
          <input
            type='text'
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className='w-full rounded-lg border border-border bg-background px-3 py-2 text-sm mt-1'
            required
          />
        </div>
        <div>
          <label className='text-sm font-medium'>Slug</label>
          <input
            type='text'
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className='w-full rounded-lg border border-border bg-background px-3 py-2 text-sm mt-1'
          />
        </div>
        <div>
          <label className='text-sm font-medium'>Category</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className='w-full rounded-lg border border-border bg-background px-3 py-2 text-sm mt-1'
          >
            <option>Devotional</option>
            <option>Teaching</option>
            <option>Vision</option>
            <option>Testimony</option>
          </select>
        </div>
        <div>
          <label className='text-sm font-medium'>Excerpt</label>
          <textarea
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            className='w-full rounded-lg border border-border bg-background px-3 py-2 text-sm mt-1'
            rows={2}
            required
          />
        </div>
        <div>
          <label className='text-sm font-medium'>Content (HTML)</label>
          <textarea
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            className='w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-mono mt-1'
            rows={12}
            required
          />
        </div>
        <div>
          <label className='text-sm font-medium'>Image URL</label>
          <input
            type='text'
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            className='w-full rounded-lg border border-border bg-background px-3 py-2 text-sm mt-1'
          />
        </div>
        <div>
          <label className='text-sm font-medium'>Author</label>
          <input
            type='text'
            value={form.author}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
            className='w-full rounded-lg border border-border bg-background px-3 py-2 text-sm mt-1'
          />
        </div>
        <div className='flex items-center gap-2'>
          <input
            type='checkbox'
            checked={form.published}
            onChange={(e) => setForm({ ...form, published: e.target.checked })}
            id='published'
          />
          <label htmlFor='published' className='text-sm font-medium'>Published</label>
        </div>
        <div className='flex gap-3'>
          <button
            type='submit'
            disabled={loading}
            className='rounded-full bg-primary px-4 py-2 text-xs font-bold uppercase tracking-widest text-primary-foreground hover:bg-primary/90 disabled:opacity-50'
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <button
            type='button'
            onClick={() => router.back()}
            className='rounded-full border border-border px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-muted/50'
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
```

- [ ] **Step 5: Verify admin pages work**

Run: `bun run dev` and navigate to `/dashboard/admin/blog`.
Expected: Table with 3 seeded posts, edit/delete actions working.

- [ ] **Step 6: Commit**

```bash
git add app/dashboard/admin/blog/
git commit -m "feat: add admin blog management pages with CRUD"
```

---

## Spec Coverage Check

| Requirement | Task |
|-------------|------|
| BlogPost Prisma model | Task 1 |
| Blog API routes | Task 2 |
| Seed initial posts | Task 3 |
| Blog card component | Task 4 |
| Blog list page (dynamic) | Task 5 |
| Individual post page with SEO | Task 6 |
| Admin CRUD management | Task 7 |
