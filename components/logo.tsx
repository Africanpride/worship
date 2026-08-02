import { Infinity } from "lucide-react";
import Link from "next/link";

export const Logo = () => (
	<Link
		href={"/"}
		className="flex pl-4 items-center gap-2 group transition-all duration-300"
	>
		<div className="relative flex items-center justify-center">
			<Infinity className="w-10 h-10 text-white group-hover:text-amber-400 transition-colors duration-500" />
			<div className="absolute inset-0 bg-amber-400/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
		</div>
		<div className="flex flex-col -space-y-1">
			<span className="uppercase text-[14px] leading-none text-white font-extrabold tracking-tighter glow-sm whitespace-nowrap">
				The NonStop Series ™
			</span>
		</div>
	</Link>
);
