"use client";

import { betterFetch } from "@better-fetch/fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Loader2, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { FileUpload } from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
	title: z.string().min(1, "Title is required"),
	startDate: z.date({ message: "Start date is required" }),
	endDate: z.date({ message: "End date is required" }),
	poster: z.string().optional(),
	description: z.string().optional(),
	status: z.string(),
	ministers: z.array(
		z.object({
			name: z.string().min(1, "Minister name is required"),
			role: z.string().optional(),
			image: z.string().optional(),
		}),
	),
	sponsorIds: z.array(z.string()),
});

type FormValues = z.infer<typeof formSchema>;

interface SponsorOption {
	id: string;
	name: string;
}

interface EventFormEvent {
	id?: string;
	title: string;
	startDate: string | Date;
	endDate: string | Date;
	poster?: string | null;
	description?: string | null;
	status: string;
	ministers?: Array<{ name: string; role?: string; image?: string }>;
	sponsorIds?: string[];
}

interface EventFormProps {
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void;
	event?: EventFormEvent;
}

export function EventForm({
	isOpen,
	onClose,
	onSuccess,
	event,
}: EventFormProps) {
	const [sponsors, setSponsors] = useState<SponsorOption[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
			startDate: new Date(),
			endDate: new Date(),
			status: "published",
			ministers: [],
			sponsorIds: [],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "ministers",
	});

	useEffect(() => {
		const fetchSponsors = async () => {
			try {
				const { data } = await betterFetch<SponsorOption[]>("/api/sponsors");
				setSponsors(data || []);
			} catch (error) {
				console.error("Failed to fetch sponsors:", error);
			}
		};

		if (isOpen) {
			fetchSponsors();
			if (event) {
				form.reset({
					title: event.title,
					startDate: new Date(event.startDate),
					endDate: new Date(event.endDate),
					poster: event.poster || "",
					description: event.description || "",
					status: event.status,
					ministers: event.ministers || [],
					sponsorIds: event.sponsorIds || [],
				});
			} else {
				form.reset({
					title: "",
					startDate: new Date(),
					endDate: new Date(),
					status: "published",
					ministers: [],
					sponsorIds: [],
				});
			}
		}
	}, [isOpen, event, form]);

	const onSubmit = async (values: FormValues) => {
		try {
			setIsSubmitting(true);
			const url = event ? `/api/events/${event.id}` : "/api/events";
			const method = event ? "PATCH" : "POST";

			const { error } = await betterFetch(url, {
				method,
				body: values,
			});

			if (error) throw error;

			toast.success(event ? "Event updated" : "Event created");
			onSuccess();
			onClose();
		} catch (error) {
			console.error("Failed to save event:", error);
			toast.error("Failed to save event");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-4xl max-h-[95vh] p-0 flex flex-col overflow-hidden">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex flex-col max-h-full overflow-hidden"
					>
						<div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-primary/10 scrollbar-track-transparent">
							<DialogHeader className="mb-6">
								<DialogTitle>
									{event ? "Edit Event" : "Add New Event"}
								</DialogTitle>
							</DialogHeader>

							<div className="space-y-8">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<FormField
										control={form.control}
										name="title"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Event Title</FormLabel>
												<FormControl>
													<Input placeholder="Enter event title" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<FormField
										control={form.control}
										name="startDate"
										render={({ field }) => (
											<FormItem className="flex flex-col">
												<FormLabel>Start Date & Time</FormLabel>
												<FormControl>
													<DateTimePicker
														date={field.value}
														setDate={field.onChange}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="endDate"
										render={({ field }) => (
											<FormItem className="flex flex-col">
												<FormLabel>End Date & Time</FormLabel>
												<FormControl>
													<DateTimePicker
														date={field.value}
														setDate={field.onChange}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<FormField
										control={form.control}
										name="poster"
										render={({ field }) => (
											<FormItem className="col-span-1 md:col-span-2">
												<FormControl>
													<FileUpload
														value={field.value}
														onChange={field.onChange}
														onRemove={() => field.onChange("")}
														label="Event Poster"
														description="Drag and drop or click to browse for a high-quality event poster (Max 4MB)"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="status"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Status</FormLabel>
												<Select
													onValueChange={field.onChange}
													defaultValue={field.value}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder="Select status" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														<SelectItem value="draft">Draft</SelectItem>
														<SelectItem value="published">Published</SelectItem>
														<SelectItem value="cancelled">Cancelled</SelectItem>
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<FormField
									control={form.control}
									name="description"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Description</FormLabel>
											<FormControl>
												<Textarea
													placeholder="Enter event description..."
													className="resize-none min-h-[100px]"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<div className="space-y-4">
									<div className="flex items-center justify-between">
										<h3 className="text-lg">Ministers</h3>
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() => append({ name: "", role: "", image: "" })}
										>
											<Plus className="mr-2 h-4 w-4" /> Add Minister
										</Button>
									</div>
									<div className="space-y-4">
										{fields.map((field, index) => (
											<div
												key={field.id}
												className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end border p-4 rounded-xl bg-muted/30"
											>
												<FormField
													control={form.control}
													name={`ministers.${index}.name`}
													render={({ field }) => (
														<FormItem>
															<FormLabel className="text-xs">Name</FormLabel>
															<FormControl>
																<Input placeholder="Name" {...field} />
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
												<FormField
													control={form.control}
													name={`ministers.${index}.role`}
													render={({ field }) => (
														<FormItem>
															<FormLabel className="text-xs">Role</FormLabel>
															<FormControl>
																<Input placeholder="Role" {...field} />
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
												<FormField
													control={form.control}
													name={`ministers.${index}.image`}
													render={({ field }) => (
														<FormItem>
															<FormLabel className="text-xs">
																Image URL (Optional)
															</FormLabel>
															<FormControl>
																<Input placeholder="Image URL" {...field} />
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
												<Button
													type="button"
													variant="destructive"
													size="icon"
													onClick={() => remove(index)}
													className="mb-0.5"
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										))}
										{fields.length === 0 && (
											<p className="text-sm text-center text-muted-foreground py-4 border border-dashed rounded-xl">
												No ministers added yet.
											</p>
										)}
									</div>
								</div>

								<div className="space-y-4">
									<h3 className="text-lg">Sponsors</h3>
									<FormField
										control={form.control}
										name="sponsorIds"
										render={() => (
											<FormItem>
												<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 border p-4 rounded-xl bg-muted/30">
													{sponsors.map((sponsor) => (
														<FormField
															key={sponsor.id}
															control={form.control}
															name="sponsorIds"
															render={({ field }) => {
																return (
																	<FormItem
																		key={sponsor.id}
																		className="flex flex-row items-center space-x-3 space-y-0"
																	>
																		<FormControl>
																			<Checkbox
																				checked={field.value?.includes(
																					sponsor.id,
																				)}
																				onCheckedChange={(checked) => {
																					return checked
																						? field.onChange([
																								...field.value,
																								sponsor.id,
																							])
																						: field.onChange(
																								field.value?.filter(
																									(value: string) =>
																										value !== sponsor.id,
																								),
																							);
																				}}
																			/>
																		</FormControl>
																		<FormLabel className="font-normal cursor-pointer">
																			{sponsor.name}
																		</FormLabel>
																	</FormItem>
																);
															}}
														/>
													))}
													{sponsors.length === 0 && (
														<p className="text-sm text-muted-foreground col-span-full">
															No sponsors found. Create some first.
														</p>
													)}
												</div>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</div>
						</div>

						<DialogFooter className="sticky bottom-0 bg-muted/80 backdrop-blur-sm pt-4 pb-4 px-6 border-t z-20">
							<Button
								type="button"
								variant="outline"
								onClick={onClose}
								disabled={isSubmitting}
								className="h-11 px-8 rounded-full"
							>
								Cancel
							</Button>
							<Button
								type="submit"
								disabled={isSubmitting}
								className="h-11 px-8 rounded-full"
							>
								{isSubmitting ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Saving...
									</>
								) : (
									"Save Event"
								)}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
