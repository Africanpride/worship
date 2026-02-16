"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme | null>(null);

  // Initialize theme from localStorage and system preference only on client
  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    const systemPreference = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const initialTheme = stored || systemPreference;
    
    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const htmlElement = document.documentElement;
    if (newTheme === "dark") {
      htmlElement.classList.add("dark");
    } else {
      htmlElement.classList.remove("dark");
    }
    localStorage.setItem("theme", newTheme);
  };

  const toggleTheme = () => {
    if (theme === null) return;
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  // Return provider only when theme is loaded to avoid hydration mismatch
  if (theme === null) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
