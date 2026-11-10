"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useSpring, useTransform } from "framer-motion";
import { IconPlus } from "@tabler/icons-react";
import { experience } from "../data/experience";
import { ACT, ActCard, EASE, GAP, LEDE, Rise, SHELL, Words } from "../components/ui/motion";

// the data lists newest first; a flight log reads in the order it was flown
const waypoints = [...experience].reverse();

/*
 * The route is one quadratic curve in a 1000 x 200 box. Waypoints sit at
 * fixed fractions along it, and the craft is wherever `t` currently is.
 */
const P0 = [0, 176] as const;
const P1 = [520, -60] as const;
const P2 = [1000, 118] as const;
const STOPS = waypoints.map((_, i) => 0.26 + (i * 0.46) / Math.max(waypoints.length - 1, 1));

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const at = (t: number) => {
  const x = lerp(lerp(P0[0], P1[0], t), lerp(P1[0], P2[0], t), t);
  const y = lerp(lerp(P0[1], P1[1], t), lerp(P1[1], P2[1], t), t);
  return [x, y] as const;
};
/** the curve from its start up to t, as its own path (de Casteljau split) */
const flown = (t: number) => {
  const [x, y] = at(t);
  return `M${P0[0]} ${P0[1]} Q${lerp(P0[0], P1[0], t)} ${lerp(P0[1], P1[1], t)} ${x} ${y}`;
};

/** Act II. The route so far. Pick a waypoint and the craft flies to it. */
export default function ProfessionalExperience() {
  // start at the current posting
  const [active, setActive] = useState(waypoints.length - 1);
  const [fullLog, setFullLog] = useState(false);
  const job = waypoints[active];

  const t = useSpring(STOPS[active], { stiffness: 55, damping: 17 });
  useEffect(() => {
    t.set(STOPS[active]);
    setFullLog(false);
  }, [active, t]);

  const path = useTransform(t, flown);
  const craftLeft = useTransform(t, (v) => `${at(v)[0] / 10}%`);
  const craftTop = useTransform(t, (v) => `${at(v)[1] / 2}%`);

  const step = (e: React.KeyboardEvent, i: number) => {
    const next =
      e.key === "ArrowRight" ? i + 1 : e.key === "ArrowLeft" ? i - 1 : -1;
    if (next < 0 || next >= waypoints.length) return;
    e.preventDefault();
    setActive(next);
    document.getElementById(`waypoint-${next}`)?.focus();
  };

  return (
    <section id="log" className={`${SHELL} ${ACT}`}>
      <ActCard act="Act II" title="Flight log" />
      <Words text="2 postings so far. Pick a waypoint to read its log." className={LEDE} />

      {/* the trajectory: a row of tabs drawn as a flight path */}
      <Rise className={GAP}>
        <div
          role="tablist"
          aria-label="Postings"
          className="relative mx-auto aspect-[5/2] w-full sm:aspect-[4/1] lg:aspect-[5/1]"
        >
          <svg
            aria-hidden
            viewBox="0 0 1000 200"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full overflow-visible"
          >
            <path
              d={`M${P0[0]} ${P0[1]} Q${P1[0]} ${P1[1]} ${P2[0]} ${P2[1]}`}
              fill="none"
              stroke="var(--star)"
              strokeOpacity={0.28}
              strokeDasharray="2 7"
              vectorEffect="non-scaling-stroke"
            />
            <motion.path
              d={path}
              fill="none"
              stroke="var(--ion)"
              strokeWidth={1.5}
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          <motion.span
            aria-hidden
            style={{ left: craftLeft, top: craftTop }}
            className="pointer-events-none absolute z-10 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-ion shadow-[0_0_22px_6px_rgb(159_211_255/0.65)]"
          />

          {waypoints.map((stop, i) => {
            const [x, y] = at(STOPS[i]);
            const on = i === active;
            return (
              <button
                key={stop.id}
                id={`waypoint-${i}`}
                role="tab"
                aria-selected={on}
                aria-controls="waypoint-panel"
                tabIndex={on ? 0 : -1}
                onClick={() => setActive(i)}
                onKeyDown={(e) => step(e, i)}
                style={{ left: `${x / 10}%`, top: `${y / 2}%` }}
                className="group absolute flex w-40 -translate-x-1/2 flex-col items-center pt-0 text-center sm:w-56"
              >
                <span
                  className={`-mt-[11px] grid h-[22px] w-[22px] place-items-center rounded-full border bg-void transition-colors duration-500 ${
                    on ? "border-ion" : "border-star/50 group-hover:border-star"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full transition-colors duration-500 ${
                      on ? "bg-ion" : "bg-star/60 group-hover:bg-star"
                    }`}
                  />
                </span>
                <span
                  className={`mt-3 bg-void/85 px-1.5 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors duration-500 ${
                    on ? "text-ion" : "text-dim group-hover:text-star"
                  }`}
                >
                  Waypoint {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={`mt-1 bg-void/85 px-1.5 py-0.5 text-sm leading-snug transition-colors duration-500 sm:text-base ${
                    on ? "text-star" : "text-star/55 group-hover:text-star"
                  }`}
                >
                  {stop.company}
                </span>
              </button>
            );
          })}
        </div>
      </Rise>

      {/* the selected posting */}
      <div
        id="waypoint-panel"
        role="tabpanel"
        aria-labelledby={`waypoint-${active}`}
        className="mt-20 min-h-[26rem] sm:mt-16"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-12"
          >
            <header className="md:col-span-4">
              <p className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11px] uppercase tracking-[0.22em] text-dim">
                {job.duration.replace("–", "-")}
                {job.isActive && (
                  <span className="border border-ion/60 px-2 py-0.5 text-ion">
                    Current position
                  </span>
                )}
              </p>
              <h3 className="mt-5 font-title text-2xl font-bold uppercase leading-[1.15] tracking-[0.04em] md:text-[2.2vw] min-[1400px]:text-[31px]">
                {job.company}
              </h3>
              <p className="mt-3 font-light text-star/60">{job.position}</p>
              <p className="mt-6 max-w-sm font-light leading-relaxed text-star/80 md:text-lg md:leading-relaxed">
                {job.summary}
              </p>
            </header>

            <div className="md:col-span-8">
              <ul className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
                {job.highlights.map((item, i) => (
                  <motion.li
                    key={item.title}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.12 + i * 0.07, ease: EASE }}
                    className="border-t border-line pt-5"
                  >
                    <h4 className="font-title text-[13px] font-bold uppercase tracking-[0.12em]">
                      {item.title}
                    </h4>
                    <p className="mt-3 font-light leading-relaxed text-star/70">
                      {item.detail}
                    </p>
                  </motion.li>
                ))}
              </ul>

              {/* everything else, for whoever wants the long version */}
              {job.points && (
                <div className="mt-10">
                  <button
                    aria-expanded={fullLog}
                    aria-controls="full-log"
                    onClick={() => setFullLog((v) => !v)}
                    className="group flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-ion transition-colors duration-300 hover:text-star"
                  >
                    <IconPlus aria-hidden
                      size={15}
                      stroke={1.5}
                      className={`transition-transform duration-500 ease-out-quint ${fullLog ? "rotate-45" : ""}`}
                    />
                    {fullLog ? "Hide" : "Read"} the full log, {job.points.length} entries
                  </button>
                  <AnimatePresence initial={false}>
                    {fullLog && (
                      <motion.ol
                        id="full-log"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.6, ease: EASE }}
                        className="overflow-hidden"
                      >
                        {job.points.map((point, i) => (
                          <li
                            key={i}
                            className="grid grid-cols-[2.5rem_1fr] gap-3 pt-5 text-[15px] font-light leading-relaxed text-star/70"
                          >
                            <span className="pt-0.5 font-mono text-[11px] text-dim">
                              {String(i + 1).padStart(2, "0")}
                            </span>
                            {point}
                          </li>
                        ))}
                      </motion.ol>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
