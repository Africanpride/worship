"use client";

import { createFetch } from "@better-fetch/fetch";
import { AnimatePresence, motion } from "framer-motion";
import { Info, PenTool, Send, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

const $fetch = createFetch({
	baseURL: "/api",
});

export default function ReflectionForm() {
	const [content, setContent] = useState("");
	const [loading, setLoading] = useState(false);
	const [submitted, setSubmitted] = useState(false);

	const onSubmit = async () => {
		if (!content.trim() || content.length < 10) {
			toast.error("Please share a bit more of your experience.");
			return;
		}

		try {
			setLoading(true);
			const { error } = await $fetch("/reflections", {
				method: "POST",
				body: { content },
			});

			if (error) throw error;

			toast.success("Your reflection has been submitted for moderation.");
			setContent("");
			setSubmitted(true);
		} catch (error) {
			toast.error("Failed to submit reflection. Please try again.");
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Card className="border-none shadow-xl bg-card overflow-hidden p-2 md:p-4">
			<CardHeader>
				<div className="flex items-center gap-3">
					{/* <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <PenTool className="size-5" />
          </div> */}
					<CardTitle className="text-lg font-bold uppercase tracking-tight sm:text-xl md:text-2xl">
						Post a Sacred Reflection/Testimony
					</CardTitle>
				</div>
				<CardDescription className="text-sm sm:text-base">
					Share your experience of the 144-hour altar. What did God speak to
					you?
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<AnimatePresence mode="wait">
					{!submitted ? (
						<motion.div
							key="form"
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.95 }}
							className="space-y-4"
						>
							<Textarea
								placeholder="The atmosphere was like nothing I've felt before... God met me at the 3rd hour..."
								className="min-h-[160px] resize-none border-muted focus-visible:ring-primary/50 text-base leading-relaxed p-4 rounded-xl italic font-medium"
								value={content}
								onChange={(e) => setContent(e.target.value)}
							/>
							<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
								<p className="text-xs text-muted-foreground flex items-start gap-1.5 max-w-[300px]">
									<Info className="size-3.5 mt-0.5 shrink-0" />
									Your reflection will be private and reviewed by an admin
									before it can be featured on the public wall.
								</p>
								<Button
									onClick={onSubmit}
									disabled={loading || content.length < 10}
									className="rounded-full px-8 shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-95 transition-all text-sm font-bold uppercase tracking-widest h-11"
								>
									{loading ? (
										<>
											<motion.div
												animate={{ rotate: 360 }}
												transition={{
													duration: 1,
													repeat: Infinity,
													ease: "linear",
												}}
												className="mr-2"
											>
												<Sparkles className="size-4" />
											</motion.div>
											Submitting...
										</>
									) : (
										<>
											<Send className="mr-2 size-4" />
											Submit to Altar
										</>
									)}
								</Button>
							</div>
						</motion.div>
					) : (
						<motion.div
							key="success"
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							className="py-12 flex flex-col items-center justify-center text-center space-y-4"
						>
							<div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-2">
								<Sparkles className="size-8" />
							</div>
							<h3 className="text-xl font-bold">Reflection Received!</h3>
							<p className="text-muted-foreground max-w-[400px]">
								Thank you for sharing your experience. Our team will review your
								reflection soon. Keep the fire burning!
							</p>
							<Button
								variant="outline"
								className="rounded-full mt-4"
								onClick={() => setSubmitted(false)}
							>
								Submit Another
							</Button>
						</motion.div>
					)}
				</AnimatePresence>
			</CardContent>
		</Card>
	);
}
