"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "../../lib/utils";

/**
 * Monolog-style masked text reveal: each word rises out of an
 * overflow-hidden slot, staggered left to right.
 */
export function RevealText({
  text,
  className,
  as: Tag = "div",
  delay = 0,
  once = true,
  stagger = 0.045,
  duration = 0.75,
}: {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "div" | "span";
  delay?: number;
  once?: boolean;
  stagger?: number;
  duration?: number;
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  const MotionTag = motion.create(Tag);

  return (
    <MotionTag
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount: 0.5 }}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
      className={className}
      aria-label={text}
    >
      {words.map((word, i) => (
        <span
          key={i}
          aria-hidden
          className="inline-block overflow-hidden pb-[0.08em] -mb-[0.08em] align-bottom"
        >
          <motion.span
            className="inline-block will-change-transform"
            variants={{
              hidden: reduce ? { opacity: 0 } : { y: "115%" },
              show: reduce
                ? { opacity: 1, transition: { duration: 0.4 } }
                : {
                    y: 0,
                    transition: { duration, ease: [0.16, 1, 0.3, 1] },
                  },
            }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 && <span>&nbsp;</span>}
        </span>
      ))}
    </MotionTag>
  );
}

/** simple fade-up for body copy */
export function FadeUp({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
