"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { Loader2, Key } from "lucide-react";
import { signIn } from "@/lib/auth-client";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    return (
        <Card className="max-w-md">
            <CardHeader>
                <CardTitle className="text-lg md:text-xl">Sign In</CardTitle>
                <CardDescription className="text-xs md:text-sm">
                    Enter your email below to login to your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            required
                            onChange={(e) => {
                                setEmail(e.target.value);
                            }}
                            value={email}
                        />
                    </div>

                    <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="password">Password</Label>
                            <Link
                                href="#"
                                className="ml-auto inline-block text-sm underline"
                            >
                                Forgot your password?
                            </Link>
                        </div>

                        <Input
                            id="password"
                            type="password"
                            placeholder="password"
                            autoComplete="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="remember"
                            onClick={() => {
                                setRememberMe(!rememberMe);
                            }}
                        />
                        <Label htmlFor="remember">Remember me</Label>
                    </div>
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={loading}
                        onClick={async () => {
                            await signIn.email({
                                email,
                                password,
                                rememberMe,
                                fetchOptions: {
                                    onRequest: () => {
                                        setLoading(true);
                                    },
                                    onResponse: () => {
                                        setLoading(false);
                                    },
                                },
                            });
                        }}
                    >
                        {loading ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <p>Login</p>
                        )}
                    </Button>
                    <div className={cn(
                        "w-full gap-2 flex items-center",
                        "justify-between flex-wrap"
                    )}>
                        <Button
                            variant="outline"
                            className="flex-grow"
                            disabled={loading}
                            onClick={async () => {
                                await signIn.social({
                                    provider: "google",
                                    callbackURL: "/dashboard",
                                    fetchOptions: {
                                        onRequest: () => {
                                            setLoading(true);
                                        },
                                        onResponse: () => {
                                            setLoading(false);
                                        },
                                    },
                                });
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 262">
                                <path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"></path>
                                <path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"></path>
                                <path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"></path>
                                <path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"></path>
                            </svg>

                        </Button>
                        <Button
                            variant="outline"
                            className="flex-grow"
                            disabled={loading}
                            onClick={async () => {
                                await signIn.social({
                                    provider: "microsoft",
                                    callbackURL: "/dashboard",
                                    fetchOptions: {
                                        onRequest: () => {
                                            setLoading(true);
                                        },
                                        onResponse: () => {
                                            setLoading(false);
                                        },
                                    },
                                });
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="1em"
                                height="1em"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    fill="#00A4EF"
                                    d="M2 3h9v9H2zm9 19H2v-9h9zM21 3v9h-9V3zm0 19h-9v-9h9z"
                                ></path>
                            </svg>

                        </Button>
                        <Button
                            variant="outline"
                            className="flex-grow"
                            disabled={loading}
                            onClick={async () => {
                                await signIn.social({
                                    provider: "apple",
                                    callbackURL: "/dashboard",
                                    fetchOptions: {
                                        onRequest: () => {
                                            setLoading(true);
                                        },
                                        onResponse: () => {
                                            setLoading(false);
                                        },
                                    },
                                });
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="1em"
                                height="1em"
                                viewBox="0 0 512 512"
                            >
                                <path
                                    fill="currentColor"
                                    d="M462.595 399.003c-7.743 17.888-16.908 34.353-27.527 49.492c-14.474 20.637-26.326 34.923-35.459 42.855c-14.159 13.021-29.329 19.69-45.573 20.068c-11.662 0-25.726-3.318-42.096-10.05c-16.425-6.7-31.519-10.019-45.32-10.019c-14.475 0-29.999 3.318-46.603 10.019c-16.63 6.731-30.027 10.24-40.27 10.587c-15.578.664-31.105-6.195-46.603-20.606c-9.892-8.628-22.265-23.418-37.088-44.372c-15.903-22.375-28.977-48.322-39.221-77.904c-10.969-31.952-16.469-62.892-16.469-92.846c0-34.313 7.414-63.906 22.265-88.706c11.672-19.92 27.199-35.633 46.631-47.169s40.431-17.414 63.043-17.79c12.373 0 28.599 3.827 48.762 11.349c20.107 7.547 33.017 11.375 38.677 11.375c4.232 0 18.574-4.475 42.887-13.397c22.992-8.274 42.397-11.7 58.293-10.35c43.076 3.477 75.438 20.457 96.961 51.05c-38.525 23.343-57.582 56.037-57.203 97.979c.348 32.669 12.199 59.855 35.491 81.44c10.555 10.019 22.344 17.762 35.459 23.26c-2.844 8.248-5.846 16.149-9.038 23.735zM363.801 10.242c0 25.606-9.355 49.514-28.001 71.643c-22.502 26.307-49.719 41.508-79.234 39.11a80 80 0 0 1-.594-9.703c0-24.582 10.701-50.889 29.704-72.398c9.488-10.89 21.554-19.946 36.187-27.17C336.464 4.608 350.275.672 363.264-.001c.379 3.423.538 6.846.538 10.242z"
                                />
                            </svg>

                        </Button>
                        <Button
                            variant="outline"
                            className="flex-grow"
                            disabled={loading}
                            onClick={async () => {
                                await signIn.social({
                                    provider: "linkedin",
                                    callbackURL: "/dashboard",
                                    fetchOptions: {
                                        onRequest: () => {
                                            setLoading(true);
                                        },
                                        onResponse: () => {
                                            setLoading(false);
                                        },
                                    },
                                });
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 256" preserveAspectRatio="xMidYMid"><path fill="#0A66C2" d="M218.123 218.127h-37.931v-59.403c0-14.165-.253-32.4-19.728-32.4-19.756 0-22.779 15.434-22.779 31.369v60.43h-37.93V95.967h36.413v16.694h.51a39.907 39.907 0 0 1 35.928-19.733c38.445 0 45.533 25.288 45.533 58.186l-.016 67.013ZM56.955 79.27c-12.157.002-22.014-9.852-22.016-22.009-.002-12.157 9.851-22.014 22.008-22.016 12.157-.003 22.014 9.851 22.016 22.008A22.013 22.013 0 0 1 56.955 79.27m18.966 138.858H37.95V95.967h37.97v122.16ZM237.033.018H18.89C8.58-.098.125 8.161-.001 18.471v219.053c.122 10.315 8.576 18.582 18.89 18.474h218.144c10.336.128 18.823-8.139 18.966-18.474V18.454c-.147-10.33-8.635-18.588-18.966-18.453" /></svg>

                        </Button>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <div className="flex justify-center w-full border-t py-4">
                    <p className="text-center text-xs text-neutral-500">
                        built with{" "}
                        <Link
                            href="https://better-auth.com"
                            className="underline"
                            target="_blank"
                        >
                            <span className="dark:text-white/70 cursor-pointer">
                                better-auth.
                            </span>
                        </Link>
                    </p>
                </div>
            </CardFooter>
        </Card>
    );
}