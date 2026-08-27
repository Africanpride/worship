import { type NextRequest, NextResponse } from "next/server";
import { log } from "@/lib/logger";
import { notify } from "@/lib/notify";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function isAuthorized(req: NextRequest): boolean {
	const cronSecret = process.env.CRON_SECRET;
	// Allow Vercel Cron header in production
	if (req.headers.get("x-vercel-cron") === "1") return true;
	if (!cronSecret) {
		// In dev without secret, allow
		if (process.env.NODE_ENV !== "production") return true;
		return false;
	}
	const auth = req.headers.get("authorization");
	return auth === `Bearer ${cronSecret}`;
}

function channelForOffset(
	offset: number,
): Array<"inapp" | "email" | "push" | "sms"> {
	if (offset >= 60 * 12) return ["inapp", "email"]; // 12h+ e.g. 1440
	if (offset >= 30) return ["inapp", "email", "push"];
	return ["sms"];
}

function humanOffset(offset: number): string {
	if (offset >= 1440)
		return `${Math.round(offset / 1440)} day${offset === 1440 ? "" : "s"}`;
	if (offset >= 60)
		return `${Math.round(offset / 60)} hour${offset === 60 ? "" : "s"}`;
	return `${offset} minutes`;
}

// POST /api/cron/reminders — hourly Vercel Cron
export async function POST(req: NextRequest) {
	if (!isAuthorized(req)) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const now = new Date();
	const windowEnd = new Date(now.getTime() + 65 * 60 * 1000); // 65m covers cron jitter
	const windowStart = new Date(now.getTime() - 10 * 60 * 1000);
	const horizon = new Date(
		now.getTime() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000,
	); // 25h horizon for 24h offset triggerAt

	try {
		const admin = await prisma.adminNotificationSettings.findUnique({
			where: { singleton: "singleton" },
		});
		const offsets = admin?.reminderOffsets ?? [1440, 60];
		// Normalize offsets sorted desc
		const sortedOffsets = [...new Set(offsets)].sort((a, b) => b - a);

		// Find booked slots whose triggerAt falls in [windowStart, windowEnd] for some offset
		// Instead of complex query, fetch horizon slots then filter in JS (indexed by startTime)
		const slots = await prisma.eventSlot.findMany({
			where: {
				status: "booked",
				startTime: { gte: now, lte: horizon },
				assignedUserId: { not: null },
			},
			include: { event: { select: { title: true, location: true } } },
			orderBy: { startTime: "asc" },
		});

		let checked = 0;
		let sent = 0;
		let skippedDedup = 0;

		const tasks: Promise<void>[] = [];

		for (const slot of slots) {
			if (!slot.assignedUserId) continue;
			for (const offset of sortedOffsets) {
				const triggerAt = new Date(
					slot.startTime.getTime() - offset * 60 * 1000,
				);
				if (triggerAt < windowStart || triggerAt > windowEnd) continue;

				checked += 1;
				const channels = channelForOffset(offset).filter((ch) => {
					if (ch === "email" && !admin?.emailEnabled) return false;
					if (ch === "push" && !admin?.pushEnabled) return false;
					if (ch === "sms" && !admin?.smsEnabled) return false;
					return true;
				}) as Array<"inapp" | "email" | "push" | "sms">;

				if (channels.length === 0) continue;

				// Dedup per slot+channel+triggerAt — try create, skip on unique violation
				for (const channel of channels) {
					const dedupTask = (async () => {
						try {
							await prisma.notificationDedup.create({
								data: { slotId: slot.id, channel, triggerAt },
							});
						} catch (e: unknown) {
							// P2002 unique violation → already sent
							const isUnique =
								typeof e === "object" &&
								e !== null &&
								"code" in e &&
								(e as { code: string }).code === "P2002";
							if (isUnique) {
								skippedDedup += 1;
								return;
							}
							throw e;
						}

						const trackLabel =
							slot.track === "bible-reading" ? "Bible Reading" : "Worship";
						const when = slot.startTime.toLocaleString("en-GB", {
							weekday: "short",
							day: "numeric",
							month: "short",
							hour: "numeric",
							minute: "2-digit",
							hour12: true,
						});

						await notify(slot.assignedUserId as string, {
							title: `${trackLabel} in ${humanOffset(offset)} — ${slot.event.title}`,
							body: `Your ${trackLabel.toLowerCase()} hour starts at ${when}${slot.event.location ? ` · ${slot.event.location}` : ""}. Manage at /dashboard/events`,
							link: "/dashboard/events",
							slotId: slot.id,
							eventId: slot.eventId,
							channels: [channel],
						});
						sent += 1;
					})();
					tasks.push(dedupTask);
				}
			}
		}

		// Chunk concurrency 25
		for (let i = 0; i < tasks.length; i += 25) {
			await Promise.allSettled(tasks.slice(i, i + 25));
		}

		await log.info("system", "cron reminders completed", {
			meta: {
				slots: String(slots.length),
				checked: String(checked),
				sent: String(sent),
				skippedDedup: String(skippedDedup),
				offsets: sortedOffsets.join(","),
			},
		});

		return NextResponse.json({
			checked,
			sent,
			skippedDedup,
			slots: slots.length,
			offsets: sortedOffsets,
		});
	} catch (error) {
		log.error("system", "cron reminders failed", {
			detail: error instanceof Error ? error.message : String(error),
		});
		return NextResponse.json({ error: "Internal Error" }, { status: 500 });
	}
}

export async function GET(req: NextRequest) {
	// Allow GET for manual trigger (same auth)
	return POST(req);
}
