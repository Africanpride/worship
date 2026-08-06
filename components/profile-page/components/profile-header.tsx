import { format } from "date-fns";
import { Calendar, Camera, Mail, MapPin } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ProfileHeaderProps {
	user: any;
	profile: any;
}

export default function ProfileHeader({ user, profile }: ProfileHeaderProps) {
	const joinedDate = user.createdAt ? new Date(user.createdAt) : new Date();
	const initials = user.name
		? user.name
				.split(" ")
				.map((n: string) => n[0])
				.join("")
				.toUpperCase()
		: "??";

	const isVolunteer =
		profile.volunteerAreas && profile.volunteerAreas.length > 0;

	return (
		<Card className="overflow-hidden border-none shadow-lg bg-gradient-to-r from-primary/5 via-background to-background p-2 md:p-4 w-full">
			<CardContent className="p-0">
				<div className="relative h-32 w-full bg-gradient-to-r from-primary/20 to-primary/5 md:h-40 overflow-hidden">
					{profile.bannerUrl && (
						<Image
							src={profile.bannerUrl}
							alt="Banner"
							fill
							sizes="100vw"
							className="object-cover opacity-50"
						/>
					)}
				</div>
				<div className="flex flex-col gap-4 px-4 pb-6 sm:px-6 md:flex-row md:items-end md:gap-8 -mt-12 md:-mt-16">
					{/* Avatar */}
					<div className="relative group shrink-0">
						<Avatar className="h-24 w-24 border-4 border-background shadow-xl md:h-32 md:w-32">
							<AvatarImage src={user.image || undefined} alt={user.name} />
							<AvatarFallback className="text-3xl font-bold bg-muted text-muted-foreground">
								{initials}
							</AvatarFallback>
						</Avatar>
						<Button
							size="icon"
							variant="secondary"
							className="absolute right-0 bottom-0 h-9 w-9 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
							title="Change Profile Picture"
						>
							<Camera className="size-4" />
						</Button>
					</div>
					{/* Info */}
					<div className="flex-1 min-w-0 space-y-2 pt-1 md:pt-2">
						<div className="flex flex-wrap items-center gap-2">
							<h1 className="text-2xl font-extrabold text-foreground sm:text-3xl">
								{user.name}
							</h1>
							<div className="flex flex-wrap gap-2">
								<Badge
									variant="default"
									className="bg-primary text-primary-foreground font-semibold px-3 uppercase tracking-wider text-[10px]"
								>
									{profile.membershipPlan || "Basic"}
								</Badge>
								{isVolunteer && (
									<Badge
										variant="secondary"
										className="font-medium uppercase tracking-wider text-[10px]"
									>
										Volunteer
									</Badge>
								)}
							</div>
						</div>
						<p className="text-base font-medium text-primary/80 truncate">
							{profile.jobTitle || "Member"}{" "}
							{profile.company ? ` at ${profile.company}` : ""}
						</p>
						<div className="text-muted-foreground flex flex-wrap gap-x-4 gap-y-2 text-sm font-medium">
							<div className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer min-w-0">
								<Mail className="size-4 text-primary shrink-0" />
								<span className="truncate">{user.email}</span>
							</div>
							{profile.location && (
								<div className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer">
									<MapPin className="size-4 text-primary shrink-0" />
									{profile.location}
								</div>
							)}
							<div className="flex items-center gap-1.5">
								<Calendar className="size-4 text-primary shrink-0" />
								Joined {format(joinedDate, "MMMM yyyy")}
							</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
