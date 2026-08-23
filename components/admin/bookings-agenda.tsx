"use client";

import { format } from "date-fns";
import {
	Ban,
	Clock,
	Hourglass,
	MapPin,
	PencilLine,
	Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface AgendaSlot {
	id: string;
	eventId: string;
	startTime: string;
	endTime: string;
	status: string;
	assignedUser?: { id: string; name: string; image: string | null } | null;
	event: { id: string; title: string; location: string | null };
}

interface AgendaResponse {
	windowDays: number;
	slots: AgendaSlot[];
}

interface AdminUser {
	id: string;
	name: string;
	email: string;
	image?: string | null;
	profile?: { displayName?: string | null } | null;
}

const AGENDA_DAYS = 7;

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
	| { kind: "gap"; key: string; from: Date; to: Date; count: number };

function buildDayRows(slots: AgendaSlot[]): RowItem[] {
	const now = Date.now();
	const upcoming = slots
		.filter((s) => new Date(s.startTime).getTime() > now)
		.sort(
			(a, b) =>
				new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
		);

	const rows: RowItem[] = [];
	let gapStart: Date | null = null;
	let gapEnd: Date | null = null;
	let gapCount = 0;

	const flushGap = () => {
		if (gapStart && gapEnd && gapCount > 0) {
			rows.push({
				kind: "gap",
				key: gapStart.toISOString(),
				from: gapStart,
				to: gapEnd,
				count: gapCount,
			});
		}
		gapStart = null;
		gapEnd = null;
		gapCount = 0;
	};

	for (const slot of upcoming) {
		const start = new Date(slot.startTime);
		const end = new Date(slot.endTime);
		if (slot.status === "open") {
			if (gapStart && gapEnd && start.getTime() === gapEnd.getTime()) {
				gapEnd = end;
				gapCount += 1;
			} else {
				flushGap();
				gapStart = start;
				gapEnd = end;
				gapCount = 1;
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

export function BookingsAgenda() {
	const [targetSlot, setTargetSlot] = useState<AgendaSlot | null>(null);
	const [expandedGaps, setExpandedGaps] = useState<Set<string>>(new Set());

	const { data, error, isLoading, mutate } = useSWR<AgendaResponse>(
		`/api/admin/slots/agenda?days=${AGENDA_DAYS}`,
		fetcher,
		{ refreshInterval: 60_000 },
	);

	async function runAction(url: string, init: RequestInit, okMsg: string) {
		try {
			const res = await fetch(url, init);
			const json = await res.json().catch(() => ({}));
			if (!res.ok) throw new Error(json?.error ?? "Action failed");
			toast.success(okMsg);
			await mutate();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : String(err));
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

	const days = useMemo(() => {
		const map = new Map<string, AgendaSlot[]>();
		for (const slot of data?.slots ?? []) {
			const key = format(new Date(slot.startTime), "yyyy-MM-dd");
			const list = map.get(key) ?? [];
			list.push(slot);
			map.set(key, list);
		}
		return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
	}, [data]);

	const stats = useMemo(() => {
		const all = data?.slots ?? [];
		const now = Date.now();
		const future = all.filter((s) => new Date(s.startTime).getTime() > now);
		const booked = future.filter((s) => s.status === "booked").length;
		const blocked = future.filter((s) => s.status === "blocked").length;
		return `${booked} booked · ${blocked} blocked · ${future.length - booked - blocked} open hours ahead`;
	}, [data]);

	return (
		<div className="rounded-xl border bg-card">
			<div className="border-b px-5 py-4">
				<p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.3em]">
					next {AGENDA_DAYS} days
				</p>
				<h2 className="mt-1 font-medium tracking-tight">Worship agenda</h2>
				<p className="text-muted-foreground text-sm">{stats}</p>
			</div>

			<div className="p-4 sm:p-5">
				{isLoading && (
					<p className="py-8 text-center text-muted-foreground text-sm">
						Loading agenda…
					</p>
				)}
				{error && (
					<p className="py-8 text-center text-destructive text-sm">
						Failed to load the agenda.
					</p>
				)}
				{!isLoading &&
					!error &&
					days.every(([, slots]) => buildDayRows(slots).length === 0) && (
						<p className="py-8 text-center text-muted-foreground text-sm">
							Nothing scheduled in the next {AGENDA_DAYS} days. Generate slots
							from Event Management to fill the calendar.
						</p>
					)}

				{days.map(([dayKey, slots]) => {
					const rows = buildDayRows(slots);
					if (rows.length === 0) return null;
					const date = new Date(dayKey);
					const label = format(date, "EEE d MMM");
					const todayLabel =
						format(new Date(), "yyyy-MM-dd") === dayKey
							? "Today"
							: format(new Date(Date.now() + 86_400_000), "yyyy-MM-dd") ===
									dayKey
								? "Tomorrow"
								: label;

					return (
						<section key={dayKey} className="mb-6 last:mb-0">
							<div className="mb-2 flex items-end justify-between">
								<span className="font-mono text-[10px] text-primary uppercase tracking-[0.25em]">
									{todayLabel}
								</span>
								<span className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.25em]">
									{label}
								</span>
							</div>
							<ol className="flex flex-col gap-1.5">
								{rows.map((row) =>
									row.kind === "gap" ? (
										expandedGaps.has(row.key) ? (
											slots
												.filter(
													(s) =>
														s.status === "open" &&
														new Date(s.startTime) >= row.from &&
														new Date(s.endTime) <= row.to,
												)
												.map((slot) => (
													<AgendaRow
														key={slot.id}
														slot={slot}
														onAssign={() => setTargetSlot(slot)}
													/>
												))
										) : (
											<li key={row.key}>
												<button
													type="button"
													onClick={() => toggleGap(row.key)}
													className="flex w-full cursor-pointer items-center gap-3 px-1 py-1.5 text-muted-foreground text-xs transition-colors hover:text-foreground"
												>
													<span className="h-px flex-1 bg-border/40" />
													<span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em]">
														<Hourglass className="size-3" />
														{row.count} hr unbooked ·{" "}
														{format(row.from, "HH:mm")}–
														{format(row.to, "HH:mm")}
													</span>
													<span className="h-px flex-1 bg-border/40" />
												</button>
											</li>
										)
									) : (
										<AgendaRow
											key={row.slot.id}
											slot={row.slot}
											onAssign={() => setTargetSlot(row.slot)}
											onBlock={() =>
												runAction(
													`/api/admin/slots/${row.slot.id}/block`,
													{ method: "POST" },
													"Slot blocked",
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
									),
								)}
							</ol>
						</section>
					);
				})}
			</div>

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
	onAssign,
	onBlock,
	onUnblock,
}: {
	slot: AgendaSlot;
	onAssign: () => void;
	onBlock?: () => void;
	onUnblock?: () => void;
}) {
	const tone = toneForEvent(slot.eventId);
	const isBlocked = slot.status === "blocked";
	const booker = slot.assignedUser;
	const initials = (booker?.name ?? "?")
		.split(" ")
		.map((p) => p[0])
		.slice(0, 2)
		.join("")
		.toUpperCase();

	return (
		<li className="group grid grid-cols-[64px_1fr] gap-3 rounded-xl border border-border/60 bg-background/40 px-3 py-3 transition-colors hover:bg-background/60 sm:grid-cols-[80px_1fr]">
			<div className="font-mono text-[11px]">
				<div className="text-foreground">
					{format(new Date(slot.startTime), "HH:mm")}
				</div>
				<div className="text-muted-foreground">
					{format(new Date(slot.endTime), "HH:mm")}
				</div>
			</div>
			<div className="flex items-center gap-3 min-w-0">
				<span
					className={cn(
						"h-12 w-1 shrink-0 rounded-full",
						isBlocked ? "bg-zinc-400 dark:bg-zinc-600" : TONE_BG[tone],
					)}
				/>
				<div className="min-w-0 flex-1">
					<div
						className={cn(
							"text-sm truncate",
							isBlocked && "line-through text-muted-foreground",
						)}
					>
						{slot.event.title}
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
								<span className="text-foreground">{booker.name}</span>
							</span>
						</div>
					) : null}
				</div>

				{booker && (
					<Avatar className="size-7 border-2 border-background shrink-0">
						{booker.image && (
							<AvatarImage src={booker.image} alt={booker.name} />
						)}
						<AvatarFallback className="text-[9px]">{initials}</AvatarFallback>
					</Avatar>
				)}
				{isBlocked && !booker && (
					<Badge variant="secondary" className="shrink-0">
						<Ban className="mr-1 size-3" /> Blocked
					</Badge>
				)}

				<div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100 max-sm:opacity-100">
					<Button
						variant="ghost"
						size="sm"
						onClick={onAssign}
						className="cursor-pointer h-7 px-2 text-xs"
					>
						<PencilLine className="size-3" />
						{booker ? "Reassign" : "Assign"}
					</Button>
					{isBlocked
						? onUnblock && (
								<Button
									variant="ghost"
									size="sm"
									onClick={onUnblock}
									className="cursor-pointer h-7 px-2 text-xs text-emerald-600 hover:text-emerald-700"
								>
									<Sparkles className="size-3" /> Unblock
								</Button>
							)
						: onBlock && (
								<Button
									variant="ghost"
									size="sm"
									onClick={onBlock}
									className="cursor-pointer h-7 px-2 text-xs text-destructive hover:text-destructive"
								>
									<Ban className="size-3" /> Block
								</Button>
							)}
				</div>
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
					u.email?.toLowerCase().includes(q),
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
			<DialogContent className="max-w-md p-0 gap-0 overflow-hidden">
				<DialogHeader className="border-b px-5 py-4 space-y-0.5">
					<DialogTitle className="text-sm font-medium">
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

				<div className="border-b px-5 py-3">
					<Input
						placeholder="Search singers by name or email…"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="h-9"
					/>
				</div>

				<div className="max-h-72 overflow-y-auto">
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

				<DialogFooter className="border-t px-5 py-3 space-x-2">
					{slot?.assignedUser && (
						<Button
							variant="outline"
							disabled={saving}
							onClick={() => assign(null)}
							className="cursor-pointer mr-auto"
						>
							Remove assignment
						</Button>
					)}
					<Button
						variant="ghost"
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
