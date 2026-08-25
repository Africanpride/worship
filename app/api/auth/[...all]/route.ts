import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth";
import { log } from "@/lib/logger";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const handler = toNextJsHandler(auth);

// Wrap better-auth's handler so auth incidents (e.g. OAuth code-exchange
// network timeouts → invalid_code) land in the Application Logs console.
async function instrumented(req: Request): Promise<Response> {
	const url = new URL(req.url);

	// Throttle credential/OAuth initiation endpoints per IP.
	if (url.pathname.endsWith("/sign-in/social")) {
		const limited = rateLimit(
			`social-signin:${clientIp(new Headers(req.headers))}`,
			10,
			60_000,
		);
		if (!limited.ok) {
			return Response.json(
				{ error: "Too many attempts. Please wait a minute." },
				{ status: 429 },
			);
		}
	}

	const isOAuthCallback = url.pathname.includes("/callback/");
	if (!isOAuthCallback) {
		return req.method === "POST" ? handler.POST(req) : handler.GET(req);
	}

	const res =
		req.method === "POST" ? await handler.POST(req) : await handler.GET(req);
	if (res.status >= 400 || res.headers.get("location")?.includes("/error")) {
		log.error("auth", "Google OAuth callback failed", {
			detail: `status=${res.status} redirect=${res.headers.get("location") ?? "-"}`,
			requestId: url.searchParams.get("state") ?? undefined,
		});
	} else {
		log.info("auth", "OAuth callback completed", {
			meta: { provider: url.pathname.includes("/google") ? "google" : "oauth" },
		});
	}
	return res;
}

export const GET = instrumented;
export const POST = instrumented;
