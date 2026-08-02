import Link from "next/link";
import { Button } from "@/components/ui/button";

interface BlogPostCardProps {
	title: string;
	slug: string;
	category: string;
	excerpt: string;
	image?: string | null;
	publishedAt?: string | null;
}

export function BlogPostCard({
	title,
	slug,
	category,
	excerpt,
	publishedAt,
}: BlogPostCardProps) {
	const dateStr = publishedAt
		? new Date(publishedAt).toLocaleDateString("en-US", {
				year: "numeric",
				month: "long",
				day: "numeric",
			})
		: "";

	return (
		<div className="p-4 rounded-xl bg-muted/40 border border-border/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
			<div className="flex-1 min-w-0">
				<span className="text-amber-500 text-xs font-mono font-bold uppercase">
					{category}
					{dateStr && ` • ${dateStr}`}
				</span>
				<h3 className="font-semibold text-lg mt-1">{title}</h3>
				<p className="text-xs text-muted-foreground line-clamp-1 mt-1">
					{excerpt}
				</p>
			</div>
			<Link href={`/blog/${slug}`} className="shrink-0">
				<Button variant="outline" size="sm" className="rounded-full">
					Read
				</Button>
			</Link>
		</div>
	);
}
