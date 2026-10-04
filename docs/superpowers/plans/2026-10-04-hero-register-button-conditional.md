# Hero Conditional Register / Book a Watch Button Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Conditionally show the "Register" button (for unauthenticated users) or a "Book a Watch" button linking to `/schedule` (for authenticated users) in `components/hero-headline.tsx`.

**Architecture:** Utilize `useCurrentSession()` from `@/lib/use-current-session` in `HeroHeadline` to access reactive session state (`isAuthenticated`, `isPending`). Render the "Register" link when not authenticated, and the "Book a Watch" link to `/schedule` when authenticated.

**Tech Stack:** Next.js 16 (App Router), React 19, Better Auth, Tailwind CSS, Biome.

## Global Constraints

- **Package Manager**: Use `bun` (not npm/yarn). Commands: `bun run`, `bun check`, `bun run build`.
- **Cursor**: All interactive elements (`<Button>`, `<Link>`, clickable `<div>`, clickable `<a>`) must include `cursor-pointer` in their className.
- **Lint/Format**: `bun run check` (Biome).
- **Build**: `bun run build`.

---

### Task 1: Conditionally render Register vs Book a Watch in HeroHeadline

**Files:**
- Modify: `components/hero-headline.tsx`

**Interfaces:**
- Consumes: `useCurrentSession()` from `@/lib/use-current-session` returning `{ isAuthenticated: boolean, isPending: boolean }`.
- Produces: Updated hero actions with dynamic auth-aware registration/schedule CTA.

- [x] **Step 1: Update `components/hero-headline.tsx` with conditional CTA**

Import `useCurrentSession`:
```tsx
import { useCurrentSession } from "@/lib/use-current-session";
```

Call inside `HeroHeadline`:
```tsx
const { isAuthenticated, isPending } = useCurrentSession();
```

Replace the static `/login` button:
```tsx
{!isPending && (
  !isAuthenticated ? (
    <Link href="/login" className="cursor-pointer">
      <Button
        size="lg"
        variant="ghost"
        className="rounded-full font-bold uppercase tracking-widest text-xs border-white/30 text-white cursor-pointer"
      >
        Register
      </Button>
    </Link>
  ) : (
    <Link href="/schedule" className="cursor-pointer">
      <Button
        size="lg"
        variant="ghost"
        className="rounded-full font-bold uppercase tracking-widest text-xs border-white/30 text-white cursor-pointer"
      >
        Book a Watch
      </Button>
    </Link>
  )
)}
```

- [x] **Step 2: Run Biome check and formatting**

Run:
```bash
bun run check
```
Expected: All files formatted and linted cleanly with 0 errors.

- [x] **Step 3: Run build check**

Run:
```bash
bun run build
```
Expected: Build succeeds with 0 type errors.

- [x] **Step 4: Commit changes**

Run:
```bash
git add components/hero-headline.tsx
git commit -m "feat(hero): conditionally render register or book a watch button based on auth state"
```
