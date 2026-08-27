import "server-only";

import { type App, cert, getApps, initializeApp } from "firebase-admin/app";

function getServiceAccount(): {
	projectId: string;
	clientEmail: string;
	privateKey: string;
} | null {
	// Prefer JSON blob, fallback to individual envs, fallback to GOOGLE_CREDENTIALS_JSON (same shape)
	const jsonRaw =
		process.env.FIREBASE_SERVICE_ACCOUNT_JSON ??
		process.env.GOOGLE_CREDENTIALS_JSON ??
		"";
	if (jsonRaw) {
		try {
			const parsed = JSON.parse(jsonRaw) as {
				project_id?: string;
				projectId?: string;
				client_email?: string;
				clientEmail?: string;
				private_key?: string;
				privateKey?: string;
			};
			const projectId = parsed.project_id ?? parsed.projectId ?? "";
			const clientEmail = parsed.client_email ?? parsed.clientEmail ?? "";
			const privateKey = (
				parsed.private_key ??
				parsed.privateKey ??
				""
			).replace(/\\n/g, "\n");
			if (projectId && clientEmail && privateKey)
				return { projectId, clientEmail, privateKey };
		} catch {}
	}
	const projectId =
		process.env.FIREBASE_PROJECT_ID ??
		process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ??
		"";
	const clientEmail = process.env.FIREBASE_CLIENT_EMAIL ?? "";
	const privateKey = (process.env.FIREBASE_PRIVATE_KEY ?? "").replace(
		/\\n/g,
		"\n",
	);
	if (projectId && clientEmail && privateKey)
		return { projectId, clientEmail, privateKey };
	return null;
}

export function getFirebaseAdminApp(): App | null {
	if (getApps().length > 0) return getApps()[0]!;
	const sa = getServiceAccount();
	if (!sa) return null;
	return initializeApp({
		credential: cert({
			projectId: sa.projectId,
			clientEmail: sa.clientEmail,
			privateKey: sa.privateKey,
		}),
		projectId: sa.projectId,
	});
}

export function isFirebaseAdminConfigured(): boolean {
	return !!getServiceAccount();
}
