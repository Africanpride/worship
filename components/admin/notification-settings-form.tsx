"use client";

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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

type Settings = {
	id: string;
	emailEnabled: boolean;
	pushEnabled: boolean;
	whatsappEnabled: boolean;
	reminderOffsets: number[];
};

const OFFSET_OPTIONS = [1440, 720, 120, 60, 30, 15] as const;

function formatOffset(m: number): string {
	if (m >= 1440) return `${m / 1440}d`;
	if (m >= 60) return `${m / 60}h`;
	return `${m}m`;
}

export function NotificationSettingsForm() {
	const { data, isLoading, mutate } = useSWR<Settings>(
		"/api/admin/notification-settings",
		fetcher,
	);
	const [local, setLocal] = useState<Settings | null>(null);
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		if (data) setLocal(data);
	}, [data]);

	if (isLoading || !local) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Notification Channels</CardTitle>
					<CardDescription>Loading…</CardDescription>
				</CardHeader>
			</Card>
		);
	}

	const toggle = (
		key: keyof Pick<
			Settings,
			"emailEnabled" | "pushEnabled" | "whatsappEnabled"
		>,
	) => {
		setLocal({ ...local, [key]: !local[key] });
	};

	const toggleOffset = (val: number) => {
		const has = local.reminderOffsets.includes(val);
		const next = has
			? local.reminderOffsets.filter((v) => v !== val)
			: [...local.reminderOffsets, val].sort((a, b) => b - a);
		if (next.length === 0) {
			toast.error("At least one offset required");
			return;
		}
		setLocal({ ...local, reminderOffsets: next });
	};

	const save = async () => {
		setSaving(true);
		try {
			const res = await fetch("/api/admin/notification-settings", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(local),
			});
			const json = await res.json();
			if (!res.ok) throw new Error(json?.error ?? "Save failed");
			toast.success("Notification settings saved");
			await mutate();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : String(err));
		} finally {
			setSaving(false);
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Notification Channels</CardTitle>
				<CardDescription>
					Global kill-switches. Reminders respect these + user opt-in.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<div>
							<Label>Email</Label>
						</div>
						<Switch
							checked={local.emailEnabled}
							onCheckedChange={() => toggle("emailEnabled")}
							className="cursor-pointer"
						/>
					</div>
					<div className="flex items-center justify-between">
						<div>
							<Label>Push (VAPID / FCM)</Label>
						</div>
						<Switch
							checked={local.pushEnabled}
							onCheckedChange={() => toggle("pushEnabled")}
							className="cursor-pointer"
						/>
					</div>
					<div className="flex items-center justify-between">
						<div>
							<Label>WhatsApp (open-wa)</Label>
							<p className="text-xs text-muted-foreground">
								Free via your VPS bridge
							</p>
						</div>
						<Switch
							checked={local.whatsappEnabled}
							onCheckedChange={() => toggle("whatsappEnabled")}
							className="cursor-pointer"
						/>
					</div>
				</div>

				<div className="space-y-2">
					<Label>Reminder offsets</Label>
					<p className="text-xs text-muted-foreground">
						When before startTime to fire. WhatsApp only on 30m/15m.
					</p>
					<div className="flex flex-wrap gap-2">
						{OFFSET_OPTIONS.map((opt) => {
							const active = local.reminderOffsets.includes(opt);
							return (
								<Badge
									key={opt}
									variant={active ? "default" : "outline"}
									className="cursor-pointer"
									onClick={() => toggleOffset(opt)}
								>
									{formatOffset(opt)}
								</Badge>
							);
						})}
					</div>
					{local.whatsappEnabled &&
						!local.reminderOffsets.some((v) => v <= 30) && (
							<p className="text-xs text-amber-600">
								WhatsApp enabled but no ≤30m offset — add one to send WhatsApp.
							</p>
						)}
				</div>

				<Button onClick={save} disabled={saving} className="cursor-pointer">
					{saving ? "Saving…" : "Save"}
				</Button>
			</CardContent>
		</Card>
	);
}
