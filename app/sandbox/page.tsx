"use client";
import { motion } from "motion/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <section className='overflow-hidden'>
      <div className='relative'>
        <motion.div
          className='relative max-w-7xl mx-auto xl:px-16 lg:px-8 px-4 w-full h-full z-20'
          variants={containerVariants}
          initial='hidden'
          animate='show'
        >
          <div className='flex lg:flex-row flex-col justify-between lg:items-end relative z-1 gap-6 py-8 md:py-20'>
            <motion.h1
              className='text-5xl md:text-8xl font-bebas uppercase max-w-4xl tracking-tight'
              variants={itemVariants}
            >
              An Unbroken Altar of Worship for the Nations
            </motion.h1>
            <motion.div
              className='flex group items-center gap-1'
              variants={itemVariants}
            >
              <button
                type='button'
                className="focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 border border-transparent bg-clip-padding text-sm font-medium focus-visible:ring-3 aria-invalid:ring-3 [&_svg:not([class*='size-'])]:size-4 inline-flex items-center justify-center whitespace-nowrap transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none shrink-0 [&_svg]:shrink-0 outline-none group/button select-none bg-primary text-primary-foreground [a]:hover:bg-primary/80 gap-1.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 px-6 py-3.5 h-auto rounded-full cursor-pointer"
              >
                Experience the Fire
              </button>
              <button
                type='button'
                className="focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 border border-transparent bg-clip-padding text-sm font-medium focus-visible:ring-3 aria-invalid:ring-3 [&_svg:not([class*='size-'])]:size-4 inline-flex items-center justify-center whitespace-nowrap disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none shrink-0 [&_svg]:shrink-0 outline-none group/button select-none bg-primary text-primary-foreground [a]:hover:bg-primary/80 gap-1.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 p-4 rounded-full h-auto transition-transform duration-300 ease-out group-hover:rotate-312 cursor-pointer"
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width={16}
                  height={16}
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth={2}
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  className='lucide lucide-arrow-right'
                  aria-hidden='true'
                >
                  <path d='M5 12h14' />
                  <path d='m12 5 7 7-7 7' />
                </svg>
              </button>
            </motion.div>
          </div>
        </motion.div>
        <div className='absolute top-0 left-0 w-full h-full grid grid-cols-6 border-x right-0'>
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className='border-r border-border/50'
            />
          ))}
        </div>
      </div>
      <motion.div
        className='border-t border-border'
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          className='relative max-w-full mx-auto overflow-hidden lg:aspect-16/6 md:aspect-16/8 aspect-video group/media'
          onMouseEnter={(e) => {
            const video = e.currentTarget.querySelector("video");
            if (video) {
              video.play().catch(() => {});
              video.style.opacity = "1";
            }
          }}
          onMouseLeave={(e) => {
            const video = e.currentTarget.querySelector("video");
            if (video) {
              video.pause();
              video.style.opacity = "0";
            }
          }}
        >
          <Image
            src='/images/community_worship.jpg'
            alt='Video banner'
            fill
            className='object-cover transition-opacity duration-500 ease-in-out opacity-100'
          />
          <video
            src='/123.mp4'
            loop
            muted
            playsInline
            className='absolute inset-0 w-full h-full object-cover transition-opacity duration-300 opacity-0 pointer-events-none'
          />
          <button
            type='button'
            className="focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 border border-transparent bg-clip-padding text-sm font-medium focus-visible:ring-3 aria-invalid:ring-3 [&_svg:not([class*='size-'])]:size-4 inline-flex items-center justify-center whitespace-nowrap disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none shrink-0 [&_svg]:shrink-0 outline-none group/button select-none text-primary-foreground [a]:hover:bg-primary/80 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:h-22 lg:w-22 h-15 w-15 rounded-full cursor-pointer bg-white/10 hover:bg-white/20 transition hover:scale-105 z-30"
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width={24}
              height={24}
              viewBox='0 0 24 24'
              fill='white'
              stroke='currentColor'
              strokeWidth={2}
              strokeLinecap='round'
              strokeLinejoin='round'
              className='lucide lucide-play lg:size-8 size-5 text-white'
              aria-hidden='true'
            >
              <path d='M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z' />
            </svg>
          </button>
          <div className='absolute bottom-10 left-10 lg:max-w-xl text-white md:block hidden transition-all duration-300 opacity-100 translate-y-0 z-30'>
            <p className='text-2xl lg:text-3xl text-white font-normal leading-tight'>
              Sustaining 144 hours of unbroken praise, intercession, and the
              Word. Join the movement of recovery, revival, and restoration.
            </p>
          </div>
        </div>
      </motion.div>
      <Dialog>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Scrollable Content</DialogTitle>
            <DialogDescription>
              This is a dialog with scrollable content.
            </DialogDescription>
          </DialogHeader>
          <div className='-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4'>
            {Array.from({ length: 10 }).map((_, index) => (
              <p
                key={index}
                className='mb-4 leading-normal'
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
