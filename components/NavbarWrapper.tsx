"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";

export default function NavbarWrapper() {
  const pathname = usePathname();

  // Routes that should not display the navbar
  const noNavbarRoutes = [
    "/login",
    "/signup",
    "/dashboard",
  ];

  // Check if current pathname matches any no-navbar route
  const shouldHideNavbar = noNavbarRoutes.some(
    (route) => pathname === route || pathname?.startsWith(`${route}/`)
  );

  if (shouldHideNavbar) {
    return null;
  }

  return <Navbar />;
}
