"use client";

import { RevealText, FadeUp } from "../components/ui/reveal";

export default function AboutMe() {
  return (
    <section
      id="about"
      className="mx-auto max-w-[1400px] scroll-mt-24 px-4 py-24 md:px-8 md:py-36"
    >
      <div className="max-w-4xl">
        <RevealText
          as="p"
          text="i'm a 23-year-old full stack engineer based in India. i graduated with a B.Tech in Computer Science in July 2025."
          className="text-2xl font-medium leading-[1.15] tracking-tight md:text-4xl"
        />

        <FadeUp delay={0.15}>
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-ash dark:text-smoke md:text-lg">
            from shipping full e-commerce platforms solo to scripting
            automated data pipelines and building dev tooling, i&#39;m just as
            comfortable in FastAPI, in Next.js, or in a three-line Bash script
            running at 6am.
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
    </section>
  );
}
