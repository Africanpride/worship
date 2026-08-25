interface WindowState {
	count: number;
	resetAt: number;
}

const windows = new Map<string, WindowState>();

/** Prune expired entries when the map grows past a threshold. */
function prune(now: number) {
	if (windows.size < 5_000) return;
	for (const [key, state] of windows) {
		if (state.resetAt <= now) windows.delete(key);
	}
}

export interface RateLimitResult {
	ok: boolean;
	remaining: number;
	retryAfterSeconds: number;
}

/**
 * Fixed-window in-memory rate limiter. Keyed per instance — sufficient for
 * the current single-instance deployment; swap for Redis if that changes.
 */
export function rateLimit(
	key: string,
	limit: number,
	windowMs: number,
): RateLimitResult {
	const now = Date.now();
	prune(now);

	const existing = windows.get(key);
	if (!existing || existing.resetAt <= now) {
		windows.set(key, { count: 1, resetAt: now + windowMs });
		return { ok: true, remaining: limit - 1, retryAfterSeconds: 0 };
	}

	existing.count += 1;
	if (existing.count > limit) {
		return {
			ok: false,
			remaining: 0,
			retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000),
		};
	}
	return { ok: true, remaining: limit - existing.count, retryAfterSeconds: 0 };
}

export function clientIp(headers: Headers): string {
	return (
		headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
		headers.get("x-real-ip") ||
		"unknown"
	);
}
