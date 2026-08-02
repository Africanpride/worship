import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: "*",
				allow: ["/"],
				disallow: [
					"/dashboard/",
					"/admin/",
					"/api/",
					"/login",
					"/signup",
					"/profile",
					"/verify-email",
					"/cookies",
					"/privacy",
					"/terms",
					"/tester/",
					"/tester2/",
					"/tester3/",
					"/tester4/",
				],
			},
		],
		sitemap: "https://thenonstop.org/sitemap.xml",
		host: "https://thenonstop.org",
	};
}
