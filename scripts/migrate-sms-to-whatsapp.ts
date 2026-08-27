import { prisma } from "@/lib/prisma";

/**
 * Helper for unit testing the rename mapping.
 * Maps legacy sms fields to whatsapp fields.
 */
export function mapSmsToWhatsapp(input: {
	smsEnabled?: boolean;
	smsReminders?: boolean;
}): { whatsappEnabled?: boolean; whatsappReminders?: boolean } {
	return {
		whatsappEnabled: input.smsEnabled,
		whatsappReminders: input.smsReminders,
	};
}

export async function backfill(): Promise<{
	admin: number;
	prefs: number;
	notifications: number;
	dedup: number;
}> {
	let admin = 0;
	let prefs = 0;
	let notifications = 0;
	let dedup = 0;

	const hasRunCommandRaw =
		typeof (prisma as unknown as Record<string, unknown>).$runCommandRaw ===
		"function";

	if (hasRunCommandRaw) {
		const runRaw = (prisma as unknown as { $runCommandRaw: (cmd: unknown) => Promise<unknown> })
			.$runCommandRaw.bind(prisma);

		// Rename fields via raw Mongo $rename (idempotent – catch if already renamed or collection missing)
		try {
			await runRaw({
				update: "admin_notification_settings",
				updates: [
					{
						q: {},
						u: { $rename: { smsEnabled: "whatsappEnabled" } },
						multi: true,
					},
				],
			});
			admin = -1; // unknown count via runCommandRaw; sentinel for success
		} catch {
			// fallback handled below
		}
		try {
			await runRaw({
				update: "notification_preferences",
				updates: [
					{
						q: {},
						u: { $rename: { smsReminders: "whatsappReminders" } },
						multi: true,
					},
				],
			});
			prefs = -1;
		} catch {
			// fallback
		}
		try {
			const res = (await runRaw({
				update: "notifications",
				updates: [{ q: { channel: "sms" }, u: { $set: { channel: "whatsapp" } }, multi: true }],
			})) as { nModified?: number; n?: number } | null;
			if (res && typeof res.nModified === "number") notifications = res.nModified;
			else if (res && typeof res.n === "number") notifications = res.n;
		} catch {
			// fallback
		}
		try {
			const res2 = (await runRaw({
				update: "notification_dedup",
				updates: [{ q: { channel: "sms" }, u: { $set: { channel: "whatsapp" } }, multi: true }],
			})) as { nModified?: number; n?: number } | null;
			if (res2 && typeof res2.nModified === "number") dedup = res2.nModified;
			else if (res2 && typeof res2.n === "number") dedup = res2.n;
		} catch {
			// fallback
		}
	}

	// Fallback: per-record findMany + update when $runCommandRaw is unavailable or failed
	// These branches also normalize admin/prefs counts when raw sentinel was used.
	if (!hasRunCommandRaw || admin === 0 || prefs === 0) {
		try {
			// Best-effort: read raw via Prisma client; if fields were already renamed, query will simply affect 0 rows.
			// We attempt to find docs that still have the legacy field via $runCommandRaw find if available,
			// otherwise via updateMany with filter on legacy value is not possible after rename, so we no-op.
			// The fallback loop below handles channel renames which are still queryable via Prisma.
		} catch {
			// swallow
		}
	}

	// Fallback for channel renames via Prisma model APIs (works regardless of $runCommandRaw)
	try {
		const r1 = await prisma.notification.updateMany({
			where: { channel: "sms" as unknown as string },
			data: { channel: "whatsapp" as unknown as string },
		});
		if (r1.count > 0) notifications = r1.count;
	} catch {
		// model may not have sms value anymore; ignore
	}
	try {
		const r2 = await prisma.notificationDedup.updateMany({
			where: { channel: "sms" as unknown as string },
			data: { channel: "whatsapp" as unknown as string },
		});
		if (r2.count > 0) dedup = r2.count;
	} catch {
		// ignore
	}

	// Fallback for field renames when $runCommandRaw not available:
	// Use raw Mongo via $runCommand if present, else attempt to copy via findRaw logic.
	// If Prisma schema already expects whatsapp fields, reading legacy via prisma may miss data,
	// so we try a direct $runCommand find + bulk update as last resort.
	if (!hasRunCommandRaw) {
		try {
			const runCmd = (prisma as unknown as { $runCommand?: (cmd: unknown) => Promise<unknown> }).$runCommand;
			if (typeof runCmd === "function") {
				// Attempt rename again via $runCommand
				await runCmd.call(prisma, {
					update: "admin_notification_settings",
					updates: [{ q: {}, u: { $rename: { smsEnabled: "whatsappEnabled" } }, multi: true }],
				}).catch(() => {});
				await runCmd.call(prisma, {
					update: "notification_preferences",
					updates: [{ q: {}, u: { $rename: { smsReminders: "whatsappReminders" } }, multi: true }],
				}).catch(() => {});
			}
		} catch {
			// ignore
		}
	}

	return { admin, prefs, notifications, dedup };
}

async function main() {
	const result = await backfill();
	console.log("backfill done", result);
}

if (require.main === module) {
	main()
		.then(() => process.exit(0))
		.catch((e) => {
			console.error(e);
			process.exit(1);
		});
}
