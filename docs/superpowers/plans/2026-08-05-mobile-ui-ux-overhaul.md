# Mobile UI/UX Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix actual mobile breakage, restore content hidden on small screens, and apply a design-system/performance pass across the site.

**Architecture:** This is a presentational overhaul — no data model or route changes. Work happens in `app/layout.tsx`, `app/globals.css`, and a set of page/component files. Each task is independently verifiable via `bun run check`, `bun run build`, and manual browser checks at defined viewport widths.

**Tech Stack:** Next.js 16 (App Router), Tailwind CSS v4 (CSS-first config), TypeScript, React 19.

## Global Constraints

- Package manager is `bun`. Never use npm/yarn.
- All interactive elements (`<Button>`, `<Link>`, clickable `<div>`, clickable `<a>`) must include `cursor-pointer` in className. Apply globally; never skip.
- Run `bun run check` (biome) and `bun run build` before committing. Biome errors break the build.
- No new dependencies. Do NOT remove dependencies (locomotive-scroll stays in package.json, just unused).
- Keep the Bebas + uppercase `h1–h6` heading identity untouched (brand decision).
- No `.next` files, no `components/ui/` files modified.
- Breakpoint convention (document, don't unify): site chrome/nav = `lg` (1024px); dashboard/editorial = `md` (768px).
- No zoom lock: keep `userScalable` enabled (accessibility).

---

### Task 1: Remove LocomotiveScroll wrapper and clean root layout

**Files:**
- Delete: `components/LocomotiveScrollWrapper.tsx`
- Modify: `app/layout.tsx` (lines 5, 100-107, 113-119)

**Interfaces:**
- Consumes: nothing from other tasks.
- Produces: a root layout with no third-party scroll wrapper and no `<main>` from the wrapper (pages already render their own `<main>`, fixing the nested-`<main>` issue). No other component imports `LocomotiveScrollWrapper` (grep-verified), so deletion is safe.

- [ ] **Step 1: Verify `LocomotiveScrollWrapper` is only used by the root layout**

Run: `grep -rln "LocomotiveScroll" app components --include="*.tsx"`
Expected: exactly `app/layout.tsx` and `components/LocomotiveScrollWrapper.tsx`.

- [ ] **Step 2: Delete the wrapper file**

Run: `rm components/LocomotiveScrollWrapper.tsx`
Expected: file removed.

- [ ] **Step 3: Remove the import and usage from `app/layout.tsx`**

In `app/layout.tsx`:
- Delete line 5: `import LocomotiveScrollWrapper from "@/components/LocomotiveScrollWrapper";`
- Delete the invalid `scrollbar-width="thin"` attribute on the `<html>` element (line 104).
- Replace the `<LocomotiveScrollWrapper>` wrapping (lines 113-119) so children render directly. Result:

```tsx
		<body
			className={`${opensans.variable} ${bebas.variable} text-base antialiased`}
		>
			<ThemeProvider>
				<NavbarWrapper />
				<PageTransition>
					{children}
					<PartnerFAB />
				</PageTransition>
				<FooterWrapper />
				<Toaster richColors position="bottom-right" />
			</ThemeProvider>
		</body>
```

- [ ] **Step 4: Verify no leftover references**

Run: `grep -rn "LocomotiveScroll\|locomotive-scroll" app components --include="*.tsx"`
Expected: no matches (package.json dependency remains, that's fine).

- [ ] **Step 5: Lint, typecheck, build**

Run: `bun run check && bun run build`
Expected: biome clean (ignore unrelated `.next/` lint noise if present), build succeeds.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "fix: remove unused LocomotiveScroll wrapper and invalid html attr"
```

---

### Task 2: Add `viewport` export with brand theme color

**Files:**
- Modify: `app/layout.tsx` (imports + new export after `metadata`)

**Interfaces:**
- Consumes: Next.js `Viewport` type (already available via `next` package).
- Produces: `export const viewport: Viewport` consumed by Next.js metadata system. `themeColor` value maps to the CSS `--primary` (≈ `#6d28d9`, violet brand). `viewportFit: "cover"` enables safe-area handling for notched phones. No zoom lock.

- [ ] **Step 1: Add the `Viewport` import and export**

In `app/layout.tsx`, change line 1 to import `Viewport` alongside `Metadata`:

```tsx
import type { Metadata, Viewport } from "next";
```

After the `metadata` export block (after line 92), add:

```tsx
export const viewport: Viewport = {
	themeColor: "#6d28d9",
	viewportFit: "cover",
};
```

- [ ] **Step 2: Verify viewport is emitted**

Run: `bun run dev` (or use the running dev server), then:
Run: `curl -s http://localhost:3000 | grep -o 'theme-color[^>]*' | head -1`
Expected: `theme-color` meta tag with content `#6d28d9` present, and `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`.

- [ ] **Step 3: Lint and commit**

Run: `bun run check`
Expected: clean.

```bash
git add -A
git commit -m "feat: add viewport meta with brand theme color"
```

---

### Task 3: Normalize base font size to 16px

**Files:**
- Modify: `app/globals.css` (line 157)

**Interfaces:**
- Consumes: nothing.
- Produces: `body` font-size of 16px instead of 22px. Elements without explicit text-size classes now inherit 16px.

- [ ] **Step 1: Replace the base font size**

In `app/globals.css`, change the `body` rule (lines 154-159):

```css
	body {
		@apply bg-background text-foreground;
		font-family: var(--font-opensans), sans-serif;
		font-size: 16px;
		/* font-weight: 400; */
	}
```

- [ ] **Step 2: Audit for text that visually regresses at 16px**

Run: `bun run dev` and view these pages at 375px: `/`, `/about`, `/watches`, `/get-involved`, `/live`.
Expected: no element that previously relied on 22px base now looks unexpectedly small — scan for `<p>`/`<span>`/`<div>` without a text-size class whose content is now cramped. Fix only genuine regressions by adding an explicit size class (e.g., `text-lg`/`text-xl`) where the original 22px look is clearly intended; do NOT change headings (Bebas identity preserved).

- [ ] **Step 3: Lint and commit**

Run: `bun run check`
Expected: clean.

```bash
git add -A
git commit -m "fix: normalize body base font size to 16px"
```

---

### Task 4: Fix hero position conflict and remove dead content block

**Files:**
- Modify: `components/hero-section.tsx` (line 113, lines 177-247)

**Interfaces:**
- Consumes: nothing.
- Produces: hero `<header>` always `relative` (in document flow) so following homepage sections never overlap it on mobile; dead hidden block removed (smaller mobile DOM payload).

- [ ] **Step 1: Fix the conflicting position classes**

In `components/hero-section.tsx` line 113, replace:

```tsx
		<header
			className="relative md:relative absolute bg-black top-0 left-0 w-full h-[100dvh] flex flex-col justify-center pb-10 overflow-hidden z-0 "
```

with:

```tsx
		<header className="relative bg-black top-0 left-0 w-full h-[100dvh] flex flex-col justify-center pb-10 overflow-hidden z-0 ">
```

- [ ] **Step 2: Remove the dead hidden content block**

Delete lines 177-247 (the `<div className="relative px-4 sm:px-6 lg:px-8 hidden">` block containing the old heading, paragraph, social SVG links, and its closing tags). Keep the `sr-only` accessibility hint block (lines 249-254) and the `</header>`.

- [ ] **Step 3: Verify no unused imports result**

Run: `bun run check`
Expected: biome flags any now-unused imports (e.g., `Image` or `Link` if only used in the removed block). Remove them if flagged. Do NOT remove imports still used elsewhere in the file.

- [ ] **Step 4: Manual verify hero layout at <768px**

Run: `bun run dev`, open `http://localhost:3000` at 375px width.
Expected: hero video fills the first viewport; "About / Ministration / Featured Reflections" sections that follow start below the hero (no overlap). On desktop ≥768px nothing changes visually.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "fix: hero position keeps document flow and drop dead content block"
```

---

### Task 5: Document breakpoint convention (nav + dashboard)

**Files:**
- Modify: `components/navbar.tsx` (line 40)
- Modify: `hooks/use-mobile.ts` (line 3)

**Interfaces:**
- Consumes: nothing.
- Produces: two one-line comments documenting the agreed breakpoint convention so future editors keep nav at `lg` and dashboard at `md`.

- [ ] **Step 1: Comment the navbar breakpoint**

In `components/navbar.tsx` line 40:

```tsx
		// Breakpoint convention: site chrome/nav switches at lg (1024px). Dashboard sidebar uses md (768px).
		const LG_BREAKPOINT = 1024;
```

- [ ] **Step 2: Comment the dashboard breakpoint**

In `hooks/use-mobile.ts` line 3:

```ts
// Breakpoint convention: dashboard/editorial switches at md (768px). Site nav uses lg (1024px).
const MOBILE_BREAKPOINT = 768;
```

- [ ] **Step 3: Lint and commit**

Run: `bun run check`
Expected: clean.

```bash
git add -A
git commit -m "docs: document mobile breakpoint convention"
```

---

### Task 6: Show Donate and Sign In CTAs on small phones

**Files:**
- Modify: `components/navbar.tsx` (lines 96, 158)

**Interfaces:**
- Consumes: existing `InsideScrollDialog`, `Button`, `Link`, `useCurrentSession`.
- Produces: Donate and Sign In reachable below 640px via compact icon buttons; unchanged at ≥640px.

- [ ] **Step 1: Make the Donate button visible below `sm`**

In `components/navbar.tsx` line 96, the Donate `<motion.button>` currently has `hidden sm:flex`. Change to:

```tsx
						className="relative flex items-center justify-center size-9 bg-amber-500 hover:bg-amber-600 text-white rounded-full p-2.5 overflow-hidden shadow-lg shadow-amber-500/20 active:scale-95 transition-colors cursor-pointer"
```

(Remove `hidden sm:flex`, add `justify-center size-9` so it renders as a square icon-only button on all sizes. The expanding hover label already only expands on hover via variants, so mobile shows just the heart icon.)

- [ ] **Step 2: Make the Sign In button visible below `sm`**

In `components/navbar.tsx` line 158, the Sign In `Button` has `hidden px-4 ... sm:inline-flex`. Change to:

```tsx
						<Button
							className="px-4 bg-accent text-accent-foreground rounded-full hidden sm:inline-flex"
							variant="outline"
							asChild
						>
							<Link href="/login" className="cursor-pointer">
								Sign In
							</Link>
						</Button>
						<Button
							className="size-9 p-0 bg-accent text-accent-foreground rounded-full lg:hidden"
							variant="outline"
							asChild
							aria-label="Sign In"
						>
							<Link href="/login" className="cursor-pointer">
								<User className="size-4" />
							</Link>
						</Button>
```

Add `User` to the lucide import on line 4 (`import { Heart, LogOut, Settings, User } from "lucide-react";`).

Note: this yields an icon-only `lg:hidden` button and a labeled `hidden sm:inline-flex` button. Both are `lg:`-safe — at ≥1024px the hamburger sheet is hidden (`lg:hidden` trigger) and the desktop menu shows, but the labeled button still shows at `sm+`. If this creates a duplicate Sign In at 640-1024px, remove the `hidden sm:inline-flex` labeled button entirely and keep only the `lg:hidden` icon button plus the desktop `NavMenu` — verify in Step 3 and adjust so exactly one Sign In control is visible at every width.

- [ ] **Step 3: Manual verify CTA visibility at each width**

Run: `bun run dev`, inspect `http://localhost:3000` at 375px, 768px, 1024px, 1280px.
Expected: at 375px both Donate (heart icon) and Sign In (user icon) visible next to the hamburger; at 1280px the labeled Sign In and Donate (with hover label) visible; no overlapping/duplicate controls at any width.

- [ ] **Step 4: Lint and commit**

Run: `bun run check`
Expected: clean (fix any unused import).

```bash
git add -A
git commit -m "feat: expose donate and sign in ctas on small screens"
```

---

### Task 7: Restore live-dashboard countdown/visitor banner on mobile

**Files:**
- Modify: `app/live/live-dashboard.tsx` (lines 208, 315)

**Interfaces:**
- Consumes: existing `activeEvent`, `nextEvent`, `visitorCount`, `formatVisitors`, `countdown`.
- Produces: the right-side banner (visitor avatars/"Worshipping globally", or "Starts in" countdown) visible on all screen sizes, stacked below the text info on mobile.

- [ ] **Step 1: Make the right-side banner responsive**

In `app/live/live-dashboard.tsx` line 315, replace:

```tsx
							<div className="hidden md:flex flex-col items-end text-right shrink-0">
```

with:

```tsx
							<div className="flex flex-col items-start md:items-end text-left md:text-right shrink-0">
```

- [ ] **Step 2: Adjust the banner container for stacking on mobile**

In `app/live/live-dashboard.tsx` line 214, the banner container is `flex flex-col md:flex-row md:items-center justify-between`. Add `gap-2` alignment so the stacked right-side block is spaced on mobile:

```tsx
								className={`rounded-2xl p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-3 animate-in fade-in slide-in-from-top-4 duration-700 border ${
```

- [ ] **Step 3: Manual verify at 375px**

Run: `bun run dev`, open `http://localhost:3000/live` at 375px.
Expected: the banner shows the avatar/icon + title + "Starts in: {countdown}" (or live visitor info) stacked vertically without clipping or horizontal overflow. At ≥768px it renders side-by-side as before.

- [ ] **Step 4: Lint and commit**

Run: `bun run check`
Expected: clean.

```bash
git add -A
git commit -m "feat: show live dashboard countdown banner on mobile"
```

---

### Task 8: Gallery 2-column grid on mobile

**Files:**
- Modify: `components/gallery-main.tsx` (line 185)

**Interfaces:**
- Consumes: existing `column1Images`..`column4Images` masonry columns.
- Produces: a 2-column masonry on mobile (columns 1-2 and 3-4 wrap), 4-column at `md+`.

- [ ] **Step 1: Change the grid to 2 columns on mobile**

In `components/gallery-main.tsx` line 185, replace:

```tsx
			<div className="grid grid-cols-1 gap-4 md:grid-cols-4">
```

with:

```tsx
			<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
```

- [ ] **Step 2: Manual verify at 375px**

Run: `bun run dev`, open `http://localhost:3000/gallery` at 375px.
Expected: images render in 2 columns (not stacked single column), no horizontal overflow, cards keep their `rounded-2xl` look.

- [ ] **Step 3: Lint and commit**

Run: `bun run check`
Expected: clean.

```bash
git add -A
git commit -m "feat: two-column gallery grid on mobile"
```

---

### Task 9: Remove `min-h-screen` from FAQ and About content sections

**Files:**
- Modify: `components/faq.tsx` (line 44)
- Modify: `app/about/page.tsx` (line 253)

**Interfaces:**
- Consumes: nothing.
- Produces: FAQ and About content sections no longer force a full viewport height on mobile when content is short.

- [ ] **Step 1: FAQ section**

In `components/faq.tsx` line 44, replace:

```tsx
		<div
			className="flex min-h-screen items-center justify-center px-6 py-8"
			data-usal="fade-u duration-500"
		>
```

with:

```tsx
		<div
			className="flex items-center justify-center px-6 py-8"
			data-usal="fade-u duration-500"
		>
```

- [ ] **Step 2: About page section**

In `app/about/page.tsx` line 253, replace:

```tsx
					<div className="max-w-7xl px-4 lg:px-8 xl:px-16 lg:py-20 sm:py-16 py-8 mx-auto w-full h-full min-h-screen">
```

with:

```tsx
					<div className="max-w-7xl px-4 lg:px-8 xl:px-16 lg:py-20 sm:py-16 py-8 mx-auto w-full h-full">
```

- [ ] **Step 3: Lint and commit**

Run: `bun run check`
Expected: clean.

```bash
git add -A
git commit -m "fix: stop content sections forcing full viewport height on mobile"
```

---

### Task 10: Add `prefers-reduced-motion` guards

**Files:**
- Modify: `components/featured-reflections.tsx` (lines 108-125)
- Modify: `components/hero-section.tsx` (lines 1-30, imports/state area)

**Interfaces:**
- Consumes: nothing.
- Produces: marquee animation and hero scroll-triggered motion disable under `prefers-reduced-motion: reduce`.

- [ ] **Step 1: Marquee CSS guard**

In `components/featured-reflections.tsx`, wrap the marquee animation rules (lines 108-125) with a media guard so the animation is disabled for reduced-motion users:

```tsx
			<style>{`
        @keyframes marqueeScroll {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
        }

        .marquee-inner {
            animation: marqueeScroll 45s linear infinite;
        }

        .marquee-inner:hover {
            animation-play-state: paused;
        }

        .marquee-reverse {
            animation-direction: reverse;
        }

        @media (prefers-reduced-motion: reduce) {
            .marquee-inner {
                animation: none;
            }
        }
      `}</style>
```

- [ ] **Step 2: Inspect hero scroll/motion hooks for a reduced-motion guard**

Read `components/hero-section.tsx` lines 1-95 to locate the scroll-driven state (the audit flagged scroll-triggered motion). If the hero uses `useScroll`/`whileInView`/`data-aos` animations:
- For `data-aos` attributes: add a global CSS guard in `app/globals.css`:

```css
	@media (prefers-reduced-motion: reduce) {
		[data-aos] {
			animation: none !important;
		}
	}
```

- For framer-motion scroll hooks: if they affect layout/position (not just opacity), disable the transform under reduced motion by checking `window.matchMedia("(prefers-reduced-motion: reduce)")` before creating the animation, or guard with `useReducedMotion` from `framer-motion` (already a dependency).

Apply the minimal guard that prevents unwanted motion for reduced-motion users; pure-opacity crossfades may remain.

- [ ] **Step 3: Lint and commit**

Run: `bun run check`
Expected: clean.

```bash
git add -A
git commit -m "feat: respect prefers-reduced-motion for marquee and hero"
```

---

### Task 11: Add `sizes` to `fill` images missing it

**Files:**
- Modify (priority — media-heavy / above-the-fold):
  - `app/live/live-dashboard.tsx` (lines 232-239, 460-468, 549-554)
  - `app/schedule/HeroSection.tsx`
  - `app/partner/page.tsx`
  - `app/blog/[slug]/page.tsx`
  - `app/about/page.tsx`
  - `app/contact/page.tsx`
  - `components/UpNextCard.tsx`
  - `components/ministrations-main.tsx`
  - `components/about-compliment.tsx`
  - `components/profile-page/components/profile-header.tsx`
  - `components/admin/event-management.tsx`
- Modify (if the file is actually used — verify with a grep before editing; skip sandbox/component-example/hero231 which may be dead demo code):
  - `app/sandbox/page.tsx`, `components/component-example.tsx`, `components/hero231.tsx`, `components/file-upload.tsx`, `components/file-upload-01.tsx`, `components/login-form.tsx`, `components/signup-form.tsx`, `components/about3.tsx`, `components/HeroIntro.tsx`

**Interfaces:**
- Consumes: existing `next/image` `fill` props.
- Produces: each `fill` image declares a `sizes` attribute so mobile clients fetch smaller images.

- [ ] **Step 1: Identify remaining `fill` images without `sizes`**

Run: `for f in $(grep -rl "<Image" app components --include="*.tsx"); do if grep -q "fill$" "$f" && ! grep -q "sizes=" "$f"; then echo "$f"; fi; done | grep -v "components/ui/"`
Expected: a list matching the priority files above. For each file that is actually imported/used (grep the component name elsewhere in `app/`), add `sizes`.

- [ ] **Step 2: Add `sizes` per context**

For each `fill` image, choose the value that matches its rendered width, using these rules:
- Full-bleed hero/banner (spans viewport width): `sizes="100vw"`
- Card grid (1-col mobile → 2-col md → 3-col lg → 4-col xl): `sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"`
- Sidebar/inset avatar (fixed small box, e.g. 44-64px): `sizes="64px"`
- Live dashboard minister avatar (lines 232-239, a `size-12 md:size-16` circle): `sizes="64px"`
- Live dashboard VOD thumbnails (lines 460-468): `sizes="(max-width: 640px) 100vw, 25vw"`
- Live dashboard event posters (lines 549-554): `sizes="(max-width: 768px) 100vw, 50vw"`

Apply the closest matching rule per image; do not guess wildly — a slightly-large `sizes` is correct over a too-small one.

- [ ] **Step 3: Lint and build**

Run: `bun run check && bun run build`
Expected: clean, build succeeds.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "perf: add sizes attribute to fill images for mobile payloads"
```

---

### Task 12: Final verification pass

**Files:**
- None (verification only).

**Interfaces:**
- Consumes: all prior tasks.

- [ ] **Step 1: Full check + build + tests**

Run: `bun run check && bun run build`
Expected: both pass. (If any test command exists, run `bun test`; none currently exist.)

- [ ] **Step 2: Manual viewport sweep**

Using the dev server, verify at 320px, 375px, 768px, 1024px on these routes: `/`, `/live`, `/gallery`, `/about`, `/watches`, `/get-involved`.
Expected checklist:
- Homepage hero does not overlap following sections (Task 4).
- No horizontal page overflow on any route.
- Live dashboard shows countdown/visitor banner on mobile (Task 7).
- Navbar shows Donate + Sign In controls on small phones (Task 6).
- Gallery is 2-column on mobile (Task 8).
- FAQ/about sections don't force full viewport height (Task 9).

- [ ] **Step 3: Confirm branch is clean and push**

Run: `git status`
Expected: working tree clean.

```bash
git push -u origin feature/mobile-ui-ux
```

---

## Self-Review Notes

- **Spec coverage:** every decision in the design doc maps to a task (1→scroll strip, 2→viewport, 3→typography, 4→hero bug, 5→breakpoints doc, 6→CTAs, 7→live banner, 8→gallery, 9→min-h-screen, 10→reduced-motion, 11→sizes, 12→verification). FAB activation correctly excluded (non-goal).
- **Placeholder scan:** the only judgment calls are Task 6's final duplicate-check and Task 10's hero motion inspection, both with explicit "verify and adjust" steps rather than TBDs.
- **Type consistency:** all edits reference existing props/state (`activeEvent`, `nextEvent`, `visitorCount`, `column*Images`); no new signatures across tasks.
