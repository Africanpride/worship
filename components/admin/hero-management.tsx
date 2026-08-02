"use client";

import { createFetch } from "@better-fetch/fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save, Video as VideoIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
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

const heroSchema = z.object({
	videoSource: z.enum(["youtube", "mux", "local"]),
	videoId: z.string().optional(),
	videoUrl: z.string().optional(),
	startTime: z.number().min(0, "Start time must be a positive number"),
});

type HeroFormValues = z.infer<typeof heroSchema>;

const $fetch = createFetch({
	baseURL: "/api/admin",
});

export function HeroManagement() {
	const [loading, setLoading] = useState(true);

	const form = useForm<HeroFormValues>({
		resolver: zodResolver(heroSchema),
		defaultValues: {
			videoSource: "youtube",
			videoId: "bDk_nNbccnc",
			videoUrl: "",
			startTime: 108,
		},
	});

	const videoSource = form.watch("videoSource");

	const fetchHeroSettings = async () => {
		try {
			setLoading(true);
			const { data, error } = await $fetch<any>("/hero");
			if (error) throw error;
			if (data) {
				form.reset({
					videoSource: data.videoSource || "youtube",
					videoId: data.videoId || "",
					videoUrl: data.videoUrl || "",
					startTime: data.startTime || 0,
				});
			}
		} catch (error) {
			toast.error("Failed to load hero settings");
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchHeroSettings();
	}, []);

	const onSubmit = async (values: HeroFormValues) => {
		try {
			const { error } = await $fetch("/hero", {
				method: "POST",
				body: values,
			});
			if (error) throw error;
			toast.success("Hero settings updated successfully");
			fetchHeroSettings();
		} catch (error: any) {
			toast.error("Failed to update hero settings");
			console.error("Hero settings update failed:", error);
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center h-48">
				<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	return (
		<div className="w-full ">
			<div className="flex justify-between items-center mb-8">
				<div>
					<h1 className="text-3xl">Hero Video Settings</h1>
					<p className="text-muted-foreground">
						Configure the main background video for your landing page.
					</p>
				</div>
			</div>
			<Card className="bg-card/50 backdrop-blur-sm p-4">
				<CardHeader>
					<div className="flex items-center gap-2">
						<VideoIcon className="h-6 w-6 text-primary" />
						<CardTitle className="text-2xl">Hero Video Settings</CardTitle>
					</div>
					<CardDescription>
						Configure the main background video for your landing page.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<FieldGroup>
							<Controller
								control={form.control}
								name="videoSource"
								render={({ field }) => (
									<Field>
										<FieldLabel>Video Source</FieldLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="Select video source" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="youtube">YouTube</SelectItem>
												<SelectItem value="mux">Mux Video</SelectItem>
												<SelectItem value="local">Local Video</SelectItem>
											</SelectContent>
										</Select>
									</Field>
								)}
							/>

							{videoSource === "youtube" && (
								<Controller
									control={form.control}
									name="videoId"
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<FieldLabel htmlFor={field.name}>
												YouTube Video ID
											</FieldLabel>
											<Input
												{...field}
												id={field.name}
												placeholder="e.g., bDk_nNbccnc"
												aria-invalid={fieldState.invalid}
											/>
											<p className="text-xs text-muted-foreground mt-1">
												The alphanumeric ID from the YouTube URL (e.g., watch?v=
												<strong>bDk_nNbccnc</strong>)
											</p>
											{fieldState.invalid && (
												<FieldError errors={[fieldState.error]} />
											)}
										</Field>
									)}
								/>
							)}

							{(videoSource === "mux" || videoSource === "local") && (
								<Controller
									control={form.control}
									name="videoUrl"
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<FieldLabel htmlFor={field.name}>
												{videoSource === "mux"
													? "Mux Video URL"
													: "Local Video Path"}
											</FieldLabel>
											<Input
												{...field}
												id={field.name}
												placeholder={
													videoSource === "mux"
														? "https://stream.mux.com/..."
														: "/videos/hero.mp4"
												}
												aria-invalid={fieldState.invalid}
											/>
											<p className="text-xs text-muted-foreground mt-1">
												{videoSource === "mux"
													? "The full stream URL from Mux."
													: "The relative path to the video file in the public folder."}
											</p>
											{fieldState.invalid && (
												<FieldError errors={[fieldState.error]} />
											)}
										</Field>
									)}
								/>
							)}

							<Controller
								control={form.control}
								name="startTime"
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor={field.name}>
											Start Time (Seconds)
										</FieldLabel>
										<Input
											{...field}
											id={field.name}
											type="number"
											value={field.value}
											onChange={(e) =>
												field.onChange(parseInt(e.target.value) || 0)
											}
											aria-invalid={fieldState.invalid}
										/>
										<p className="text-xs text-muted-foreground mt-1">
											The exact second the background video should start looping
											from.
										</p>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
						</FieldGroup>

						<div className="flex justify-end pt-4">
							<Button
								type="submit"
								disabled={form.formState.isSubmitting}
								className="w-full sm:w-auto"
							>
								{form.formState.isSubmitting ? (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								) : (
									<Save className="mr-2 h-4 w-4" />
								)}
								Save Settings
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
