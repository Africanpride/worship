import "server-only";
import { log } from "@/lib/logger";
import { prisma } from "@/lib/prisma";

export type NotifyChannel = "inapp" | "email" | "push" | "sms";

type NotifyInput = {
	title: string;
	body?: string;
	link?: string;
	slotId?: string;
	eventId?: string;
	channels?: NotifyChannel[];
};

async function getAdminSettings() {
	const existing = await prisma.adminNotificationSettings.findUnique({
		where: { singleton: "singleton" },
	});
	if (existing) return existing;
	return prisma.adminNotificationSettings.create({
		data: { singleton: "singleton" },
	});
}

async function getUserPreference(userId: string) {
	let pref = await prisma.notificationPreference.findUnique({
		where: { userId },
	});
	if (!pref) {
		pref = await prisma.notificationPreference.create({ data: { userId } });
	}
	return pref;
}

/**
 * Fan-out notification respecting admin kill-switches + user per-channel prefs.
 * Always writes in-app; other channels best-effort. Never throws.
 */
export async function notify(
	userId: string,
	input: NotifyInput,
): Promise<void> {
	const [admin, pref] = await Promise.all([
		getAdminSettings(),
		getUserPreference(userId),
	]);

	const wantsEmail = admin.emailEnabled && pref.emailReminders;
	const wantsPush = admin.pushEnabled && pref.pushReminders;
	const wantsSms = admin.smsEnabled && pref.smsReminders;

	const requested = new Set(
		input.channels ?? ["inapp", "email", "push", "sms"],
	);

	// Always attempt inapp if requested (admin doesn't gate inapp)
	const channels: NotifyChannel[] = [];
	if (requested.has("inapp")) channels.push("inapp");
	if (requested.has("email") && wantsEmail) channels.push("email");
	if (requested.has("push") && wantsPush) channels.push("push");
	if (requested.has("sms") && wantsSms) {
		// sms also requires verified phone
		const profile = await prisma.profile.findUnique({
			where: { userId },
			select: { phoneVerifiedAt: true },
		});
		if (profile?.phoneVerifiedAt) channels.push("sms");
	}

	// Write single in-app notification (dedup to one row per logical event)
	if (channels.includes("inapp") || channels.length === 0) {
		try {
			await prisma.notification.create({
				data: {
					userId,
					title: input.title,
					body: input.body,
					link: input.link,
					channel: "inapp",
					slotId: input.slotId,
					eventId: input.eventId,
				},
			});
		} catch (error) {
			log.warn("system", "notify inapp write failed", {
				detail: error instanceof Error ? error.message : String(error),
				meta: { userId, slotId: input.slotId },
			});
		}
	}

	// Email best-effort — import lazily so cron doesn't fail if resend missing
	if (channels.includes("email")) {
		try {
			const { sendEmailWithRetry } = await import("@/lib/email-send");
			const user = await prisma.user.findUnique({
				where: { id: userId },
				select: { email: true, name: true },
			});
			if (!user?.email) return;
			// Lazy import template to avoid bundling in cron cold start
			const { ReminderEmail } = await import("@/lib/email/ReminderEmail");
			const { render } = await import("@react-email/render");
			const html = await render(
				ReminderEmail({
					name: user.name ?? "there",
					title: input.title,
					body: input.body ?? "",
					link: input.link,
				}) as React.ReactElement,
			);
			await sendEmailWithRetry({
				from: "no-reply@thenonstop.org",
				to: user.email,
				subject: input.title,
				html,
			});
		} catch (error) {
			log.warn("email", "notify email failed", {
				detail: error instanceof Error ? error.message : String(error),
				meta: { userId, slotId: input.slotId },
			});
		}
	}

	// Push/SMS are wired in Phase 2 — no-op here but keep channel decisions
	if (channels.includes("push")) {
		log.debug("system", "push channel requested but not yet wired (Phase 2)", {
			meta: { userId },
		});
	}
	if (channels.includes("sms")) {
		log.debug("system", "sms channel requested but not yet wired (Phase 2)", {
			meta: { userId },
		});
	}
}
