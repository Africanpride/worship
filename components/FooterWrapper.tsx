"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/footer";

export default function FooterWrapper() {
	const pathname = usePathname();

	// Routes that should not display the footer
	const noFooterRoutes = ["/login", "/signup", "/dashboard"];

	// Check if current pathname matches any no-footer route
	const shouldHideFooter = noFooterRoutes.some(
		(route) => pathname === route || pathname?.startsWith(`${route}/`),
	);

	if (shouldHideFooter) {
		return null;
	}

	return <Footer />;
}
