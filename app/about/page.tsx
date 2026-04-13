"use client";

// NOTE: SEO metadata for this page is defined in app/about/metadata.ts (server-side)
import { AboutCompliment } from "@/components/about-compliment";
import { MissionVision } from "@/components/mission-vision";
import { motion, Variants } from "framer-motion";
import Image from "next/image";

const MotionImage = motion.create(Image);

// ─── Shared animation variants ────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const containerFast: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const imageReveal: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const slideLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const slideRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <main className='flex flex-col min-h-screen w-full relative'>

      {/* ── Section 1: Intro / Photo Grid ───────────────────────────────── */}
      <section className='flex flex-1 items-center justify-center'>
        <div className='py-6 w-full'>
          <div className='container'>
            <motion.div
              className='flex flex-col items-center justify-start gap-6 lg:flex-row'
              variants={container}
              initial='hidden'
              animate='show'
            >
              {/* Left column – text + photos */}
              <motion.div
                className='flex w-full flex-col items-start justify-start gap-2 lg:w-1/2'
                variants={fadeUp}
              >
                <div className='pr-2'>
                  <motion.h1
                    className='mb-6 text-2xl uppercase md:text-4xl lg:mb-8 lg:text-5xl'
                    variants={fadeUp}
                  >
                    The Non-Stop Series
                  </motion.h1>
                  <motion.p
                    className='mb-9 text-muted-foreground'
                    variants={fadeUp}
                  >
                    For the past 25 years, the Logos-Rhema Foundation for
                    Leadership Resource Development, based in Accra, Ghana, has
                    organised and held under its auspices, a series of non-stop
                    praise &amp; worship programmes. This historic 25th Year Silver Jubilee 
                    celebration marks a journey that began with 24-hour sessions 
                    which progressed to 144 hours; the first session of which 
                    was held in 2021.
                  </motion.p>
                </div>

                <motion.div
                  className='flex flex-col items-center justify-center gap-6 md:flex-row'
                  variants={containerFast}
                >
                  <div className='relative aspect-[0.7] w-full rounded-lg overflow-hidden md:w-1/2'>
                    <MotionImage
                      alt='about 1'
                      fill
                      className='object-cover object-top'
                      src='/nonstop/nonstop-048.jpg'
                      variants={imageReveal}
                    />
                  </div>
                  <motion.div
                    className='flex w-full flex-col items-center justify-center gap-6 md:w-1/2'
                    variants={containerFast}
                  >
                    <div className='relative aspect-[1.1] w-full rounded-lg overflow-hidden'>
                      <MotionImage
                        alt='about 2'
                        fill
                        className='object-cover object-top'
                        src='/nonstop/nonstop-022.jpg'
                        variants={imageReveal}
                      />
                    </div>
                    <div className='relative aspect-[0.7] w-full rounded-lg overflow-hidden'>
                      <MotionImage
                        alt='about 3'
                        fill
                        className='object-cover object-top'
                        src='/nonstop/nonstop-004.jpg'
                        variants={imageReveal}
                      />
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Right column – more photos + quote */}
              <motion.div
                className='flex w-full flex-col items-center justify-center gap-12 pt-12 lg:w-1/2 lg:pt-48'
                variants={slideRight}
              >
                <motion.div
                  className='flex flex-col items-center justify-center gap-6 md:flex-row'
                  variants={containerFast}
                >
                  <div className='relative aspect-[0.9] w-full rounded-lg overflow-hidden md:w-1/2'>
                    <MotionImage
                      alt='about 4'
                      fill
                      className='object-cover object-top'
                      src='/nonstop/nonstop-012.jpg'
                      variants={imageReveal}
                    />
                  </div>
                  <motion.div
                    className='flex w-full flex-col items-center justify-center gap-6 md:w-1/2'
                    variants={containerFast}
                  >
                    <div className='relative aspect-[0.8] w-full rounded-lg overflow-hidden'>
                      <MotionImage
                        alt='about 5'
                        fill
                        className='object-cover object-top'
                        src='/nonstop/nonstop-026.jpg'
                        variants={imageReveal}
                      />
                    </div>
                    <div className='relative aspect-[0.9] w-full rounded-lg overflow-hidden'>
                      <MotionImage
                        alt='about 6'
                        fill
                        className='object-cover object-top'
                        src='/nonstop/nonstop-010.jpg'
                        variants={imageReveal}
                      />
                    </div>
                  </motion.div>
                </motion.div>

                <motion.div className='p-2 sm:px-8 ' variants={container}>
                  <motion.h1
                    className='mb-8 text-2xl font-semibold lg:mb-6'
                    variants={fadeUp}
                  >
                    Around-The-Clock Ministration
                  </motion.h1>
                  <motion.p className='mb-9 lg:text-2xl' variants={fadeUp}>
                    Jesus said, "The hour is coming and is already  here when the
                    true worshipers will worship the Father in spirit and truth;
                    for the Father is looking for those who will worship Him
                    that way." (John 4:23-25)
                  </motion.p>
                  <motion.p className='text-muted-foreground' variants={fadeUp}>
                    In the Old Testament days, there was one saint, David,
                    tasted the fruits of the truth of the word of God and the
                    powers of the world to come, he also tasted salvation and
                    experienced the Holy Spirit (Psalm 51). He was able to
                    experience all that because he understood how to touch the
                    heart of the Father (Acts 13:22). Regardless of his
                    weaknesses and many flaws, David genuinely, was out all time
                    to please God and to give Him pleasure. Because the purpose
                    of everyone's creation as found in Revelations 4:11 is to
                    please and give the Lord, pleasure.
                  </motion.p>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Section 2: Full-bleed image / pillars ───────────────────────── */}
      <section className='py-16 block-preview-wrapper'>
        <div className="bg-[url('/nonstop/nonstop-017.jpg')] bg-cover bg-center rounded-xl bg-no-repeat pt-16">
          <div className='flex items-end sm:items-center justify-center lg:justify-start'>
            <div className='max-w-7xl px-4 lg:px-8 xl:px-16 lg:py-20 sm:py-16 py-8 mx-auto w-full h-full min-h-screen'>
              <div style={{ opacity: 1, transform: "none" }}>
                <div
                  data-slot='card'
                  data-size='default'
                  className='ring-foreground/10 bg-card text-card-foreground hidden gap-4 overflow-hidden rounded-xl text-sm ring-1 has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:gap-3 data-[size=sm]:py-3 data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl group/card flex flex-col w-full h-full max-w-md p-5 sm:p-10 border-none shadow-none'
                >
                  <div
                    data-slot='card-content'
                    className='group-data-[size=sm]/card:px-3 p-0'
                  >
                    <motion.div
                      className='flex flex-col gap-6'
                      variants={container}
                      initial='hidden'
                      whileInView='show'
                      viewport={{ once: true, amount: 0.05 }}
                    >
                      <motion.div
                        className='hidden sm:block'
                        variants={fadeUp}
                      >
                        <div className='p-5 border rounded-2xl flex flex-col gap-8'>
                          {[
                            {
                              label: "Recovery",
                              desc: "Reclaiming every spiritual inheritance that has been stolen or dormant.",
                              icon: (
                                <svg xmlns='http://www.w3.org/2000/svg' width={24} height={24} viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round' className='lucide lucide-layers shrink-0' aria-hidden='true'>
                                  <path d='M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z' />
                                  <path d='M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12' />
                                  <path d='M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17' />
                                </svg>
                              ),
                            },
                            {
                              label: "Revival",
                              desc: "Igniting a fresh passion for the Presence of God that outlasts the event.",
                              icon: (
                                <svg xmlns='http://www.w3.org/2000/svg' width={24} height={24} viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round' className='lucide lucide-layers shrink-0' aria-hidden='true'>
                                  <path d='M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z' />
                                  <path d='M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12' />
                                  <path d='M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17' />
                                </svg>
                              ),
                            },
                            {
                              label: "Restoration",
                              desc: "Returning to the original pattern of intimacy where every believer has direct access to the Throne.",
                              icon: (
                                <svg xmlns='http://www.w3.org/2000/svg' width={24} height={24} viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round' className='lucide lucide-shapes shrink-0' aria-hidden='true'>
                                  <path d='M8.3 10a.7.7 0 0 1-.626-1.079L11.4 3a.7.7 0 0 1 1.198-.043L16.3 8.9a.7.7 0 0 1-.572 1.1Z' />
                                  <rect x={3} y={14} width={7} height={7} rx={1} />
                                  <circle cx='17.5' cy='17.5' r='3.5' />
                                </svg>
                              ),
                            },
                          ].map((item, i) => (
                            <motion.div key={item.label} variants={fadeUp}>
                              {i > 0 && (
                                <div
                                  data-orientation='horizontal'
                                  role='separator'
                                  aria-orientation='horizontal'
                                  data-slot='separator'
                                  className='bg-border shrink-0 data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch mb-8'
                                />
                              )}
                              <div className='flex gap-4'>
                                {item.icon}
                                <div className='flex flex-col gap-1'>
                                  <p className='text-xl font-medium'>{item.label}</p>
                                  <p className='text-base text-muted-foreground'>{item.desc}</p>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 3: Mission / Vision ─────────────────────────────────── */}
      <section>
        <MissionVision />
      </section>

      {/* ── Section 4: Impact stats ─────────────────────────────────────── */}
      <section
        className='container py-12 md:py-8 p-2'
        id='achievements'
      >
        <motion.div
          variants={container}
          initial='hidden'
          whileInView='show'
          viewport={{ once: true, amount: 0.05 }}
        >
          <motion.h2 className='mb-4 text-3xl sm:text-4xl' variants={fadeUp}>
            Our Impact &amp; Reach
          </motion.h2>
          <motion.p
            className='text-muted-foreground mb-12 max-w-3xl text-base sm:text-lg'
            variants={fadeUp}
          >
            Rooted in faith, growing in community. Witness the transformative
            power of worship as we reach souls across the globe and build a
            legacy of spiritual revival.
          </motion.p>

          <motion.div
            className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'
            variants={containerFast}
          >
            {[
              {
                icon: (
                  <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className='lucide lucide-users text-primary mb-4 h-8 w-8'>
                    <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
                    <circle cx='9' cy='7' r='4' />
                    <path d='M22 21v-2a4 4 0 0 0-3-3.87' />
                    <path d='M16 3.13a4 4 0 0 1 0 7.75' />
                  </svg>
                ),
                stat: "150k+",
                label: "Faithful Believers",
                desc: "United in spirit across diverse congregations and digital platforms.",
              },
              {
                icon: (
                  <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className='lucide lucide-flame text-primary mb-4 h-8 w-8'>
                    <path d='M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z' />
                  </svg>
                ),
                stat: "500k+",
                label: "Praise, Word & Prayer",
                desc: "Sustaining a 144-hour continuous flow of worship, scripture reading, and intercession.",
              },
              {
                icon: (
                  <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className='lucide lucide-heart text-primary mb-4 h-8 w-8'>
                    <path d='M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z' />
                  </svg>
                ),
                stat: "10k+",
                label: "Souls Restored",
                desc: "Documented testimonies of spiritual growth and life-changing renewal.",
              },
              {
                icon: (
                  <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className='lucide lucide-globe text-primary mb-4 h-8 w-8'>
                    <circle cx='12' cy='12' r='10' />
                    <line x1='2' x2='22' y1='12' y2='12' />
                    <path d='M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z' />
                  </svg>
                ),
                stat: "25+",
                label: "Global Ministries",
                desc: "Partnering with mission-driven organizations across multiple nations.",
              },
            ].map((card) => (
              <motion.div
                key={card.label}
                data-slot='card'
                className='bg-card text-card-foreground flex flex-col rounded-xl border shadow-sm gap-0 p-6 text-left hover:shadow-md transition-shadow'
                variants={fadeUp}
              >
                {card.icon}
                <div className='mb-1 text-3xl font-bold'>{card.stat}</div>
                <div className='mb-3 text-sm font-medium'>{card.label}</div>
                <p className='text-muted-foreground text-sm'>{card.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}
