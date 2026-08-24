"use client";

import { format } from "date-fns";
import {
	ClipboardCopy,
	Ellipsis,
	Eraser,
	Search,
	Terminal,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface AppLogEntry {
	id: string;
	ts: string;
	level: "error" | "warn" | "info" | "debug";
	source: string;
	message: string;
	detail?: string | null;
	requestId?: string | null;
	userId?: string | null;
	meta?: Record<string, unknown> | null;
}

interface LogsResponse {
	logs: AppLogEntry[];
	nextCursor: string | null;
}

const LEVELS = ["all", "error", "warn", "info", "debug"] as const;
type LevelFilter = (typeof LEVELS)[number];

const DOT_BG: Record<AppLogEntry["level"], string> = {
	error: "bg-red-500",
	warn: "bg-amber-500",
	info: "bg-blue-500",
	debug: "bg-muted-foreground/40",
};

async function fetcher<T>(url: string): Promise<T> {
	const res = await fetch(url);
	if (!res.ok) {
		throw new Error(`Logs request failed (${res.status})`);
	}
	return res.json();
}

export function LogsConsole() {
	const [levelFilter, setLevelFilter] = useState<LevelFilter>("all");
	const [search, setSearch] = useState("");
	const [entries, setEntries] = useState<AppLogEntry[]>([]);
	const [nextCursor, setNextCursor] = useState<string | null>(null);
	const [clearing, setClearing] = useState(false);

	const apiUrl = useMemo(() => {
		const params = new URLSearchParams();
		if (levelFilter !== "all") params.set("level", levelFilter);
		if (search.trim()) params.set("q", search.trim());
		params.set("cursor", "");
		const query = params.toString();
		return `/api/admin/logs${query ? `?${query}` : ""}`;
	}, [levelFilter, search]);

	const { data, error, isLoading, mutate } = useSWR<LogsResponse>(
		apiUrl,
		fetcher,
		{ refreshInterval: 15_000 },
	);

	// SWR owns the first page; keep a local accumulator only for pagination.
	const pages = data?.logs ?? [];
	const visible = nextCursor ? [...pages, ...entries] : pages;

	const loadMore = async () => {
		if (!nextCursor) return;
		try {
			const url = `${apiUrl.split("&cursor=")[0]}&cursor=${nextCursor}`;
			const more = await fetcher<LogsResponse>(url);
			setEntries((prev) => [...prev, ...(more.logs ?? [])]);
			setNextCursor(more.nextCursor);
		} catch {
			toast.error("Failed to load more logs");
		}
	};

	async function clearDebug() {
		setClearing(true);
		try {
			const res = await fetch("/api/admin/logs/debug", { method: "DELETE" });
			const json = await res.json().catch(() => ({}));
			if (!res.ok) throw new Error(json?.error ?? "Clear failed");
			toast.success(`Cleared ${json.deleted ?? 0} debug entries`);
			setEntries([]);
			await mutate();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : String(err));
		} finally {
			setClearing(false);
		}
	}

	function exportLogs() {
		const params = new URLSearchParams({ format: "json" });
		if (levelFilter !== "all") params.set("level", levelFilter);
		if (search.trim()) params.set("q", search.trim());
		window.location.href = `/api/admin/logs/export?${params.toString()}`;
	}

	async function copyJson(entry: AppLogEntry) {
		try {
			await navigator.clipboard.writeText(JSON.stringify(entry, null, 2));
			toast.success("Log entry copied");
		} catch {
			toast.error("Clipboard unavailable");
		}
	}

	const errorCount = visible.filter((l) => l.level === "error").length;

	return (
		<div className="overflow-hidden rounded-lg border bg-card">
			{/* Header */}
			<div className="border-b px-4 py-3">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Terminal className="size-4 text-muted-foreground" />
						<div>
							<h2 className="text-sm font-medium">Application Logs</h2>
							<p className="mt-0.5 text-xs text-muted-foreground">
								{visible.length} entries · {errorCount} errors
							</p>
						</div>
					</div>
					<div className="flex gap-1">
						<Button
							variant="outline"
							size="sm"
							disabled={clearing}
							onClick={clearDebug}
							className="h-7 cursor-pointer px-2 text-xs"
						>
							<Eraser className="size-3" /> Clear Debug
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={exportLogs}
							className="h-7 cursor-pointer px-2 text-xs"
						>
							Export
						</Button>
					</div>
				</div>
			</div>

			{/* Filters */}
			<div className="flex items-center gap-2 border-b px-4 py-2">
				<div className="relative flex-1">
					<Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
					<Input
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Search logs..."
						className="h-8 border-0 bg-transparent pl-8 text-xs shadow-none focus-visible:ring-0"
					/>
				</div>
				<div className="flex gap-1">
					{LEVELS.map((lvl) => (
						<button
							key={lvl}
							type="button"
							onClick={() => setLevelFilter(lvl)}
							className={cn(
								"cursor-pointer rounded-md px-2.5 py-1 text-xs font-medium capitalize transition-colors",
								levelFilter === lvl
									? "bg-foreground text-background"
									: "text-muted-foreground hover:text-foreground",
							)}
						>
							{lvl === "all" ? "All" : lvl}
						</button>
					))}
				</div>
			</div>

			{/* Entries */}
			<div>
				{isLoading && (
					<p className="px-4 py-10 text-center text-muted-foreground text-sm">
						Loading logs…
					</p>
				)}
				{error && (
					<p className="px-4 py-10 text-center text-destructive text-sm">
						Failed to load logs.
					</p>
				)}
				{!isLoading && !error && visible.length === 0 && (
					<p className="px-4 py-10 text-center text-muted-foreground text-sm">
						No log entries match this view.
					</p>
				)}
				{visible.map((entry) => (
					<LogRow key={entry.id} entry={entry} onCopy={copyJson} />
				))}
				{nextCursor && (
					<div className="p-3 text-center">
						<Button
							variant="ghost"
							size="sm"
							onClick={loadMore}
							className="cursor-pointer text-xs text-muted-foreground"
						>
							Load older entries
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}

function LogRow({
	entry,
	onCopy,
}: {
	entry: AppLogEntry;
	onCopy: (e: AppLogEntry) => void;
}) {
	const tsLabel = format(new Date(entry.ts), "HH:mm:ss.SSS");

	return (
		<div className="border-b px-4 py-3 transition-colors last:border-b-0 hover:bg-muted/50">
			<div className="flex items-start gap-3">
				<span
					aria-hidden
					className={cn(
						"mt-1.5 size-1.5 shrink-0 rounded-full",
						DOT_BG[entry.level],
					)}
				/>
				<div className="min-w-0 flex-1">
					<div className="flex items-center gap-2">
						<span className="font-mono text-xs text-muted-foreground tabular-nums">
							{tsLabel}
						</span>
						<Badge
							variant="outline"
							className="text-[10px] uppercase px-1.5 py-0"
						>
							{entry.level}
						</Badge>
						<span className="font-mono text-xs text-muted-foreground">
							{entry.source}
						</span>
					</div>
					<p className="mt-0.5 truncate text-sm font-medium">{entry.message}</p>
					{entry.detail && (
						<p className="mt-0.5 line-clamp-1 font-mono text-xs text-muted-foreground">
							{entry.detail}
						</p>
					)}
					{entry.requestId && (
						<div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
							<span className="font-mono">{entry.requestId}</span>
						</div>
					)}
				</div>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="size-7 shrink-0 cursor-pointer"
							aria-label="Log entry actions"
						>
							<Ellipsis className="size-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem
							onClick={() => onCopy(entry)}
							className="cursor-pointer text-xs"
						>
							<ClipboardCopy className="size-3.5" /> Copy JSON
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
}
