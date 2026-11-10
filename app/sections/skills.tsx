"use client";

import { useRef, useState } from "react";
import { animate, motion, useMotionValue } from "framer-motion";
import { ACT, ActCard, GAP, LEDE, Rise, SHELL, Words } from "../components/ui/motion";

// one orbit per group; `size` is the ring's diameter as a share of the system
const orbits = [
  {
    name: "Languages",
    size: 36,
    seconds: 70,
    items: ["Python", "TypeScript", "JavaScript", "SQL"],
  },
  {
    name: "Frameworks",
    size: 64,
    seconds: 110,
    items: ["FastAPI", "Node.js", "React", "Next.js", "Astro", "Playwright"],
  },
  {
    name: "Infra & AI",
    size: 92,
    seconds: 160,
    items: [
      "PostgreSQL",
      "Redis",
      "RabbitMQ",
      "Docker",
      "GitHub Actions",
      "Cloudflare",
      "Vercel",
      "Oracle Cloud",
      "OpenAI & Anthropic",
      "RAG & Embeddings",
      "LLM Agents",
    ],
  },
];
const total = orbits.reduce((n, orbit) => n + orbit.items.length, 0);

type Hot = { orbit: number; item?: string } | null;

/**
 * Act IV. The toolkit as a small solar system: three orbits, one per group,
 * every tool a satellite. Point at a tool and its satellite lights up, point
 * at a satellite and it names itself, or grab the system and spin it.
 */
export default function Skills() {
  const [hot, setHot] = useState<Hot>(null);
  const spin = useMotionValue(0);
  const system = useRef<HTMLDivElement>(null);
  const grip = useRef<{ angle: number; last: number } | null>(null);

  const angleTo = (e: React.PointerEvent) => {
    const r = system.current!.getBoundingClientRect();
    return (Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180) / Math.PI;
  };

  return (
    <section
      id="instruments"
      onPointerLeave={() => setHot(null)}
      className={`${SHELL} ${ACT}`}
    >
      <ActCard act="Act IV" title="Instruments" />
      <Words
        text="The tools that keep me in orbit. Point at one, or grab the system and spin it."
        className={LEDE}
      />

      <div className={`${GAP} grid grid-cols-1 items-center gap-x-16 gap-y-14 lg:grid-cols-2`}>
        {/* the system. Mouse only for the spin: on touch it would trap page scroll */}
        <Rise>
          <div
            ref={system}
            onPointerDown={(e) => {
              if (e.pointerType !== "mouse") return;
              e.currentTarget.setPointerCapture(e.pointerId);
              grip.current = { angle: angleTo(e), last: 0 };
            }}
            onPointerMove={(e) => {
              if (!grip.current) return;
              const angle = angleTo(e);
              // keep the step in (-180, 180] so crossing the seam does not jump
              const step = ((angle - grip.current.angle + 540) % 360) - 180;
              grip.current = { angle, last: step };
              spin.set(spin.get() + step);
            }}
            onPointerUp={() => {
              if (!grip.current) return;
              // let go and it coasts
              animate(spin, spin.get() + grip.current.last * 14, { duration: 1.4, ease: "easeOut" });
              grip.current = null;
            }}
            onPointerCancel={() => (grip.current = null)}
            className="relative mx-auto aspect-square w-full max-w-[34rem] cursor-grab touch-pan-y select-none active:cursor-grabbing"
          >
            <motion.div style={{ rotate: spin }} className="absolute inset-0">
              {orbits.map((orbit, o) => {
                const lit = hot?.orbit === o;
                return (
                  <div
                    key={orbit.name}
                    style={{ inset: `${(100 - orbit.size) / 2}%` }}
                    className={`absolute rounded-full border transition-colors duration-500 ${
                      lit ? "border-ion/70" : "border-star/15"
                    }`}
                  >
                    <div
                      className="anim absolute inset-0"
                      style={{
                        animation: `orbit ${orbit.seconds}s linear infinite ${o % 2 ? "reverse" : ""}`,
                      }}
                    >
                      {orbit.items.map((item, i) => {
                        const a = (i / orbit.items.length) * Math.PI * 2;
                        const on = lit && (!hot?.item || hot.item === item);
                        return (
                          <button
                            key={item}
                            type="button"
                            data-sound
                            aria-label={`${item}, ${orbit.name}`}
                            aria-pressed={hot?.item === item}
                            onPointerEnter={() => setHot({ orbit: o, item })}
                            onFocus={() => setHot({ orbit: o, item })}
                            onClick={() => setHot({ orbit: o, item })}
                            style={{
                              left: `${(50 + 50 * Math.cos(a)).toFixed(3)}%`,
                              top: `${(50 + 50 * Math.sin(a)).toFixed(3)}%`,
                            }}
                            className="absolute grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center"
                          >
                            <span
                              className={`block rounded-full transition-[width,height,background-color,box-shadow] duration-500 ease-out-quint ${
                                hot?.item === item
                                  ? "h-3.5 w-3.5 bg-ion shadow-[0_0_20px_6px_rgb(159_211_255/0.7)]"
                                  : on
                                  ? "h-2.5 w-2.5 bg-ion shadow-[0_0_12px_2px_rgb(159_211_255/0.5)]"
                                  : "h-2 w-2 bg-star/70 shadow-[0_0_10px_1px_rgb(243_239_230/0.4)]"
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </motion.div>

            {/* the star at the centre, and a readout that stays upright */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[14%] w-[14%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,#fff_0%,#fff4d6_18%,rgb(255_214_150/0.5)_40%,transparent_70%)]" />
            <p
              aria-live="polite"
              className="pointer-events-none absolute inset-x-0 top-[calc(50%+11%)] text-center font-mono text-[11px] uppercase tracking-[0.2em] text-star"
            >
              {/* a plate behind it, so satellites passing underneath do not garble it */}
              <span className="bg-void/80 px-2 py-1">
                {hot?.item ?? (hot ? orbits[hot.orbit].name : `${total} tools, 3 orbits`)}
              </span>
            </p>
          </div>
        </Rise>

        {/* the same tools as plain lists, always readable */}
        <div className="grid gap-10">
          {orbits.map((orbit, o) => {
            const lit = hot?.orbit === o;
            return (
              <Rise key={orbit.name} delay={o * 0.08}>
                <div onPointerEnter={() => setHot((h) => (h?.orbit === o ? h : { orbit: o }))}>
                  <h3
                    className={`flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.25em] transition-colors duration-500 ${
                      lit ? "text-ion" : "text-dim"
                    }`}
                  >
                    {orbit.name}
                    <span className={`h-px flex-1 transition-colors duration-500 ${lit ? "bg-ion/50" : "bg-line"}`} />
                    {String(orbit.items.length).padStart(2, "0")}
                  </h3>
                  <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-1">
                    {orbit.items.map((item) => (
                      <li key={item}>
                        <button
                          type="button"
                          data-sound
                          aria-pressed={hot?.item === item}
                          onPointerEnter={() => setHot({ orbit: o, item })}
                          onFocus={() => setHot({ orbit: o, item })}
                          onClick={() => setHot({ orbit: o, item })}
                          className={`py-1.5 text-xl font-light transition-colors duration-300 md:text-2xl ${
                            hot?.item === item ? "text-ion" : lit ? "text-star" : "text-star/65"
                          }`}
                        >
                          {item}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </Rise>
            );
          })}
        </div>
      </div>
    </section>
  );
}
