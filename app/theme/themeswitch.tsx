"use client";

import * as React from "react";
import { flushSync } from "react-dom";
import { useTheme, ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";
import { IconMoon, IconSun } from "@tabler/icons-react";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider storageKey="theme" {...props}>
      {children}
    </NextThemesProvider>
  );
}

export function ThemeSwitch({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const dark = mounted && resolvedTheme === "dark";

  const toggle = () => {
    const next = dark ? "light" : "dark";
    // the browser cross-fades the whole page between the two themes
    if (
      document.startViewTransition &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      document.startViewTransition(() => flushSync(() => setTheme(next)));
    } else {
      setTheme(next);
    }
  };

  return (
    <button
      id="theme-toggle"
      aria-label={`Switch to ${dark ? "light" : "dark"} mode`}
      onClick={toggle}
      className={className}
    >
      {dark ? <IconSun size={18} stroke={1.75} /> : <IconMoon size={18} stroke={1.75} />}
    </button>
  );
}
