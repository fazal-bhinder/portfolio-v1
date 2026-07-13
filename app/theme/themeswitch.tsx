"use client";
import * as React from "react";
import { useTheme } from "next-themes";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";
import { Sun, Moon } from "lucide-react";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      storageKey="theme"
      disableTransitionOnChange={false}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}

export const ThemeSwitch: React.FC<{ className?: string }> = ({ className }) => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const next = (resolvedTheme === "dark" ? "light" : "dark") as "light" | "dark";
    setTheme(next);
  };

  if (!mounted) {
    return (
      <div className="p-2 rounded-xl">
        <div className="h-[18px] w-[18px] bg-zinc-300 animate-pulse rounded" />
      </div>
    );
  }

  return (
    <button
      id="theme-toggle"
      aria-label={`Switch to ${resolvedTheme === "light" ? "dark" : "light"} mode`}
      onClick={toggleTheme}
      className={`p-2 cursor-pointer hover:text-accent dark:hover:text-accent transition-colors duration-200 ${
        className ?? "text-zinc-600 dark:text-zinc-400"
      }`}
    >
      {resolvedTheme === "light" ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
};