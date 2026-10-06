# Mobile Card Lists for Admin Tables — Design

**Date:** 2026-10-06
**Status:** Approved (design), pending spec review
**Scope:** Event Management, User Management, Video Management tables

## Problem

The three admin tables overflow horizontally on mobile viewports (360–390px):

- `components/admin/event-management.tsx` (table lines 573–716) — 6 columns; only *Ministers* gated `hidden md:table-cell`.
- `components/admin/user-management.tsx` (table lines 168–341) — no responsive gating at all; widest row (avatar + unwrapped email + status + 110px role `Select` + up to 3 icon buttons, all `whitespace-nowrap`).
- `components/admin/video-management.tsx` (table lines 292–367) — 4 columns; URL gated `hidden md:table-cell`.

`TableHead`/`TableCell` force `whitespace-nowrap`, so intrinsic table width exceeds 360px. Page headers (`flex justify-between items-center mb-8`, no `flex-wrap`) are a secondary overflow source for the "New Event"/"New Video" buttons.

## Decisions (user-approved)

1. **Dual render:** keep the existing tables for `md+`; render cards **only below `md`** (matches the existing `hidden md:table-cell` gating — one consistent 768px threshold). Desktop workflow unchanged.
2. **Card style:** collapsible cards in the style of `components/shadcn-space/collapsible/collapsible-04.tsx` — primary info always visible in the trigger; secondary details + actions behind tap-to-expand.
3. **Scope:** exactly the three named tables. Volunteer-management and other tables untouched.
4. **Architecture: Approach A** — one generic `CollapsibleCard` shell + three thin per-table renderers. `collapsible-04.tsx` stays untouched as the reference demo.

## Architecture

### New primitive: `components/shadcn-space/collapsible/collapsible-card.tsx`

`"use client"` component extracted from `collapsible-04`:

- Same card shell (rounded border, padding, `bg-card`), same rotating-chevron `CollapsibleTrigger` header, same `AnimatePresence` + `height: auto` expand animation.
- `containerVariants` / `itemVariants` typed as `Variants` (from `motion/react`) at declaration.
- API:

```tsx
type CollapsibleCardProps = {
  trigger: React.ReactNode; // always-visible header
  children: React.ReactNode; // expanded body
  defaultOpen?: boolean;
  className?: string;
};
```

Only the shell is shared; tables compose `trigger`/`children` with primitives they already import (`Avatar`, `Badge`, `Separator`, `Button`, `Select`, `Switch`, `AlertDialog`).

### Per-table integration (3 files)

- Existing `<Table>` markup untouched, wrapped `hidden md:block`.
- New sibling `<div className="md:hidden space-y-3">` renders `<CollapsibleCard>` per row.
- Each file extracts a local actions helper — `eventActions(event)`, `userActions(user)`, `videoActions(video)` — used in **both** the table cell and the card body (single source of truth for handlers, avoids JSX duplication).
- Loading/empty states duplicated for the card list (same `Loader2` spinner, same empty copy).

## Card content

### Events
- **Trigger:** poster thumb (or `Calendar` placeholder) · title + `/slug` · status pill · date/time line (muted).
- **Body:** Bookings `Switch` row (labeled) · ministers avatar stack (labeled) · action row (`eventActions`: Edit, Delete).
- Ministers are already `hidden md:table-cell` today → body placement loses nothing.

### Users
- **Trigger:** avatar · name (+ `Shield` if admin, + Volunteer badge) · status line (`Active`/`Banned` + "Deletion Requested" badge).
- **Body:** email row (wraps) · volunteer areas · role `Select` (`w-full`) · action row (`userActions`: Ban/Unban, Revoke if pending, Delete + `AlertDialog`).
- Worst overflow case → role Select and all buttons move entirely into the body.

### Videos
- **Trigger:** type pill (`VOD`/`LIVE`) · title.
- **Body:** URL row (`break-all`, muted — already `hidden md:table-cell`) · action row (`videoActions`: Play, Edit, Delete).

### Shared body layout
`flex flex-col gap-3 pt-3`, separated from the trigger by the shell's `Separator`; action row right-aligned `flex flex-wrap justify-end gap-2` (repo idiom from `bookings-agenda.tsx`).

## Responsive wiring

| Concern | Treatment |
|---|---|
| Table wrapper | add `hidden md:block` to existing `rounded-md border bg-card/50 backdrop-blur-sm` div |
| Card list | `md:hidden space-y-3` sibling |
| Breakpoint | `md` (768px), matching existing column gating |
| Page headers (3 files) | add `flex-wrap gap-3` so action buttons wrap at 360px |
| Overflow safety | cards use `min-w-0` + `truncate`/`break-all` + wrapping action rows; no `overflow-x-auto` reliance |

## Error handling

None new — all existing mutation handlers (`toggleBookingOpen`, `onRoleChange`, `onToggleBan`, `onRevokeDeletion`, `onDeleteUser`, `handleEdit`, `requestDelete`, `window.open`) are reused via the actions helpers.

## Verification

1. `bunx tsc --noEmit` → exit 0.
2. Targeted `bunx biome check --write` on changed files → clean on re-check.
3. Playwright @360×800 (auth cookie from `.superpowers/sdd/session-cookie.txt`): visit `/dashboard/admin/events`, `/dashboard/admin/users`, `/dashboard/admin`; capture collapsed + expanded screenshots per card type; assert `document.documentElement.scrollWidth <= 360`.
4. Playwright @1280: table visible, card list hidden (no double render).
5. Manual interaction from card bodies: bookings `Switch`, role `Select`, delete `AlertDialog`, Play `window.open`.

No unit tests exist for these components; verification is typecheck + lint + Playwright evidence (repo runner: `bun test`).

## Out of scope

- `components/admin/volunteer-management.tsx`, public events table, blog tables — same pattern, separate pass if desired.
- Root layout / `SidebarInset` `min-w-0` hardening — not required once tables are hidden below `md`.
- Any changes to `collapsible-04.tsx` (reference demo stays byte-identical).
