"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import useSWR from "swr";
import { cn } from "@/lib/utils";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const NavMenu = ({
  className,
  orientation = "horizontal",
  onItemClick,
  ...props
}: ComponentProps<"nav"> & {
  orientation?: "horizontal" | "vertical";
  onItemClick?: () => void;
}) => {
  const { data } = useSWR("/api/events/live", fetcher, {
    refreshInterval: 60000, // Refresh every minute
  });

  const isLive = data?.isLive || false;

  const items = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Watches", href: "/watches" },
    // { label: "Music & Worship", href: "/music-and-worship" },
    // { label: "Prayer Wall", href: "/prayer-wall" },
    // { label: "Scripture Reading", href: "/scripture-reading" },
    // { label: "Daily Devotionals", href: "/blog" },
    // { label: "Start an Altar", href: "/start-an-altar" },
    { label: "Schedule", href: "/schedule" },
    // { label: "Partner", href: "/partner" },
    { label: "Live", href: "/live", showPulse: true },
    { label: "Gallery", href: "/gallery" },
    { label: "Get Involved", href: "/get-involved" },
    { label: "Contact", href: "/contact" },
  ];

  const isVertical = orientation === "vertical";

  return (
    <nav
      className={cn(
        "flex",
        isVertical
          ? "flex-col items-start gap-2"
          : "items-center justify-center space-x-1",
        className,
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
            isVertical && "w-full px-0",
          )}
          transitionTypes={["slide", "fade"]}
        >
          <div className="flex flex-col transition-transform duration-400 group-hover:-translate-y-12 text-white ">
            <div className="flex h-12 items-center justify-center text-[12px] font-medium uppercase tracking-wide text-white transition-colors duration-400 group-hover:text-white gap-2">
              {item.label}
              {item.label === "Live" && isLive && (
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
                </span>
              )}
            </div>
            <div className="flex h-12 items-center justify-center text-[12px] font-medium uppercase tracking-wide text-white gap-2">
              {item.label}
              {item.label === "Live" && isLive && (
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
                </span>
              )}
            </div>
          </div>
        </Link>
      ))}
    </nav>
  );
};
