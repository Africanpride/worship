"use client";

import { format } from "date-fns";
import { ClipboardCopy } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

export interface AuditLogEntry {
	id: string;
	actorId: string;
	actorEmail: string;
	actorName: string;
	actorRole: string;
	action: string;
	entityType: string;
	entityId?: string | null;
	entityLabel?: string | null;
	before?: Record<string, unknown> | null;
	after?: Record<string, unknown> | null;
	metadata?: Record<string, unknown> | null;
	ipAddress?: string | null;
	userAgent?: string | null;
	createdAt: string;
}

function JsonBlock({
	label,
	data,
	tone,
}: {
	label: string;
	data: Record<string, unknown> | null | undefined;
	tone: "before" | "after";
}) {
	const hasData = data && Object.keys(data).length > 0;
	return (
		<div className="min-w-0 flex-1">
			<p
				className={
					tone === "before"
						? "mb-1 text-xs font-medium text-red-600 dark:text-red-400"
						: "mb-1 text-xs font-medium text-emerald-600 dark:text-emerald-400"
				}
			>
				{label}
			</p>
			<pre
				className={
					"max-h-56 overflow-auto rounded-md border bg-muted/40 p-2 font-mono text-[11px] leading-relaxed " +
					(tone === "before"
						? "border-red-200 dark:border-red-900/50"
						: "border-emerald-200 dark:border-emerald-900/50")
				}
			>
				{hasData ? JSON.stringify(data, null, 2) : "—"}
			</pre>
		</div>
	);
}

export function AuditDetailDialog({
	entry,
	open,
	onOpenChange,
}: {
	entry: AuditLogEntry | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	async function copyJson() {
		if (!entry) return;
		try {
			await navigator.clipboard.writeText(JSON.stringify(entry, null, 2));
			toast.success("Audit entry copied");
		} catch {
			toast.error("Clipboard unavailable");
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
				<DialogHeader className="space-y-1">
					<DialogTitle className="text-sm font-medium">
						Audit entry inspector
					</DialogTitle>
					<DialogDescription className="text-xs text-muted-foreground">
						{entry
							? `${entry.action} · ${format(
									new Date(entry.createdAt),
									"d MMM yyyy · HH:mm:ss",
								)}`
							: "Detailed view of a single audit record."}
					</DialogDescription>
				</DialogHeader>

				{entry && (
					<div className="space-y-4">
						{/* Actor & target summary */}
						<div className="grid gap-3 sm:grid-cols-2">
							<div className="rounded-md border p-3">
								<p className="text-xs text-muted-foreground">Admin actor</p>
								<p className="mt-0.5 truncate text-sm font-medium">
									{entry.actorName}
								</p>
								<p className="truncate text-xs text-muted-foreground">
									{entry.actorEmail}
								</p>
								<div className="mt-2 flex flex-wrap gap-1">
									<Badge
										variant="outline"
										className="text-[10px] uppercase px-1.5 py-0"
									>
										{entry.actorRole}
									</Badge>
									<Badge variant="outline" className="text-[10px] px-1.5 py-0">
										{entry.action}
									</Badge>
								</div>
							</div>
							<div className="rounded-md border p-3">
								<p className="text-xs text-muted-foreground">Target entity</p>
								<p className="mt-0.5 truncate text-sm font-medium">
									{entry.entityLabel || entry.entityId || "—"}
								</p>
								<p className="truncate font-mono text-xs text-muted-foreground">
									{entry.entityType}
									{entry.entityId ? ` · ${entry.entityId}` : ""}
								</p>
								<p className="mt-2 truncate font-mono text-xs text-muted-foreground">
									IP {entry.ipAddress || "unknown"}
								</p>
							</div>
						</div>

						{/* Before / After diff */}
						<div className="flex flex-col gap-3 sm:flex-row">
							<JsonBlock label="Before" data={entry.before} tone="before" />
							<JsonBlock label="After" data={entry.after} tone="after" />
						</div>

						{/* Metadata + client info */}
						{entry.metadata && Object.keys(entry.metadata).length > 0 && (
							<div>
								<p className="mb-1 text-xs font-medium text-muted-foreground">
									Metadata
								</p>
								<pre className="max-h-40 overflow-auto rounded-md border bg-muted/40 p-2 font-mono text-[11px] leading-relaxed">
									{JSON.stringify(entry.metadata, null, 2)}
								</pre>
							</div>
						)}

						<div className="flex flex-col gap-1 rounded-md border p-3 text-xs text-muted-foreground">
							{entry.userAgent && (
								<p className="break-all">
									<span className="font-medium text-foreground">
										User agent:
									</span>{" "}
									{entry.userAgent}
								</p>
							)}
							<p className="break-all">
								<span className="font-medium text-foreground">Record ID:</span>{" "}
								<span className="font-mono">{entry.id}</span>
							</p>
						</div>

						<div className="flex justify-end">
							<Button
								variant="outline"
								size="sm"
								onClick={copyJson}
								className="h-8 cursor-pointer px-3 text-xs"
							>
								<ClipboardCopy className="size-3.5" /> Copy JSON
							</Button>
						</div>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
