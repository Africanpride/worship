"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function DateTimePicker({
	date,
	setDate,
	placeholder = "Pick a date",
}: {
	date?: Date;
	setDate: (date?: Date) => void;
	placeholder?: string;
}) {
	const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
		date,
	);

	const handleDateSelect = (newDate: Date | undefined) => {
		if (!newDate) return;

		// Preserve current time if date exists
		if (selectedDate) {
			newDate.setHours(selectedDate.getHours());
			newDate.setMinutes(selectedDate.getMinutes());
		}

		setSelectedDate(newDate);
		setDate(newDate);
	};

	const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const [hours, minutes] = e.target.value.split(":").map(Number);
		const newDate = selectedDate ? new Date(selectedDate) : new Date();
		newDate.setHours(hours);
		newDate.setMinutes(minutes);
		setSelectedDate(newDate);
		setDate(newDate);
	};

	const timeValue = selectedDate ? format(selectedDate, "HH:mm") : "00:00";

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant={"outline"}
					className={cn(
						"w-full justify-start text-left font-normal",
						!date && "text-muted-foreground",
					)}
				>
					<CalendarIcon className="mr-2 h-4 w-4" />
					{date ? format(date, "PPP p") : <span>{placeholder}</span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-4 flex flex-col gap-4">
				<Calendar
					mode="single"
					selected={selectedDate}
					onSelect={handleDateSelect}
					initialFocus
				/>
				<div className="flex items-center gap-2 border-t pt-4">
					<Clock className="h-4 w-4 text-muted-foreground" />
					<Label htmlFor="time" className="text-xs">
						Time
					</Label>
					<Input
						id="time"
						type="time"
						value={timeValue}
						onChange={handleTimeChange}
						className="flex-1 h-8"
					/>
				</div>
			</PopoverContent>
		</Popover>
	);
}
