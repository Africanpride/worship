import { log } from "@/lib/logger";

const TRANSIENT_DB_ERROR =
	/interrupted|timed out|timeout|connection|econnreset|enotfound|network|shard|topology/i;

/**
 * Retries a database read when the driver reports a transient failure
 * (e.g. Atlas "server monitor timeout" connection interruptions).
 * Non-transient errors and exhausted attempts rethrow immediately.
 */
export async function withDbRetry<T>(
	fn: () => Promise<T>,
	attempts = 3,
): Promise<T> {
	let lastError: unknown;
	for (let attempt = 0; attempt < attempts; attempt++) {
		try {
			return await fn();
		} catch (error) {
			lastError = error;
			const message = error instanceof Error ? error.message : String(error);
			if (!TRANSIENT_DB_ERROR.test(message) || attempt === attempts - 1) {
				log.error("db", "Database query failed after retries", {
					detail: message,
					meta: { attempt: attempt + 1, of: attempts },
				});
				throw error;
			}
			log.warn("db", "Transient database error — retrying", {
				detail: message,
				meta: { attempt: attempt + 1, of: attempts },
			});
			await new Promise((resolve) => setTimeout(resolve, 250 * 2 ** attempt));
		}
	}
	throw lastError;
}
