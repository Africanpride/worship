"use client";

import { createFetch } from "@better-fetch/fetch";
import { format } from "date-fns";
import {
	Ban,
	History,
	Loader2,
	Shield,
	ShieldAlert,
	Trash2,
	Undo2,
	User as UserIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";
import { CollapsibleCard } from "@/components/shadcn-space/collapsible/collapsible-card";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

interface User {
	id: string;
	name: string;
	email: string;
	role: string;
	image: string | null;
	banned: boolean | null;
	pendingDeletion: boolean | null;
	createdAt: string;
	profile?: {
		volunteerAreas: string[];
		avatarUrl?: string | null;
	} | null;
}

const $fetch = createFetch({
	baseURL: "/api",
});

interface AuditHistoryEntry {
	id: string;
	createdAt: string;
	action: string;
	actorName: string;
	before?: Record<string, unknown> | null;
	after?: Record<string, unknown> | null;
}

async function auditFetcher<T>(url: string): Promise<T> {
	const res = await fetch(url);
	if (!res.ok) throw new Error("Failed to load audit history");
	return res.json();
}

function AuditHistoryButton({ user }: { user: User }) {
	const [open, setOpen] = useState(false);
	const { data, isLoading, error } = useSWR<{ items: AuditHistoryEntry[] }>(
		open ? `/api/admin/audit/entity?type=user&id=${user.id}` : null,
		auditFetcher,
	);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<Button
				variant="ghost"
				size="icon"
				className="cursor-pointer"
				title="Audit History"
				onClick={() => setOpen(true)}
			>
				<History className="h-4 w-4" />
				<span className="sr-only">Audit History</span>
			</Button>
			<DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden">
				<DialogHeader className="border-b px-6 py-4 space-y-0.5">
					<DialogTitle className="text-sm font-medium">
						Audit History
					</DialogTitle>
					<DialogDescription className="text-xs text-muted-foreground">
						Admin actions performed on {user.email}, newest first.
					</DialogDescription>
				</DialogHeader>
				<div className="max-h-[60vh] overflow-y-auto px-6 py-4">
					{isLoading && (
						<p className="py-6 text-center text-sm text-muted-foreground">
							Loading audit history…
						</p>
					)}
					{error && (
						<p className="py-6 text-center text-sm text-destructive">
							Failed to load audit history.
						</p>
					)}
					{!isLoading && !error && (data?.items.length ?? 0) === 0 && (
						<p className="py-6 text-center text-sm text-muted-foreground">
							No recorded admin actions for this user yet.
						</p>
					)}
					<ol className="space-y-3">
						{(data?.items ?? []).map((entry) => (
							<li key={entry.id}>
								<div className="flex flex-wrap items-center gap-2">
									<span className="font-mono text-xs tabular-nums text-muted-foreground">
										{format(new Date(entry.createdAt), "d MMM · HH:mm")}
									</span>
									<Badge variant="outline" className="px-1.5 py-0 text-[10px]">
										{entry.actorName}
									</Badge>
									<Badge
										variant="outline"
										className="bg-muted px-1.5 py-0 font-mono text-[10px]"
									>
										{entry.action}
									</Badge>
								</div>
								<p className="mt-0.5 text-sm">
									{Object.keys(entry.before ?? {}).length > 0 ||
									Object.keys(entry.after ?? {}).length > 0
										? Object.entries(entry.after ?? {})
												.map(
													([key, value]) =>
														`${key}: ${JSON.stringify(entry.before?.[key] ?? null)} → ${JSON.stringify(value)}`,
												)
												.join(" · ")
										: "Recorded without field changes"}
								</p>
							</li>
						))}
					</ol>
				</div>
			</DialogContent>
		</Dialog>
	);
}

export function UserManagement() {
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);

	const fetchUsers = async () => {
		try {
			setLoading(true);
			const { data, error } = await $fetch<User[]>("/admin/users");
			if (error) throw error;
			setUsers(data || []);
		} catch (error) {
			toast.error("Failed to load users");
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	const onRoleChange = async (userId: string, newRole: string) => {
		try {
			const { error } = await $fetch("/admin/users", {
				method: "PATCH",
				body: { id: userId, role: newRole },
			});
			if (error) throw error;
			toast.success("User role updated successfully");
			fetchUsers();
		} catch (error) {
			toast.error("Failed to update user role");
			console.error(error);
		}
	};

	const onToggleBan = async (user: User) => {
		try {
			const { error } = await $fetch("/admin/users", {
				method: "PATCH",
				body: { id: user.id, banned: !user.banned },
			});
			if (error) throw error;
			toast.success(
				user.banned ? "User unbanned successfully" : "User banned successfully",
			);
			fetchUsers();
		} catch (error) {
			toast.error("Failed to update ban status");
			console.error(error);
		}
	};

	const onRevokeDeletion = async (userId: string) => {
		try {
			const { error } = await $fetch("/admin/users", {
				method: "PATCH",
				body: { id: userId, pendingDeletion: false },
			});
			if (error) throw error;
			toast.success("Deletion request revoked successfully");
			fetchUsers();
		} catch (error) {
			toast.error("Failed to revoke deletion request");
			console.error(error);
		}
	};

	const onDeleteUser = async (userId: string) => {
		try {
			const { error } = await $fetch(`/admin/users?id=${userId}`, {
				method: "DELETE",
			});
			if (error) throw error;
			toast.success("User deleted successfully");
			fetchUsers();
		} catch (error) {
			toast.error("Failed to delete user");
			console.error(error);
		}
	};

	const getInitials = (name?: string | null) => {
		if (!name) return "U";
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	const userIdentity = (user: User, showAreas: boolean) => (
		<div className="flex items-center gap-3">
			<Avatar className="h-9 w-9 border-2 border-background shadow-sm">
				<AvatarImage
					src={(user.profile?.avatarUrl as string) || user.image || ""}
					alt={user.name}
					className="object-cover"
				/>
				<AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
					{getInitials(user.name)}
				</AvatarFallback>
			</Avatar>
			<div>
				<div className="flex items-center gap-2">
					<span className="truncate max-w-[150px]">{user.name}</span>
					{user.role === "admin" && (
						<Shield className="h-3 w-3 text-primary shrink-0" />
					)}
					{user.profile?.volunteerAreas &&
						user.profile.volunteerAreas.length > 0 && (
							<Badge
								variant="secondary"
								className="text-[10px] h-4 px-1.5 font-bold uppercase bg-warning/20 text-warning-foreground border-warning/30 hover:bg-warning/30 transition-colors shrink-0"
							>
								Volunteer
							</Badge>
						)}
				</div>
				{showAreas &&
					user.profile?.volunteerAreas &&
					user.profile.volunteerAreas.length > 0 && (
						<div className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1 italic">
							{user.profile.volunteerAreas.join(", ")}
						</div>
					)}
			</div>
		</div>
	);

	const statusRow = (user: User) => (
		<div className="flex items-center gap-2">
			{user.banned ? (
				<div className="flex items-center gap-1.5 text-destructive text-sm font-medium">
					<ShieldAlert className="h-4 w-4" />
					Banned
				</div>
			) : (
				<div className="flex items-center gap-1.5 text-green-500 text-sm font-medium">
					<Shield className="h-4 w-4" />
					Active
				</div>
			)}
			{user.pendingDeletion && (
				<Badge variant="destructive">Deletion Requested</Badge>
			)}
		</div>
	);

	const roleSelect = (user: User, selectClassName: string) => (
		<Select
			defaultValue={user.role}
			onValueChange={(val: string) => onRoleChange(user.id, val)}
		>
			<SelectTrigger className={selectClassName}>
				<SelectValue placeholder="Role" />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="user">User</SelectItem>
				<SelectItem value="admin">Admin</SelectItem>
			</SelectContent>
		</Select>
	);

	const userButtons = (user: User) => (
		<>
			<Button
				variant="outline"
				size="icon"
				className={
					user.banned
						? "cursor-pointer text-primary border-primary hover:bg-primary/10"
						: "cursor-pointer text-destructive border-destructive/30 hover:bg-destructive/10"
				}
				onClick={() => onToggleBan(user)}
				title={user.banned ? "Unban User" : "Ban User"}
			>
				<Ban className="h-4 w-4" />
			</Button>

			{user.pendingDeletion && (
				<Button
					variant="outline"
					size="icon"
					className="text-orange-500 border-orange-500/30 hover:bg-orange-500/10"
					onClick={() => onRevokeDeletion(user.id)}
					title="Revoke Deletion Request"
				>
					<Undo2 className="h-4 w-4" />
				</Button>
			)}

			<AuditHistoryButton user={user} />

			<AlertDialog>
				<AlertDialogTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						className="cursor-pointer text-destructive hover:bg-destructive/10"
						title="Delete User"
					>
						<Trash2 className="h-4 w-4" />
					</Button>
				</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete User</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to PERMANENTLY delete this user? This action
							cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => onDeleteUser(user.id)}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);

	return (
		<div className="w-full">
			<div className="flex flex-wrap justify-between items-center gap-3 mb-8">
				<div>
					<h1 className="text-3xl">User Management</h1>
					<p className="text-muted-foreground">
						Manage user roles, bans, and account deletion.
					</p>
				</div>
			</div>

			<div className="hidden md:block rounded-md border bg-card/50 backdrop-blur-sm">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>User</TableHead>
							<TableHead>Email</TableHead>
							<TableHead>Status</TableHead>
							<TableHead className="text-right px-4">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{loading ? (
							<TableRow>
								<TableCell colSpan={4} className="h-24 text-center">
									<Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
								</TableCell>
							</TableRow>
						) : users.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={4}
									className="h-24 text-center text-muted-foreground"
								>
									No users found.
								</TableCell>
							</TableRow>
						) : (
							users.map((user) => (
								<TableRow key={user.id}>
									<TableCell className="font-medium">
										{userIdentity(user, true)}
									</TableCell>
									<TableCell>{user.email}</TableCell>
									<TableCell>{statusRow(user)}</TableCell>
									<TableCell className="text-right px-4">
										<div className="flex flex-wrap items-center justify-end gap-2">
											{roleSelect(user, "w-[110px]")}
											{userButtons(user)}
										</div>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			<div className="md:hidden space-y-3">
				{loading ? (
					<div className="flex h-24 items-center justify-center rounded-md border bg-card/50 backdrop-blur-sm">
						<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
					</div>
				) : users.length === 0 ? (
					<div className="flex h-24 items-center justify-center rounded-md border bg-card/50 backdrop-blur-sm text-sm text-muted-foreground">
						No users found.
					</div>
				) : (
					users.map((user) => (
						<CollapsibleCard
							key={user.id}
							trigger={
								<>
									{userIdentity(user, false)}
									{statusRow(user)}
								</>
							}
						>
							<div className="flex items-start justify-between gap-3 text-sm">
								<span className="shrink-0 text-muted-foreground">Email</span>
								<span className="min-w-0 break-all text-right">
									{user.email}
								</span>
							</div>
							{user.profile?.volunteerAreas &&
								user.profile.volunteerAreas.length > 0 && (
									<div className="text-xs italic text-muted-foreground line-clamp-2">
										{user.profile.volunteerAreas.join(", ")}
									</div>
								)}
							<div className="flex flex-wrap items-center justify-end gap-2">
								{roleSelect(user, "w-full")}
								{userButtons(user)}
							</div>
						</CollapsibleCard>
					))
				)}
			</div>
		</div>
	);
}
