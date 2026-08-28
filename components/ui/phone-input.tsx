"use client";
import { lookup } from "country-data-list";
import parsePhoneNumber, { isValidPhoneNumber } from "libphonenumber-js";
import { GlobeIcon } from "lucide-react";
import { forwardRef, useEffect, useState } from "react";
import { CircleFlag } from "react-circle-flags";
import { z } from "zod";
import { cn } from "@/lib/utils";

export const phoneSchema = z.string().refine((value) => {
	try {
		return isValidPhoneNumber(value);
	} catch {
		return false;
	}
}, "Invalid phone number");

export type CountryData = {
	alpha2: string;
	alpha3: string;
	countryCallingCodes: string[];
	currencies: string[];
	emoji?: string;
	ioc: string;
	languages: string[];
	name: string;
	status: string;
};

interface PhoneInputProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
	onCountryChange?: (data: CountryData | undefined) => void;
	value?: string;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	placeholder?: string;
	defaultCountry?: string;
	className?: string;
	inline?: boolean;
}

	export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
	(
		{
			className,
			onCountryChange,
			onChange,
			value,
			placeholder,
			defaultCountry,
			inline = false,
			...props
		},
		ref,
	) => {
		const [_countryData, setCountryData] = useState<CountryData | undefined>();
		const [displayFlag, setDisplayFlag] = useState<string>("");
		const [hasInitialized, setHasInitialized] = useState(false);

		const resolveCountry = (code: string) => {
			if (!code) return undefined;
			const lower = code.toLowerCase();
			// alpha-2 (2 chars) uses alpha2, alpha-3 (3 chars) uses alpha3
			const key = lower.length === 3 ? "alpha3" : "alpha2";
			return lookup.countries({ [key]: lower } as never)[0] as CountryData | undefined;
		};

		// Sync flag from current value (E.164 number takes priority over defaultCountry)
		useEffect(() => {
			if (value) {
				try {
					const parsed = parsePhoneNumber(value);
					if (parsed?.country) {
						const cc = parsed.country.toLowerCase();
						setDisplayFlag(cc);
						const info = resolveCountry(cc);
						if (info) setCountryData(info);
						onCountryChange?.(info);
						return;
					}
				} catch {
					// ignore parse errors, fall through to defaultCountry
				}
			}
			// No valid number -> fallback to defaultCountry if provided
			if (defaultCountry) {
				const info = resolveCountry(defaultCountry);
				if (info) {
					setDisplayFlag(info.alpha2.toLowerCase());
					setCountryData(info);
					onCountryChange?.(info);
				} else {
					setDisplayFlag(defaultCountry.toLowerCase());
				}
			} else if (!value) {
				setDisplayFlag("");
				setCountryData(undefined);
			}
		}, [value, defaultCountry]);

		useEffect(() => {
			if (defaultCountry && !value && !hasInitialized) {
				const info = resolveCountry(defaultCountry);
				if (info?.countryCallingCodes?.[0]) {
					const syntheticEvent = {
						target: {
							value: info.countryCallingCodes[0],
						},
					} as React.ChangeEvent<HTMLInputElement>;
					onChange?.(syntheticEvent);
					setHasInitialized(true);
				}
			}
		}, [defaultCountry, onChange, value, hasInitialized]);

		const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			let newValue = e.target.value;

			// Ensure the value starts with "+"
			if (!newValue.startsWith("+")) {
				if (newValue.startsWith("00")) {
					newValue = `+${newValue.slice(2)}`;
				} else {
					newValue = `+${newValue}`;
				}
			}

			try {
				const parsed = parsePhoneNumber(newValue);

				if (parsed?.country) {
					const countryCode = parsed.country;
					setDisplayFlag(countryCode.toLowerCase());
					const countryInfo = resolveCountry(countryCode);
					setCountryData(countryInfo);
					onCountryChange?.(countryInfo);

					const syntheticEvent = {
						...e,
						target: {
							...e.target,
							value: parsed.number,
						},
					} as React.ChangeEvent<HTMLInputElement>;
					onChange?.(syntheticEvent);
				} else {
					onChange?.(e);
					// keep flag from value effect; don't clear here to avoid flicker
				}
			} catch {
				onChange?.(e);
			}
		};

		const inputClasses = cn(
			"flex items-center gap-2 relative bg-transparent transition-colors text-base rounded-lg border border-input px-2.5 h-8 disabled:opacity-50 disabled:cursor-not-allowed md:text-sm focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 dark:bg-input/30 [interpolate-size:allow-keywords]",
			inline && "rounded-l-none w-full",
			className,
		);

		return (
			<div className={inputClasses}>
				{!inline && (
					<div className="w-4 h-4 rounded-full shrink-0 flex items-center justify-center">
						{displayFlag ? (
							<CircleFlag countryCode={displayFlag} height={16} />
						) : (
							<GlobeIcon size={16} />
						)}
					</div>
				)}
				<input
					ref={ref}
					value={value}
					onChange={handlePhoneChange}
					placeholder={placeholder || "Enter number"}
					type="tel"
					autoComplete="tel"
					name="phone"
					className="flex w-full border-none bg-transparent text-base transition-colors placeholder:text-muted-foreground outline-none h-full py-0 p-0 leading-none md:text-sm [interpolate-size:allow-keywords]"
					{...props}
				/>
			</div>
		);
	},
);

PhoneInput.displayName = "PhoneInput";
