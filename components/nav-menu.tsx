"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export const NavMenu = ({
  className,
  orientation = "horizontal",
  onItemClick,
  ...props
}: ComponentProps<"nav"> & {
  orientation?: "horizontal" | "vertical";
  onItemClick?: () => void;
}) => {
  const items = [
		{ label: "Home", href: "/" },
		{ label: "About", href: "/about" },
		{ label: "Schedule", href: "/schedule" },
		{ label: "Live", href: "/live" },
		{ label: "Gallery", href: "/gallery" },
		{ label: "Partner", href: "/partner" },
		{ label: "Get Involved", href: "/get-involved" },
		{ label: "Contact", href: "/contact" },
  ];

  const isVertical = orientation === "vertical";

  return (
    <nav
      className={cn(
        "flex",
        isVertical ? "flex-col items-start gap-2" : "items-center justify-center space-x-1",
        className
      )}
      {...props}
    >
      {items.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          onClick={onItemClick}
          className={cn(
            "group relative block h-12 overflow-hidden px-4 font-bold",
            isVertical && "w-full px-0"
          )}
          transitionTypes={['slide', 'fade']}
        >
          <div className='flex flex-col transition-transform duration-400 group-hover:-translate-y-12 text-white '>
            <span className='flex h-12 items-center justify-center text-[12px] font-medium uppercase tracking-wide text-white transition-colors duration-400 group-hover:text-white'>
              {item.label}
            </span>
            <span className='flex h-12 items-center justify-center text-[12px] font-medium uppercase tracking-wide text-white'>
              {item.label}
            </span>
          </div>
        </Link>
      ))}
    </nav>
  );
};
