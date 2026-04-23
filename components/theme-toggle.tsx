"use client";

import { useTheme } from "@/app/providers";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Monitor } from "lucide-react";

export function ThemeToggle() {
	const { theme, setTheme } = useTheme();

	const themes: {
		value: "light" | "dark" | "system";
		icon: React.ReactNode;
		label: string;
	}[] = [
		{
			value: "light",
			icon: <Moon className='h-[1rem] w-[1rem]' />,
			label: "Light",
		},
		{
			value: "dark",
			icon: <Sun className='h-[1rem] w-[1rem]' />,
			label: "Dark",
		},
		{
			value: "system",
			icon: <Monitor className='h-[1rem] w-[1rem]' />,
			label: "System",
		},
	];

	return (
		<div className='flex items-center gap-1 rounded-full bg-transparent p-1'>
			{themes.map((t) => (
				<Button
					key={t.value}
					variant={theme === t.value ? "default" : "ghost"}
					size='icon'
					onClick={() => setTheme(t.value)}
					className={`h-8 w-8 rounded-full cursor-pointer transition-all ${
						theme === t.value
							? "bg-muted/10 shadow-sm"
							: "hover:bg-muted/80"
					}`}
					aria-label={`Switch to ${t.label} theme`}
				>
					{t.icon}
				</Button>
			))}
		</div>
	);
}