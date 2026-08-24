// prisma/prisma.ts
import { PrismaClient } from "@prisma/client";

// NOTE: after changing prisma/schema.prisma you must RESTART the dev server
// (Ctrl+C → bun run dev). The cached instance below was built from the
// previously generated client, so brand-new models are undefined until the
// process picks up the regenerated client. `bun run build` / Vercel are
// unaffected (they always start fresh).
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
