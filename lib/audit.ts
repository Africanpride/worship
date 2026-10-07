import { prisma } from "@/lib/prisma";

export interface AuditActor {
	id: string;
	email: string;
	name: string;
	role?: string | null;
}

export interface AuditParams {
	actor: AuditActor;
	action: string;
	entityType: string;
	entityId?: string | null;
	entityLabel?: string | null;
	before?: Record<string, unknown> | null;
	after?: Record<string, unknown> | null;
	metadata?: Record<string, unknown> | null;
	req?: Request | Headers | null;
	ipAddress?: string | null;
	userAgent?: string | null;
}

export function extractClientMeta(req?: Request | Headers | null): {
	ipAddress: string | null;
	userAgent: string | null;
} {
	if (!req) {
		return { ipAddress: null, userAgent: null };
	}

	const headers = req instanceof Request ? req.headers : req;
	const forwarded = headers.get("x-forwarded-for");
	const realIp = headers.get("x-real-ip");
	const ipAddress = forwarded ? forwarded.split(",")[0].trim() : realIp || null;

	const userAgent = headers.get("user-agent") || null;
	return { ipAddress, userAgent };
}

export async function recordAuditLog(params: AuditParams) {
	try {
		const meta = extractClientMeta(params.req);
		const ipAddress = params.ipAddress ?? meta.ipAddress;
		const userAgent = params.userAgent ?? meta.userAgent;

		// Clean and ensure object structure for JSON fields
		const before = params.before
			? JSON.parse(JSON.stringify(params.before))
			: null;
		const after = params.after
			? JSON.parse(JSON.stringify(params.after))
			: null;
		const metadata = params.metadata
			? JSON.parse(JSON.stringify(params.metadata))
			: null;

		return await prisma.auditLog.create({
			data: {
				actorId: params.actor.id,
				actorEmail: params.actor.email,
				actorName: params.actor.name,
				actorRole: params.actor.role || "admin",
				action: params.action,
				entityType: params.entityType,
				entityId: params.entityId ?? null,
				entityLabel: params.entityLabel ?? null,
				before,
				after,
				metadata,
				ipAddress,
				userAgent,
			},
		});
	} catch (error) {
		console.error("[AUDIT_LOG_ERROR] Failed to record audit log:", error);
		return null;
	}
}

export function recordAuditLogAsync(params: AuditParams): void {
	recordAuditLog(params).catch((err) => {
		console.error("[AUDIT_LOG_ASYNC_ERROR]", err);
	});
}
