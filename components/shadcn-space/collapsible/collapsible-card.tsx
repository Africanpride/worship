"use client";

import { ChevronRightIcon } from "lucide-react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { type ReactNode, useState } from "react";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const containerVariants: Variants = {
	hidden: { height: 0, opacity: 0 },
	visible: {
		height: "auto",
		opacity: 1,
		transition: {
			duration: 0.3,
			ease: [0.04, 0.62, 0.23, 0.98],
			staggerChildren: 0.07,
			delayChildren: 0.1,
		},
	},
	exit: {
		height: 0,
		opacity: 0,
		transition: { duration: 0.25, ease: "easeInOut" },
	},
};

const itemVariants: Variants = {
	hidden: { opacity: 0, y: -6 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.22, ease: "easeOut" },
	},
	exit: { opacity: 0, y: -4, transition: { duration: 0.15 } },
};

export type CollapsibleCardProps = {
	trigger: ReactNode;
	children: ReactNode;
	defaultOpen?: boolean;
	className?: string;
};

export function CollapsibleCard({
	trigger,
	children,
	defaultOpen = false,
	className,
}: CollapsibleCardProps) {
	const [open, setOpen] = useState(defaultOpen);

	return (
		<div
			className={cn("w-full rounded-xl border bg-card shadow-sm", className)}
		>
			<Collapsible open={open} onOpenChange={setOpen}>
				<CollapsibleTrigger className="flex w-full cursor-pointer items-center gap-2 px-4 py-3 text-left">
					<div className="flex min-w-0 flex-1 flex-col gap-1">{trigger}</div>
					<motion.span
						animate={{ rotate: open ? 90 : 0 }}
						transition={{ duration: 0.25, ease: "easeInOut" }}
						className="inline-flex shrink-0"
					>
						<ChevronRightIcon
							aria-hidden="true"
							className="text-muted-foreground size-4"
						/>
					</motion.span>
				</CollapsibleTrigger>

				<AnimatePresence initial={false}>
					{open && (
						<motion.div
							key="collapsible-card-content"
							variants={containerVariants}
							initial="hidden"
							animate="visible"
							exit="exit"
							style={{ overflow: "hidden" }}
						>
							<motion.div variants={itemVariants}>
								<Separator />
							</motion.div>
							<div className="flex flex-col gap-3 px-4 py-3">{children}</div>
						</motion.div>
					)}
				</AnimatePresence>
			</Collapsible>
		</div>
	);
}
