"use client";

import { format } from "date-fns";
import {
	ChevronDown,
	Download,
	RefreshCw,
	Search,
	ShieldCheck,
} from "lucide-react";
import { useMemo, useState } from "react";
import useSWR from "swr";
import {
	AuditDetailDialog,
	type AuditLogEntry,
} from "@/components/admin/audit-detail-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface AuditResponse {
	items: AuditLogEntry[];
	nextCursor: string | null;
	totalCount: number;
}

const ACTION_CATEGORIES = [
	{ value: "all", label: "All Actions" },
	{ value: "slot.*", label: "Slots" },
	{ value: "user.*", label: "Users" },
	{ value: "event.*", label: "Events" },
	{ value: "reflection.*", label: "Reflections" },
	{ value: "settings.*", label: "Settings" },
] as const;

const ACTION_TONE: Record<string, string> = {
	slot: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
	user: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
	event:
		"bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/30",
	reflection:
		"bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/30",
	settings:
		"bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30",
};

async function fetcher<T>(url: string): Promise<T> {
	const res = await fetch(url);
	if (!res.ok) throw new Error(`Audit request failed (${res.status})`);
	return res.json();
}

function actionTone(action: string): string {
	const prefix = action.split(".")[0];
	return ACTION_TONE[prefix] ?? "bg-muted text-muted-foreground border-border";
}

function summaryOf(entry: AuditLogEntry): string {
	const changed = diffKeys(entry.before, entry.after);
	if (changed.length === 0) return entry.entityLabel || entry.entityType;
	return changed
		.map((key) => {
			const b = entry.before?.[key];
			const a = entry.after?.[key];
			return `${key}: ${fmtValue(b)} → ${fmtValue(a)}`;
		})
		.join(" · ");
}

function diffKeys(
	before?: Record<string, unknown> | null,
	after?: Record<string, unknown> | null,
): string[] {
	const keys = new Set([
		...Object.keys(before ?? {}),
		...Object.keys(after ?? {}),
	]);
	return [...keys].filter(
		(key) =>
			JSON.stringify(before?.[key] ?? null) !==
			JSON.stringify(after?.[key] ?? null),
	);
}

function fmtValue(value: unknown): string {
	if (value === null || value === undefined) return "—";
	if (typeof value === "string") return value;
	return JSON.stringify(value);
}

export function AuditLogConsole() {
	const [search, setSearch] = useState("");
	const [actionFilter, setActionFilter] = useState("all");
	const [actorFilter, setActorFilter] = useState("all");
	const [fromDate, setFromDate] = useState("");
	const [toDate, setToDate] = useState("");
	const [cursor, setCursor] = useState<string | null>(null);
	const [extraEntries, setExtraEntries] = useState<AuditLogEntry[]>([]);
	const [loadingMore, setLoadingMore] = useState(false);
	const [inspected, setInspected] = useState<AuditLogEntry | null>(null);
	const [inspectorOpen, setInspectorOpen] = useState(false);

	const apiUrl = useMemo(() => {
		const params = new URLSearchParams();
		if (search.trim()) params.set("q", search.trim());
		if (actionFilter !== "all") params.set("action", actionFilter);
		if (actorFilter !== "all") params.set("actorId", actorFilter);
		if (fromDate) params.set("from", new Date(fromDate).toISOString());
		if (toDate) params.set("to", new Date(toDate).toISOString());
		const query = params.toString();
		return `/api/admin/audit${query ? `?${query}` : ""}`;
	}, [search, actionFilter, actorFilter, fromDate, toDate]);

	const { data, error, isLoading, mutate } = useSWR<AuditResponse>(
		apiUrl,
		fetcher,
		{ refreshInterval: 30_000 },
	);

	const items = data?.items ?? [];
	const visible = cursor ? [...items, ...extraEntries] : items;

	// Distinct actors seen on the current page power the actor dropdown.
	const actors = useMemo(() => {
		const map = new Map<string, { id: string; name: string }>();
		for (const item of items) {
			if (!map.has(item.actorId)) {
				map.set(item.actorId, { id: item.actorId, name: item.actorName });
			}
		}
		return [...map.values()];
	}, [items]);

	const todayCount = useMemo(() => {
		const startOfDay = new Date();
		startOfDay.setHours(0, 0, 0, 0);
		return visible.filter((e) => new Date(e.createdAt) >= startOfDay).length;
	}, [visible]);

	const activeAdmins = useMemo(
		() => new Set(visible.map((e) => e.actorId)).size,
		[visible],
	);

	const loadMore = async () => {
		if (!cursor || loadingMore) return;
		setLoadingMore(true);
		try {
			const url = new URL(apiUrl, window.location.origin);
			url.searchParams.set("cursor", cursor);
			const more = await fetcher<AuditResponse>(url.toString());
			setExtraEntries((prev) => [...prev, ...more.items]);
			setCursor(more.nextCursor);
		} catch {
			// Non-blocking: the console keeps showing what it already has.
		} finally {
			setLoadingMore(false);
		}
	};

	function exportLogs() {
		const blob = new Blob([JSON.stringify(visible, null, 2)], {
			type: "application/json",
		});
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `audit-logs-${format(new Date(), "yyyy-MM-dd-HHmmss")}.json`;
		link.click();
		URL.revokeObjectURL(url);
	}

	function inspect(entry: AuditLogEntry) {
		setInspected(entry);
		setInspectorOpen(true);
	}

	return (
		<div className="overflow-hidden rounded-lg border bg-card">
			{/* Header & stats */}
			<div className="border-b px-4 py-3">
				<div className="flex items-center justify-between gap-2">
					<div className="flex items-center gap-2">
						<ShieldCheck className="size-4 text-muted-foreground" />
						<div>
							<h2 className="text-sm font-medium">Audit Trail</h2>
							<p className="mt-0.5 text-xs text-muted-foreground">
								{data?.totalCount ?? visible.length} total logs · {todayCount}{" "}
								actions today · {activeAdmins} active admins
							</p>
						</div>
					</div>
					<div className="flex gap-1">
						<Button
							variant="outline"
							size="sm"
							onClick={() => {
								setCursor(null);
								setExtraEntries([]);
								mutate();
							}}
							className="h-7 cursor-pointer px-2 text-xs"
						>
							<RefreshCw className="size-3" /> Refresh
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={exportLogs}
							className="h-7 cursor-pointer px-2 text-xs"
						>
							<Download className="size-3" /> Export
						</Button>
					</div>
				</div>
			</div>

			{/* Filter bar */}
			<div className="flex flex-wrap items-center gap-2 border-b px-4 py-2">
				<div className="relative min-w-40 flex-1">
					<Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
					<Input
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Search actor, entity, action..."
						className="h-8 border-0 bg-transparent pl-8 text-xs shadow-none focus-visible:ring-0"
					/>
				</div>
				<Select value={actionFilter} onValueChange={setActionFilter}>
					<SelectTrigger className="h-8 w-auto cursor-pointer text-xs">
						<SelectValue placeholder="Action" />
					</SelectTrigger>
					<SelectContent>
						{ACTION_CATEGORIES.map((cat) => (
							<SelectItem key={cat.value} value={cat.value}>
								{cat.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<Select value={actorFilter} onValueChange={setActorFilter}>
					<SelectTrigger className="h-8 w-auto cursor-pointer text-xs">
						<SelectValue placeholder="Admin" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Admins</SelectItem>
						{actors.map((actor) => (
							<SelectItem key={actor.id} value={actor.id}>
								{actor.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<Input
					type="date"
					value={fromDate}
					onChange={(e) => setFromDate(e.target.value)}
					className="h-8 w-auto cursor-pointer text-xs"
				/>
				<Input
					type="date"
					value={toDate}
					onChange={(e) => setToDate(e.target.value)}
					className="h-8 w-auto cursor-pointer text-xs"
				/>
			</div>

			{/* Entries */}
			<div>
				{isLoading && (
					<p className="px-4 py-10 text-center text-sm text-muted-foreground">
						Loading audit trail…
					</p>
				)}
				{error && (
					<p className="px-4 py-10 text-center text-sm text-destructive">
						Failed to load audit trail.
					</p>
				)}
				{!isLoading && !error && visible.length === 0 && (
					<p className="px-4 py-10 text-center text-sm text-muted-foreground">
						No audit entries match this view.
					</p>
				)}
				{visible.length > 0 && (
					<>
						{/* Desktop table */}
						<table className="hidden w-full border-collapse text-sm max-md:hidden">
							<thead>
								<tr className="border-b text-left text-xs text-muted-foreground">
									<th className="px-4 py-2 font-medium">Timestamp</th>
									<th className="px-4 py-2 font-medium">Admin</th>
									<th className="px-4 py-2 font-medium">Action</th>
									<th className="px-4 py-2 font-medium">Target</th>
									<th className="px-4 py-2 font-medium">Summary</th>
									<th className="px-4 py-2 font-medium" />
								</tr>
							</thead>
							<tbody>
								{visible.map((entry) => (
									<tr
										key={entry.id}
										className="border-b transition-colors last:border-b-0 hover:bg-muted/50"
									>
										<td className="px-4 py-2 font-mono text-xs tabular-nums text-muted-foreground">
											{format(new Date(entry.createdAt), "d MMM yyyy · HH:mm")}
										</td>
										<td className="px-4 py-2">
											<p className="truncate text-xs font-medium">
												{entry.actorName}
											</p>
											<p className="truncate text-[11px] text-muted-foreground">
												{entry.actorEmail}
											</p>
										</td>
										<td className="px-4 py-2">
											<Badge
												variant="outline"
												className={cn(
													"text-[10px] px-1.5 py-0",
													actionTone(entry.action),
												)}
											>
												{entry.action}
											</Badge>
										</td>
										<td className="max-w-40 px-4 py-2">
											<p className="truncate text-xs">
												{entry.entityLabel || "—"}
											</p>
											<p className="truncate text-[11px] text-muted-foreground">
												{entry.entityType}
											</p>
										</td>
										<td className="max-w-64 px-4 py-2">
											<p className="truncate font-mono text-[11px] text-muted-foreground">
												{summaryOf(entry)}
											</p>
										</td>
										<td className="px-4 py-2 text-right">
											<Button
												variant="ghost"
												size="sm"
												onClick={() => inspect(entry)}
												className="h-7 cursor-pointer px-2 text-xs"
											>
												Inspect
											</Button>
										</td>
									</tr>
								))}
							</tbody>
						</table>

						{/* Mobile cards (< 768px) */}
						<div className="hidden max-md:block">
							{visible.map((entry) => (
								<MobileAuditCard
									key={entry.id}
									entry={entry}
									onInspect={inspect}
								/>
							))}
						</div>
					</>
				)}
				{cursor && (
					<div className="p-3 text-center">
						<Button
							variant="ghost"
							size="sm"
							disabled={loadingMore}
							onClick={loadMore}
							className="cursor-pointer text-xs text-muted-foreground"
						>
							{loadingMore ? "Loading…" : "Load older entries"}
						</Button>
					</div>
				)}
			</div>

			<AuditDetailDialog
				entry={inspected}
				open={inspectorOpen}
				onOpenChange={setInspectorOpen}
			/>
		</div>
	);
}

function MobileAuditCard({
	entry,
	onInspect,
}: {
	entry: AuditLogEntry;
	onInspect: (entry: AuditLogEntry) => void;
}) {
	const [expanded, setExpanded] = useState(false);
	const changed = diffKeys(entry.before, entry.after);

	return (
		<div className="border-b px-4 py-3 last:border-b-0">
			<button
				type="button"
				onClick={() => setExpanded((prev) => !prev)}
				className="flex w-full cursor-pointer items-start gap-2 text-left"
			>
				<div className="min-w-0 flex-1">
					<div className="flex flex-wrap items-center gap-1.5">
						<span className="text-xs font-medium">{entry.actorName}</span>
						<Badge
							variant="outline"
							className={cn(
								"text-[10px] px-1.5 py-0",
								actionTone(entry.action),
							)}
						>
							{entry.action}
						</Badge>
					</div>
					<p className="mt-0.5 truncate text-xs text-muted-foreground">
						{entry.entityLabel || entry.entityType}
					</p>
					<p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
						{format(new Date(entry.createdAt), "d MMM yyyy · HH:mm")}
					</p>
				</div>
				<ChevronDown
					className={cn(
						"size-4 shrink-0 text-muted-foreground transition-transform",
						expanded && "rotate-180",
					)}
				/>
			</button>
			{expanded && (
				<div className="mt-2 space-y-2">
					{changed.length > 0 ? (
						<div className="rounded-md border bg-muted/40 p-2 font-mono text-[11px] leading-relaxed">
							{changed.map((key) => (
								<p key={key}>
									{key}:{" "}
									<span className="text-red-600 dark:text-red-400">
										{fmtValue(entry.before?.[key])}
									</span>{" "}
									→{" "}
									<span className="text-emerald-600 dark:text-emerald-400">
										{fmtValue(entry.after?.[key])}
									</span>
								</p>
							))}
						</div>
					) : (
						<p className="text-xs text-muted-foreground">No field changes.</p>
					)}
					<p className="font-mono text-[11px] text-muted-foreground">
						IP {entry.ipAddress || "unknown"} · {entry.actorEmail}
					</p>
					<Button
						variant="outline"
						size="sm"
						onClick={() => onInspect(entry)}
						className="h-7 w-full cursor-pointer px-2 text-xs"
					>
						Inspect entry
					</Button>
				</div>
			)}
		</div>
	);
}
