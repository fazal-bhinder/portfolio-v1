"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { IconWorld } from "@tabler/icons-react";
import { RevealText } from "../components/ui/reveal";
import { FazalWordmark, SinghWordmark } from "../components/ui/wordmark";

export default function Hero() {
  const reduce = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);

  // a fast (local) video can fire canplay before hydration attaches
  // the listener, so also check readiness on mount
  useEffect(() => {
    if (videoRef.current && videoRef.current.readyState >= 3) {
      setVideoReady(true);
    }
  }, []);

  return (
    <section
      id="top"
      className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-ink text-bone"
    >
      {/* video background: dark storm clouds, blurred and darkened */}
      {!reduce && (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onCanPlay={() => setVideoReady(true)}
          className={`absolute inset-0 h-full w-full scale-110 object-cover blur-md transition-opacity duration-1000 ${videoReady ? "opacity-50" : "opacity-0"
            }`}
          src="/clouds.mp4"
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
          text="full stack engineer."
          className="mt-6 max-w-xs text-[15px] leading-snug text-smoke md:max-w-sm md:text-base"
        />
      </div>

      {/* giant wordmark, fully visible at the bottom — words rise one after another */}
      <div className="relative z-10 w-full px-2 pb-4 md:pb-6">
        <h1
          aria-label="Fazal Singh"
          className="mx-auto flex w-full max-w-xl items-end justify-center gap-[3.4%] text-smoke md:max-w-4xl"
        >
          {[
            { Word: FazalWordmark, width: "49.6%", delay: 0.9 },
            { Word: SinghWordmark, width: "47%", delay: 1.12 },
          ].map(({ Word, width, delay }) => (
            <span
              key={delay}
              className="block overflow-hidden"
              style={{ width }}
            >
              <motion.span
                className="block"
                initial={reduce ? { opacity: 0 } : { y: "110%" }}
                animate={reduce ? { opacity: 1 } : { y: 0 }}
                transition={{ duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] }}
              >
                <Word className="h-auto w-full" />
              </motion.span>
            </span>
          ))}
        </h1>
      </div>
    </section>
  );
}
