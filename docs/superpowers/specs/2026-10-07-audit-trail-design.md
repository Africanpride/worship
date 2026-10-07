# Unified Admin Audit Trail System — Design Specification

**Date:** 2026-10-07  
**Status:** In Review  
**Scope:** Admin Actions Audit Trail (Prisma model, audit helper, mutation instrumentation, query APIs, dedicated audit page, and inline audit history)

---

## 1. Executive Summary & Problem Statement

Currently, administrative actions (such as blocking/unblocking booking slots, assigning or reassigning slots to users, modifying user roles or banning accounts, updating events, moderating reflections, and modifying critical system settings) are recorded in fragmented ways or not at all.
While `SlotBookingHistory` records narrow user reassignments and `AppLog` stores unstructured debug logs (which expire via TTL), there is no unified, tamper-evident, queryable audit trail answering the fundamental questions:
- **Who** did it? (Admin identity, denormalized at the moment of the action)
- **What** changed? (Action verb, before/after state snapshots)
- **When** and **From where**? (Timestamp, client IP, user agent)
- **To which entity**? (Target slot, user, event, reflection, or settings object)

This design introduces a first-class `AuditLog` collection, a centralized non-blocking audit helper, comprehensive instrumentation of all admin mutation routes, a dedicated audit management interface at `/dashboard/admin/audit`, and inline audit history views on existing entity detail views.

---

## 2. Requirements & Key Decisions

Based on user requirements and architectural decisions:

1. **Target Scope:** Admin mutations only.
   - Slot operations: block, unblock, assign, reassign, clear, batch operations.
   - User operations: role change, ban, unban, delete.
   - Event operations: create, update, delete, slot regeneration.
   - Reflection moderation: approve, reject, feature/unfeature, delete.
   - System settings: booking settings, hero settings, notification settings.
2. **Dedicated vs. Reused Model:** Dedicated `AuditLog` Prisma model in MongoDB.
   - Unlike `AppLog`, `AuditLog` records have permanent retention (no TTL expiration).
   - Unlike `SlotBookingHistory`, `AuditLog` spans all system entities and holds structured `before`/`after` snapshots.
3. **Actor Data Integrity:** Denormalized actor snapshot (`actorId`, `actorEmail`, `actorName`, `actorRole`). If an admin changes their name or is later deleted, the audit entry preserves the exact identity of who executed the action.
4. **Resilience & Reliability:** Logging must **never fail the primary user transaction**. The audit helper runs with robust error suppression (try-catch, background logging) so database issues with logging cannot cause a successful admin mutation to return a 500 error.
5. **UI Locations:**
   - **Dedicated page:** `/dashboard/admin/audit` with filtering by action, entity type, actor, date range, search query, and pagination.
   - **Inline history:** Accessible directly within existing management workflows (e.g., slot history dialog, user detail views).
6. **Project Rule Compliance:**
   - Package manager: `bun`.
   - Cursor styling: All interactive elements (`<Button>`, `<Link>`, clickable `<div>` or `<a>`) must include `cursor-pointer`.

---

## 3. Data Architecture: `AuditLog` Prisma Model

Add the `AuditLog` model to `prisma/schema.prisma`:

```prisma
model AuditLog {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  
  // Actor info (denormalized at capture time)
  actorId     String   @db.ObjectId
  actorEmail  String
  actorName   String
  actorRole   String   @default("admin")
  
  // Action descriptor
  action      String   // e.g. "slot.block", "slot.assign", "user.ban", "event.update", "settings.booking_update"
  
  // Target Entity
  entityType  String   // e.g. "slot", "user", "event", "reflection", "booking_settings", "hero_settings", "notification_settings"
  entityId    String?  // Target MongoDB ObjectId or singleton identifier
  entityLabel String?  // Human-readable summary (e.g. "Oct 12 10:00 AM (Worship)", "john@example.com")
  
  // State snapshots
  before      Json?    // Snapshot of mutated fields or state prior to change
  after       Json?    // Snapshot of mutated fields or state after change
  metadata    Json?    // Contextual information (e.g. reason, batch count, affected count)
  
  // Client metadata
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

### Action Naming Convention
Actions follow a standard hierarchical dot-notation:
- `slot.block`, `slot.unblock`, `slot.assign`, `slot.reassign`, `slot.clear`, `slot.batch_action`
- `user.role_change`, `user.ban`, `user.unban`, `user.delete`
- `event.create`, `event.update`, `event.delete`, `event.slots_regenerate`
- `reflection.approve`, `reflection.reject`, `reflection.feature`, `reflection.delete`
- `settings.booking_update`, `settings.hero_update`, `settings.notification_update`

---

## 4. Centralized Audit Service: `lib/audit.ts`

### Interface Definition

```typescript
export interface AuditActor {
  id: string;
  email: string;
  name: string;
  role?: string;
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
```

### Core Helper Implementation
`recordAuditLog(params: AuditParams): Promise<AuditLog | null>`
- Extracts client IP (`x-forwarded-for`, `x-real-ip`) and User-Agent if `req` or `headers` is passed.
- Executes `prisma.auditLog.create(...)`.
- Wraps execution in `try ... catch` and logs to `console.error` / `log("error", ...)` without throwing, guaranteeing zero impact on parent caller.
- Exports a synchronous/background friendly wrapper: `recordAuditLogAsync(...)` which does not require awaiting.

---

## 5. API Route Instrumentation Plan

| Route | Method | Action | Entity | Before / After Captured |
|---|---|---|---|---|
| `app/api/admin/slots/[slotId]/assign/route.ts` | POST | `slot.assign` / `slot.reassign` / `slot.clear` | `slot` | Previous assigned user vs. new assigned user, reason |
| `app/api/admin/slots/[slotId]/block/route.ts` | POST | `slot.block` / `slot.unblock` | `slot` | Status (`open` vs. `blocked`), blockedByAdminId |
| `app/api/admin/slots/batch/route.ts` | POST | `slot.batch_action` | `slot` | Slot IDs list, target action, count |
| `app/api/admin/users/route.ts` | PATCH / DELETE | `user.role_change`, `user.ban`, `user.unban`, `user.delete` | `user` | Role diff, ban status/reason, user deletion metadata |
| `app/api/events/route.ts` | POST | `event.create` | `event` | Initial event title, dates, settings |
| `app/api/events/[id]/route.ts` | PATCH / DELETE | `event.update`, `event.delete` | `event` | Changed fields (dates, title, active flags) |
| `app/api/events/[id]/slots/regenerate/route.ts` | POST | `event.slots_regenerate` | `event` | Regeneration params, slot count |
| `app/api/admin/reflections/route.ts` | PATCH / DELETE | `reflection.status_change` / `delete` | `reflection` | Status before/after (`pending` -> `approved`), featured flag |
| `app/api/admin/booking-settings/route.ts` | PUT / PATCH | `settings.booking_update` | `booking_settings` | Allow multiple, max slots, visibility |
| `app/api/admin/hero/route.ts` | PUT / PATCH | `settings.hero_update` | `hero_settings` | Video source, video ID/URL, start time |
| `app/api/admin/notification-settings/route.ts` | PUT / PATCH | `settings.notification_update` | `notification_settings` | Email/push/whatsapp toggles, reminder offsets |

---

## 6. Audit Trail Query APIs

### 1. Global Audit Log Endpoint: `GET /api/admin/audit`
- **Authentication:** Admin session check required.
- **Query Parameters:**
  - `action`: Filter by exact action or wildcard prefix (e.g. `slot.*`, `user.*`)
  - `entityType`: Filter by entity type (`slot`, `user`, etc.)
  - `entityId`: Optional specific entity filter
  - `actorId`: Filter by admin user ID
  - `q`: Search query matching `actorName`, `actorEmail`, `entityLabel`, `action`
  - `from`: ISO start date
  - `to`: ISO end date
  - `cursor`: Next page cursor (MongoDB `_id`)
  - `limit`: Default 50, max 100
- **Response Format:**
  ```json
  {
    "items": [
      {
        "id": "...",
        "actorId": "...",
        "actorName": "Admin User",
        "actorEmail": "admin@example.com",
        "action": "slot.block",
        "entityType": "slot",
        "entityId": "...",
        "entityLabel": "Sunday 9:00 AM - Worship",
        "before": { "status": "open" },
        "after": { "status": "blocked" },
        "metadata": { "reason": "Equipment maintenance" },
        "ipAddress": "192.168.1.1",
        "createdAt": "2026-10-07T10:00:00.000Z"
      }
    ],
    "nextCursor": "...",
    "totalCount": 128
  }
  ```

### 2. Entity Inline Audit History Endpoint: `GET /api/admin/audit/entity`
- **Query Parameters:** `?type=slot&id=<slotId>` or `?type=user&id=<userId>`
- Lightweight endpoint returning the chronological timeline of audit entries specifically for that entity.
- Enhances existing `app/api/admin/slots/[slotId]/history` without breaking backwards compatibility.

---

## 7. Frontend User Interface Architecture

### 1. Navigation Sidebar (`components/app-sidebar.tsx`)
Add the "Audit Trail" link to `defaultData.navMain`:
```tsx
{
  title: "Audit Trail",
  url: "/dashboard/admin/audit",
  icon: <ShieldCheck />, // from lucide-react
  adminOnly: true,
}
```

### 2. Dedicated Audit Page (`/dashboard/admin/audit/page.tsx`)
- Uses `"use client"` or server wrapper with hydration.
- Renders `components/admin/audit-log-console.tsx`:
  - **Header & Stats:** Quick overview metrics (Total logs, Actions today, Active admins).
  - **Filter Bar:**
    - Search input (`Search` icon) for text search.
    - Action category selector (`All Actions`, `Slots`, `Users`, `Events`, `Reflections`, `Settings`).
    - Admin actor filter dropdown.
    - Date range filter.
    - Refresh & Export buttons.
  - **Audit Table (Desktop):**
    - Columns: Timestamp, Admin Actor, Action Badge, Target Entity, Summary/Diff, Inspector Trigger.
  - **Audit Cards (Mobile < 768px):**
    - Follows project collapsible mobile pattern: actor + badge + entity in trigger; before/after diff + IP in collapsible body.
  - **Log Inspector Modal / Sheet:**
    - Detailed view of an individual audit entry showing full JSON diff viewer (colorized Before vs. After).
  - **Mandatory Styling Rule:** All interactive elements (`<Button>`, `<Link>`, tabs, dialog triggers) use `cursor-pointer`.

### 3. Inline Audit Views
- **Slot History Modal (`components/admin/slot-history-dialog.tsx`):**
  - Updated to display unified audit events (blocks, unblocks, assignments, manual clears) with actor name and timestamps.
- **User Management (`components/admin/user-management.tsx`):**
  - Adds an "Audit History" tab or drawer option to view admin actions performed on any specific user (e.g. bans, role updates).

---

## 8. Verification & Quality Assurance Strategy

1. **Prisma Schema Generation:**
   - Execute `bun run prisma generate` and verify client bindings.
2. **Automated Unit & Integration Tests:**
   - Test `recordAuditLog`: verify non-blocking safety, handling missing actor fields, correct JSON serialization.
   - Test `GET /api/admin/audit`: test authorization (401 for non-admin), filtering by `action`, `actorId`, `dateRange`, and pagination.
   - Run `bun test`.
3. **Linting & Code Formatting:**
   - Run `bun run check` / `bun run lint` to enforce Biome standards.
4. **Interactive Verification:**
   - Verify that slot blocking/assignment in the UI generates audit entries.
   - Verify the audit log console displays records and inspects JSON diffs.
