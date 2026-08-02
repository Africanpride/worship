"use client";

import { createFetch } from "@better-fetch/fetch";
import { format } from "date-fns";
import {
	BookOpen,
	Check,
	Loader2,
	Settings,
	Shield,
	Sparkles,
	Star,
	Trash2,
	X,
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
} from "@/components/ui/alert-dialog";
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
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

const $fetch = createFetch({
	baseURL: "/api",
});

interface Reflection {
	id: string;
	userId: string;
	content: string;
	status: "pending" | "approved" | "archived";
	featured: boolean;
	createdAt: string;
	user: {
		name: string;
		email: string;
		image: string;
	};
}

export default function AdminReflectionsPage() {
	const [reflections, setReflections] = useState<Reflection[]>([]);
	const [loading, setLoading] = useState(true);
	const [deleteId, setDeleteId] = useState<string | null>(null);

	const fetchReflections = async () => {
		try {
			setLoading(true);
			const { data, error } = await $fetch<Reflection[]>("/admin/reflections");
			if (error) throw error;
			setReflections(data || []);
		} catch (err) {
			toast.error("Failed to load reflections");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchReflections();
	}, []);

	const updateStatus = async (id: string, status: string) => {
		try {
			const { error } = await $fetch("/admin/reflections", {
				method: "PATCH",
				body: { id, status },
			});
			if (error) throw error;
			toast.success(`Reflection ${status} successfully`);
			fetchReflections();
		} catch {
			toast.error("Failed to update status");
		}
	};

	const toggleFeatured = async (id: string, currentFeatured: boolean) => {
		try {
			const { error } = await $fetch("/admin/reflections", {
				method: "PATCH",
				body: { id, featured: !currentFeatured },
			});
			if (error) throw error;
			toast.success(
				currentFeatured ? "Removed from featured" : "Featured on public wall",
			);
			fetchReflections();
		} catch {
			toast.error("Failed to update featured status");
		}
	};

	const handleDelete = async () => {
		if (!deleteId) return;
		try {
			const { error } = await $fetch(`/admin/reflections?id=${deleteId}`, {
				method: "DELETE",
			});
			if (error) throw error;
			toast.success("Reflection deleted");
			fetchReflections();
		} catch {
			toast.error("Failed to delete reflection");
		} finally {
			setDeleteId(null);
		}
	};

	if (loading) {
		return (
			<div className="flex h-[50vh] w-full items-center justify-center">
				<Loader2 className="h-10 w-10 animate-spin text-primary" />
			</div>
		);
	}

	const pending = reflections.filter((r) => r.status === "pending");
	const approved = reflections.filter((r) => r.status === "approved");
	const archived = reflections.filter((r) => r.status === "archived");

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl  tracking-tight">Sacred Reflections</h1>
				<p className="text-muted-foreground mt-1">
					Moderate and manage testimonies from the 25th Anniversary Altar.
				</p>
			</div>

			<div className="grid gap-6 md:grid-cols-3">
				{/* Pending Queue */}
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<h2 className="font-bold flex items-center">
							Pending Review
							<Badge variant="secondary" className="ml-2">
								{pending.length}
							</Badge>
						</h2>
					</div>
					<div className="space-y-4">
						{pending.length === 0 && (
							<div className="border border-dashed rounded-xl p-8 text-center bg-muted/20">
								<Shield className="mx-auto h-8 w-8 text-muted-foreground/50 mb-2" />
								<p className="text-sm text-balance text-muted-foreground">
									Queue is clear.
								</p>
							</div>
						)}
						{pending.map((r) => (
							<ReflectionCard
								key={r.id}
								reflection={r}
								onApprove={() => updateStatus(r.id, "approved")}
								onArchive={() => updateStatus(r.id, "archived")}
								onDelete={() => setDeleteId(r.id)}
								onToggleFeature={() => toggleFeatured(r.id, r.featured)}
							/>
						))}
					</div>
				</div>

				{/* Approved Wall */}
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<h2 className="font-bold flex items-center text-emerald-500">
							Public Wall
							<Badge className="ml-2 bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30 border-none">
								{approved.length}
							</Badge>
						</h2>
					</div>
					<div className="space-y-4">
						{approved.map((r) => (
							<ReflectionCard
								key={r.id}
								reflection={r}
								onApprove={() => updateStatus(r.id, "approved")} // Handled dynamically in card
								onArchive={() => updateStatus(r.id, "archived")}
								onDelete={() => setDeleteId(r.id)}
								onToggleFeature={() => toggleFeatured(r.id, r.featured)}
							/>
						))}
					</div>
				</div>

				{/* Archived */}
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<h2 className="font-bold flex items-center text-muted-foreground">
							Archived
							<Badge variant="outline" className="ml-2">
								{archived.length}
							</Badge>
						</h2>
					</div>
					<div className="space-y-4 opacity-75">
						{archived.map((r) => (
							<ReflectionCard
								key={r.id}
								reflection={r}
								onApprove={() => updateStatus(r.id, "approved")}
								onArchive={() => updateStatus(r.id, "archived")}
								onDelete={() => setDeleteId(r.id)}
								onToggleFeature={() => toggleFeatured(r.id, r.featured)}
							/>
						))}
					</div>
				</div>
			</div>

			<AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Reflection</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure? This will permanently remove this testimony from the
							database.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDelete}
							className="bg-destructive hover:bg-destructive/90"
						>
							<Trash2 className="mr-2 h-4 w-4" /> Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}

function ReflectionCard({
	reflection,
	onApprove,
	onArchive,
	onDelete,
	onToggleFeature,
}: {
	reflection: Reflection;
	onApprove: () => void;
	onArchive: () => void;
	onDelete: () => void;
	onToggleFeature: () => void;
}) {
	const isPending = reflection.status === "pending";
	const isApproved = reflection.status === "approved";

	return (
		<Card className="relative overflow-hidden group p-2">
			{reflection.featured && (
				<div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 to-amber-600" />
			)}
			<CardHeader className="p-4 pb-2">
				<div className="flex justify-between items-start">
					<div className="flex items-center gap-3">
						<Avatar className="h-8 w-8">
							<AvatarImage src={reflection.user.image} />
							<AvatarFallback className="text-[10px]">
								{reflection.user.name?.[0]}
							</AvatarFallback>
						</Avatar>
						<div>
							<p className="text-sm font-bold leading-none">
								{reflection.user.name}
							</p>
							<p className="text-[10px] text-muted-foreground mt-0.5">
								{format(new Date(reflection.createdAt), "MMM d, h:mm a")}
							</p>
						</div>
					</div>
					{/* Actions Menu */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 cursor-pointer">
								<span className="sr-only">Open menu</span>
								<Settings className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Moderation</DropdownMenuLabel>
							<DropdownMenuSeparator />
							{!isApproved && (
								<DropdownMenuItem onClick={onApprove}>
									<Check className="mr-2 h-4 w-4 text-emerald-500" /> Approve
								</DropdownMenuItem>
							)}
							{isApproved && (
								<DropdownMenuItem onClick={onArchive}>
									<X className="mr-2 h-4 w-4 text-muted-foreground" /> Archive
								</DropdownMenuItem>
							)}
							{!isPending && !isApproved && (
								<DropdownMenuItem onClick={onApprove}>
									<Check className="mr-2 h-4 w-4 text-emerald-500" /> Restore to
									Wall
								</DropdownMenuItem>
							)}

							{isApproved && (
								<DropdownMenuItem onClick={onToggleFeature}>
									<Star
										className={`mr-2 h-4 w-4 ${reflection.featured ? "fill-amber-500 text-amber-500" : ""}`}
									/>
									{reflection.featured ? "Remove Feature" : "Feature on Wall"}
								</DropdownMenuItem>
							)}

							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={onDelete} className="text-destructive">
								<Trash2 className="mr-2 h-4 w-4" /> Delete
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</CardHeader>
			<CardContent className="p-4 pt-0">
				<p className="text-sm italic text-muted-foreground whitespace-pre-wrap leading-relaxed">
					"{reflection.content}"
				</p>

				<div className="mt-4 flex items-center justify-between border-t pt-3">
					<Badge
						variant="outline"
						className={`text-[10px] uppercase font-bold tracking-widest border-none ${isPending ? "bg-amber-500/10 text-amber-500" : isApproved ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground"}`}
					>
						{reflection.status}
					</Badge>
					{reflection.featured && (
						<Badge
							variant="secondary"
							className="text-[9px] uppercase tracking-widest bg-amber-500/20 text-amber-600 hover:bg-amber-500/30"
						>
							<Sparkles className="size-3 mr-1" /> Featured
						</Badge>
					)}

					{isPending && (
						<div className="flex gap-1 ml-auto">
							<Button
								size="icon"
								variant="ghost"
								className="h-7 w-7 bg-emerald-500/10 hover:bg-emerald-500/20"
								onClick={onApprove}
							>
								<Check className="size-3.5 text-emerald-600" />
							</Button>
							<Button
								size="icon"
								variant="ghost"
								className="h-7 w-7 text-muted-foreground"
								onClick={onArchive}
							>
								<X className="size-3.5" />
							</Button>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
