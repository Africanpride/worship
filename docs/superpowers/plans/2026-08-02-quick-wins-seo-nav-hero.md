# Quick Wins: SEO Metadata, Nav Consistency, Hero CTAs

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add SEO metadata to 7 pages missing it, fix desktop/mobile nav inconsistency, and add 4 CTA buttons to the hero section.

**Architecture:** Each "use client" page gets a sibling `layout.tsx` server component that exports metadata (following the `app/about/layout.tsx` pattern). Nav items are unified to match mobile's 14-item list. Hero gets 4 CTA buttons below the headline.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS v4, Framer Motion

## Global Constraints

- Target: Bun runtime, ES2026+
- Styling: Tailwind CSS v4, single quotes, 2-line indent, 100 char line width
- Components: Use existing `@/components/ui/button` and `@/components/ui/badge`
- Images: Use `next/image` with explicit `width`/`height` (no `fill` on fixed containers)
- SEO: Follow `app/about/layout.tsx` pattern for metadata exports
- URLs: All canonical URLs use `https://thenonstop.org`

---

## File Structure

| Action | File | Purpose |
|--------|------|---------|
| Create | `app/watches/layout.tsx` | SEO metadata for Watches page |
| Create | `app/music-and-worship/layout.tsx` | SEO metadata for Music & Worship page |
| Create | `app/prayer-wall/layout.tsx` | SEO metadata for Prayer Wall page |
| Create | `app/scripture-reading/layout.tsx` | SEO metadata for Scripture Reading page |
| Create | `app/partner/layout.tsx` | SEO metadata for Partner page |
| Create | `app/blog/layout.tsx` | SEO metadata for Blog page |
| Create | `app/start-an-altar/layout.tsx` | SEO metadata for Start an Altar page |
| Modify | `components/nav-menu.tsx:26-37` | Add 4 missing nav items to desktop |
| Modify | `components/hero-headline.tsx` | Add 4 CTA buttons below headline |

---

### Task 1: Add SEO metadata to Watches page

**Files:**
- Create: `app/watches/layout.tsx`

- [ ] **Step 1: Create layout.tsx with metadata**

```tsx
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "The Watches — 144-Hour Worship Schedule",
  description:
    "Join a worship watch during The Non-Stop Series™ — 144 hours of continuous praise, worship, prayer, and Scripture reading from Accra, Ghana. Choose your watch and take your place before the Lord.",
  alternates: { canonical: "https://thenonstop.org/watches" },
  openGraph: {
    url: "https://thenonstop.org/watches",
    title: "The Watches — Take Your Place Before the Lord",
    description:
      "Prophetic worship watches across 144 continuous hours. Worship, prayer, Scripture, and intercession — day and night.",
  },
};

const WatchLayout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default WatchLayout;
```

- [ ] **Step 2: Verify metadata loads**

Run: `bun run build 2>&1 | grep -i "watches"` or check `next dev` and view page source.
Expected: `<title>The Watches — 144-Hour Worship Schedule</title>` in `<head>`

- [ ] **Step 3: Commit**

```bash
git add app/watches/layout.tsx
git commit -m "feat: add SEO metadata to watches page"
```

---

### Task 2: Add SEO metadata to Music & Worship page

**Files:**
- Create: `app/music-and-worship/layout.tsx`

- [ ] **Step 1: Create layout.tsx with metadata**

```tsx
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Music & Worship — Continuous Praise Before the Lord",
  description:
    "Explore the sound of The Non-Stop Series™ — 144 hours of continuous worship, choir ministrations, instrumental praise, and prophetic songs from multiple nations.",
  alternates: { canonical: "https://thenonstop.org/music-and-worship" },
  openGraph: {
    url: "https://thenonstop.org/music-and-worship",
    title: "Music & Worship — A Sacred Continuous Offering",
    description:
      "From choirs to soloists, instruments to spontaneous songs — the sound of the altar rises continuously.",
  },
};

const MusicLayout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default MusicLayout;
```

- [ ] **Step 2: Verify metadata loads**

Run: `bun run build 2>&1 | grep -i "music"` or check page source in dev.
Expected: `<title>Music & Worship — Continuous Praise Before the Lord</title>`

- [ ] **Step 3: Commit**

```bash
git add app/music-and-worship/layout.tsx
git commit -m "feat: add SEO metadata to music-and-worship page"
```

---

### Task 3: Add SEO metadata to Prayer Wall page

**Files:**
- Create: `app/prayer-wall/layout.tsx`

- [ ] **Step 1: Create layout.tsx with metadata**

```tsx
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Prayer Wall — Stand Together Before the Lord",
  description:
    "Submit your prayer requests and stand in faith with believers worldwide during The Non-Stop Series™ — 144 hours of continuous prayer and intercession.",
  alternates: { canonical: "https://thenonstop.org/prayer-wall" },
  openGraph: {
    url: "https://thenonstop.org/prayer-wall",
    title: "Prayer Wall — A Place to Stand Together",
    description:
      "Share your prayer needs. Join the continuous chain of intercession. No burden is too small.",
  },
};

const PrayerLayout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default PrayerLayout;
```

- [ ] **Step 2: Verify metadata loads**

Run: check page source in dev.
Expected: `<title>Prayer Wall — Stand Together Before the Lord</title>`

- [ ] **Step 3: Commit**

```bash
git add app/prayer-wall/layout.tsx
git commit -m "feat: add SEO metadata to prayer-wall page"
```

---

### Task 4: Add SEO metadata to Scripture Reading page

**Files:**
- Create: `app/scripture-reading/layout.tsx`

- [ ] **Step 1: Create layout.tsx with metadata**

```tsx
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Scripture Reading — The Voice of God at the Centre",
  description:
    "The continuous public reading of Scripture during The Non-Stop Series™ — 144 hours of God's Word proclaimed over nations, families, and communities.",
  alternates: { canonical: "https://thenonstop.org/scripture-reading" },
  openGraph: {
    url: "https://thenonstop.org/scripture-reading",
    title: "Scripture Reading — Proclaiming the Living Word",
    description:
      "From Genesis to Revelation — the Word of God read continuously throughout 144 hours of worship.",
  },
};

const ScriptureLayout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default ScriptureLayout;
```

- [ ] **Step 2: Verify metadata loads**

Run: check page source in dev.
Expected: `<title>Scripture Reading — The Voice of God at the Centre</title>`

- [ ] **Step 3: Commit**

```bash
git add app/scripture-reading/layout.tsx
git commit -m "feat: add SEO metadata to scripture-reading page"
```

---

### Task 5: Add SEO metadata to Partner page

**Files:**
- Create: `app/partner/layout.tsx`

- [ ] **Step 1: Create layout.tsx with metadata**

```tsx
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Partner With Us — Help Keep the Fire Burning",
  description:
    "Support The Non-Stop Series™ through donations, sponsorship, and partnership. Help sustain 144 hours of continuous worship, prayer, and Scripture reading.",
  alternates: { canonical: "https://thenonstop.org/partner" },
  openGraph: {
    url: "https://thenonstop.org/partner",
    title: "Partner With Us — Sustain the Altar",
    description:
      "Become part of a movement. Your partnership helps keep the fire burning across 144 hours of non-stop worship.",
  },
};

const PartnerLayout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default PartnerLayout;
```

- [ ] **Step 2: Verify metadata loads**

Run: check page source in dev.
Expected: `<title>Partner With Us — Help Keep the Fire Burning</title>`

- [ ] **Step 3: Commit**

```bash
git add app/partner/layout.tsx
git commit -m "feat: add SEO metadata to partner page"
```

---

### Task 6: Add SEO metadata to Blog page

**Files:**
- Create: `app/blog/layout.tsx`

- [ ] **Step 1: Create layout.tsx with metadata**

```tsx
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Daily Blog & Devotionals — Reflections from the Altar",
  description:
    "Daily devotionals, teachings, and testimonies from The Non-Stop Series™. Grow in worship, prayer, and Scripture meditation throughout the year.",
  alternates: { canonical: "https://thenonstop.org/blog" },
  openGraph: {
    url: "https://thenonstop.org/blog",
    title: "Blog & Devotionals — Daily Bread for Worshippers",
    description:
      "Reflections, teachings, and testimonies from the altar. Nourish your spirit with daily insights.",
  },
};

const BlogLayout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default BlogLayout;
```

- [ ] **Step 2: Verify metadata loads**

Run: check page source in dev.
Expected: `<title>Daily Blog & Devotionals — Reflections from the Altar</title>`

- [ ] **Step 3: Commit**

```bash
git add app/blog/layout.tsx
git commit -m "feat: add SEO metadata to blog page"
```

---

### Task 7: Add SEO metadata to Start an Altar page

**Files:**
- Create: `app/start-an-altar/layout.tsx`

- [ ] **Step 1: Create layout.tsx with metadata**

```tsx
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Start an Altar — Multiply the Fire",
  description:
    "Establish continuous worship and prayer in your city, church, campus, or community. Resources and guidance to help you start your own altar.",
  alternates: { canonical: "https://thenonstop.org/start-an-altar" },
  openGraph: {
    url: "https://thenonstop.org/start-an-altar",
    title: "Start an Altar — Establish Continuous Worship",
    description:
      "Don't just attend the altar. Build an altar. Resources to help you establish worship in your sphere of influence.",
  },
};

const StartAltarLayout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default StartAltarLayout;
```

- [ ] **Step 2: Verify metadata loads**

Run: check page source in dev.
Expected: `<title>Start an Altar — Multiply the Fire</title>`

- [ ] **Step 3: Commit**

```bash
git add app/start-an-altar/layout.tsx
git commit -m "feat: add SEO metadata to start-an-altar page"
```

---

### Task 8: Fix desktop/mobile nav inconsistency

**Files:**
- Modify: `components/nav-menu.tsx:26-37`

- [ ] **Step 1: Add 4 missing items to desktop nav**

Replace the `items` array in `components/nav-menu.tsx` (lines 26-37) with:

```tsx
const items = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Watches", href: "/watches" },
  { label: "Music & Worship", href: "/music-and-worship" },
  { label: "Prayer Wall", href: "/prayer-wall" },
  { label: "Scripture Reading", href: "/scripture-reading" },
  { label: "Daily Devotionals", href: "/blog" },
  { label: "Start an Altar", href: "/start-an-altar" },
  { label: "Schedule", href: "/schedule" },
  { label: "Partner", href: "/partner" },
  { label: "Live", href: "/live", showPulse: true },
  { label: "Gallery", href: "/gallery" },
  { label: "Get Involved", href: "/get-involved" },
  { label: "Contact", href: "/contact" },
];
```

Note: This matches the mobile nav items in `components/navigation-sheet.tsx:22-37` exactly.

- [ ] **Step 2: Verify nav renders correctly**

Run: `bun run dev` and check desktop navbar shows all 14 items.
Expected: Desktop nav matches mobile nav item list.

- [ ] **Step 3: Commit**

```bash
git add components/nav-menu.tsx
git commit -m "fix: unify desktop and mobile navigation items"
```

---

### Task 9: Add 4 CTA buttons to hero headline

**Files:**
- Modify: `components/hero-headline.tsx`

- [ ] **Step 1: Read current hero-headline.tsx to understand structure**

Read `components/hero-headline.tsx` fully to identify where to insert the CTA buttons.

- [ ] **Step 2: Add CTA buttons below the sub-headline text**

After the "25th Year - Silver Jubilee Edition" sub-text and before the closing `</div>`, add 4 CTA buttons. The exact insertion point depends on the current file structure — look for the section after the animated headline text and sub-text.

Add this block (using existing Button component from `@/components/ui/button`):

```tsx
<div className='flex flex-wrap gap-3 mt-6'>
  <Link href='/watches'>
    <Button size='lg' className='rounded-full font-bold uppercase tracking-widest text-xs'>
      Take Your Watch
    </Button>
  </Link>
  <Link href='/live'>
    <Button size='lg' variant='outline' className='rounded-full font-bold uppercase tracking-widest text-xs border-white/30 text-white hover:bg-white/10'>
      Watch Live
    </Button>
  </Link>
  <Link href='/get-involved'>
    <Button size='lg' variant='outline' className='rounded-full font-bold uppercase tracking-widest text-xs border-white/30 text-white hover:bg-white/10'>
      Register
    </Button>
  </Link>
  <Link href='/start-an-altar'>
    <Button size='lg' variant='outline' className='rounded-full font-bold uppercase tracking-widest text-xs border-white/30 text-white hover:bg-white/10'>
      Start an Altar
    </Button>
  </Link>
</div>
```

Ensure `Link` is imported from `next/link` and `Button` from `@/components/ui/button` (check if already imported).

- [ ] **Step 3: Verify hero renders correctly**

Run: `bun run dev` and check homepage hero shows 4 CTA buttons below the headline.
Expected: 4 buttons visible: "Take Your Watch", "Watch Live", "Register", "Start an Altar"

- [ ] **Step 4: Commit**

```bash
git add components/hero-headline.tsx
git commit -m "feat: add 4 CTA buttons to hero section"
```

---

## Spec Coverage Check

| Requirement | Task |
|-------------|------|
| SEO metadata for Watches | Task 1 |
| SEO metadata for Music & Worship | Task 2 |
| SEO metadata for Prayer Wall | Task 3 |
| SEO metadata for Scripture Reading | Task 4 |
| SEO metadata for Partner | Task 5 |
| SEO metadata for Blog | Task 6 |
| SEO metadata for Start an Altar | Task 7 |
| Desktop/mobile nav consistency | Task 8 |
| Hero CTA buttons (4 buttons) | Task 9 |
