import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
	try {
		const sponsors = await prisma.sponsor.findMany({
			orderBy: {
				name: "asc",
			},
		});
		return NextResponse.json(sponsors);
	} catch (error) {
		console.error("[SPONSORS_GET]", error);
		return new NextResponse("Internal Error", { status: 500 });
	}
}
