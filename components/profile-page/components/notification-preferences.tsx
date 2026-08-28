"use client";

import { BadgeCheck, BadgeAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";
import { Badge } from "@/components/ui/badge";
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
import type { ProfileRecord } from "../types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

type Pref = {
	emailReminders: boolean;
	pushReminders: boolean;
	whatsappReminders: boolean;
};

export function NotificationPreferences({
	profile: initialProfile,
}: {
	profile?: ProfileRecord;
}) {
	const { data, mutate } = useSWR<Pref>("/api/user/preferences", fetcher);
	const { data: profileData, mutate: mutateProfile } = useSWR<ProfileRecord>(
		"/api/profile",
		fetcher,
		{ fallbackData: initialProfile },
	);
	const profile = profileData ?? initialProfile;
	const isVerified = !!profile?.phoneVerifiedAt;
	const verifiedPhone = profile?.phone ?? null;

	const [email, setEmail] = useState(true);
	const [push, setPush] = useState(false);
	const [whatsapp, setWhatsapp] = useState(false);

	// Phone verification local state — prefill from profile
	const [phone, setPhone] = useState(profile?.phone ?? "");
	const [code, setCode] = useState("");
	const [phoneSent, setPhoneSent] = useState(false);
	const [phoneLoading, setPhoneLoading] = useState(false);

	const isPhoneDirty = phone !== verifiedPhone;
	// Hide OTP CTA when already verified and not editing — best practice: verified is terminal state
	const showOtpCta = !isVerified || isPhoneDirty || phoneSent;

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
			setWhatsapp(data.whatsappReminders);
		}
	}, [data]);

	// Keep phone field in sync when profile loads/changes (e.g. after verification or Personal tab save)
	useEffect(() => {
		if (profile?.phone && !phoneSent) {
			setPhone(profile.phone);
		}
	}, [profile?.phone, phoneSent]);

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
				setWhatsapp(data.whatsappReminders);
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
			toast.success("WhatsApp code sent");
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
			await mutateProfile();
			// auto enable whatsapp
			setWhatsapp(true);
			await patch({ whatsappReminders: true });
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
							<Label className="text-base">WhatsApp Reminders</Label>
							<p className="text-muted-foreground text-sm">
								30m before start (verified WhatsApp only)
							</p>
						</div>
						<Switch
							checked={whatsapp}
							onCheckedChange={(v) => {
								setWhatsapp(v);
								patch({ whatsappReminders: v });
							}}
							className="self-start sm:self-center cursor-pointer"
						/>
					</div>

					<div className="rounded-lg border p-3 space-y-3 bg-muted/30">
						<div className="flex items-center justify-between">
							<Label>Phone for WhatsApp</Label>
							{verifiedPhone ? (
								isVerified ? (
									<Badge
										variant="outline"
										className="gap-1 border-green-200 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
									>
										<BadgeCheck className="size-3.5" /> Verified · {verifiedPhone}
									</Badge>
								) : (
									<Badge
										variant="outline"
										className="gap-1 border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
									>
										<BadgeAlert className="size-3.5" /> Unverified · {verifiedPhone}
									</Badge>
								)
							) : null}
						</div>
						{isVerified && !isPhoneDirty ? (
							<p className="text-xs text-muted-foreground">
								Your number <span className="font-medium text-foreground">{verifiedPhone}</span> is verified. WhatsApp reminders will be sent here. Edit the number to change it.
							</p>
						) : isPhoneDirty && isVerified ? (
							<p className="text-xs text-amber-600 dark:text-amber-400">
								Number changed — send a new code to re-verify.
							</p>
						) : null}
						<PhoneInput
							value={phone}
							onChange={(e) =>
								setPhone((e.target as HTMLInputElement).value ?? "")
							}
							defaultCountry={profile?.country || undefined}
						/>
						{showOtpCta ? (
							<div className="flex gap-2">
								<Button
									size="sm"
									onClick={requestOtp}
									disabled={phoneLoading || !phone}
									className="cursor-pointer"
								>
									{phoneLoading
										? "Sending…"
										: phoneSent
											? "Resend WhatsApp code"
											: "Send WhatsApp code"}
								</Button>
								{phoneSent && (
									<span className="text-xs text-muted-foreground self-center">
										Code expires in 5 min
									</span>
								)}
							</div>
						) : (
							<p className="text-xs text-muted-foreground flex items-center gap-1">
								<BadgeCheck className="size-3.5 text-green-600" /> Verified — no action needed. Edit above to change number.
							</p>
						)}
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
						<Switch
							defaultChecked
							className="self-start sm:self-center cursor-pointer"
						/>
					</div>
					<Separator />
					<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<div className="space-y-1">
							<Label className="text-base">Weekly Summary</Label>
							<p className="text-muted-foreground text-sm">
								Weekly activity digest
							</p>
						</div>
						<Switch
							defaultChecked
							className="self-start sm:self-center cursor-pointer"
						/>
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
