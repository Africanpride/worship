"use client";

import { createFetch } from "@better-fetch/fetch";
import { format } from "date-fns";
import {
	BookOpen,
	Check,
	Loader2,
	Pencil,
	Plus,
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
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const $fetch = createFetch({
	baseURL: "/api",
});

interface BlogPost {
	id: string;
	title: string;
	slug: string;
	category: string;
	excerpt: string;
	content: string;
	image?: string | null;
	author?: string | null;
	featured: boolean;
	published: boolean;
	publishedAt?: string | null;
	createdAt: string;
}

interface BlogFormData {
	title: string;
	slug: string;
	category: string;
	excerpt: string;
	content: string;
	image: string;
	author: string;
	featured: boolean;
	published: boolean;
}

const defaultFormData: BlogFormData = {
	title: "",
	slug: "",
	category: "Devotional",
	excerpt: "",
	content: "",
	image: "",
	author: "",
	featured: false,
	published: false,
};

const categories = ["Devotional", "Teaching", "Vision", "Testimony", "Update"];

export function BlogManagement() {
	const [posts, setPosts] = useState<BlogPost[]>([]);
	const [loading, setLoading] = useState(true);
	const [deleteId, setDeleteId] = useState<string | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
	const [formData, setFormData] = useState<BlogFormData>(defaultFormData);
	const [saving, setSaving] = useState(false);

	const fetchPosts = async () => {
		try {
			setLoading(true);
			const { data, error } = await $fetch<BlogPost[]>("/blog");
			if (error) throw error;
			setPosts(data || []);
		} catch {
			toast.error("Failed to load blog posts");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchPosts();
	}, []);

	const openCreateDialog = () => {
		setEditingPost(null);
		setFormData(defaultFormData);
		setIsDialogOpen(true);
	};

	const openEditDialog = (post: BlogPost) => {
		setEditingPost(post);
		setFormData({
			title: post.title,
			slug: post.slug,
			category: post.category,
			excerpt: post.excerpt,
			content: post.content,
			image: post.image || "",
			author: post.author || "",
			featured: post.featured,
			published: post.published,
		});
		setIsDialogOpen(true);
	};

	const handleSave = async () => {
		try {
			setSaving(true);
			const payload = {
				...formData,
				image: formData.image || null,
				author: formData.author || null,
			};

			if (editingPost) {
				const { error } = await $fetch(`/blog/${editingPost.id}`, {
					method: "PUT",
					body: payload,
				});
				if (error) throw error;
				toast.success("Post updated successfully");
			} else {
				const { error } = await $fetch("/blog", {
					method: "POST",
					body: payload,
				});
				if (error) throw error;
				toast.success("Post created successfully");
			}
			setIsDialogOpen(false);
			fetchPosts();
		} catch {
			toast.error(
				editingPost ? "Failed to update post" : "Failed to create post",
			);
		} finally {
			setSaving(false);
		}
	};

	const handleDelete = async () => {
		if (!deleteId) return;
		try {
			const { error } = await $fetch(`/blog/${deleteId}`, {
				method: "DELETE",
			});
			if (error) throw error;
			toast.success("Post deleted");
			fetchPosts();
		} catch {
			toast.error("Failed to delete post");
		} finally {
			setDeleteId(null);
		}
	};

	const generateSlug = (title: string) => {
		return title
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/(^-|-$)/g, "");
	};

	const handleTitleChange = (title: string) => {
		setFormData((prev) => ({
			...prev,
			title,
			slug: editingPost ? prev.slug : generateSlug(title),
		}));
	};

	if (loading) {
		return (
			<div className="flex h-[50vh] w-full items-center justify-center">
				<Loader2 className="h-10 w-10 animate-spin text-primary" />
			</div>
		);
	}

	const published = posts.filter((p) => p.published);
	const drafts = posts.filter((p) => !p.published);

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl tracking-tight">Blog Management</h1>
					<p className="text-muted-foreground mt-1">
						Manage devotionals, teachings, and reflections for the altar.
					</p>
				</div>
				<Button onClick={openCreateDialog} className="gap-2">
					<Plus className="h-4 w-4" /> New Post
				</Button>
			</div>

			<div className="grid gap-6 md:grid-cols-2">
				{/* Published */}
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<h2 className="font-bold flex items-center">
							Published
							<Badge variant="secondary" className="ml-2">
								{published.length}
							</Badge>
						</h2>
					</div>
					<div className="space-y-4">
						{published.length === 0 && (
							<div className="border border-dashed rounded-xl p-8 text-center bg-muted/20">
								<BookOpen className="mx-auto h-8 w-8 text-muted-foreground/50 mb-2" />
								<p className="text-sm text-balance text-muted-foreground">
									No published posts yet.
								</p>
							</div>
						)}
						{published.map((post) => (
							<PostCard
								key={post.id}
								post={post}
								onEdit={() => openEditDialog(post)}
								onDelete={() => setDeleteId(post.id)}
							/>
						))}
					</div>
				</div>

				{/* Drafts */}
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<h2 className="font-bold flex items-center text-muted-foreground">
							Drafts
							<Badge variant="outline" className="ml-2">
								{drafts.length}
							</Badge>
						</h2>
					</div>
					<div className="space-y-4 opacity-75">
						{drafts.map((post) => (
							<PostCard
								key={post.id}
								post={post}
								onEdit={() => openEditDialog(post)}
								onDelete={() => setDeleteId(post.id)}
							/>
						))}
					</div>
				</div>
			</div>

			{/* Create/Edit Dialog */}
			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>
							{editingPost ? "Edit Post" : "Create New Post"}
						</DialogTitle>
						<DialogDescription>
							{editingPost
								? "Update the blog post details below."
								: "Fill in the details for your new blog post."}
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-4 py-4">
						<div className="space-y-2">
							<Label htmlFor="title">Title</Label>
							<Input
								id="title"
								value={formData.title}
								onChange={(e) => handleTitleChange(e.target.value)}
								placeholder="Post title"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="slug">Slug</Label>
							<Input
								id="slug"
								value={formData.slug}
								onChange={(e) =>
									setFormData((prev) => ({ ...prev, slug: e.target.value }))
								}
								placeholder="post-url-slug"
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="category">Category</Label>
								<select
									id="category"
									value={formData.category}
									onChange={(e) =>
										setFormData((prev) => ({
											...prev,
											category: e.target.value,
										}))
									}
									className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
								>
									{categories.map((cat) => (
										<option key={cat} value={cat}>
											{cat}
										</option>
									))}
								</select>
							</div>

							<div className="space-y-2">
								<Label htmlFor="author">Author</Label>
								<Input
									id="author"
									value={formData.author}
									onChange={(e) =>
										setFormData((prev) => ({ ...prev, author: e.target.value }))
									}
									placeholder="Author name"
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="image">Image URL</Label>
							<Input
								id="image"
								value={formData.image}
								onChange={(e) =>
									setFormData((prev) => ({ ...prev, image: e.target.value }))
								}
								placeholder="/nonstop/nonstop-003.jpg"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="excerpt">Excerpt</Label>
							<Textarea
								id="excerpt"
								value={formData.excerpt}
								onChange={(e) =>
									setFormData((prev) => ({ ...prev, excerpt: e.target.value }))
								}
								placeholder="Brief summary of the post"
								rows={2}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="content">Content (HTML)</Label>
							<Textarea
								id="content"
								value={formData.content}
								onChange={(e) =>
									setFormData((prev) => ({ ...prev, content: e.target.value }))
								}
								placeholder="Full post content (HTML supported)"
								rows={10}
								className="font-mono text-sm"
							/>
						</div>

						<div className="flex items-center gap-6">
							<label className="flex items-center gap-2">
								<input
									type="checkbox"
									checked={formData.published}
									onChange={(e) =>
										setFormData((prev) => ({
											...prev,
											published: e.target.checked,
										}))
									}
									className="rounded border-input"
								/>
								<span className="text-sm">Published</span>
							</label>

							<label className="flex items-center gap-2">
								<input
									type="checkbox"
									checked={formData.featured}
									onChange={(e) =>
										setFormData((prev) => ({
											...prev,
											featured: e.target.checked,
										}))
									}
									className="rounded border-input"
								/>
								<span className="text-sm">Featured</span>
							</label>
						</div>
					</div>

					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setIsDialogOpen(false)}
							disabled={saving}
						>
							Cancel
						</Button>
						<Button onClick={handleSave} disabled={saving}>
							{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							{editingPost ? "Update" : "Create"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Delete Confirmation */}
			<AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Post</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure? This will permanently remove this post from the
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

function PostCard({
	post,
	onEdit,
	onDelete,
}: {
	post: BlogPost;
	onEdit: () => void;
	onDelete: () => void;
}) {
	const dateStr = post.publishedAt
		? format(new Date(post.publishedAt), "MMM d, yyyy")
		: "";

	return (
		<Card className="relative overflow-hidden group p-2">
			{post.featured && (
				<div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 to-amber-600" />
			)}
			<CardHeader className="p-4 pb-2">
				<div className="flex justify-between items-start">
					<div className="flex-1 min-w-0">
						<div className="flex items-center gap-2">
							<span className="text-amber-500 text-xs font-mono font-bold uppercase">
								{post.category}
							</span>
							{dateStr && (
								<span className="text-xs text-muted-foreground">
									• {dateStr}
								</span>
							)}
						</div>
						<CardTitle className="text-lg mt-1 line-clamp-1">
							{post.title}
						</CardTitle>
						<CardDescription className="line-clamp-1 mt-1">
							{post.excerpt}
						</CardDescription>
					</div>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
								<span className="sr-only">Open menu</span>
								<Settings className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Actions</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={onEdit}>
								<Pencil className="mr-2 h-4 w-4" /> Edit
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={onDelete} className="text-destructive">
								<Trash2 className="mr-2 h-4 w-4" /> Delete
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</CardHeader>
			<CardContent className="p-4 pt-0">
				<div className="flex items-center justify-between border-t pt-3">
					<Badge
						variant="outline"
						className={`text-[10px] uppercase font-bold tracking-widest border-none ${
							post.published
								? "bg-emerald-500/10 text-emerald-500"
								: "bg-muted text-muted-foreground"
						}`}
					>
						{post.published ? "Published" : "Draft"}
					</Badge>
					{post.featured && (
						<Badge
							variant="secondary"
							className="text-[9px] uppercase tracking-widest bg-amber-500/20 text-amber-600 hover:bg-amber-500/30"
						>
							<Sparkles className="size-3 mr-1" /> Featured
						</Badge>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
