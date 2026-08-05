# Mobile UI/UX Overhaul — Design

Date: 2026-08-05
Branch: `feature/mobile-ui-ux`
Status: Approved (via brainstorming interview)

## Goal

Improve the mobile experience across the site. This is a full overhaul: fix actual breakage, restore content that is hidden on small screens, and apply a design-system/performance pass. Scope was confirmed as option **C** (bug fixes + layout restructure + design-system pass).

## Decisions

### 1. Scroll system — strip LocomotiveScroll
- Delete `components/LocomotiveScrollWrapper.tsx`.
- Remove its usage from `app/layout.tsx`.
- Rely on native CSS `scroll-behavior: smooth` (already present in `globals.css`).
- Rationale: `new LocomotiveScroll()` was a no-op (no container/options wired), adds scroll jank on mobile, and ships an extra `<main>` wrapper (fixes nested `<main>` a11y issue as a side effect).
- Remove now-unused `locomotive-scroll` dependency? No — leave dependency removal out of scope unless tree-shaking is trivial; revisit at implementation if it's purely dead.

### 2. Typography — normalize base only
- Remove `body { font-size: 22px }` from `app/globals.css` (line 157).
- Set a sane base of 16px on `body`.
- Audit text without explicit size classes that inherits the old 22px and fix any that regress visually.
- Keep the Bebas + uppercase `h1–h6` identity untouched (brand decision).

### 3. Breakpoint convention — unify + document
- Navbar JS `isMobile` stays at `lg`/1024 (hamburger sheet).
- Dashboard `useIsMobile` stays at `md`/768 (sheet sidebar).
- Add a short comment in `components/navbar.tsx` (`LG_BREAKPOINT`) and `hooks/use-mobile.ts` documenting the convention:
  - Nav/site chrome: `lg` (1024) = desktop
  - Dashboard/editorial: `md` (768) = tablet/mobile boundary
- No forced single-number unification.

### 4. Restore mobile content loss
- **Live dashboard** (`app/live/live-dashboard.tsx:315`): replace `hidden md:flex` banner with a responsive layout so the next-event countdown and visitor/worshipper info show on mobile (stacked below the main content, not hidden).
- **Navbar CTAs** (`components/navbar.tsx:96,158`): make Donate and Sign In reachable below 640px. Show compact icon/button variants instead of hiding them behind the sheet.
- **Gallery** (`components/gallery-main.tsx:185`): change `grid-cols-1 md:grid-cols-4` to a 2-column mobile grid (e.g., `grid-cols-2`) so 40+ images don't stack into a single long column.

### 5. Dead code removal
- Remove unused `components/hero.tsx` (contains a `<video>` with a YouTube URL — cannot play; grep-verified not imported).
- Remove the hidden-but-shipped content block in `components/hero-section.tsx` (line ~177).
- Remove the invalid `scrollbar-width` attribute on `<html>` in `app/layout.tsx`.
- Leave `PartnerFAB.tsx` as-is (always returns `null`, intentional).

### 6. Meta & viewport
- Add a `viewport` export (Next.js 16 App Router) to `app/layout.tsx`:
  - `themeColor`: brand primary color (match amber/primary used across the site).
  - `viewportFit: "cover"`.
  - No zoom lock — keep user scaling enabled.
- Next.js default `width=device-width, initial-scale=1` continues to apply.

### 7. Bugs
- `components/hero-section.tsx:113`: resolve conflicting `relative md:relative absolute` position classes — determine intended behavior at <768px and fix (likely keep it in document flow with a single `relative`).

### 8. Performance & motion
- Add `sizes` attribute to `fill` images missing it (~34 files) where a sensible size value can be determined cheaply. Priority on above-the-fold and media-heavy pages (live dashboard, hero, about, partner, schedule, blog, dashboard admin).
- Add `prefers-reduced-motion` guards to the marquee (`components/featured-reflections.tsx`) and hero animations.
- Remove `min-h-screen` from content sections where it inflates mobile viewport height: `components/faq.tsx:44` and `app/about/page.tsx:253`.

## Non-goals

- No full redesign of the mobile nav structure (keep hamburger sheet).
- No new feature work (no FAB activation, no new pages).
- No dependency removal churn beyond what's trivial.
- Do not touch the dashboard sidebar default-collapsed behavior introduced previously.

## Testing / verification

- `bun run check` and `bun run build` pass.
- Manual verification at 320px, 375px, 768px, 1024px widths:
  - Homepage hero does not overlap following sections.
  - Live dashboard shows countdown on mobile.
  - Navbar shows Donate + Sign In CTAs on small phones.
  - Gallery is 2-column on mobile.
  - No horizontal page overflow.
- `bun test` if any touched modules have tests.
