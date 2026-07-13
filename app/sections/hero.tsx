"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { IconWorld } from "@tabler/icons-react";
import { RevealText } from "../components/ui/reveal";

export default function Hero() {
  const reduce = useReducedMotion();
  const [videoReady, setVideoReady] = useState(false);

  return (
    <section
      id="top"
      className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-ink text-bone"
    >
      {/* video background: dark storm clouds, blurred and darkened */}
      {!reduce && (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onCanPlay={() => setVideoReady(true)}
          className={`absolute inset-0 h-full w-full scale-110 object-cover blur-md transition-opacity duration-1000 ${
            videoReady ? "opacity-50" : "opacity-0"
          }`}
          src="https://assets.mixkit.co/videos/11526/11526-360.mp4"
        />
      )}

      {/* halftone texture + vignette */}
      <div className="halftone pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/80 via-transparent to-ink/70" />

      {/* centered statement */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pt-16 text-center">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-bone/80"
        >
          <motion.span
            className="block"
            animate={reduce ? undefined : { rotate: 360 }}
            transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
          >
            <IconWorld size={30} stroke={1.25} />
          </motion.span>
        </motion.span>

        <RevealText
          as="p"
          delay={0.45}
          text="i build the whole thing. the feature, the pipeline behind it, and the dashboard that watches it."
          className="mt-8 max-w-sm text-[17px] font-medium leading-snug md:max-w-md md:text-lg"
        />

        <RevealText
          as="p"
          delay={0.8}
          text="full stack engineer, currently shipping e-commerce at Carpetstory."
          className="mt-6 max-w-xs text-[15px] leading-snug text-smoke md:max-w-sm md:text-base"
        />
      </div>

      {/* giant wordmark, fully visible at the bottom */}
      <div className="relative z-10 w-full overflow-hidden px-2 pb-4 md:pb-6">
        <motion.h1
          initial={reduce ? { opacity: 0 } : { y: "110%" }}
          animate={reduce ? { opacity: 1 } : { y: 0 }}
          transition={{ duration: 1.1, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="whitespace-nowrap text-center font-display uppercase leading-[0.9] tracking-[-0.03em] text-[12.5vw] text-bone"
        >
          Fazal Singh
        </motion.h1>
      </div>
    </section>
  );
}
