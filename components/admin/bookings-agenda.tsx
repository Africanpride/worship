"use client";

import { format } from "date-fns";
import {
	Ban,
	CalendarDays,
	Clock,
	Hourglass,
	MapPin,
	PencilLine,
	Search,
	Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";
import { ExportBookingsDialog } from "@/components/admin/export-bookings-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface AgendaSlot {
	id: string;
	eventId: string;
	startTime: string;
	endTime: string;
	status: string;
	track?: "worship" | "bible-reading";
	assignedUser?: {
		id: string;
		name: string;
		email: string;
		image: string | null;
		profile?: { displayName?: string | null } | null;
	} | null;
	event: {
		id: string;
		title: string;
		location: string | null;
		startDate: string;
		endDate: string;
		bookingOpen: boolean;
	};
}

interface EventSummary {
	id: string;
	title: string;
	startDate: string;
	endDate: string;
	bookingOpen: boolean;
	location: string | null;
	_count?: { slots: number };
}

interface AgendaResponse {
	timeframe: string;
	eventId: string;
	generatedAt: string;
	slots: AgendaSlot[];
	events: EventSummary[];
}

interface AdminUser {
	id: string;
	name: string;
	email: string;
	image?: string | null;
	profile?: { displayName?: string | null } | null;
}

const TONES = ["indigo", "teal", "amber", "rose", "violet"] as const;
type Tone = (typeof TONES)[number];

const TONE_BG: Record<Tone, string> = {
	indigo: "bg-indigo-500",
	teal: "bg-teal-500",
	amber: "bg-amber-500",
	rose: "bg-rose-500",
	violet: "bg-violet-500",
};

function toneForEvent(eventId: string): Tone {
	let hash = 0;
	for (let i = 0; i < eventId.length; i++) {
		hash = (hash * 31 + eventId.charCodeAt(i)) >>> 0;
	}
	return TONES[hash % TONES.length];
}

type RowItem =
	| { kind: "slot"; slot: AgendaSlot }
	| {
			kind: "gap";
			key: string;
			from: Date;
			to: Date;
			count: number;
			slotIds: string[];
	  };

function buildDayRows(slots: AgendaSlot[], statusFilter: string): RowItem[] {
	// If filtering specifically by booked or blocked, or when showing all slots individually
	if (statusFilter === "booked" || statusFilter === "blocked") {
		return slots.map((slot) => ({ kind: "slot", slot }));
	}

	const sorted = [...slots].sort(
		(a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
	);

	const rows: RowItem[] = [];
	let gapStart: Date | null = null;
	let gapEnd: Date | null = null;
	let gapCount = 0;
	let gapSlotIds: string[] = [];

	const flushGap = () => {
		if (gapStart && gapEnd && gapCount > 0) {
			// For single isolated open slots, display as a regular slot row for faster access
			if (gapCount === 1) {
				const singleSlot = sorted.find(
					(s) => new Date(s.startTime).getTime() === gapStart?.getTime(),
				);
				if (singleSlot) {
					rows.push({ kind: "slot", slot: singleSlot });
				}
			} else {
				rows.push({
					kind: "gap",
					key: `${gapStart.toISOString()}_${gapEnd.toISOString()}`,
					from: gapStart,
					to: gapEnd,
					count: gapCount,
					slotIds: gapSlotIds,
				});
			}
		}
		gapStart = null;
		gapEnd = null;
		gapCount = 0;
		gapSlotIds = [];
	};

	// A slot is only meaningfully "open" (bookable inventory) if its hour is
	// in the future AND its event hasn't ended. Everything else — past hours,
	// hours of ended events — is history and must never render as Open.
	for (const slot of sorted) {
		const start = new Date(slot.startTime);
		const end = new Date(slot.endTime);
		const bookable =
			slot.status === "open" &&
			start.getTime() > Date.now() &&
			new Date(slot.event.endDate).getTime() > Date.now();
		if (bookable) {
			if (gapStart && gapEnd && start.getTime() === gapEnd.getTime()) {
				gapEnd = end;
				gapCount += 1;
				gapSlotIds.push(slot.id);
			} else {
				flushGap();
				gapStart = start;
				gapEnd = end;
				gapCount = 1;
				gapSlotIds = [slot.id];
			}
			continue;
		}
		flushGap();
		rows.push({ kind: "slot", slot });
	}
	flushGap();
	return rows;
}

async function fetcher<T>(url: string): Promise<T> {
	const res = await fetch(url);
	if (!res.ok) throw new Error("Request failed");
	return res.json();
}

function slotTemporalState(slot: AgendaSlot): "past" | "ongoing" | "upcoming" {
	const now = Date.now();
	const start = new Date(slot.startTime).getTime();
	const end = new Date(slot.endTime).getTime();
	if (now >= end) return "past";
	if (now >= start) return "ongoing";
	return "upcoming";
}

function eventTemporalState(ev: EventSummary): "past" | "ongoing" | "upcoming" {
	const now = Date.now();
	const start = new Date(ev.startDate).getTime();
	const end = new Date(ev.endDate).getTime();
	if (now >= end) return "past";
	if (now >= start) return "ongoing";
	return "upcoming";
}

export function BookingsAgenda({
	initialTrack,
}: {
	/** Preset from the page URL (e.g. ?track=bible-reading). */
	initialTrack?: "worship" | "bible-reading" | "all";
}) {
	const [targetSlot, setTargetSlot] = useState<AgendaSlot | null>(null);
	const [expandedGaps, setExpandedGaps] = useState<Set<string>>(new Set());
	const [selectedEventId, setSelectedEventId] = useState<string>("all");
	const [trackFilter, setTrackFilter] = useState<string>(initialTrack ?? "all");
	const [timeframe, setTimeframe] = useState<string>("all");
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [hidePastEvents, setHidePastEvents] = useState(true);
	const [isPerformingAction, setIsPerformingAction] = useState(false);

	useEffect(() => {
		// Re-sync when the preset changes via sidebar navigation.
		setTrackFilter(initialTrack ?? "all");
	}, [initialTrack]);

	const apiUrl = useMemo(() => {
		const params = new URLSearchParams();
		if (selectedEventId && selectedEventId !== "all") {
			params.set("eventId", selectedEventId);
		}
		if (timeframe && timeframe !== "all") {
			params.set("timeframe", timeframe);
		}
		if (statusFilter && statusFilter !== "all") {
			params.set("status", statusFilter);
		}
		if (trackFilter && trackFilter !== "all") {
			params.set("track", trackFilter);
		}
		const query = params.toString();
		return `/api/admin/slots/agenda${query ? `?${query}` : ""}`;
	}, [selectedEventId, timeframe, statusFilter, trackFilter]);

	const { data, error, isLoading, mutate } = useSWR<AgendaResponse>(
		apiUrl,
		fetcher,
		{ refreshInterval: 60_000 },
	);

	async function runAction(url: string, init: RequestInit, okMsg: string) {
		setIsPerformingAction(true);
		try {
			const res = await fetch(url, init);
			const json = await res.json().catch(() => ({}));
			if (!res.ok) throw new Error(json?.error ?? "Action failed");
			toast.success(okMsg);
			setExpandedGaps(new Set());
			await mutate();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : String(err));
		} finally {
			setIsPerformingAction(false);
		}
	}

	async function runBatchAction(
		slotIds: string[],
		action: "block" | "unblock",
		okMsg: string,
	) {
		if (slotIds.length === 0) return;
		setIsPerformingAction(true);
		try {
			const res = await fetch("/api/admin/slots/batch", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ slotIds, action }),
			});
			const json = await res.json().catch(() => ({}));
			if (!res.ok) throw new Error(json?.error ?? "Batch action failed");
			const changed =
				typeof json.count === "number" ? json.count : slotIds.length;
			if (changed < slotIds.length) {
				toast.warning(
					`${changed} of ${slotIds.length} slots updated — the rest changed state elsewhere. Refreshed.`,
				);
			} else {
				toast.success(`${okMsg} (${changed} slots)`);
			}
			// Collapse state keys reference old groupings — reset so refreshed
			// open runs don't render under stale expansions.
			setExpandedGaps(new Set());
			await mutate();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : String(err));
		} finally {
			setIsPerformingAction(false);
		}
	}

	function toggleGap(key: string) {
		setExpandedGaps((prev) => {
			const next = new Set(prev);
			if (next.has(key)) next.delete(key);
			else next.add(key);
			return next;
		});
	}

	// Filter slots by search query (booker name, email, event title)
	// "Hide past events" only applies while viewing All Events; a specific
	// event selection always shows its full history.
	const hidePast = hidePastEvents && selectedEventId === "all";

	// Drop slots of ended events from the working set when the filter is on.
	const visibleSlots = useMemo(() => {
		const slots = data?.slots ?? [];
		if (!hidePast) return slots;
		const now = Date.now();
		return slots.filter((slot) => new Date(slot.event.endDate).getTime() > now);
	}, [data?.slots, hidePast]);

	const filteredSlots = useMemo(() => {
		const slots = visibleSlots;
		const q = searchQuery.trim().toLowerCase();
		if (!q) return slots;

		return slots.filter((slot) => {
			const bookerName =
				slot.assignedUser?.profile?.displayName ||
				slot.assignedUser?.name ||
				"";
			const bookerEmail = slot.assignedUser?.email || "";
			const eventTitle = slot.event?.title || "";
			const timeLabel = `${format(new Date(slot.startTime), "HH:mm")} ${format(new Date(slot.endTime), "HH:mm")}`;

			return (
				bookerName.toLowerCase().includes(q) ||
				bookerEmail.toLowerCase().includes(q) ||
				eventTitle.toLowerCase().includes(q) ||
				timeLabel.includes(q)
			);
		});
	}, [visibleSlots, searchQuery]);

	// Group slots by day
	const days = useMemo(() => {
		const map = new Map<string, AgendaSlot[]>();
		for (const slot of filteredSlots) {
			const key = format(new Date(slot.startTime), "yyyy-MM-dd");
			const list = map.get(key) ?? [];
			list.push(slot);
			map.set(key, list);
		}
		return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
	}, [filteredSlots]);

	const metrics = useMemo(() => {
		const now = Date.now();
		const all = visibleSlots;
		const bookable = (s: AgendaSlot) =>
			new Date(s.startTime).getTime() > now &&
			new Date(s.event.endDate).getTime() > now;
		const booked = all.filter((s) => s.status === "booked").length;
		const blocked = all.filter((s) => s.status === "blocked").length;
		const open = all.filter((s) => s.status === "open" && bookable(s)).length;
		return { total: all.length, booked, blocked, open };
	}, [visibleSlots]);

	return (
		<div className="rounded-xl border bg-card shadow-sm">
			{/* Top Header with title & stats */}
			<div className="border-b px-5 py-4">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
					<div>
						<div className="flex items-center gap-2">
							<CalendarDays className="size-4 text-primary" />
							<h2 className="text-lg">Worship Agenda & Slot Management</h2>
						</div>
						<p className="mt-1 text-muted-foreground text-xs">
							Manage worship slots, reassign booked hours, and block out hours
							across events.
						</p>
					</div>

					<div className="flex flex-wrap items-center gap-2 text-xs">
						<Badge
							variant="outline"
							className="gap-1 border-primary/30 text-primary"
						>
							<span className="font-bold">{metrics.booked}</span> Booked
						</Badge>
						<Badge variant="secondary" className="gap-1">
							<span className="font-bold">{metrics.blocked}</span> Blocked
						</Badge>
						<Badge variant="outline" className="gap-1 text-muted-foreground">
							<span className="font-bold">{metrics.open}</span> Open
						</Badge>
						{selectedEventId === "all" && (
							<label className="ml-1 flex cursor-pointer items-center gap-1.5 text-muted-foreground select-none">
								<Checkbox
									checked={hidePastEvents}
									onCheckedChange={(v) => setHidePastEvents(v === true)}
									className="size-3.5 cursor-pointer"
									aria-label="Hide past events"
								/>
								Hide past events
							</label>
						)}
						<ExportBookingsDialog
							filters={{
								eventId: selectedEventId,
								timeframe,
								statusFilter,
								track: trackFilter,
								hidePastEvents,
								searchQuery,
							}}
						/>
					</div>
				</div>

				{/* Filter & Control Bar */}
				<div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-3 border-t border-border/50">
					{/* Event Selector */}
					<div className="space-y-1">
						<span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
							Event
						</span>
						<Select
							value={selectedEventId}
							onValueChange={(val) => {
								setSelectedEventId(val);
								setExpandedGaps(new Set());
							}}
						>
							<SelectTrigger className="w-full h-8 text-xs cursor-pointer">
								<SelectValue placeholder="All Events" />
							</SelectTrigger>
							<SelectContent className="max-w-sm">
								<SelectItem
									value="all"
									className="cursor-pointer text-xs font-medium"
								>
									All Events
								</SelectItem>
								{(data?.events ?? [])
									.filter(
										(ev) => !hidePast || eventTemporalState(ev) !== "past",
									)
									.map((ev) => (
										<SelectItem
											key={ev.id}
											value={ev.id}
											className="cursor-pointer text-xs"
										>
											<span className="flex min-w-0 items-center gap-2">
												{eventTemporalState(ev) === "ongoing" ? (
													<span className="relative flex size-2.5 shrink-0">
														<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
														<span className="relative inline-flex size-2.5 rounded-full bg-purple-500" />
													</span>
												) : (
													<span
														aria-hidden
														className={cn(
															"size-2 shrink-0 rounded-full",
															eventTemporalState(ev) === "past"
																? "bg-zinc-400 dark:bg-zinc-600"
																: TONE_BG[toneForEvent(ev.id)],
														)}
													/>
												)}
												<span className="truncate">{ev.title}</span>
												<span className="shrink-0 font-mono text-[10px] tabular-nums text-muted-foreground">
													{format(new Date(ev.startDate), "d MMM")} –{" "}
													{format(new Date(ev.endDate), "d MMM yyyy")} ·{" "}
													{ev._count?.slots ?? 0} slots
												</span>
											</span>
										</SelectItem>
									))}
							</SelectContent>
						</Select>
					</div>

					{/* Timeframe Selector */}
					<div className="space-y-1">
						<span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
							Timeframe
						</span>
						<Select
							value={timeframe}
							onValueChange={(val) => {
								setTimeframe(val);
								setExpandedGaps(new Set());
							}}
						>
							<SelectTrigger className="w-full h-8 text-xs cursor-pointer">
								<SelectValue placeholder="All Dates" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all" className="cursor-pointer text-xs">
									All Event Dates
								</SelectItem>
								<SelectItem value="7d" className="cursor-pointer text-xs">
									Next 7 Days
								</SelectItem>
								<SelectItem value="14d" className="cursor-pointer text-xs">
									Next 14 Days
								</SelectItem>
								<SelectItem value="30d" className="cursor-pointer text-xs">
									Next 30 Days
								</SelectItem>
								<SelectItem value="90d" className="cursor-pointer text-xs">
									Next 90 Days
								</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Track Selector */}
					<div className="space-y-1">
						<span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
							Track
						</span>
						<Select
							value={trackFilter}
							onValueChange={(val) => {
								setTrackFilter(val);
								setExpandedGaps(new Set());
							}}
						>
							<SelectTrigger className="w-full h-8 text-xs cursor-pointer">
								<SelectValue placeholder="All Tracks" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all" className="cursor-pointer text-xs">
									All Tracks
								</SelectItem>
								<SelectItem value="worship" className="cursor-pointer text-xs">
									Worship
								</SelectItem>
								<SelectItem
									value="bible-reading"
									className="cursor-pointer text-xs"
								>
									Bible Reading
								</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Status Selector */}
					<div className="space-y-1">
						<span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
							Status
						</span>
						<Select
							value={statusFilter}
							onValueChange={(val) => {
								setStatusFilter(val);
								setExpandedGaps(new Set());
							}}
						>
							<SelectTrigger className="w-full h-8 text-xs cursor-pointer">
								<SelectValue placeholder="All Statuses" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all" className="cursor-pointer text-xs">
									All Slots ({metrics.total})
								</SelectItem>
								<SelectItem value="booked" className="cursor-pointer text-xs">
									Booked ({metrics.booked})
								</SelectItem>
								<SelectItem value="blocked" className="cursor-pointer text-xs">
									Blocked ({metrics.blocked})
								</SelectItem>
								<SelectItem value="open" className="cursor-pointer text-xs">
									Open ({metrics.open})
								</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				{/* Search Bar */}
				<div className="mt-3 relative">
					<Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
					<Input
						placeholder="Filter by singer name, email, time, or event…"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="h-8 pl-8 text-xs bg-background/50"
					/>
				</div>
			</div>

			{/* Slot Agenda Content */}
			<div className="p-4 sm:p-5">
				{isLoading && (
					<div className="py-12 text-center text-muted-foreground text-sm space-y-2">
						<Hourglass className="size-6 animate-spin mx-auto text-primary" />
						<p>Loading worship agenda & slots…</p>
					</div>
				)}

				{error && (
					<div className="py-8 text-center text-destructive text-sm space-y-1">
						<p className="font-medium">Failed to load the agenda.</p>
						<p className="text-xs text-muted-foreground">
							Please refresh or check your admin connection.
						</p>
					</div>
				)}

				{!isLoading && !error && days.length === 0 && (
					<div className="py-12 text-center text-muted-foreground text-sm space-y-2">
						<CalendarDays className="size-8 mx-auto text-muted-foreground/40" />
						<p className="font-medium text-foreground">
							No slots found for this filter.
						</p>
						<p className="text-xs max-w-sm mx-auto">
							{searchQuery
								? `No slots match "${searchQuery}". Try a different search.`
								: "No slots match the current event or timeframe. You can select 'All Events' or generate slots in Event Management."}
						</p>
					</div>
				)}

				{days.map(([dayKey, daySlots]) => {
					const rows = buildDayRows(daySlots, statusFilter);
					if (rows.length === 0) return null;

					const date = new Date(dayKey);
					const label = format(date, "EEEE, d MMMM yyyy");
					const isToday = format(new Date(), "yyyy-MM-dd") === dayKey;
					const isTomorrow =
						format(new Date(Date.now() + 86_400_000), "yyyy-MM-dd") === dayKey;

					// Batch actions only target upcoming hours — past slots aren't
					// manageable from the agenda, so they must never inflate counts
					// or be silently included in an id list.
					const futureSlots = daySlots.filter(
						(s) => new Date(s.startTime).getTime() > Date.now(),
					);
					const dayBooked = futureSlots.filter(
						(s) => s.status === "booked",
					).length;
					const dayBlocked = futureSlots.filter(
						(s) => s.status === "blocked",
					).length;
					const dayOpen = futureSlots.filter((s) => s.status === "open").length;
					const openSlotIds = futureSlots
						.filter((s) => s.status === "open")
						.map((s) => s.id);
					const blockedSlotIds = futureSlots
						.filter((s) => s.status === "blocked")
						.map((s) => s.id);

					return (
						<section key={dayKey} className="mb-8 last:mb-0">
							{/* Day Header */}
							<div className="mb-2.5 flex flex-wrap items-center justify-between gap-2 border-b pb-1.5">
								<div className="flex items-center gap-2">
									<span className="font-semibold text-xs text-foreground uppercase tracking-wide">
										{isToday ? "Today · " : isTomorrow ? "Tomorrow · " : ""}
										{label}
									</span>
									<div className="flex items-center gap-1 text-[10px] text-muted-foreground">
										<span>({daySlots.length} hrs:</span>
										{dayBooked > 0 && (
											<span className="text-primary font-medium">
												{dayBooked} booked
											</span>
										)}
										{dayBlocked > 0 && (
											<span className="text-amber-500">
												· {dayBlocked} blocked
											</span>
										)}
										{dayOpen > 0 && <span>· {dayOpen} open</span>}
										<span>)</span>
									</div>
								</div>

								{/* Day Batch Actions */}
								<div className="flex items-center gap-1.5">
									{openSlotIds.length > 0 && (
										<Button
											variant="ghost"
											size="sm"
											disabled={isPerformingAction}
											onClick={() =>
												runBatchAction(
													openSlotIds,
													"block",
													`Blocked all ${openSlotIds.length} open slots for ${format(date, "d MMM")}`,
												)
											}
											className="cursor-pointer h-6 px-2 text-[10px] text-muted-foreground hover:text-destructive"
										>
											<Ban className="size-2.5 mr-1" />
											Block day ({openSlotIds.length})
										</Button>
									)}
									{dayBlocked > 0 && (
										<Button
											variant="ghost"
											size="sm"
											disabled={isPerformingAction}
											onClick={() =>
												runBatchAction(
													blockedSlotIds,
													"unblock",
													`Unblocked ${blockedSlotIds.length} slots for ${format(date, "d MMM")}`,
												)
											}
											className="cursor-pointer h-6 px-2 text-[10px] text-emerald-600 hover:text-emerald-700"
										>
											<Sparkles className="size-2.5 mr-1" />
											Unblock day ({blockedSlotIds.length})
										</Button>
									)}
								</div>
							</div>

							{/* Day Slots List */}
							<ol className="flex flex-col gap-1.5">
								{rows.map((row) => {
									if (row.kind === "gap") {
										const isExpanded = expandedGaps.has(row.key);
										return isExpanded ? (
											daySlots
												.filter(
													(s) =>
														s.status === "open" &&
														new Date(s.startTime) >= row.from &&
														new Date(s.endTime) <= row.to,
												)
												.map((slot) => (
													<AgendaRow
														key={slot.id}
														showTrackTag={trackFilter === "all"}
														slot={slot}
														disabled={isPerformingAction}
														onAssign={() => setTargetSlot(slot)}
														onBlock={() =>
															runAction(
																`/api/admin/slots/${slot.id}/block`,
																{ method: "POST" },
																"Slot blocked from user bookings",
															)
														}
													/>
												))
										) : (
											<li key={row.key}>
												<div className="flex items-center justify-between gap-2 rounded-lg border border-dashed border-border/60 bg-muted/20 px-3 py-2 text-muted-foreground transition-colors hover:bg-muted/40">
													<button
														type="button"
														onClick={() => toggleGap(row.key)}
														className="flex flex-1 cursor-pointer items-center gap-2 text-left text-xs hover:text-foreground"
													>
														<Hourglass className="size-3.5 text-muted-foreground/70" />
														<span className="font-mono text-[11px] tabular-nums font-medium">
															{format(row.from, "HH:mm")} –{" "}
															{format(row.to, "HH:mm")}
														</span>
														<span className="text-[11px]">
															· {row.count} consecutive unbooked hours
														</span>
														<Badge
															variant="outline"
															className="ml-auto cursor-pointer text-[10px] py-0 h-5"
														>
															View {row.count} slots
														</Badge>
													</button>

													<Button
														variant="ghost"
														size="sm"
														disabled={isPerformingAction}
														onClick={() =>
															runBatchAction(
																row.slotIds,
																"block",
																`Blocked ${row.count} hours (${format(row.from, "HH:mm")}–${format(row.to, "HH:mm")})`,
															)
														}
														className="cursor-pointer h-6 px-2 text-[10px] text-destructive hover:bg-destructive/10"
													>
														<Ban className="size-2.5 mr-1" />
														Block {row.count} hrs
													</Button>
												</div>
											</li>
										);
									}

									return (
										<AgendaRow
											key={row.slot.id}
											showTrackTag={trackFilter === "all"}
											slot={row.slot}
											disabled={isPerformingAction}
											onAssign={() => setTargetSlot(row.slot)}
											onBlock={() =>
												runAction(
													`/api/admin/slots/${row.slot.id}/block`,
													{ method: "POST" },
													"Slot blocked from user bookings",
												)
											}
											onUnblock={() =>
												runAction(
													`/api/admin/slots/${row.slot.id}/block`,
													{ method: "DELETE" },
													"Slot unblocked",
												)
											}
										/>
									);
								})}
							</ol>
						</section>
					);
				})}
			</div>

			{/* Reassign Dialog */}
			<ReassignDialog
				slot={targetSlot}
				open={!!targetSlot}
				onOpenChange={(o) => !o && setTargetSlot(null)}
				onDone={async () => {
					setTargetSlot(null);
					await mutate();
				}}
			/>
		</div>
	);
}

function AgendaRow({
	slot,
	disabled = false,
	showTrackTag = false,
	onAssign,
	onBlock,
	onUnblock,
}: {
	slot: AgendaSlot;
	disabled?: boolean;
	showTrackTag?: boolean;
	onAssign: () => void;
	onBlock?: () => void;
	onUnblock?: () => void;
}) {
	const tone = toneForEvent(slot.eventId);
	const isBlocked = slot.status === "blocked";
	const temporal = slotTemporalState(slot);
	// "Open" means live bookable inventory: future hour, event still running.
	// Slots of ended events (and past hours) are history — never Open.
	const isOpen =
		slot.status === "open" &&
		temporal !== "past" &&
		new Date(slot.event.endDate).getTime() > Date.now();
	const eventEnded = new Date(slot.event.endDate).getTime() <= Date.now();
	const _isBooked = slot.status === "booked";
	const booker = slot.assignedUser;
	const displayName = booker?.profile?.displayName || booker?.name || "?";
	const initials = displayName
		.split(" ")
		.map((p) => p[0])
		.slice(0, 2)
		.join("")
		.toUpperCase();

	return (
		<li
			className={cn(
				"group grid grid-cols-[64px_1fr] gap-3 rounded-xl border border-border/60 bg-background/40 px-3 py-3 transition-colors hover:bg-background/80 sm:grid-cols-[80px_1fr]",
				temporal === "past" && "opacity-50",
			)}
		>
			<div className="font-mono text-[11px]">
				<div className="font-medium text-foreground">
					{format(new Date(slot.startTime), "HH:mm")}
				</div>
				<div className="text-muted-foreground text-[10px]">
					{format(new Date(slot.endTime), "HH:mm")}
				</div>
			</div>
			<div className="flex items-center gap-3 min-w-0">
				{/* Temporal status dot */}
				{temporal === "ongoing" ? (
					<span className="relative flex size-3 shrink-0">
						<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
						<span className="relative inline-flex size-3 rounded-full bg-purple-500" />
					</span>
				) : temporal === "past" ? (
					<span
						aria-hidden="true"
						className="size-2 shrink-0 rounded-full bg-amber-500"
					/>
				) : (
					<span
						aria-hidden="true"
						className={cn(
							"size-2 shrink-0 rounded-full",
							isBlocked
								? "bg-zinc-400 dark:bg-zinc-600"
								: isOpen
									? "bg-emerald-400"
									: TONE_BG[tone],
						)}
					/>
				)}
				<div className="min-w-0 flex-1">
					<div className="flex items-center gap-2">
						<span
							className={cn(
								"text-sm font-medium truncate",
								isBlocked && "line-through text-muted-foreground",
							)}
						>
							{slot.event.title}
						</span>
						{showTrackTag && (
							<Badge
								variant="outline"
								className={cn(
									"text-[10px] px-1.5 py-0 shrink-0",
									slot.track === "bible-reading"
										? "border-sky-500/30 text-sky-600"
										: "border-primary/30 text-primary",
								)}
							>
								{slot.track === "bible-reading" ? "Bible Reading" : "Worship"}
							</Badge>
						)}
						{isBlocked && (
							<Badge
								variant="secondary"
								className="text-[10px] px-1.5 py-0 shrink-0"
							>
								<Ban className="mr-1 size-2.5" /> Blocked
							</Badge>
						)}
						{isOpen && (
							<Badge
								variant="outline"
								className="text-[10px] px-1.5 py-0 text-emerald-600 border-emerald-500/30 shrink-0"
							>
								Open
							</Badge>
						)}
					</div>

					<div className="mt-0.5 flex items-center gap-2 font-mono text-[10px] text-muted-foreground">
						{slot.event.location && (
							<>
								<MapPin className="size-3 shrink-0" />
								<span className="truncate">{slot.event.location}</span>
							</>
						)}
					</div>

					{booker ? (
						<div className="mt-1 flex items-center gap-1.5 text-muted-foreground text-xs">
							<span className="truncate">
								{isBlocked ? "held by" : "booked by"}{" "}
								<span className="text-foreground font-medium">
									{displayName}
								</span>
								{booker.email && (
									<span className="text-[10px] text-muted-foreground/80 ml-1">
										({booker.email})
									</span>
								)}
							</span>
						</div>
					) : isBlocked ? (
						<div className="mt-0.5 text-xs text-muted-foreground italic">
							Blocked from public bookings
						</div>
					) : null}
				</div>

				{booker && (
					<Avatar className="size-7 border-2 border-background shrink-0">
						{booker.image && (
							<AvatarImage src={booker.image} alt={displayName} />
						)}
						<AvatarFallback className="text-[9px]">{initials}</AvatarFallback>
					</Avatar>
				)}

				{!eventEnded && (
					<div className="flex shrink-0 items-center gap-1 opacity-90 transition-opacity group-hover:opacity-100 focus-within:opacity-100 max-sm:opacity-100">
						{/* Reassign / Assign Button */}
						<Button
							variant="ghost"
							size="sm"
							disabled={disabled}
							onClick={onAssign}
							className="cursor-pointer h-7 px-2 text-xs"
						>
							<PencilLine className="size-3 mr-1" />
							{booker ? "Reassign" : "Assign"}
						</Button>

						{/* Block / Unblock Button */}
						{isBlocked
							? onUnblock && (
									<Button
										variant="ghost"
										size="sm"
										disabled={disabled}
										onClick={onUnblock}
										className="cursor-pointer h-7 px-2 text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-500/10"
									>
										<Sparkles className="size-3 mr-1" /> Unblock
									</Button>
								)
							: onBlock && (
									<Button
										variant="ghost"
										size="sm"
										disabled={disabled}
										onClick={onBlock}
										className="cursor-pointer h-7 px-2 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
									>
										<Ban className="size-3 mr-1" /> Block
									</Button>
								)}
					</div>
				)}
			</div>
		</li>
	);
}

function ReassignDialog({
	slot,
	open,
	onOpenChange,
	onDone,
}: {
	slot: AgendaSlot | null;
	open: boolean;
	onOpenChange: (o: boolean) => void;
	onDone: () => void | Promise<void>;
}) {
	const [search, setSearch] = useState("");
	const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
	const [saving, setSaving] = useState(false);

	const { data: users } = useSWR<AdminUser[]>(
		open ? "/api/admin/users" : null,
		fetcher,
	);

	const filtered = useMemo(() => {
		const q = search.trim().toLowerCase();
		const list = users ?? [];
		if (!q) return list.slice(0, 30);
		return list
			.filter(
				(u) =>
					u.name?.toLowerCase().includes(q) ||
					u.email?.toLowerCase().includes(q) ||
					u.profile?.displayName?.toLowerCase().includes(q),
			)
			.slice(0, 30);
	}, [users, search]);

	useEffect(() => {
		if (open) {
			setSearch("");
			setSelectedUserId(null);
		}
	}, [open]);

	async function assign(userId: string | null) {
		if (!slot) return;
		setSaving(true);
		try {
			const res = await fetch(`/api/admin/slots/${slot.id}/assign`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ userId }),
			});
			const json = await res.json().catch(() => ({}));
			if (!res.ok) throw new Error(json?.error ?? "Assignment failed");
			toast.success(userId === null ? "Assignment removed" : "Slot assigned");
			await onDone();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : String(err));
		} finally {
			setSaving(false);
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md p-0 gap-0 overflow-hidden flex flex-col max-h-[85dvh]">
				<DialogHeader className="shrink-0 border-b px-6 py-4 space-y-0.5">
					<DialogTitle className="text-sm ">
						{slot?.assignedUser ? "Reassign this hour" : "Assign this hour"}
					</DialogTitle>
					<DialogDescription className="text-muted-foreground text-xs">
						{slot && (
							<>
								{format(new Date(slot.startTime), "EEE d MMM · HH:mm")}–
								{format(new Date(slot.endTime), "HH:mm")} · {slot.event.title}
							</>
						)}
					</DialogDescription>
				</DialogHeader>

				<div className="shrink-0 border-b px-6 py-3">
					<Input
						placeholder="Search singers by name or email…"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="h-9"
					/>
				</div>

				<div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
					{filtered.length === 0 && (
						<p className="py-8 text-center text-muted-foreground text-sm">
							No users match “{search}”.
						</p>
					)}
					{filtered.map((u) => {
						const selected = selectedUserId === u.id;
						const displayName = u.profile?.displayName || u.name;
						const initials = displayName
							.split(" ")
							.map((p) => p[0])
							.slice(0, 2)
							.join("")
							.toUpperCase();
						const currentlyHolds = slot?.assignedUser?.id === u.id;
						return (
							<button
								key={u.id}
								type="button"
								onClick={() => setSelectedUserId(selected ? null : u.id)}
								className={cn(
									"flex w-full cursor-pointer items-center gap-2.5 border-b border-border/50 px-5 py-2.5 text-left transition-colors last:border-b-0",
									selected ? "bg-muted" : "hover:bg-muted/50",
								)}
							>
								<Avatar className="size-7">
									{u.image && <AvatarImage src={u.image} alt={displayName} />}
									<AvatarFallback className="text-[9px]">
										{initials}
									</AvatarFallback>
								</Avatar>
								<span className="min-w-0 flex-1">
									<span className="block truncate text-sm">{displayName}</span>
									<span className="block truncate text-muted-foreground text-xs">
										{u.email}
									</span>
								</span>
								{currentlyHolds && (
									<Badge variant="secondary" className="shrink-0">
										<Clock className="mr-1 size-3" /> current
									</Badge>
								)}
							</button>
						);
					})}
				</div>

				<DialogFooter className="mx-0 mb-0 grid grid-cols-1 gap-2 px-4 py-4 sm:grid-cols-2 sm:!grid-flow-row [&>button]:w-full">
					{slot?.assignedUser && (
						<Button
							variant="outline"
							disabled={saving}
							onClick={() => assign(null)}
							className="cursor-pointer sm:col-span-full"
						>
							Remove assignment
						</Button>
					)}
					<Button
						variant="destructive"
						disabled={saving}
						onClick={() => onOpenChange(false)}
						className="cursor-pointer"
					>
						Cancel
					</Button>
					<Button
						disabled={!selectedUserId || saving}
						onClick={() => selectedUserId && assign(selectedUserId)}
						className="cursor-pointer"
					>
						{saving ? "Saving…" : "Assign slot"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
