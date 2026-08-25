import { type NextRequest, NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { requestIp, verifyTurnstile } from "@/lib/turnstile";

const ALLOWED_ACTIONS = new Set(["login", "signup"]);

// POST /api/security/turnstile  { token, action }
// Pre-verifies a Turnstile token for flows owned by better-auth
// (credentials sign-in/sign-up), which cannot verify internally.
export async function POST(req: NextRequest) {
	const limited = rateLimit(`turnstile:${clientIp(req.headers)}`, 30, 60_000);
	if (!limited.ok) {
		return NextResponse.json(
			{ error: "Too many attempts. Please slow down." },
			{ status: 429 },
		);
	}

	try {
		const body = (await req.json().catch(() => ({}))) as {
			token?: unknown;
			action?: unknown;
		};
		const action =
			typeof body.action === "string" && ALLOWED_ACTIONS.has(body.action)
				? body.action
				: null;
		if (!action) {
			return NextResponse.json({ error: "Invalid action" }, { status: 400 });
		}

		const result = await verifyTurnstile(body.token, {
			action,
			remoteip: requestIp(req.headers),
		});
		if (!result.ok) {
			return NextResponse.json(
				{ verified: false, reason: result.reason },
				{ status: 403 },
			);
		}
		return NextResponse.json({ verified: true });
	} catch (error) {
		console.error("[TURNSTILE_VERIFY]", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
