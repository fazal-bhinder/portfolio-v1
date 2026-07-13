"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { projects } from "../data/projects";
import { RevealText, FadeUp } from "../components/ui/reveal";

export default function Projects() {
  const [active, setActive] = useState<number | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 25 });
  const springY = useSpring(y, { stiffness: 200, damping: 25 });

  const handleMouseMove = (e: React.MouseEvent) => {
    x.set(e.clientX + 28);
    y.set(e.clientY - 110);
  };

  return (
    <section
      id="work"
      className="mx-auto max-w-[1400px] scroll-mt-24 px-4 py-24 md:px-8 md:py-36"
    >
      <RevealText
        as="h2"
        text="Selected Work"
        className="font-display text-5xl uppercase leading-[0.9] tracking-[-0.03em] md:text-8xl"
      />
      <FadeUp delay={0.1}>
        <p className="mt-4 text-base text-ash dark:text-smoke">
          proof of work.
        </p>
      </FadeUp>

      <div
        className="mt-16 md:mt-24"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setActive(null)}
      >
        {projects.map((project, i) => (
          <FadeUp key={project.title} delay={Math.min(i * 0.05, 0.2)}>
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              onMouseEnter={() => setActive(i)}
              className="group grid grid-cols-[auto_1fr] items-center gap-5 border-t border-ink/15 py-7 last:border-b last:border-ink/15 dark:border-bone/15 dark:last:border-bone/15 md:grid-cols-[1fr_auto] md:gap-8 md:py-9"
            >
              {/* mobile thumbnail; on desktop the floating preview takes over */}
              <div className="relative h-16 w-24 shrink-0 overflow-hidden lg:hidden">
                <Image
                  src={project.imageSrc}
                  alt={project.title}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </div>

              <div className="min-w-0">
                <h3 className="text-2xl font-medium leading-tight tracking-tight text-ash transition-all duration-300 group-hover:translate-x-3 group-hover:text-ink dark:text-smoke dark:group-hover:text-bone md:text-5xl">
                  {project.title}
                </h3>
                <p className="mt-2 hidden max-w-xl text-sm leading-relaxed text-smoke transition-colors duration-300 group-hover:text-ash dark:text-ash dark:group-hover:text-smoke md:block">
                  {project.description}
                </p>

                {/* live/github links, visible only on mobile */}
                <div className="mt-1.5 flex items-center gap-4 md:hidden">
                  <span className="text-[13px] text-smoke dark:text-ash">
                    live &#8599;&#xFE0E;
                  </span>
                  <span
                    role="link"
                    tabIndex={0}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      window.open(project.githubUrl, "_blank", "noopener");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        e.stopPropagation();
                        window.open(project.githubUrl, "_blank", "noopener");
                      }
                    }}
                    className="text-[13px] text-smoke dark:text-ash"
                  >
                    github &#8599;&#xFE0E;
                  </span>
                </div>
              </div>

              <div className="hidden items-center gap-6 md:flex">
                <span className="text-[15px] text-smoke transition-all duration-300 group-hover:translate-x-1 group-hover:text-ink dark:text-ash dark:group-hover:text-bone">
                  live &#8599;&#xFE0E;
                </span>
                <span
                  role="link"
                  tabIndex={0}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.open(project.githubUrl, "_blank", "noopener");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      e.stopPropagation();
                      window.open(project.githubUrl, "_blank", "noopener");
                    }
                  }}
                  className="text-[15px] text-smoke transition-colors duration-300 hover:text-ink dark:text-ash dark:hover:text-bone"
                >
                  github &#8599;&#xFE0E;
                </span>
              </div>
            </a>
          </FadeUp>
        ))}
      </div>

      {/* cursor-following preview, desktop only */}
      <motion.div
        style={{ x: springX, y: springY }}
        animate={{ opacity: active !== null ? 1 : 0, scale: active !== null ? 1 : 0.92 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="pointer-events-none fixed left-0 top-0 z-40 hidden h-[220px] w-[320px] overflow-hidden lg:block"
      >
        {projects.map((project, i) => (
          <Image
            key={project.title}
            src={project.imageSrc}
            alt=""
            fill
            sizes="320px"
            className={`object-cover transition-opacity duration-200 ${
              i === active ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </motion.div>
    </section>
  );
}
