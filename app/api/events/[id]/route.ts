import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { title, slug, startDate, endDate, poster, description, status, ministers, sponsorIds } = body;

    if (!id) {
      return new NextResponse("Event ID is required", { status: 400 });
    }

    // Update the event
    const event = await prisma.event.update({
      where: {
        id,
      },
      data: {
        title,
        slug,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        poster,
        description,
        status,
        sponsorIds: sponsorIds || [],
      },
    });

    // Sync ministers: Simple approach - delete and recreate
    if (ministers) {
      await prisma.minister.deleteMany({
        where: {
          eventId: id,
        },
      });

      await prisma.minister.createMany({
        data: ministers.map((m: any) => ({
          name: m.name,
          role: m.role,
          image: m.image,
          eventId: id,
        })),
      });
    }

    const updatedEvent = await prisma.event.findUnique({
      where: { id },
      include: {
        ministers: true,
        sponsors: true,
      },
    });

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error("[EVENT_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;

    if (!id) {
      return new NextResponse("Event ID is required", { status: 400 });
    }

    const event = await prisma.event.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error("[EVENT_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
