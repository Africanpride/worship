"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function WatchesPage() {
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
                      The Watches
                      <span className='bg-amber-500/10 text-amber-500 text-[10px] py-1 px-3 rounded-full border border-amber-500/20 font-bold tracking-widest uppercase'>
                        Silver Jubilee
                      </span>
                    </h1>
                    <p className='text-muted-foreground text-xl font-semibold md:text-3xl'>
                      The Fire Must Not Go Out.{' '}
                      <span className='text-amber-500 inline-block'>
                        Stand Your Watch Before the Lord.
                      </span>
                    </p>
                  </div>
                </motion.div>
              </div>
              <motion.div variants={{ hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } }}>
                <div className="relative max-h-91 h-[400px] w-full rounded-lg overflow-hidden">
                  <Image
                    src='/nonstop/nonstop-018.jpg'
                    alt='Worship Watch'
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
                      src='/nonstop/nonstop-014.jpg'
                      alt='Intercession watch'
                      fill
                      sizes='(max-width: 640px) 100vw, 50vw'
                      className='object-cover object-top'
                    />
                  </div>
                </motion.div>
                <motion.div variants={{ hidden: { opacity: 0, scale: 0.95 }, show: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut" } } }}>
                  <div className='relative overflow-hidden rounded-md h-52 w-full'>
                    <Image
                      src='/nonstop/nonstop-020.jpg'
                      alt='Midnight watch'
                      fill
                      className='object-cover object-top'
                    />
                  </div>
                </motion.div>
              </div>
              <div className='flex flex-1 flex-col justify-center gap-9'>
                <motion.div variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } }}>
                  <p className='text-muted-foreground text-xl leading-relaxed'>
                    For 144 continuous hours, the altar remains active before the Lord through unbroken praise, worship, prayer, and Bible reading. Just as King David appointed ministers to serve before the Ark continually (1 Chron 16:37), every watch carries a sacred assignment.
                  </p>
                </motion.div>

                {/* Stats row */}
                <motion.div variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } }}>
                  <div className='grid gap-10 sm:grid-cols-3'>
                    <div className='flex flex-col items-center gap-2.5'>
                      <h3 className='text-foreground text-4xl font-medium'>144</h3>
                      <p className='text-muted-foreground text-center font-medium'>Continuous Hours</p>
                    </div>
                    <div className='flex flex-col items-center gap-2.5'>
                      <h3 className='text-foreground text-4xl font-medium'>24/7</h3>
                      <p className='text-muted-foreground text-center font-medium'>Unbroken Sound</p>
                    </div>
                    <div className='flex flex-col items-center gap-2.5'>
                      <h3 className='text-foreground text-4xl font-medium'>6 &amp; 6</h3>
                      <p className='text-muted-foreground text-center font-medium'>Days &amp; Nights</p>
                    </div>
                  </div>
                </motion.div>

                {/* Avatars & CTA */}
                <motion.div variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } }}>
                  <div className='flex items-center justify-between gap-6'>
                    <div className='flex -space-x-3'>
                      {['/nonstop/nonstop-001.jpg', '/nonstop/nonstop-048.jpg', '/nonstop/nonstop-022.jpg', '/nonstop/nonstop-047.jpg'].map((src, idx) => (
                        <span key={idx} className='group/avatar relative flex shrink-0 overflow-hidden rounded-full select-none size-12 ring-2 ring-background'>
                          <Image className='aspect-square size-full object-cover' alt='worshipper' src={src} fill sizes='48px' />
                        </span>
                      ))}
                    </div>
                    <Button asChild className='shrink-0 rounded-full bg-amber-500 hover:bg-amber-600 text-white h-12 px-8 uppercase tracking-wider font-bold'>
                      <Link href="/get-involved">Take Your Watch</Link>
                    </Button>
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
              alt='Night watches'
              fill
              className='object-cover object-center'
              src='/nonstop/nonstop-045.jpg'
            />
          </div>
          <div className='grid grid-cols-1 gap-4 space-y-12 lg:grid-cols-6 lg:space-y-0' data-usal='fade-u duration-500'>
            <div className='order-2 col-span-2 lg:order-none lg:pr-16 lg:pl-10 flex '>
              <p className='text-foreground/60 text-xl md:text-xl '>
                "I have set watchmen on your walls, O Jerusalem; they shall never hold their peace day or night." — Isaiah 62:6
              </p>
            </div>
            <div className='order-1 col-span-4 lg:order-none lg:mt-0 lg:pl-6'>
              <p className='text-3xl font-medium lg:text-4xl leading-relaxed '>
                Particular emphasis is placed on the night and midnight watches — moments of intense consecration, deep spiritual alertness, and standing in the gap for families, cities, and nations. Watch by watch, hour by hour, we build an unbroken sound before the Lord.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
