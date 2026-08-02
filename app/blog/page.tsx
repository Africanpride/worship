"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function BlogPage() {
  const posts = [
    {
      title: "Recovering the Altar of David",
      category: "Devotional",
      date: "Day 1 Reflection",
      image: "/nonstop/nonstop-003.jpg",
      excerpt: "Why Davidic worship removes every veil and opens continuous access to God's manifested presence.",
    },
    {
      title: "The Mystery of the Night Watch",
      category: "Teaching",
      date: "Day 3 Reflection",
      image: "/nonstop/nonstop-006.jpg",
      excerpt: "Understanding the spiritual power of standing before the Lord during the midnight and early morning hours.",
    },
    {
      title: "Why 144 Hours? Scriptural Completion",
      category: "Vision",
      date: "Day 5 Reflection",
      image: "/nonstop/nonstop-017.jpg",
      excerpt: "Exploring the numerology of 24 elders, 120 priests, and 144 hours of unbroken ministry.",
    },
  ];

  return (
    <main className='flex flex-col min-h-screen w-full relative pt-12 md:pt-16'>
      {/* ── Section 1: Hero Grid (Matches app/get-involved design) ──────────── */}
      <section className='bg-background py-8 sm:py-16 lg:py-24 '>
        <div className='mx-auto max-w-7xl sm:px-6 lg:px-8'>
          <motion.div
            className='grid grid-cols-1 gap-9 lg:grid-cols-2'
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
            <div className='flex flex-col gap-9 '>
              <div className='flex items-center gap-6 overflow-hidden'>
                <div className='to-amber-500 h-52 w-4 bg-gradient-to-t from-transparent' />
                <motion.div variants={{ hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } }}>
                  <div className='space-y-4'>
                    <h1 className='text-2xl font-semibold md:text-3xl lg:text-4xl flex items-center gap-3'>
                      Blog &amp; Devotionals
                      <span className='bg-amber-500/10 text-amber-500 text-[10px] py-1 px-3 rounded-full border border-amber-500/20 font-bold tracking-widest uppercase'>
                        Silver Jubilee
                      </span>
                    </h1>
                    <p className='text-muted-foreground text-xl font-semibold md:text-3xl'>
                      Reflections from the Altar.{' '}
                      <span className='text-amber-500 inline-block'>
                        Daily Insights, Teachings &amp; Testimonies.
                      </span>
                    </p>
                  </div>
                </motion.div>
              </div>
              <motion.div variants={{ hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } }}>
                <div className="relative max-h-91 h-[400px] w-full rounded-lg overflow-hidden">
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
              <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
                <motion.div variants={{ hidden: { opacity: 0, scale: 0.95 }, show: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut" } } }}>
                  <div className='relative overflow-hidden rounded-md h-52 w-full'>
                    <Image
                      src='/nonstop/nonstop-006.jpg'
                      alt='Teaching reflection'
                      fill
                      sizes='(max-width: 640px) 100vw, 50vw'
                      className='object-cover object-top'
                    />
                  </div>
                </motion.div>
                <motion.div variants={{ hidden: { opacity: 0, scale: 0.95 }, show: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut" } } }}>
                  <div className='relative overflow-hidden rounded-md h-52 w-full'>
                    <Image
                      src='/nonstop/nonstop-017.jpg'
                      alt='Altar insights'
                      fill
                      className='object-cover object-top'
                    />
                  </div>
                </motion.div>
              </div>
              <div className='flex flex-1 flex-col justify-center gap-9'>
                <motion.div variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } }}>
                  <p className='text-muted-foreground text-xl leading-relaxed'>
                    Nourish your spirit with daily devotionals, scriptural revelations, and powerful testimonies documented during the 144 hours of non-stop worship.
                  </p>
                </motion.div>

                {/* Devotionals summary cards */}
                <motion.div variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } }}>
                  <div className='grid gap-4'>
                    {posts.map((post) => (
                      <div key={post.title} className="p-4 rounded-xl bg-muted/40 border border-border/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                          <span className="text-amber-500 text-xs font-mono font-bold uppercase">{post.category} • {post.date}</span>
                          <h3 className="font-semibold text-lg">{post.title}</h3>
                          <p className="text-xs text-muted-foreground line-clamp-1">{post.excerpt}</p>
                        </div>
                        <Button variant="outline" size="sm" className="shrink-0 rounded-full">Read</Button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Section 2: Full-bleed image / Callout ─────────────────────────── */}
      <section className='bg-background py-8 sm:py-16 lg:py-24 mx-auto sm:px-6 lg:px-8 max-w-7xl'>
        <div className='container space-y-10 lg:space-y-20'>
          <div data-usal='fade-u duration-500' className="relative mt-4 h-96 md:h-140 w-full rounded-2xl overflow-hidden shadow-xl">
            <Image
              alt='Atmosphere of Learning & Teaching'
              fill
              className='object-cover object-center'
              src='/nonstop/nonstop-023.jpg'
            />
          </div>
          <div className='grid grid-cols-1 gap-4 space-y-12 lg:grid-cols-6 lg:space-y-0' data-usal='fade-u duration-500'>
            <div className='order-2 col-span-2 lg:order-none lg:pr-16 lg:pl-10 flex '>
              <p className='text-foreground/60 text-xl md:text-xl '>
                Capturing divine encounters and spiritual revelations from 144 hours before the Lord.
              </p>
            </div>
            <div className='order-1 col-span-4 lg:order-none lg:mt-0 lg:pl-6'>
              <p className='text-3xl font-medium lg:text-4xl leading-relaxed '>
                Each devotional article provides deep biblical teaching, helping believers integrate continuous worship into their daily lives long after the convocation concludes.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
