"use client";

import { createFetch } from "@better-fetch/fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Loader2, Play, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
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

const videoSchema = z.object({
	title: z.string().min(1, "Title is required"),
	url: z.string().url("Invalid URL").min(1, "URL is required"),
	thumbnail: z
		.string()
		.optional()
		.refine(
			(val) =>
				!val || val.startsWith("/") || z.string().url().safeParse(val).success,
			{ message: "Must be a valid URL or a path starting with /" },
		)
		.or(z.literal("")),

	type: z.enum(["VOD", "LIVE"]),
});

type VideoFormValues = z.infer<typeof videoSchema>;

interface Video {
	id: string;
	title: string;
	url: string;
	thumbnail: string | null;
	type: "VOD" | "LIVE";
	createdAt: string;
}

const $fetch = createFetch({
	baseURL: "/api",
});

export function VideoManagement() {
	const [videos, setVideos] = useState<Video[]>([]);
	const [loading, setLoading] = useState(true);
	const [open, setOpen] = useState(false);
	const [editingVideo, setEditingVideo] = useState<Video | null>(null);

	const form = useForm<VideoFormValues>({
		resolver: zodResolver(videoSchema),
		defaultValues: {
			title: "",
			url: "",
			thumbnail: "",
			type: "VOD",
		},
	});

	const fetchVideos = async () => {
		try {
			setLoading(true);
			const { data, error } = await $fetch<Video[]>("/videos");
			if (error) throw error;
			setVideos(data || []);
		} catch (error) {
			toast.error("Failed to load videos");
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchVideos();
	}, []);

	const onSubmit = async (values: VideoFormValues) => {
		try {
			if (editingVideo) {
				const { error } = await $fetch("/videos", {
					method: "PATCH",
					body: { ...values, id: editingVideo.id },
				});
				if (error) throw error;
				toast.success("Video updated successfully");
			} else {
				const { error } = await $fetch("/videos", {
					method: "POST",
					body: values,
				});
				if (error) throw error;
				toast.success("Video created successfully");
			}
			setOpen(false);
			setEditingVideo(null);
			form.reset();
			fetchVideos();
		} catch (error) {
			toast.error("Failed to save video");
			console.error(error);
		}
	};

	const onDelete = async (id: string) => {
		if (!confirm("Are you sure you want to delete this video?")) return;

		try {
			const { error } = await $fetch(`/videos?id=${id}`, {
				method: "DELETE",
			});
			if (error) throw error;
			toast.success("Video deleted successfully");
			fetchVideos();
		} catch (error) {
			toast.error("Failed to delete video");
			console.error(error);
		}
	};

	const handleEdit = (video: Video) => {
		setEditingVideo(video);
		form.reset({
			title: video.title,
			url: video.url,
			thumbnail: video.thumbnail || "",
			type: video.type,
		});
		setOpen(true);
	};

	return (
		<div className="w-full">
			<div className="flex justify-between items-center mb-8">
				<div>
					<h1 className="text-3xl">Video Management</h1>
					<p className="text-muted-foreground">
						Manage your VOD and Live stream content.
					</p>
				</div>
				<Dialog
					open={open}
					onOpenChange={(val: boolean) => {
						setOpen(val);
						if (!val) {
							setEditingVideo(null);
							form.reset();
						}
					}}
				>
					<DialogTrigger asChild>
						<Button className="flex items-center gap-2">
							<Plus className="h-4 w-4" /> New Video
						</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-[425px]">
						<DialogHeader>
							<DialogTitle>
								{editingVideo ? "Edit Video" : "Add New Video"}
							</DialogTitle>
						</DialogHeader>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
							<FieldGroup>
								<Controller
									control={form.control}
									name="title"
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<FieldLabel htmlFor={field.name}>Title</FieldLabel>
											<Input
												{...field}
												id={field.name}
												placeholder="Enter video title"
												aria-invalid={fieldState.invalid}
											/>
											{fieldState.invalid && (
												<FieldError errors={[fieldState.error]} />
											)}
										</Field>
									)}
								/>
								<Controller
									control={form.control}
									name="url"
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<FieldLabel htmlFor={field.name}>URL</FieldLabel>
											<Input
												{...field}
												id={field.name}
												placeholder="https://..."
												aria-invalid={fieldState.invalid}
											/>
											{fieldState.invalid && (
												<FieldError errors={[fieldState.error]} />
											)}
										</Field>
									)}
								/>
								<Controller
									control={form.control}
									name="thumbnail"
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<FieldLabel htmlFor={field.name}>
												Thumbnail URL (Optional)
											</FieldLabel>
											<Input
												{...field}
												id={field.name}
												placeholder="https://..."
												aria-invalid={fieldState.invalid}
											/>
											{fieldState.invalid && (
												<FieldError errors={[fieldState.error]} />
											)}
										</Field>
									)}
								/>
								<Controller
									control={form.control}
									name="type"
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<FieldLabel htmlFor={field.name}>Type</FieldLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<SelectTrigger id={field.name}>
													<SelectValue placeholder="Select type" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="VOD">VOD</SelectItem>
													<SelectItem value="LIVE">Live Stream</SelectItem>
												</SelectContent>
											</Select>
											{fieldState.invalid && (
												<FieldError errors={[fieldState.error]} />
											)}
										</Field>
									)}
								/>
							</FieldGroup>
							<DialogFooter className="pt-4">
								<Button type="submit" disabled={form.formState.isSubmitting}>
									{form.formState.isSubmitting && (
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									)}
									{editingVideo ? "Update Video" : "Create Video"}
								</Button>
							</DialogFooter>
						</form>
					</DialogContent>
				</Dialog>
			</div>

			<div className="rounded-md border bg-card/50 backdrop-blur-sm">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Type</TableHead>
							<TableHead>Title</TableHead>
							<TableHead className="hidden md:table-cell">URL</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{loading ? (
							<TableRow>
								<TableCell colSpan={4} className="h-24 text-center">
									<Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
								</TableCell>
							</TableRow>
						) : videos.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={4}
									className="h-24 text-center text-muted-foreground"
								>
									No videos found. Create your first one!
								</TableCell>
							</TableRow>
						) : (
							videos.map((video) => (
								<TableRow key={video.id}>
									<TableCell>
										<span
											className={`px-2 py-1 rounded-full text-xs font-medium ${
												video.type === "LIVE"
													? "bg-red-500/10 text-red-500"
													: "bg-blue-500/10 text-blue-500"
											}`}
										>
											{video.type}
										</span>
									</TableCell>
									<TableCell className="font-medium">{video.title}</TableCell>
									<TableCell className="hidden md:table-cell max-w-[300px] truncate text-muted-foreground">
										{video.url}
									</TableCell>
									<TableCell className="text-right">
										<div className="flex justify-end gap-2">
											<Button
												variant="ghost"
												size="icon"
												onClick={() => window.open(video.url, "_blank")}
											>
												<Play className="h-4 w-4" />
											</Button>
											<Button
												variant="ghost"
												size="icon"
												onClick={() => handleEdit(video)}
											>
												<Edit className="h-4 w-4" />
											</Button>
											<Button
												variant="ghost"
												size="icon"
												className="text-destructive hover:text-destructive"
												onClick={() => onDelete(video.id)}
											>
												<Trash2 className="h-4 w-4" />
											</Button>
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
