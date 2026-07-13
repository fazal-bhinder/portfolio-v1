"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { RevealText, FadeUp } from "../components/ui/reveal";
import { cn } from "../lib/utils";

export default function AboutMe() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section
      id="about"
      ref={ref}
      className="mx-auto max-w-[1400px] scroll-mt-24 px-4 py-24 md:px-8 md:py-36"
    >
      <div className="grid gap-12 md:grid-cols-[1.7fr_1fr] md:gap-20">
        <div>
          <RevealText
            as="p"
            text="i'm a 23-year-old full stack engineer based in India. i graduated with a B.Tech in Computer Science in July 2025."
            className="text-2xl font-medium leading-[1.15] tracking-tight md:text-4xl"
          />

          <FadeUp delay={0.15}>
            <p className="mt-8 max-w-2xl text-base leading-relaxed text-ash dark:text-smoke md:text-lg">
              from shipping full e-commerce platforms solo to scripting
              automated data pipelines and building dev tooling, i&#39;m just
              as comfortable in FastAPI, in Next.js, or in a three-line Bash
              script running at 6am.
            </p>
          </FadeUp>

          <FadeUp delay={0.25}>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-ash dark:text-smoke md:text-lg">
              i also love to watch movies and jamming to{" "}
              <a
                href="https://open.spotify.com/playlist/3E0Dt0p8hGw0Qprxp6KJ1u?si=45rNyaV6RPyzOen_mAXCDQ&pi=gKmJTgo7RBCvh"
                target="_blank"
                rel="noreferrer"
                className="text-ink underline decoration-2 underline-offset-4 transition-opacity duration-200 hover:opacity-60 dark:text-bone"
              >
                muzic
              </a>
              . you will often find me contributing to open-source or building
              side projects.
            </p>
          </FadeUp>
        </div>

        <FadeUp delay={0.2} className="justify-self-center md:justify-self-end">
          <motion.div style={reduce ? undefined : { y: parallaxY }}>
            <div
              className={cn(
                "h-[300px] w-[240px] cursor-pointer overflow-hidden md:h-[360px] md:w-[280px]",
                "bg-[url(https://i.pinimg.com/736x/31/03/f7/3103f7a4e4fa6302d64c3718935a0bfb.jpg)] bg-cover bg-center",
                "hover:bg-[url(https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExNWlodTF3MjJ3NnJiY3Rlc2J0ZmE0c28yeWoxc3gxY2VtZzA5ejF1NSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/syEfLvksYQnmM/giphy.gif)]",
                "grayscale transition-all duration-500 hover:grayscale-0"
              )}
            />
          </motion.div>
        </FadeUp>
      </div>
    </section>
  );
}
