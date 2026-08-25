import { log } from "@/lib/logger";

interface SendArgs {
	from: string;
	to: string;
	subject: string;
	/** Rendered HTML, or a React Email element (Resend renders it). */
	html?: string;
	react?: import("react").ReactElement;
}

const ATTEMPTS = 3;

/**
 * Resend send with transient-aware retry (network blips and 429/5xx).
 * Final failure is logged to AppLog and rethrown so callers keep their
 * existing error handling.
 */
export async function sendEmailWithRetry(args: SendArgs): Promise<void> {
	const { resend } = await import("@/lib/email/resend");

	let lastError: unknown;
	for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
		try {
			const result = await resend.emails.send(
				args as Parameters<typeof resend.emails.send>[0],
			);
			if (result.error) throw new Error(result.error.message);
			return;
		} catch (error) {
			lastError = error;
			const message = error instanceof Error ? error.message : String(error);
			const transient =
				/timeout|rate limit|too many|429|5\d\d|network|fetch failed|econn/i.test(
					message,
				);
			if (!transient || attempt === ATTEMPTS) {
				log.error("email", `Email send failed: ${args.subject}`, {
					detail: `${message} · to=${args.to}`,
					meta: { attempts: attempt, templateSubject: args.subject },
				});
				throw error;
			}
			log.warn("email", "Transient email failure — retrying", {
				detail: message,
				meta: { attempt, to: args.to },
			});
			await new Promise((r) => setTimeout(r, 400 * 2 ** (attempt - 1)));
		}
	}
	throw lastError;
}
