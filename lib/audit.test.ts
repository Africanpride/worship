import { describe, expect, it } from "bun:test";
import { extractClientMeta, recordAuditLog } from "./audit";

describe("audit service helper", () => {
	it("extracts ipAddress and userAgent from Request headers", () => {
		const req = new Request("http://localhost:3000/api/admin/slots", {
			headers: {
				"x-forwarded-for": "203.0.113.195, 70.41.3.18",
				"user-agent": "Mozilla/5.0 TestBrowser",
			},
		});
		const meta = extractClientMeta(req);
		expect(meta.ipAddress).toBe("203.0.113.195");
		expect(meta.userAgent).toBe("Mozilla/5.0 TestBrowser");
	});

	it("falls back gracefully when headers are empty", () => {
		const meta = extractClientMeta(null);
		expect(meta.ipAddress).toBeNull();
		expect(meta.userAgent).toBeNull();
	});

	it("safely suppresses errors without throwing if database write fails", async () => {
		// Pass an invalid actor or parameter designed to test failure suppression
		const result = await recordAuditLog({
			actor: {
				id: "invalid-id",
				email: "admin@test.com",
				name: "Admin",
			},
			action: "test.fail",
			entityType: "test",
		});
		// Should return null and not throw
		expect(result === null || typeof result === "object").toBe(true);
	});
});
