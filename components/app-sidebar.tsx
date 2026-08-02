"use client";

import {
	BookOpen,
	Calendar,
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
			<SidebarHeader className="flex  justify-center h-16 border-b">
				<div className="flex items-center gap-2 py-2">
					<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
						<TerminalIcon className="size-4" />
					</div>
					<div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
						<span className="font-semibold">Worship Admin</span>
						<span className="text-xs text-muted-foreground">v0.1.0</span>
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
