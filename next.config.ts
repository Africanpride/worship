import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	serverExternalPackages: ["exceljs", "@react-pdf/renderer"],
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "lh3.googleusercontent.com",
			},
			{
				protocol: "https",
				hostname: "avatars.githubusercontent.com",
			},
			{
				protocol: "https",
				hostname: "i.pravatar.cc",
			},
			{
				protocol: "https",
				hostname: "res.cloudinary.com",
			},
			{
				protocol: "https",
				hostname: "*.cloudinary.com",
			},
			{
				protocol: "https",
				hostname: "*.microsoft.com",
			},
			{
				protocol: "https",
				hostname: "*.microsoftonline.com",
			},
			{
				protocol: "https",
				hostname: "*.live.com",
			},
			{
				protocol: "https",
				hostname: "graph.microsoft.com",
			},
		],
	},
	async headers() {
		return [
			{
				source: "/(.*)",
				headers: [
					{
						key: "X-DNS-Prefetch-Control",
						value: "on",
					},
					{
						key: "Strict-Transport-Security",
						value: "max-age=63072000; includeSubDomains; preload",
					},
					{
						key: "X-Frame-Options",
						value: "SAMEORIGIN",
					},
					{
						key: "X-Content-Type-Options",
						value: "nosniff",
					},
					{
						key: "Referrer-Policy",
						value: "origin-when-cross-origin",
					},
					{
						key: "Permissions-Policy",
						value:
							"camera=(), microphone=(), geolocation=(), browsing-topics=()",
					},
					{
						key: "Content-Security-Policy",
						value:
							"default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://accounts.google.com; connect-src 'self' https://challenges.cloudflare.com https://accounts.google.com; img-src 'self' data: blob: https://lh3.googleusercontent.com https://avatars.githubusercontent.com https://*.cloudfront.net https://react-circle-flags.pages.dev https://res.cloudinary.com https://*.cloudinary.com https://*.microsoft.com https://*.microsoftonline.com https://*.live.com https://graph.microsoft.com https://i.pravatar.cc; frame-src 'self' https://challenges.cloudflare.com https://www.youtube.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com;",
					},
				],
			},
		];
	},
};

export default nextConfig;
