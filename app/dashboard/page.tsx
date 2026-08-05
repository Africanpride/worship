"use client";

import { createFetch } from "@better-fetch/fetch";
import { format } from "date-fns";
import {
	Activity,
	ArrowUpRight,
	Calendar,
	ExternalLink,
	Heart,
	Loader2,
	PlusCircle,
	ShieldCheck,
	Users,
	Video,
	Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

const $fetch = createFetch({
	baseURL: "/api",
});

interface DashboardData {
	stats: {
		totalUsers: number;
		totalVolunteers: number;
		totalEvents: number;
		upcomingEventsCount: number;
	};
	recentUsers: any[];
	upcomingEvents: any[];
	heroSettings: any;
}

export default function DashboardPage() {
	const [data, setData] = useState<DashboardData | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchStats() {
			try {
				const { data: statsData, error } =
					await $fetch<DashboardData>("/admin/stats");
				if (error) throw error;
				setData(statsData);
			} catch (err) {
				toast.error("Failed to load dashboard metrics");
				console.error(err);
			} finally {
				setLoading(false);
			}
		}
		fetchStats();
	}, []);

	if (loading) {
		return (
			<div className="flex h-[80vh] w-full items-center justify-center">
				<Loader2 className="h-10 w-10 animate-spin text-primary" />
			</div>
		);
	}

	const statsCards = [
		{
			title: "Total Members",
			value: data?.stats.totalUsers || 0,
			icon: Users,
			description: "People joined ",
			color: "text-blue-500",
			bg: "bg-blue-500/10",
			link: "/dashboard/admin/users",
		},
		{
			title: "Active Volunteers",
			value: data?.stats.totalVolunteers || 0,
			icon: Heart,
			description: "Serving across different areas",
			color: "text-rose-500",
			bg: "bg-rose-500/10",
			link: "/dashboard/admin/volunteers",
		},
		{
			title: "Upcoming Events",
			value: data?.stats.upcomingEventsCount || 0,
			icon: Calendar,
			description: "Ministrations scheduled soon",
			color: "text-amber-500",
			bg: "bg-amber-500/10",
			link: "/dashboard/admin/events",
		},
		{
			title: "Live Stream",
			value: "Active",
			icon: Zap,
			description: `Current ID: ${data?.heroSettings?.videoId || "Not set"}`,
			color: "text-emerald-500",
			bg: "bg-emerald-500/10",
			link: "/dashboard/admin/hero",
		},
	];

	return (
		<div className="space-y-8 animate-in fade-in duration-500">
			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<div>
					<h1 className="text-3xl ">Jubilee Mission Control</h1>
					<p className="text-muted-foreground mt-1 font-medium">
						Directing the 25th Anniversary Altar: Overview of your ministry's
						reach.
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Button asChild className="rounded-full shadow-lg shadow-primary/20">
						<Link href="/dashboard/admin/events" className="cursor-pointer">
							<PlusCircle className="mr-2 h-4 w-4" />
							New Ministration
						</Link>
					</Button>
					<Button variant="outline" className="rounded-full" asChild>
						<a
							href="/"
							target="_blank"
							rel="noopener"
							className="cursor-pointer"
						>
							<ExternalLink className="mr-2 h-4 w-4" />
							Public View
						</a>
					</Button>
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{statsCards.map((stat) => (
					<Card
						key={stat.title}
						className="hover:shadow-md transition-all border-muted/50 p-3"
					>
						<CardHeader className="flex flex-row items-center justify-between pb-2">
							<CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
								{stat.title}
							</CardTitle>
							<div className={`${stat.bg} ${stat.color} p-2 rounded-lg`}>
								<stat.icon className="h-4 w-4" />
							</div>
						</CardHeader>
						<CardContent>
							<div className="text-3xl font-black">{stat.value}</div>
							<p className="text-[11px] text-muted-foreground mt-1 font-medium flex items-center">
								<Activity className="size-3 mr-1 text-emerald-500" />
								{stat.description}
							</p>
							<Link
								href={stat.link}
								className="mt-4 flex items-center text-[11px] font-bold text-primary group hover:underline cursor-pointer"
							>
								Manage {stat.title.split(" ")[1] || stat.title}
								<ArrowUpRight className="ml-1 size-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
							</Link>
						</CardContent>
					</Card>
				))}
			</div>

			<div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
				{/* Recent Members */}
				<Card className="lg:col-span-4 border-muted/50 p-2">
					<CardHeader className="flex flex-row items-center justify-between">
						<div>
							<CardTitle className="text-xl">Recent Fire Starters</CardTitle>
							<CardDescription>
								Latest worshippers to join the altar.
							</CardDescription>
						</div>
						<Button variant="ghost" size="sm" asChild>
							<Link href="/dashboard/admin/users" className="cursor-pointer">
								View All
							</Link>
						</Button>
					</CardHeader>
					<CardContent>
						<div className="space-y-6">
							{data?.recentUsers.map((user) => (
								<div
									key={user.id}
									className="flex items-center justify-between"
								>
									<div className="flex items-center gap-4">
										<Avatar className="h-10 w-10 border border-muted/50">
											<AvatarImage src={user.image} />
											<AvatarFallback className="font-bold bg-muted">
												{user.name?.[0].toUpperCase() || "U"}
											</AvatarFallback>
										</Avatar>
										<div className="space-y-1">
											<p className="text-sm font-bold leading-none">
												{user.name}
											</p>
											<p className="text-xs text-muted-foreground">
												{user.email}
											</p>
										</div>
									</div>
									<div className="flex flex-col items-end gap-1">
										<Badge
											variant={user.role === "admin" ? "default" : "secondary"}
											className="h-5 text-[10px] uppercase font-bold tracking-widest"
										>
											{user.role}
										</Badge>
										<time className="text-[10px] text-muted-foreground italic">
											Joined {format(new Date(user.createdAt), "MMM d, h:mm a")}
										</time>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{/* Upcoming Ministrations */}
				<Card className="lg:col-span-3 border-muted/50 bg-muted/20 p-2">
					<CardHeader>
						<CardTitle className="text-xl">Upcoming Ministrations</CardTitle>
						<CardDescription>
							Sacrifice of praise on the calendar.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{data?.upcomingEvents.length === 0 ? (
								<div className="flex flex-col items-center justify-center py-8 text-center bg-background rounded-xl border border-dashed">
									<Calendar className="h-10 w-10 text-muted/30 mb-2" />
									<p className="text-sm text-balance text-muted-foreground px-4">
										No upcoming events scheduled. Time to gather the
										worshippers!
									</p>
								</div>
							) : (
								data?.upcomingEvents.map((event) => (
									<div
										key={event.id}
										className="relative overflow-hidden rounded-xl border bg-background p-4 hover:shadow-sm transition-all group"
									>
										<div className="flex items-start justify-between">
											<div className="space-y-1 pr-12">
												<h4 className="font-bold leading-tight">
													{event.title}
												</h4>
												<p className="text-xs text-muted-foreground flex items-center">
													<Calendar className="mr-1 size-3" />
													{format(new Date(event.startDate), "EEEE, MMM d")}
												</p>
											</div>
											<Badge className="absolute top-4 right-4 h-6 uppercase font-black text-[9px] tracking-widest">
												Live
											</Badge>
										</div>
										<Link
											href={`/dashboard/admin/events`}
											className="mt-3 flex items-center text-[10px] font-bold text-primary group hover:underline cursor-pointer"
										>
											Event Details
											<ArrowUpRight className="ml-1 size-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
										</Link>
									</div>
								))
							)}
							<Button
								variant="outline"
								className="w-full mt-4 border-dashed rounded-xl"
								asChild
							>
								<Link href="/dashboard/admin/events" className="cursor-pointer">
									Manage Full Schedule
								</Link>
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
