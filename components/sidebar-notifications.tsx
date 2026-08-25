"use client";

import { Bell, BellRing, CheckCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

interface NotificationItem {
	id: string;
	title: string;
	body?: string | null;
	link?: string | null;
	read: boolean;
	createdAt: string;
}

interface NotificationsResponse {
	notifications: NotificationItem[];
	unreadCount: number;
}

async function fetcher<T>(url: string): Promise<T> {
	const res = await fetch(url);
	if (!res.ok) throw new Error("Failed");
	return res.json();
}

export function SidebarNotifications() {
	const { data, mutate } = useSWR<NotificationsResponse>(
		"/api/user/notifications",
		fetcher,
		{ refreshInterval: 60_000 },
	);

	const [pendingRead, setPendingRead] = useState(false);
	const unread = data?.unreadCount ?? 0;
	const items = data?.notifications ?? [];

	/**
	 * Optimistic: flips the UI instantly, reconciles with the server in the
	 * background, and reverts on failure. Dropdown stays open so admins can
	 * keep working through the list.
	 */
	async function markRead(id?: string) {
		if (!id) setPendingRead(true);
		if (!data) return;
		mutate(
			{
				unreadCount: id ? Math.max(0, unread - 1) : 0,
				notifications: data.notifications.map((n) =>
					!id || n.id === id ? { ...n, read: true } : n,
				),
			},
			{ revalidate: false },
		);
		try {
			const res = await fetch("/api/user/notifications", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(id ? { id } : { all: true }),
			});
			if (!res.ok) throw new Error("Failed to update");
			await mutate();
		} catch {
			toast.error("Could not mark as read");
			await mutate(); // revert from server truth
		} finally {
			if (!id) setPendingRead(false);
		}
	}

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							tooltip={`Notifications${unread ? ` (${unread} unread)` : ""}`}
							className={cn(unread > 0 && "text-foreground", "cursor-pointer")}
							isActive={unread > 0}
							aria-label={`Notifications${unread ? ` (${unread} unread)` : ""}`}
						>
							<span className="relative">
								{unread > 0 ? (
									<BellRing className="size-4 text-primary" />
								) : (
									<Bell className="size-4" />
								)}
								{unread > 0 && (
									<span className="absolute -right-1.5 -top-1.5 grid min-w-4 place-items-center rounded-full bg-destructive px-1 text-[9px] font-bold leading-4 text-white">
										{unread > 9 ? "9+" : unread}
									</span>
								)}
							</span>
							<span>Notifications</span>
							<Badge
								variant="secondary"
								className="ml-auto shrink-0 tabular-nums"
							>
								{unread}
							</Badge>
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent side="right" align="start" className="w-80 p-0">
						<DropdownMenuLabel className="flex items-center justify-between">
							Notifications
							{unread > 0 && (
								<Button
									variant="ghost"
									size="sm"
									disabled={pendingRead}
									onClick={() => markRead()}
									className="h-6 cursor-pointer gap-1.5 px-1.5 text-[10px] uppercase tracking-wider text-muted-foreground hover:text-foreground"
								>
									<CheckCheck
										className={cn("size-3", pendingRead && "animate-pulse")}
									/>
									{pendingRead ? "Saving…" : "Mark all read"}
								</Button>
							)}
						</DropdownMenuLabel>
						<div className="max-h-80 overflow-y-auto">
							{items.length === 0 && (
								<p className="px-3 py-6 text-center text-muted-foreground text-sm">
									You&apos;re all caught up.
								</p>
							)}
							{items.map((n) => (
								<DropdownMenuItem
									key={n.id}
									onSelect={(e) => e.preventDefault()}
									onClick={() => !n.read && markRead(n.id)}
									className={cn(
										"flex-col cursor-pointer items-start gap-0.5 px-3 py-2.5",
										!n.read && "bg-primary/5",
									)}
								>
									<span
										className={cn(
											"text-xs",
											n.read
												? "text-muted-foreground"
												: "font-medium text-foreground",
										)}
									>
										{n.title}
									</span>
									{n.body && (
										<span className="line-clamp-2 text-[11px] text-muted-foreground">
											{n.body}
										</span>
									)}
								</DropdownMenuItem>
							))}
						</div>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
