"use client";

import { useState } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { ThemeSwitch } from "../../theme/themeswitch";
import { SoundToggle } from "./sound";
import { cn } from "../../lib/utils";

const links = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Work", href: "#work" },
  { label: "Contact", href: "#contact" },
];

export default function Nav() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (v) => {
    setScrolled(v > window.innerHeight * 0.7);
  });

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled
          ? "bg-bone/85 text-ink backdrop-blur-md dark:bg-ink/85 dark:text-bone"
          : "bg-transparent text-bone"
      )}
    >
      <nav className="relative mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 md:px-8">
        <a
          href="#top"
          className="font-display text-sm uppercase tracking-tight transition-opacity duration-200 hover:opacity-60"
        >
          Fazal Singh
        </a>

        {/* centered links, monolog style */}
        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-6 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                "text-[15px] font-medium transition-colors duration-200",
                scrolled
                  ? "text-ash hover:text-ink dark:text-smoke dark:hover:text-bone"
                  : "text-smoke hover:text-bone"
              )}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <SoundToggle
            className={cn(
              scrolled
                ? "text-ash dark:text-smoke"
                : "text-smoke hover:text-bone"
            )}
          />
          <ThemeSwitch
            className={cn(
              scrolled
                ? "text-ash dark:text-smoke"
                : "text-smoke hover:text-bone"
            )}
          />
          <a
            href="https://drive.google.com/file/d/1MJR8sR_qA4PdD--87i3S1TgetXMgnkwn/view?usp=sharing"
            target="_blank"
            rel="noreferrer"
            className={cn(
              "px-3.5 py-1.5 text-[15px] font-medium transition-all duration-200 hover:opacity-80",
              scrolled
                ? "bg-ink text-bone dark:bg-bone dark:text-ink"
                : "bg-bone text-ink"
            )}
          >
            Resume &#8599;
          </a>
        </div>
      </nav>
    </header>
  );
}
