import type { Prisma } from "@prisma/client";

/** Scalar User as delivered by better-auth/prisma (no relations loaded). */
export type ProfileUser = Prisma.UserGetPayload<Record<never, never>>;

export type ProfileRecord = Prisma.ProfileGetPayload<Record<never, never>>;

export interface ProfilePageProps {
	user: ProfileUser;
	profile: ProfileRecord;
}
