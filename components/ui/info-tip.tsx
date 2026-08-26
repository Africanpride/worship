"use client";

import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

/**
 * Small info icon that reveals a helpful tidbit on click/hover-focus.
 * Drop next to any form label: <InfoTip>Why we ask…</InfoTip>
 */
export function InfoTip({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					type="button"
					variant="ghost"
					size="icon"
					className={cn(
						"size-5 shrink-0 cursor-pointer text-muted-foreground/60 hover:text-muted-foreground",
						className,
					)}
					aria-label="More information"
				>
					<Info className="size-3.5" />
				</Button>
			</PopoverTrigger>
			<PopoverContent side="top" align="start" className="w-64 p-3 text-xs">
				{children}
			</PopoverContent>
		</Popover>
	);
}
