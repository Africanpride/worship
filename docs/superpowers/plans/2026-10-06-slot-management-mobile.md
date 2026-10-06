# Slot Management Mobile Improvements — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `/dashboard/admin/bookings` (Worship Slot Management + Bible Reading Slot Management) usable on 360–390px phones without changing anything at ≥640px.

**Architecture:** Pure CSS-class changes in two files. Both views are the same component (`components/admin/bookings-agenda.tsx`), so every agenda fix lands once for both tracks. All layout fixes are gated behind `max-sm:` (640px) / `md:` (768px) variants; page-level reordering uses `order-*` utilities so the DOM stays put.

**Tech Stack:** Next.js 16 App Router, Tailwind CSS v4, shadcn/ui, Biome, Bun.

**Spec:** `docs/superpowers/specs/2026-10-06-slot-management-mobile-design.md`

## Global Constraints

- Package manager: **bun** (`bun run lint`, `bunx tsc --noEmit`, `bun run build`).
- Every interactive element keeps `cursor-pointer` (all current ones already have it; do not drop it).
- **No visual changes at ≥640px** except the deliberate page padding change (`p-4 md:p-6`), which matches `app/dashboard/admin/logs/page.tsx`.
- No API, data-fetching, state, or component-structure changes — class strings only.
- Tailwind v4: responsive variants only (`max-sm:`, `md:`, `lg:`). No arbitrary `[...]` values needed.
- Lint is Biome: `bun run lint` (= `biome check .`). Do not introduce new lint errors.
- Repo has **no `typecheck` script**; use `bunx tsc --noEmit` directly.
- There are **no unit tests for component styling** — verification is lint + typecheck + Playwright screenshots (Task 5).

---

### Task 1: Page shell — padding, agenda-first order, gap

**Files:**
- Modify: `app/dashboard/admin/bookings/page.tsx:17-26`

**Interfaces:**
- Consumes: nothing (page-level change only).
- Produces: none — later tasks change only `components/admin/bookings-agenda.tsx`.

- [ ] **Step 1: Replace the page shell markup**

Replace lines 17–27 of `app/dashboard/admin/bookings/page.tsx`:

```tsx
// BEFORE
<div className="flex-1 space-y-4 p-8 pt-6">
	<div className="grid items-start gap-6 lg:grid-cols-3">
		<div className="lg:col-span-1 space-y-6">
			<BookingSettingsForm />
			<NotificationSettingsForm />
		</div>
		<div className="lg:col-span-2">
			<BookingsAgenda initialTrack={initialTrack} />
		</div>
	</div>
</div>

// AFTER
<div className="flex-1 space-y-4 p-4 md:p-6">
	<div className="grid items-start gap-4 md:gap-6 lg:grid-cols-3">
		<div className="order-2 lg:order-1 lg:col-span-1 space-y-6">
			<BookingSettingsForm />
			<NotificationSettingsForm />
		</div>
		<div className="order-1 lg:order-2 lg:col-span-2">
			<BookingsAgenda initialTrack={initialTrack} />
		</div>
	</div>
</div>
```

What changed: padding `p-8 pt-6` → `p-4 md:p-6`; grid gap `gap-6` → `gap-4 md:gap-6`; settings column gains `order-2 lg:order-1`; agenda column gains `order-1 lg:order-2`.

- [ ] **Step 2: Lint**

Run: `bun run lint`
Expected: no errors introduced by this file (pre-existing repo warnings elsewhere are acceptable — note them in output).

- [ ] **Step 3: Commit**

```bash
git add app/dashboard/admin/bookings/page.tsx
git commit -m "fix(bookings): mobile page padding and agenda-first ordering"
```

---

### Task 2: Header title width + 2-column filter bar

**Files:**
- Modify: `components/admin/bookings-agenda.tsx:411` (title block)
- Modify: `components/admin/bookings-agenda.tsx:459` (filter grid)

**Interfaces:**
- Consumes: nothing.
- Produces: none — class-only edits.

- [ ] **Step 1: Widen the header title block on phones**

Line 411, exact replacement:

```tsx
// BEFORE
<div className="max-w-xs">

// AFTER
<div className="max-w-none sm:max-w-xs">
```

- [ ] **Step 2: Make the filter grid 2 columns on phones**

Line 459, exact replacement:

```tsx
// BEFORE
<div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-3 border-t border-border/50">

// AFTER
<div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-2.5 pt-3 border-t border-border/50">
```

This string is unique in the file (`grep -c` returns 1).

- [ ] **Step 3: Lint**

Run: `bun run lint`
Expected: no new errors.

- [ ] **Step 4: Commit**

```bash
git add components/admin/bookings-agenda.tsx
git commit -m "fix(bookings): 2-column mobile filter bar and wider header title"
```

---

### Task 3: Slot row — wrap actions, hide avatar, bigger touch targets

**Files:**
- Modify: `components/admin/bookings-agenda.tsx:916` (content column)
- Modify: `components/admin/bookings-agenda.tsx:1000` (avatar)
- Modify: `components/admin/bookings-agenda.tsx:1023,1039,1050` (row action buttons)

**Interfaces:**
- Consumes: nothing (render-only changes inside `AgendaRow`).
- Produces: none.

- [ ] **Step 1: Allow the row content column to wrap**

Line 916, exact replacement:

```tsx
// BEFORE
<div className="flex items-center gap-3 min-w-0">

// AFTER
<div className="flex flex-wrap items-center gap-3 min-w-0">
```

- [ ] **Step 2: Hide the booker avatar below `sm`**

Line 1000, exact replacement:

```tsx
// BEFORE
<Avatar className="size-7 border-2 border-background shrink-0">

// AFTER
<Avatar className="size-7 border-2 border-background shrink-0 max-sm:hidden">
```

- [ ] **Step 3: Force the action cluster onto its own line on phones**

Line 1016, exact replacement:

```tsx
// BEFORE
<div className="flex shrink-0 items-center gap-1 opacity-90 transition-opacity group-hover:opacity-100 focus-within:opacity-100 max-sm:opacity-100">

// AFTER
<div className="flex shrink-0 max-sm:basis-full items-center gap-1 opacity-90 transition-opacity group-hover:opacity-100 focus-within:opacity-100 max-sm:opacity-100">
```

`max-sm:basis-full` = 100% width → the cluster wraps to its own line inside the now-wrapping parent. At `sm+`, `basis` stays `auto` (shrink-0), so desktop is unchanged.

- [ ] **Step 4: Enlarge all three row action buttons on phones**

One global replace in `bookings-agenda.tsx` (the string occurs exactly 3 times, all in `AgendaRow` — verify with `grep -n 'h-7 px-2 text-xs'` first, expect lines 1023, 1039, 1050):

```
OLD STRING: h-7 px-2 text-xs
NEW STRING: h-7 px-2 text-xs max-sm:h-9 max-sm:px-3
replaceAll: true
```

Resulting class strings:

```tsx
className="cursor-pointer h-7 px-2 text-xs max-sm:h-9 max-sm:px-3"
className="cursor-pointer h-7 px-2 text-xs max-sm:h-9 max-sm:px-3 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-500/10"
className="cursor-pointer h-7 px-2 text-xs max-sm:h-9 max-sm:px-3 text-destructive hover:text-destructive hover:bg-destructive/10"
```

- [ ] **Step 5: Lint**

Run: `bun run lint`
Expected: no new errors.

- [ ] **Step 6: Commit**

```bash
git add components/admin/bookings-agenda.tsx
git commit -m "fix(bookings): wrap slot-row actions on mobile and enlarge touch targets"
```

---

### Task 4: Day header + gap rows

**Files:**
- Modify: `components/admin/bookings-agenda.tsx:690` (day label)
- Modify: `components/admin/bookings-agenda.tsx:725,743` (day batch buttons)
- Modify: `components/admin/bookings-agenda.tsx:782,786,815` (gap row)

**Interfaces:**
- Consumes: nothing.
- Produces: none.

- [ ] **Step 1: Let the day label shrink**

Line 690, exact replacement:

```tsx
// BEFORE
<span className="font-semibold text-xs text-foreground uppercase tracking-wide">

// AFTER
<span className="font-semibold text-xs text-foreground uppercase tracking-wide min-w-0">
```

- [ ] **Step 2: Enlarge day batch buttons on phones**

One global replace (string occurs exactly 3 times — lines 725, 743, 815; verify with `grep -n 'h-6 px-2 text-\[10px\]'`). Applying it to all three is intended: the 815 gap button also needs the taller mobile height, and its `max-sm:basis-full` is added in Step 5):

```
OLD STRING: h-6 px-2 text-[10px]
NEW STRING: h-6 px-2 text-[10px] max-sm:h-9 max-sm:px-3
replaceAll: true
```

- [ ] **Step 3: Wrap the gap row**

Line 782, exact replacement:

```tsx
// BEFORE
<div className="flex items-center justify-between gap-2 rounded-lg border border-dashed border-border/60 bg-muted/20 px-3 py-2 text-muted-foreground transition-colors hover:bg-muted/40">

// AFTER
<div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-dashed border-border/60 bg-muted/20 px-3 py-2 text-muted-foreground transition-colors hover:bg-muted/40">
```

- [ ] **Step 4: Put the gap toggle on its own full-width line on phones**

Line 786, exact replacement:

```tsx
// BEFORE
className="flex flex-1 cursor-pointer items-center gap-2 text-left text-xs hover:text-foreground"

// AFTER
className="flex min-w-0 flex-1 max-sm:basis-full cursor-pointer items-center gap-2 text-left text-xs hover:text-foreground"
```

- [ ] **Step 5: Put the "Block N hrs" button on its own full-width line on phones**

Line 815 (after Step 2 it now reads `...text-[10px] max-sm:h-9 max-sm:px-3 text-destructive...`), exact replacement:

```tsx
// BEFORE
className="cursor-pointer h-6 px-2 text-[10px] max-sm:h-9 max-sm:px-3 text-destructive hover:bg-destructive/10"

// AFTER
className="cursor-pointer h-6 px-2 text-[10px] max-sm:h-9 max-sm:px-3 max-sm:basis-full text-destructive hover:bg-destructive/10"
```

Result on 360px: line 1 = time range + "N consecutive unbooked hours" + "View N slots" badge (full width); line 2 = Block button (full width, 36px tall). At `sm+` nothing changes.

- [ ] **Step 6: Lint**

Run: `bun run lint`
Expected: no new errors.

- [ ] **Step 7: Commit**

```bash
git add components/admin/bookings-agenda.tsx
git commit -m "fix(bookings): wrap gap rows and enlarge day batch buttons on mobile"
```

---

### Task 5: Verification — lint, typecheck, screenshots, build

**Files:**
- Modify: `.gitignore` (add `/.playwright-cli/`)
- Create (scratch, gitignored): screenshots under `.playwright-cli/slots-mobile/`

**Interfaces:**
- Consumes: Tasks 1–4 (all class changes in place).
- Produces: passing checks + before/after-style screenshots for user review.

- [ ] **Step 1: Gitignore Playwright scratch artifacts**

Append to `.gitignore` under the `# tooling logs` block:

```
# playwright scratch
/.playwright-cli/
```

- [ ] **Step 2: Static checks**

Run: `bun run lint && bunx tsc --noEmit`
Expected: both exit 0. If `tsc` reports **pre-existing** errors unrelated to these two files, record them and confirm they exist on `main` before this work (`git stash && bunx tsc --noEmit`) — do not fix unrelated errors in this plan.

- [ ] **Step 3: Start the dev server**

Run: `bun run dev` (background; wait until `Ready in` appears, default `http://localhost:3000`).
Expected: server responds — `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000` returns `200` or `307` (redirect to login).

- [ ] **Step 4: Capture screenshots**

Use the `playwright-cli` skill (installed on this machine; Playwright 1.63.0 available via `bunx playwright`).

For each of these 5 captures, set the viewport, navigate, wait for the SWR agenda fetch (~1.5s), then full-page screenshot:

| File | Viewport | URL |
|---|---|---|
| `.playwright-cli/slots-mobile/360-worship.png` | 360×800 | `/dashboard/admin/bookings?track=worship` |
| `.playwright-cli/slots-mobile/390-worship.png` | 390×844 | `/dashboard/admin/bookings?track=worship` |
| `.playwright-cli/slots-mobile/360-bible.png` | 360×800 | `/dashboard/admin/bookings?track=bible-reading` |
| `.playwright-cli/slots-mobile/390-bible.png` | 390×844 | `/dashboard/admin/bookings?track=bible-reading` |
| `.playwright-cli/slots-mobile/1440-worship.png` | 1440×900 | `/dashboard/admin/bookings?track=worship` |

If the page redirects to `/login`: log in once through the UI (admin credentials — ask the user if not available in `.env`), then continue. Keep the authenticated session for the remaining captures.

- [ ] **Step 5: Inspect the screenshots against acceptance criteria**

Read each PNG and verify on 360/390px:

1. The agenda card is the **first** block on the page (settings forms below it).
2. Filter area is **≤3 rows** tall (2 filter rows + search).
3. Every slot row shows the full event title without clipping; the three action buttons sit on **their own line** below the text.
4. Gap rows show **two stacked lines**, neither clipped.
5. Day-header buttons and all row/gap action buttons are **≥36px** tall.
6. 1440px shot: layout matches the original desktop design (settings left column, agenda right, single-line rows, `h-7` buttons).

If any criterion fails, fix the responsible class (Tasks 1–4), re-lint, and re-capture.

- [ ] **Step 6: Production build**

Run: `bun run build`
Expected: success. Note: this script runs `prisma generate && prisma db push --skip-generate && next build` and needs the database from `.env`. If the DB step fails for environment reasons, report it and rely on `next build` alone (`bunx next build`) as the compile check.

- [ ] **Step 7: Commit verification artifacts**

```bash
git add .gitignore
git commit -m "chore: gitignore playwright scratch artifacts"
```

Screenshots stay untracked (gitignored). Stop the dev server.

---

## Self-Review notes

- Spec coverage: decisions 1–2 → Task 1; 3–4 → Task 2; 5–7 → Task 3; 8–10 → Task 4; verification section → Task 5. All 10 decisions covered.
- No placeholders: every step has exact strings/commands.
- Naming consistent: same line numbers and class strings across tasks (verified against the file with grep before writing).
