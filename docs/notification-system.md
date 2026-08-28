# Notification System — Plan

**Status:** Draft (approved interview 2026-08-26)  
**Stack:** Next.js 16.2.0 App Router, Bun, Prisma 6.19 (MongoDB), Better Auth, Resend + `lib/email-send.ts:19` `sendEmailWithRetry`, Tailwind v4 + shadcn/ui  
**Hosts:** Primary Vercel (cron via `vercel.json`); self-hosted alt = GitHub Action / external ping

---

## 1. Summary

Ship reliable reminders for booked `EventSlot` hours and a live calendar subscription, then expand to full lifecycle + event-change broadcasts. All three delivery channels (email, web push, SMS/WhatsApp) sit behind admin kill-switches; users explicitly opt in per channel.

> What ships is *reminders that fire once, deduped, and respect every toggle* — not blast radius.

## 2. Decisions Locked (interview 2026-08-26)

| # | Question | Answer |
|---|----------|--------|
| Q1 | Channels v1 | **All 3** — email + web push + SMS/WhatsApp behind `AdminNotificationSettings { emailEnabled, pushEnabled, smsEnabled }`. No provider is added without its toggle. |
| Q2 | iCal | **B — subscribable feed** — keep `GET /api/user/slots/ics/route.ts:20` one-shot download, add `GET /api/calendar/[token]/ics` token feed (`CalendarToken`), `webcal://` copy/rotate UI, `VALARM`, `SEQUENCE/LAST-MODIFIED`, `Cache-Control: private, max-age=300`. |
| Q3 | Timing | **B — admin-configurable offsets** — defaults `1440m` (email+in-app), `60m` (email+in-app+push), `30m` (SMS if enabled). Stored in `AdminNotificationSettings.reminderOffsets`. User `NotificationPreference` per channel. Dedup via `NotificationDedup { slotId, channel, triggerAt }`. |
| Q4 | Types beyond reminders | **B — slot lifecycle + event-change broadcasts** — `booked/cancelled/reassigned/blocked` (extend `app/api/admin/slots/[slotId]/assign/route.ts:119` + `app/api/events/[id]/slots/[slotId]/book/route.ts:15`) + fan-out when `Event.startDate/endDate/location/status/bookingOpen` changes on slots that are `booked`. |
| Q5 | Opt-in | **A — explicit** — add `Profile.phone + phoneVerifiedAt` (no phone today `prisma/schema.prisma:40`) + OTP verification for SMS; browser `Notification.requestPermission()` → `POST /api/user/push/subscribe` + `PushSubscription` + `VAPID_PUBLIC/PRIVATE_KEY` env for push. Admin toggle ≠ auto-subscribe. |

**Assumption (updated for Hobby):** Vercel Hobby limits `vercel.json` to **daily** (`0 0 * * *`). Hourly `0 * * * *` requires Pro — on Hobby, Vercel daily is the fallback and precise 60m/30m reminders are driven by GitHub Action hourly `curl` → `POST /api/cron/reminders` (see `8.2`). Self-hosted deployments use the same external ping.

## 3. What Exists Today (ground truth)

- **Model:** `Notification { userId @db.ObjectId, title, body?, link?, read @default(false), createdAt }` `prisma/schema.prisma:275`, `@@index([userId, read])`. Only created in `app/api/admin/slots/[slotId]/assign/route.ts:119` (both sides, best-effort `createMany` → `log.warn("slots")` `154`). No preference fields; `BookingSettings:265` only covers `allowMultipleSlotsPerUser/maxSlotsPerUser/slotVisibility`.
- **Polling:** `components/sidebar-notifications.tsx:44` `useSWR("/api/user/notifications", { refreshInterval: 60_000 })` + `POST /api/user/notifications/read {id|all}` `app/api/user/notifications/route.ts:39`. Profile tab `components/profile-page/components/profile-content.tsx:644` switches are **static `defaultChecked`** — not persisted.
- **Slots:** `EventSlot { eventId, startTime, endTime, status "open|booked|blocked", track "worship|bible-reading", assignedUserId }` `prisma/schema.prisma:230` with `@@index([startTime])`. Booking in `app/api/events/[id]/slots/[slotId]/book/route.ts:15` (`POST` + `DELETE:168`), listing redacted by `BookingSettings.slotVisibility` `app/api/events/[id]/slots/route.ts:16`.
- **ICS:** `app/api/user/slots/ics/route.ts:20` builds `VCALENDAR 2.0` (`BEGIN:VCALENDAR` `39` → `END:VCALENDAR` `64`) with `icsDate` `6` + `escapeIcs` `10`, `X-WR-CALNAME`, per-slot `VEVENT UID:{slot.id}@thenonstop.org` `52` — **no `VALARM`, no token, no `webcal://`**, auth-gated via `auth.api.getSession({headers: await headers()})` `21`.
- **Email:** `lib/email/resend.ts:1` `Resend`, `lib/email-send.ts:19` `sendEmailWithRetry` (3 attempts, `400*2**(n-1)` backoff `48`, logs `log.warn/error("email")`). Templates in `lib/email/` (`SlotReassigned.tsx:14`, `VerifyEmail.tsx`, `rest-password.tsx`). `lib/auth.ts:65,90` reuses same sender `no-reply@thenonstop.org`.
- **No scheduler:** `vercel.json` absent, no `app/api/cron`, no Inngest/Trigger.dev deps `package.json:16`. Singleton Prisma `lib/prisma.ts:9` `globalThis`.

## 4. Goals / Non-Goals

**Goals v1:** Reminders fire exactly once per offset/slot/channel respecting both admin + user toggles; subscribable calendar stays fresh; slot + event-change notifications go out on every channel the user opted into.

**Non-goals v1:** Per-track ICS feeds (Option C), daily digest batching, WhatsApp Business templates (SMS only), WebSocket/SSE realtime (polling stays `60_000` `sidebar-notifications.tsx:44`).

## 5. Architecture

```
EventSlot (booked) ──cron hourly──> lib/notify/notify() ──> Notification (in-app)
       │                                   ├─> Resend (email)  lib/email-send.ts
       │                                   ├─> web-push (push) lib/notify/push.ts
       │                                   └─> open-wa (WhatsApp) lib/notify/whatsapp.ts
       │                          Dedup: NotificationDedup {slotId, channel, triggerAt}
       │
       └─event mutation ──> fan-out ──> same notify() path
       
User calendar ──> /api/calendar/[token]/ics (unauth, token lookup) ──> lib/calendar/ics.ts
           ──> /api/user/calendar-token (rotate/revoke, auth-gated)
```

- Single fan-out entry point `lib/notify/index.ts` `notify(userId, payload: {title, body, link, channels, slotId?, eventId?})` that:
  1. Loads `AdminNotificationSettings` + `NotificationPreference` + `PushSubscription`/`Profile.phoneVerifiedAt`
  2. Short-circuits per channel
  3. Writes `Notification` row + conditionally fires email/push/WhatsApp (best-effort, never throws the request)
  4. Logs `log.info/warn("notify"|"email"|"whatsapp")` with `requestId` `lib/logger.ts:24` `AsyncLocalStorage`
- All mutations reuse `notify()` — cron, `assign/route.ts:119`, `book/route.ts:15`, event update routes.

## 6. Data Model Changes

```prisma
model NotificationPreference {
  id            String   @id @default(auto()) @map("_id") @db.ObjectId
  userId        String   @unique @db.ObjectId
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  emailReminders Boolean @default(true)
  pushReminders  Boolean @default(false)
  smsReminders   Boolean @default(false)
  // future: digestMode Boolean @default(false)
  updatedAt     DateTime @updatedAt
  @@map("notification_preferences")
}

model CalendarToken {
  id              String    @id @default(auto()) @map("_id") @db.ObjectId
  userId          String    @db.ObjectId
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  token           String    @unique // crypto.randomUUID + nanoid 32 chars, never ObjectId
  createdAt       DateTime  @default(now())
  lastAccessedAt  DateTime?
  revokedAt       DateTime?
  @@index([userId])
  @@index([token])
  @@map("calendar_tokens")
}

model PushSubscription {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  userId    String   @db.ObjectId
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  endpoint  String   @unique
  p256dh    String
  auth      String
  createdAt DateTime @default(now())
  @@index([userId])
  @@map("push_subscriptions")
}

model NotificationDedup {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  slotId    String   @db.ObjectId
  channel   String   // "email" | "push" | "sms" | "inapp"
  triggerAt DateTime // startTime - offset
  createdAt DateTime @default(now())
  @@unique([slotId, channel, triggerAt])
  @@index([triggerAt])
  @@map("notification_dedup")
}

model AdminNotificationSettings {
  id              String   @id @default(auto()) @map("_id") @db.ObjectId
  singleton       String   @unique @default("singleton") // enforce single row
  emailEnabled    Boolean  @default(true)
  pushEnabled     Boolean  @default(false)
  smsEnabled      Boolean  @default(false)
  reminderOffsets Int[]    @default([1440, 60]) // minutes; UI adds 30 when smsEnabled
  updatedAt       DateTime @updatedAt
  updatedById     String?  @db.ObjectId
  @@map("admin_notification_settings")
}

// Modify existing
// Profile: add phone String? + phoneVerifiedAt DateTime?
// Notification: add channel String? ("inapp"|"email"|"push"|"sms"), slotId String? @db.ObjectId, eventId String? @db.ObjectId, @@index([slotId])
// User: add relation notificationPreferences NotificationPreference?, calendarTokens CalendarToken[], pushSubscriptions PushSubscription[]
```

- Run `prisma generate` after; singleton client `lib/prisma.ts:9` unchanged.
- Guard Mongo `singleton` uniqueness with app-level upsert (no partial index via Prisma).

## 7. ICS / Calendar Subscription

### 7.1 Library `lib/calendar/ics.ts`

Extract from `app/api/user/slots/ics/route.ts:6`:

```ts
export function buildVCalendar(user: {name: string}, slots: SlotWithEvent[], offsets: number[]): string[]
export function icsDate(d: Date): string // existing 6, keep UTC "YYYYMMDDTHHmmssZ"
export function escapeIcs(s: string): string // existing 10
```

Per `VEVENT`:
- `UID:{slot.id}@thenonstop.org`, `DTSTAMP:{now}`, `DTSTART/DTEND:{icsDate(slot.startTime/endTime)}`, `SUMMARY:{trackLabel} — {event.title}`, `LOCATION:{event.location}`, `DESCRIPTION:{track} hour for {event.title}. Manage at https://thenonstop.org/dashboard/events`, `SEQUENCE:{slot.updatedAt? or 0}`, `LAST-MODIFIED:{icsDate(updatedAt)}`
- Emit `VALARM` per offset: `BEGIN:VALARM / TRIGGER:-PT{offset}M / ACTION:DISPLAY / DESCRIPTION:Reminder / END:VALARM`
- Headers `PRODID:-//The NonStop Series//Bookings//EN`, `VERSION:2.0`, `CALSCALE:GREGORIAN`, `METHOD:PUBLISH`, `X-WR-CALNAME:Worship Slots — {name}`, `X-PUBLISHED-TTL:PT1H`, `REFRESH-INTERVAL;VALUE=DURATION:PT1H`

### 7.2 Routes

- `GET /api/user/slots/ics` — unchanged auth, now delegates to `buildVCalendar` + adds `SEQUENCE/VALARM`.
- `GET /api/calendar/[token]/ics` — **unauthenticated**. Lookup `CalendarToken where token==param && revokedAt==null`, update `lastAccessedAt`, fetch `EventSlot where assignedUserId==token.userId && status=="booked" && startTime > now-1d` (include window for clients that ignore past TTL), respond `Content-Type: text/calendar; charset=utf-8`, `Content-Disposition: inline; filename="worship-{slug}.ics"`, `Cache-Control: private, max-age=300`, `X-Robots-Tag: noindex`. On miss → `404` plain text.
- `GET|POST /api/user/calendar-token` — auth-gated. `GET` returns `{ token: string | null, url: string | null }` (`webcal://host/api/calendar/[token]/ics` + `https://` fallback). `POST {action:"create"|"rotate"|"revoke"}` — `rotate` = revoke old + create new in transaction, `revoke` = set `revokedAt=now`.
- Add `proxy.ts:39` exclusion if matcher ever broadens (`/api/calendar` must bypass auth cookie check `24`).

### 7.3 UI

- `components/slots/my-bookings-panel.tsx:71` — keep `<a href="/api/user/slots/ics">` download, add sibling `Subscribe` button that fetches `/api/user/calendar-token`, shows `webcal://` copy + `https://` copy + `Regenerate` (confirm dialog `shadcn Dialog` — never `window.confirm`).
- `components/profile-page/components/profile-content.tsx:644` — add `Calendar Subscription` card under notification prefs (same tab).

## 8. Scheduled Reminders (Cron)

### 8.1 Route `app/api/cron/reminders/route.ts`

- Guard: `if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) return 401` (also allow Vercel Cron header `x-vercel-cron` in preview). No session.
- Load `AdminNotificationSettings` singleton (default if missing) → `enabledChannels + offsets`.
- Window: `now = new Date(); nextWindow = new Date(now.getTime() + 65*60*1000)` (cover drift).
- Query: `EventSlot.findMany where { status:"booked", startTime:{ gte: now, lte: next24h } }` — indexed `@@index([startTime])` `prisma/schema.prisma:247`. Include `event.title/slug` + `assignedUserId`.
- For each `slot` and each `offset` in `offsets`:
  - `triggerAt = new Date(slot.startTime.getTime() - offset*60*1000)`
  - If `triggerAt` not in `[now - 10m, nextWindow]` skip (covers cron jitter).
  - For each `channel` mapped from offset (`1440→[inapp,email]`, `60→[inapp,email,push]`, `30→[sms]`) filtered by `AdminNotificationSettings`:
    - Try `NotificationDedup.create {slotId, channel, triggerAt}` — on `P2002` unique violation skip (idempotent).
    - On success call `notify(slot.assignedUserId, { title, body, link:"/dashboard/events", slotId, channel })`.

Title/body: `"{trackLabel} in {humanOffset} — {event.title} · {format(slot.startTime,"EEE d MMM yyyy h:mm aa")}"`, `body:"Your {track} hour starts at {time}. Location: {location}. Manage at {link}"`.

- Concurrency: chunk users 25 at a time, `Promise.allSettled`.
- Observability: `log.info("system","cron reminders", {meta:{checked: slots.length, sent: n, offsets}})` `lib/logger.ts:78` + store per-run summary in `AppLog:289`.

### 8.2 `vercel.json`

```json
{
  "crons": [{ "path": "/api/cron/reminders", "schedule": "0 0 * * *" }]
}
```

Hobby plan (Vercel Free) allows **daily** crons only — `0 * * * *` (hourly) requires Pro and fails deploy with `Hobby accounts are limited to daily cron jobs`. Daily `0 0 * * *` is the Vercel cron (degraded fallback); **hourly precision** (60m/30m offsets) is restored via `.github/workflows/cron-reminders.yml` `schedule: "0 * * * *"` → `POST https://host/api/cron/reminders` with `Authorization: Bearer $CRON_SECRET` (set `CRON_URL` + `CRON_SECRET` secrets). Self-hosted alt: same `curl` from any scheduler.

### 8.3 Manual / Local

`scripts/trigger-reminders.ts` (bun) for dev: calls `prisma` directly + `notify()` in dry-run.

## 9. Channel Details

### 9.1 Email (already present)

Reuse `lib/email-send.ts:19` `sendEmailWithRetry` + `lib/email/resend.ts:1`. New template `lib/email/ReminderEmail.tsx` (+ `SlotChangedEmail.tsx` for event broadcasts) extending `SlotReassigned.tsx:14` props `(name, eventTitle, startTime, endTime, trackLabel, scheduleLink, type:"reminder|changed")`. Sender `no-reply@thenonstop.org` `lib/auth.ts:71`. Gated by `emailEnabled && preference.emailReminders`.

### 9.2 Web Push

- Env: `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT=mailto:no-reply@thenonstop.org`.
- Dep: `web-push` (+ `@types/web-push`).
- Server: `lib/notify/push.ts` `sendPush(subscription, payload)` via `webPush.sendNotification(sub, JSON.stringify({title, body, url}), {TTL: 60*60})`; on `410/404` delete subscription.
- Client: `hooks/use-push.ts` + `public/sw.js` (register on layout, `self.addEventListener("push")` → `showNotification`, `notificationclick` → `clients.openWindow(event.data.url)`). UI `components/profile-page/components/profile-content.tsx:653` push row becomes controlled `Switch checked={pushEnabled && hasSubscription}` with `onCheckedChange` → request permission + `POST /api/user/push/subscribe {endpoint, keys:{p256dh, auth}}`.
- Routes: `POST /api/user/push/subscribe` (upsert), `POST /api/user/push/unsubscribe {endpoint}` (delete). Both auth-gated.
- Toggle: `pushEnabled` admin default `false` to avoid prompting before VAPID set.

### 9.3 WhatsApp (open-wa HTTP Bridge)
 
- Interface `lib/notify/whatsapp.ts` `sendWhatsappToUser(userId, body): Promise<boolean>`, `sendWhatsappOtp(phone, code): Promise<boolean>`, `sendWhatsappRaw(chatId, body): Promise<boolean>` — talks to self-hosted open-wa Docker bridge (`OPENWA_BASE_URL` + `OPENWA_SESSION_ID`); behind `whatsappEnabled`.
- Phone: `Profile.phone` (E.164 via `react-phone-number-input`) + `phoneVerifiedAt`. Verification route `POST /api/user/phone/{request|verify}` — `request` sends OTP via WhatsApp (6 digits, 5m expiry, hashed store in `PhoneVerification`), `verify` checks + sets `phoneVerifiedAt`.
- Formatting: E.164 stripped and formatted as `${digits}@c.us`, truncated at 4096 characters.
- Cost control: zero-cost self-hosted open-wa bridge; admin can disable globally in one click.
- SMS retired: Twilio dependency removed.

### 9.4 `lib/notify/index.ts` Contract

```ts
type NotifyChannel = "inapp" | "email" | "push" | "whatsapp"
export async function notify(
  userId: string,
  input: { title: string; body?: string; link?: string; slotId?: string; eventId?: string; channels?: NotifyChannel[] }
): Promise<void>
```

Never throws to caller; logs `log.warn("notify","channel failed", {meta:{userId, channel, error}})` per channel.

## 10. Admin Controls

- New section `Notification Settings` in `app/dashboard/admin/bookings/page.tsx:6` (or `app/dashboard/admin/settings/page.tsx` if created) — card:
  - Toggles: Email / Push / SMS (each `Switch`, `disabled` shows helper text).
  - Offsets: multi-select chips `1440 / 120 / 60 / 30 / 15` (push+S MS only visible when channel enabled).
  - Save → `PATCH /api/admin/notification-settings` (admin-only `session.user.role==="admin"` `app/api/admin/slots/[slotId]/assign/route.ts:25`, `log.info("settings")`).
- Route `app/api/admin/notification-settings/route.ts` — `GET` returns singleton, `PATCH {emailEnabled?, pushEnabled?, smsEnabled?, reminderOffsets?}` validates via `zod` `safeParse` (400 on fail), `prisma.adminNotificationSettings.upsert`, `log.info("settings","notification settings updated")`, `revalidatePath("/dashboard/admin/bookings")`.
- Cron visibility in `components/admin/logs-console.tsx:76` — filter `source==="system" && message.includes("cron reminders")` + `AppLog:289`.

## 11. User Preference UI

- Replace `components/profile-page/components/profile-content.tsx:644` static tab with controlled switches bound to `GET /api/user/preferences` (`useSWR`) and `PATCH /api/user/preferences {emailReminders?, pushReminders?, smsReminders?, phone?}`.
- Phone card: `Input` with `PhoneInput` + `Verify` button → OTP dialog (`shadcn Dialog`) → on verify set `smsReminders` enabled.
- Calendar card: copy `webcal://` + `https://` + `Regenerate` (confirm) — same endpoint as `my-bookings-panel`.
- Keep `Marketing Emails:678` + `Weekly Summary:688` untouched (weekly digest is Phase 3).
- Keep `Security Alerts` `checked disabled` — always enabled (no change).

## 12. New / Modified Routes

| Method | Path | Auth | Notes |
|--------|------|------|-------|
| GET | `/api/user/notifications` | user | **Modify** — add `channel` to select, keep `take:20` + `count read:false` `19` |
| POST | `/api/user/notifications/read` | user | No change |
| GET | `/api/user/slots/ics` | user | **Modify** — delegate to `buildVCalendar`, add `VALARM/SEQUENCE` |
| GET | `/api/calendar/[token]/ics` | none | New — token feed |
| GET/POST | `/api/user/calendar-token` | user | New — create/rotate/revoke |
| GET/PATCH | `/api/user/preferences` | user | New — per-channel prefs |
| POST | `/api/user/push/subscribe` | user | New |
| POST | `/api/user/push/unsubscribe` | user | New |
| POST | `/api/user/phone/request` | user | New — send OTP |
| POST | `/api/user/phone/verify` | user | New — verify OTP |
| GET/PATCH | `/api/admin/notification-settings` | admin | New |
| POST | `/api/cron/reminders` | `CRON_SECRET` | New — hourly |

All new bodies validated with `zod` `.safeParse()` (400 + field errors), responses `{success, data|error}`.

## 13. Env & Config

Add to `lib/env.ts` (Zod schema) + `.env.example`:

```
CRON_SECRET=openssl rand -hex 32
VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
VAPID_SUBJECT=mailto:no-reply@thenonstop.org
OPENWA_BASE_URL=http://localhost:2785
OPENWA_SESSION_ID=181c53f2-4092-47c3-9eb6-f8e42eff59e8
OPENWA_API_KEY=
```

`server-only` guard on `lib/notify/*` that reads secrets.

## 14. Deployment & Ops

- `vercel.json` cron + `CRON_SECRET` in Vercel env.
- Self-hosted fallback documented in `docs/notification-system.md` runbook.
- `scripts/create-log-ttl.ts` TTL stays on `{ts:1}` `AppLog:300` — no change.
- `proxy.ts:24` cookie guard unchanged — cron + calendar token routes excluded.

## 15. Verification

- **Typecheck:** `bun run typecheck` (`tsc --noEmit`) green; `bun run check` (Biome) green.
- **ICS:** `curl -H "Cookie: ..." https://host/api/user/slots/ics | grep -c VALARM` ≥1; subscribe `webcal://host/api/calendar/{token}/ics` in Apple Calendar & Google Calendar → event appears, updates within 1h after admin `assign`.
- **Reminders:** Set `reminderOffsets=[2]` (2m) in admin, book slot 2m out, `curl -H "Authorization: Bearer $CRON_SECRET" https://host/api/cron/reminders` → `Notification` row + email + push + sms (per prefs) + `NotificationDedup` row; second call is no-op (dedup hit 409-free).
- **Prefs:** Toggle email off → re-run cron → no email but `inapp` still written; revoke token → cached feed 404.
- **Tests:** `bun test` — `lib/calendar/ics.test.ts` (escape, VALARM, SEQUENCE) + `app/api/cron/reminders.test.ts` (window, dedup, channel gating).

## 16. Risks & Mitigations

- **Token leak** → unguessable 32-char, `noindex`, `private` cache, one-click rotate, `lastAccessedAt` to detect abuse.
- **Cron double-send on overlap** → `@@unique([slotId, channel, triggerAt])` + `P2002` catch is source of truth, not time check.
- **Push spam** → global `pushEnabled` defaults off; client only prompts after user flips switch.
- **SMS cost** → global `smsEnabled` off by default; only `30m` offset uses SMS; phone must be verified.
- **Mongo ObjectId cardinality** → `slotId` stored as `String @db.ObjectId` consistent with `EventSlot:240`.
- **Time zones** → ICS always UTC `icsDate` `6`; reminder query uses UTC `Date` comparison; display uses `toLocaleString("en-GB")` existing pattern `SlotReassigned.tsx:35`.

## 17. Phasing

**Phase 1 (foundation, ~1 sprint, no new provider):** Schema (`CalendarToken`, `Notification {channel,slotId}`, `NotificationPreference`), `lib/calendar/ics.ts`, both ICS routes + token route, profile switches persisted, `AdminNotificationSettings`, event-change fan-out, email remain.

**Phase 2 (reminders, ~1 sprint):** `lib/notify` + `NotificationDedup` + `POST /api/cron/reminders` + `vercel.json` + `ReminderEmail.tsx` + `PushSubscription` + `public/sw.js` + `hooks/use-push.ts` + SMS interface + `lib/notify/sms.ts` + phone OTP — admin toggles wired.

**Phase 3 (polish):** Weekly digest, per-track feeds, WhatsApp templates, push segmentation, admin analytics.

## 18. Open Follow-Ups (for implementation kickoff)

- Confirm `CRON_SECRET` rotation story (Vercel env vs Doppler).
- Pick SMS provider (Twilio vs Resend SMS) — abstracted, but billable account needed.
- Decide if `banned` users `prisma/user/slots/ics:22` should also skip reminders (recommend yes — same 403 gate).
- Copy review for `VALARM` description + SMS body (legal STOP line).

## 19. File Map (new vs modified)

**New:** `lib/calendar/ics.ts`, `lib/notify/index.ts`, `lib/notify/push.ts`, `lib/notify/sms.ts`, `lib/email/ReminderEmail.tsx`, `lib/email/SlotChangedEmail.tsx`, `app/api/calendar/[token]/ics/route.ts`, `app/api/user/calendar-token/route.ts`, `app/api/user/preferences/route.ts`, `app/api/user/push/subscribe/route.ts`, `app/api/user/push/unsubscribe/route.ts`, `app/api/user/phone/request/route.ts`, `app/api/user/phone/verify/route.ts`, `app/api/admin/notification-settings/route.ts`, `app/api/cron/reminders/route.ts`, `hooks/use-push.ts`, `public/sw.js`, `scripts/trigger-reminders.ts`.

**Modified:** `prisma/schema.prisma`, `lib/env.ts`, `vercel.json` (add), `app/api/user/slots/ics/route.ts`, `app/api/user/notifications/route.ts`, `app/api/admin/slots/[slotId]/assign/route.ts`, `app/api/events/[id]/slots/[slotId]/book/route.ts`, `app/api/events/[id]/route.ts` (event update), `components/profile-page/components/profile-content.tsx`, `components/slots/my-bookings-panel.tsx`, `components/sidebar-notifications.tsx`, `proxy.ts` (if matcher widens), `.env.example`.

---

*Generated 2026-08-26 from interview decisions Q1=B/B/B/A over `app/api/admin/slots/[slotId]/assign/route.ts:119`, `app/api/user/slots/ics/route.ts:20`, `prisma/schema.prisma:275`.*
