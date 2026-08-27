import "server-only";
import { z } from "zod";

// Task1: incremental – full centralized validation deferred to later tasks
const envSchema = z.object({
	DATABASE_URL: z.string().min(1),
	CRON_SECRET: z.string().optional(),
	OPENWA_BASE_URL: z.string().url().default("http://localhost:2785"),
	OPENWA_SESSION_ID: z.string().default("181c53f2-4092-47c3-9eb6-f8e42eff59e8"),
	OPENWA_API_KEY: z.string().optional(),
	VAPID_PUBLIC_KEY: z.string().optional(),
	VAPID_PRIVATE_KEY: z.string().optional(),
	VAPID_SUBJECT: z.string().optional(),
	NEXT_PUBLIC_VAPID_PUBLIC_KEY: z.string().optional(),
});

export const env = envSchema.parse(process.env);
export type Env = z.infer<typeof envSchema>;
