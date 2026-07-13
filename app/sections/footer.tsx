"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { RevealText, FadeUp } from "../components/ui/reveal";

const socials = [
  { label: "GitHub", href: "https://github.com/fazal-bhinder" },
  { label: "LinkedIn", href: "https://linkedin.com/in/fazal-bhinder" },
  { label: "X", href: "https://x.com/damnfazal" },
];

export const Footer = () => {
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
    <footer id="contact" className="bg-ink text-bone">
      {/* full-viewport video CTA: same storm clouds as the hero */}
      <section className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-6 pb-40 md:pb-0">
        {!reduce && (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            onCanPlay={() => setVideoReady(true)}
            className={`absolute inset-0 h-full w-full scale-110 object-cover blur-md transition-opacity duration-1000 ${
              videoReady ? "opacity-50" : "opacity-0"
            }`}
            src="/clouds.mp4"
          />
        )}
        <div className="halftone pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/80 via-transparent to-ink/80" />

        <div className="relative z-10 flex flex-col items-center text-center">
          <RevealText
            as="p"
            text="got something cool, or not so cool, to build?"
            className="max-w-sm text-[17px] font-medium leading-snug text-smoke md:text-lg"
          />

          <FadeUp delay={0.25}>
            <motion.a
              href="mailto:bhinderfazal@gmail.com"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="group mt-10 flex items-center gap-4 bg-bone px-8 py-5 text-2xl font-medium tracking-tight text-ink md:px-10 md:py-6 md:text-3xl"
            >
              Tell me your idea
              <span className="inline-block transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1">
                &#8599;&#xFE0E;
              </span>
            </motion.a>
          </FadeUp>

          <FadeUp delay={0.4}>
            <p className="mt-10 max-w-xs text-sm leading-relaxed text-smoke md:max-w-sm">
              i&#39;ll get back to you in 0.1 working days hihi. always open to
              new ideas and conversations.
            </p>
          </FadeUp>
        </div>

        {/* bottom bar, overlaid on the video */}
        <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center gap-4 border-t border-bone/15 bg-ink/30 px-4 py-5 backdrop-blur-sm md:flex-row md:justify-between md:px-8">
          <p className="text-sm text-ash">
            &copy; 2026 fazal. built and maintained by{" "}
            <a
              href="https://x.com/damnfazal"
              target="_blank"
              rel="noreferrer"
              className="text-smoke underline underline-offset-4 transition-colors duration-200 hover:text-bone"
            >
              fazal
            </a>
            .
          </p>

          <div className="flex items-center gap-5">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-smoke transition-colors duration-200 hover:text-bone"
              >
                {social.label} &#8599;&#xFE0E;
              </a>
            ))}
          </div>

          <a
            href="#top"
            className="group flex items-center gap-2 text-sm text-smoke transition-colors duration-200 hover:text-bone"
          >
            Back to top
            <span className="inline-block transition-transform duration-300 group-hover:-translate-y-1">
              &#8593;
            </span>
          </a>
        </div>
      </section>
    </footer>
  );
};
