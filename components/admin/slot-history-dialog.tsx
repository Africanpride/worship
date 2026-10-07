"use client";

import { format } from "date-fns";
import { History } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { trackLabel } from "@/lib/slots";

interface HistoryEntry {
	id: string;
	createdAt: string;
	previousUserId: string | null;
	newUserId: string | null;
	previousUserName?: string | null;
	newUserName?: string | null;
	reason?: string | null;
	changedBy: string;
}

interface HistoryResponse {
	slot: { track: string; startTime: string; endTime: string } | null;
	history: HistoryEntry[];
}

interface AuditHistoryEntry {
	id: string;
	createdAt: string;
	action: string;
	actorName: string;
	actorEmail: string;
	before?: Record<string, unknown> | null;
	after?: Record<string, unknown> | null;
	metadata?: Record<string, unknown> | null;
}

interface AuditEntityResponse {
	items: AuditHistoryEntry[];
}

function actionLabel(h: HistoryEntry): string {
	if (h.previousUserId && h.newUserId) return "Reassigned";
	if (h.newUserId) return "Assigned";
	return "Assignment cleared";
}

function auditActionLabel(e: AuditHistoryEntry): string {
	switch (e.action) {
		case "slot.block":
			return "Blocked the slot";
		case "slot.unblock":
			return "Unblocked the slot";
		case "slot.assign":
			return "Assigned the slot";
		case "slot.reassign":
			return "Reassigned the slot";
		case "slot.clear":
			return "Cleared the slot assignment";
		case "slot.batch_action": {
			const action =
				typeof e.metadata?.action === "string" ? e.metadata.action : "action";
			const count =
				typeof e.metadata?.count === "number" ? e.metadata.count : "";
			return `Batch ${action}${count ? ` (${count} slots)` : ""}`;
		}
		default:
			return e.action;
	}
}

async function fetcher<T>(url: string): Promise<T> {
	const res = await fetch(url);
	if (!res.ok) throw new Error("Failed to load history");
	return res.json();
}

export function SlotHistoryDialog({ slotId }: { slotId: string }) {
	const [open, setOpen] = useState(false);
	const { data, isLoading, error } = useSWR<HistoryResponse>(
		open ? `/api/admin/slots/${slotId}/history` : null,
		fetcher,
	);
	// Unified audit trail (blocks, unblocks, batch actions) alongside the
	// legacy assignment history above.
	const { data: auditData, isLoading: auditLoading } =
		useSWR<AuditEntityResponse>(
			open ? `/api/admin/audit/entity?type=slot&id=${slotId}` : null,
			fetcher,
		);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					variant="ghost"
					size="sm"
					className="h-7 cursor-pointer px-2 text-xs max-sm:h-9 max-sm:px-3"
				>
					<History className="size-3" /> History
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden">
				<DialogHeader className="border-b px-6 py-4 space-y-0.5">
					<DialogTitle className="text-sm font-medium">
						Slot audit trail
					</DialogTitle>
					<DialogDescription className="text-muted-foreground text-xs">
						{data?.slot
							? `${trackLabel(data.slot.track)} · ${format(
									new Date(data.slot.startTime),
									"EEE d MMM · HH:mm",
								)}–${format(new Date(data.slot.endTime), "HH:mm")} · newest first.`
							: "Every admin-driven change to this hour, newest first."}
					</DialogDescription>
				</DialogHeader>

				<div className="max-h-[60vh] overflow-y-auto px-6 py-4">
					{isLoading && (
						<p className="py-6 text-center text-muted-foreground text-sm">
							Loading history…
						</p>
					)}
					{error && (
						<p className="py-6 text-center text-destructive text-sm">
							Failed to load history.
						</p>
					)}
					{!isLoading && !error && (data?.history.length ?? 0) === 0 && (
						<p className="py-6 text-center text-muted-foreground text-sm">
							No recorded changes for this slot yet.
						</p>
					)}
					<ol className="space-y-3">
						{(data?.history ?? []).map((h, i, arr) => (
							<li key={h.id} className="relative pl-5">
								{i < arr.length - 1 && (
									<span
										aria-hidden
										className="absolute left-[5px] top-4 h-full w-px bg-border"
									/>
								)}
								<span
									aria-hidden
									className="absolute left-0 top-1.5 size-2.5 rounded-full border-2 border-background bg-primary"
								/>
								<div className="flex items-center gap-2">
									<span className="font-mono text-xs text-muted-foreground tabular-nums">
										{format(new Date(h.createdAt), "d MMM · HH:mm")}
									</span>
									<Badge variant="outline" className="text-[10px] px-1.5 py-0">
										{h.changedBy}
									</Badge>
								</div>
								<p className="mt-0.5 text-sm">
									{actionLabel(h)}
									{(h.previousUserName || h.newUserName) && (
										<span className="text-muted-foreground">
											{" · "}
											{h.previousUserName ?? "—"}
											<span className="mx-1">→</span>
											{h.newUserName ?? "—"}
										</span>
									)}
								</p>
								<p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
									{h.reason ?? "admin_override"}
								</p>
							</li>
						))}
					</ol>

					{/* Unified audit trail: blocks, unblocks, batch actions */}
					{auditLoading && open && (
						<p className="mt-4 border-t pt-4 text-center text-muted-foreground text-sm">
							Loading audit trail…
						</p>
					)}
					{!auditLoading && (auditData?.items.length ?? 0) > 0 && (
						<div className="mt-4 border-t pt-4">
							<p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
								Audit trail
							</p>
							<ol className="space-y-3">
								{(auditData?.items ?? []).map((e, i, arr) => (
									<li key={e.id} className="relative pl-5">
										{i < arr.length - 1 && (
											<span
												aria-hidden
												className="absolute left-[5px] top-4 h-full w-px bg-border"
											/>
										)}
										<span
											aria-hidden
											className="absolute left-0 top-1.5 size-2.5 rounded-full border-2 border-background bg-primary"
										/>
										<div className="flex items-center gap-2">
											<span className="font-mono text-xs text-muted-foreground tabular-nums">
												{format(new Date(e.createdAt), "d MMM · HH:mm")}
											</span>
											<Badge
												variant="outline"
												className="text-[10px] px-1.5 py-0"
											>
												{e.actorName}
											</Badge>
											<Badge
												variant="outline"
												className="bg-muted px-1.5 py-0 text-[10px] font-mono"
											>
												{e.action}
											</Badge>
										</div>
										<p className="mt-0.5 text-sm">
											{auditActionLabel(e)}
											{e.metadata && typeof e.metadata.reason === "string" && (
												<span className="text-muted-foreground">
													{" "}
													· {e.metadata.reason}
												</span>
											)}
										</p>
									</li>
								))}
							</ol>
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
