"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { verifyEmail } from "@/lib/auth-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const token = searchParams.get("token");

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setError("No verification token provided");
        setIsVerifying(false);
        return;
      }

      try {
        const result = await verifyEmail({
          token,
        });

        if (result?.error) {
          setError(result.error.message || "Verification failed");
          setIsVerifying(false);
          return;
        }

        setSuccess(true);
        toast.success("Email verified successfully!");
        
        // Redirect to login or dashboard after 3 seconds
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred during verification");
        setIsVerifying(false);
      }
    };

    verify();
  }, [token, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Verify Your Email</CardTitle>
          <CardDescription>
            {isVerifying ? "Verifying your email address..." : "Email Verification"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          {isVerifying && (
            <>
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="text-center text-sm text-muted-foreground">
                Please wait while we verify your email...
              </p>
            </>
          )}

          {success && (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="text-center text-sm font-medium text-green-600">
                Email verified successfully!
              </p>
              <p className="text-center text-xs text-muted-foreground">
                Redirecting you to login in a few seconds...
              </p>
              <Button className="w-full" asChild>
                <Link href="/login">Go to Login</Link>
              </Button>
            </>
          )}

          {error && (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <p className="text-center text-sm font-medium text-red-600">
                Verification Failed
              </p>
              <p className="text-center text-xs text-muted-foreground">
                {error}
              </p>
              <div className="flex w-full gap-2">
                <Button variant="outline" className="flex-1" asChild>
                  <Link href="/login">Back to Login</Link>
                </Button>
                <Button className="flex-1" asChild>
                  <Link href="/signup">Create New Account</Link>
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
