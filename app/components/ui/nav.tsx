"use client";

import { useEffect, useState } from "react";
import {
  useScroll,
  useMotionValueEvent,
  useReducedMotion,
  AnimatePresence,
  motion,
} from "framer-motion";
import { Menu, X } from "lucide-react";
import { ThemeSwitch } from "../../theme/themeswitch";
import { SoundToggle } from "./sound";
import { cn } from "../../lib/utils";
import { FazalSinghWordmark } from "./wordmark";

const links = [
  { label: "about", href: "#about" },
  { label: "experience", href: "#experience" },
  { label: "work", href: "#work" },
  { label: "contact", href: "#contact" },
];

const RESUME_URL =
  "https://drive.google.com/file/d/1MJR8sR_qA4PdD--87i3S1TgetXMgnkwn/view?usp=sharing";

export default function Nav() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (v) => {
    // stay transparent over the dark hero and the dark footer
    const footer = document.getElementById("contact");
    const overFooter = footer ? v + 64 >= footer.offsetTop : false;
    setScrolled(v > window.innerHeight * 0.7 && !overFooter);
  });

  // lock page scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const solid = scrolled || open;

  return (
    <motion.header
      initial={reduce ? { opacity: 0 } : { y: "-100%" }}
      animate={reduce ? { opacity: 1 } : { y: 0 }}
      transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        open
          ? "bg-bone text-ink dark:bg-ink dark:text-bone"
          : scrolled
          ? "bg-bone/85 text-ink backdrop-blur-md dark:bg-ink/85 dark:text-bone"
          : "bg-transparent text-bone"
      )}
    >
      <nav className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 md:px-8">
        <a
          href="#top"
          onClick={() => setOpen(false)}
          className="transition-opacity duration-200 hover:opacity-60 text-current flex items-center"
        >
          <FazalSinghWordmark className="h-[11px] w-auto text-current" />
        </a>

        <div className="flex items-center">
          <div className="mr-7 hidden items-center gap-7 md:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  "text-[15px] font-medium transition-colors duration-200",
                  solid
                    ? "text-ash hover:text-ink dark:text-smoke dark:hover:text-bone"
                    : "text-smoke hover:text-bone"
                )}
              >
                {link.label}
              </a>
            ))}
          </div>
          <a
            href={RESUME_URL}
            target="_blank"
            rel="noreferrer"
            className={cn(
              "hidden text-[15px] font-medium underline underline-offset-4 transition-colors duration-200 md:block",
              solid
                ? "decoration-ink/40 hover:decoration-ink dark:decoration-bone/40 dark:hover:decoration-bone"
                : "decoration-bone/40 hover:decoration-bone"
            )}
          >
            resume
          </a>
          {/* icon buttons carry p-2, so margins are tuned for equal visual gaps */}
          <div className="-mr-2 flex items-center gap-3 md:ml-5">
            <SoundToggle
              className={cn(
                solid
                  ? "text-ash dark:text-smoke"
                  : "text-smoke hover:text-bone"
              )}
            />
            <ThemeSwitch
              className={cn(
                solid
                  ? "text-ash dark:text-smoke"
                  : "text-smoke hover:text-bone"
              )}
            />

            {/* mobile menu toggle */}
            <button
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className={cn(
                "p-2 md:hidden",
                solid ? "text-ash dark:text-smoke" : "text-smoke"
              )}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* mobile menu panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 bottom-0 top-16 z-40 flex flex-col justify-between overflow-y-auto bg-bone px-4 pb-10 pt-6 text-ink dark:bg-ink dark:text-bone md:hidden"
          >
            <div className="flex flex-col">
              {links.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.05, duration: 0.3 }}
                  className="border-b border-ink/10 py-5 font-display text-4xl uppercase tracking-tight dark:border-bone/10"
                >
                  {link.label}
                </motion.a>
              ))}
            </div>

            <motion.a
              href={RESUME_URL}
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className="mt-10 w-fit text-lg font-medium underline decoration-ink/40 underline-offset-4 dark:decoration-bone/40"
            >
              resume &#8599;
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
