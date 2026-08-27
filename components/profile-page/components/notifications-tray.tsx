"use client";

import { Bell, CheckCheck, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type NotificationItem = {
	id: string;
	title: string;
	body?: string | null;
	link?: string | null;
	read: boolean;
	createdAt: string;
};
type Response = { notifications: NotificationItem[]; unreadCount: number };
const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function NotificationsTray() {
	const { data, mutate } = useSWR<Response>(
		"/api/user/notifications",
		fetcher,
		{ refreshInterval: 30_000 },
	);
	const [pendingRead, setPendingRead] = useState(false);
	const [pendingClear, setPendingClear] = useState(false);
	const items = data?.notifications ?? [];
	const unread = data?.unreadCount ?? 0;

	async function markRead(id?: string) {
		if (!data) return;
		if (!id) setPendingRead(true);
		const optimistic = {
			unreadCount: id ? Math.max(0, unread - 1) : 0,
			notifications: data.notifications.map((n) =>
				!id || n.id === id ? { ...n, read: true } : n,
			),
		};
		mutate(optimistic, { revalidate: false });
		try {
			const res = await fetch("/api/user/notifications", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(id ? { id } : { all: true }),
			});
			if (!res.ok) throw new Error();
			await mutate();
			toast.success(id ? "Marked read" : "All marked read");
		} catch {
			toast.error("Could not update");
			mutate(data, { revalidate: false });
		} finally {
			if (!id) setPendingRead(false);
		}
	}

	async function clear(id?: string) {
		if (!data) return;
		if (!id) setPendingClear(true);
		const prev = data;
		mutate(
			{
				unreadCount: id
					? prev.unreadCount -
						(prev.notifications.find((n) => n.id === id && !n.read) ? 1 : 0)
					: 0,
				notifications: id ? prev.notifications.filter((n) => n.id !== id) : [],
			},
			{ revalidate: false },
		);
		try {
			const res = await fetch(
				id ? `/api/user/notifications?id=${id}` : "/api/user/notifications",
				{
					method: "DELETE",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(id ? { id } : { all: true }),
				},
			);
			if (!res.ok) throw new Error();
			toast.success(id ? "Cleared" : "Tray cleared");
			await mutate();
		} catch {
			toast.error("Could not clear");
			mutate(prev, { revalidate: false });
		} finally {
			if (!id) setPendingClear(false);
		}
	}

	return (
		<Card className="p-2 py-4 md:p-4 w-full">
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
				<div className="space-y-1">
					<CardTitle className="flex items-center gap-2">
						<Bell className="size-4" /> Inbox{" "}
						<Badge variant="secondary" className="tabular-nums">
							{unread} unread · {items.length} total
						</Badge>
					</CardTitle>
					<CardDescription>
						Same tray as the dashboard sidebar — taps mark read, clear empties.
					</CardDescription>
				</div>
				<div className="flex gap-1.5">
					<Button
						variant="ghost"
						size="sm"
						disabled={pendingRead || unread === 0}
						onClick={() => markRead()}
						className="h-7 cursor-pointer gap-1.5 text-xs"
					>
						<CheckCheck
							className={cn("size-3", pendingRead && "animate-pulse")}
						/>{" "}
						{pendingRead ? "Saving…" : "Mark all read"}
					</Button>
					<Button
						variant="ghost"
						size="sm"
						disabled={pendingClear || items.length === 0}
						onClick={() => clear()}
						className="h-7 cursor-pointer gap-1.5 text-xs text-destructive hover:text-destructive"
						title="Clear all"
					>
						<Trash2 className={cn("size-3", pendingClear && "animate-pulse")} />{" "}
						{pendingClear ? "Clearing…" : "Clear"}
					</Button>
				</div>
			</CardHeader>
			<CardContent className="space-y-2">
				{items.length === 0 ? (
					<p className="py-8 text-center text-sm text-muted-foreground">
						You&apos;re all caught up.
					</p>
				) : (
					<div className="divide-y rounded-md border">
						{items.map((n) => (
							<div
								key={n.id}
								onClick={() => !n.read && markRead(n.id)}
								className={cn(
									"flex items-start justify-between gap-3 p-3 cursor-pointer hover:bg-muted/50",
									!n.read && "bg-primary/5",
								)}
							>
								<div className="min-w-0 flex-1 space-y-1">
									<p
										className={cn(
											"text-sm leading-none",
											n.read
												? "text-muted-foreground"
												: "font-medium text-foreground",
										)}
									>
										{n.title}
									</p>
									{n.body && (
										<p className="line-clamp-2 text-xs text-muted-foreground">
											{n.body}
										</p>
									)}
									<p className="text-[10px] text-muted-foreground">
										{new Date(n.createdAt).toLocaleString()}
									</p>
								</div>
								<Button
									variant="ghost"
									size="icon"
									className="size-7 shrink-0 cursor-pointer text-muted-foreground hover:text-destructive"
									title="Clear"
									onClick={(e) => {
										e.stopPropagation();
										clear(n.id);
									}}
								>
									<Trash2 className="size-3.5" />
								</Button>
							</div>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
