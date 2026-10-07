import { describe, expect, it } from "bun:test";

describe("AuditLog Prisma Schema", () => {
	it("contains AuditLog model definition with required fields and indexes", async () => {
		const schema = await Bun.file("prisma/schema.prisma").text();
		expect(schema).toContain("model AuditLog {");
		expect(schema).toContain("actorId     String   @db.ObjectId");
		expect(schema).toContain("actorEmail  String");
		expect(schema).toContain("actorName   String");
		expect(schema).toContain('actorRole   String   @default("admin")');
		expect(schema).toContain("action      String");
		expect(schema).toContain("entityType  String");
		expect(schema).toContain("entityId    String?");
		expect(schema).toContain("entityLabel String?");
		expect(schema).toContain("before      Json?");
		expect(schema).toContain("after       Json?");
		expect(schema).toContain("metadata    Json?");
		expect(schema).toContain("ipAddress   String?");
		expect(schema).toContain("userAgent   String?");
		expect(schema).toContain("createdAt   DateTime @default(now())");
		expect(schema).toContain("@@index([action])");
		expect(schema).toContain("@@index([entityType, entityId])");
		expect(schema).toContain("@@index([actorId])");
		expect(schema).toContain("@@index([createdAt])");
		expect(schema).toContain('@@map("audit_logs")');
	});
});
