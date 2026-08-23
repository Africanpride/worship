"use client";

import { useEffect, useState } from "react";
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TypeToDeleteDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	/** Name/title of the item being deleted, shown in the body. */
	itemName: string;
	/** Exact phrase the user must type, e.g. "Delete Event". */
	confirmPhrase: string;
	onConfirm: () => void | Promise<void>;
	loading?: boolean;
}

export function TypeToDeleteDialog({
	open,
	onOpenChange,
	itemName,
	confirmPhrase,
	onConfirm,
	loading = false,
}: TypeToDeleteDialogProps) {
	const [value, setValue] = useState("");

	useEffect(() => {
		if (open) setValue("");
	}, [open]);

	const matches = value.trim() === confirmPhrase;

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Type “{confirmPhrase}” to confirm</AlertDialogTitle>
					<AlertDialogDescription>
						This will permanently delete{" "}
						<span className="text-foreground font-medium">{itemName}</span>.
						This action cannot be undone.
					</AlertDialogDescription>
				</AlertDialogHeader>

				<div className="space-y-2">
					<Label htmlFor="type-to-delete" className="text-xs">
						Enter <span className="font-mono">{confirmPhrase}</span> below
					</Label>
					<Input
						id="type-to-delete"
						value={value}
						onChange={(e) => setValue(e.target.value)}
						placeholder={confirmPhrase}
						autoComplete="off"
						autoFocus
					/>
				</div>

				<AlertDialogFooter>
					<AlertDialogCancel className="cursor-pointer" disabled={loading}>
						Cancel
					</AlertDialogCancel>
					<Button
						variant="destructive"
						disabled={!matches || loading}
						onClick={() => void onConfirm()}
						className="cursor-pointer"
					>
						{loading ? "Deleting…" : confirmPhrase}
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
