"use client";

import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Turnstile, type TurnstileRef } from "nextjs-turnstile";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
	FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { signIn } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { ThemeToggleFooter } from "./theme-toggle-foofter";

export function LoginForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
	const turnstileRef = useRef<TurnstileRef>(null);
	const router = useRouter();

	const handleSocialSignIn = async (provider: "google") => {
		if (loading) return;
		setLoading(true);
		try {
			await signIn.social({
				provider,
				callbackURL: "/",
			});
		} catch {
			toast.error(`${provider} sign-in failed`);
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!turnstileToken) {
			toast.error("Please complete the security check");
			return;
		}

		setLoading(true);

		try {
			const verifyRes = await fetch("/api/security/turnstile", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ token: turnstileToken, action: "login" }),
			});
			const verifyJson = await verifyRes.json();
			if (!verifyRes.ok || !verifyJson.verified) {
				toast.error("Security check failed. Please retry the verification.");
				turnstileRef.current?.reset();
				setTurnstileToken(null);
				return;
			}

			const result = await signIn.email({
				email,
				password,
			});

			if (result.error) {
				toast.error(result.error.message || "Login failed");
				setLoading(false);
				return;
			}

			toast.success("Login successful! Redirecting...");
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
								<h1 className="text-2xl">Welcome Back</h1>
								<p className="text-muted-foreground text-balance">
									Login to your Non-Stop Worship experience
								</p>
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
							<Field>
								<div className="flex items-center">
									<FieldLabel htmlFor="password">Password</FieldLabel>
									<a
										href="#"
										className="ml-auto text-sm underline-offset-2 hover:underline cursor-pointer"
									>
										Forgot your password?
									</a>
								</div>
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
								<Button
									type="submit"
									disabled={loading}
									className="cursor-pointer"
								>
									{loading ? "Logging in..." : "Login"}
								</Button>
							</Field>
							<FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
								Or continue with
							</FieldSeparator>
							<Field className="grid grid-cols-1 gap-4">
								<Button
									variant="outline"
									type="button"
									className="w-full cursor-pointer"
									disabled={loading}
									onClick={() => handleSocialSignIn("google")}
								>
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
										<path
											d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
											fill="currentColor"
										/>
									</svg>
									Login with Google
								</Button>
							</Field>
							<div className="flex justify-center my-2">
								<Turnstile
									siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
									action="login"
									ref={turnstileRef}
									onSuccess={(token) => setTurnstileToken(token)}
								/>
							</div>
							<FieldDescription className="text-center">
								Don&apos;t have an account?{" "}
								<a href="/signup" className="cursor-pointer">
									Sign up
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
