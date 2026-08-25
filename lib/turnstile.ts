import { log } from "@/lib/logger";

const SITEVERIFY_URL =
	"https://challenges.cloudflare.com/turnstile/v0/siteverify";
const MAX_TOKEN_LENGTH = 2048;

export interface TurnstileVerificationOptions {
	/** The action identifier embedded in the widget (e.g. "login", "contact"). */
	action: string;
	/** Caller IP for additional score signal (X-Forwarded-For etc.). */
	remoteip?: string;
}

export interface TurnstileVerificationResult {
	ok: boolean;
	reason?: string;
}

/**
 * Canonical server-side Turnstile siteverify.
 *
 * Validates: token presence/length, secret match, success flag,
 * expected action, and an allowlisted frontend hostname.
 * Never call siteverify from the browser — always backend → Cloudflare.
 */
export async function verifyTurnstile(
	token: unknown,
	options: TurnstileVerificationOptions,
): Promise<TurnstileVerificationResult> {
	const secret = process.env.TURNSTILE_SECRET_KEY;
	if (!secret) return { ok: false, reason: "missing_secret" };

	if (
		typeof token !== "string" ||
		token.length === 0 ||
		token.length > MAX_TOKEN_LENGTH
	) {
		return { ok: false, reason: "invalid_token" };
	}

	const hostnames = (process.env.TURNSTILE_HOSTNAMES ?? "")
		.split(",")
		.map((h) => h.trim())
		.filter(Boolean);
	if (hostnames.length === 0) {
		return { ok: false, reason: "missing_hostnames" };
	}

	try {
		const response = await fetch(SITEVERIFY_URL, {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			signal: AbortSignal.timeout(10_000),
			body: new URLSearchParams({
				secret,
				response: token,
				...(options.remoteip ? { remoteip: options.remoteip } : {}),
			}),
		});
		if (!response.ok) throw new Error(`siteverify ${response.status}`);
		const result = (await response.json()) as {
			success: boolean;
			action?: string;
			hostname?: string;
		};

		if (!result.success) return { ok: false, reason: "verification_failed" };
		if (result.action !== options.action) {
			return { ok: false, reason: "action_mismatch" };
		}
		if (!result.hostname || !hostnames.includes(result.hostname)) {
			return { ok: false, reason: "hostname_not_allowed" };
		}
		return { ok: true };
	} catch (error) {
		log.error(
			"system",
			`Turnstile siteverify failed (action=${options.action})`,
			{
				detail: error instanceof Error ? error.message : String(error),
			},
		);
		return { ok: false, reason: "siteverify_unreachable" };
	}
}

/** Extracts the caller IP from proxy headers for siteverify's remoteip. */
export function requestIp(headers: Headers): string | undefined {
	return (
		headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
		headers.get("x-real-ip") ||
		undefined
	);
}
