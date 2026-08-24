import { NextResponse } from "next/server";
import { log } from "@/lib/logger";
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
		log.error("system", "Sponsors fetch failed", {
			detail: error instanceof Error ? error.message : String(error),
		});
		return new NextResponse("Internal Error", { status: 500 });
	}
}
