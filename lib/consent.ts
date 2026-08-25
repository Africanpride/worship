/**
 * Cookie consent engine — GDPR/ePrivacy (CNIL), CCPA/CPRA, LGPD, PIPL, DPDP.
 *
 * Design rules encoded here:
 * - Consent is PRIOR and GRANULAR: non-essential categories default OFF.
 * - Equal prominence Accept/Reject lives in the UI layer, not here.
 * - 6-month validity + policy-version re-consent (CNIL recommendation).
 * - Global Privacy Control (GPC) signals are honored automatically.
 * - Refusal is stored too: rejecting is recorded, not ignored.
 */

export const CONSENT_COOKIE = "ns_consent";
export const CONSENT_VERSION = "2026-08-24";
/** CNIL: consent must be re-collected at least every 6 months. */
export const CONSENT_MAX_AGE_MS = 182 * 24 * 60 * 60 * 1000;

export const CONSENT_CATEGORIES = [
	"necessary",
	"analytics",
	"functionality",
	"marketing",
] as const;

export type ConsentCategory = (typeof CONSENT_CATEGORIES)[number];

export interface ConsentState {
	version: string;
	timestamp: string;
	necessary: true;
	analytics: boolean;
	functionality: boolean;
	marketing: boolean;
	/** True when the choice was driven by a Global Privacy Control signal. */
	gpc?: boolean;
}

const CATEGORY_META: Record<
	Exclude<ConsentCategory, "necessary">,
	{ label: string; description: string; partners: string }
> = {
	analytics: {
		label: "Analytics",
		description:
			"Help us understand how visitors use the site so we can improve it. Data is aggregated.",
		partners: "Vercel Analytics (cookieless)",
	},
	functionality: {
		label: "Functionality",
		description:
			"Remembers your preferences such as theme and playback settings.",
		partners: "First-party only",
	},
	marketing: {
		label: "Marketing & personalisation",
		description:
			"Used to personalise content and measure campaigns. Currently unused — reserved.",
		partners: "None active",
	},
};

export { CATEGORY_META as CONSENT_CATEGORY_META };

export function defaultConsent(gpc = false): ConsentState {
	return {
		version: CONSENT_VERSION,
		timestamp: new Date().toISOString(),
		necessary: true,
		analytics: false,
		functionality: false,
		marketing: false,
		gpc,
	};
}

export function parseConsent(raw: string | undefined): ConsentState | null {
	if (!raw) return null;
	try {
		const parsed = JSON.parse(decodeURIComponent(raw)) as Partial<ConsentState>;
		if (
			parsed.version !== CONSENT_VERSION ||
			parsed.necessary !== true ||
			typeof parsed.timestamp !== "string"
		) {
			return null;
		}
		const ts = new Date(parsed.timestamp).getTime();
		if (!Number.isFinite(ts) || Date.now() - ts > CONSENT_MAX_AGE_MS) {
			return null;
		}
		return {
			version: parsed.version,
			timestamp: parsed.timestamp,
			necessary: true,
			analytics: parsed.analytics === true,
			functionality: parsed.functionality === true,
			marketing: parsed.marketing === true,
			gpc: parsed.gpc === true,
		};
	} catch {
		return null;
	}
}

export function readConsent(): ConsentState | null {
	if (typeof document === "undefined") return null;
	const match = document.cookie
		.split("; ")
		.find((c) => c.startsWith(`${CONSENT_COOKIE}=`));
	return parseConsent(match?.split("=").slice(1).join("="));
}

export function writeConsent(state: ConsentState): void {
	const value = encodeURIComponent(JSON.stringify(state));
	const secure =
		typeof location !== "undefined" && location.protocol === "https:"
			? "; Secure"
			: "";
	document.cookie = `${CONSENT_COOKIE}=${value}; Max-Age=${
		CONSENT_MAX_AGE_MS / 1000
	}; Path=/; SameSite=Lax${secure}`;
}

/** Detect Global Privacy Control (CCPA/CPRA opt-out signal). */
export function gpcSignal(): boolean {
	if (typeof navigator === "undefined") return false;
	const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
	return nav.globalPrivacyControl === true;
}

export function hasCategory(category: ConsentCategory): boolean {
	if (category === "necessary") return true;
	const consent = readConsent();
	return consent?.[category] === true;
}

export const OPEN_CONSENT_EVENT = "nonstop:open-consent";
export function openConsentDialog(): void {
	window.dispatchEvent(new CustomEvent(OPEN_CONSENT_EVENT));
}

declare global {
	interface Window {
		NonStopConsent?: {
			hasCategory: typeof hasCategory;
			openPreferences: () => void;
		};
	}
}
