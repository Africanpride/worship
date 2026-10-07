# Prayer Slots — Implementation Plan

Add **Prayer** as a third parallel slot track alongside Worship and Bible Reading.

**Summary:** Extend the existing `track` mechanism (`"worship" | "bible-reading"`) with `"prayer"` — exclusive 1-person/hour bookings that reuse all booking, quota, reassign, reminder, and ICS logic untouched. No backfill: past events stay 2-track; Prayer slots appear via `syncEventSlots` on new events, date changes, or manual Regenerate. Riskiest assumption: that no runtime code path treats `track` as a closed set in a way we missed (the survey found 3 allowlists + 9 label ternaries; anything missed will render Prayer as "Worship").

---

## Section 1 — Decisions you'll probably want to tweak

### D1. Prayer is a plain third track, same data model
- **Choice:** `"prayer"` appended to `TRACKS` in `lib/slots.ts:7` + `TRACK_LABELS` (`prayer: "Prayer"`). No schema migration — `EventSlot.track` is a `String` with an existing index (`prisma/schema.prisma:244`, comment update only).
- **Alternative considered:** dedicated fields/table for prayer (e.g. communal multi-person slots) — rejected in interview (decision A1: exclusive, same model).
- **Cost to change later:** switching Prayer to communal/multi-person is a genuinely different booking model (new fields, book-route logic, UI) — cheap to *keep* as a track now, expensive to change later. This is the decision most worth a second look.

### D2. No backfill of existing events
- **Choice:** don't run `scripts/generate-slots.ts`. `syncEventSlots` loops `TRACKS`, so Prayer slots are created automatically on event create, date change, and admin **Regenerate** (`app/api/events/[id]/slots/regenerate/route.ts`).
- **Alternative considered:** one-shot backfill for all events — rejected (decision A2; past events no longer necessary).
- **Cost to change later:** just run `bun scripts/generate-slots.ts` whenever wanted — fully reversible, zero code change.

### D3. Copy neutralized via `TRACK_LABELS`, not new hardcoding
- **Choice:** every track label ternary becomes `TRACK_LABELS[slot.track]`; generic wording replaces worship-flavored copy ("Singer" → "Assignee", "My Worship Slots" → "My Slots", email H1 and ICS `X-WR-CALNAME` become track-aware or generic). Marketing pages (`app/scripture-reading`, `app/prayer-wall`) untouched.
- **Alternative considered:** minimal diff (only fix where Prayer would be mislabeled) — rejected (decision A3).
- **Cost to change later:** trivial string tweaks; worst case is copy sounds more generic than desired.

### D4. Third admin nav entry, no mixed view
- **Choice:** sidebar gets `Prayer Slots → /dashboard/admin/bookings?track=prayer` (`components/app-sidebar.tsx:57-68`), mirroring the existing two. `app/dashboard/admin/bookings/page.tsx:14` must accept `prayer` in its `?track=` parse (today it coerces anything non-`bible-reading` to `worship`).
- **Alternative considered:** consolidated "Slots" page with a 3-way filter — rejected (decision A4); would change how existing pages work.
- **Cost to change later:** consolidation would be a follow-up refactor; adding a nav row is one object literal.

### D5. Booking quota stays per-track (automatic)
- **Choice:** no code change. `book/route.ts:105-114` already counts bookings scoped to `slot.track`, so a user gets a separate Prayer quota. `BookingSettings` (caps, visibility) remains global, applying identically to all three tracks.
- **Cost to change later:** if Prayer should share a cap with Worship, that's a deliberate rule change in `checkBookingRules` — flag it when seen in practice.

---

## Section 2 — Known unknowns

| Unknown | Default taken | Pivot signal |
|---|---|---|
| Missed closed-set `track` check beyond the 3 allowlists + 9 ternaries found | `bun run typecheck` + `bun run build` catch union-typed sites; runtime allowlists found by grep for `"bible-reading"` | Prayer filter returns nothing / Prayer renders as "Worship" anywhere → grep `"bible-reading"` again and fix |
| Slot volume jump on Regenerate (3rd set of hourly rows) | Cosmetic only: agenda event `_count.slots` and `agenda/route.ts:94` counts include all tracks | Counts confuse admins → count filtered by active track |
| Audit rows store raw slug in `entityLabel` (`worship`, `bible-reading`, now `prayer`) | Historic rows keep old slugs; filters must not assume a fixed set | Audit UI grouping breaks → normalize via `TRACK_LABELS` lookup with fallback |
| Reminder/ICS/email templates assume 2 tracks | All consumed labels via `TRACK_LABELS` after D3 | Any hardcoded "Worship" surfacing in notifications → same label sweep |
| Track toggle layout (`grid grid-cols-2` in `booking-dialog.tsx:297`) | Becomes `grid-cols-3` (fits mobile at current paddings) | Buttons cramped on small screens → wrap or scrollable row |

No remaining unknowns are worth blocking on; defaults above are all cheap to adjust mid-implementation.

---

## Section 3 — Mechanical work

**1. Canonical type (drives everything else)**
- `lib/slots.ts`: add `"prayer"` to `TRACKS`, `prayer: "Prayer"` to `TRACK_LABELS`. This automatically fixes slot generation (`syncEventSlots` loop) and the public booking toggle (`TRACKS.map` in `booking-dialog.tsx:298`).

**2. Replace 3 hardcoded allowlists with `TRACKS.includes(...)`**
- `app/api/events/[id]/slots/route.ts:44`
- `app/api/admin/slots/agenda/route.ts:35`
- `app/api/admin/bookings/export/route.tsx:41`

**3. Collapse 9 label ternaries → `TRACK_LABELS[...]`**
- `lib/calendar/ics.ts:25-27` (+ `:46` `X-WR-CALNAME` → generic "Ministry Slots" or track-aware)
- `app/api/cron/reminders/route.ts:115-116`
- `app/api/admin/slots/[slotId]/assign/route.ts:150-151, 211-212`
- `app/api/admin/bookings/export/route.tsx:148` (+ `:171, :255` "Singer" → "Assignee")
- `components/admin/slot-history-dialog.tsx:118`
- `components/slots/booking-dialog.tsx:261` (+ `:469` "Confirm your hour of worship?" → track-aware)
- `components/slots/my-bookings-panel.tsx:182-189` (badge for any non-default track), `:128` ("My Worship Slots" → "My Slots"), `:165`
- `app/dashboard/admin/bookings/page.tsx:14` (accept `?track=prayer`)
- `lib/email/SlotReassigned.tsx:57` H1 → use `trackLabel` prop
- `components/admin/booking-settings-form.tsx:131` copy

**4. Admin agenda component (`components/admin/bookings-agenda.tsx`)**
- `:50`, `:226` — widen unions to include `"prayer"`
- `:388-404` — add Prayer branch to `headerCopy`
- `:561-574` — track chip: add Prayer icon (lucide `HeartHandshake` or `HandHeart`) + label from `TRACK_LABELS`
- `:613`, `:1147` — "singer" → "assignee" placeholders

**5. Public UI**
- `components/slots/booking-dialog.tsx:297` — `grid-cols-2` → `grid-cols-3`
- `components/app-sidebar.tsx:57-68` — third entry `Prayer Slots` + icon

**6. Schema comment + docs**
- `prisma/schema.prisma:244` — `// worship | bible-reading | prayer` (no migration; run `bunx prisma generate` for comment consistency)
- `docs/notification-system.md:31` — track list
- `docs/superpowers/specs/2026-10-06-slot-management-mobile-design.md:5` — two-view framing → three-view

**7. Tests & verification**
- Add exhaustiveness test in `lib/slots.test.ts`: every `TRACKS` entry has a `TRACK_LABELS` label; `normalizeTrack("prayer")` returns `"prayer"` (currently untested).
- `bun run lint` → `bun run typecheck` (if exists) → `bun test` → `bun run build`.
- Manual smoke: create an event → Regenerate → verify 3 parallel hourly sets; book a Prayer slot; admin `?track=prayer` agenda renders header/chip correctly.

**Explicitly not touched:** `EventSlot` fields/migrations, `book` route logic, reminder cron mechanics, dedup, audit action names, marketing pages.

---

## Review before I start

1. **D1 (data model)** — confirm Prayer stays a plain exclusive track (communal prayer would be a rebuild).
2. **D3 scope** — confirm the "Singer" → "Assignee" / "My Slots" neutralization sweep is wanted in this PR (touches export headers + email).
3. **Prayer icon** — `HeartHandshake` for the admin chip/sidebar, or pick another?
4. **ICS calendar name** — generic `"Ministry Slots — {name}"`, track-aware per feed, or leave `"Worship Slots"`?
