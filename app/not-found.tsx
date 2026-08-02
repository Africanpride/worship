import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-4">
			<div className="max-w-md w-full text-center space-y-8">
				<div className="space-y-4">
					<h1 className="text-9xl font-bebas tracking-tighter text-primary animate-pulse">
						404
					</h1>
					<h2 className="text-3xl font-bebas tracking-wide uppercase">
						Presence Not Found
					</h2>
					<p className="text-muted-foreground text-lg leading-relaxed">
						The page you are looking for has been moved or doesn't exist.
						Perhaps the path has changed, but the mission remains.
					</p>
				</div>

				<div className="pt-8">
					<Button
						asChild
						className="rounded-full h-12 px-8 font-bebas text-lg tracking-wider"
					>
						<Link href="/" className="flex items-center gap-2">
							<ArrowLeft className="size-5" />
							Return Home
						</Link>
					</Button>
				</div>

				<div className="pt-12 flex justify-center">
					<Image
						src="/non-stop-logo.webp"
						alt="The Non-Stop Series"
						width={160}
						height={48}
						className="h-12 w-auto grayscale opacity-50"
					/>
				</div>
			</div>
		</div>
	);
}
