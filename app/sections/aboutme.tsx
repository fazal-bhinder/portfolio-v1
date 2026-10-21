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
          text="i'm a full stack engineer based in India. i like owning a product from the first commit to the day real people use it."
          className="text-2xl font-medium leading-[1.15] tracking-tight md:text-4xl"
        />

        <FadeUp delay={0.15}>
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-ash dark:text-smoke md:text-lg">
            right now i build at House of Dotone: the Carpetstory store, the
            backend of our AI marketing platform, and a CRM that two companies
            run their sales on. before that i helped Psylief ship its first
            product. i work mostly in Python, TypeScript and Postgres.
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
            . the rest of the time i&#39;m building side projects, like a
            trading desk run by AI agents.
          </p>
        </FadeUp>
      </div>
    </section>
  );
}
