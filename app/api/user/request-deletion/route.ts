import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		await prisma.user.update({
			where: { id: session.user.id },
			data: { pendingDeletion: true },
		});

		return NextResponse.json({ message: "Deletion request submitted" });
	} catch (error) {
		console.error("[REQUEST_DELETION_POST]", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
