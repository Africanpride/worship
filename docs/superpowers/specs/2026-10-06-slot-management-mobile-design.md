# Worship & Bible Reading Slot Management — Mobile Improvements (Design)

## Problem Statement

`/dashboard/admin/bookings` renders two views — **Worship Slot Management** (`?track=worship`, the default) and **Bible Reading Slot Management** (`?track=bible-reading`). Both are the *same* component, `components/admin/bookings-agenda.tsx`; only the header copy and the `track` value differ, so one fix covers both views.

On a 360px phone the page is painful to use:

1. **Page padding** — `p-8 pt-6` (plus the dashboard layout's `p-4`) leaves ~264px of content width.
2. **Agenda below the fold** — settings forms render above the agenda on mobile, so the actual slots are off-screen.
3. **Filter bar** — `grid-cols-1` stacks the four controls plus search into ~5 full-width rows before any content.
4. **Slot rows clip instead of wrap** — `AgendaRow` puts a 64px time column, status dot, text block, avatar, and a `shrink-0` cluster of 3 action buttons on one non-wrapping line. The event title/location/booker text is squeezed to ~70px.
5. **Gap rows** ("N consecutive unbooked hours") use `flex justify-between` with no wrap — three elements on one line.
6. **Touch targets** — day-header batch buttons and gap-row block buttons are `h-6 text-[10px]` (24px tall); row actions are `h-7` (28px). All below practical touch minimums.
7. **Long date labels** can push the day-header batch buttons off-screen (no `min-w-0` on the label).

## Decisions

Scope agreed with the user: **fix the pain points in place** — no Filters Sheet, no kebab menu, no card redesign. Every layout change is gated behind `< sm` (640px) or `md` (768px) variants so desktop rendering is byte-for-byte identical.

### 1. Page padding — `app/dashboard/admin/bookings/page.tsx:17`

`p-8 pt-6` → `p-4 md:p-6`, matching `app/dashboard/admin/logs/page.tsx` (`p-4` already covers the top padding). Recovers ~32px of horizontal space (264px → ~296px content width).

### 2. Agenda first on mobile — `page.tsx:18-25`

Reorder via order utilities, no DOM move:

| Element | Classes |
|---|---|
| settings column | `order-2 lg:order-1` |
| agenda column | `order-1 lg:order-2` |
| grid gap | `gap-6` → `gap-4 md:gap-6` |

On `lg+`, auto-placement follows order-modified document order and reproduces today's layout exactly (settings col 1, agenda cols 2-3).

### 3. Filter bar to 2 columns — `bookings-agenda.tsx:459`

`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` → **`grid-cols-2 lg:grid-cols-4`**.
At 360px: Event + Timeframe on row 1, Track + Status on row 2 (~143px/cell; `text-xs` values fit). Control stack drops from 5 rows to 3 (two filter rows + full-width search).

### 4. Header title block — `bookings-agenda.tsx:411`

`max-w-xs` → `max-w-none sm:max-w-xs` so the subtitle wraps at most twice on phones.

### 5. `AgendaRow` actions wrap to a second line — `bookings-agenda.tsx:916, 1016`

- Content column (L916): `flex items-center gap-3 min-w-0` → `flex flex-wrap items-center gap-3 min-w-0`.
- Action cluster (L1016): add **`max-sm:basis-full`** → on phones the cluster always occupies its own full-width line beneath the text; on `sm+` `basis` is untouched, so desktop is unchanged.

Line 1 becomes `status dot + title/badges + location + booker`, gaining the avatar's and cluster's width.

### 6. Hide avatar below `sm` — `bookings-agenda.tsx:1000`

`size-7 border-2 border-background shrink-0` → add `max-sm:hidden`. The booker's name and email are already printed as text in the same row (L978-991), so the avatar is redundant on narrow screens; this reclaims ~40px (avatar + gap) for the title.

### 7. Row action buttons ≥36px on phones — `bookings-agenda.tsx:1023, 1039, 1050`

`h-7 px-2` → `h-7 max-sm:h-9 max-sm:px-3` on all three (Assign/Reassign, Unblock, Block). Desktop keeps `h-7`. Existing `max-sm:opacity-100` at L1016 is retained (it only governs hover opacity, not layout).

### 8. Gap row wraps — `bookings-agenda.tsx:782-819`

- Outer div: add `flex-wrap`.
- Inner "time · N hours · View N slots" button (L783): add `min-w-0 max-sm:basis-full` → full-width line 1.
- "Block N hrs" button (L804): add `max-sm:basis-full max-sm:h-9` → full-width line 2 with a proper touch target.

### 9. Day-header batch buttons — `bookings-agenda.tsx:725, 743`

`h-6 px-2` → `h-6 max-sm:h-9 max-sm:px-3` (Block day / Unblock day). The header already `flex-wrap`s, so they drop below the date label on narrow screens.

### 10. Day-header label truncation guard — `bookings-agenda.tsx:690`

Add `min-w-0` to the label span so `Wednesday, 8 October 2026 (5 hrs: …)` wraps instead of pushing the batch buttons out of view.

## Non-goals

- No Filters Sheet / filter collapse.
- No kebab menu or card-based row redesign (possible follow-up if the file keeps growing).
- No changes to `ReassignDialog`, `ExportBookingsDialog`, `SlotHistoryDialog` — already responsive.
- No API, data-fetching, or state changes; purely class-level.
- No desktop visual changes at any breakpoint ≥640px (except the page-level `md:` padding, which is a deliberate correction toward the rest of the admin section).

## Risks / edge cases

- **`basis-full` + `flex-wrap` interplay**: the action cluster must not force line 1 to wrap prematurely — `min-w-0` on the text block (already present, L941) keeps it shrinking. Verify with a long event title.
- **Order utilities on `lg`**: confirm the 3-column grid still places settings left / agenda right at 1440px.
- **`max-sm:` variants**: project uses Tailwind v4; `max-sm:` is supported. No arbitrary values needed, so no `(--var)` syntax pitfalls.
- **Authenticated verification**: the page requires an admin session for screenshots (see below).

## Testing / verification

1. `bun run lint` and `bun run typecheck` pass (repo conventions).
2. `bun run build` succeeds.
3. Playwright screenshots, before and after, at **360×800** and **390×844** for both `?track=worship` and `?track=bible-reading`.
4. One desktop screenshot at **1440×900** to prove no regression.
5. Visual acceptance criteria on 360px:
   - Agenda is the first block on the page (settings below it).
   - Filter area is ≤3 rows tall.
   - Every slot row shows the full event title without clipping; actions sit on their own line.
   - Gap rows show two stacked lines, neither clipped.
   - All tappable controls are ≥36px tall.
6. If no local admin credentials are available for the Playwright run, the author performs the final visual pass manually.
