import { prisma } from "../lib/prisma";
import { syncEventSlots } from "../lib/slots";

/**
 * One-off backfill: generates hourly EventSlot records for every existing
 * event. Union semantics — safe to re-run, never deletes or modifies slots.
 *
 * Usage: bun scripts/generate-slots.ts
 */
async function main() {
	const events = await prisma.event.findMany({
		select: { id: true, title: true },
		orderBy: { startDate: "asc" },
	});

	console.log(`[generate-slots] Processing ${events.length} events…`);

	for (const event of events) {
		try {
			const { created } = await syncEventSlots(event.id);
			console.log(
				`[generate-slots] ${event.title}: +${created} slot(s) created`,
			);
		} catch (error) {
			console.error(`[generate-slots] FAILED for "${event.title}"`, error);
		}
	}

	console.log("[generate-slots] Done.");
	await prisma.$disconnect();
}

main();
