"use client";

import { format } from "date-fns";
import { CalendarDays, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Carousel,
	type CarouselApi,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import type { RedactedSlot, SlotVisibilityMode } from "@/lib/slots";
import { useCurrentSession } from "@/lib/use-current-session";
import { cn } from "@/lib/utils";

interface SlotsResponse {
	eventId: string;
	bookingOpen: boolean;
	visibility: SlotVisibilityMode;
	slots: RedactedSlot[];
}

interface BookingDialogProps {
	eventId: string;
	eventTitle: string;
	children?: React.ReactNode;
	variant?: "default" | "outline" | "ghost" | "secondary";
	className?: string;
}

async function fetcher(url: string): Promise<SlotsResponse> {
	const res = await fetch(url);
	if (!res.ok) throw new Error("Failed to load slots");
	return res.json();
}

export function BookingDialog({
	eventId,
	eventTitle,
	children,
	variant = "default",
	className,
}: BookingDialogProps) {
	const { session, isAuthenticated } = useCurrentSession();
	const isAdmin = session?.user?.role === "admin";
	const [open, setOpen] = useState(false);
	const [pendingSlot, setPendingSlot] = useState<RedactedSlot | null>(null);
	const [booking, setBooking] = useState(false);
	const [api, setApi] = useState<CarouselApi>();
	const [currentDayIndex, setCurrentDayIndex] = useState(0);
	// Embla measures slide widths at mount. Mounting it while the Radix
	// open-animation (scale) is still running produces oversized slides that
	// spill past the dialog edge — only visible once an event has multiple
	// day-slides. Defer mounting until the animation settles.
	const [carouselReady, setCarouselReady] = useState(false);

	const { data, error, isLoading, mutate } = useSWR<SlotsResponse>(
		open ? `/api/events/${eventId}/slots` : null,
		fetcher,
		{ refreshInterval: 30_000 },
	);

	const days = useMemo(() => {
		const unique: string[] = [];
		for (const slot of data?.slots ?? []) {
			const key = format(new Date(slot.startTime), "yyyy-MM-dd");
			if (!unique.includes(key)) unique.push(key);
		}
		return unique;
	}, [data]);

	const dayGroups = useMemo(() => {
		if (!data) return [] as RedactedSlot[][];
		return days.map((day) =>
			data.slots.filter(
				(s) => format(new Date(s.startTime), "yyyy-MM-dd") === day,
			),
		);
	}, [data, days]);

	const mySlots = useMemo(() => {
		return new Set(
			(data?.slots ?? [])
				.filter((s) => s.status === "booked" && s.isMine)
				.map((s) => s.id),
		);
	}, [data]);

	const activeDay = days[currentDayIndex] ?? null;
	const activeSlots =
		dayGroups[Math.min(currentDayIndex, Math.max(dayGroups.length - 1, 0))] ??
		[];

	useEffect(() => {
		if (!api) return;
		const handler = () => setCurrentDayIndex(api.selectedScrollSnap());
		handler();
		api.on("select", handler);
		return () => {
			api.off("select", handler);
		};
	}, [api]);

	useEffect(() => {
		if (!api || !data || days.length === 0) return;
		if (api.selectedScrollSnap() !== 0 && currentDayIndex !== 0) return;
		const now = Date.now();
		const idx = days.findIndex((day) =>
			data.slots.some(
				(s) =>
					format(new Date(s.startTime), "yyyy-MM-dd") === day &&
					s.status === "open" &&
					new Date(s.startTime).getTime() > now,
			),
		);
		const target = idx === -1 ? 0 : idx;
		setCurrentDayIndex(target);
		api.scrollTo(target, true);
	}, [api, data, days, currentDayIndex]);

	useEffect(() => {
		if (!open) {
			setCarouselReady(false);
			return;
		}

		// Wait for the dialog open-animation (zoom-in-95 / fade-in) to
		// finish before mounting the carousel so Embla measures slide widths
		// at the dialog's final scale, not at ~95 %.
		let cancelled = false;
		const dialogEl = document.querySelector<HTMLElement>(
			'[data-slot="dialog-content"]',
		);

		const mount = () => {
			if (cancelled) return;
			setCarouselReady(true);
			requestAnimationFrame(() => api?.reInit());
		};

		if (dialogEl) {
			const handler = () => {
				dialogEl.removeEventListener("animationend", handler);
				mount();
			};
			dialogEl.addEventListener("animationend", handler);

			// Fallback in case the event never fires (e.g. prefers-reduced-motion)
			const fallback = setTimeout(mount, 300);
			return () => {
				cancelled = true;
				dialogEl.removeEventListener("animationend", handler);
				clearTimeout(fallback);
			};
		}

		// No dialog element found – fall back to a generous timeout
		const t = setTimeout(mount, 300);
		return () => {
			cancelled = true;
			clearTimeout(t);
		};
	}, [open, api]);

	const scrollPrev = useCallback(() => api?.scrollPrev(), [api]);
	const scrollNext = useCallback(() => api?.scrollNext(), [api]);

	async function confirmBooking() {
		if (!pendingSlot) return;
		setBooking(true);
		try {
			const res = await fetch(
				`/api/events/${eventId}/slots/${pendingSlot.id}/book`,
				{ method: "POST" },
			);
			const json = await res.json();
			if (!res.ok) throw new Error(json?.error ?? "Booking failed");
			toast.success("Slot booked", {
				description: `${format(new Date(pendingSlot.startTime), "EEE d MMM, h:mm aa")} – ${format(
					new Date(pendingSlot.endTime),
					"h:mm aa",
				)}`,
			});
			setPendingSlot(null);
			await mutate();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : String(err));
		} finally {
			setBooking(false);
		}
	}

	const isAdminManaged = data?.visibility === "admin_only" && !isAdmin;
	const bookingsClosed = data ? data.bookingOpen === false : false;
	const hasDays = days.length > 0;

	return (
		<>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					{children ?? (
						<Button
							variant={variant}
							className={cn("cursor-pointer", className)}
						>
							Book a Slot
						</Button>
					)}
				</DialogTrigger>
				<DialogContent className="max-w-[calc(100%-1rem)] sm:max-w-lg md:max-w-2xl p-0 gap-0 overflow-hidden">
					<DialogHeader className="border-b px-5 py-3.5 pr-14 space-y-0.5">
						<DialogTitle className="font-medium text-sm">
							Book a Worship Slot
						</DialogTitle>
						<DialogDescription className="text-muted-foreground text-xs truncate">
							{eventTitle}
						</DialogDescription>
					</DialogHeader>

					{/* Admin-only visibility mode banner */}
					{isAdmin && data?.visibility && (
						<div
							className={cn(
								"px-4 py-1.5 text-[11px] border-b flex items-center justify-between font-mono",
								data.visibility === "admin_only"
									? "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20"
									: data.visibility === "full_public"
										? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
										: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20",
							)}
						>
							<span>
								Admin Mode · Public visibility:{" "}
								<strong className="uppercase">
									{data.visibility.replace("_", " ")}
								</strong>
							</span>
							<span className="text-[10px] text-muted-foreground">
								{data.visibility === "admin_only"
									? "(public sees admin-managed notice)"
									: data.visibility === "full_public"
										? "(names visible to public)"
										: "(names hidden from public)"}
							</span>
						</div>
					)}

					<div className="flex items-center justify-between gap-2 border-b bg-muted/30 px-4 py-2">
						<div className="flex items-center gap-1.5 min-w-0 text-xs text-muted-foreground">
							<CalendarDays className="size-3.5 shrink-0" />
							<span className="truncate tabular-nums">
								{activeDay
									? format(new Date(activeDay), "EEE d MMM yyyy")
									: "No dates"}
							</span>
							<span aria-hidden>·</span>
							<span className="tabular-nums whitespace-nowrap">
								{activeSlots.filter((s) => s.status === "open").length} open
							</span>
							{mySlots.size > 0 && (
								<span className="text-primary whitespace-nowrap tabular-nums">
									· {mySlots.size} yours
								</span>
							)}
						</div>
						<div className="flex items-center gap-1 shrink-0">
							<Button
								variant="outline"
								size="icon"
								disabled={!hasDays || currentDayIndex <= 0}
								onClick={scrollPrev}
								className="cursor-pointer size-7 rounded-full"
								aria-label="Previous day"
							>
								<ChevronLeft className="size-3.5" />
							</Button>
							<Button
								variant="outline"
								size="icon"
								disabled={!hasDays || currentDayIndex >= days.length - 1}
								onClick={scrollNext}
								className="cursor-pointer size-7 rounded-full"
								aria-label="Next day"
							>
								<ChevronRight className="size-3.5" />
							</Button>
						</div>
					</div>

					<div className="min-h-44 w-full min-w-0 overflow-hidden">
						{isLoading && (
							<p className="px-5 py-8 text-sm text-muted-foreground">
								Loading slots…
							</p>
						)}
						{error && (
							<p className="px-5 py-8 text-sm text-destructive">
								Failed to load slots.
							</p>
						)}
						{!isLoading && !error && isAdminManaged && (
							<p className="px-5 py-8 text-sm text-muted-foreground">
								Bookings for this event are managed by the admins. Please
								contact us to reserve a slot.
							</p>
						)}
						{!isLoading && !error && bookingsClosed && !isAdminManaged && (
							<p className="px-5 py-8 text-sm text-muted-foreground">
								Bookings for this event haven&apos;t opened yet. Check back soon
								— hours will appear here the moment they open.
							</p>
						)}
						{!isLoading &&
							!error &&
							!bookingsClosed &&
							!isAdminManaged &&
							!hasDays && (
								<p className="px-5 py-8 text-sm text-muted-foreground">
									No slots have been published for this event yet.
								</p>
							)}
						{!isLoading &&
							!error &&
							!isAdminManaged &&
							!bookingsClosed &&
							hasDays &&
							carouselReady && (
								<Carousel
									setApi={setApi}
									opts={{ loop: false, containScroll: "trimSnaps" }}
									className="w-full min-w-0"
								>
									<CarouselContent className="ml-0">
										{dayGroups.map((group, i) => (
											<CarouselItem
												key={days[i]}
												className="min-w-0 pl-0 basis-full"
											>
												<div className="grid w-full grid-cols-3 gap-2 px-5 py-4 sm:grid-cols-4">
													{group.map((slot) => (
														<SlotButton
															key={slot.id}
															slot={slot}
															isMine={mySlots.has(slot.id)}
															onSelect={() => setPendingSlot(slot)}
														/>
													))}
												</div>
											</CarouselItem>
										))}
									</CarouselContent>
								</Carousel>
							)}

						{!isLoading &&
							!error &&
							!isAuthenticated &&
							!bookingsClosed &&
							!isAdminManaged && (
								<p className="border-t px-5 py-2.5 text-xs text-muted-foreground">
									You&apos;ll need to{" "}
									<a href="/login" className="underline cursor-pointer">
										sign in
									</a>{" "}
									to book a slot.
								</p>
							)}
					</div>

					{hasDays && !isLoading && (
						<div
							className={cn(
								"flex flex-wrap items-center justify-center gap-1.5 border-t px-5 py-2 max-w-full overflow-hidden",
								!isAuthenticated && "border-t-0",
							)}
						>
							{days.map((_, i) => (
								<button
									key={days[i]}
									type="button"
									aria-label={`Go to day ${i + 1}`}
									onClick={() => api?.scrollTo(i)}
									className={cn(
										"h-1.5 rounded-full transition-all cursor-pointer",
										i === currentDayIndex
											? "w-4 bg-primary"
											: "w-1.5 bg-muted-foreground/25 hover:bg-muted-foreground/40",
									)}
								/>
							))}
						</div>
					)}
				</DialogContent>
			</Dialog>

			<AlertDialog
				open={!!pendingSlot}
				onOpenChange={(o) => !o && setPendingSlot(null)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Confirm your hour of worship?</AlertDialogTitle>
						<AlertDialogDescription>
							{pendingSlot &&
								`${format(new Date(pendingSlot.startTime), "EEEE, d MMMM yyyy")} · ${format(
									new Date(pendingSlot.startTime),
									"h:mm aa",
								)} – ${format(new Date(pendingSlot.endTime), "h:mm aa")}`}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel className="cursor-pointer">
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							disabled={booking}
							onClick={(e) => {
								e.preventDefault();
								confirmBooking();
							}}
							className="cursor-pointer"
						>
							{booking ? "Booking…" : "Yes, book it"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}

function SlotButton({
	slot,
	isMine,
	onSelect,
}: {
	slot: RedactedSlot;
	isMine: boolean;
	onSelect: () => void;
}) {
	const start = new Date(slot.startTime);
	const isPast = start.getTime() <= Date.now();
	const available = slot.status === "open" && !isPast;
	const hasName = Boolean(slot.assignedUserName && !isMine);

	return (
		<button
			type="button"
			disabled={!available}
			onClick={onSelect}
			title={
				slot.assignedUserName
					? `Booked by ${slot.assignedUserName}`
					: slot.status === "blocked"
						? "Blocked by admin"
						: isPast
							? "Past hour"
							: "Available to book"
			}
			className={cn(
				"flex flex-col items-center justify-center gap-0.5 rounded-md border px-2 py-1.5 text-sm transition-colors select-none min-h-[44px]",
				available && "border-border hover:bg-muted/50 cursor-pointer",
				!available &&
					"cursor-not-allowed border-transparent bg-muted/30 text-muted-foreground/40",
				!available && !hasName && "line-through",
				isMine && "border-primary/50 text-primary not-italic no-underline",
			)}
		>
			<div className="flex items-center justify-center gap-1.5">
				<Clock className="size-3 shrink-0" />
				<span className="font-mono text-xs tabular-nums whitespace-nowrap">
					{format(start, "h:mm aa")}
				</span>
				{isMine && (
					<Badge className="ml-1 text-[10px] px-1.5 py-0 shrink-0">You</Badge>
				)}
			</div>
			{hasName && (
				<span className="truncate text-[10px] font-medium max-w-full text-muted-foreground/80">
					{slot.assignedUserName}
				</span>
			)}
		</button>
	);
}
