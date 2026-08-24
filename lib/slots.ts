import type { BookingSettings, EventSlot } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const SLOT_DURATION_MS = 60 * 60 * 1000;

export type SlotVisibilityMode =
	| "full_public"
	| "availability_only"
	| "admin_only";

const VISIBILITY_MODES: SlotVisibilityMode[] = [
	"full_public",
	"availability_only",
	"admin_only",
];

export function normalizeVisibility(value: unknown): SlotVisibilityMode {
	return VISIBILITY_MODES.includes(value as SlotVisibilityMode)
		? (value as SlotVisibilityMode)
		: "availability_only";
}

/**
 * Divides [startDate, endDate] into consecutive 1-hour chunks.
 *
 * DECISION POINT (approved during planning): a final partial chunk (< 1 hour)
 * is kept as a shorter bookable slot rather than dropped, so the generated
 * slots always cover the event's full declared duration.
 */
export function buildSlotRanges(
	startDate: Date,
	endDate: Date,
): { startTime: Date; endTime: Date }[] {
	const ranges: { startTime: Date; endTime: Date }[] = [];
	let cursorMs = startDate.getTime();
	const endMs = endDate.getTime();

	while (cursorMs < endMs) {
		const chunkEndMs = Math.min(cursorMs + SLOT_DURATION_MS, endMs);
		ranges.push({
			startTime: new Date(cursorMs),
			endTime: new Date(chunkEndMs),
		});
		cursorMs = chunkEndMs;
	}

	return ranges;
}

/**
 * Union-semantics regeneration:
 * - ADDS missing hourly slots inside [startDate, endDate]
 * - PRUNES leftover "open" slots that fall OUTSIDE the current window
 *   (e.g. generated before the event dates were corrected)
 * - Booked/blocked slots are never touched — outside-the-window ones are
 *   reported as `stranded` for admins to resolve.
 */
export async function syncEventSlots(eventId: string): Promise<{
	created: number;
	pruned: number;
	stranded: number;
}> {
	const event = await prisma.event.findUnique({ where: { id: eventId } });
	if (!event) throw new Error("EVENT_NOT_FOUND");

	const existing = await prisma.eventSlot.findMany({
		where: { eventId },
		select: {
			id: true,
			status: true,
			startTime: true,
			endTime: true,
		},
	});

	const existingStarts = new Set(existing.map((s) => s.startTime.getTime()));
	const missing = buildSlotRanges(event.startDate, event.endDate).filter(
		(range) => !existingStarts.has(range.startTime.getTime()),
	);

	if (missing.length > 0) {
		await prisma.eventSlot.createMany({
			data: missing.map((range) => ({
				eventId,
				startTime: range.startTime,
				endTime: range.endTime,
			})),
		});
	}

	const inWindow = (s: { startTime: Date; endTime: Date }) =>
		s.startTime >= event.startDate && s.endTime <= event.endDate;

	const stranded = existing.filter((s) => !inWindow(s) && s.status !== "open");
	const prunableIds = existing
		.filter((s) => !inWindow(s) && s.status === "open")
		.map((s) => s.id);

	let pruned = 0;
	if (prunableIds.length > 0) {
		const result = await prisma.eventSlot.deleteMany({
			where: { id: { in: prunableIds } },
		});
		pruned = result.count;
	}

	return { created: missing.length, pruned, stranded: stranded.length };
}

export async function getBookingSettings(): Promise<BookingSettings> {
	const existing = await prisma.bookingSettings.findFirst();
	if (existing) return existing;
	return prisma.bookingSettings.create({ data: {} });
}

export type BookingRulesResult = { allowed: boolean; reason?: string };

/**
 * Enforces BookingSettings.allowMultipleSlotsPerUser / maxSlotsPerUser
 * against the caller's current booked-slot count on this event.
 */
export function checkBookingRules(
	settings: Pick<
		BookingSettings,
		"allowMultipleSlotsPerUser" | "maxSlotsPerUser"
	>,
	currentBookedCount: number,
): BookingRulesResult {
	if (!settings.allowMultipleSlotsPerUser && currentBookedCount > 0) {
		return { allowed: false, reason: "You already hold a slot on this event." };
	}
	if (
		settings.allowMultipleSlotsPerUser &&
		settings.maxSlotsPerUser !== null &&
		currentBookedCount >= settings.maxSlotsPerUser
	) {
		return {
			allowed: false,
			reason: `You can book at most ${settings.maxSlotsPerUser} slots on this event.`,
		};
	}
	return { allowed: true };
}

export type RedactedSlot = Omit<EventSlot, "assignedUserId"> & {
	assignedUserName?: string;
	/** True when this slot belongs to the requesting viewer. */
	isMine?: boolean;
};

/**
 * Server-side visibility enforcement. Never rely on client filtering:
 * - admins see everything incl. assignee names
 * - "admin_only" hides the whole list from non-admins (empty array)
 * - "availability_only" strips identities (but keeps the viewer's own slots marked)
 * - "full_public" includes assignee display name
 */
export function redactSlots<T extends EventSlot & { assignedUser?: unknown }>(
	slots: T[],
	viewerIsAdmin: boolean,
	visibility: SlotVisibilityMode,
	resolveName: (assignedUser: unknown) => string | undefined = () => undefined,
	currentUserId?: string | null,
): RedactedSlot[] {
	if (viewerIsAdmin) {
		return slots.map(({ assignedUserId, assignedUser, ...slot }) => ({
			...slot,
			isMine: Boolean(currentUserId && assignedUserId === currentUserId),
			assignedUserName: resolveName(assignedUser),
		}));
	}
	if (visibility === "admin_only") return [];
	return slots.map(({ assignedUserId, assignedUser, ...slot }) =>
		visibility === "full_public"
			? {
					...slot,
					isMine: Boolean(currentUserId && assignedUserId === currentUserId),
					assignedUserName: resolveName(assignedUser),
				}
			: {
					...slot,
					isMine: Boolean(currentUserId && assignedUserId === currentUserId),
				},
	);
}

export function resolveAssigneeName(assignedUser: unknown): string | undefined {
	if (!assignedUser || typeof assignedUser !== "object") return undefined;
	const user = assignedUser as {
		name?: string | null;
		profile?: { displayName?: string | null } | null;
	};
	return user.profile?.displayName?.trim() || user.name?.trim() || undefined;
}
