"use client";

import { motion } from "framer-motion";
import { Heart, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "@/components/logo";
import { NavMenu } from "@/components/nav-menu";
import { NavigationSheet } from "@/components/navigation-sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/lib/auth-client";
import { useCurrentSession } from "@/lib/use-current-session";
import { cn } from "@/lib/utils";
import InsideScrollDialog from "./InsideScrollDialog";
import { ThemeToggle } from "./theme-toggle";

const Navbar = () => {
	const { user, isAuthenticated } = useCurrentSession();
	const [scrolledPast, setScrolledPast] = useState(false);
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const threshold = window.innerHeight; // 100dvh equivalent
		const onScroll = () => setScrolledPast(window.scrollY > threshold);
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	useEffect(() => {
		// Breakpoint convention: site chrome/nav switches at lg (1024px). Dashboard sidebar uses md (768px).
		const LG_BREAKPOINT = 1024;
		const check = () => setIsMobile(window.innerWidth < LG_BREAKPOINT);
		check(); // run once on mount
		window.addEventListener("resize", check, { passive: true });
		return () => window.removeEventListener("resize", check);
	}, []);

	const handleLogout = async () => {
		await signOut({
			fetchOptions: {
				onSuccess: () => {
					window.location.href = "/";
				},
			},
		});
	};

	const getInitials = (name?: string | null) => {
		if (!name) return "U";
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	return (
		<nav
			id="navbar"
			className={cn(
				"fixed z-50 mx-auto py-2 h-12 bg-black text-white backdrop-blur-xl transition-all duration-300",
				isMobile
					? "inset-x-0 top-0 border-b border-white/10"
					: "inset-x-2 top-6 rounded-full border border-white/10 shadow-lg",
			)}
			style={{
				maxWidth: isMobile ? "100%" : scrolledPast ? "87vw" : "95vw",
				transition: isMobile
					? "none"
					: "max-width 1.2s cubic-bezier(0.22, 1, 0.36, 1)",
			}}
		>
			<div className="mx-auto flex h-full items-center justify-between sm:pl-2 pr-1">
				<Logo />

				{/* Desktop Menu */}
				<div className="flex-1 flex justify-center">
					<NavMenu className="hidden lg:flex" />
				</div>

				<div className="flex items-center gap-3">
					<InsideScrollDialog>
						<motion.button
							whileHover="hover"
							initial="initial"
							className="relative flex items-center h-9 bg-amber-500 hover:bg-amber-600 text-white rounded-full p-2.5 overflow-hidden shadow-lg shadow-amber-500/20 active:scale-95 transition-colors cursor-pointer hidden sm:flex"
						>
							<Heart className="size-4 fill-white shrink-0" />
							<motion.span
								variants={{
									initial: { width: 0, opacity: 0, marginLeft: 0 },
									hover: { width: "auto", opacity: 1, marginLeft: 8 },
								}}
								transition={{ duration: 0.3, ease: "easeOut" }}
								className="overflow-hidden whitespace-nowrap text-[11px] font-bold uppercase tracking-widest"
							>
								Donate
							</motion.span>
						</motion.button>
					</InsideScrollDialog>
					<ThemeToggle />
					{isAuthenticated && user ? (
						<>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<button className="rounded-full hover:opacity-80 transition-opacity">
										<Avatar className="h-10 w-10">
											<AvatarImage
												src={user.image || ""}
												alt={user.name || ""}
											/>
											<AvatarFallback>{getInitials(user.name)}</AvatarFallback>
										</Avatar>
									</button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="w-56">
									<DropdownMenuLabel className="flex flex-col">
										<span className="font-medium">{user.name}</span>
										<span className="text-xs text-muted-foreground">
											{user.email}
										</span>
									</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuGroup>
										{user.role === "admin" && (
											<DropdownMenuItem asChild>
												<Link href="/dashboard" className="cursor-pointer">
													Dashboard
												</Link>
											</DropdownMenuItem>
										)}
										<DropdownMenuItem asChild>
											<Link href="/profile" className="cursor-pointer">
												Profile
											</Link>
										</DropdownMenuItem>
									</DropdownMenuGroup>
									<DropdownMenuSeparator />
									<DropdownMenuItem onClick={handleLogout}>
										<LogOut className="mr-2 h-4 w-4" />
										Log out
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</>
					) : (
						<Button
							className="hidden px-4 bg-accent text-accent-foreground rounded-full sm:inline-flex"
							variant="outline"
							asChild
						>
							<Link href="/login" className="cursor-pointer">
								Sign In
							</Link>
						</Button>
					)}

					{/* {isAuthenticated && user?.role === "admin" && (
            <Button
              className='rounded-full'
              asChild
            >
              <Link
                transitionTypes={["slide"]}
                href="/dashboard"
              >
                Dashboard
              </Link>
            </Button>
          )} */}

					{/* Mobile Menu */}
					<div className="lg:hidden">
						<NavigationSheet />
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
