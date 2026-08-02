import { type NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
	// Root level security headers
	const response = NextResponse.next();

	// Hardening headers
	response.headers.set("X-DNS-Prefetch-Control", "on");
	response.headers.set(
		"Strict-Transport-Security",
		"max-age=63072000; includeSubDomains; preload",
	);
	response.headers.set("X-Frame-Options", "SAMEORIGIN");
	response.headers.set("X-Content-Type-Options", "nosniff");
	response.headers.set("Referrer-Policy", "origin-when-cross-origin");

	const path = request.nextUrl.pathname;

	// Admin & Dashboard optimistic protection
	// To avoid Prisma WASM errors, we perform a cookie-based check here.
	// Full role validation continues to be enforced in the actual page/API handlers.
	if (path.startsWith("/dashboard") || path.startsWith("/api/admin")) {
		const sessionToken =
			request.cookies.get("better-auth.session_token") ||
			request.cookies.get("__Secure-better-auth.session_token");

		if (!sessionToken) {
			if (path.startsWith("/api")) {
				return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
			}
			return NextResponse.redirect(new URL("/login", request.url));
		}
	}

	return response;
}

export const config = {
	matcher: ["/dashboard/:path*", "/api/admin/:path*", "/help"],
};
