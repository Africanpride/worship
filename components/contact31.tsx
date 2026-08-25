"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderIcon } from "lucide-react";
import Image from "next/image";
import { Turnstile } from "nextjs-turnstile";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const contactFormSchema = z.object({
	name: z.string().min(1, "Name is required"),
	email: z
		.string()
		.min(1, "Email is required")
		.email("Please enter a valid email"),
	group: z.string().optional(),
	message: z.string().min(1, "Message is required"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

interface Contact31Props {
	title?: string;
	description?: string;
	image?: string;
	className?: string;
	onSubmit?: (data: ContactFormData) => Promise<void>;
}

const Contact31 = ({
	title = "Get in Touch",
	description = "Jesus said, “The hour is coming and is already here when the true worshipers will worship the Father in spirit and truth; for the Father is looking for those who will worship Him that way.” (John 4:23-25)",
	image = "/nonstop/nonstop-001.jpg",
	className,
	onSubmit,
}: Contact31Props) => {
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [showSuccess, setShowSuccess] = useState(false);
	const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

	const form = useForm<ContactFormData>({
		resolver: zodResolver(contactFormSchema),
		mode: "onSubmit",
		reValidateMode: "onSubmit",
		defaultValues: {
			name: "",
			email: "",
			group: "",
			message: "",
		},
	});

	const handleFormSubmit = async (data: ContactFormData) => {
		if (!turnstileToken) {
			toast.error("Please complete the security check");
			return;
		}

		try {
			const response = await fetch("/api/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ ...data, turnstileToken }),
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error || "Failed to send message");
			}

			setIsSubmitted(true);
			setShowSuccess(true);
			form.reset();
			setTimeout(() => setShowSuccess(false), 4500);
			setTimeout(() => setIsSubmitted(false), 5000);
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: "Something went wrong. Please try again.",
			);
		}
	};

	return (
		<section className={cn("py-4 pt-32", className)}>
			<div className="container">
				<div className="mx-auto grid max-w-6xl overflow-hidden rounded-2xl bg-muted/50 lg:grid-cols-2">
					<div className="relative hidden lg:block overflow-hidden">
						<Image
							src={image}
							alt="Contact"
							fill
							sizes="(max-width: 1024px) 100vw, 50vw"
							className="absolute inset-0 size-full object-cover"
						/>
					</div>

					<div className="p-8 md:p-12 lg:p-16">
						<div className="mb-8">
							<h1 className="mb-4 text-3xl font-medium md:text-4xl">{title}</h1>
							<p className="text-muted-foreground">{description}</p>
						</div>

						{isSubmitted && (
							<div
								className={cn(
									"mb-6 rounded-lg border border-green-500/20 bg-green-500/10 p-4 text-center transition-opacity duration-500",
									showSuccess ? "opacity-100" : "opacity-0",
								)}
							>
								<p className="text-sm font-medium text-green-600 dark:text-green-400">
									Thank you! We'll be in touch soon.
								</p>
							</div>
						)}

						<form onSubmit={form.handleSubmit(handleFormSubmit)}>
							<FieldGroup>
								<div className="grid gap-4 sm:grid-cols-2">
									<Controller
										control={form.control}
										name="name"
										render={({ field, fieldState }) => (
											<Field data-invalid={fieldState.invalid}>
												<FieldLabel htmlFor={field.name}>
													Name <span className="text-destructive">*</span>
												</FieldLabel>
												<Input
													{...field}
													id={field.name}
													aria-invalid={fieldState.invalid}
													placeholder="Your name"
													className="bg-background"
												/>
												{fieldState.invalid && (
													<FieldError errors={[fieldState.error]} />
												)}
											</Field>
										)}
									/>

									<Controller
										control={form.control}
										name="email"
										render={({ field, fieldState }) => (
											<Field data-invalid={fieldState.invalid}>
												<FieldLabel htmlFor={field.name}>
													Email <span className="text-destructive">*</span>
												</FieldLabel>
												<Input
													{...field}
													id={field.name}
													type="email"
													aria-invalid={fieldState.invalid}
													placeholder="you@example.com"
													className="bg-background"
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
									name="group"
									render={({ field }) => (
										<Field>
											<FieldLabel htmlFor={field.name}>Group/Choir</FieldLabel>
											<Input
												{...field}
												id={field.name}
												placeholder="Your group/choir"
												className="bg-background"
											/>
										</Field>
									)}
								/>

								<Controller
									control={form.control}
									name="message"
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<FieldLabel htmlFor={field.name}>
												Message <span className="text-destructive">*</span>
											</FieldLabel>
											<Textarea
												{...field}
												id={field.name}
												aria-invalid={fieldState.invalid}
												placeholder="How can we help?"
												rows={5}
												className="bg-background"
											/>
											{fieldState.invalid && (
												<FieldError errors={[fieldState.error]} />
											)}
										</Field>
									)}
								/>

								{form.formState.errors.root && (
									<p className="text-sm text-destructive">
										{form.formState.errors.root.message}
									</p>
								)}

								<div className="flex justify-center -mb-2 mt-2">
									<Turnstile
										siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
										action="contact"
										onSuccess={(token) => setTurnstileToken(token)}
									/>
								</div>

								<Button
									size="lg"
									className="w-full cursor-pointer"
									disabled={form.formState.isSubmitting}
								>
									{form.formState.isSubmitting ? (
										<>
											<LoaderIcon className="mr-2 size-4 animate-spin" />
											Sending...
										</>
									) : (
										"Send Message"
									)}
								</Button>
							</FieldGroup>
						</form>
					</div>
				</div>
			</div>
		</section>
	);
};

export { Contact31 };
