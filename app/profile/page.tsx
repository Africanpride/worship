import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import ProfilePage from "@/components/profile-page/page";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
// make this page dynamic
export const dynamic = "force-dynamic";
const Profile = async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect("/login");
	}

	const userWithProfile = await prisma.user.findUnique({
		where: { id: session.user.id },
		include: {
			profile: true,
		},
	});

	if (!userWithProfile) {
		redirect("/login");
	}

	let profile = userWithProfile.profile;

	if (!profile) {
		profile = await prisma.profile.create({
			data: {
				userId: userWithProfile.id,
				username: userWithProfile.email.split("@")[0],
				displayName: userWithProfile.name,
				firstName: userWithProfile.name.split(" ")[0] || "",
				lastName: userWithProfile.name.split(" ").slice(1).join(" ") || "",
				avatarUrl: userWithProfile.image,
			},
		});
	}

	return (
		<>
			<ProfilePage user={userWithProfile} profile={profile} />
		</>
	);
};

export default Profile;
