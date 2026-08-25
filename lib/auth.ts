import { render } from "@react-email/render";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { admin, multiSession } from "better-auth/plugins";
import { log } from "@/lib/logger";
import { resend } from "./email/resend";
import { reactResetPasswordEmail } from "./email/rest-password";
import VerifyEmail from "./email/VerifyEmail";
import { sendEmailWithRetry } from "./email-send";
import { prisma } from "./prisma";

export const auth = betterAuth({
	appName: "The NonStop Series",
	database: prismaAdapter(prisma, {
		provider: "mongodb",
	}),
	additionalFields: {
		user: {
			role: {
				type: "string",
				default: "user",
				input: false,
			},
		},
	},
	advanced: {
		database: {
			generateId: false,
			experimental: { joins: true },
		},
		databaseHooks: {
			user: {
				create: {
					before: async (user: Record<string, unknown>) => {
						return {
							data: {
								...user,
								role: "user",
							},
						};
					},
					after: async () => {
						//
					},
				},
			},
		},
	},
	trustedOrigins: [
		process.env.NEXT_PUBLIC_APP_URL!,
		"http://localhost:3000",
	].concat(
		process.env.NODE_ENV === "development"
			? ["http://localhost:3001", "http://localhost:3002"]
			: [],
	),
	account: {
		accountLinking: {
			enabled: true,
			trustedProviders: ["google"],
			updateAccountOnSignIn: true,
		},
	},
	emailVerification: {
		enabled: true,
		requireEmailVerification: true,
		async sendVerificationEmail({ user, url }) {
			try {
				await sendEmailWithRetry({
					from: "no-reply@thenonstop.org",
					to: user.email,
					subject: "Verify your email address",
					react: VerifyEmail({
						username: user.email,
						verifyLink: url,
					}),
				});
				log.info("email", "Verification email sent", {
					meta: { to: user.email, template: "VerifyEmail" },
				});
			} catch (error) {
				log.error("email", "Verification email failed", {
					detail: error instanceof Error ? error.message : String(error),
					meta: { to: user.email, template: "VerifyEmail" },
				});
			}
		},
	},
	emailAndPassword: {
		autoSignIn: false,
		enabled: true,
		requireEmailVerification: true,
		minPasswordLength: 8,
		async sendResetPassword({ user, url }) {
			try {
				await sendEmailWithRetry({
					from: "no-reply@thenonstop.org",
					to: user.email,
					subject: "Reset your TheNonStop password",
					react: reactResetPasswordEmail({
						username: user.email,
						resetLink: url,
					}),
				});
				log.info("email", "Password reset email sent", {
					meta: { to: user.email, template: "ResetPassword" },
				});
			} catch (error) {
				log.error("email", "Password reset email failed", {
					detail: error instanceof Error ? error.message : String(error),
					meta: { to: user.email, template: "ResetPassword" },
				});
			}
		},
	},
	socialProviders: {
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		},
	},
	plugins: [admin(), multiSession(), nextCookies()],
	/** if no database is provided, the user data will be stored in memory.
	 * Make sure to provide a database to persist user data **/
});
