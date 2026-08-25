"use client";

import { CircleDot, Cookie } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
	CONSENT_CATEGORIES,
	CONSENT_CATEGORY_META,
	CONSENT_COOKIE,
	type ConsentCategory,
	type ConsentState,
	defaultConsent,
	gpcSignal,
	hasCategory,
	openConsentDialog,
	readConsent,
	writeConsent,
} from "@/lib/consent";
import { cn } from "@/lib/utils";

type Editable = Exclude<ConsentCategory, "necessary">;

export function CookieConsent() {
	const [showBanner, setShowBanner] = useState(false);
	const [prefsOpen, setPrefsOpen] = useState(false);
	const [draft, setDraft] = useState<Record<Editable, boolean>>({
		analytics: false,
		functionality: false,
		marketing: false,
	});
	const [gpc, setGpc] = useState(false);

	useEffect(() => {
		setGpc(gpcSignal());
		const existing = readConsent();
		if (!existing) {
			setShowBanner(true);
			if (gpcSignal()) {
				// GPC is a legally binding opt-out: apply immediately, no banner.
				writeConsent(defaultConsent(true));
				setShowBanner(false);
			}
		}
	}, []);

	// Public API so any future third-party script can gate itself.
	useEffect(() => {
		window.NonStopConsent = {
			hasCategory,
			openPreferences: openConsentDialog,
		};
		return () => {
			delete window.NonStopConsent;
		};
	}, []);

	useEffect(() => {
		const open = () => {
			const current = readConsent();
			if (current) {
				setDraft({
					analytics: current.analytics,
					functionality: current.functionality,
					marketing: current.marketing,
				});
			}
			setShowBanner(false);
			setPrefsOpen(true);
		};
		window.addEventListener("nonstop:open-consent", open);
		return () => window.removeEventListener("nonstop:open-consent", open);
	}, []);

	const save = useCallback((state: ConsentState) => {
		writeConsent(state);
		window.dispatchEvent(
			new CustomEvent("nonstop:consent-changed", { detail: state }),
		);
		setPrefsOpen(false);
		setShowBanner(false);
	}, []);

	const saveDraft = useCallback(() => {
		save({
			version: defaultConsent().version,
			timestamp: new Date().toISOString(),
			necessary: true,
			...draft,
			gpc,
		});
	}, [draft, gpc, save]);

	return (
		<>
			{/* Banner — equal prominence, no cookie wall */}
			{showBanner && !prefsOpen && (
				<div
					role="dialog"
					aria-label="Cookie consent"
					className="fixed bottom-4 right-4 z-50 w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-lg border bg-card shadow-xl"
				>
					<div className="flex items-center gap-2 border-b px-4 py-3">
						<CircleDot className="size-4 text-muted-foreground" />
						<span className="font-medium text-sm">Cookie Preferences</span>
					</div>
					<div className="border-b px-4 py-3">
						<p className="text-muted-foreground text-sm text-balance">
							We use cookies to run the site, analyse traffic and personalise
							content. Choose which categories to allow — rejecting keeps
							everything working.
						</p>
						<Link
							href="/privacy"
							className="mt-1.5 inline-block text-xs text-muted-foreground underline underline-offset-2 transition-colors hover:text-foreground cursor-pointer"
						>
							Read our Privacy Policy
						</Link>
					</div>
					<div className="flex items-center gap-2 border-b px-4 py-3">
						<Button
							size="sm"
							className="h-8 flex-1 cursor-pointer text-xs"
							onClick={() =>
								save({
									version: defaultConsent().version,
									timestamp: new Date().toISOString(),
									necessary: true,
									analytics: true,
									functionality: true,
									marketing: true,
									gpc,
								})
							}
						>
							Accept All
						</Button>
						<Button
							variant="outline"
							size="sm"
							className="h-8 flex-1 cursor-pointer text-xs"
							onClick={() => save(defaultConsent(gpc))}
						>
							Reject All
						</Button>
						<Button
							variant="ghost"
							size="sm"
							className="h-8 flex-1 cursor-pointer text-xs"
							onClick={() => {
								setShowBanner(false);
								setPrefsOpen(true);
							}}
						>
							Customize
						</Button>
					</div>
					<div className="px-4 py-2.5">
						<p className="text-center text-xs text-muted-foreground">
							GDPR · CCPA · LGPD · PIPL · DPDP compliant
							{gpc && " · Global Privacy Control honoured"}
						</p>
					</div>
				</div>
			)}

			{/* Layer 2 — granular preferences */}
			<Dialog open={prefsOpen} onOpenChange={setPrefsOpen}>
				<DialogContent className="overflow-hidden p-0 sm:max-w-lg">
					<DialogHeader className="border-b px-6 py-4">
						<DialogTitle className="flex items-center gap-2 text-sm font-medium">
							<Cookie className="size-4" /> Manage cookie preferences
						</DialogTitle>
						<DialogDescription className="text-xs text-muted-foreground">
							All optional categories start off. Your choice applies to this
							browser and lasts 6 months, or until you change it here.
						</DialogDescription>
					</DialogHeader>

					<div className="divide-y">
						<CategoryRow
							label="Strictly necessary"
							description="Session, security and load-balancing cookies. The site cannot function without these."
							partners="First-party · Better Auth · Cloudflare Turnstile"
							checked
							disabled
						/>
						{CONSENT_CATEGORIES.filter((c) => c !== "necessary").map(
							(category) => (
								<CategoryRow
									key={category}
									label={CONSENT_CATEGORY_META[category].label}
									description={CONSENT_CATEGORY_META[category].description}
									partners={CONSENT_CATEGORY_META[category].partners}
									checked={draft[category]}
									onCheckedChange={(v) =>
										setDraft((prev) => ({ ...prev, [category]: v }))
									}
								/>
							),
						)}
					</div>

					<DialogFooter className="grid grid-cols-1 gap-2 border-t px-6 py-4 sm:!grid-flow-row [&>button]:w-full">
						<Button className="cursor-pointer" onClick={saveDraft}>
							Confirm my choices
						</Button>
						<div className="grid grid-cols-2 gap-2">
							<Button
								variant="outline"
								className="cursor-pointer"
								onClick={() => save(defaultConsent(gpc))}
							>
								Reject All
							</Button>
							<Button
								className="cursor-pointer"
								onClick={() =>
									save({
										version: defaultConsent().version,
										timestamp: new Date().toISOString(),
										necessary: true,
										analytics: true,
										functionality: true,
										marketing: true,
										gpc,
									})
								}
							>
								Accept All
							</Button>
						</div>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}

function CategoryRow({
	label,
	description,
	partners,
	checked,
	disabled,
	onCheckedChange,
}: {
	label: string;
	description: string;
	partners: string;
	checked: boolean;
	disabled?: boolean;
	onCheckedChange?: (v: boolean) => void;
}) {
	const alwaysOn = disabled && checked;
	return (
		<div className="flex items-start justify-between gap-4 px-6 py-4">
			<div className="min-w-0">
				<p className="text-sm font-medium">{label}</p>
				<p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
				<p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground/70">
					{partners}
				</p>
			</div>
			{alwaysOn ? (
				<BadgeAlwaysActive />
			) : (
				<Switch
					checked={checked}
					onCheckedChange={(v) => onCheckedChange?.(v)}
					disabled={disabled}
					className={cn("shrink-0", onCheckedChange && "cursor-pointer")}
					aria-label={`${label} cookies`}
				/>
			)}
		</div>
	);
}

function BadgeAlwaysActive() {
	return (
		<Badge variant="secondary" className="shrink-0">
			Always active
		</Badge>
	);
}

// Re-exported for consumers that need programmatic checks.
export { CONSENT_COOKIE, hasCategory, openConsentDialog };
