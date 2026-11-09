"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Title, Words, EASE, useReduce } from "../components/ui/motion";
import { SoundToggle } from "../components/ui/sound";

/**
 * Prologue. The opening shot: the night side of a planet, a sun coming up
 * over its edge, and the title. Scrolling is lift-off: the horizon drops
 * away and the camera pushes through the title into open space.
 */
export default function Hero() {
  const reduce = useReduce();

  // 0 at rest, 1 once the pinned shot has played out (one viewport of scroll)
  const { scrollY } = useScroll();
  const lift = useTransform(scrollY, (v) =>
    typeof window === "undefined" ? 0 : Math.min(v / window.innerHeight, 1)
  );
  const horizonY = useTransform(lift, [0, 1], ["0vh", "46vh"]);
  const sunScale = useTransform(lift, [0, 1], [1, 2.4]);
  const sunOpacity = useTransform(lift, [0, 0.7, 1], [1, 0.9, 0]);
  const titleScale = useTransform(lift, [0, 1], [1, 1.9]);
  const titleOpacity = useTransform(lift, [0.05, 0.75], [1, 0]);
  // once the card has faded out it must not swallow taps meant for what is behind it
  const titleEvents = useTransform(titleOpacity, (v) => (v < 0.2 ? "none" : "auto"));

  const moving = <T,>(style: T) => (reduce ? undefined : style);

  return (
    <section id="top" className="relative h-[200svh] short:h-auto">
      <div className="sticky top-0 h-[100svh] overflow-hidden short:relative short:h-auto short:min-h-[640px]">
        {/* the sun, half hidden behind the planet's edge */}
        <motion.div
          style={moving({ y: horizonY, scale: sunScale, opacity: sunOpacity })}
          className="absolute inset-0"
        >
          <div
            className="anim absolute left-[64%] top-[calc(74%+1vw)] aspect-square w-[70vmin] mix-blend-screen"
            style={{
              transform: "translate(-50%, -50%)",
              background:
                "radial-gradient(circle, #fff 0%, #fff4d6 5%, rgb(255 214 150 / 0.6) 12%, rgb(255 190 120 / 0.2) 30%, transparent 62%)",
              animation: "sunrise 3.2s var(--ease-out-quint) 0.5s backwards",
            }}
          />
        </motion.div>

        {/* the planet: mostly night, with a line of atmosphere catching the light */}
        <motion.div style={moving({ y: horizonY })} className="absolute inset-0">
          <div
            className="anim absolute left-1/2 top-[74%] aspect-square w-[250vw] rounded-full md:w-[190vw]"
            style={{
              transform: "translate(-50%, 0)",
              background:
                "radial-gradient(ellipse at 56% 0%, #12275c 0%, #070d20 14%, #02030a 40%)",
              boxShadow:
                "0 0 0 1px rgb(200 228 255 / 0.5), 0 -6px 28px 2px rgb(120 180 255 / 0.5), 0 -40px 160px 10px rgb(60 110 255 / 0.28), inset 0 26px 70px -18px rgb(110 170 255 / 0.5)",
              animation: "limb-in 2.6s var(--ease-out-quint) backwards",
            }}
          />
          {/* lens flare: the long horizontal streak a film lens throws */}
          <div
            className="anim absolute left-[64%] top-[calc(74%+1vw)] h-px w-[120vw] mix-blend-screen"
            style={{
              transform: "translate(-50%, -50%)",
              background:
                "linear-gradient(90deg, transparent, rgb(160 205 255 / 0.5) 30%, #fff 50%, rgb(160 205 255 / 0.5) 70%, transparent)",
              boxShadow: "0 0 18px 2px rgb(150 200 255 / 0.55)",
              animation: "flare 2.4s var(--ease-out-quint) 1.5s backwards",
            }}
          />
        </motion.div>

        {/* the title card */}
        <motion.div
          style={moving({ scale: titleScale, opacity: titleOpacity, pointerEvents: titleEvents })}
          className="relative z-10 flex h-[78svh] flex-col items-center justify-center px-5 pt-14 text-center short:h-auto short:pb-72 short:pt-20"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.6, delay: 0.3 }}
            className="font-mono text-[11px] uppercase tracking-[0.5em] text-ion"
          >
            Full stack engineer
          </motion.p>

          <Title
            as="h1"
            anim="load"
            delay={500}
            text="Fazal Singh"
            className="mt-6 max-w-[5.6em] text-[15.5vw] font-bold leading-[1.08] tracking-[0.06em] sm:max-w-none sm:text-[7.4vw] md:mt-7 md:text-[6.4vw] min-[1400px]:text-[92px]"
          />

          <Words
            play
            delay={1.7}
            text="I build the whole thing: the feature, the pipeline behind it, and the dashboard that watches it."
            className="mt-6 max-w-xl text-[15px] font-light leading-relaxed text-star/75 sm:text-base md:mt-8 md:text-lg"
          />

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 2.5, ease: EASE }}
            className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 font-mono text-[11px] uppercase tracking-[0.25em] md:mt-10"
          >
            <a
              href="#origin"
              className="border border-star/70 px-7 py-4 text-star transition-colors duration-500 hover:bg-star hover:text-void"
            >
              Begin the voyage
            </a>
            <SoundToggle className="hidden items-center gap-2 text-dim transition-colors duration-300 hover:text-star sm:flex" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
