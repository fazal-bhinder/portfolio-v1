"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { IconArrowUpRight, IconBrandGithub } from "@tabler/icons-react";
import { projects, type Project } from "../data/projects";
import {
  ACT,
  ActCard,
  LEDE,
  Rise,
  SHELL,
  Title,
  Words,
  useReduce,
} from "../components/ui/motion";
import { Planet, type PlanetLook } from "../components/ui/planet";
import { warp } from "../components/ui/space";

// the first FEATURED projects are worlds; the rest are moons
const FEATURED = 5;

// each world takes its colours from the product it stands for
const LOOKS: Record<string, PlanetLook> = {
  Helm: { kind: "gas", colors: ["#03140d", "#0f6a43", "#5df0ac"], glow: "#3ddc97", seed: 3 },
  "Ameck CRM": { kind: "ocean", colors: ["#071f57", "#1d5fd1", "#f1f5ff"], glow: "#5aa2ff", seed: 11 },
  Carpetstory: { kind: "rock", colors: ["#3a1220", "#a04456", "#f0b8b0"], glow: "#e58a94", seed: 23 },
  "The Spectre": { kind: "ice", colors: ["#39404f", "#a9b4c9", "#ffffff"], glow: "#d7e3ff", seed: 5, ring: true },
  Shallymar: { kind: "gas", colors: ["#3d2a08", "#b98a2e", "#f8e0a2"], glow: "#f2cf7a", seed: 42 },
  "Metadata Remover": { kind: "rock", colors: ["#1f2228", "#6d737d", "#d3d8e0"], glow: "#aab4c4", seed: 14 },
  FontGlitch: { kind: "rock", colors: ["#1d1730", "#5a4a8a", "#c9bdf5"], glow: "#9f8cf0", seed: 31 },
  "Discord Timestamps": { kind: "ice", colors: ["#1b2452", "#5865f2", "#e3e6ff"], glow: "#7f8bff", seed: 9 },
  Sentinel: { kind: "gas", colors: ["#041a1c", "#0f6b6b", "#63e6d6"], glow: "#4fd6c8", seed: 17 },
  TrashAI: { kind: "rock", colors: ["#242424", "#8a8a8a", "#f4f4f4"], glow: "#dcdcdc", seed: 27 },
};
const FALLBACK: PlanetLook = { kind: "rock", colors: ["#1f2228", "#6d737d", "#d3d8e0"], glow: "#aab4c4", seed: 1 };

const host = (url: string) => new URL(url).hostname.replace(/^www\./, "");

/** Act III. A jump to warp, then one world per project. */
export default function Projects() {
  return (
    <section id="worlds" className="overflow-x-clip">
      <Jump />
      {projects.slice(0, FEATURED).map((project, i) => (
        <World key={project.title} project={project} flip={i % 2 === 1} />
      ))}
      <Moons items={projects.slice(FEATURED)} />
    </section>
  );
}

/** the act's title card, held on screen while the stars stretch into a tunnel */
function Jump() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const glow = useTransform(scrollYProgress, [0.25, 0.5, 0.8], [0, 0.5, 0]);
  const glowScale = useTransform(scrollYProgress, [0.25, 0.8], [0.4, 2.2]);

  // thrust peaks mid-scene and is back to zero by the time it ends
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    warp.value = Math.sin(Math.min(Math.max((v - 0.2) / 0.65, 0), 1) * Math.PI);
  });
  useEffect(() => () => void (warp.value = 0), []);

  return (
    <div ref={ref} className="relative h-[150svh] short:h-auto">
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden short:relative short:h-auto short:py-24">
        <motion.div
          aria-hidden
          style={{ opacity: glow, scale: glowScale }}
          className="pointer-events-none absolute left-1/2 top-1/2 -ml-[35vmax] -mt-[35vmax] h-[70vmax] w-[70vmax] rounded-full bg-[radial-gradient(circle,rgb(159_211_255/0.35),transparent_60%)]"
        />
        <div className={`${SHELL} relative`}>
          <ActCard act="Act III" title="Worlds I built" />
          <Words
            text="5 worlds ahead. Each one is something I built and shipped."
            className={LEDE}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * One project, one world: a live globe on one side, the write-up and a real
 * screenshot on the other. Nothing pins, so it reads the same on every screen.
 */
function World({ project, flip }: { project: Project; flip: boolean }) {
  const reduce = useReduce();
  const look = LOOKS[project.title] ?? FALLBACK;

  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // the globe drifts a little against the page, for depth
  const drift = useTransform(scrollYProgress, [0, 1], ["9%", "-9%"]);

  return (
    <article
      ref={ref}
      className={`${SHELL} grid grid-cols-1 items-center gap-x-12 gap-y-2 py-14 md:min-h-[88svh] md:grid-cols-2 md:py-16`}
    >
      {/* wider than its column on purpose: it bleeds toward the screen edge */}
      <motion.div
        style={reduce ? undefined : { y: drift }}
        className={`w-[min(96vw,27rem)] justify-self-center md:w-[min(50vw,84svh)] ${
          flip ? "md:order-2 md:justify-self-start" : "md:justify-self-end"
        }`}
      >
        <Planet look={look} />
      </motion.div>

      <div className="relative min-w-0">
        <Title
          as="h3"
          text={project.title}
          className="text-[8.4vw] font-bold leading-[1.1] tracking-[0.03em] sm:text-4xl md:text-[3.3vw] min-[1400px]:text-[47px]"
        />
        <Rise delay={0.1}>
          <p className="mt-5 max-w-[46ch] text-base font-light leading-relaxed text-star/75 md:mt-6 md:text-lg">
            {project.description}
          </p>
        </Rise>

        {/* the real thing, framed like a view from orbit */}
        <Rise delay={0.15}>
          <figure className="mt-8 max-w-[520px] md:mt-9">
            <figcaption className="mb-3 flex items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.22em] text-dim">
              <span>Surface scan</span>
              {project.liveUrl && <span className="truncate">{host(project.liveUrl)}</span>}
            </figcaption>
            <div className="relative aspect-[16/10] border border-line">
              <Image
                src={project.imageSrc}
                alt={`${project.title} screenshot`}
                fill
                sizes="(min-width: 768px) 520px, 92vw"
                className="object-cover object-top"
              />
              {/* viewfinder corners */}
              {[
                "left-0 top-0 -translate-x-1 -translate-y-1 border-l border-t",
                "right-0 top-0 -translate-y-1 translate-x-1 border-r border-t",
                "bottom-0 left-0 -translate-x-1 translate-y-1 border-b border-l",
                "bottom-0 right-0 translate-x-1 translate-y-1 border-b border-r",
              ].map((corner) => (
                <span key={corner} aria-hidden className={`absolute h-3 w-3 border-ion ${corner}`} />
              ))}
            </div>
          </figure>
        </Rise>

        {project.liveUrl && (
          <Rise delay={0.2}>
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="group mt-8 inline-flex items-center gap-3 border border-star/70 px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.25em] transition-colors duration-500 hover:bg-star hover:text-void"
            >
              Land here
              <span className="sr-only"> on {project.title}</span>
              <IconArrowUpRight aria-hidden
                size={15}
                stroke={1.5}
                className="transition-transform duration-300 ease-out-quint group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
          </Rise>
        )}
      </div>
    </article>
  );
}

/** the smaller side projects, in orbit around the main five */
function Moons({ items }: { items: Project[] }) {
  return (
    <div className={`${SHELL} ${ACT}`}>
      <Rise>
        <p className="flex items-center gap-4 font-mono text-xs uppercase tracking-[0.3em] text-ion">
          <span className="h-px w-10 bg-ion/60" />
          Moons
        </p>
      </Rise>
      <Words text="Smaller side projects, in orbit around the main 5." className={LEDE} />

      <ul className="mt-12 grid gap-x-10 gap-y-12 sm:grid-cols-2 md:mt-16 lg:grid-cols-3 xl:grid-cols-5 xl:gap-x-8">
        {items.map((project, i) => (
          <li key={project.title}>
            <Rise delay={(i % 5) * 0.07} className="flex h-full flex-col">
              {/* the globe is inset in its box; pull it back to the text edge */}
              <Planet look={LOOKS[project.title] ?? FALLBACK} className="-ml-3 w-28" />
              <h3 className="mt-4 font-title text-sm font-bold uppercase leading-snug tracking-[0.12em]">
                {project.title}
              </h3>
              <p className="mt-3 flex-1 text-sm font-light leading-relaxed text-star/65">
                {project.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[11px] uppercase tracking-[0.22em]">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 py-1 text-ion transition-colors duration-300 hover:text-star"
                  >
                    Land
                    <span className="sr-only"> on {project.title}</span>
                    <IconArrowUpRight aria-hidden size={13} stroke={1.5} />
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 py-1 text-dim transition-colors duration-300 hover:text-star"
                  >
                    <IconBrandGithub aria-hidden size={13} stroke={1.5} />
                    Source
                    <span className="sr-only"> for {project.title}</span>
                  </a>
                )}
              </div>
            </Rise>
          </li>
        ))}
      </ul>
    </div>
  );
}
