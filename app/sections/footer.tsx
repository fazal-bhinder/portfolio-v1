"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { RevealText, FadeUp } from "../components/ui/reveal";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Work", href: "#work" },
  {
    label: "Resume",
    href: "https://drive.google.com/file/d/1MJR8sR_qA4PdD--87i3S1TgetXMgnkwn/view?usp=sharing",
    external: true,
  },
];

const socials = [
  { label: "GitHub", href: "https://github.com/fazal-bhinder" },
  { label: "LinkedIn", href: "https://linkedin.com/in/fazal-bhinder" },
  { label: "X", href: "https://x.com/damnfazal" },
];

export const Footer = () => {
  const reduce = useReducedMotion();
  const [videoReady, setVideoReady] = useState(false);

  return (
    <footer id="contact" className="bg-ink text-bone">
      {/* full-viewport video CTA, monolog style */}
      <section className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-6">
        {!reduce && (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            onCanPlay={() => setVideoReady(true)}
            className={`absolute inset-0 h-full w-full object-cover grayscale transition-opacity duration-1000 ${
              videoReady ? "opacity-40" : "opacity-0"
            }`}
            src="https://assets.mixkit.co/videos/948/948-360.mp4"
          />
        )}
        <div className="halftone pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/70 via-transparent to-ink/90" />

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
                &#8599;
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
      </section>

      {/* footer navigation + details */}
      <section className="mx-auto max-w-[1400px] px-4 pb-10 pt-20 md:px-8 md:pt-28">
        <div className="grid gap-16 md:grid-cols-[1.4fr_1fr]">
          {/* big nav list */}
          <div>
            <p className="font-label text-xs uppercase text-ash">
              (navigation)
            </p>
            <nav className="mt-8 flex flex-col">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noreferrer" : undefined}
                  className="group flex items-baseline justify-between border-b border-bone/15 py-5 text-4xl font-medium tracking-tight text-smoke transition-all duration-300 hover:pl-4 hover:text-bone md:text-5xl"
                >
                  {link.label}
                  <span className="text-2xl opacity-0 transition-all duration-300 group-hover:opacity-100">
                    &#8599;
                  </span>
                </a>
              ))}
            </nav>
          </div>

          {/* details + socials */}
          <div className="flex flex-col gap-14 md:pt-1">
            <div>
              <p className="font-label text-xs uppercase text-ash">(details)</p>
              <a
                href="mailto:bhinderfazal@gmail.com"
                className="mt-6 block w-fit text-lg font-medium text-bone underline decoration-bone/30 underline-offset-4 transition-colors duration-200 hover:decoration-bone"
              >
                bhinderfazal@gmail.com
              </a>
              <p className="mt-4 max-w-xs text-base leading-relaxed text-smoke">
                based in India.
                <br />
                working worldwide.
              </p>
            </div>

            <div>
              <p className="font-label text-xs uppercase text-ash">(socials)</p>
              <div className="mt-6 flex flex-col gap-2">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex w-fit items-center gap-2 text-lg font-medium text-smoke transition-colors duration-200 hover:text-bone"
                  >
                    {social.label}
                    <span className="inline-block transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                      &#8599;
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* bottom bar */}
        <div className="mt-24 flex items-center justify-between border-t border-bone/15 pt-6">
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
