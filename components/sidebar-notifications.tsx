"use client";

import { Bell, BellRing } from "lucide-react";
import { toast } from "sonner";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

	const unread = data?.unreadCount ?? 0;
	const items = data?.notifications ?? [];

	async function markRead(id?: string) {
		try {
			await fetch("/api/user/notifications/read", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(id ? { id } : { all: true }),
			});
			await mutate();
		} catch {
			toast.error("Could not update notifications");
		}
	}

	return (
		<div className="px-2 pb-1 group-data-[collapsible=icon]:px-0">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						className={cn(
							"w-full cursor-pointer justify-start gap-2 px-2 text-muted-foreground hover:text-foreground",
							"group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0",
						)}
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
						<span className="group-data-[collapsible=icon]:hidden">
							Notifications
						</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="start" side="right" className="w-80 p-0">
					<DropdownMenuLabel className="flex items-center justify-between">
						Notifications
						{unread > 0 && (
							<button
								type="button"
								onClick={() => markRead()}
								className="cursor-pointer text-[10px] uppercase tracking-wider text-muted-foreground hover:text-foreground"
							>
								Mark all read
							</button>
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
								onClick={() => markRead(n.id)}
								className={cn(
									"cursor-pointer flex-col items-start gap-0.5 px-3 py-2.5",
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
		</div>
	);
}
