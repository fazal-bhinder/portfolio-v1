"use client";

import { motion } from "framer-motion";
import { RevealText, FadeUp } from "../components/ui/reveal";

const groups = [
  {
    title: "languages",
    items: ["TypeScript", "JavaScript", "Python"],
  },
  {
    title: "frameworks",
    items: [
      "React",
      "Next.js",
      "Node.js",
      "FastAPI",
      "Hono.js",
      "Prisma",
      "Tailwind CSS",
      "Framer Motion",
    ],
  },
  {
    title: "infra & tools",
    items: [
      "PostgreSQL",
      "MongoDB",
      "Redis",
      "RabbitMQ",
      "Docker",
      "Cloudflare",
      "Vercel",
      "GitHub Actions",
      "Sanity",
      "Git",
      "Postman",
    ],
  },
];

export default function Skills() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-24 md:px-8 md:py-36">
      <RevealText
        as="h2"
        text="Toolkit"
        className="font-display text-5xl uppercase leading-[0.9] tracking-[-0.03em] md:text-8xl"
      />
      <FadeUp delay={0.1}>
        <p className="mt-4 text-base text-ash dark:text-smoke">
          generally i be with.
        </p>
      </FadeUp>

      <div className="mt-16 grid gap-12 md:mt-24 md:grid-cols-3 md:gap-8">
        {groups.map((group, gi) => (
          <FadeUp key={group.title} delay={gi * 0.1}>
            <h3 className="font-label text-xs uppercase text-smoke dark:text-ash">
              {group.title}
            </h3>
            <ul className="mt-5 flex flex-col gap-2">
              {group.items.map((item) => (
                <motion.li
                  key={item}
                  data-sound
                  whileHover={{ x: 10 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="w-fit cursor-default text-xl font-medium tracking-tight text-ash transition-colors duration-300 hover:text-ink dark:text-smoke dark:hover:text-bone md:text-2xl"
                >
                  {item}
                </motion.li>
              ))}
            </ul>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}
