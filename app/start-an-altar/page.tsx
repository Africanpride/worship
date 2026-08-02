"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function StartAnAltarPage() {
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
                      Start an Altar
                      <span className='bg-amber-500/10 text-amber-500 text-[10px] py-1 px-3 rounded-full border border-amber-500/20 font-bold tracking-widest uppercase'>
                        Silver Jubilee
                      </span>
                    </h1>
                    <p className='text-muted-foreground text-xl font-semibold md:text-3xl'>
                      Multiply the Fire.{' '}
                      <span className='text-amber-500 inline-block'>
                        Establish Continuous Worship in Your City &amp; Nation.
                      </span>
                    </p>
                  </div>
                </motion.div>
              </div>
              <motion.div variants={{ hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } }}>
                <div className="relative max-h-91 h-[400px] w-full rounded-lg overflow-hidden">
                  <Image
                    src='/nonstop/nonstop-051.jpg'
                    alt='Gathering around the altar'
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
                      src='/nonstop/nonstop-046.jpg'
                      alt='Campus altar gathering'
                      fill
                      sizes='(max-width: 640px) 100vw, 50vw'
                      className='object-cover object-top'
                    />
                  </div>
                </motion.div>
                <motion.div variants={{ hidden: { opacity: 0, scale: 0.95 }, show: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut" } } }}>
                  <div className='relative overflow-hidden rounded-md h-52 w-full'>
                    <Image
                      src='/nonstop/nonstop-049.jpg'
                      alt='Community worship room'
                      fill
                      className='object-cover object-top'
                    />
                  </div>
                </motion.div>
              </div>
              <div className='flex flex-1 flex-col justify-center gap-9'>
                <motion.div variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } }}>
                  <p className='text-muted-foreground text-xl leading-relaxed'>
                    The vision extends far beyond Accra. Our desire is to inspire homes, churches, campuses, and cities to establish their own continuous altars of praise, prayer, and scripture reading.
                  </p>
                </motion.div>

                {/* Steps summary */}
                <motion.div variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } }}>
                  <div className='grid gap-6 sm:grid-cols-3'>
                    <div className='flex flex-col items-center gap-2.5'>
                      <h3 className='text-foreground text-4xl font-medium'>1</h3>
                      <p className='text-muted-foreground text-center font-medium'>Gather Watchmen</p>
                    </div>
                    <div className='flex flex-col items-center gap-2.5'>
                      <h3 className='text-foreground text-4xl font-medium'>2</h3>
                      <p className='text-muted-foreground text-center font-medium'>Set Watches</p>
                    </div>
                    <div className='flex flex-col items-center gap-2.5'>
                      <h3 className='text-foreground text-4xl font-medium'>3</h3>
                      <p className='text-muted-foreground text-center font-medium'>Connect Global</p>
                    </div>
                  </div>
                </motion.div>

                {/* Avatars & CTA */}
                <motion.div variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } }}>
                  <div className='flex items-center justify-between gap-6'>
                    <div className='flex -space-x-3'>
                      {['/nonstop/nonstop-001.jpg', '/nonstop/nonstop-048.jpg', '/nonstop/nonstop-022.jpg', '/nonstop/nonstop-047.jpg'].map((src, idx) => (
                        <span key={idx} className='group/avatar relative flex shrink-0 overflow-hidden rounded-full select-none size-12 ring-2 ring-background'>
                          <Image className='aspect-square size-full object-cover' alt='altar builder' src={src} fill sizes='48px' />
                        </span>
                      ))}
                    </div>
                    <Button asChild className='shrink-0 rounded-full bg-amber-500 hover:bg-amber-600 text-white h-12 px-8 uppercase tracking-wider font-bold'>
                      <Link href="/contact">Register Your Altar</Link>
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
              alt='Global Altar Movement'
              fill
              className='object-cover object-center'
              src='/nonstop/nonstop-060.jpg'
            />
          </div>
          <div className='grid grid-cols-1 gap-4 space-y-12 lg:grid-cols-6 lg:space-y-0' data-usal='fade-u duration-500'>
            <div className='order-2 col-span-2 lg:order-none lg:pr-16 lg:pl-10 flex '>
              <p className='text-foreground/60 text-xl md:text-xl '>
                Raising continuous worship altars across every neighborhood, city, and continent.
              </p>
            </div>
            <div className='order-1 col-span-4 lg:order-none lg:mt-0 lg:pl-6'>
              <p className='text-3xl font-medium lg:text-4xl leading-relaxed '>
                Whether starting a 24-hour worship night or establishing a permanent prayer room, we provide guidance, training, and global network coverage to help keep the fire burning.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
