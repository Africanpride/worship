"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { motion } from "framer-motion";

interface HeroHeadlineProps {
  className?: string;
  text1?: string;
  text2?: string;
  text3?: string;
  imageSrc?: string;
}

export default function HeroHeadline({
  className,
  text1 = "Recovery, Revival",
  text2 = "and the Restoration",
  text3 = "of David's Tabernacle",
  imageSrc = "/images/cs.jpg",
}: HeroHeadlineProps) {
  return (
    <div className={cn("  py-20 flex flex-col md:flex-row justify-center items-center gap-10 overflow-hidden", className)}>
      <div className="flex-1">
        <h1 className="text-[12vw] sm:text-[10vw] md:text-[8vw] lg:text-[7.5vw] font-bebas leading-[0.85] tracking-[-0.03em] uppercase ">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="block h-fit overflow-hidden"
          >
            {text1}
          </motion.div>
          
          <div className="flex items-baseline gap-[1vw] sm:gap-[1.5vw]">
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "12vw", opacity: 1 }}
              transition={{ duration: 4, ease: [0.22, 1, 0.36, 1], delay: 0.7 }}
              className="relative h-[8vw] sm:h-[7vw] md:h-[6vw] lg:h-[5.5vw] mt-[0.5vw] items-baseline rounded-[1vw] overflow-hidden bg-primary/10 border border-primary/5"
            >
              <Image
                src={imageSrc}
                alt="Highlight"
                fill
                sizes="20vw"
                className="object-cover object-top scale-110"
                priority
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              className="block"
            >
              {text2}
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            className="block"
          >
            {text3}
          </motion.div>
        </h1>
      </div>

      <div className="hidden lg:block ">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
          className="w-16 h-16 border rounded-full flex items-center justify-center p-3 opacity-20 hover:opacity-50 transition-opacity cursor-pointer rotate-45"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 17L17 7" />
            <path d="M7 7h10v10" />
          </svg>
        </motion.div>
      </div>
    </div>
  );
}
