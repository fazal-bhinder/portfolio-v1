"use client";

import { experience } from "../data/experience";
import { RevealText, FadeUp } from "../components/ui/reveal";

export default function ProfessionalExperience() {
  return (
    <section
      id="experience"
      className="mx-auto max-w-[1400px] scroll-mt-24 px-4 py-24 md:px-8 md:py-36"
    >
      <RevealText
        as="h2"
        text="Experience"
        className="font-display text-5xl uppercase leading-[0.9] tracking-[-0.03em] md:text-8xl"
      />

      <div className="mt-16 flex flex-col gap-20 md:mt-24">
        {experience.map((exp, idx) => (
          <FadeUp
            key={exp.id}
            delay={idx * 0.08}
            className="grid gap-6 border-t border-ink/15 pt-10 dark:border-bone/15 md:grid-cols-[1fr_2fr] md:gap-12"
          >
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-medium leading-tight tracking-tight md:text-4xl">
                  {exp.company}
                </h3>
                {exp.isActive && (
                  <span
                    title="currently here"
                    className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-accent"
                  />
                )}
              </div>
              <p className="mt-3 text-[15px] text-ash dark:text-smoke">
                {exp.position}
              </p>
              <p className="mt-1 font-label text-xs uppercase text-smoke dark:text-ash">
                {exp.duration}
              </p>
            </div>

            <div className="flex flex-col gap-4 md:pt-2">
              {exp.points ? (
                exp.points.map((point, index) => (
                  <p
                    key={index}
                    className="text-base leading-relaxed text-ash transition-colors duration-300 hover:text-ink dark:text-smoke dark:hover:text-bone"
                  >
                    {point}
                  </p>
                ))
              ) : (
                <p className="text-base leading-relaxed text-ash dark:text-smoke">
                  {exp.description}
                </p>
              )}
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}
