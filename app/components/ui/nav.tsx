"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { IconArrowUpRight } from "@tabler/icons-react";
import { SoundToggle } from "./sound";
import { RESUME_URL } from "../../data/links";

export const acts = [
  { id: "origin", numeral: "I", name: "Origin" },
  { id: "log", numeral: "II", name: "Flight log" },
  { id: "worlds", numeral: "III", name: "Worlds" },
  { id: "instruments", numeral: "IV", name: "Instruments" },
  { id: "transmission", numeral: "V", name: "Transmission" },
];

/**
 * The heads-up display: who made this, which act you are in, and how far
 * through the voyage you are. It is also the navigation.
 */
export default function Nav() {
  const [active, setActive] = useState<string | null>(null);
  const percent = useRef<HTMLSpanElement>(null);
  const { scrollYProgress } = useScroll();

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (percent.current)
      percent.current.textContent = String(Math.round(v * 100)).padStart(3, "0");
  });

  useEffect(() => {
    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        // acts never overlap the middle line, so at most one is "visible"
        const id = acts.find((act) => visible.has(act.id))?.id ?? null;
        setActive(id);
        // globals.css shifts the nebula colour per act
        document.documentElement.dataset.act = id ?? "";
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );
    for (const act of acts) {
      const section = document.getElementById(act.id);
      if (section) observer.observe(section);
    }
    return () => observer.disconnect();
  }, []);

  const current = acts.find((act) => act.id === active);

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.6, delay: 2.2 }}
      className="pointer-events-none fixed inset-0 z-50 font-mono text-[11px] uppercase tracking-[0.22em]"
    >
      {/* top: the letterbox edge */}
      <div className="flex items-center justify-between bg-gradient-to-b from-void from-45% to-transparent px-5 pb-10 pt-5 md:px-10">
        <a
          href="#top"
          translate="no"
          className="pointer-events-auto font-title text-[11px] font-bold tracking-[0.35em] transition-opacity duration-300 hover:opacity-60"
        >
          Fazal Singh
        </a>
        <div className="pointer-events-auto flex items-center gap-6 text-dim">
          <SoundToggle className="flex items-center gap-2 transition-colors duration-300 hover:text-star" />
          <a
            href={RESUME_URL}
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-1 transition-colors duration-300 hover:text-star sm:flex"
          >
            Resume
            <IconArrowUpRight aria-hidden size={13} stroke={1.5} />
          </a>
        </div>
      </div>

      {/* right: one tick per act. Not on phones: there it sat on top of the
          text's right edge, and the ticks were too small to tap anyway */}
      <nav
        aria-label="Acts"
        className="pointer-events-auto absolute right-2 top-1/2 hidden -translate-y-1/2 flex-col items-end md:flex"
      >
        {acts.map((act) => {
          const on = act.id === active;
          return (
            <a
              key={act.id}
              href={`#${act.id}`}
              aria-current={on ? "true" : undefined}
              aria-label={`Act ${act.numeral}: ${act.name}`}
              className="group flex items-center gap-3 py-3.5 pl-9 md:py-2.5 md:pl-0"
            >
              <span
                className="hidden translate-x-2 bg-void/80 px-2 py-1 text-star opacity-0 transition-[opacity,transform] duration-500 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 md:block"
              >
                {act.name}
              </span>
              <span
                className={`h-px transition-[width,background-color] duration-500 ease-out-quint ${
                  on ? "w-3.5 bg-ion md:w-6" : "w-2 bg-star/40 group-hover:bg-star md:w-3 md:group-hover:w-5"
                }`}
              />
            </a>
          );
        })}
      </nav>

      {/* bottom: where you are */}
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-void from-45% to-transparent px-5 pb-5 pt-12 text-dim md:px-10">
        <p>
          {current ? (
            <>
              <span className="text-ion">Act {current.numeral}</span>
              <span className="mx-3 text-star/30">/</span>
              {current.name}
            </>
          ) : (
            "Prologue"
          )}
        </p>
        <p>
          <span className="hidden sm:inline">Voyage </span>
          <span ref={percent} className="text-star">
            000
          </span>
          %
        </p>
      </div>
      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="absolute inset-x-0 bottom-0 h-px origin-left bg-ion"
      />
    </motion.header>
  );
}
