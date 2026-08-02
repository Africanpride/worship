import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/profile — fetch the current user's profile
export async function GET() {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const profile = await prisma.profile.findUnique({
			where: { userId: session.user.id },
		});

		if (!profile) {
			return NextResponse.json({ error: "Profile not found" }, { status: 404 });
		}

		return NextResponse.json(profile);
	} catch (error) {
		console.error("[PROFILE_GET]", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}

// PATCH /api/profile — update the current user's profile
export async function PATCH(req: NextRequest) {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await req.json();

		const currentProfile = await prisma.profile.findUnique({
			where: { userId: session.user.id },
			select: { firstName: true, lastName: true, displayName: true },
		});

		const {
			firstName,
			lastName,
			phone,
			jobTitle,
			company,
			location,
			bio,
			displayName,
			username,
			avatarUrl,
			volunteerAreas,
			membershipPlan,
		} = body;

		// Calculate synchronized names
		const newFirstName =
			firstName !== undefined ? firstName : currentProfile?.firstName || "";
		const newLastName =
			lastName !== undefined ? lastName : currentProfile?.lastName || "";
		const computedFullName =
			`${newFirstName} ${newLastName}`.trim() || session.user.name;

		// Build update payload
		const updateData: Record<string, any> = {};
		if (firstName !== undefined) updateData.firstName = firstName;
		if (lastName !== undefined) updateData.lastName = lastName;
		if (phone !== undefined) updateData.phone = phone;
		if (jobTitle !== undefined) updateData.jobTitle = jobTitle;
		if (company !== undefined) updateData.company = company;
		if (location !== undefined) updateData.location = location;
		if (bio !== undefined) updateData.bio = bio;

		// Always sync displayName to computed name if names were provided,
		// or use provided displayName if names weren't touched
		if (firstName !== undefined || lastName !== undefined) {
			updateData.displayName = computedFullName;
		} else if (displayName !== undefined) {
			updateData.displayName = displayName;
		}

		if (username !== undefined) updateData.username = username;
		if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;
		if (volunteerAreas !== undefined)
			updateData.volunteerAreas = volunteerAreas;
		if (membershipPlan !== undefined)
			updateData.membershipPlan = membershipPlan;

		// 1. Update Profile
		const profile = await prisma.profile.upsert({
			where: { userId: session.user.id },
			update: updateData,
			create: {
				userId: session.user.id,
				username: username || session.user.email.split("@")[0],
				displayName: updateData.displayName || computedFullName,
				...updateData,
			},
		});

		// 2. Synchronize to User model
		if (firstName !== undefined || lastName !== undefined) {
			await prisma.user.update({
				where: { id: session.user.id },
				data: { name: computedFullName },
			});
		}

		return NextResponse.json(profile);
	} catch (error) {
		console.error("[PROFILE_PATCH]", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}

// DELETE /api/profile — delete the current user's profile
export async function DELETE() {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		await prisma.profile.delete({
			where: { userId: session.user.id },
		});

		return NextResponse.json({ message: "Profile deleted successfully" });
	} catch (error) {
		console.error("[PROFILE_DELETE]", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
