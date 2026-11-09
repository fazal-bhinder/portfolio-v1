"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ACT,
  ActCard,
  GAP,
  Readout,
  Rise,
  SHELL,
  Words,
  useReduce,
} from "../components/ui/motion";
import { Planet, type PlanetLook } from "../components/ui/planet";

const HOME: PlanetLook = {
  kind: "ocean",
  colors: ["#06204f", "#1c6fb8", "#f2f6ff"],
  glow: "#6fb4ff",
  seed: 8,
};

// every figure here comes straight from data/experience.ts
const telemetry = [
  {
    label: "Search quality",
    value: "+54.5%",
    note: "Retrieval (MRR), after I rebuilt search on full-text and embeddings.",
  },
  {
    label: "Image weight",
    value: "-33%",
    note: "Carpetstory image payloads, with a custom CDN loader.",
  },
  {
    label: "Leads found",
    value: "2,581",
    note: "Verified B2B contacts, from automated research.",
  },
  {
    label: "Ingestion time",
    value: "<30s",
    note: "Large Jira and GitHub payloads. It used to take minutes.",
  },
];

/** Act I. Where the voyage starts: the home world, and who is leaving it. */
export default function AboutMe() {
  const reduce = useReduce();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const drift = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);

  return (
    <section ref={ref} id="origin" className={`${SHELL} ${ACT}`}>
      <ActCard act="Act I" title="Origin" />

      <div className="mt-6 grid grid-cols-1 items-center gap-x-8 gap-y-8 md:mt-10 md:grid-cols-12">
        <div className="md:col-span-7">
          <Words
            text="I’m a full stack engineer based in India. I take products from the first commit to the day real people depend on them."
            className="text-[6.6vw] font-light leading-[1.2] tracking-[-0.01em] md:text-[3.2vw] min-[1400px]:text-[45px]"
          />

          <Rise className="mt-8 max-w-xl space-y-4 text-base font-light leading-relaxed text-star/70 md:mt-10 md:text-lg">
            <p>
              Today I build at House of Dotone: the Carpetstory store, the
              backend of an AI marketing platform, and a CRM two companies run
              their sales on. Mostly Python, TypeScript and Postgres.
            </p>
            <p>
              Off the clock it’s movies,{" "}
              <a
                href="https://open.spotify.com/playlist/3E0Dt0p8hGw0Qprxp6KJ1u?si=45rNyaV6RPyzOen_mAXCDQ&pi=gKmJTgo7RBCvh"
                target="_blank"
                rel="noreferrer"
                className="text-star underline decoration-ion decoration-1 underline-offset-4 transition-colors duration-300 hover:text-ion"
              >
                muzic
              </a>
              , and side projects like a trading desk run by AI agents.
            </p>
          </Rise>
        </div>

        {/* home, seen from orbit */}
        <motion.div
          style={reduce ? undefined : { y: drift }}
          className="order-first mx-auto w-[min(80vw,23rem)] md:order-none md:col-span-5 md:w-full md:max-w-[540px]"
        >
          <Planet look={HOME} />
          <p className="-mt-2 text-center font-mono text-[11px] uppercase tracking-[0.25em] text-dim">
            Home. Drag to spin.
          </p>
        </motion.div>
      </div>

      {/* instrument panel */}
      <dl className={`${GAP} grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4 lg:gap-x-10`}>
        {telemetry.map((reading, i) => (
          <Rise key={reading.label} delay={i * 0.08} className="border-t border-line pt-5">
            <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-dim">
              {reading.label}
            </dt>
            <dd className="mt-4 font-mono text-[10vw] font-medium leading-none tracking-[-0.04em] sm:text-5xl lg:text-[3.8vw] min-[1400px]:text-[56px]">
              <Readout value={reading.value} />
            </dd>
            <dd className="mt-4 max-w-[28ch] text-sm font-light leading-relaxed text-star/60">
              {reading.note}
            </dd>
          </Rise>
        ))}
      </dl>
    </section>
  );
}
