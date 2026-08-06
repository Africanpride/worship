"use client";

import { CheckCircle2, Loader2, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FileUploadProps {
	value?: string;
	onChange: (url: string) => void;
	onRemove?: () => void;
	label?: string;
	description?: string;
}

export function FileUpload({
	value,
	onChange,
	onRemove,
	label = "Upload Image",
	description = "Drag and drop or click to browse (Max 4MB)",
}: FileUploadProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [isUploading, setIsUploading] = useState(false);
	const [progress, setProgress] = useState(0);

	const handleFileSelect = async (files: FileList | null) => {
		if (!files || files.length === 0) return;

		const file = files[0];
		if (file.size > 4 * 1024 * 1024) {
			alert("File size exceeds 4MB limit");
			return;
		}

		setIsUploading(true);
		setProgress(0);

		// Simulate upload progress
		const interval = setInterval(() => {
			setProgress((prev) => {
				if (prev >= 95) {
					clearInterval(interval);
					return 95;
				}
				return prev + Math.random() * 10;
			});
		}, 200);

		// Simulate API call
		setTimeout(() => {
			clearInterval(interval);
			setProgress(100);

			// In a real app, this would be the URL from your storage provider
			// For now, we simulate a local preview URL or a mock
			const mockUrl = URL.createObjectURL(file);
			onChange(mockUrl);
			setIsUploading(false);
		}, 2000);
	};

	const handleBoxClick = () => {
		fileInputRef.current?.click();
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		handleFileSelect(e.dataTransfer.files);
	};

	const handleRemove = () => {
		if (onRemove) {
			onRemove();
		} else {
			onChange("");
		}
	};

	return (
		<div className="space-y-4 w-full">
			{label && <Label className="text-sm font-medium">{label}</Label>}

			{!value && !isUploading ? (
				<div
					className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group"
					onClick={handleBoxClick}
					onDragOver={handleDragOver}
					onDrop={handleDrop}
				>
					<div className="mb-4 bg-muted rounded-full p-4 group-hover:scale-110 transition-transform duration-300">
						<Upload className="h-6 w-6 text-muted-foreground group-hover:text-primary" />
					</div>
					<p className="text-sm font-semibold text-foreground">{description}</p>
					<input
						type="file"
						ref={fileInputRef}
						className="hidden"
						accept="image/*"
						onChange={(e) => handleFileSelect(e.target.files)}
					/>
				</div>
			) : isUploading ? (
				<div className="border border-border rounded-xl p-6 flex flex-col items-center justify-center space-y-4 bg-muted/30">
					<Loader2 className="h-8 w-8 text-primary animate-spin" />
					<div className="w-full max-w-xs space-y-2">
						<div className="flex justify-between text-xs font-medium">
							<span>Uploading...</span>
							<span>{Math.round(progress)}%</span>
						</div>
						<div className="h-2 w-full bg-muted rounded-full overflow-hidden">
							<div
								className="h-full bg-primary transition-all duration-300"
								style={{ width: `${progress}%` }}
							/>
						</div>
					</div>
				</div>
			) : (
				<div className="relative group rounded-xl overflow-hidden border border-border shadow-md aspect-video max-w-sm mx-auto">
					<Image
						src={value || ""}
						alt="Preview"
						fill
						sizes="384px"
						unoptimized
						className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
					/>
					<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
						<Button
							type="button"
							variant="secondary"
							size="sm"
							className="rounded-full shadow-lg"
							onClick={handleBoxClick}
						>
							<Upload className="h-4 w-4 mr-2" /> Change
						</Button>
						<Button
							type="button"
							variant="destructive"
							size="sm"
							className="rounded-full shadow-lg"
							onClick={handleRemove}
						>
							<Trash2 className="h-4 w-4 mr-2" /> Remove
						</Button>
					</div>
					<input
						type="file"
						ref={fileInputRef}
						className="hidden"
						accept="image/*"
						onChange={(e) => handleFileSelect(e.target.files)}
					/>
					<div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full shadow-lg">
						<CheckCircle2 className="h-4 w-4" />
					</div>
				</div>
			)}
		</div>
	);
}
