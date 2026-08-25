"use client";

import { betterFetch } from "@better-fetch/fetch";
import { format } from "date-fns";
import { CalendarClock, CalendarPlus, MapPin } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface MySlot {
	id: string;
	eventId: string;
	startTime: string;
	endTime: string;
	status: string;
	track?: "worship" | "bible-reading";
	event: { id: string; title: string; slug: string; location?: string | null };
}

const fetcher = async (url: string) => {
	const { data, error } = await betterFetch<MySlot[]>(url);
	if (error) throw error;
	return data ?? [];
};

export function MyBookingsPanel() {
	const [cancellingId, setCancellingId] = useState<string | null>(null);
	const { data, isLoading, mutate } = useSWR<MySlot[]>(
		"/api/user/slots",
		fetcher,
		{
			refreshInterval: 60_000,
		},
	);

	const now = Date.now();
	const upcoming = (data ?? []).filter(
		(s) => new Date(s.startTime).getTime() > now,
	);
	const past = (data ?? []).filter(
		(s) => new Date(s.startTime).getTime() <= now,
	);

	async function cancelBooking(slot: MySlot) {
		setCancellingId(slot.id);
		try {
			const res = await fetch(
				`/api/events/${slot.eventId}/slots/${slot.id}/book`,
				{ method: "DELETE" },
			);
			const json = await res.json();
			if (!res.ok) throw new Error(json?.error ?? "Cancellation failed");
			toast.success("Booking cancelled", {
				description: `${format(new Date(slot.startTime), "EEE d MMM, h:mm aa")} is open again.`,
			});
			await mutate();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : String(err));
		} finally {
			setCancellingId(null);
		}
	}

	return (
		<Card>
			<CardHeader className="flex-row items-center justify-between">
				<CardTitle className="flex items-center gap-2 text-base">
					<CalendarClock className="size-4" /> My Worship Slots
				</CardTitle>
				{!isLoading && (
					<div className="flex items-center gap-2">
						{upcoming.length > 0 && (
							<a
								href="/api/user/slots/ics"
								className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border px-2 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
								title="Add all upcoming slots to your calendar"
							>
								<CalendarPlus className="size-3.5" /> Calendar
							</a>
						)}
						<Badge variant="secondary">{upcoming.length} upcoming</Badge>
					</div>
				)}
			</CardHeader>
			<CardContent>
				{isLoading && (
					<div className="space-y-2" aria-busy="true">
						<Skeleton className="h-[76px] w-full rounded-lg" />
						<Skeleton className="h-[76px] w-full rounded-lg" />
					</div>
				)}
				{!isLoading && upcoming.length === 0 && past.length === 0 && (
					<p className="text-sm text-muted-foreground">
						You haven&apos;t booked any worship slots yet. Head to the{" "}
						<a href="/schedule" className="underline cursor-pointer">
							schedule
						</a>{" "}
						pick an hour.
					</p>
				)}
				{!isLoading && upcoming.length > 0 && (
					<ul className="space-y-2">
						{upcoming.map((slot) => (
							<li
								key={slot.id}
								className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-lg border p-3"
							>
								<div className="min-w-0">
									<p className="flex items-center gap-1.5 font-medium text-sm">
										<span className="truncate">{slot.event.title}</span>
										{slot.track === "bible-reading" && (
											<Badge
												variant="outline"
												className="shrink-0 text-[10px] px-1.5 py-0"
											>
												Bible Reading
											</Badge>
										)}
									</p>
									<p className="text-xs text-muted-foreground tabular-nums">
										{format(
											new Date(slot.startTime),
											"EEE d MMM yyyy · h:mm aa",
										)}
										{" – "}
										{format(new Date(slot.endTime), "h:mm aa")}
									</p>
									{slot.event.location && (
										<p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
											<MapPin className="size-3" /> {slot.event.location}
										</p>
									)}
								</div>
								<Button
									variant="outline"
									size="sm"
									disabled={cancellingId === slot.id}
									onClick={() => cancelBooking(slot)}
									className={cn("cursor-pointer shrink-0")}
								>
									{cancellingId === slot.id ? "Cancelling…" : "Cancel booking"}
								</Button>
							</li>
						))}
					</ul>
				)}
				{!isLoading && past.length > 0 && (
					<div className="mt-4 pt-3 border-t">
						<p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
							Past slots
						</p>
						<ul className="space-y-1 opacity-70">
							{past.map((slot) => (
								<li
									key={slot.id}
									className="text-xs text-muted-foreground line-through"
								>
									{format(new Date(slot.startTime), "EEE d MMM yyyy · h:mm aa")}{" "}
									— {slot.event.title}
								</li>
							))}
						</ul>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
