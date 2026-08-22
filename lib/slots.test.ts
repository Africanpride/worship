import { describe, expect, it } from "bun:test";
import type { EventSlot } from "@prisma/client";
import {
	buildSlotRanges,
	checkBookingRules,
	normalizeVisibility,
	redactSlots,
	resolveAssigneeName,
} from "./slots";

const HOUR = 60 * 60 * 1000;

describe("buildSlotRanges", () => {
	it("divides an exact multiple of 1 hour into hourly chunks", () => {
		const start = new Date("2026-08-24T01:00:00Z");
		const ranges = buildSlotRanges(start, new Date(start.getTime() + 3 * HOUR));
		expect(ranges).toHaveLength(3);
		expect(ranges[0]).toEqual({
			startTime: start,
			endTime: new Date(start.getTime() + HOUR),
		});
		expect(ranges[2].endTime.getTime()).toBe(start.getTime() + 3 * HOUR);
	});

	it("keeps a final partial chunk shorter than 1 hour (approved decision)", () => {
		const start = new Date("2026-08-24T00:00:00Z");
		const end = new Date(start.getTime() + 2 * HOUR + 30 * 60 * 1000);
		const ranges = buildSlotRanges(start, end);
		expect(ranges).toHaveLength(3);
		const last = ranges[2];
		expect(last.endTime.getTime()).toBe(end.getTime());
		expect(last.endTime.getTime() - last.startTime.getTime()).toBe(
			30 * 60 * 1000,
		);
	});

	it("returns a single short slot when the range is under an hour", () => {
		const start = new Date("2026-08-24T00:00:00Z");
		const ranges = buildSlotRanges(start, new Date(start.getTime() + 1000));
		expect(ranges).toHaveLength(1);
	});
});

describe("checkBookingRules", () => {
	it("rejects a second slot when multiple slots are disallowed", () => {
		const result = checkBookingRules(
			{ allowMultipleSlotsPerUser: false, maxSlotsPerUser: null },
			1,
		);
		expect(result.allowed).toBe(false);
	});

	it("allows first booking when multiple slots are disallowed", () => {
		expect(
			checkBookingRules(
				{ allowMultipleSlotsPerUser: false, maxSlotsPerUser: null },
				0,
			).allowed,
		).toBe(true);
	});

	it("allows unlimited slots when enabled with no cap", () => {
		expect(
			checkBookingRules(
				{ allowMultipleSlotsPerUser: true, maxSlotsPerUser: null },
				50,
			).allowed,
		).toBe(true);
	});

	it("enforces the cap once reached", () => {
		const result = checkBookingRules(
			{ allowMultipleSlotsPerUser: true, maxSlotsPerUser: 2 },
			2,
		);
		expect(result.allowed).toBe(false);
		expect(result.reason).toContain("at most 2");
	});
});

function makeSlot(overrides: Partial<EventSlot> = {}): EventSlot {
	return {
		id: "slot1",
		eventId: "event1",
		startTime: new Date("2026-08-24T01:00:00Z"),
		endTime: new Date("2026-08-24T02:00:00Z"),
		status: "booked",
		assignedUserId: "user1",
		blockedByAdminId: null,
		createdAt: new Date(),
		updatedAt: new Date(),
		...overrides,
	} as EventSlot;
}

describe("redactSlots", () => {
	const slots = [makeSlot()];
	const nameOf = () => "Sister Ama";

	it("shows names to admins regardless of mode", () => {
		for (const mode of ["full_public", "availability_only", "admin_only"]) {
			const out = redactSlots(slots, true, mode as never, nameOf) as Array<{
				assignedUserName?: string;
			}>;
			expect(out).toHaveLength(1);
			expect(out[0].assignedUserName).toBe("Sister Ama");
		}
	});

	it("hides the whole list from non-admins in admin_only mode", () => {
		expect(redactSlots(slots, false, "admin_only", nameOf)).toEqual([]);
	});

	it("strips identities from non-admins in availability_only mode", () => {
		const out = redactSlots(slots, false, "availability_only", nameOf);
		expect(out).toHaveLength(1);
		expect(out[0]).not.toHaveProperty("assignedUserName");
	});

	it("includes assignee name for non-admins in full_public mode", () => {
		const out = redactSlots(slots, false, "full_public", nameOf) as Array<{
			assignedUserName?: string;
		}>;
		expect(out[0].assignedUserName).toBe("Sister Ama");
	});
});

describe("normalizeVisibility", () => {
	it("passes through valid modes", () => {
		expect(normalizeVisibility("full_public")).toBe("full_public");
	});

	it("falls back to availability_only on junk", () => {
		expect(normalizeVisibility("hacky")).toBe("availability_only");
		expect(normalizeVisibility(undefined)).toBe("availability_only");
	});
});

describe("resolveAssigneeName", () => {
	it("prefers profile displayName over user name", () => {
		expect(
			resolveAssigneeName({ name: "Kofi", profile: { displayName: "Min. K" } }),
		).toBe("Min. K");
	});

	it("falls back to raw name then undefined", () => {
		expect(resolveAssigneeName({ name: "Kofi", profile: null })).toBe("Kofi");
		expect(resolveAssigneeName(null)).toBeUndefined();
	});
});
