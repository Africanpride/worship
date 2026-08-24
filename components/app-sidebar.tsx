"use client";

import {
	BookOpen,
	Calendar,
	Clock,
	Heart,
	LayoutDashboard,
	Settings,
	TerminalIcon,
	Users,
	Video,
} from "lucide-react";
import type * as React from "react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar";
import { useCurrentSession } from "@/lib/use-current-session";

const defaultData = {
	user: {
		name: "User",
		email: "user@example.com",
		avatar: "/avatars/default.jpg",
	},
	navMain: [
		{
			title: "Dashboard",
			url: "/dashboard",
			icon: <LayoutDashboard />,
			isActive: true,
			adminOnly: false,
		},
		{
			title: "Video Management",
			url: "/dashboard/admin",
			icon: <Video />,
			adminOnly: true,
		},
		{
			title: "Event Management",
			url: "/dashboard/admin/events",
			icon: <Calendar />,
			adminOnly: true,
		},
		{
			title: "Bookings and Slots",
			url: "/dashboard/admin/bookings",
			icon: <Clock />,
			adminOnly: true,
		},
		{
			title: "Application Logs",
			url: "/dashboard/admin/logs",
			icon: <TerminalIcon />,
			adminOnly: true,
		},
		{
			title: "Volunteer Management",
			url: "/dashboard/admin/volunteers",
			icon: <Heart />,
			adminOnly: true,
		},
		{
			title: "Hero Settings",
			url: "/dashboard/admin/hero",
			icon: <Settings />,
			adminOnly: true,
		},
		{
			title: "User Management",
			url: "/dashboard/admin/users",
			icon: <Users />,
			adminOnly: true,
		},
		{
			title: "Reflections",
			url: "/dashboard/admin/reflections",
			icon: <BookOpen />,
			adminOnly: true,
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { user } = useCurrentSession();

	const userData = {
		name: user?.name || defaultData.user.name,
		email: user?.email || defaultData.user.email,
		avatar: user?.image || defaultData.user.avatar,
	};

	const filteredNavMain = defaultData.navMain.filter((item) => {
		if (item.adminOnly) {
			return user?.role === "admin";
		}
		return true;
	});

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader className="flex h-auto border-b justify-center px-2 group-data-[collapsible=icon]:justify-start">
				<div className="flex min-w-0 gap-3">
					<div className="flex shrink-0 aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
						<TerminalIcon className="size-4" />
					</div>
					<div className="flex min-w-0 flex-col gap-0.5 leading-none transition-all duration-300 group-data-[collapsible=icon]:hidden group-data-[collapsible=icon]:group-hover:flex">
						<span className="truncate font-semibold">Worship Admin</span>
						<span className="truncate text-xs text-muted-foreground">
							v0.1.0
						</span>
					</div>
				</div>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={filteredNavMain} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={userData} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
