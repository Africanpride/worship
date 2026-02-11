import {
    betterAuth
} from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { admin, multiSession } from "better-auth/plugins"
import { resend } from "./email/resend";
import { reactResetPasswordEmail } from "./email/rest-password";



export const auth = betterAuth({
    appName: "Worship",
    database: prismaAdapter(prisma, {
        provider: "mongodb",
    }),
    databaseHooks: {
        user: {
        create: {
            before: async (user) => {
            return {
                data: {
                ...user,
                role: "user", 
                },
            };
            },
            after: async (user) => {
            //  
            },
        },
        },
    },
    trustedOrigins: [process.env.NEXT_PUBLIC_APP_URL!, "http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
     account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "facebook", "microsoft", "linkedin"],
      updateAccountOnSignIn: true,
    },
  },
    emailAndPassword: {
        autoSignIn: false,
        enabled: true,
        requireEmailVerification: true,
        minPasswordLength: 8,
        async sendResetPassword({ user, url }) {
        await resend.emails.send({
            from: "no-reply@thenonstop.org",
            to: user.email,
            subject: "Reset your TheNonStop password",
            react: reactResetPasswordEmail({
            username: user.email,
            resetLink: url,
            }),
        });
        },
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        },
        microsoft: {
            clientId: process.env.MICROSOFT_CLIENT_ID!,
            clientSecret: process.env.MICROSOFT_CLIENT_SECRET!
        },
        apple: {
            clientId: process.env.APPLE_CLIENT_ID!,
            clientSecret: process.env.APPLE_CLIENT_SECRET!
        },
        linkedin: {
            clientId: process.env.LINKEDIN_CLIENT_ID!,
            clientSecret: process.env.LINKEDIN_CLIENT_SECRET!
        }
    },
    plugins: [
        admin(),
        multiSession(),
        nextCookies(),
    ],
    /** if no database is provided, the user data will be stored in memory.
     * Make sure to provide a database to persist user data **/
});