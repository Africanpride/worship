import { prisma } from "../lib/prisma";

/**
 * Lists events whose normalized titles collide, so duplicates can be
 * renamed or merged deliberately. Run: bun scripts/report-duplicate-events.ts
 */
function normalizeTitle(title: string): string {
	return title
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, " ")
		.trim();
}

async function main() {
	const events = await prisma.event.findMany({
		select: {
			id: true,
			title: true,
			slug: true,
			startDate: true,
			endDate: true,
			status: true,
			_count: { select: { slots: true } },
		},
		orderBy: { startDate: "asc" },
	});

	const groups = new Map<string, typeof events>();
	for (const ev of events) {
		const key = normalizeTitle(ev.title);
		const list = groups.get(key) ?? [];
		list.push(ev);
		groups.set(key, list);
	}

	let duplicateGroups = 0;
	console.log(`\nScanning ${events.length} events…\n`);
	for (const [key, group] of groups) {
		if (group.length < 2) continue;
		duplicateGroups += 1;
		console.log(`⚠︎  ${group.length}× similar titles ("${key}")`);
		for (const ev of group) {
			console.log(
				`   · ${ev.title}\n     id=${ev.id}  slug=${ev.slug}\n     ${ev.startDate.toISOString()} → ${ev.endDate.toISOString()}  [${ev.status}]  slots=${ev._count.slots}`,
			);
		}
		console.log("");
	}

	if (duplicateGroups === 0) console.log("No duplicate titles found. ✅");
	else
		console.log(
			`${duplicateGroups} group(s) need renaming in Event Management.`,
		);
	await prisma.$disconnect();
}

main().catch((error) => {
	console.error("[report-duplicate-events] FAILED", error);
	process.exit(1);
});
