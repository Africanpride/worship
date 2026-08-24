import { prisma } from "../lib/prisma";

/**
 * One-time (idempotent) setup: creates the MongoDB TTL index on app_logs.ts
 * so entries auto-expire after 30 days. Prisma cannot declare TTL indexes.
 *
 * Usage: bun scripts/create-log-ttl.ts
 */
const THIRTY_DAYS_SECONDS = 30 * 24 * 60 * 60;

async function main() {
	try {
		await prisma.$runCommandRaw({
			createIndexes: "app_logs",
			indexes: [
				{
					key: { ts: 1 },
					name: "ts_ttl_30d",
					expireAfterSeconds: THIRTY_DAYS_SECONDS,
				},
			],
		});
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		if (!message.includes("IndexOptionsConflict")) throw error;
		// prisma db push creates its own plain {ts:1} index; Mongo only allows
		// one index per key pattern. Drop it and install ours with the TTL.
		console.log(
			"[create-log-ttl] Replacing Prisma's non-TTL ts index with TTL variant…",
		);
		await prisma.$runCommandRaw({ dropIndexes: "app_logs", index: "app_logs_ts_idx" });
		await prisma.$runCommandRaw({
			createIndexes: "app_logs",
			indexes: [
				{
					key: { ts: 1 },
					name: "ts_ttl_30d",
					expireAfterSeconds: THIRTY_DAYS_SECONDS,
				},
			],
		});
	}
	console.log(
		`[create-log-ttl] TTL index ready on app_logs.ts (expires after ${THIRTY_DAYS_SECONDS}s).`,
	);
	await prisma.$disconnect();
}

main().catch((error) => {
	console.error("[create-log-ttl] FAILED", error);
	process.exit(1);
});
