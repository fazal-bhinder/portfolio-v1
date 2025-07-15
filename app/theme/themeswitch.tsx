"use client";
import * as React from "react";
import { useTheme } from "next-themes";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";
import { Sun, Moon } from "lucide-react";

const storageKey = "theme-preference";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}

export const ThemeSwitch: React.FC = () => {
  const { setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [currentTheme, setCurrentTheme] = React.useState<"light" | "dark">("light");

  const getColorPreference = (): "light" | "dark" => {
    if (typeof window !== "undefined") {
      const storedPreference = localStorage.getItem(storageKey);
      if (storedPreference) {
        return storedPreference as "light" | "dark";
      }
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return "light";
  };

  const reflectPreference = React.useCallback(
    (theme: "light" | "dark") => {
      setCurrentTheme(theme);
      setTheme(theme);
    },
    [setTheme]
  );

  React.useEffect(() => {
    setMounted(true);
    const initTheme = getColorPreference();
    reflectPreference(initTheme);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const newTheme = mediaQuery.matches ? "dark" : "light";
      localStorage.setItem(storageKey, newTheme);
      reflectPreference(newTheme);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [reflectPreference]);

  const toggleTheme = () => {
    const newTheme = currentTheme === "light" ? "dark" : "light";
    localStorage.setItem(storageKey, newTheme);
    reflectPreference(newTheme);
  };

  if (!mounted) {
    return (
      <span
        className="h-[18px] w-[18px] text-[#1c1c1c] dark:text-[#D4D4D4]"
        aria-hidden="true"
      >
        <Moon size={18} />
      </span>
    );
  }

  return (
    <button
      id="theme-toggle"
      aria-label={`${currentTheme} mode`}
      onClick={toggleTheme}
      className="p-2 rounded-xl cursor-pointer text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-200"
    >
      {currentTheme === "light" ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
};
