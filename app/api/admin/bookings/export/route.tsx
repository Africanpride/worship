import {
	Document,
	Page,
	renderToBuffer,
	StyleSheet,
	Text,
	View,
} from "@react-pdf/renderer";
import ExcelJS from "exceljs";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/admin/bookings/export?format=xlsx|pdf&scope=current|all
//   + optional agenda filter params: eventId, timeframe, status, q, hidePast
// Exports the bookings dataset as a styled Excel workbook or PDF report.
export async function GET(req: NextRequest) {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session || session.user.role !== "admin" || session.user.banned) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { searchParams } = new URL(req.url);
		const format = searchParams.get("format") === "pdf" ? "pdf" : "xlsx";
		const scope = searchParams.get("scope") === "all" ? "all" : "current";

		const where: Record<string, unknown> = {};

		if (scope === "current") {
			const eventId = searchParams.get("eventId");
			if (eventId && eventId !== "all") where.eventId = eventId;

			const track = searchParams.get("track");
			if (track && ["worship", "bible-reading"].includes(track)) {
				where.track = track;
			}

			if (searchParams.get("hidePast") !== "false") {
				const now = new Date();
				const events = await prisma.event.findMany({
					where: { endDate: { lte: now } },
					select: { id: true },
				});
				if (events.length > 0) {
					where.eventId = {
						...(where.eventId ? { in: [where.eventId] } : {}),
						notIn: events.map((e) => e.id),
					};
				}
			}

			const status = searchParams.get("status");
			if (status && status !== "all") where.status = status;

			const timeframe = searchParams.get("timeframe");
			if (timeframe && timeframe !== "all") {
				const parsed = Number.parseInt(timeframe.replace("d", ""), 10);
				if (Number.isInteger(parsed)) {
					const start = new Date();
					start.setHours(0, 0, 0, 0);
					const end = new Date(start);
					end.setDate(end.getDate() + Math.max(parsed, 1));
					where.startTime = { gte: start, lt: end };
				}
			}

			const q = searchParams.get("q")?.trim().toLowerCase();
			if (q) {
				// Text search spans joined fields; resolve candidate ids first.
				const matchedUsers = await prisma.user.findMany({
					where: {
						OR: [
							{ name: { contains: q } },
							{ email: { contains: q } },
							{ profile: { displayName: { contains: q } } },
						],
					},
					select: { id: true },
				});
				const matchedEvents = await prisma.event.findMany({
					where: { title: { contains: q } },
					select: { id: true },
				});
				where.OR = [
					{ assignedUserId: { in: matchedUsers.map((u) => u.id) } },
					{ eventId: { in: matchedEvents.map((e) => e.id) } },
				];
			}
		}

		const slots = await prisma.eventSlot.findMany({
			where,
			orderBy: { startTime: "asc" },
			include: {
				event: { select: { title: true, location: true } },
				assignedUser: {
					select: {
						name: true,
						email: true,
						profile: { select: { displayName: true } },
					},
				},
			},
		});

		type Row = {
			date: string;
			start: string;
			end: string;
			event: string;
			location: string;
			status: string;
			track: string;
			singer: string;
			email: string;
			rawStatus: string;
		};

		const rows: Row[] = slots.map((slot) => ({
			date: slot.startTime.toLocaleDateString("en-GB", {
				day: "2-digit",
				month: "short",
				year: "numeric",
			}),
			start: slot.startTime.toLocaleTimeString("en-GB", {
				hour: "2-digit",
				minute: "2-digit",
			}),
			end: slot.endTime.toLocaleTimeString("en-GB", {
				hour: "2-digit",
				minute: "2-digit",
			}),
			event: slot.event.title,
			location: slot.event.location ?? "—",
			status:
				slot.status === "open"
					? "Open"
					: slot.status === "blocked"
						? "Blocked"
						: "Booked",
			track: slot.track === "bible-reading" ? "Bible Reading" : "Worship",
			singer:
				slot.assignedUser?.profile?.displayName ??
				slot.assignedUser?.name ??
				"—",
			email: slot.assignedUser?.email ?? "",
			rawStatus: slot.status,
		}));

		const stamp = new Date().toISOString().slice(0, 10);
		const scopeLabel = scope === "all" ? "All Bookings" : "Current View";

		if (format === "xlsx") {
			const workbook = new ExcelJS.Workbook();
			const sheet = workbook.addWorksheet("Bookings");
			sheet.columns = [
				{ header: "Date", key: "date", width: 14 },
				{ header: "Starts", key: "start", width: 10 },
				{ header: "Ends", key: "end", width: 10 },
				{ header: "Event", key: "event", width: 34 },
				{ header: "Location", key: "location", width: 28 },
				{ header: "Status", key: "status", width: 11 },
				{ header: "Track", key: "track", width: 14 },
				{ header: "Singer", key: "singer", width: 24 },
				{ header: "Email", key: "email", width: 30 },
			];
			sheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
			sheet.getRow(1).fill = {
				type: "pattern",
				pattern: "solid",
				fgColor: { argb: "FF312E81" },
			};
			sheet.views = [{ state: "frozen", ySplit: 1 }];

			for (const row of rows) {
				const added = sheet.addRow(row);
				added.getCell("status").font = {
					color: {
						argb: row.rawStatus === "blocked" ? "FF92400E" : "FF111827",
					},
				};
			}

			sheet.autoFilter = "A1:I1";

			const buffer = await workbook.xlsx.writeBuffer();
			return new NextResponse(Buffer.from(buffer), {
				headers: {
					"Content-Type":
						"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
					"Content-Disposition": `attachment; filename="bookings-${scopeLabel.toLowerCase().replace(/\s+/g, "-")}-${stamp}.xlsx"`,
				},
			});
		}

		const styles = StyleSheet.create({
			page: {
				paddingTop: 28,
				paddingBottom: 32,
				paddingHorizontal: 24,
				fontSize: 8,
				fontFamily: "Helvetica",
			},
			headerBar: {
				backgroundColor: "#312E81",
				padding: 12,
				borderRadius: 6,
				marginBottom: 12,
			},
			headerTitle: { color: "#FFFFFF", fontSize: 14, fontWeight: "bold" },
			headerSub: { color: "#C7D2FE", fontSize: 8, marginTop: 2 },
			tableHeader: {
				flexDirection: "row",
				backgroundColor: "#EEF2FF",
				borderBottomWidth: 1,
				borderBottomColor: "#C7D2FE",
				paddingVertical: 5,
			},
			row: {
				flexDirection: "row",
				borderBottomWidth: 0.5,
				borderBottomColor: "#E5E7EB",
				paddingVertical: 4,
			},
			colDate: { width: "13%", paddingHorizontal: 4 },
			colTime: { width: "9%", paddingHorizontal: 4 },
			colEvent: { width: "24%", paddingHorizontal: 4 },
			colLoc: { width: "18%", paddingHorizontal: 4 },
			colStatus: { width: "9%", paddingHorizontal: 4 },
			colSinger: { width: "15%", paddingHorizontal: 4 },
			colEmail: { width: "12%", paddingHorizontal: 4 },
			headText: { fontSize: 7.5, fontWeight: "bold", color: "#312E81" },
			cell: { fontSize: 7.5, color: "#111827" },
			cellMuted: { fontSize: 7.5, color: "#6B7280" },
			statusOpen: { fontSize: 7.5, color: "#059669" },
			statusBlocked: { fontSize: 7.5, color: "#B45309" },
			empty: { marginTop: 24, textAlign: "center", color: "#6B7280" },
		});

		const headCells: Array<[string, string]> = [
			["colDate", "Date"],
			["colTime", "Starts"],
			["colTime", "Ends"],
			["colEvent", "Event"],
			["colLoc", "Location"],
			["colStatus", "Status"],
			["colStatus", "Track"],
			["colSinger", "Singer"],
			["colEmail", "Email"],
		];

		const buffer = await renderToBuffer(
			<Document
				title={`Bookings Report — ${scopeLabel}`}
				author="The NonStop Series"
			>
				<Page size="A4" orientation="landscape" style={styles.page}>
					<View style={styles.headerBar}>
						<Text style={styles.headerTitle}>
							The NonStop Series — Bookings Report ({scopeLabel})
						</Text>
						<Text style={styles.headerSub}>
							{rows.length} slots · generated{" "}
							{new Date().toLocaleString("en-GB")}
						</Text>
					</View>
					<View style={styles.tableHeader} fixed>
						{headCells.map(([styleKey, label]) => (
							<View key={label} style={styles[styleKey as keyof typeof styles]}>
								<Text style={styles.headText}>{label}</Text>
							</View>
						))}
					</View>
					{rows.length === 0 && (
						<Text style={styles.empty}>No bookings match this export.</Text>
					)}
					{rows.map((row, i) => (
						<View
							key={`${row.date}-${row.start}-${i}`}
							style={styles.row}
							wrap={false}
						>
							<Text style={[styles.colDate, styles.cell]}>{row.date}</Text>
							<Text style={[styles.colTime, styles.cellMuted]}>
								{row.start}
							</Text>
							<Text style={[styles.colTime, styles.cellMuted]}>{row.end}</Text>
							<Text style={[styles.colEvent, styles.cell]}>{row.event}</Text>
							<Text style={[styles.colLoc, styles.cellMuted]}>
								{row.location}
							</Text>
							<Text
								style={[
									styles.colStatus,
									row.rawStatus === "open"
										? styles.statusOpen
										: row.rawStatus === "blocked"
											? styles.statusBlocked
											: styles.cell,
								]}
							>
								{row.status}
							</Text>
							<Text style={[styles.colSinger, styles.cellMuted]}>
								{row.track}
							</Text>
							<Text style={[styles.colSinger, styles.cell]}>{row.singer}</Text>
							<Text style={[styles.colEmail, styles.cellMuted]}>
								{row.email}
							</Text>
						</View>
					))}
				</Page>
			</Document>,
		);

		return new NextResponse(Buffer.from(buffer), {
			headers: {
				"Content-Type": "application/pdf",
				"Content-Disposition": `attachment; filename="bookings-${scopeLabel.toLowerCase().replace(/\s+/g, "-")}-${stamp}.pdf"`,
			},
		});
	} catch (error) {
		console.error("[BOOKINGS_EXPORT]", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
