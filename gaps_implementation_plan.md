# Gaps Implementation Plan — World-Class Premium Checklist

Status legend: ☐ planned · 🔄 in progress · ✅ done
Owner: engineering session 2026-08 · Branch: main (feature work lands via PRs once CI exists)

---

## Phase 1 — P0 Trust & Resilience (invisible insurance)

### 1.1 CI gate — GitHub Actions ✅
`.github/workflows/ci.yml` → on PR + push to main:
bun install → `biome check .` → `tsc --noEmit` → `bun test` → `next build`.
A red check blocks merge; Vercel stays green-only.

### 1.2 Error boundaries ✅
- `app/error.tsx` (client): friendly "something went wrong" card + `reset()`, logs digest to console.
- `app/global-error.tsx` (client): last-resort shell with its own `<html>/<body>`.
Render crashes never show raw stacks to visitors again.

### 1.3 Rate limiting ✅
`lib/rate-limit.ts`: in-memory fixed-window counter keyed `ip:scope`
(Map + lazy prune). Limits: bookings **20/min**, contact **5/15min**,
social sign-in **10/min**, OAuth callback **30/min**. Wired into:
book/cancel routes, contact route, auth catch-all wrapper.
Documented limitation: per-instance memory; revisit Redis only at multi-instance scale.

### 1.4 Email reliability ✅
`lib/email-send.ts`: `sendEmailWithRetry()` — 3 attempts, exponential backoff,
final failure logged to AppLog (`email` source). Wired into: slot reassignment,
verification, password reset. Full persistent outbox table deferred (noted §5).

## Phase 2 — P1 Premium product gaps

### 2.1 Slot audit trail UI ✅
- API `GET /api/admin/slots/[slotId]/history` (admin-gated) joining admin names.
- Agenda rows gain a "History" action opening a dialog listing
  when / who changed / previous→new / reason. Surfaces the data we already write.

### 2.2 Calendar sync (.ics) ✅
`GET /api/user/slots/ics` → single VCALENDAR containing every upcoming booked
hour (SUMMARY includes track + event; DESCRIPTION carries location).
"My Worship Slots" panel header gains an "Add to calendar" button.
Hand-rolled ICS builder — zero new dependencies.

### 2.3 Skeleton loading states ✅
Replace plain-text loaders with `<Skeleton/>` compositions in:
BookingsAgenda, MyBookingsPanel, LogsConsole.

### 2.4 In-app notifications ✅ (v1)
- Model `Notification { userId, title, body, link?, read, createdAt }` (+index).
- APIs: `GET /api/user/notifications` (recent 20 + unreadCount),
  `POST …/read` (single/all).
- Created on: slot reassignment (to previous holder), admin assignment (to new holder).
- Bell + unread badge + dropdown panel in the dashboard sidebar header;
  auto-refresh 60s.

## Phase 3 — P2 Polish & hygiene

### 3.1 Analytics ✅ — `@vercel/analytics` injected in root layout (privacy-friendly).
### 3.2 Duplicate event data ⏸ — needs a human decision on titles; not code.
### 3.3 Legacy `any` sweep ⏸ — time-boxed follow-up on older admin components.
### 3.4 Backups ⏸ — infra decision: Atlas M10 + continuous backup when budget allows.
### 3.5 Timezone policy ⏸ — documented default (browser-local) until diaspora need is real.

## Deferred by design
- Client-side error capture pipe (`source: "client"` reserved in schema).
- Persistent email outbox table (retry wrapper covers current volume).
- Redis-backed rate limiting (single-instance reality).

## Verification gate for every phase
`bun run check` · `tsc --noEmit` · `bun test` · `next build` — all green before commit.
