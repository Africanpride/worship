"use client";

import { CheckCircle2, Key, Loader2, Shield, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { MyBookingsPanel } from "@/components/slots/my-bookings-panel";
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { CountryDropdown } from "@/components/ui/country-dropdown";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { ProfileRecord, ProfileUser } from "../types";
import ReflectionForm from "./reflection-form";

interface ProfileContentProps {
	user: ProfileUser;
	profile: ProfileRecord;
}

const VOLUNTEER_AREAS = [
	"Security",
	"Catering",
	"Child Care",
	"Multimedia",
	"Cleaners",
	"Stage Management",
	"Ushers",
	"Greeters",
	"Worship Team",
	"Medical / First Aid",
	"Transportation",
	"Counseling",
];

export default function ProfileContent({ user, profile }: ProfileContentProps) {
	const router = useRouter();
	const [isSavingPersonal, setIsSavingPersonal] = useState(false);
	const [isSavingVolunteer, setIsSavingVolunteer] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [deleteConfirmText, setDeleteConfirmText] = useState("");
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

	// Active tab syncs with the URL hash so refresh/deep-links keep context.
	const [activeTab, setActiveTab] = useState(() => {
		const hash =
			typeof window !== "undefined" ? window.location.hash.slice(1) : "";
		return [
			"personal",
			"schedule",
			"volunteering",
			"reflections",
			"membership",
			"security",
			"notifications",
		].includes(hash)
			? hash
			: "personal";
	});

	const [personalForm, setPersonalForm] = useState({
		firstName: profile.firstName || "",
		lastName: profile.lastName || "",
		phone: profile.phone || "",
		jobTitle: profile.jobTitle || "",
		company: profile.company || "",
		country: profile.country || "",
		bio: profile.bio || "",
	});

	const [volunteerAreas, setVolunteerAreas] = useState<string[]>(
		profile.volunteerAreas || [],
	);

	const handlePersonalChange = (field: string, value: string) => {
		setPersonalForm((prev) => ({ ...prev, [field]: value }));
	};

	const handleVolunteerToggle = (area: string, checked: boolean) => {
		setVolunteerAreas((prev) =>
			checked ? [...prev, area] : prev.filter((a) => a !== area),
		);
	};

	const savePersonal = async () => {
		setIsSavingPersonal(true);
		try {
			const res = await fetch("/api/profile", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(personalForm),
			});
			if (!res.ok) throw new Error("Failed to save profile");
			router.refresh();
			toast.success("Personal information saved!");
		} catch {
			toast.error("Failed to save. Please try again.");
		} finally {
			setIsSavingPersonal(false);
		}
	};

	const saveVolunteering = async () => {
		setIsSavingVolunteer(true);
		try {
			const res = await fetch("/api/profile", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ volunteerAreas }),
			});
			if (!res.ok) throw new Error("Failed to save volunteering preferences");
			router.refresh();
			toast.success("Volunteering preferences saved!");
		} catch {
			toast.error("Failed to save. Please try again.");
		} finally {
			setIsSavingVolunteer(false);
		}
	};

	const handleRequestDeletion = async (e: React.FormEvent) => {
		e.preventDefault();
		if (deleteConfirmText !== "DELETE") return;
		setIsDeleting(true);
		try {
			const res = await fetch("/api/user/request-deletion", { method: "POST" });
			if (!res.ok) throw new Error("Failed to request deletion");
			toast.success(
				"Account deletion request submitted. An admin will process it shortly.",
			);
			setDeleteConfirmText("");
			setDeleteDialogOpen(false);
		} catch {
			toast.error("Failed to request deletion.");
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<Tabs
			value={activeTab}
			onValueChange={(v) => {
				setActiveTab(v);
				window.history.replaceState(null, "", `#${v}`);
			}}
			className="space-y-6"
		>
			<TabsList className="flex h-auto w-full items-center gap-1 overflow-x-auto rounded-xl bg-muted/40 p-1.5">
				<TabsTrigger
					value="personal"
					className="shrink-0 rounded-lg px-3 py-2.5 text-xs sm:text-sm"
				>
					Personal
				</TabsTrigger>
				<TabsTrigger
					value="schedule"
					className="shrink-0 rounded-lg px-3 py-2.5 text-xs sm:text-sm"
				>
					My Schedule
				</TabsTrigger>
				<TabsTrigger
					value="volunteering"
					className="shrink-0 rounded-lg px-3 py-2.5 text-xs sm:text-sm"
				>
					Volunteering
				</TabsTrigger>
				<TabsTrigger
					value="reflections"
					className="shrink-0 rounded-lg px-3 py-2.5 text-xs sm:text-sm"
				>
					Reflections
				</TabsTrigger>
				<TabsTrigger
					value="membership"
					className="shrink-0 rounded-lg px-3 py-2.5 text-xs sm:text-sm"
				>
					Membership
				</TabsTrigger>
				<TabsTrigger
					value="security"
					className="shrink-0 rounded-lg px-3 py-2.5 text-xs sm:text-sm"
				>
					Security
				</TabsTrigger>
				<TabsTrigger
					value="notifications"
					className="shrink-0 rounded-lg px-3 py-2.5 text-xs sm:text-sm"
				>
					Notifications
				</TabsTrigger>
			</TabsList>

			{/* Personal Information */}
			<TabsContent value="personal" className="space-y-6">
				<Card className="p-2 py-4  md:p-4 w-full">
					<CardHeader>
						<CardTitle>Personal Information</CardTitle>
						<CardDescription>
							Update your personal details and profile information.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="firstName">First Name</Label>
								<Input
									id="firstName"
									value={personalForm.firstName}
									onChange={(e) =>
										handlePersonalChange("firstName", e.target.value)
									}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="lastName">Last Name</Label>
								<Input
									id="lastName"
									value={personalForm.lastName}
									onChange={(e) =>
										handlePersonalChange("lastName", e.target.value)
									}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input id="email" type="email" value={user.email} disabled />
							</div>
							<div className="space-y-2">
								<Label htmlFor="phone">Phone</Label>
								<PhoneInput
									id="phone"
									value={personalForm.phone || undefined}
									onChange={(e) =>
										handlePersonalChange("phone", e.target.value)
									}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="jobTitle">Job Title</Label>
								<Input
									id="jobTitle"
									value={personalForm.jobTitle}
									onChange={(e) =>
										handlePersonalChange("jobTitle", e.target.value)
									}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="company">Company/Organization</Label>
								<Input
									id="company"
									value={personalForm.company}
									onChange={(e) =>
										handlePersonalChange("company", e.target.value)
									}
								/>
							</div>
							<div className="space-y-2 md:col-span-2">
								<Label htmlFor="country">Country</Label>
								<CountryDropdown
									placeholder="Select your country"
									defaultValue={personalForm.country || undefined}
									onChange={(country) =>
										handlePersonalChange("country", country?.alpha3 ?? "")
									}
								/>
							</div>
						</div>
						<div className="space-y-2">
							<Label htmlFor="bio">Bio</Label>
							<Textarea
								id="bio"
								placeholder="Tell us about yourself..."
								value={personalForm.bio}
								onChange={(e) => handlePersonalChange("bio", e.target.value)}
								rows={4}
							/>
						</div>
						<div className="flex justify-end">
							<Button
								onClick={savePersonal}
								disabled={isSavingPersonal}
								className="min-w-32"
							>
								{isSavingPersonal ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
									</>
								) : (
									<>
										<CheckCircle2 className="mr-2 h-4 w-4" /> Save Changes
									</>
								)}
							</Button>
						</div>
					</CardContent>
				</Card>
			</TabsContent>

			{/* Volunteering Section */}
			{/* My Schedule — booked worship & Bible Reading hours */}
			<TabsContent value="schedule" className="space-y-6">
				<MyBookingsPanel />
			</TabsContent>

			{/* Volunteering */}
			<TabsContent value="volunteering" className="space-y-6">
				<Card data-usal="fade-u" className="p-2 py-4  md:p-4 w-full py-8">
					<CardHeader>
						<CardTitle>Volunteer & Service</CardTitle>
						<CardDescription>
							Select the areas where you would like to serve and volunteer.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
							{VOLUNTEER_AREAS.map((area) => (
								<div
									key={area}
									className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-accent/50 transition-colors"
								>
									<Switch
										id={`area-${area}`}
										checked={volunteerAreas.includes(area)}
										onCheckedChange={(checked) =>
											handleVolunteerToggle(area, checked)
										}
									/>
									<Label
										htmlFor={`area-${area}`}
										className="flex-1 cursor-pointer font-medium"
									>
										{area}
									</Label>
								</div>
							))}
						</div>
						<div className="rounded-lg bg-primary/5 p-4 border border-primary/10">
							<p className="text-sm text-primary font-medium">
								Note: Some roles may require specific training or background
								checks. Our team will contact you for more information once you
								select an area.
							</p>
						</div>
						<div className="flex justify-between items-center">
							<p className="text-sm text-muted-foreground">
								{volunteerAreas.length} area
								{volunteerAreas.length !== 1 ? "s" : ""} selected
							</p>
							<Button
								onClick={saveVolunteering}
								disabled={isSavingVolunteer}
								className="min-w-48"
							>
								{isSavingVolunteer ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
									</>
								) : (
									<>
										<CheckCircle2 className="mr-2 h-4 w-4" /> Save Preferences
									</>
								)}
							</Button>
						</div>
					</CardContent>
				</Card>
			</TabsContent>

			{/* Reflections Section */}
			<TabsContent value="reflections" className="space-y-6">
				<ReflectionForm />
			</TabsContent>

			{/* Account Settings */}
			<TabsContent value="membership" className="space-y-6">
				<Card className="p-2 py-4  md:p-4 w-full">
					<CardHeader>
						<CardTitle>Account Settings</CardTitle>
						<CardDescription>
							Manage your account preferences and subscription.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
							<div className="space-y-1">
								<Label className="text-base">Account Status</Label>
								<p className="text-muted-foreground text-sm">
									Your account is currently active
								</p>
							</div>
							<Badge
								variant="outline"
								className="border-green-200 bg-green-50 text-green-700 self-start sm:self-center"
							>
								Active
							</Badge>
						</div>
						<Separator />
						<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
							<div className="space-y-1">
								<Label className="text-base">Subscription Plan</Label>
								<p className="text-muted-foreground text-sm">
									{profile.membershipPlan || "Basic"} Plan
								</p>
							</div>
							<Button variant="outline" className="self-start sm:self-center">
								Manage Subscription
							</Button>
						</div>
						<Separator />
						<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
							<div className="space-y-1">
								<Label className="text-base">Account Visibility</Label>
								<p className="text-muted-foreground text-sm">
									Make your profile visible to other users
								</p>
							</div>
							<Switch defaultChecked className="self-start sm:self-center" />
						</div>
						<Separator />
						<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
							<div className="space-y-1">
								<Label className="text-base">Data Export</Label>
								<p className="text-muted-foreground text-sm">
									Download a copy of your data
								</p>
							</div>
							<Button variant="outline" className="self-start sm:self-center">
								Export Data
							</Button>
						</div>
					</CardContent>
				</Card>

				<Card className="border-destructive/50 p-2 md:p-4 w-full">
					<CardHeader>
						<CardTitle className="text-destructive">Danger Zone</CardTitle>
						<CardDescription>
							Irreversible and destructive actions
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
							<div className="space-y-1">
								<Label className="text-base">Delete Account</Label>
								<p className="text-muted-foreground text-sm">
									Permanently delete your account and all data
								</p>
							</div>

							<AlertDialog
								open={deleteDialogOpen}
								onOpenChange={setDeleteDialogOpen}
							>
								<AlertDialogTrigger asChild>
									<Button variant="destructive">
										<Trash2 className="mr-2 h-4 w-4" />
										Delete Account
									</Button>
								</AlertDialogTrigger>
								<AlertDialogContent className="sm:max-w-lg">
									<AlertDialogHeader>
										<AlertDialogTitle className="text-balance">
											Request Account Deletion
										</AlertDialogTitle>
										<AlertDialogDescription className="text-pretty">
											This action will flag your account for deletion. An
											administrator will review and finalize the removal of your
											data. Please type <strong>DELETE</strong> to confirm.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<form className="space-y-4" onSubmit={handleRequestDeletion}>
										<div>
											<Label
												htmlFor="confirm-delete"
												className="text-sm font-medium"
											>
												Confirm deletion
											</Label>
											<Input
												id="confirm-delete"
												value={deleteConfirmText}
												onChange={(e) => setDeleteConfirmText(e.target.value)}
												placeholder="Type DELETE"
												className="mt-2"
												required
											/>
										</div>
										<AlertDialogFooter>
											<AlertDialogCancel
												onClick={() => setDeleteConfirmText("")}
											>
												Cancel
											</AlertDialogCancel>
											<Button
												type="submit"
												variant="destructive"
												disabled={deleteConfirmText !== "DELETE" || isDeleting}
											>
												{isDeleting ? (
													<Loader2 className="mr-2 h-4 w-4 animate-spin" />
												) : null}
												Request Deletion
											</Button>
										</AlertDialogFooter>
									</form>
								</AlertDialogContent>
							</AlertDialog>
						</div>
					</CardContent>
				</Card>
			</TabsContent>

			{/* Security Settings */}
			<TabsContent value="security" className="space-y-6">
				<Card className="p-2 py-4  md:p-4 w-full">
					<CardHeader>
						<CardTitle>Security Settings</CardTitle>
						<CardDescription>
							Manage your account security and authentication.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="space-y-4">
							<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
								<div className="space-y-1">
									<Label className="text-base">Password</Label>
									<p className="text-muted-foreground text-sm">
										Last changed 3 months ago
									</p>
								</div>
								<Button variant="outline" className="self-start sm:self-center">
									<Key className="mr-2 h-4 w-4" />
									Change Password
								</Button>
							</div>
							<Separator />
							<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
								<div className="space-y-1">
									<Label className="text-base">Two-Factor Authentication</Label>
									<p className="text-muted-foreground text-sm">
										Add an extra layer of security
									</p>
								</div>
								<div className="flex items-center gap-2 self-start sm:self-center">
									<Badge
										variant="outline"
										className="border-green-200 bg-green-50 text-green-700"
									>
										Enabled
									</Badge>
									<Button variant="outline" size="sm">
										Configure
									</Button>
								</div>
							</div>
							<Separator />
							<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
								<div className="space-y-1">
									<Label className="text-base">Login Notifications</Label>
									<p className="text-muted-foreground text-sm">
										Get notified when someone logs into your account
									</p>
								</div>
								<Switch defaultChecked className="self-start sm:self-center" />
							</div>
							<Separator />
							<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
								<div className="space-y-1">
									<Label className="text-base">Active Sessions</Label>
									<p className="text-muted-foreground text-sm">
										Manage devices logged into your account
									</p>
								</div>
								<Button variant="outline" className="self-start sm:self-center">
									<Shield className="mr-2 h-4 w-4" />
									View Sessions
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			</TabsContent>

			{/* Notification Settings */}
			<TabsContent value="notifications" className="space-y-6">
				<Card className="p-2 py-4  md:p-4 w-full">
					<CardHeader>
						<CardTitle>Notification Preferences</CardTitle>
						<CardDescription>
							Choose what notifications you want to receive.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="space-y-4">
							<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
								<div className="space-y-1">
									<Label className="text-base">Email Notifications</Label>
									<p className="text-muted-foreground text-sm">
										Receive notifications via email
									</p>
								</div>
								<Switch defaultChecked className="self-start sm:self-center" />
							</div>
							<Separator />
							<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
								<div className="space-y-1">
									<Label className="text-base">Push Notifications</Label>
									<p className="text-muted-foreground text-sm">
										Receive push notifications in your browser
									</p>
								</div>
								<Switch className="self-start sm:self-center" />
							</div>
							<Separator />
							<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
								<div className="space-y-1">
									<Label className="text-base">Marketing Emails</Label>
									<p className="text-muted-foreground text-sm">
										Receive emails about new features and updates
									</p>
								</div>
								<Switch defaultChecked className="self-start sm:self-center" />
							</div>
							<Separator />
							<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
								<div className="space-y-1">
									<Label className="text-base">Weekly Summary</Label>
									<p className="text-muted-foreground text-sm">
										Get a weekly summary of your activity
									</p>
								</div>
								<Switch defaultChecked className="self-start sm:self-center" />
							</div>
							<Separator />
							<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
								<div className="space-y-1">
									<Label className="text-base">Security Alerts</Label>
									<p className="text-muted-foreground text-sm">
										Important security notifications (always enabled)
									</p>
								</div>
								<Switch
									checked
									disabled
									className="self-start sm:self-center"
								/>
							</div>
						</div>
					</CardContent>
				</Card>
			</TabsContent>
		</Tabs>
	);
}
