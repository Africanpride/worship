"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { usePush } from "@/hooks/use-push";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

type Pref = {
	emailReminders: boolean;
	pushReminders: boolean;
	smsReminders: boolean;
};

export function NotificationPreferences() {
	const { data, mutate } = useSWR<Pref>("/api/user/preferences", fetcher);
	const [email, setEmail] = useState(true);
	const [push, setPush] = useState(false);
	const [sms, setSms] = useState(false);

	// Phone verification local state
	const [phone, setPhone] = useState("");
	const [code, setCode] = useState("");
	const [phoneSent, setPhoneSent] = useState(false);
	const [phoneLoading, setPhoneLoading] = useState(false);

	const {
		supported,
		permission,
		subscribed,
		loading: pushLoading,
		subscribe,
		unsubscribe,
		vapidConfigured,
	} = usePush();

	useEffect(() => {
		if (data) {
			setEmail(data.emailReminders);
			setPush(data.pushReminders);
			setSms(data.smsReminders);
		}
	}, [data]);

	const patch = async (partial: Partial<Pref>) => {
		const res = await fetch("/api/user/preferences", {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(partial),
		});
		const json = await res.json();
		if (!res.ok) {
			toast.error(json?.error ?? "Update failed");
			// revert
			if (data) {
				setEmail(data.emailReminders);
				setPush(data.pushReminders);
				setSms(data.smsReminders);
			}
			return;
		}
		await mutate();
		toast.success("Preferences saved");
	};

	const handlePush = async (checked: boolean) => {
		if (checked) {
			if (!vapidConfigured) {
				toast.error("Push not configured on server (VAPID)");
				return;
			}
			if (permission === "denied") {
				toast.error("Notifications blocked — allow in browser settings");
				return;
			}
			try {
				await subscribe();
				setPush(true);
				await patch({ pushReminders: true });
			} catch (e) {
				toast.error(e instanceof Error ? e.message : String(e));
			}
		} else {
			try {
				await unsubscribe();
				setPush(false);
				await patch({ pushReminders: false });
			} catch (e) {
				toast.error(e instanceof Error ? e.message : String(e));
			}
		}
	};

	const requestOtp = async () => {
		if (!phone) {
			toast.error("Enter phone first");
			return;
		}
		setPhoneLoading(true);
		try {
			const res = await fetch("/api/user/phone/request", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ phone }),
			});
			const json = await res.json();
			if (!res.ok) throw new Error(json?.error ?? "Request failed");
			setPhoneSent(true);
			toast.success("Code sent");
		} catch (e) {
			toast.error(e instanceof Error ? e.message : String(e));
		} finally {
			setPhoneLoading(false);
		}
	};

	const verifyOtp = async () => {
		setPhoneLoading(true);
		try {
			const res = await fetch("/api/user/phone/verify", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ phone, code }),
			});
			const json = await res.json();
			if (!res.ok) throw new Error(json?.error ?? "Invalid code");
			toast.success("Phone verified");
			setPhoneSent(false);
			setCode("");
			// auto enable sms
			setSms(true);
			await patch({ smsReminders: true });
		} catch (e) {
			toast.error(e instanceof Error ? e.message : String(e));
		} finally {
			setPhoneLoading(false);
		}
	};

	return (
		<Card className="p-2 py-4 md:p-4 w-full">
			<CardHeader>
				<CardTitle>Notification Preferences</CardTitle>
				<CardDescription>
					Reminders respect admin toggles + your opt-in.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="space-y-4">
					<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<div className="space-y-1">
							<Label className="text-base">Email Reminders</Label>
							<p className="text-muted-foreground text-sm">
								1440m + 60m before your hour
							</p>
						</div>
						<Switch
							checked={email}
							onCheckedChange={(v) => {
								setEmail(v);
								patch({ emailReminders: v });
							}}
							className="self-start sm:self-center cursor-pointer"
						/>
					</div>
					<Separator />
					<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<div className="space-y-1">
							<Label className="text-base">Push Notifications</Label>
							<p className="text-muted-foreground text-sm">
								{supported
									? vapidConfigured
										? `Browser push ${subscribed ? "(subscribed)" : ""}`
										: "Server VAPID not configured"
									: "Not supported in this browser"}
							</p>
						</div>
						<Switch
							checked={push}
							onCheckedChange={handlePush}
							disabled={!supported || pushLoading}
							className="self-start sm:self-center cursor-pointer"
						/>
					</div>
					<Separator />
					<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<div className="space-y-1">
							<Label className="text-base">SMS Reminders</Label>
							<p className="text-muted-foreground text-sm">
								30m before start (verified phone only)
							</p>
						</div>
						<Switch
							checked={sms}
							onCheckedChange={(v) => {
								setSms(v);
								patch({ smsReminders: v });
							}}
							className="self-start sm:self-center cursor-pointer"
						/>
					</div>

					<div className="rounded-lg border p-3 space-y-2 bg-muted/30">
						<Label>Phone for SMS</Label>
						<PhoneInput
							value={phone}
							onChange={(e) =>
								setPhone((e.target as HTMLInputElement).value ?? "")
							}
							defaultCountry="US"
						/>
						<div className="flex gap-2">
							<Button
								size="sm"
								onClick={requestOtp}
								disabled={phoneLoading}
								className="cursor-pointer"
							>
								{phoneLoading
									? "Sending…"
									: phoneSent
										? "Resend code"
										: "Send code"}
							</Button>
						</div>
						{phoneSent && (
							<div className="flex gap-2 items-center">
								<Input
									placeholder="6-digit code"
									value={code}
									onChange={(e) => setCode(e.target.value)}
									maxLength={6}
									className="max-w-[160px]"
								/>
								<Button
									size="sm"
									onClick={verifyOtp}
									disabled={phoneLoading || code.length !== 6}
									className="cursor-pointer"
								>
									Verify
								</Button>
							</div>
						)}
					</div>

					<Separator />
					<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<div className="space-y-1">
							<Label className="text-base">Marketing Emails</Label>
							<p className="text-muted-foreground text-sm">
								New features and updates
							</p>
						</div>
						<Switch defaultChecked className="self-start sm:self-center" />
					</div>
					<Separator />
					<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<div className="space-y-1">
							<Label className="text-base">Weekly Summary</Label>
							<p className="text-muted-foreground text-sm">
								Weekly activity digest
							</p>
						</div>
						<Switch defaultChecked className="self-start sm:self-center" />
					</div>
					<Separator />
					<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<div className="space-y-1">
							<Label className="text-base">Security Alerts</Label>
							<p className="text-muted-foreground text-sm">Always enabled</p>
						</div>
						<Switch checked disabled className="self-start sm:self-center" />
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
