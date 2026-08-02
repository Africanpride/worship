import type { Metadata } from "next";
import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = {
	title: "Sign In",
	robots: { index: false, follow: false },
};

export default function LoginPage() {
	return (
		<div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
			<div className="w-full max-w-sm md:max-w-6xl">
				<LoginForm />
			</div>
		</div>
	);
}
