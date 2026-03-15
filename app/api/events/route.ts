import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      include: {
        ministers: true,
        sponsors: true,
      },
      orderBy: {
        startDate: "desc",
      },
    });
    return NextResponse.json(events);
  } catch (error) {
    console.error("[EVENTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { title, slug, startDate, endDate, poster, description, status, ministers, sponsorIds } = body;

    if (!title || !slug || !startDate || !endDate) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const event = await prisma.event.create({
      data: {
        title,
        slug,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        poster,
        description,
        status: status || "published",
        ministers: {
          create: ministers?.map((m: any) => ({
            name: m.name,
            role: m.role,
            image: m.image,
          })),
        },
        sponsorIds: sponsorIds || [],
      },
      include: {
        ministers: true,
        sponsors: true,
      },
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error("[EVENTS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
