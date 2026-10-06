# Mobile Card Lists for Admin Tables — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the event/user/video management tables mobile-safe collapsible card lists below `md` (768px) while keeping the existing tables for `md+`.

**Architecture:** One new generic primitive `CollapsibleCard` (extracted shell of the `collapsible-04` reference block: trigger + rotating chevron + AnimatePresence height animation) plus three per-table integrations that dual-render: table `hidden md:block`, card list `md:hidden`. Shared per-file helpers (`posterThumb`, `statusPill`, `eventActions`, `roleSelect`, `userButtons`, `typePill`, `videoActions`, …) keep table-cell and card-body JSX single-sourced.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript strict, Tailwind CSS v4, shadcn/ui primitives, `motion/react` (framer-motion v12), Biome, Bun, Playwright CLI.

**Spec:** `docs/superpowers/specs/2026-10-06-mobile-card-lists-design.md`

## Global Constraints

- **Package manager:** `bun` / `bunx` only (never npm/pnpm/npx).
- **Git safety:** the working tree contains ~9 unrelated modified files from the user's parallel work. NEVER `git add -A` / `git add .` — stage only the exact file paths listed in each task's commit step.
- **Dual render:** table wrapper gets `hidden md:block`; card list gets `md:hidden`. Breakpoint is always `md` (768px), matching existing `hidden md:table-cell` columns.
- **`collapsible-04.tsx` must remain byte-identical** — it is the reference demo (it gets committed, never edited).
- **Cursor convention:** every interactive element (`Button`, `Switch`, `SelectTrigger`, links) carries `cursor-pointer`.
- **Verification per task:** `bunx tsc --noEmit` → exit 0; `bunx biome check --write <changed files>` → clean on re-check; Playwright smoke where a task step says so. No unit-test harness exists for these components (per spec §Verification) — do not add one.
- **Dev server:** must be up on `http://localhost:3000`. If not: `bun run dev > /tmp/opencode/next-dev.log 2>&1 & sleep 5`.
- **Auth for admin routes:** cookie value in `.superpowers/sdd/session-cookie.txt`; apply with `playwright-cli cookie-set "better-auth.session_token" "$(cat .superpowers/sdd/session-cookie.txt)"` when a goto lands on the login page.
- **Screenshots** go to `.playwright-cli/mobile-cards/` (gitignored via `.playwright-cli/`).
- **Commits:** conventional format, one per task, exactly the files listed.
- **Tailwind rule:** CSS-variable references use `(--var)` / `var(--x)` syntax, never `[--var]` (not expected in this work, but binding).

## File Structure

| File | Responsibility | Task |
|---|---|---|
| `components/shadcn-space/collapsible/collapsible-04.tsx` | Reference demo block (created earlier, uncommitted) — commit only | 1 |
| `components/shadcn-space/collapsible/collapsible-card.tsx` | **Create.** Generic collapsible card shell (`CollapsibleCard`) | 1 |
| `components/admin/event-management.tsx` | Extract helpers, gate table `md+`, add event card list, header wrap | 2 |
| `components/admin/user-management.tsx` | Extract helpers, gate table `md+`, add user card list, header wrap | 3 |
| `components/admin/video-management.tsx` | Extract helpers, gate table `md+`, add video card list, header wrap | 4 |
| — (no code) | Full verification matrix: 360px overflow + expand + 1280px dual-render | 5 |

---

### Task 1: `CollapsibleCard` primitive + commit reference block

**Files:**
- Create: `components/shadcn-space/collapsible/collapsible-card.tsx`
- Commit (do not modify): `components/shadcn-space/collapsible/collapsible-04.tsx`

**Interfaces:**
- Consumes: `Collapsible`, `CollapsibleTrigger` from `@/components/ui/collapsible`; `Separator` from `@/components/ui/separator`; `cn` from `@/lib/utils`; `motion/react`.
- Produces (relied on by Tasks 2–4):
  - `export function CollapsibleCard(props: CollapsibleCardProps): JSX.Element`
  - `export type CollapsibleCardProps = { trigger: ReactNode; children: ReactNode; defaultOpen?: boolean; className?: string }`
  - Render contract: outer `div.w-full.rounded-xl.border.bg-card.shadow-sm`; `trigger` renders inside the always-visible header (left of a rotating chevron, in a `flex min-w-0 flex-1 flex-col gap-1` box — so `trigger` can be a fragment of stacked blocks); `children` renders only while open, below a `Separator`, inside `div.flex.flex-col.gap-3.px-4.py-3`.

- [ ] **Step 1: Create the primitive**

Create `components/shadcn-space/collapsible/collapsible-card.tsx` with exactly:

```tsx
"use client";

import { ChevronRightIcon } from "lucide-react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { useState, type ReactNode } from "react";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const containerVariants: Variants = {
	hidden: { height: 0, opacity: 0 },
	visible: {
		height: "auto",
		opacity: 1,
		transition: {
			duration: 0.3,
			ease: [0.04, 0.62, 0.23, 0.98],
			staggerChildren: 0.07,
			delayChildren: 0.1,
		},
	},
	exit: {
		height: 0,
		opacity: 0,
		transition: { duration: 0.25, ease: "easeInOut" },
	},
};

const itemVariants: Variants = {
	hidden: { opacity: 0, y: -6 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.22, ease: "easeOut" },
	},
	exit: { opacity: 0, y: -4, transition: { duration: 0.15 } },
};

export type CollapsibleCardProps = {
	trigger: ReactNode;
	children: ReactNode;
	defaultOpen?: boolean;
	className?: string;
};

export function CollapsibleCard({
	trigger,
	children,
	defaultOpen = false,
	className,
}: CollapsibleCardProps) {
	const [open, setOpen] = useState(defaultOpen);

	return (
		<div
			className={cn("w-full rounded-xl border bg-card shadow-sm", className)}
		>
			<Collapsible open={open} onOpenChange={setOpen}>
				<CollapsibleTrigger className="flex w-full cursor-pointer items-center gap-2 px-4 py-3 text-left">
					<div className="flex min-w-0 flex-1 flex-col gap-1">{trigger}</div>
					<motion.span
						animate={{ rotate: open ? 90 : 0 }}
						transition={{ duration: 0.25, ease: "easeInOut" }}
						className="inline-flex shrink-0"
					>
						<ChevronRightIcon
							aria-hidden="true"
							className="text-muted-foreground size-4"
						/>
					</motion.span>
				</CollapsibleTrigger>

				<AnimatePresence initial={false}>
					{open && (
						<motion.div
							key="collapsible-card-content"
							variants={containerVariants}
							initial="hidden"
							animate="visible"
							exit="exit"
							style={{ overflow: "hidden" }}
						>
							<motion.div variants={itemVariants}>
								<Separator />
							</motion.div>
							<div className="flex flex-col gap-3 px-4 py-3">
								{children}
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</Collapsible>
		</div>
	);
}
```

- [ ] **Step 2: Typecheck**

Run: `bunx tsc --noEmit`
Expected: exit 0, no output.

- [ ] **Step 3: Lint/format the new files**

Run: `bunx biome check --write components/shadcn-space/collapsible/collapsible-card.tsx components/shadcn-space/collapsible/collapsible-04.tsx`
Expected: `Fixed N file(s)` or `No fixes applied`.
Then run: `bunx biome check components/shadcn-space/collapsible/collapsible-card.tsx components/shadcn-space/collapsible/collapsible-04.tsx`
Expected: `Checked 2 files` … no errors/warnings.

- [ ] **Step 4: Confirm the reference demo still matches**

Run: `git diff --stat components/shadcn-space/collapsible/collapsible-04.tsx`
Expected: empty (file is untracked/unchanged — it must NOT be edited in this task beyond a `biome --write` no-op).

- [ ] **Step 5: Commit**

```bash
git add components/shadcn-space/collapsible/collapsible-04.tsx components/shadcn-space/collapsible/collapsible-card.tsx
git commit -m "feat: add collapsible-04 reference block and CollapsibleCard primitive"
```
Expected: one commit, exactly 2 files.

---

### Task 2: Event Management — dual render

**Files:**
- Modify: `components/admin/event-management.tsx`
  - imports (after line ~22 `TypeToDeleteDialog` import)
  - component body: insert helpers before `return (` (line ~264)
  - header div (line 266)
  - table cells (lines 606–710) → helper calls
  - table wrapper (line 573) → `hidden md:block`
  - card list → new block immediately after the table wrapper's closing `</div>` (line 716)

**Interfaces:**
- Consumes: `CollapsibleCard` from Task 1.
- Produces (internal only, but exact names for reviewer): `posterThumb(event: Event)`, `statusPill(event: Event)`, `ministerStack(event: Event, align?: "center" | "start")`, `bookingSwitch(event: Event)`, `eventActions(event: Event)`.
- Existing symbols reused: `Event` interface (line 92), `handleEdit(event)`, `requestDelete(event)`, `toggleBookingOpen(event, next)`, `togglingBookings`, `loading`, `events`, `format` (date-fns), icons `Calendar`/`Edit`/`Trash2`/`User`/`Loader2`, `Switch`, `Image`.

- [ ] **Step 1: Add the import**

In `components/admin/event-management.tsx`, add with the other `@/components` imports (biome will sort it):

```tsx
import { CollapsibleCard } from "@/components/shadcn-space/collapsible/collapsible-card";
```

- [ ] **Step 2: Insert the shared helpers**

Immediately before the `return (` of `EventManagement` (i.e., after `handleEdit` ends at line 262), insert:

```tsx
	const posterThumb = (event: Event) =>
		event.poster ? (
			<div className="relative h-10 w-10 shrink-0 overflow-hidden rounded">
				<Image
					src={event.poster}
					alt={event.title}
					fill
					sizes="40px"
					className="object-cover"
				/>
			</div>
		) : (
			<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-muted">
				<Calendar className="h-5 w-5 text-muted-foreground" />
			</div>
		);

	const statusPill = (event: Event) => (
		<span
			className={`ml-auto shrink-0 px-2 py-1 rounded-full text-xs font-medium ${
				event.status === "published"
					? "bg-green-500/10 text-green-500"
					: event.status === "draft"
						? "bg-yellow-500/10 text-yellow-500"
						: "bg-red-500/10 text-red-500"
			}`}
		>
			{event.status.charAt(0).toUpperCase() + event.status.slice(1)}
		</span>
	);

	const ministerStack = (event: Event, align: "center" | "start" = "center") => (
		<div
			className={`flex -space-x-2 ${
				align === "start" ? "justify-start" : "justify-center"
			}`}
		>
			{event.ministers.slice(0, 3).map((m, i) => (
				<div
					key={i}
					className="h-8 w-8 rounded-full border-2 border-background overflow-hidden bg-muted"
					title={m.name}
				>
					{m.image ? (
						<div className="relative h-full w-full">
							<Image
								src={m.image}
								alt={m.name}
								fill
								sizes="32px"
								className="object-cover"
							/>
						</div>
					) : (
						<User className="h-4 w-4 m-1.5 text-muted-foreground" />
					)}
				</div>
			))}
			{event.ministers.length > 3 && (
				<div className="h-8 w-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-medium">
					+{event.ministers.length - 3}
				</div>
			)}
		</div>
	);

	const bookingSwitch = (event: Event) => (
		<Switch
			checked={event.bookingOpen ?? false}
			onCheckedChange={(v) => toggleBookingOpen(event, v)}
			disabled={togglingBookings === event.id}
			className="cursor-pointer"
			aria-label={`Toggle bookings for ${event.title}`}
		/>
	);

	const eventActions = (event: Event) => (
		<div className="flex flex-wrap justify-end gap-2">
			<Button
				variant="ghost"
				size="icon"
				onClick={() => handleEdit(event)}
			>
				<Edit className="h-4 w-4" />
			</Button>
			<Button
				variant="ghost"
				size="icon"
				className="text-destructive hover:text-destructive cursor-pointer"
				onClick={() => requestDelete(event)}
			>
				<Trash2 className="h-4 w-4" />
			</Button>
		</div>
	);
```

> **Note:** the `align` ternary (not template interpolation) is deliberate — Tailwind cannot generate classes from `justify-${align}` at build time.

- [ ] **Step 3: Point the table cells at the helpers**

Replace the six body-cell bodies inside `events.map((event) => (<TableRow key={event.id}>…</TableRow>))`:

1. Status cell (lines 606–619) becomes:
```tsx
									<TableCell>
										{statusPill(event)}
									</TableCell>
```
2. Event cell (lines 620–644) becomes:
```tsx
									<TableCell className="font-medium">
										<div className="flex items-center gap-3">
											{posterThumb(event)}
											<div>
												{event.title}
												<div className="text-xs text-muted-foreground font-normal">
													/{event.slug}
												</div>
											</div>
										</div>
									</TableCell>
```
3. Date cell: unchanged.
4. Bookings cell (lines 653–661) becomes:
```tsx
									<TableCell className="text-center">
										{bookingSwitch(event)}
									</TableCell>
```
5. Ministers cell (lines 662–691) becomes:
```tsx
									<TableCell className="hidden md:table-cell">
										{ministerStack(event)}
									</TableCell>
```
6. Actions cell (lines 692–710) becomes:
```tsx
									<TableCell className="text-right text-muted-foreground">
										{eventActions(event)}
									</TableCell>
```

- [ ] **Step 4: Gate the table for `md+`**

Change line 573:

```tsx
			<div className="hidden md:block rounded-md border bg-card/50 backdrop-blur-sm">
```

- [ ] **Step 5: Insert the mobile card list**

Immediately after that wrapper's closing `</div>` (the one that currently closes at line 716, right after `</Table>`), insert:

```tsx
			<div className="md:hidden space-y-3">
				{loading ? (
					<div className="flex h-24 items-center justify-center rounded-md border bg-card/50 backdrop-blur-sm">
						<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
					</div>
				) : events.length === 0 ? (
					<div className="flex h-24 items-center justify-center rounded-md border bg-card/50 backdrop-blur-sm text-sm text-muted-foreground">
						No events found. Create your first one!
					</div>
				) : (
					events.map((event) => (
						<CollapsibleCard
							key={event.id}
							trigger={
								<>
									<div className="flex min-w-0 items-center gap-3">
										{posterThumb(event)}
										<div className="min-w-0">
											<div className="truncate text-sm font-semibold">
												{event.title}
											</div>
											<div className="truncate text-xs font-normal text-muted-foreground">
												/{event.slug}
											</div>
										</div>
										{statusPill(event)}
									</div>
									<div className="text-xs text-muted-foreground">
										{format(new Date(event.startDate), "MMM d, yyyy")} ·{" "}
										{format(new Date(event.startDate), "HH:mm")}
									</div>
								</>
							}
						>
							<label className="flex items-center justify-between gap-2">
								<span className="text-sm text-muted-foreground">
									Bookings open
								</span>
								{bookingSwitch(event)}
							</label>
							<div>
								<div className="mb-1.5 text-xs text-muted-foreground">
									Ministers
								</div>
								{ministerStack(event, "start")}
							</div>
							{eventActions(event)}
						</CollapsibleCard>
					))
				)}
			</div>
```

- [ ] **Step 6: Header wraps at 360px**

Change line 266:

```tsx
			<div className="flex flex-wrap justify-between items-center gap-3 mb-8">
```

- [ ] **Step 7: Typecheck**

Run: `bunx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 8: Lint/format**

Run: `bunx biome check --write components/admin/event-management.tsx`
Expected: fixes applied (import order). Then:
Run: `bunx biome check components/admin/event-management.tsx`
Expected: no errors, no warnings.

- [ ] **Step 9: Playwright smoke @360px**

```bash
mkdir -p .playwright-cli/mobile-cards
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000   # expect 200; else start dev server
playwright-cli resize 360 800
playwright-cli goto "http://localhost:3000/dashboard/admin/events"
sleep 3
playwright-cli --raw eval "document.documentElement.scrollWidth"   # expect 360 (≤360)
playwright-cli --raw eval "document.querySelector('table')?.offsetParent === null"   # expect true (table hidden)
playwright-cli --raw eval "(() => { const c=[...document.querySelectorAll('div')].find(d=>d.className.includes('md:hidden')&&d.querySelector('button')); if(!c) return 'no cards'; c.querySelector('button').click(); return 'clicked'; })()"
sleep 1.5
playwright-cli --raw eval "document.body.innerText.includes('Ministers')"   # expect true
playwright-cli screenshot --filename="$PWD/.playwright-cli/mobile-cards/events-360-expanded.png"
```
Expected: `360`, `true`, `clicked`, `true`, screenshot written. If the page redirects to login, run the cookie-set command from Global Constraints and retry.

- [ ] **Step 10: Commit**

```bash
git add components/admin/event-management.tsx
git commit -m "feat(events): add mobile card list alongside event table"
```

---

### Task 3: User Management — dual render

**Files:**
- Modify: `components/admin/user-management.tsx`
  - imports (after line ~25 `alert-dialog` import)
  - helpers before `return (` (line 157)
  - header div (line 159)
  - table cells (lines 196–336) → helper calls
  - table wrapper (line 168) → `hidden md:block`
  - card list after the wrapper's closing `</div>` (line 341)

**Interfaces:**
- Consumes: `CollapsibleCard` from Task 1.
- Produces (internal): `userIdentity(user: User, showAreas: boolean)`, `statusRow(user: User)`, `roleSelect(user: User, selectClassName: string)`, `userButtons(user: User)`.
- Existing symbols reused: `User` interface (line 45), `getInitials`, `onRoleChange(userId, newRole)`, `onToggleBan(user)`, `onRevokeDeletion(userId)`, `onDeleteUser(userId)`, icons `Ban`/`Shield`/`ShieldAlert`/`Undo2`/`Trash2`/`Loader2`, `Avatar*`, `Badge`, `Select*`, `AlertDialog*`.

- [ ] **Step 1: Add the import**

```tsx
import { CollapsibleCard } from "@/components/shadcn-space/collapsible/collapsible-card";
```

- [ ] **Step 2: Insert the shared helpers**

Immediately before `return (` (after `getInitials` ends at line 155), insert:

```tsx
	const userIdentity = (user: User, showAreas: boolean) => (
		<div className="flex items-center gap-3">
			<Avatar className="h-9 w-9 border-2 border-background shadow-sm">
				<AvatarImage
					src={
						(user.profile?.avatarUrl as string) || user.image || ""
					}
					alt={user.name}
					className="object-cover"
				/>
				<AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
					{getInitials(user.name)}
				</AvatarFallback>
			</Avatar>
			<div>
				<div className="flex items-center gap-2">
					<span className="truncate max-w-[150px]">
						{user.name}
					</span>
					{user.role === "admin" && (
						<Shield className="h-3 w-3 text-primary shrink-0" />
					)}
					{user.profile?.volunteerAreas &&
						user.profile.volunteerAreas.length > 0 && (
							<Badge
								variant="secondary"
								className="text-[10px] h-4 px-1.5 font-bold uppercase bg-warning/20 text-warning-foreground border-warning/30 hover:bg-warning/30 transition-colors shrink-0"
							>
								Volunteer
							</Badge>
						)}
				</div>
				{showAreas &&
					user.profile?.volunteerAreas &&
					user.profile.volunteerAreas.length > 0 && (
						<div className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1 italic">
							{user.profile.volunteerAreas.join(", ")}
						</div>
					)}
			</div>
		</div>
	);

	const statusRow = (user: User) => (
		<div className="flex items-center gap-2">
			{user.banned ? (
				<div className="flex items-center gap-1.5 text-destructive text-sm font-medium">
					<ShieldAlert className="h-4 w-4" />
					Banned
				</div>
			) : (
				<div className="flex items-center gap-1.5 text-green-500 text-sm font-medium">
					<Shield className="h-4 w-4" />
					Active
				</div>
			)}
			{user.pendingDeletion && (
				<Badge variant="destructive">Deletion Requested</Badge>
			)}
		</div>
	);

	const roleSelect = (user: User, selectClassName: string) => (
		<Select
			defaultValue={user.role}
			onValueChange={(val: string) => onRoleChange(user.id, val)}
		>
			<SelectTrigger className={selectClassName}>
				<SelectValue placeholder="Role" />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="user">User</SelectItem>
				<SelectItem value="admin">Admin</SelectItem>
			</SelectContent>
		</Select>
	);

	const userButtons = (user: User) => (
		<>
			<Button
				variant="outline"
				size="icon"
				className={
					user.banned
						? "text-primary border-primary hover:bg-primary/10"
						: "text-destructive border-destructive/30 hover:bg-destructive/10"
				}
				onClick={() => onToggleBan(user)}
				title={user.banned ? "Unban User" : "Ban User"}
			>
				<Ban className="h-4 w-4" />
			</Button>

			{user.pendingDeletion && (
				<Button
					variant="outline"
					size="icon"
					className="text-orange-500 border-orange-500/30 hover:bg-orange-500/10"
					onClick={() => onRevokeDeletion(user.id)}
					title="Revoke Deletion Request"
				>
					<Undo2 className="h-4 w-4" />
				</Button>
			)}

			<AlertDialog>
				<AlertDialogTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						className="text-destructive hover:bg-destructive/10"
						title="Delete User"
					>
						<Trash2 className="h-4 w-4" />
					</Button>
				</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete User</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to PERMANENTLY delete this
							user? This action cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => onDeleteUser(user.id)}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
```

- [ ] **Step 3: Point the table cells at the helpers**

Inside `users.map((user) => (<TableRow key={user.id}>…</TableRow>))`:

1. User cell (lines 197–239) becomes:
```tsx
									<TableCell className="font-medium">
										{userIdentity(user, true)}
									</TableCell>
```
2. Email cell: unchanged (`<TableCell>{user.email}</TableCell>`).
3. Status cell (lines 241–260) becomes:
```tsx
									<TableCell>
										{statusRow(user)}
									</TableCell>
```
4. Actions cell inner `<div>` (lines 262–334) becomes:
```tsx
										<div className="flex flex-wrap items-center justify-end gap-2">
											{roleSelect(user, "w-[110px]")}
											{userButtons(user)}
										</div>
```

- [ ] **Step 4: Gate the table for `md+`**

Change line 168:

```tsx
			<div className="hidden md:block rounded-md border bg-card/50 backdrop-blur-sm">
```

- [ ] **Step 5: Insert the mobile card list**

Immediately after that wrapper's closing `</div>` (line 341), insert:

```tsx
			<div className="md:hidden space-y-3">
				{loading ? (
					<div className="flex h-24 items-center justify-center rounded-md border bg-card/50 backdrop-blur-sm">
						<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
					</div>
				) : users.length === 0 ? (
					<div className="flex h-24 items-center justify-center rounded-md border bg-card/50 backdrop-blur-sm text-sm text-muted-foreground">
						No users found.
					</div>
				) : (
					users.map((user) => (
						<CollapsibleCard
							key={user.id}
							trigger={
								<>
									{userIdentity(user, false)}
									{statusRow(user)}
								</>
							}
						>
							<div className="flex items-start justify-between gap-3 text-sm">
								<span className="shrink-0 text-muted-foreground">
									Email
								</span>
								<span className="min-w-0 break-all text-right">
									{user.email}
								</span>
							</div>
							{user.profile?.volunteerAreas &&
								user.profile.volunteerAreas.length > 0 && (
									<div className="text-xs italic text-muted-foreground line-clamp-2">
										{user.profile.volunteerAreas.join(", ")}
									</div>
								)}
							<div className="flex flex-wrap items-center justify-end gap-2">
								{roleSelect(user, "w-full")}
								{userButtons(user)}
							</div>
						</CollapsibleCard>
					))
				)}
			</div>
```

- [ ] **Step 6: Header wraps at 360px**

Change line 159:

```tsx
			<div className="flex flex-wrap justify-between items-center gap-3 mb-8">
```

- [ ] **Step 7: Typecheck**

Run: `bunx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 8: Lint/format**

Run: `bunx biome check --write components/admin/user-management.tsx`
Expected: fixes applied. Then:
Run: `bunx biome check components/admin/user-management.tsx`
Expected: no errors, no warnings.

- [ ] **Step 9: Playwright smoke @360px**

```bash
playwright-cli resize 360 800
playwright-cli goto "http://localhost:3000/dashboard/admin/users"
sleep 3
playwright-cli --raw eval "document.documentElement.scrollWidth"   # expect ≤360
playwright-cli --raw eval "document.querySelector('table')?.offsetParent === null"   # expect true
playwright-cli --raw eval "(() => { const c=[...document.querySelectorAll('div')].find(d=>d.className.includes('md:hidden')&&d.querySelector('button')); if(!c) return 'no cards'; c.querySelector('button').click(); return 'clicked'; })()"   # expect clicked
sleep 1.5
playwright-cli --raw eval "document.body.innerText.includes('Email')"   # expect true
playwright-cli screenshot --filename="$PWD/.playwright-cli/mobile-cards/users-360-expanded.png"
```
Expected: `≤360`, `true`, `clicked`, `true`, screenshot written.

- [ ] **Step 10: Commit**

```bash
git add components/admin/user-management.tsx
git commit -m "feat(users): add mobile card list alongside user table"
```

---

### Task 4: Video Management — dual render

**Files:**
- Modify: `components/admin/video-management.tsx`
  - imports (after line ~10 `TypeToDeleteDialog` import)
  - helpers before `return (` (line 166)
  - header div (line 168)
  - table cells (lines 320–362) → helper calls
  - table wrapper (line 292) → `hidden md:block`
  - card list after the wrapper's closing `</div>` (line 367)

**Interfaces:**
- Consumes: `CollapsibleCard` from Task 1.
- Produces (internal): `typePill(video: Video)`, `videoActions(video: Video)`.
- Existing symbols reused: `Video` interface (line 61), `handleEdit(video)`, `requestDelete(video)`, icons `Play`/`Edit`/`Trash2`/`Loader2`.

- [ ] **Step 1: Add the import**

```tsx
import { CollapsibleCard } from "@/components/shadcn-space/collapsible/collapsible-card";
```

- [ ] **Step 2: Insert the shared helpers**

Immediately before `return (` (after `handleEdit` ends at line 164), insert:

```tsx
	const typePill = (video: Video) => (
		<span
			className={`px-2 py-1 rounded-full text-xs font-medium ${
				video.type === "LIVE"
					? "bg-red-500/10 text-red-500"
					: "bg-blue-500/10 text-blue-500"
			}`}
		>
			{video.type}
		</span>
	);

	const videoActions = (video: Video) => (
		<div className="flex flex-wrap justify-end gap-2">
			<Button
				variant="ghost"
				size="icon"
				onClick={() => window.open(video.url, "_blank")}
			>
				<Play className="h-4 w-4" />
			</Button>
			<Button
				variant="ghost"
				size="icon"
				onClick={() => handleEdit(video)}
			>
				<Edit className="h-4 w-4" />
			</Button>
			<Button
				variant="ghost"
				size="icon"
				className="text-destructive hover:text-destructive cursor-pointer"
				onClick={() => requestDelete(video)}
			>
				<Trash2 className="h-4 w-4" />
			</Button>
		</div>
	);
```

- [ ] **Step 3: Point the table cells at the helpers**

Inside `videos.map((video) => (<TableRow key={video.id}>…</TableRow>))`:

1. Type cell (lines 321–331) becomes:
```tsx
									<TableCell>
										{typePill(video)}
									</TableCell>
```
2. Title cell: unchanged.
3. URL cell: unchanged.
4. Actions cell (lines 336–361) becomes:
```tsx
									<TableCell className="text-right">
										{videoActions(video)}
									</TableCell>
```

- [ ] **Step 4: Gate the table for `md+`**

Change line 292:

```tsx
			<div className="hidden md:block rounded-md border bg-card/50 backdrop-blur-sm">
```

- [ ] **Step 5: Insert the mobile card list**

Immediately after that wrapper's closing `</div>` (line 367), insert:

```tsx
			<div className="md:hidden space-y-3">
				{loading ? (
					<div className="flex h-24 items-center justify-center rounded-md border bg-card/50 backdrop-blur-sm">
						<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
					</div>
				) : videos.length === 0 ? (
					<div className="flex h-24 items-center justify-center rounded-md border bg-card/50 backdrop-blur-sm text-sm text-muted-foreground">
						No videos found. Create your first one!
					</div>
				) : (
					videos.map((video) => (
						<CollapsibleCard
							key={video.id}
							trigger={
								<div className="flex min-w-0 items-center gap-2">
									{typePill(video)}
									<span className="truncate text-sm font-semibold">
										{video.title}
									</span>
								</div>
							}
						>
							<div className="flex items-start justify-between gap-3 text-sm">
								<span className="shrink-0 text-muted-foreground">
									URL
								</span>
								<span className="min-w-0 break-all text-right text-xs text-muted-foreground">
									{video.url}
								</span>
							</div>
							{videoActions(video)}
						</CollapsibleCard>
					))
				)
			</div>
```

> **Syntax note:** the closing above must be `))}\n\t\t\t</div>` — i.e. `))}` closes `videos.map` + ternary + JSX expression, then `</div>` closes the container. Write it as:
> ```tsx
> 					))
> 				)}
> 			</div>
> ```

- [ ] **Step 6: Header wraps at 360px**

Change line 168:

```tsx
			<div className="flex flex-wrap justify-between items-center gap-3 mb-8">
```

- [ ] **Step 7: Typecheck**

Run: `bunx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 8: Lint/format**

Run: `bunx biome check --write components/admin/video-management.tsx`
Expected: fixes applied. Then:
Run: `bunx biome check components/admin/video-management.tsx`
Expected: no errors, no warnings.

- [ ] **Step 9: Playwright smoke @360px**

```bash
playwright-cli resize 360 800
playwright-cli goto "http://localhost:3000/dashboard/admin"
sleep 3
playwright-cli --raw eval "document.documentElement.scrollWidth"   # expect ≤360
playwright-cli --raw eval "document.querySelector('table')?.offsetParent === null"   # expect true
playwright-cli --raw eval "(() => { const c=[...document.querySelectorAll('div')].find(d=>d.className.includes('md:hidden')&&d.querySelector('button')); if(!c) return 'no cards'; c.querySelector('button').click(); return 'clicked'; })()"   # expect clicked
sleep 1.5
playwright-cli --raw eval "document.body.innerText.includes('URL')"   # expect true
playwright-cli screenshot --filename="$PWD/.playwright-cli/mobile-cards/videos-360-expanded.png"
```
Expected: `≤360`, `true`, `clicked`, `true`, screenshot written.

- [ ] **Step 10: Commit**

```bash
git add components/admin/video-management.tsx
git commit -m "feat(videos): add mobile card list alongside video table"
```

---

### Task 5: Full verification matrix

**Files:**
- None modified (fixes, if any, are made in place and committed per-file with `fix:` messages).

**Interfaces:**
- Consumes: Tasks 1–4 output.
- Produces: verification evidence under `.playwright-cli/mobile-cards/` + final status report.

- [ ] **Step 1: Global typecheck + lint**

```bash
bunx tsc --noEmit
bunx biome check components/shadcn-space/collapsible/collapsible-card.tsx components/shadcn-space/collapsible/collapsible-04.tsx components/admin/event-management.tsx components/admin/user-management.tsx components/admin/video-management.tsx
```
Expected: tsc exit 0; biome `Checked 5 files` with `0 errors` and `0 warnings`. If failures: fix, re-run, commit with `fix:` message staging only the fixed file.

- [ ] **Step 2: 360px — collapsed captures + overflow assertions (3 routes)**

```bash
playwright-cli resize 360 800
for route in "dashboard/admin/events:events" "dashboard/admin/users:users" "dashboard/admin:videos"; do
  path="${route%%:*}"; name="${route##*:}"
  playwright-cli goto "http://localhost:3000/$path"
  sleep 3
  echo "$name scrollWidth=$(playwright-cli --raw eval 'document.documentElement.scrollWidth' | tr -d '\"')"
  playwright-cli screenshot --filename="$PWD/.playwright-cli/mobile-cards/$name-360-collapsed.png"
done
```
Expected: each `scrollWidth=360` (or ≤360); 3 screenshots.

- [ ] **Step 3: 360px — expanded captures (3 routes)**

For each route, run the Task N Step 9 click+assert sequence (events → `Ministers`, users → `Email`, videos → `URL`), screenshot to `$name-360-expanded.png`.
Expected: all asserts `true`; 3 screenshots.

- [ ] **Step 4: 1280px — table visible, cards hidden (3 routes)**

```bash
playwright-cli resize 1280 900
```

Run per route (`/dashboard/admin/events`, `/dashboard/admin/users`, `/dashboard/admin`):

```bash
playwright-cli goto "http://localhost:3000/<route>"
sleep 3
playwright-cli --raw eval "document.querySelector('table')?.offsetParent !== null"                 # expect true
playwright-cli --raw eval "[...document.querySelectorAll('div')].filter(d=>d.className.includes('md:hidden')).every(d=>d.offsetParent===null)"   # expect true
playwright-cli screenshot --filename="$PWD/.playwright-cli/mobile-cards/<name>-1280-table.png"
```
Expected: both evals `true` on all 3 routes; 3 screenshots.

- [ ] **Step 5: Interaction spot-checks @360**

On `/dashboard/admin/events` (first card expanded): toggle the Bookings `Switch` — expect no crash and the switch state flips (optimistic UI already exists).
On `/dashboard/admin/users` (first card expanded): open the role `Select`, choose the other role — expect the existing toast/refresh flow (do NOT commit a role change; pick the value it started with, or reload without saving if values match).
On `/dashboard/admin` (first card expanded): click Delete — expect the confirm dialog to open; cancel it.
Expected: all three behave as in the table; no console errors:
`playwright-cli --raw eval "1"` must not follow a page crash; if a Next.js error overlay appears, fix before continuing.

- [ ] **Step 6: Reference block untouched**

Run: `git diff HEAD~4 --stat -- components/shadcn-space/collapsible/collapsible-04.tsx`
Expected: empty.

- [ ] **Step 7: Final report**

`git log --oneline -5` → 4 task commits (plus earlier `docs:` commit). Confirm `git status --short` shows only the user's unrelated files + nothing from this work left uncommitted. Report to user: commits, screenshot paths, verification results.

---

## Self-Review (run after writing, before execution)

1. **Spec coverage:** primitive (Task 1) ✓; three tables dual-render (Tasks 2–4) ✓; header `flex-wrap` (Step 6 each) ✓; actions helpers single-source (Task 2–4 Step 2/3) ✓; loading/empty duplicates (Step 5 each) ✓; verification 360/1280 (Task 5) ✓; `collapsible-04` untouched (Task 1 Step 4 + Task 5 Step 6) ✓; out-of-scope tables untouched ✓.
2. **Placeholder scan:** no TBD/TODO; every step has exact code/commands/expected output.
3. **Type consistency:** `CollapsibleCard({trigger, children, defaultOpen?, className?})` matches all three call sites; helper signatures match Step 3 usages (`ministerStack(event)` default align, `ministerStack(event, "start")` in card; `roleSelect(user, "w-[110px]")` table vs `"w-full"` card; `userIdentity(user, true)` table vs `(user, false)` card).
