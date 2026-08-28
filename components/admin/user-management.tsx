"use client";

import { createFetch } from "@better-fetch/fetch";
import {
	Ban,
	Loader2,
	Shield,
	ShieldAlert,
	Trash2,
	Undo2,
	User as UserIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
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

	return (
		<div className="w-full">
			<div className="flex justify-between items-center mb-8">
				<div>
					<h1 className="text-3xl">User Management</h1>
					<p className="text-muted-foreground">
						Manage user roles, bans, and account deletion.
					</p>
				</div>
			</div>

			<div className="rounded-md border bg-card/50 backdrop-blur-sm">
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
										<div className="flex items-center gap-3">
											<Avatar className="h-9 w-9 border-2 border-background shadow-sm">
												<AvatarImage
													src={
														(user.profile?.avatarUrl as string) ||
														user.image ||
														""
													}
													alt={user.name}
													className="object-cover"
												/>
												<AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
													{getInitials(user.name)}
												</AvatarFallback>
											</Avatar>
											<div>
												<div className="flex items-center gap-2">
													<span className="truncate max-w-[150px]">
														{user.name}
													</span>
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
												{user.profile?.volunteerAreas &&
													user.profile.volunteerAreas.length > 0 && (
														<div className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1 italic">
															{user.profile.volunteerAreas.join(", ")}
														</div>
													)}
											</div>
										</div>
									</TableCell>
									<TableCell>{user.email}</TableCell>
									<TableCell>
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
												<Badge variant="destructive" className="ml-2">
													Deletion Requested
												</Badge>
											)}
										</div>
									</TableCell>
									<TableCell className="text-right px-4">
										<div className="flex items-center justify-end gap-2">
											<Select
												defaultValue={user.role}
												onValueChange={(val: string) =>
													onRoleChange(user.id, val)
												}
											>
												<SelectTrigger className="w-[110px]">
													<SelectValue placeholder="Role" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="user">User</SelectItem>
													<SelectItem value="admin">Admin</SelectItem>
												</SelectContent>
											</Select>

											<Button
												variant="outline"
												size="icon"
												className={
													user.banned
														? "text-primary border-primary hover:bg-primary/10"
														: "text-destructive border-destructive/30 hover:bg-destructive/10"
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

											<AlertDialog>
												<AlertDialogTrigger asChild>
													<Button
														variant="ghost"
														size="icon"
														className="text-destructive hover:bg-destructive/10"
														title="Delete User"
													>
														<Trash2 className="h-4 w-4" />
													</Button>
												</AlertDialogTrigger>
												<AlertDialogContent>
													<AlertDialogHeader>
														<AlertDialogTitle>Delete User</AlertDialogTitle>
														<AlertDialogDescription>
															Are you sure you want to PERMANENTLY delete this
															user? This action cannot be undone.
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
										</div>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
