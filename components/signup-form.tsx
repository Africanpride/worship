"use client";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Turnstile, type TurnstileRef } from "nextjs-turnstile";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ThemeToggleFooter } from "@/components/theme-toggle-foofter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
	FieldSeparator,
} from "@/components/ui/field";
import { InfoTip } from "@/components/ui/info-tip";
import { Input } from "@/components/ui/input";
import { signIn, signUp } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

type SignUpProps = React.ComponentProps<"div"> & {
	costradCallbackUrl?: string | null;
	displayFooterText?: boolean | null;
};

export function SignupForm({
	className,
	costradCallbackUrl,
	displayFooterText = true,
	...props
}: SignUpProps) {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passwordConfirmation, setPasswordConfirmation] = useState("");
	const [image, setImage] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
	const turnstileRef = useRef<TurnstileRef>(null);

	const handleSocialSignIn = async (provider: "google" | "microsoft") => {
		try {
			await signIn.social({
				provider,
				callbackURL: "/",
			});
		} catch (err) {
			toast.error(`${provider} sign-up failed`);
		}
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setImage(file);
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!turnstileToken) {
			toast.error("Please complete the security check");
			return;
		}

		// Validation
		if (password !== passwordConfirmation) {
			toast.error("Passwords do not match");
			return;
		}

		if (password.length < 8) {
			toast.error("Password must be at least 8 characters");
			return;
		}

		setLoading(true);

		try {
			const verifyRes = await fetch("/api/security/turnstile", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ token: turnstileToken, action: "signup" }),
			});
			const verifyJson = await verifyRes.json();
			if (!verifyRes.ok || !verifyJson.verified) {
				toast.error("Security check failed. Please retry the verification.");
				turnstileRef.current?.reset();
				setTurnstileToken(null);
				return;
			}

			const result = await signUp.email({
				email,
				password,
				name: `${firstName} ${lastName}`,
			});

			if (result.error) {
				toast.error(result.error.message || "Sign up failed");
				setLoading(false);
				return;
			}

			toast.success(
				"Account created! Please check your email to verify your account.",
			);
			router.push("/");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "An error occurred");
			setLoading(false);
		}
	};

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<div className="flex items-center justify-between">
				<Link
					href="/"
					className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit cursor-pointer"
				>
					<ArrowLeft className="size-4" />
					Back to website
				</Link>
				<ThemeToggleFooter />
			</div>
			<Card className="overflow-hidden p-0">
				<CardContent className="grid p-0 md:grid-cols-2">
					<form className="p-6 md:p-8" onSubmit={handleSubmit}>
						<FieldGroup>
							<div className="flex flex-col items-center gap-2 text-center">
								<h1 className="text-2xl">Join the Experience</h1>
								<p className="text-muted-foreground text-balance">
									Start your journey into Non-Stop Worship
								</p>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<Field>
									<FieldLabel htmlFor="firstName">First Name</FieldLabel>
									<Input
										id="firstName"
										type="text"
										placeholder="John"
										value={firstName}
										onChange={(e) => setFirstName(e.target.value)}
										required
										disabled={loading}
									/>
								</Field>
								<Field>
									<FieldLabel htmlFor="lastName">Last Name</FieldLabel>
									<Input
										id="lastName"
										type="text"
										placeholder="Doe"
										value={lastName}
										onChange={(e) => setLastName(e.target.value)}
										required
										disabled={loading}
									/>
								</Field>
							</div>
							<Field>
								<FieldLabel htmlFor="email">Email</FieldLabel>
								<Input
									id="email"
									type="email"
									placeholder="m@example.com"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
									disabled={loading}
								/>
							</Field>
							<div className="grid grid-cols-2 gap-4">
								<Field>
									<span className="flex items-center gap-1">
										<FieldLabel htmlFor="password" className="mb-0">
											Password
										</FieldLabel>
										<InfoTip>
											Minimum 8 characters. Use a passphrase you don&apos;t
											reuse anywhere else.
										</InfoTip>
									</span>
									<Input
										id="password"
										type="password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										required
										disabled={loading}
									/>
								</Field>
								<Field>
									<FieldLabel htmlFor="passwordConfirmation">
										Confirm Password
									</FieldLabel>
									<Input
										id="passwordConfirmation"
										type="password"
										value={passwordConfirmation}
										onChange={(e) => setPasswordConfirmation(e.target.value)}
										required
										disabled={loading}
									/>
								</Field>
							</div>

							<Field>
								<Button
									type="submit"
									disabled={loading}
									className="cursor-pointer"
								>
									{loading ? "Creating account..." : "Sign Up"}
								</Button>
							</Field>
							<FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
								Or continue with
							</FieldSeparator>
							<Field className="grid gap-2 sm:grid-cols-2">
								<Button
									variant="outline"
									type="button"
									className="w-full cursor-pointer"
									onClick={() => handleSocialSignIn("google")}
								>
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
										<path
											d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
											fill="currentColor"
										/>
									</svg>
									Continue with Google
								</Button>
								<Button
									variant="outline"
									type="button"
									className="w-full cursor-pointer"
									disabled={loading}
									onClick={() => handleSocialSignIn("microsoft")}
								>
									<svg viewBox="0 0 23 23" className="size-4">
										<path fill="#f35325" d="M1 1h10v10H1z" />
										<path fill="#81bc06" d="M12 1h10v10H12z" />
										<path fill="#05a6f0" d="M1 12h10v10H1z" />
										<path fill="#ffba08" d="M12 12h10v10H12z" />
									</svg>
									Continue with Microsoft
								</Button>
							</Field>
							<div className="flex justify-center my-2 w-full">
								<Turnstile
									siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
									action="signup"
									ref={turnstileRef}
									onSuccess={(token) => setTurnstileToken(token)}
									size="flexible"
								/>
							</div>
							<FieldDescription className="text-center">
								Already have an account?{" "}
								<a href="/login" className="cursor-pointer">
									Login
								</a>
							</FieldDescription>
						</FieldGroup>
					</form>
					<div className="bg-muted relative hidden md:block">
						<Image
							src="/non-stop-logo.jpg"
							alt="Image"
							fill
							sizes="50vw"
							className="absolute inset-0 h-full w-full object-cover "
						/>
					</div>
				</CardContent>
			</Card>
			<FieldDescription className="px-6 text-center">
				By clicking continue, you agree to our{" "}
				<a href="/terms" className="cursor-pointer">
					Terms of Service
				</a>{" "}
				and{" "}
				<a href="/privacy" className="cursor-pointer">
					Privacy Policy
				</a>
				.
			</FieldDescription>
		</div>
	);
}

async function convertImageToBase64(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onloadend = () => resolve(reader.result as string);
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
}
