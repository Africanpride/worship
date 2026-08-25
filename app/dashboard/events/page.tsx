"use client";

import { betterFetch } from "@better-fetch/fetch";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { MyBookingsPanel } from "@/components/slots/my-bookings-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { EventForm } from "./event-form";

interface DashboardEvent {
	id: string;
	title: string;
	slug: string;
	startDate: string;
	endDate: string;
	status: string;
	poster?: string | null;
	location?: string | null;
	bookingOpen?: boolean;
}

export default function EventsPage() {
	const [events, setEvents] = useState<DashboardEvent[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [editingEvent, setEditingEvent] = useState<DashboardEvent | null>(null);

	const fetchEvents = async () => {
		try {
			setIsLoading(true);
			const { data, error } =
				await betterFetch<DashboardEvent[]>("/api/events");
			if (error) throw error;
			setEvents(data || []);
		} catch (error) {
			console.error("Failed to fetch events:", error);
			toast.error("Failed to load events");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchEvents();
	}, []);

	const handleEdit = (event: DashboardEvent) => {
		setEditingEvent(event);
		setIsFormOpen(true);
	};

	const handleOpenForm = () => {
		setEditingEvent(null);
		setIsFormOpen(true);
	};

	const handleDelete = async (id: string) => {
		if (!confirm("Are you sure you want to delete this event?")) return;

		try {
			const { error } = await betterFetch(`/api/events/${id}`, {
				method: "DELETE",
			});
			if (error) throw error;
			toast.success("Event deleted successfully");
			fetchEvents();
		} catch (error) {
			console.error("Failed to delete event:", error);
			toast.error("Failed to delete event");
		}
	};

	return (
		<div className="space-y-6 p-6">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl">Event Management</h1>
				<Button onClick={handleOpenForm} className="cursor-pointer">
					<Plus className="mr-2 h-4 w-4" /> Add Event
				</Button>
			</div>

			<MyBookingsPanel />

			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Title</TableHead>
							<TableHead>Date</TableHead>
							<TableHead>Status</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{isLoading ? (
							<TableRow>
								<TableCell colSpan={4} className="h-24 text-center">
									Loading...
								</TableCell>
							</TableRow>
						) : events.length === 0 ? (
							<TableRow>
								<TableCell colSpan={4} className="h-24 text-center">
									No events found.
								</TableCell>
							</TableRow>
						) : (
							events.map((event) => (
								<TableRow key={event.id}>
									<TableCell className="font-medium">{event.title}</TableCell>
									<TableCell>
										{new Date(event.startDate).toLocaleDateString()}
									</TableCell>
									<TableCell>
										<Badge
											variant={
												event.status === "published" ? "default" : "secondary"
											}
										>
											{event.status}
										</Badge>
									</TableCell>
									<TableCell className="text-right space-x-2">
										<Button
											variant="outline"
											size="sm"
											onClick={() => handleEdit(event)}
										>
											Edit
										</Button>
										<Button
											variant="destructive"
											size="sm"
											onClick={() => handleDelete(event.id)}
										>
											Delete
										</Button>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			<EventForm
				isOpen={isFormOpen}
				onClose={() => setIsFormOpen(false)}
				onSuccess={fetchEvents}
				event={editingEvent ?? undefined}
			/>
		</div>
	);
}
