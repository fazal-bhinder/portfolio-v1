"use client";

import { useRef, useState } from "react";
import { useScroll } from "framer-motion";
import { IconArrowUp, IconArrowUpRight, IconCheck, IconCopy } from "@tabler/icons-react";
import { ActCard, Rise, SHELL, Title, Words } from "../components/ui/motion";
import { BlackHole } from "../components/ui/blackhole";
import { EMAIL, RESUME_URL, socials } from "../data/links";

/**
 * Act V. The final shot: the camera falls toward a black hole while the
 * contact details and the credits come up over it.
 */
export const Footer = () => {
  const ref = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  // 0 as the scene enters, 1 at the very end of the page
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard blocked (permissions, insecure origin): the mailto link still works
    }
  };

  return (
    <footer ref={ref} id="transmission" className="relative">
      {/* the black hole holds the frame while everything else scrolls over it */}
      <div className="sticky top-0 h-[100svh]">
        <BlackHole approach={scrollYProgress} className="absolute inset-0" />
      </div>

      <div className="relative -mt-[100svh] [text-shadow:0_1px_28px_rgb(3_4_10/0.95),0_0_8px_rgb(3_4_10/0.7)]">
        {/* title card, then a stretch with nothing over the black hole */}
        <div className={`${SHELL} min-h-[140svh] pt-28 md:pt-36 short:pt-20`}>
          <ActCard act="Act V" title="Transmission" />
          <Words
            text="Every voyage ends with a signal home. This is where you send yours."
            className="mt-10 max-w-md text-lg font-light leading-relaxed text-star/70 md:text-2xl md:leading-relaxed"
          />
        </div>

        {/* the final frame is exactly one screen, padded clear of both HUD
            bars, so the page ends with all of it in view */}
        <div className="bg-gradient-to-t from-void via-void/50 to-transparent">
          <div className={`${SHELL} flex min-h-[100svh] flex-col justify-between gap-10 pb-16 pt-20 md:pt-28`}>
            <div>
              <Title
                text="Got something to build?"
                className="max-w-[12em] text-[8.4vw] font-bold leading-[1.1] tracking-[0.03em] md:text-[4.6vw] min-[1400px]:text-[66px]"
              />

              <Rise className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-4 md:mt-10">
                <a
                  href={`mailto:${EMAIL}`}
                  translate="no"
                  className="font-mono text-[5.4vw] tracking-[-0.02em] underline decoration-ion decoration-1 underline-offset-[0.3em] transition-colors duration-300 hover:text-ion md:text-[2.4vw] min-[1400px]:text-[34px]"
                >
                  {EMAIL}
                </a>
                <button
                  onClick={copy}
                  aria-label="Copy email address"
                  className="flex items-center gap-2 border border-star/70 bg-void/40 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.25em] transition-colors duration-500 hover:bg-star hover:text-void"
                >
                  {copied ? <IconCheck aria-hidden size={14} stroke={1.75} /> : <IconCopy aria-hidden size={14} stroke={1.5} />}
                  <span aria-live="polite">{copied ? "Copied" : "Copy email"}</span>
                </button>
              </Rise>

              <Rise delay={0.1}>
                <p className="mt-5 max-w-sm font-light leading-relaxed text-star/70 md:mt-6">
                  I reply in about 0.1&nbsp;working days. Always open to new ideas
                  and conversations.
                </p>
              </Rise>
            </div>

            {/* end credits: one bar, left to right */}
            <div className="grid items-end gap-x-8 gap-y-5 border-t border-line pt-5 font-mono text-[11px] uppercase tracking-[0.25em] text-dim md:grid-cols-[1fr_auto_1fr] md:pt-6">
              <p className="leading-relaxed">
                Written, built and deployed by{" "}
                <span className="whitespace-nowrap text-star">Fazal Singh</span>
              </p>

              <ul className="flex flex-wrap gap-x-7 gap-y-3">
                {[...socials, { label: "Resume", href: RESUME_URL }].map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center gap-1 py-1 text-star/80 transition-colors duration-300 hover:text-ion"
                    >
                      {link.label}
                      <IconArrowUpRight aria-hidden
                        size={13}
                        stroke={1.5}
                        className="transition-transform duration-300 ease-out-quint group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </a>
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-between gap-6 md:justify-end">
                <p>&copy; 2026</p>
                <a
                  href="#top"
                  className="group flex items-center gap-2 py-1 text-star/80 transition-colors duration-300 hover:text-ion"
                >
                  Watch it again
                  <IconArrowUp aria-hidden
                    size={13}
                    stroke={1.5}
                    className="transition-transform duration-300 ease-out-quint group-hover:-translate-y-1"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
