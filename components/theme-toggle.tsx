"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "@/app/providers";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
	const { theme, toggleTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	return (
		<Button
			variant="ghost"
			size="icon"
			onClick={toggleTheme}
			className="rounded-full cursor-pointer"
			aria-label="Toggle theme"
		>
			{mounted ? (
				theme === "light" ? (
					<Moon className="h-[1.2rem] w-[1.2rem]" />
				) : (
					<Sun className="h-[1.2rem] w-[1.2rem]" />
				)
			) : (
				<Moon className="h-[1.2rem] w-[1.2rem]" />
			)}
		</Button>
	);
}
