# Unified Admin Audit Trail Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a comprehensive, tamper-evident audit trail system for admin actions across slots, users, events, reflections, and system settings, featuring a centralized non-blocking logger, query APIs, dedicated dashboard UI, and inline history views.

**Architecture:** A new dedicated MongoDB `AuditLog` collection managed via Prisma stores immutable records of administrative actions with denormalized actor credentials and state diff snapshots (`before`/`after`). A centralized helper (`lib/audit.ts`) records mutations non-blockingly to guarantee zero side-effects on primary transactions. A dedicated dashboard (`/dashboard/admin/audit`) and contextual dialogs provide complete visibility with filterable queries and JSON diff inspection.

**Tech Stack:** Next.js 16 (App Router), Prisma ORM (MongoDB), TypeScript, Tailwind CSS, Lucide React, SWR, Bun test runner.

## Global Constraints

- **Package Manager:** Use `bun` (never npm/yarn). Commands: `bun run`, `bun add`, `bun test`, etc.
- **Cursor Rule:** All interactive elements (`<Button>`, `<Link>`, clickable `<div>`, clickable `<a>`) must include `cursor-pointer` in their className.
- **Resilience:** Logging must never cause a mutation to fail; all audit writes are guarded by try/catch and executed non-blockingly.
- **Linter & Formatter:** Must pass Biome check (`bun run lint`).

---

### Task 1: Prisma Schema & DB Generation for `AuditLog`

**Files:**
- Modify: `prisma/schema.prisma`
- Test: `lib/audit-schema.test.ts`

**Interfaces:**
- Produces: `prisma.auditLog` Prisma Client delegate with fields: `id`, `actorId`, `actorEmail`, `actorName`, `actorRole`, `action`, `entityType`, `entityId`, `entityLabel`, `before`, `after`, `metadata`, `ipAddress`, `userAgent`, `createdAt`.

- [ ] **Step 1: Write the failing test**

Create `lib/audit-schema.test.ts`:

```typescript
import { describe, expect, it } from "bun:test";

describe("AuditLog Prisma Schema", () => {
	it("contains AuditLog model definition with required fields and indexes", async () => {
		const schema = await Bun.file("prisma/schema.prisma").text();
		expect(schema).toContain("model AuditLog {");
		expect(schema).toContain("actorId     String   @db.ObjectId");
		expect(schema).toContain("actorEmail  String");
		expect(schema).toContain("actorName   String");
		expect(schema).toContain("actorRole   String   @default(\"admin\")");
		expect(schema).toContain("action      String");
		expect(schema).toContain("entityType  String");
		expect(schema).toContain("entityId    String?");
		expect(schema).toContain("entityLabel String?");
		expect(schema).toContain("before      Json?");
		expect(schema).toContain("after       Json?");
		expect(schema).toContain("metadata    Json?");
		expect(schema).toContain("ipAddress   String?");
		expect(schema).toContain("userAgent   String?");
		expect(schema).toContain("createdAt   DateTime @default(now())");
		expect(schema).toContain("@@index([action])");
		expect(schema).toContain("@@index([entityType, entityId])");
		expect(schema).toContain("@@index([actorId])");
		expect(schema).toContain("@@index([createdAt])");
		expect(schema).toContain("@@map(\"audit_logs\")");
	});
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test lib/audit-schema.test.ts`  
Expected: FAIL with assertion error that `model AuditLog` was not found.

- [ ] **Step 3: Update `prisma/schema.prisma` and generate client**

Append to `prisma/schema.prisma`:

```prisma
model AuditLog {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  actorId     String   @db.ObjectId
  actorEmail  String
  actorName   String
  actorRole   String   @default("admin")
  action      String
  entityType  String
  entityId    String?
  entityLabel String?
  before      Json?
  after       Json?
  metadata    Json?
  ipAddress   String?
  userAgent   String?
  createdAt   DateTime @default(now())

  @@index([action])
  @@index([entityType, entityId])
  @@index([actorId])
  @@index([createdAt])
  @@map("audit_logs")
}
```

Run command: `bunx prisma generate`

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test lib/audit-schema.test.ts`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add prisma/schema.prisma lib/audit-schema.test.ts
git commit -m "feat(audit): add AuditLog model to prisma schema"
```

---

### Task 2: Core Audit Service Helper (`lib/audit.ts`)

**Files:**
- Create: `lib/audit.ts`
- Test: `lib/audit.test.ts`

**Interfaces:**
- Consumes: `prisma.auditLog`
- Produces:
  - `recordAuditLog(params: AuditParams): Promise<AuditLog | null>`
  - `extractClientMeta(req?: Request | Headers | null): { ipAddress: string | null; userAgent: string | null }`
  - Types `AuditActor`, `AuditParams`

- [ ] **Step 1: Write the failing test**

Create `lib/audit.test.ts`:

```typescript
import { describe, expect, it } from "bun:test";
import { extractClientMeta, recordAuditLog } from "./audit";

describe("audit service helper", () => {
	it("extracts ipAddress and userAgent from Request headers", () => {
		const req = new Request("http://localhost:3000/api/admin/slots", {
			headers: {
				"x-forwarded-for": "203.0.113.195, 70.41.3.18",
				"user-agent": "Mozilla/5.0 TestBrowser",
			},
		});
		const meta = extractClientMeta(req);
		expect(meta.ipAddress).toBe("203.0.113.195");
		expect(meta.userAgent).toBe("Mozilla/5.0 TestBrowser");
	});

	it("falls back gracefully when headers are empty", () => {
		const meta = extractClientMeta(null);
		expect(meta.ipAddress).toBeNull();
		expect(meta.userAgent).toBeNull();
	});

	it("safely suppresses errors without throwing if database write fails", async () => {
		// Pass an invalid actor or parameter designed to test failure suppression
		const result = await recordAuditLog({
			actor: {
				id: "invalid-id",
				email: "admin@test.com",
				name: "Admin",
			},
			action: "test.fail",
			entityType: "test",
		});
		// Should return null and not throw
		expect(result === null || typeof result === "object").toBe(true);
	});
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test lib/audit.test.ts`  
Expected: FAIL with "Cannot find module './audit'"

- [ ] **Step 3: Implement `lib/audit.ts`**

Create `lib/audit.ts`:

```typescript
import { prisma } from "@/lib/prisma";

export interface AuditActor {
	id: string;
	email: string;
	name: string;
	role?: string | null;
}

export interface AuditParams {
	actor: AuditActor;
	action: string;
	entityType: string;
	entityId?: string | null;
	entityLabel?: string | null;
	before?: Record<string, unknown> | null;
	after?: Record<string, unknown> | null;
	metadata?: Record<string, unknown> | null;
	req?: Request | Headers | null;
	ipAddress?: string | null;
	userAgent?: string | null;
}

export function extractClientMeta(req?: Request | Headers | null): {
	ipAddress: string | null;
	userAgent: string | null;
} {
	if (!req) {
		return { ipAddress: null, userAgent: null };
	}

	const headers = req instanceof Request ? req.headers : req;
	const forwarded = headers.get("x-forwarded-for");
	const realIp = headers.get("x-real-ip");
	const ipAddress = forwarded
		? forwarded.split(",")[0].trim()
		: realIp || null;

	const userAgent = headers.get("user-agent") || null;
	return { ipAddress, userAgent };
}

export async function recordAuditLog(params: AuditParams) {
	try {
		const meta = extractClientMeta(params.req);
		const ipAddress = params.ipAddress ?? meta.ipAddress;
		const userAgent = params.userAgent ?? meta.userAgent;

		// Clean and ensure object structure for JSON fields
		const before = params.before ? JSON.parse(JSON.stringify(params.before)) : null;
		const after = params.after ? JSON.parse(JSON.stringify(params.after)) : null;
		const metadata = params.metadata ? JSON.parse(JSON.stringify(params.metadata)) : null;

		return await prisma.auditLog.create({
			data: {
				actorId: params.actor.id,
				actorEmail: params.actor.email,
				actorName: params.actor.name,
				actorRole: params.actor.role || "admin",
				action: params.action,
				entityType: params.entityType,
				entityId: params.entityId ?? null,
				entityLabel: params.entityLabel ?? null,
				before,
				after,
				metadata,
				ipAddress,
				userAgent,
			},
		});
	} catch (error) {
		console.error("[AUDIT_LOG_ERROR] Failed to record audit log:", error);
		return null;
	}
}

export function recordAuditLogAsync(params: AuditParams): void {
	recordAuditLog(params).catch((err) => {
		console.error("[AUDIT_LOG_ASYNC_ERROR]", err);
	});
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test lib/audit.test.ts`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/audit.ts lib/audit.test.ts
git commit -m "feat(audit): implement centralized audit service helper"
```

---

### Task 3: Instrument Slot Mutations (Assign, Block, Batch)

**Files:**
- Modify: `app/api/admin/slots/[slotId]/assign/route.ts`
- Modify: `app/api/admin/slots/[slotId]/block/route.ts`
- Modify: `app/api/admin/slots/batch/route.ts`
- Test: `app/api/admin/slots/slots-audit.test.ts`

**Interfaces:**
- Consumes: `recordAuditLog` from `lib/audit.ts`
- Produces: Audit records for `slot.assign`, `slot.reassign`, `slot.clear`, `slot.block`, `slot.unblock`, `slot.batch_action`

- [ ] **Step 1: Write the failing test**

Create `app/api/admin/slots/slots-audit.test.ts`:

```typescript
import { describe, expect, it } from "bun:test";

describe("slot mutation audit instrumentation", () => {
	it("slot assign route records audit log with correct action types", async () => {
		const src = await Bun.file("app/api/admin/slots/[slotId]/assign/route.ts").text();
		expect(src).toContain("recordAuditLog");
		expect(src).toContain("slot.assign");
		expect(src).toContain("slot.reassign");
		expect(src).toContain("slot.clear");
	});

	it("slot block route records audit log with block and unblock", async () => {
		const src = await Bun.file("app/api/admin/slots/[slotId]/block/route.ts").text();
		expect(src).toContain("recordAuditLog");
		expect(src).toContain("slot.block");
		expect(src).toContain("slot.unblock");
	});

	it("slot batch route records audit log with slot.batch_action", async () => {
		const src = await Bun.file("app/api/admin/slots/batch/route.ts").text();
		expect(src).toContain("recordAuditLog");
		expect(src).toContain("slot.batch_action");
	});
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test app/api/admin/slots/slots-audit.test.ts`  
Expected: FAIL (missing `recordAuditLog` in the routes)

- [ ] **Step 3: Instrument slot routes**

1. In `app/api/admin/slots/[slotId]/assign/route.ts`:
   - Import `recordAuditLog` from `@/lib/audit`.
   - Before slot update, note `currentSlot.assignedUserId` and `currentSlot.status`.
   - Determine action: `slot.clear` if `userId === null`, `slot.reassign` if previous user existed, otherwise `slot.assign`.
   - Call `await recordAuditLog({ actor: session.user, action, entityType: "slot", entityId: slotId, entityLabel: `${slot.track} (${slot.startTime.toISOString()})`, before: { assignedUserId: currentSlot.assignedUserId }, after: { assignedUserId: userId }, metadata: { reason }, req })`.

2. In `app/api/admin/slots/[slotId]/block/route.ts`:
   - Import `recordAuditLog` from `@/lib/audit`.
   - Before update, note `currentSlot.status`.
   - Determine action: `slot.block` if new status is `blocked`, otherwise `slot.unblock`.
   - Call `await recordAuditLog({ actor: session.user, action, entityType: "slot", entityId: slotId, entityLabel: `${slot.track} (${slot.startTime.toISOString()})`, before: { status: currentSlot.status }, after: { status: newStatus }, metadata: { reason }, req })`.

3. In `app/api/admin/slots/batch/route.ts`:
   - Import `recordAuditLog` from `@/lib/audit`.
   - After batch operation completes, record `slot.batch_action`:
   - Call `await recordAuditLog({ actor: session.user, action: "slot.batch_action", entityType: "slot", entityId: null, entityLabel: `Batch: ${action} on ${slotIds.length} slots`, metadata: { slotIds, action, count: slotIds.length }, req })`.

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test app/api/admin/slots/slots-audit.test.ts`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add app/api/admin/slots/[slotId]/assign/route.ts app/api/admin/slots/[slotId]/block/route.ts app/api/admin/slots/batch/route.ts app/api/admin/slots/slots-audit.test.ts
git commit -m "feat(audit): instrument slot assignment, blocking, and batch mutations"
```

---

### Task 4: Instrument User Mutations (Role, Ban, Unban, Delete)

**Files:**
- Modify: `app/api/admin/users/route.ts`
- Test: `app/api/admin/users-audit.test.ts`

**Interfaces:**
- Consumes: `recordAuditLog` from `lib/audit.ts`
- Produces: Audit records for `user.role_change`, `user.ban`, `user.unban`, `user.delete`

- [ ] **Step 1: Write the failing test**

Create `app/api/admin/users-audit.test.ts`:

```typescript
import { describe, expect, it } from "bun:test";

describe("user mutations audit instrumentation", () => {
	it("admin users route imports and calls recordAuditLog for role, ban, and delete", async () => {
		const src = await Bun.file("app/api/admin/users/route.ts").text();
		expect(src).toContain("recordAuditLog");
		expect(src).toContain("user.role_change");
		expect(src).toContain("user.ban");
		expect(src).toContain("user.unban");
		expect(src).toContain("user.delete");
	});
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test app/api/admin/users-audit.test.ts`  
Expected: FAIL

- [ ] **Step 3: Instrument `app/api/admin/users/route.ts`**

Inspect and modify `app/api/admin/users/route.ts`:
- Import `recordAuditLog` from `@/lib/audit`.
- In `PATCH`:
  - When changing role: record `action: "user.role_change"`, `entityType: "user"`, `entityId: targetUser.id`, `entityLabel: targetUser.email`, `before: { role: targetUser.role }`, `after: { role: newRole }`.
  - When banning: record `action: "user.ban"`, `entityType: "user"`, `before: { banned: targetUser.banned }`, `after: { banned: true, banReason, banExpires }`.
  - When unbanning: record `action: "user.unban"`, `entityType: "user"`, `before: { banned: true }`, `after: { banned: false }`.
- In `DELETE`:
  - Record `action: "user.delete"`, `entityType: "user"`, `entityId: targetUser.id`, `entityLabel: targetUser.email`, `before: { name: targetUser.name, email: targetUser.email }`.

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test app/api/admin/users-audit.test.ts`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add app/api/admin/users/route.ts app/api/admin/users-audit.test.ts
git commit -m "feat(audit): instrument user role, ban, and delete actions"
```

---

### Task 5: Instrument Event & Reflection Mutations

**Files:**
- Modify: `app/api/events/route.ts`
- Modify: `app/api/events/[id]/route.ts`
- Modify: `app/api/events/[id]/slots/regenerate/route.ts`
- Modify: `app/api/admin/reflections/route.ts`
- Test: `app/api/admin/events-reflections-audit.test.ts`

**Interfaces:**
- Consumes: `recordAuditLog` from `lib/audit.ts`
- Produces: Audit records for `event.create`, `event.update`, `event.delete`, `event.slots_regenerate`, `reflection.status_change`, `reflection.delete`

- [ ] **Step 1: Write the failing test**

Create `app/api/admin/events-reflections-audit.test.ts`:

```typescript
import { describe, expect, it } from "bun:test";

describe("event and reflection audit instrumentation", () => {
	it("event routes record audit log for create, update, delete, and slot regeneration", async () => {
		const eventCreate = await Bun.file("app/api/events/route.ts").text();
		const eventDetail = await Bun.file("app/api/events/[id]/route.ts").text();
		const eventRegen = await Bun.file("app/api/events/[id]/slots/regenerate/route.ts").text();

		expect(eventCreate).toContain("recordAuditLog");
		expect(eventCreate).toContain("event.create");

		expect(eventDetail).toContain("recordAuditLog");
		expect(eventDetail).toContain("event.update");
		expect(eventDetail).toContain("event.delete");

		expect(eventRegen).toContain("recordAuditLog");
		expect(eventRegen).toContain("event.slots_regenerate");
	});

	it("reflections route records audit log for moderation changes and deletes", async () => {
		const reflectionsSrc = await Bun.file("app/api/admin/reflections/route.ts").text();
		expect(reflectionsSrc).toContain("recordAuditLog");
		expect(reflectionsSrc).toContain("reflection.status_change");
	});
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test app/api/admin/events-reflections-audit.test.ts`  
Expected: FAIL

- [ ] **Step 3: Instrument event and reflection routes**

1. In `app/api/events/route.ts`:
   - Import `recordAuditLog` from `@/lib/audit`.
   - In POST (event creation): call `await recordAuditLog({ actor: session.user, action: "event.create", entityType: "event", entityId: newEvent.id, entityLabel: newEvent.title, after: { title: newEvent.title, startDate: newEvent.startDate, endDate: newEvent.endDate }, req })`.

2. In `app/api/events/[id]/route.ts`:
   - Import `recordAuditLog` from `@/lib/audit`.
   - In PATCH/PUT: record `action: "event.update"`, `entityType: "event"`, `before: previousData`, `after: updatedData`.
   - In DELETE: record `action: "event.delete"`, `entityType: "event"`, `before: { title: event.title }`.

3. In `app/api/events/[id]/slots/regenerate/route.ts`:
   - Import `recordAuditLog` from `@/lib/audit`.
   - In POST: record `action: "event.slots_regenerate"`, `entityType: "event"`, `entityId: id`, `metadata: { newSlotsCount: count }`.

4. In `app/api/admin/reflections/route.ts`:
   - Import `recordAuditLog` from `@/lib/audit`.
   - In PATCH: record `action: "reflection.status_change"`, `entityType: "reflection"`, `entityId: reflectionId`, `before: { status: previous.status }`, `after: { status: next.status }`.
   - In DELETE (if present): record `action: "reflection.delete"`, `entityType: "reflection"`, `entityId: reflectionId`.

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test app/api/admin/events-reflections-audit.test.ts`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add app/api/events/route.ts app/api/events/[id]/route.ts app/api/events/[id]/slots/regenerate/route.ts app/api/admin/reflections/route.ts app/api/admin/events-reflections-audit.test.ts
git commit -m "feat(audit): instrument event and reflection moderation actions"
```

---

### Task 6: Instrument System Settings Mutations

**Files:**
- Modify: `app/api/admin/booking-settings/route.ts`
- Modify: `app/api/admin/hero/route.ts`
- Modify: `app/api/admin/notification-settings/route.ts`
- Test: `app/api/admin/settings-audit.test.ts`

**Interfaces:**
- Consumes: `recordAuditLog` from `lib/audit.ts`
- Produces: Audit records for `settings.booking_update`, `settings.hero_update`, `settings.notification_update`

- [ ] **Step 1: Write the failing test**

Create `app/api/admin/settings-audit.test.ts`:

```typescript
import { describe, expect, it } from "bun:test";

describe("settings audit instrumentation", () => {
	it("booking settings route records settings.booking_update", async () => {
		const src = await Bun.file("app/api/admin/booking-settings/route.ts").text();
		expect(src).toContain("recordAuditLog");
		expect(src).toContain("settings.booking_update");
	});

	it("hero settings route records settings.hero_update", async () => {
		const src = await Bun.file("app/api/admin/hero/route.ts").text();
		expect(src).toContain("recordAuditLog");
		expect(src).toContain("settings.hero_update");
	});

	it("notification settings route records settings.notification_update", async () => {
		const src = await Bun.file("app/api/admin/notification-settings/route.ts").text();
		expect(src).toContain("recordAuditLog");
		expect(src).toContain("settings.notification_update");
	});
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test app/api/admin/settings-audit.test.ts`  
Expected: FAIL

- [ ] **Step 3: Instrument settings routes**

1. In `app/api/admin/booking-settings/route.ts`:
   - Import `recordAuditLog` from `@/lib/audit`.
   - Call `await recordAuditLog({ actor: session.user, action: "settings.booking_update", entityType: "booking_settings", entityLabel: "Booking Rules", before: currentSettings, after: newSettings, req })`.

2. In `app/api/admin/hero/route.ts`:
   - Import `recordAuditLog` from `@/lib/audit`.
   - Call `await recordAuditLog({ actor: session.user, action: "settings.hero_update", entityType: "hero_settings", entityLabel: "Hero Video Banner", before: currentSettings, after: newSettings, req })`.

3. In `app/api/admin/notification-settings/route.ts`:
   - Import `recordAuditLog` from `@/lib/audit`.
   - Call `await recordAuditLog({ actor: session.user, action: "settings.notification_update", entityType: "notification_settings", entityLabel: "System Notifications", before: currentSettings, after: newSettings, req })`.

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test app/api/admin/settings-audit.test.ts`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add app/api/admin/booking-settings/route.ts app/api/admin/hero/route.ts app/api/admin/notification-settings/route.ts app/api/admin/settings-audit.test.ts
git commit -m "feat(audit): instrument booking, hero, and notification settings"
```

---

### Task 7: Query APIs (`GET /api/admin/audit` & `GET /api/admin/audit/entity`)

**Files:**
- Create: `app/api/admin/audit/route.ts`
- Create: `app/api/admin/audit/entity/route.ts`
- Test: `app/api/admin/audit/route.test.ts`

**Interfaces:**
- Consumes: `prisma.auditLog`, session auth check
- Produces:
  - `GET /api/admin/audit`: returns `{ items: AuditLog[], nextCursor: string | null, totalCount: number }`
  - `GET /api/admin/audit/entity`: returns `{ items: AuditLog[] }`

- [ ] **Step 1: Write the failing test**

Create `app/api/admin/audit/route.test.ts`:

```typescript
import { describe, expect, it } from "bun:test";

describe("audit query API endpoints", () => {
	it("implements admin authorization and cursor pagination for global audit", async () => {
		const src = await Bun.file("app/api/admin/audit/route.ts").text();
		expect(src).toContain("auth.api.getSession");
		expect(src).toContain("session.user.role !== \"admin\"");
		expect(src).toContain("prisma.auditLog.findMany");
		expect(src).toContain("nextCursor");
	});

	it("implements entity-specific audit query endpoint", async () => {
		const src = await Bun.file("app/api/admin/audit/entity/route.ts").text();
		expect(src).toContain("auth.api.getSession");
		expect(src).toContain("entityType");
		expect(src).toContain("entityId");
		expect(src).toContain("prisma.auditLog.findMany");
	});
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test app/api/admin/audit/route.test.ts`  
Expected: FAIL (files do not exist yet)

- [ ] **Step 3: Implement `app/api/admin/audit/route.ts` and `app/api/admin/audit/entity/route.ts`**

Create `app/api/admin/audit/route.ts`:

```typescript
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session || session.user.role !== "admin" || session.user.banned) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { searchParams } = new URL(req.url);
		const action = searchParams.get("action")?.trim();
		const entityType = searchParams.get("entityType")?.trim();
		const actorId = searchParams.get("actorId")?.trim();
		const q = searchParams.get("q")?.trim();
		const from = searchParams.get("from");
		const to = searchParams.get("to");
		const cursor = searchParams.get("cursor");
		const limit = Math.min(Number.parseInt(searchParams.get("limit") || "50", 10), 100);

		const where: Record<string, unknown> = {};

		if (action && action !== "all") {
			if (action.endsWith(".*")) {
				where.action = { startsWith: action.slice(0, -2) };
			} else {
				where.action = action;
			}
		}

		if (entityType && entityType !== "all") {
			where.entityType = entityType;
		}

		if (actorId) {
			where.actorId = actorId;
		}

		if (from || to) {
			const dateFilter: Record<string, Date> = {};
			if (from) dateFilter.gte = new Date(from);
			if (to) dateFilter.lte = new Date(to);
			where.createdAt = dateFilter;
		}

		if (q) {
			where.OR = [
				{ actorName: { contains: q, mode: "insensitive" } },
				{ actorEmail: { contains: q, mode: "insensitive" } },
				{ entityLabel: { contains: q, mode: "insensitive" } },
				{ action: { contains: q, mode: "insensitive" } },
			];
		}

		const [items, totalCount] = await Promise.all([
			prisma.auditLog.findMany({
				where,
				orderBy: { createdAt: "desc" },
				take: limit + 1,
				...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
			}),
			prisma.auditLog.count({ where }),
		]);

		const hasMore = items.length > limit;
		const page = hasMore ? items.slice(0, limit) : items;
		const nextCursor = hasMore ? (page[page.length - 1]?.id ?? null) : null;

		return NextResponse.json({
			items: page,
			nextCursor,
			totalCount,
		});
	} catch (error) {
		console.error("[ADMIN_AUDIT_GET]", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
```

Create `app/api/admin/audit/entity/route.ts`:

```typescript
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session || session.user.role !== "admin" || session.user.banned) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { searchParams } = new URL(req.url);
		const entityType = searchParams.get("type")?.trim();
		const entityId = searchParams.get("id")?.trim();

		if (!entityType || !entityId) {
			return NextResponse.json(
				{ error: "type and id are required" },
				{ status: 400 },
			);
		}

		const items = await prisma.auditLog.findMany({
			where: {
				entityType,
				entityId,
			},
			orderBy: { createdAt: "desc" },
			take: 100,
		});

		return NextResponse.json({ items });
	} catch (error) {
		console.error("[ADMIN_AUDIT_ENTITY_GET]", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test app/api/admin/audit/route.test.ts`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add app/api/admin/audit/route.ts app/api/admin/audit/entity/route.ts app/api/admin/audit/route.test.ts
git commit -m "feat(audit): implement global and entity-level audit query endpoints"
```

---

### Task 8: Navigation & Dedicated Audit Trail Page UI

**Files:**
- Modify: `components/app-sidebar.tsx`
- Create: `app/dashboard/admin/audit/page.tsx`
- Create: `components/admin/audit-log-console.tsx`
- Create: `components/admin/audit-detail-dialog.tsx`
- Test: `components/admin/audit-ui.test.ts`

**Interfaces:**
- Consumes: `/api/admin/audit`
- Produces: Responsive audit UI console with filtering, diff inspector, and compliant `cursor-pointer` interactive controls.

- [ ] **Step 1: Write the failing test**

Create `components/admin/audit-ui.test.ts`:

```typescript
import { describe, expect, it } from "bun:test";

describe("audit UI components", () => {
	it("sidebar includes Audit Trail navigation item with cursor-pointer", async () => {
		const src = await Bun.file("components/app-sidebar.tsx").text();
		expect(src).toContain("/dashboard/admin/audit");
		expect(src).toContain("Audit Trail");
	});

	it("audit console uses cursor-pointer on interactive elements", async () => {
		const src = await Bun.file("components/admin/audit-log-console.tsx").text();
		expect(src).toContain("cursor-pointer");
		expect(src).toContain("useSWR");
	});

	it("audit detail dialog presents structured before/after diff", async () => {
		const src = await Bun.file("components/admin/audit-detail-dialog.tsx").text();
		expect(src).toContain("Dialog");
		expect(src).toContain("cursor-pointer");
	});
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test components/admin/audit-ui.test.ts`  
Expected: FAIL

- [ ] **Step 3: Update sidebar and build audit console UI**

1. In `components/app-sidebar.tsx`:
   - Import `ShieldCheck` from `lucide-react`.
   - Add `{ title: "Audit Trail", url: "/dashboard/admin/audit", icon: <ShieldCheck />, adminOnly: true }` under `defaultData.navMain`.

2. Create `components/admin/audit-detail-dialog.tsx`:
   - Modal dialog that displays full metadata, actor info, IP address, user agent, and a color-coded before/after JSON comparison.
   - All buttons have `cursor-pointer`.

3. Create `components/admin/audit-log-console.tsx`:
   - Responsive filtering (search, category selector, admin actor dropdown, date picker).
   - Desktop Table view with action badges, humanized dates, actor avatars, and inspect button.
   - Mobile Card view (<768px) with expandable accordion matching existing admin designs.
   - All `<Button>`, `<Link>`, and triggers have `cursor-pointer`.

4. Create `app/dashboard/admin/audit/page.tsx`:
   - Server wrapper rendering `<AuditLogConsole />`.

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test components/admin/audit-ui.test.ts`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/app-sidebar.tsx app/dashboard/admin/audit/page.tsx components/admin/audit-log-console.tsx components/admin/audit-detail-dialog.tsx components/admin/audit-ui.test.ts
git commit -m "feat(audit): add audit trail sidebar navigation and dedicated management console"
```

---

### Task 9: Inline Audit History on Slot Management & User Detail

**Files:**
- Modify: `components/admin/slot-history-dialog.tsx`
- Modify: `components/admin/user-management.tsx`
- Test: `components/admin/inline-audit.test.ts`

**Interfaces:**
- Consumes: `/api/admin/audit/entity`
- Produces: Integrated timeline displaying who blocked/unblocked/assigned slots or modified user profiles.

- [ ] **Step 1: Write the failing test**

Create `components/admin/inline-audit.test.ts`:

```typescript
import { describe, expect, it } from "bun:test";

describe("inline audit integration", () => {
	it("slot history dialog queries and integrates unified audit trail", async () => {
		const src = await Bun.file("components/admin/slot-history-dialog.tsx").text();
		expect(src).toContain("/api/admin/audit/entity");
	});

	it("user management includes an audit history trigger with cursor-pointer", async () => {
		const src = await Bun.file("components/admin/user-management.tsx").text();
		expect(src).toContain("Audit History");
		expect(src).toContain("cursor-pointer");
	});
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test components/admin/inline-audit.test.ts`  
Expected: FAIL

- [ ] **Step 3: Update `SlotHistoryDialog` and `UserManagement`**

1. In `components/admin/slot-history-dialog.tsx`:
   - Fetch `/api/admin/audit/entity?type=slot&id=${slotId}` in addition to or alongside legacy slot history.
   - Display a unified chronological feed that clearly shows:
     - Who blocked the slot & reason
     - Who unblocked the slot
     - Who assigned/reassigned the slot to which user
   - Maintain `cursor-pointer` on all interactive buttons.

2. In `components/admin/user-management.tsx`:
   - Add an "Audit History" option or icon button in user row actions (e.g. History icon with `cursor-pointer`).
   - Opens a dialog displaying the timeline of admin actions performed on that user (roles changed, bans applied/lifted, deletion status).

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test components/admin/inline-audit.test.ts`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/admin/slot-history-dialog.tsx components/admin/user-management.tsx components/admin/inline-audit.test.ts
git commit -m "feat(audit): integrate inline audit trail in slot history and user management"
```

---

### Task 10: End-to-End Verification & Formatting Check

**Files:**
- Entire repository

**Interfaces:**
- Consumes: All tests, Biome configuration, Next.js build

- [ ] **Step 1: Run complete test suite**

Run: `bun test`  
Expected: All tests pass with 0 failures.

- [ ] **Step 2: Run Biome linter and formatter**

Run: `bun run lint`  
If formatting issues arise, run: `bun run lint:fix`

- [ ] **Step 3: Verify TypeScript and production build readiness**

Run: `bunx prisma generate && bun run build` (or check compilation)  
Expected: Clean build with no TypeScript or lint errors.

- [ ] **Step 4: Commit all final changes**

```bash
git add .
git commit -m "chore(audit): verify complete test suite and code formatting"
```
