import { AsyncLocalStorage } from "node:async_hooks";
import { prisma } from "@/lib/prisma";

export type LogLevel = "error" | "warn" | "info" | "debug";

export type LogSource =
	| "auth"
	| "slots"
	| "events"
	| "settings"
	| "email"
	| "db"
	| "system";

export interface LogContext {
	detail?: string;
	requestId?: string | null;
	userId?: string | null;
	meta?: Record<string, unknown>;
}

// Per-request correlation context. Routes call runWithRequestContext() at
// entry; anything logged inside inherits the requestId automatically.
const requestStorage = new AsyncLocalStorage<{ requestId: string }>();

export function runWithRequestContext<T>(fn: () => Promise<T>): Promise<T> {
	return requestStorage.run({ requestId: crypto.randomUUID() }, fn);
}

export function getRequestId(): string | null {
	return requestStorage.getStore()?.requestId ?? null;
}

const MAX_DETAIL_LENGTH = 500;

/** Shallow-sanitizes meta: stringifies values, truncates, drops empties. */
function sanitizeMeta(meta: Record<string, unknown> | undefined) {
	if (!meta) return undefined;
	const out: Record<string, string> = {};
	for (const [key, value] of Object.entries(meta)) {
		if (value === undefined || value === null) continue;
		let str = typeof value === "string" ? value : String(value);
		if (str.length > MAX_DETAIL_LENGTH) {
			str = `${str.slice(0, MAX_DETAIL_LENGTH)}…`;
		}
		out[key] = str;
	}
	return Object.keys(out).length > 0 ? out : undefined;
}

async function write(
	level: LogLevel,
	source: LogSource,
	message: string,
	context: LogContext = {},
): Promise<void> {
	try {
		if (level === "debug" && process.env.NODE_ENV === "production") return;

		await prisma.appLog.create({
			data: {
				level,
				source,
				message: message.slice(0, 1000),
				detail: context.detail?.slice(0, MAX_DETAIL_LENGTH),
				requestId: context.requestId ?? getRequestId(),
				userId: context.userId ?? null,
				meta: sanitizeMeta(context.meta),
			},
		});
	} catch (loggingError) {
		// Logging must never break the request path. Single console fallback —
		// no recursion risk since this path never writes to Prisma again.
		console.error("[LOG_WRITE_FAILED]", loggingError);
	}
}

export const log = {
	error: (source: LogSource, message: string, context?: LogContext) =>
		write("error", source, message, context),
	warn: (source: LogSource, message: string, context?: LogContext) =>
		write("warn", source, message, context),
	info: (source: LogSource, message: string, context?: LogContext) =>
		write("info", source, message, context),
	debug: (source: LogSource, message: string, context?: LogContext) =>
		write("debug", source, message, context),
};
