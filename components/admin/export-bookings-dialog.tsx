"use client";

import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface ExportBookingsDialogProps {
	filters: {
		eventId: string;
		timeframe: string;
		statusFilter: string;
		hidePastEvents: boolean;
		searchQuery: string;
	};
}

type Scope = "current" | "all";

const SCOPES: Array<{
	value: Scope;
	title: string;
	description: string;
}> = [
	{
		value: "current",
		title: "Current view",
		description:
			"Mirrors exactly what's on screen — event picker, timeframe, status, search and hide-past all applied.",
	},
	{
		value: "all",
		title: "Everything",
		description:
			"Full record across every event, past and upcoming, ignoring the filters above.",
	},
];

export function ExportBookingsDialog({ filters }: ExportBookingsDialogProps) {
	const [open, setOpen] = useState(false);
	const [scope, setScope] = useState<Scope>("current");
	const [exporting, setExporting] = useState<"xlsx" | "pdf" | null>(null);

	function buildUrl(format: "xlsx" | "pdf") {
		const params = new URLSearchParams({ format, scope });
		if (scope === "current") {
			params.set("eventId", filters.eventId);
			params.set("timeframe", filters.timeframe);
			params.set("status", filters.statusFilter);
			params.set("hidePast", filters.hidePastEvents ? "true" : "false");
			if (filters.searchQuery.trim()) {
				params.set("q", filters.searchQuery.trim());
			}
		}
		return `/api/admin/bookings/export?${params.toString()}`;
	}

	function download(format: "xlsx" | "pdf") {
		setExporting(format);
		try {
			window.location.href = buildUrl(format);
			toast.success(
				format === "xlsx" ? "Excel export started" : "PDF export started",
			);
		} finally {
			setTimeout(() => setExporting(null), 1200);
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					variant="outline"
					size="sm"
					className="h-7 cursor-pointer gap-1.5 px-2 text-xs"
					aria-label="Export bookings"
				>
					<Download className="size-3.5" />
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-md p-0 gap-0 overflow-hidden">
				<DialogHeader className="border-b px-6 py-4 space-y-0.5">
					<DialogTitle className="text-sm font-medium">
						Export bookings
					</DialogTitle>
					<DialogDescription className="text-muted-foreground text-xs">
						Download the bookings dataset as Excel or PDF.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-2.5 px-6 py-4">
					<Label className="text-xs">What to include</Label>
					{SCOPES.map((option) => (
						<button
							key={option.value}
							type="button"
							onClick={() => setScope(option.value)}
							className={cn(
								"w-full cursor-pointer rounded-lg border p-3 text-left transition-colors",
								scope === option.value
									? "border-primary/50 bg-primary/5"
									: "hover:bg-muted/50",
							)}
						>
							<span className="block text-sm font-medium">{option.title}</span>
							<span className="mt-0.5 block text-xs text-muted-foreground">
								{option.description}
							</span>
						</button>
					))}
				</div>

				<DialogFooter className="mx-0 mb-0 grid grid-cols-1 gap-2 px-6 pb-6 sm:!grid-flow-row [&>button]:w-full">
					<Button
						variant="outline"
						disabled={exporting !== null}
						onClick={() => download("xlsx")}
						className="cursor-pointer"
					>
						<FileSpreadsheet className="mr-2 size-4 text-emerald-600" />
						{exporting === "xlsx" ? "Preparing…" : "Export Excel (.xlsx)"}
					</Button>
					<Button
						disabled={exporting !== null}
						onClick={() => download("pdf")}
						className="cursor-pointer"
					>
						<FileText className="mr-2 size-4" />
						{exporting === "pdf" ? "Preparing…" : "Export PDF"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
