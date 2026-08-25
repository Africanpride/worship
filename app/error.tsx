"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error("[RENDER_ERROR]", error);
	}, [error]);

	return (
		<main className="flex min-h-svh items-center justify-center p-4">
			<div className="w-full max-w-md rounded-xl border bg-card p-8 text-center">
				<h1 className="text-xl font-medium">Something went wrong</h1>
				<p className="mt-2 text-sm text-muted-foreground">
					An unexpected error interrupted this page. It has been noted — trying
					again usually resolves it.
				</p>
				{error.digest && (
					<p className="mt-3 font-mono text-[10px] text-muted-foreground/70">
						ref: {error.digest}
					</p>
				)}
				<Button onClick={reset} className="mt-6 cursor-pointer">
					Try again
				</Button>
			</div>
		</main>
	);
}
