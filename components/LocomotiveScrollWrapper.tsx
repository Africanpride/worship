"use client";

import { useEffect, useRef, ReactNode } from "react";
import LocomotiveScroll from "locomotive-scroll";
import "locomotive-scroll/dist/locomotive-scroll.css";

export default function LocomotiveScrollWrapper({
  children,
}: {
  children: ReactNode;
}) {
  const scrollRef = useRef<HTMLElement>(null);
  const locomotiveScrollRef = useRef<LocomotiveScroll | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      locomotiveScrollRef.current = new LocomotiveScroll();
    }

    return () => {
      locomotiveScrollRef.current?.destroy();
    };
  }, []);

  return <main ref={scrollRef}>{children}</main>;
}
