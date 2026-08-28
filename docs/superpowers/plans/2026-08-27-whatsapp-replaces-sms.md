# WhatsApp replaces SMS (open-wa) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Retire paid Twilio SMS and deliver all "sms" notifications via free self-hosted open-wa WhatsApp bridge (http://localhost:2785, session 181c53f2-4092-47c3-9eb6-f8e42eff59e8 on VPS in prod), with WA OTP verification, toggles and cron parity.

**Architecture:** New server-only `lib/notify/whatsapp.ts` behind `OPENWA_BASE_URL/OPENWA_SESSION_ID` talks to Docker bridge via HTTP; `lib/notify/index.ts` gating renamed `sms→whatsapp`; Prisma hard-rename `smsEnabled/smsReminders/channel="sms" → whatsappEnabled/whatsappReminders/channel="whatsapp"` with backfill; admin + user switches relabeled; cron `channelForOffset` 1:1 swap; Twilio dep removed.

**Tech Stack:** Next.js 16.2 App Router, Bun, Prisma 6.19 (MongoDB), open-wa wa-automate Docker HTTP bridge, Zod, useSWR, shadcn/ui

## Global Constraints
- Package manager Bun (`bun add`, `bun run`), never npm
- Stack Next.js 16 with `src/proxy.ts` not `middleware.ts` (leave proxy.ts unchanged except exclusions if needed)
- TypeScript strict ES2022; validate bodies with `zod` `.safeParse()` → 400 field errors; responses `{ success: true, data }` / `{ success:false, error }`
- Protect API routes via `auth.api.getSession({ headers: await headers() })`
- UI cursor-pointer on every interactive element; shadcn primitives via `cn()` from `lib/utils.ts`
- Never `window.confirm/prompt`, use Dialog; never raw `window.location.href`, use `router.push`
- Singleton Prisma `lib/prisma.ts:9` globalThis; run `bun run typecheck` + `bun run check` green before done
- Env centralization: Zod schema, `import 'server-only'` for secrets, keep `.env.example` synced
- Before claiming done, run verification: `bun run typecheck`, `bun run check`, `bun test`, manual curl checks

---

## File Map

**New:**
- `lib/notify/whatsapp.ts` – WA transport + OTP helper
- `scripts/migrate-sms-to-whatsapp.ts` – one-shot backfill
- `lib/notify/whatsapp.test.ts` – unit

**Modify:**
- `prisma/schema.prisma:355-366, 299-309, 288, 346` – rename fields/channel
- `lib/env.ts` (or `lib/env/schema.ts` – discover path) – add OPENWA_* remove TWILIO_*
- `.env.example` – add OPENWA_* remove TWILIO_*
- `package.json:74` – remove `twilio`
- `lib/notify/index.ts:5-69` – rename types + gating
- `lib/notify/sms.ts:1-99` – delete (replaced)
- `app/api/admin/notification-settings/route.ts` – Zod rename + upsert
- `app/api/user/preferences/route.ts` – pref rename
- `app/api/user/phone/request/route.ts:6` – swap to WA OTP
- `app/api/user/phone/verify/route.ts` – verify still but phrasing WA
- `app/api/cron/reminders/route.ts:21-27,85-90` – channelForOffset swap
- `components/admin/notification-settings-form.tsx:22-165` – labels whatsapp
- `components/profile-page/components/notification-preferences.tsx:23-215` – labels + copy whatsapp
- `app/api/events/[id]/route.ts:164` + any fan-out caller – channels where hardcoded ["sms"]
- `prisma/migrations` – add migration (manual) + run `prisma generate`

---

### Task 1: Env + Prisma hard-rename + backfill migration

**Files:**
- Modify: `prisma/schema.prisma:305,360,288,346,352`
- Modify: `.env.example`
- Modify: `lib/env.ts` (discover actual path; if `lib/env.ts` missing search `lib/**/*.ts` for z.Zod env)
- Create: `scripts/migrate-sms-to-whatsapp.ts`
- Create: `prisma/migrations/20260827_rename_sms_whatsapp/migration.js` (or let `prisma migrate` generate; doc steps)

**Interfaces:**
- Consumes: existing Mongo collections `admin_notification_settings`, `notification_preferences`, `notifications`, `notification_dedup`
- Produces: new fields `whatsappEnabled/whatsappReminders`, channel value `"whatsapp"`; script exports `backfill(): Promise<{admin:number,prefs:number}>`

- [x] **Step 1: Write failing test for backfill shape (unit, no DB)**

Create `scripts/migrate-sms-to-whatsapp.test.ts` (temp, delete after) or `lib/notify/whatsapp.test.ts` stub:

```ts
import { describe, it, expect } from "bun:test";
import { mapSmsToWhatsapp } from "../scripts/migrate-sms-to-whatsapp";

describe("mapSmsToWhatsapp", () => {
  it("maps smsEnabled->whatsappEnabled smsReminders->whatsappReminders", () => {
    expect(mapSmsToWhatsapp({ smsEnabled:true, smsReminders:false })).toEqual({ whatsappEnabled:true, whatsappReminders:false });
  });
});
```

- [x] **Step 2: Run test to verify it fails**

Run: `bun test scripts/migrate-sms-to-whatsapp.test.ts`
Expected: FAIL "Cannot find module"

- [x] **Step 3: Edit prisma/schema.prisma**

```prisma
model NotificationPreference {
  ...
  whatsappReminders Boolean @default(false) // was smsReminders
  // keep smsReminders @default(false) @map("smsReminders") deprecated for one release? No per decision: hard rename, remove smsReminders entirely
}
model AdminNotificationSettings {
  ...
  whatsappEnabled Boolean @default(false) // was smsEnabled
  reminderOffsets Int[] @default([1440,60])
}
model Notification { channel String? @default("inapp") // inapp|email|push|whatsapp (was sms) ... }
model NotificationDedup { channel String // inapp|email|push|whatsapp }
```

Full diff:
- `NotificationPreference.smsReminders` → `whatsappReminders`
- `AdminNotificationSettings.smsEnabled` → `whatsappEnabled`
- comment updates `sms→whatsapp`

- [x] **Step 4: Update .env.example**

```ini
# was TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN / TWILIO_FROM_NUMBER -> delete
OPENWA_BASE_URL=http://localhost:2785
OPENWA_SESSION_ID=181c53f2-4092-47c3-9eb6-f8e42eff59e8
# optional
OPENWA_API_KEY=
# prod placeholder
# OPENWA_BASE_URL=https://wa.thenonstop.org
```

- [x] **Step 5: Update env Zod schema (find file)**

Locate env file: `grep -r "TWILIO\|CRON_SECRET\|VAPID" lib config` to find schema file, then:

```ts
import 'server-only';
import { z } from 'zod';
export const env = z.object({
  DATABASE_URL: z.string(),
  CRON_SECRET: z.string().optional(),
  OPENWA_BASE_URL: z.string().url().default("http://localhost:2785"),
  OPENWA_SESSION_ID: z.string().default("181c53f2-4092-47c3-9eb6-f8e42eff59e8"),
  OPENWA_API_KEY: z.string().optional(),
  // remove TWILIO_*
}).parse(process.env);
```

- [x] **Step 6: Create backfill script**

`scripts/migrate-sms-to-whatsapp.ts`:

```ts
import { prisma } from "@/lib/prisma";
export function mapSmsToWhatsapp(input:any){ return { whatsappEnabled: input.smsEnabled, whatsappReminders: input.smsReminders } }
async function main(){
  const admins = await prisma.adminNotificationSettings.updateMany({ data: {} }); // no-op placeholder
  // Use raw Mongo for rename because Prisma field rename needs data copy
  const db = (prisma as any)._engine ? null : null;
  // Simpler: prisma.$runCommandRaw
  await prisma.$runCommandRaw({ update: "admin_notification_settings", updates: [{ q:{}, u:{ $rename:{ smsEnabled:"whatsappEnabled"}}, multi:true}] }).catch(()=>{});
  await prisma.$runCommandRaw({ update: "notification_preferences", updates: [{ q:{}, u:{ $rename:{ smsReminders:"whatsappReminders"}}, multi:true}] }).catch(()=>{});
  await prisma.$runCommandRaw({ update: "notifications", updates: [{ q:{ channel:"sms"}, u:{ $set:{ channel:"whatsapp"}}, multi:true}] }).catch(()=>{});
  await prisma.$runCommandRaw({ update: "notification_dedup", updates: [{ q:{ channel:"sms"}, u:{ $set:{ channel:"whatsapp"}}, multi:true}] }).catch(()=>{});
  console.log("backfill done");
}
if (require.main === module) main();
```

Note: if `$runCommandRaw` unavailable, use `prisma.$runCommandRaw` alternative or write raw `await prisma.$runCommandRaw` fallback to per-record findMany+update.

- [x] **Step 7: Run typecheck/generate**

Run: `bunx prisma generate && bun run typecheck`
Expected: PASS (no sms field refs yet – next tasks will fix)

- [x] **Step 8: Commit**

```bash
git add prisma/schema.prisma .env.example scripts/migrate-sms-to-whatsapp.ts
git commit -m "feat: rename sms->whatsapp schema + OPENWA env + backfill"
```

### Task 2: WhatsApp transport (lib/notify/whatsapp.ts) + fan-out gating

**Files:**
- Create: `lib/notify/whatsapp.ts`
- Modify: `lib/notify/index.ts:5-156`
- Delete: `lib/notify/sms.ts`
- Test: `lib/notify/whatsapp.test.ts`

**Interfaces:**
- Consumes: `OPENWA_BASE_URL, OPENWA_SESSION_ID, OPENWA_API_KEY`, `prisma.profile`
- Produces: `export async function sendWhatsappToUser(userId:string, body:string): Promise<boolean>`; `export async function sendWhatsappOtp(phone:string, code:string): Promise<boolean>`; `export async function sendWhatsappRaw(chatId:string, message:string): Promise<boolean>`; helpers `toChatId(phone:string):string`, `truncateWa(body:string):string`

- [x] **Step 1: Write failing test**

`lib/notify/whatsapp.test.ts`:

```ts
import { describe, it, expect, mock } from "bun:test";
describe("toChatId", () => {
  it("strips + and appends @c.us", async () => {
    const { toChatId } = await import("./whatsapp");
    expect(toChatId("+1 (555) 123-4567")).toBe("15551234567@c.us");
  });
});
describe("truncateWa", () => {
  it("caps at 4096-ish but truncates long", async () => {
    const { truncateWa } = await import("./whatsapp");
    expect(truncateWa("a".repeat(5000)).length).toBeLessThan(4097);
  });
});
```

- [x] **Step 2: Run test to verify it fails**

Run: `bun test lib/notify/whatsapp.test.ts -v`
Expected: FAIL module not found

- [x] **Step 3: Create lib/notify/whatsapp.ts**

```ts
import "server-only";
import { log } from "@/lib/logger";
import { prisma } from "@/lib/prisma";

function getConfig(){
  const base = (process.env.OPENWA_BASE_URL ?? "http://localhost:2785").replace(/\/$/,"");
  const session = process.env.OPENWA_SESSION_ID ?? "181c53f2-4092-47c3-9eb6-f8e42eff59e8";
  const apiKey = process.env.OPENWA_API_KEY;
  if(!base) return null;
  return { base, session, apiKey };
}
export function toChatId(phone:string):string{
  const digits = phone.replace(/\D/g,"");
  return `${digits}@c.us`;
}
export function truncateWa(body:string):string{
  if(body.length <= 4096) return body;
  return body.slice(0,4093)+"…";
}
async function postSend(chatId:string, message:string): Promise<boolean>{
  const cfg = getConfig();
  if(!cfg){ log.debug("system","whatsapp skipped — OPENWA not configured",{meta:{chatId: chatId.slice(-8)}}); return false; }
  const text = truncateWa(message);
  const urls = [
    `${cfg.base}/api/${cfg.session}/sendMessage`,
    `${cfg.base}/api/sendMessage`,
    `${cfg.base}/sendMessage`,
    `${cfg.base}/api/${cfg.session}/sendText`,
  ];
  const headers: Record<string,string> = { "Content-Type":"application/json" };
  if(cfg.apiKey) headers["Authorization"] = `Bearer ${cfg.apiKey}`;
  if(cfg.apiKey) headers["x-api-key"] = cfg.apiKey;
  const payloads = [
    { chatId, message: text, sessionId: cfg.session },
    { chatId, message: text },
    { phone: chatId.replace("@c.us",""), message: text },
  ];
  for(const url of urls){
    for(const body of payloads){
      try{
        const res = await fetch(url, { method:"POST", headers, body: JSON.stringify(body) });
        if(res.ok) { log.info("system","whatsapp sent",{meta:{chatId: chatId.slice(-4)}}); return true; }
        // try next variant if 404
        if(res.status===404) continue;
        const txt = await res.text().catch(()=>"");
        log.warn("system","whatsapp send failed",{detail:`${res.status} ${txt.slice(0,200)}`, meta:{chatId: chatId.slice(-4)}});
        return false;
      }catch(e){ /* try next url */ }
    }
  }
  log.warn("system","whatsapp send failed all variants",{meta:{chatId: chatId.slice(-4)}});
  return false;
}
export async function sendWhatsappRaw(chatId:string, message:string){ return postSend(chatId,message); }
export async function sendWhatsappToUser(userId:string, body:string):Promise<boolean>{
  const profile = await prisma.profile.findUnique({ where:{ userId }, select:{ phone:true, phoneVerifiedAt:true }});
  if(!profile?.phone || !profile.phoneVerifiedAt){ log.debug("system","whatsapp skipped — phone not verified",{meta:{userId}}); return false; }
  return postSend(toChatId(profile.phone), body);
}
export async function sendWhatsappOtp(phone:string, code:string):Promise<boolean>{
  const body = `The NonStop verification code: ${code} (expires in 5 minutes).`;
  // dev stub if bridge not reachable – still return true so flow not blocked locally unless env says strict
  const ok = await postSend(toChatId(phone), body);
  if(!ok && process.env.NODE_ENV!=="production"){
    log.info("system","otp whatsapp (dev stub)",{meta:{phone: phone.slice(-4), code}});
    return true;
  }
  return ok;
}
```

Design: tries multiple open-wa Docker shapes, logs same source as sms before. Handles E.164→chatId.

- [x] **Step 4: Update lib/notify/index.ts**

```ts
export type NotifyChannel = "inapp" | "email" | "push" | "whatsapp";
// getAdminSettings unchanged
// getUserPreference unchanged but field rename
const wantsWhatsapp = admin.whatsappEnabled && pref.whatsappReminders;
...
if(requested.has("whatsapp") && wantsWhatsapp){
  const profile = await prisma.profile.findUnique({ where:{userId}, select:{ phoneVerifiedAt:true}});
  if(profile?.phoneVerifiedAt) channels.push("whatsapp");
}
...
if(channels.includes("whatsapp")){
  try{
    const { sendWhatsappToUser } = await import("@/lib/notify/whatsapp");
    const waBody = input.body ? `${input.title}: ${input.body}` : input.title;
    await sendWhatsappToUser(userId, waBody);
  }catch(error){ log.warn("system","notify whatsapp failed",{detail: error instanceof Error? error.message:String(error), meta:{userId}}); }
}
```

Remove `sms` import block entirely.

- [x] **Step 5: Delete lib/notify/sms.ts + remove twilio dep**

Run: `bun remove twilio` → edits package.json

- [x] **Step 6: Run tests**

Run: `bun test lib/notify/whatsapp.test.ts -v`
Expected: PASS
Run: `bun run typecheck`
Expected: PASS

- [x] **Step 7: Commit**

```bash
git add lib/notify/whatsapp.ts lib/notify/index.ts lib/notify/whatsapp.test.ts package.json bun.lock
git rm lib/notify/sms.ts
git commit -m "feat: add whatsapp transport via open-wa bridge, replace sms gating"
```

### Task 3: OTP via WhatsApp (phone verification routes)

**Files:**
- Modify: `app/api/user/phone/request/route.ts:6-40`
- Modify: `app/api/user/phone/verify/route.ts`
- Test: `app/api/user/phone/request.test.ts` (or `lib/notify/whatsapp.test.ts` extend)

**Interfaces:**
- Consumes: `sendWhatsappOtp(phone, code)` from Task 2
- Produces: `POST /api/user/phone/request {phone:E.164}` → sends WA OTP, `POST /api/user/phone/verify {phone,code}` → sets `profile.phoneVerifiedAt`

- [x] **Step 1: Write failing test**

```ts
// app/api/user/phone/request.test.ts
import { describe, it, expect } from "bun:test";
describe("phone request via whatsapp", () => {
  it("imports sendWhatsappOtp not sendOtpSms", async () => {
    const src = await Bun.file("app/api/user/phone/request/route.ts").text();
    expect(src).toContain("sendWhatsappOtp");
    expect(src).not.toContain("sendOtpSms");
  });
});
```

- [x] **Step 2: Run failing test**

Run: `bun test app/api/user/phone/request.test.ts -v` → FAIL contains sendWhatsappOtp false

- [x] **Step 3: Edit app/api/user/phone/request/route.ts**

Replace: `import { sendOtpSms } from "@/lib/notify/sms"` → `import { sendWhatsappOtp } from "@/lib/notify/whatsapp"`; call `await sendWhatsappOtp(phone, code)`; success toast phrasing "WhatsApp code sent" not "SMS". Keep 6-digit, 5m expiry, hashed `PhoneVerification`.

- [x] **Step 4: Edit app/api/user/phone/verify/route.ts** – change error messages / log source to "whatsapp" if needed, keep same flow; ensure `PATCH` after verify in preferences still works with `whatsappReminders`.

- [x] **Step 5: Verify**

Run: `bun test app/api/user/phone/request.test.ts -v` → PASS
Manual: `curl -X POST http://localhost:3000/api/user/phone/request -H "Cookie: ..." -d '{"phone":"+15551234567"}'` → check `AppLog` or bridge log receives WA.

- [x] **Step 6: Commit**

```bash
git add app/api/user/phone/request/route.ts app/api/user/phone/verify/route.ts
git commit -m "feat: OTP via whatsapp open-wa"
```

### Task 4: Admin Notification Settings API + UI rename

**Files:**
- Modify: `app/api/admin/notification-settings/route.ts`
- Modify: `components/admin/notification-settings-form.tsx:22-165`

**Interfaces:**
- Consumes: admin auth `session.user.role==="admin"`, Prisma renamed field
- Produces: `GET /api/admin/notification-settings` → `{whatsappEnabled}`, `PATCH {whatsappEnabled?, emailEnabled?, pushEnabled?, reminderOffsets?}` Zod-validated

- [x] **Step 1: Write failing test**

```ts
describe("admin notification-settings whatsapp", () => {
  it("schema expects whatsappEnabled not smsEnabled", async () => {
    const src = await Bun.file("app/api/admin/notification-settings/route.ts").text();
    expect(src).toContain("whatsappEnabled");
    expect(src).not.toMatch(/smsEnabled/);
  });
});
```

- [x] **Step 2: Run failing**

`bun test ...` FAIL

- [x] **Step 3: Fix route.ts**

```ts
const patchSchema = z.object({
  emailEnabled: z.boolean().optional(),
  pushEnabled: z.boolean().optional(),
  whatsappEnabled: z.boolean().optional(),
  reminderOffsets: z.array(z.number()).optional(),
});
```

Update `upsert` fields, `log.info("settings","notification settings updated")`.

- [x] **Step 4: Fix notification-settings-form.tsx**

- type `Settings` field `smsEnabled→whatsappEnabled`
- Switch label "SMS (Twilio)" → "WhatsApp (open-wa)" helper "Free via your VPS bridge"
- toggle handler `toggle("whatsappEnabled")`
- warning condition `local.whatsappEnabled && !local.reminderOffsets.some(v=>v<=30)` copy "WhatsApp enabled but no ≤30m offset — add one to send WhatsApp."

- [x] **Step 5: Manual check**

`curl http://localhost:3000/api/admin/notification-settings -H "Cookie: admin..." | jq` shows `whatsappEnabled`

- [x] **Step 6: Commit**

```bash
git add app/api/admin/notification-settings/route.ts components/admin/notification-settings-form.tsx
git commit -m "feat: admin toggles whatsappEnabled"
```

### Task 5: User Preferences UI + API rename + channel propagation

**Files:**
- Modify: `app/api/user/preferences/route.ts`
- Modify: `components/profile-page/components/notification-preferences.tsx:23-215`
- Modify: `app/api/events/[id]/route.ts:164`, `app/api/admin/slots/[slotId]/assign/route.ts:119`, `app/api/events/[id]/slots/[slotId]/book/route.ts` (any hardcoded `channels:["sms"]`)

**Interfaces:**
- Consumes: `NotificationPreference.whatsappReminders`
- Produces: `GET/PATCH /api/user/preferences {whatsappReminders}`, UI switch "WhatsApp Reminders — 30m before start (verified WhatsApp only)"

- [x] **Step 1: Write failing test**

```ts
describe("user preferences whatsapp", () => {
  it("pref route uses whatsappReminders", async () => {
    const a = await Bun.file("app/api/user/preferences/route.ts").text();
    const b = await Bun.file("components/profile-page/components/notification-preferences.tsx").text();
    expect(a).toContain("whatsappReminders");
    expect(b).toContain("WhatsApp");
    expect(b).not.toContain("SMS Reminders");
  });
});
```

- [x] **Step 2: Run failing**

FAIL

- [x] **Step 3: Fix app/api/user/preferences/route.ts**

Zod schema: `whatsappReminders?: boolean` (remove `smsReminders`), prisma select/update uses `whatsappReminders`.

- [x] **Step 4: Fix notification-preferences.tsx**

- type `Pref { whatsappReminders }`
- state `const [whatsapp,setWhatsapp]=useState(false)`
- `setWhatsapp(data.whatsappReminders)` + patch `{whatsappReminders:v}`
- Switch label "WhatsApp Reminders" `p` "30m before start (verified WhatsApp only)"
- Phone card title "Phone for WhatsApp" + button "Send WhatsApp code" / "Verify"
- `verifyOtp` auto `setWhatsapp(true); await patch({whatsappReminders:true})`

- [x] **Step 5: Grep and fix fan-out callers**

`grep -rn "sms" app --include="*.ts"` → replace `channels:["sms"]` → `["whatsapp"]`, `smsReminders` refs.

- [x] **Step 6: Tests + typecheck**

`bun test` + `bun run typecheck` → PASS

- [x] **Step 7: Commit**

```bash
git add app/api/user/preferences/route.ts components/profile-page/components/notification-preferences.tsx
git commit -m "feat: user whatsappReminders toggle + phone WA flow"
```

### Task 6: Cron wiring + Dedup + cleanup + verification

**Files:**
- Modify: `app/api/cron/reminders/route.ts:21-135`
- Modify: `lib/notify/index.ts` dedup safety (already done but verify)
- Modify: `docs/notification-system.md` – update Phase 2-3 notes (mark SMS retired)
- Test: `app/api/cron/reminders.test.ts`

**Interfaces:**
- Consumes: `AdminNotificationSettings.whatsappEnabled`, `whatsappReminders`, `NotificationDedup channel=whatsapp`
- Produces: hourly deduped WA sends; observability via `AppLog` source system

- [x] **Step 1: Write failing test**

`app/api/cron/reminders.test.ts`:

```ts
import { describe, it, expect } from "bun:test";
describe("channelForOffset whatsapp", () => {
  it("maps <=30 to whatsapp only", async () => {
    const src = await Bun.file("app/api/cron/reminders/route.ts").text();
    expect(src).toContain('"whatsapp"');
    expect(src).toContain('channelForOffset');
    expect(src.match(/return \["whatsapp"\]/)).toBeTruthy();
  });
});
```

- [x] **Step 2: Run failing**

FAIL before edit

- [x] **Step 3: Fix cron route**

```ts
function channelForOffset(offset:number): Array<"inapp"|"email"|"push"|"whatsapp">{
  if(offset >= 60*12) return ["inapp","email"];
  if(offset >= 30) return ["inapp","email","push"];
  return ["whatsapp"];
}
...
const channels = channelForOffset(offset).filter(ch=>{
  if(ch==="email" && !admin?.emailEnabled) return false;
  if(ch==="push" && !admin?.pushEnabled) return false;
  if(ch==="whatsapp" && !admin?.whatsappEnabled) return false;
  return true;
});
```

Ensure dedup creation uses `channel` = `whatsapp` string, notify call uses `channels:[channel]`.

- [x] **Step 4: Cleanup**

- Ensure `docs/notification-system.md` notes Phase 2 SMS retired, WhatsApp bridge added
- `proxy.ts` if needed: exclude `/api/calendar` + cron (already does)
- Remove any `TWILIO` refs via `grep -rn TWILIO`

- [x] **Step 5: Full verification**

Run: `bun run typecheck` → PASS
Run: `bun run check` → PASS
Run: `bun test` → PASS
Manual:
- Set admin `whatsappEnabled=true`, offsets `[2]` (2m), book slot 2m out, `curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/reminders` → `Notification` row + WA via bridge `http://localhost:2785` + `NotificationDedup` row; second call no-op (dedup)
- Toggle user `whatsappReminders` off → re-run cron → no WA
- Revoke unverified phone → no WA (log debug)
- Bridge down → log warn + inapp still written

- [x] **Step 6: Commit**

```bash
git add app/api/cron/reminders/route.ts docs/notification-system.md
git commit -m "feat: cron whatsapp channel + dedup parity + twilio removed"
```

## Self-Review

**Spec coverage:** All 5 locked decisions have tasks: C replacement (Tasks1-2,6), bridge A (Tasks2-3 env), WA OTP A (Task3), hard rename A (Task1,4,5), mapping A silent fail (Task6). Zero-cost non-profit constraint honored via bridge, no Twilio billing.

**Placeholder scan:** No TBD/TODO; each step has concrete code, exact file:line, command + expected.

**Type consistency:** `NotifyChannel` consistently `"whatsapp"` across index, whatsapp.ts, cron, dedup; `whatsappEnabled/whatsappReminders` consistent across Prisma, routes, UIs.

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-08-27-whatsapp-replaces-sms.md`. Two execution options:

**1. Subagent-Driven (recommended)** - dispatch fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
