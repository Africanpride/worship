"use client";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { NavMenu } from "@/components/nav-menu";
import { NavigationSheet } from "@/components/navigation-sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { useCurrentSession } from "@/lib/use-current-session";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings } from "lucide-react";
import { signOut } from "@/lib/auth-client";
import Link from "next/link";
import { useState, useEffect } from "react";

const Navbar = () => {
  const { user, isAuthenticated } = useCurrentSession();
  const [scrolledPast, setScrolledPast] = useState(false);

  useEffect(() => {
    const threshold = window.innerHeight; // 100dvh equivalent
    const onScroll = () => setScrolledPast(window.scrollY > threshold);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
      className='fixed z-50 inset-x-0 top-0 md:inset-x-2 md:top-6 mx-auto h-14 md:rounded-full bg-black text-white backdrop-blur-xl border-b md:border border-white/10 shadow-lg'
      style={{
        maxWidth: scrolledPast ? '72vw' : '96vw',
        transition: 'max-width 1.2s cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      <div className='mx-auto flex h-full items-center justify-between px-2'>
        <Logo />

        {/* Desktop Menu */}
        <NavMenu className='hidden md:flex' />

        <div className='flex items-center gap-3'>
          <ThemeToggle />
          {isAuthenticated && user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className='rounded-full hover:opacity-80 transition-opacity'>
                    <Avatar className='h-8 w-8'>
                      <AvatarImage
                        src={user.image || ""}
                        alt={user.name || ""}
                      />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align='end'
                  className='w-56'
                >
                  <DropdownMenuLabel className='flex flex-col'>
                    <span className='font-medium'>{user.name}</span>
                    <span className='text-xs text-muted-foreground'>
                      {user.email}
                    </span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    {user.role === "admin" && (
                      <DropdownMenuItem asChild>
                        <Link href='/dashboard'>Dashboard</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link href='/profile'>Profile</Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className='mr-2 h-4 w-4' />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button
              className='hidden px-4 bg-accent text-accent-foreground rounded-full sm:inline-flex'
              variant='outline'
              asChild
            >
              <Link href='/login'>Sign In</Link>
            </Button>
          )}

          {(!isAuthenticated || user?.role === "admin") && (
            <Button
              className='rounded-full'
              asChild
            >
              <Link
                transitionTypes={["slide"]}
                href={isAuthenticated ? "/dashboard" : "/signup"}
              >
                {isAuthenticated ? "Dashboard" : "Get Started"}
              </Link>
            </Button>
          )}

          {/* Mobile Menu */}
          <div className='md:hidden'>
            <NavigationSheet />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
