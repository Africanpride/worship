import type { MetadataRoute } from "next";

const BASE_URL = "https://thenonstop.org";

export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{
			url: BASE_URL,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 1.0,
		},
		{
			url: `${BASE_URL}/about`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.9,
		},
		{
			url: `${BASE_URL}/schedule`,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 0.95,
		},
		{
			url: `${BASE_URL}/live`,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 0.9,
		},
		{
			url: `${BASE_URL}/gallery`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.75,
		},
		{
			url: `${BASE_URL}/get-involved`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.85,
		},
		{
			url: `${BASE_URL}/partner`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.8,
		},
		{
			url: `${BASE_URL}/contact`,
			lastModified: new Date(),
			changeFrequency: "yearly",
			priority: 0.6,
		},
	];
}
