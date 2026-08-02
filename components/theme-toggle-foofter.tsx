"use client";

import { useEffect, useState } from "react";
import { useTheme, Theme } from "@/app/providers";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Moon, Sun, Monitor } from "lucide-react";

export function ThemeToggleFooter() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const themeOptions: {
		value: "light" | "dark" | "system";
		icon: React.ReactNode;
		label: string;
	}[] = [
		{
			value: "light",
			icon: <Sun className='h-4 w-4 bg-muted rounded-full' />,
			label: "Light",
		},
		{
			value: "dark",
			icon: <Moon className='h-4 w-4 bg-muted rounded-full' />,
			label: "Dark",
		},
		{
			value: "system",
			icon: <Monitor className='h-4 w-4 bg-muted rounded-full' />,
			label: "System",
		},
	];

	if (!mounted) {
		return (
			<div className='w-auto h-auto p-0.5 backdrop-blur-sm rounded-full px-2'>
				<div className='grid grid-cols-3 gap-1 w-full h-auto rounded-full'>
					{themeOptions.map((option) => (
						<div
							key={option.value}
							className='flex items-center justify-center p-1 rounded-full'
						>
							{option.icon}
						</div>
					))}
				</div>
			</div>
		);
	}

	return (
		<Tabs
			value={theme}
			onValueChange={(value) => setTheme(value as Theme)}
			className='w-auto h-auto p-0.5  backdrop-blur-sm rounded-full px-2 '
		>
			<TabsList className='grid grid-cols-3 gap-1 w-full h-auto  rounded-full'>
				{themeOptions.map((option) => (
					<TabsTrigger
						key={option.value}
						value={option.value}
						className='flex items-center justify-center p-1 cursor-pointer
						rounded-full hover:bg-muted/50
						'
					>
						{option.icon}
					</TabsTrigger>
				))}
			</TabsList>
		</Tabs>
	);
}
