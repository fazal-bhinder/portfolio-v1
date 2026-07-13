"use client";

import { motion } from "framer-motion";
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
        {experience.map((exp) => (
          <div
            key={exp.id}
            className="group/card grid gap-6 border-t border-ink/15 pt-10 transition-colors duration-500 dark:border-bone/15 md:grid-cols-[1fr_2fr] md:gap-12"
          >
            <div>
              <div className="flex items-center gap-3">
                <RevealText
                  as="h3"
                  text={exp.company}
                  className="text-2xl font-medium leading-tight tracking-tight transition-transform duration-500 group-hover/card:translate-x-2 md:text-4xl"
                />
                {exp.isActive && (
                  <motion.span
                    title="currently here"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 300, damping: 15 }}
                    className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-accent"
                  />
                )}
              </div>
              <RevealText
                as="p"
                text={exp.position}
                delay={0.15}
                className="mt-3 text-[15px] text-ash dark:text-smoke"
              />
              <FadeUp delay={0.3}>
                <p className="mt-1 font-label text-xs uppercase text-smoke dark:text-ash">
                  {exp.duration}
                </p>
              </FadeUp>
            </div>

            <div className="flex flex-col gap-4 md:pt-2">
              {(exp.points ?? [exp.description ?? ""]).map((point, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, x: 28 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.15 + index * 0.09,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileHover={{ x: 10 }}
                  className="cursor-default border-l-2 border-ink/15 pl-4 text-base leading-relaxed text-ash transition-colors duration-300 hover:border-accent hover:text-ink dark:border-bone/15 dark:text-smoke dark:hover:border-accent dark:hover:text-bone"
                >
                  {point}
                </motion.p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
