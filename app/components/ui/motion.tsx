"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import Lenis from "lenis";
import { MotionConfig, cancelFrame, frame, motion, useInView } from "framer-motion";
import { cn } from "../../lib/utils";

export const EASE = [0.22, 1, 0.36, 1] as const;

/*
 * One rhythm for every act, so spacing never drifts between sections:
 * SHELL  the page column and its side gutters
 * ACT    an act's vertical breathing room
 * LEDE   the narration line under an act title
 * GAP    the space between an act's header and its body
 */
export const SHELL = "mx-auto w-full max-w-[1400px] px-5 md:px-10";
export const ACT = "py-24 md:py-40";
export const LEDE =
  "mt-8 max-w-xl text-lg font-light leading-relaxed text-star/70 md:mt-10 md:text-2xl md:leading-relaxed";
export const GAP = "mt-14 md:mt-24";

const REDUCE = "(prefers-reduced-motion: reduce)";

/**
 * Reduced-motion preference that is safe to branch markup on: false on the
 * server and during hydration, then the real value.
 */
export function useReduce(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(REDUCE);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(REDUCE).matches,
    () => false
  );
}

/** a media query as state; false on the server and during hydration */
export function useMedia(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}

/**
 * Motion root: smooth scrolling plus the global reduced-motion policy
 * (transform animations become instant, opacity still fades).
 */
export function MotionRoot({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (window.matchMedia(REDUCE).matches) return;

    const lenis = new Lenis({ lerp: 0.1, anchors: true });

    // one clock: Lenis ticks on Motion's frame loop, so scroll position and
    // every scroll-linked transform update in the same frame
    const update = ({ timestamp }: { timestamp: number }) => lenis.raf(timestamp);
    frame.update(update, true);

    return () => {
      cancelFrame(update);
      lenis.destroy();
    };
  }, []);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

/**
 * Film title, styled by .title in globals.css.
 * anim="load" plays on page load from CSS alone (no hydration wait);
 * anim="view" plays when scrolled into view.
 */
export function Title({
  text,
  as: Tag = "h2",
  className,
  anim = "view",
  delay = 0,
}: {
  text: string;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  anim?: "load" | "view";
  delay?: number;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const words = text.split(" ");

  let index = 0;
  return (
    <Tag
      ref={ref}
      aria-label={text}
      data-anim={anim}
      data-in={anim === "view" && inView ? "" : undefined}
      style={{ "--delay": `${delay}ms` } as React.CSSProperties}
      className={cn("title font-title uppercase", className)}
    >
      {words.map((word, w) => (
        <span key={w} aria-hidden className="inline-block whitespace-nowrap">
          {Array.from(word).map((char) => {
            const i = index++;
            return (
              <span key={i} data-l style={{ "--i": i } as React.CSSProperties}>
                {char}
              </span>
            );
          })}
          {w < words.length - 1 && <span>&nbsp;</span>}
        </span>
      ))}
    </Tag>
  );
}

/** narration: words come into focus one after another, like a subtitle */
export function Words({
  text,
  className,
  delay = 0,
  play,
}: {
  text: string;
  className?: string;
  delay?: number;
  /** drive manually; omit to play when scrolled into view */
  play?: boolean;
}) {
  const trigger =
    play === undefined
      ? { whileInView: "show", viewport: { once: true, amount: 0.4 } }
      : { animate: play ? "show" : "hidden" };

  return (
    <motion.p
      initial="hidden"
      {...trigger}
      transition={{ staggerChildren: 0.035, delayChildren: delay }}
      className={className}
    >
      {text.split(" ").map((word, i) => (
        <motion.span
          key={i}
          className="inline-block"
          variants={{
            hidden: { opacity: 0, filter: "blur(10px)", y: 10 },
            show: {
              opacity: 1,
              filter: "blur(0px)",
              y: 0,
              transition: { duration: 0.9, ease: EASE },
            },
          }}
        >
          {word}
          {" "}
        </motion.span>
      ))}
    </motion.p>
  );
}

/** fade and rise, for blocks */
export function Rise({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.9, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Instrument readout: digits flicker through noise and lock in left to right
 * once the value scrolls into view. Writes straight to the DOM.
 */
export function Readout({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 1 });
  const reduce = useReduce();

  useEffect(() => {
    const el = ref.current;
    if (!inView || reduce || !el) return;

    const chars = Array.from(value);
    const start = performance.now();
    const DURATION = 1300;
    let raf = 0;

    const tick = (now: number) => {
      const t = Math.min((now - start) / DURATION, 1);
      const locked = Math.floor(t * chars.length);
      el.textContent = chars
        .map((ch, i) =>
          i < locked || !/\d/.test(ch) ? ch : String(Math.floor(Math.random() * 10))
        )
        .join("");
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      el.textContent = value;
    };
  }, [inView, reduce, value]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {value}
    </span>
  );
}

/** the small label that opens every act */
export function ActCard({ act, title }: { act: string; title: string }) {
  return (
    <div>
      <Rise>
        <p className="flex items-center gap-4 font-mono text-xs uppercase tracking-[0.3em] text-ion">
          <span className="h-px w-10 bg-ion/60" />
          {act}
        </p>
      </Rise>
      <Title
        text={title}
        className="mt-6 text-[7.4vw] font-bold leading-[1.1] tracking-[0.04em] md:text-[5.4vw] min-[1400px]:text-[76px]"
      />
    </div>
  );
}
