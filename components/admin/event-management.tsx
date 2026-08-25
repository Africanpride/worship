"use client";

import { createFetch } from "@better-fetch/fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import {
	Calendar,
	Edit,
	Loader2,
	Megaphone,
	Plus,
	Trash2,
	User,
	X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { FileUpload } from "@/components/file-upload";
import { TypeToDeleteDialog } from "@/components/type-to-delete-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
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
import { Switch } from "@/components/ui/switch";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

const ministerSchema = z.object({
	name: z.string().min(1, "Name is required"),
	role: z.string().optional(),
	image: z.string().url("Invalid image URL").optional().or(z.literal("")),
});

const eventSchema = z.object({
	title: z.string().min(1, "Title is required"),
	startDate: z.string().min(1, "Start date is required"),
	endDate: z.string().min(1, "End date is required"),
	poster: z.string().url("Invalid poster URL").optional().or(z.literal("")),
	description: z.string().optional(),
	location: z.string().optional(),
	status: z.enum(["draft", "published", "cancelled"]),
	ministers: z.array(ministerSchema).optional(),
	sponsorIds: z.array(z.string()).optional(),
});

type EventFormValues = z.infer<typeof eventSchema>;

interface Minister {
	id: string;
	name: string;
	role: string | null;
	image: string | null;
}

interface Sponsor {
	id: string;
	name: string;
	logo: string | null;
}

interface Event {
	id: string;
	title: string;
	slug: string;
	startDate: string;
	endDate: string;
	poster: string | null;
	description: string | null;
	location: string | null;
	status: string;
	bookingOpen?: boolean;
	ministers: Minister[];
	sponsors: Sponsor[];
}

const $fetch = createFetch({
	baseURL: "/api",
});

export function EventManagement() {
	const [events, setEvents] = useState<Event[]>([]);
	const [sponsors, setSponsors] = useState<Sponsor[]>([]);
	const [loading, setLoading] = useState(true);
	const [open, setOpen] = useState(false);
	const [editingEvent, setEditingEvent] = useState<Event | null>(null);
	const [togglingBookings, setTogglingBookings] = useState<string | null>(null);
	const [deleteTarget, setDeleteTarget] = useState<Event | null>(null);
	const [deleting, setDeleting] = useState(false);

	const form = useForm<EventFormValues>({
		resolver: zodResolver(eventSchema),
		defaultValues: {
			title: "",
			startDate: "",
			endDate: "",
			poster: "",
			description: "",
			location: "Logos-Rhema Foundation, La, Accra",
			status: "published",
			ministers: [],
			sponsorIds: [],
		},
	});

	const {
		fields: ministerFields,
		append: appendMinister,
		remove: removeMinister,
	} = useFieldArray({
		control: form.control,
		name: "ministers",
	});

	const fetchData = async () => {
		try {
			setLoading(true);
			const [eventsRes, sponsorsRes] = await Promise.all([
				$fetch<Event[]>("/events"),
				$fetch<Sponsor[]>("/sponsors"),
			]);

			if (eventsRes.error) throw eventsRes.error;
			if (sponsorsRes.error) throw sponsorsRes.error;

			setEvents(eventsRes.data || []);
			setSponsors(sponsorsRes.data || []);
		} catch (error) {
			toast.error("Failed to load data");
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const onSubmit = async (values: EventFormValues) => {
		try {
			if (editingEvent) {
				const { error } = await $fetch(`/events/${editingEvent.id}`, {
					method: "PATCH",
					body: values,
				});
				if (error) throw error;
				toast.success("Event updated successfully");
			} else {
				const { error } = await $fetch("/events", {
					method: "POST",
					body: values,
				});
				if (error) throw error;
				toast.success("Event created successfully");
			}
			setOpen(false);
			setEditingEvent(null);
			form.reset();
			fetchData();
		} catch (error) {
			toast.error("Failed to save event");
			console.error(error);
		}
	};

	const onDelete = async (id: string) => {
		try {
			const { error } = await $fetch(`/events/${id}`, {
				method: "DELETE",
			});
			if (error) throw error;
			toast.success("Event deleted successfully");
			fetchData();
		} catch (error) {
			toast.error("Failed to delete event");
			console.error(error);
		}
	};

	const requestDelete = (event: Event) => {
		setDeleteTarget(event);
	};

	const toggleBookingOpen = async (event: Event, next: boolean) => {
		// Optimistic: flip the switch immediately, reconcile with the server
		// in the background, revert if the request fails.
		setEvents((prev) =>
			prev.map((e) => (e.id === event.id ? { ...e, bookingOpen: next } : e)),
		);
		setTogglingBookings(event.id);
		try {
			const { error } = await $fetch(`/events/${event.id}`, {
				method: "PATCH",
				body: { id: event.id, bookingOpen: next },
			});
			if (error) throw error;
			toast.success(
				next
					? `Bookings opened for “${event.title}”`
					: `Bookings closed for “${event.title}”`,
			);
		} catch (error) {
			setEvents((prev) =>
				prev.map((e) => (e.id === event.id ? { ...e, bookingOpen: !next } : e)),
			);
			toast.error("Failed to update bookings");
			console.error(error);
		} finally {
			setTogglingBookings(null);
		}
	};

	const handleEdit = (event: Event) => {
		setEditingEvent(event);
		form.reset({
			title: event.title,
			startDate: new Date(event.startDate).toISOString().slice(0, 16),
			endDate: new Date(event.endDate).toISOString().slice(0, 16),
			poster: event.poster || "",
			description: event.description || "",
			location: event.location || "Logos-Rhema Foundation, La, Accra",
			status: event.status as "draft" | "published" | "cancelled",
			ministers: event.ministers.map((m) => ({
				name: m.name,
				role: m.role || "",
				image: m.image || "",
			})),
			sponsorIds: event.sponsors.map((s) => s.id),
		});
		setOpen(true);
	};

	return (
		<div className="w-full">
			<div className="flex justify-between items-center mb-8">
				<div>
					<h1 className="text-3xl">Event Management</h1>
					<p className="text-muted-foreground">
						Manage your church events, conferences, and special programs.
					</p>
				</div>
				<Dialog
					open={open}
					onOpenChange={(val) => {
						setOpen(val);
						if (!val) {
							setEditingEvent(null);
							form.reset();
						}
					}}
				>
					<DialogTrigger asChild>
						<Button className="flex items-center gap-2">
							<Plus className="h-4 w-4" /> New Event
						</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-[700px] max-h-[95vh] p-0 flex flex-col overflow-hidden">
						<DialogHeader className="p-6 pb-2">
							<DialogTitle>
								{editingEvent ? "Edit Event" : "Add New Event"}
							</DialogTitle>
							<DialogDescription className="sr-only">
								Fill in the details for the event below.
							</DialogDescription>
						</DialogHeader>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="flex flex-col flex-1 min-h-0 overflow-hidden"
						>
							<div className="flex-1 overflow-y-auto p-6 pt-2 scrollbar-thin scrollbar-thumb-primary/10 scrollbar-track-transparent">
								<div className="space-y-6">
									<div className="grid grid-cols-1 gap-4">
										<Controller
											control={form.control}
											name="title"
											render={({ field, fieldState }) => (
												<Field data-invalid={fieldState.invalid}>
													<FieldLabel htmlFor={field.name}>
														Event Title
													</FieldLabel>
													<Input
														{...field}
														id={field.name}
														placeholder="Enter the title..."
													/>
													{fieldState.invalid && (
														<FieldError errors={[fieldState.error]} />
													)}
												</Field>
											)}
										/>
									</div>

									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<Controller
											control={form.control}
											name="startDate"
											render={({ field, fieldState }) => (
												<Field data-invalid={fieldState.invalid}>
													<FieldLabel htmlFor={field.name}>
														Start Date
													</FieldLabel>
													<Input
														{...field}
														type="datetime-local"
														id={field.name}
													/>
													{fieldState.invalid && (
														<FieldError errors={[fieldState.error]} />
													)}
												</Field>
											)}
										/>
										<Controller
											control={form.control}
											name="endDate"
											render={({ field, fieldState }) => (
												<Field data-invalid={fieldState.invalid}>
													<FieldLabel htmlFor={field.name}>End Date</FieldLabel>
													<Input
														{...field}
														type="datetime-local"
														id={field.name}
													/>
													{fieldState.invalid && (
														<FieldError errors={[fieldState.error]} />
													)}
												</Field>
											)}
										/>
									</div>

									<Controller
										control={form.control}
										name="poster"
										render={({ field }) => (
											<FileUpload
												value={field.value}
												onChange={field.onChange}
												onRemove={() => field.onChange("")}
												label="Event Poster"
												description="Drag and drop or click to browse for a high-quality event poster (Max 4MB)"
											/>
										)}
									/>

									<Controller
										control={form.control}
										name="location"
										render={({ field, fieldState }) => (
											<Field data-invalid={fieldState.invalid}>
												<FieldLabel htmlFor={field.name}>Location</FieldLabel>
												<Input
													{...field}
													id={field.name}
													placeholder="Enter event location..."
												/>
												{fieldState.invalid && (
													<FieldError errors={[fieldState.error]} />
												)}
											</Field>
										)}
									/>

									<Controller
										control={form.control}
										name="description"
										render={({ field, fieldState }) => (
											<Field data-invalid={fieldState.invalid}>
												<FieldLabel htmlFor={field.name}>
													Description
												</FieldLabel>
												<Textarea
													{...field}
													id={field.name}
													className="min-h-[100px]"
													placeholder="Tell us more about the event..."
												/>
												{fieldState.invalid && (
													<FieldError errors={[fieldState.error]} />
												)}
											</Field>
										)}
									/>

									<Controller
										control={form.control}
										name="status"
										render={({ field, fieldState }) => (
											<Field data-invalid={fieldState.invalid}>
												<FieldLabel htmlFor={field.name}>Status</FieldLabel>
												<Select
													onValueChange={field.onChange}
													defaultValue={field.value}
												>
													<SelectTrigger id={field.name}>
														<SelectValue placeholder="Select status" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="draft">Draft</SelectItem>
														<SelectItem value="published">Published</SelectItem>
														<SelectItem value="cancelled">Cancelled</SelectItem>
													</SelectContent>
												</Select>
												{fieldState.invalid && (
													<FieldError errors={[fieldState.error]} />
												)}
											</Field>
										)}
									/>

									<div className="pt-4 pb-2 border-t">
										<div className="flex items-center justify-between mb-4">
											<h4 className="text-sm uppercase tracking-wider text-muted-foreground">
												Ministers
											</h4>
											<Button
												type="button"
												variant="outline"
												size="sm"
												onClick={() =>
													appendMinister({ name: "", role: "", image: "" })
												}
											>
												<Plus className="h-3 w-3 mr-2" /> Add Minister
											</Button>
										</div>

										<div className="grid grid-cols-1 gap-4">
											{ministerFields.map((field, index) => (
												<div
													key={field.id}
													className="flex gap-4 items-start bg-muted/30 p-4 rounded-xl relative group"
												>
													<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
														<Controller
															control={form.control}
															name={`ministers.${index}.name`}
															render={({ field, fieldState }) => (
																<Field data-invalid={fieldState.invalid}>
																	<FieldLabel className="text-xs">
																		Name
																	</FieldLabel>
																	<Input {...field} placeholder="Name" />
																</Field>
															)}
														/>
														<Controller
															control={form.control}
															name={`ministers.${index}.role`}
															render={({ field, fieldState }) => (
																<Field data-invalid={fieldState.invalid}>
																	<FieldLabel className="text-xs">
																		Role
																	</FieldLabel>
																	<Input {...field} placeholder="Role" />
																</Field>
															)}
														/>
													</div>
													<Button
														type="button"
														variant="ghost"
														size="icon"
														className="text-muted-foreground hover:text-destructive transition-colors mt-6"
														onClick={() => removeMinister(index)}
													>
														<X className="h-4 w-4" />
													</Button>
												</div>
											))}
											{ministerFields.length === 0 && (
												<p className="text-center text-sm text-muted-foreground py-4 border border-dashed rounded-xl">
													No ministers added yet.
												</p>
											)}
										</div>
									</div>

									<div className="pt-4 pb-2 border-t">
										<h4 className="text-sm uppercase tracking-wider text-muted-foreground mb-4">
											Sponsors
										</h4>
										<div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-muted/30 p-4 rounded-xl">
											{sponsors.map((sponsor) => (
												<label
													key={sponsor.id}
													className="flex items-center gap-3 p-2 rounded-lg hover:bg-background/50 cursor-pointer transition-colors"
												>
													<Checkbox
														checked={form
															.watch("sponsorIds")
															?.includes(sponsor.id)}
														onCheckedChange={(checked) => {
															const current =
																form.getValues("sponsorIds") || [];
															if (checked) {
																form.setValue("sponsorIds", [
																	...current,
																	sponsor.id,
																]);
															} else {
																form.setValue(
																	"sponsorIds",
																	current.filter((id) => id !== sponsor.id),
																);
															}
														}}
													/>
													<span className="text-sm truncate">
														{sponsor.name}
													</span>
												</label>
											))}
											{sponsors.length === 0 && (
												<p className="text-sm text-muted-foreground col-span-full py-2">
													No sponsors found.
												</p>
											)}
										</div>
									</div>
								</div>
							</div>

							<DialogFooter className="p-6 pt-4 border-t bg-background/80 backdrop-blur-sm">
								<Button
									type="submit"
									disabled={form.formState.isSubmitting}
									className="w-full sm:w-auto h-11 px-8 rounded-full"
								>
									{form.formState.isSubmitting && (
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									)}
									{editingEvent ? "Update Event" : "Create Event"}
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
							<TableHead>Status</TableHead>
							<TableHead>Event</TableHead>
							<TableHead>Date</TableHead>
							<TableHead className="text-center">Bookings</TableHead>
							<TableHead className="hidden md:table-cell text-center">
								Ministers
							</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{loading ? (
							<TableRow>
								<TableCell colSpan={6} className="h-24 text-center">
									<Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
								</TableCell>
							</TableRow>
						) : events.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={6}
									className="h-24 text-center text-muted-foreground"
								>
									No events found. Create your first one!
								</TableCell>
							</TableRow>
						) : (
							events.map((event) => (
								<TableRow key={event.id}>
									<TableCell>
										<span
											className={`px-2 py-1 rounded-full text-xs font-medium ${
												event.status === "published"
													? "bg-green-500/10 text-green-500"
													: event.status === "draft"
														? "bg-yellow-500/10 text-yellow-500"
														: "bg-red-500/10 text-red-500"
											}`}
										>
											{event.status.charAt(0).toUpperCase() +
												event.status.slice(1)}
										</span>
									</TableCell>
									<TableCell className="font-medium">
										<div className="flex items-center gap-3">
											{event.poster ? (
												<div className="relative h-10 w-10 rounded overflow-hidden">
													<Image
														src={event.poster}
														alt={event.title}
														fill
														sizes="40px"
														className="object-cover"
													/>
												</div>
											) : (
												<div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
													<Calendar className="h-5 w-5 text-muted-foreground" />
												</div>
											)}
											<div>
												{event.title}
												<div className="text-xs text-muted-foreground font-normal">
													/{event.slug}
												</div>
											</div>
										</div>
									</TableCell>
									<TableCell>
										<div className="text-sm">
											{format(new Date(event.startDate), "MMM d, yyyy")}
										</div>
										<div className="text-xs text-muted-foreground">
											{format(new Date(event.startDate), "HH:mm")}
										</div>
									</TableCell>
									<TableCell className="text-center">
										<Switch
											checked={event.bookingOpen ?? false}
											onCheckedChange={(v) => toggleBookingOpen(event, v)}
											disabled={togglingBookings === event.id}
											className="cursor-pointer"
											aria-label={`Toggle bookings for ${event.title}`}
										/>
									</TableCell>
									<TableCell className="hidden md:table-cell">
										<div className="flex justify-center -space-x-2">
											{event.ministers.slice(0, 3).map((m, i) => (
												<div
													key={i}
													className="h-8 w-8 rounded-full border-2 border-background overflow-hidden bg-muted"
													title={m.name}
												>
													{m.image ? (
														<div className="relative h-full w-full">
															<Image
																src={m.image}
																alt={m.name}
																fill
																sizes="32px"
																className="object-cover"
															/>
														</div>
													) : (
														<User className="h-4 w-4 m-1.5 text-muted-foreground" />
													)}
												</div>
											))}
											{event.ministers.length > 3 && (
												<div className="h-8 w-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-medium">
													+{event.ministers.length - 3}
												</div>
											)}
										</div>
									</TableCell>
									<TableCell className="text-right text-muted-foreground">
										<div className="flex justify-end gap-2">
											<Button
												variant="ghost"
												size="icon"
												onClick={() => handleEdit(event)}
											>
												<Edit className="h-4 w-4" />
											</Button>
											<Button
												variant="ghost"
												size="icon"
												className="text-destructive hover:text-destructive cursor-pointer"
												onClick={() => requestDelete(event)}
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

			<TypeToDeleteDialog
				open={!!deleteTarget}
				onOpenChange={(o) => !o && setDeleteTarget(null)}
				itemName={
					deleteTarget ? `${deleteTarget.title} (/${deleteTarget.slug})` : ""
				}
				confirmPhrase="Delete Event"
				loading={deleting}
				onConfirm={async () => {
					if (!deleteTarget) return;
					setDeleting(true);
					await onDelete(deleteTarget.id);
					setDeleting(false);
					setDeleteTarget(null);
				}}
			/>
		</div>
	);
}
