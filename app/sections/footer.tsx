"use client";

import { useRef, useState } from "react";
import { useScroll } from "framer-motion";
import { IconArrowUp, IconArrowUpRight, IconCheck, IconCopy } from "@tabler/icons-react";
import { ActCard, Rise, Title, Words } from "../components/ui/motion";
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

      <div className="relative -mt-[100svh]">
        <div className="mx-auto flex min-h-[110svh] max-w-[1400px] flex-col px-5 pt-28 [text-shadow:0_1px_28px_rgb(3_4_10/0.95),0_0_8px_rgb(3_4_10/0.7)] md:px-10 md:pt-36 short:pt-20">
          <ActCard act="Act V" title="Transmission" />
          <Words
            text="Every voyage ends with a signal home. This is where you send yours."
            className="mt-10 max-w-md text-lg font-light leading-relaxed text-star/70 md:text-2xl md:leading-relaxed"
          />
        </div>

        <div className="bg-gradient-to-t from-void via-void/85 to-transparent pb-24 pt-[45svh]">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <Title
              text="Got something to build?"
              className="max-w-[12em] text-[8.4vw] font-bold leading-[1.1] tracking-[0.03em] md:text-[4.6vw] min-[1400px]:text-[66px]"
            />

            <Rise className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
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
                className="flex items-center gap-2 border border-star/70 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.25em] transition-colors duration-500 hover:bg-star hover:text-void"
              >
                {copied ? <IconCheck aria-hidden size={14} stroke={1.75} /> : <IconCopy aria-hidden size={14} stroke={1.5} />}
                <span aria-live="polite">{copied ? "Copied" : "Copy email"}</span>
              </button>
            </Rise>

            <Rise delay={0.1}>
              <p className="mt-6 max-w-sm font-light leading-relaxed text-star/65">
                I reply in about 0.1&nbsp;working days. Always open to new ideas
                and conversations.
              </p>
            </Rise>

            {/* end credits */}
            <div className="mt-28 text-center md:mt-40">
              <Rise>
                <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-dim">
                  Written, built and deployed by
                </p>
                <p className="mt-4 font-title text-xl font-bold uppercase tracking-[0.3em] md:text-2xl">
                  Fazal Singh
                </p>
              </Rise>

              <Rise delay={0.1}>
                <ul className="mt-12 flex flex-wrap justify-center gap-x-9 gap-y-4 font-mono text-[11px] uppercase tracking-[0.25em]">
                  {[...socials, { label: "Resume", href: RESUME_URL }].map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex items-center gap-1 text-star/75 transition-colors duration-300 hover:text-ion"
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
              </Rise>

              <div className="mt-14 flex flex-col items-center gap-5 font-mono text-[11px] uppercase tracking-[0.25em] text-dim">
                <a
                  href="#top"
                  className="group flex items-center gap-2 transition-colors duration-300 hover:text-star"
                >
                  Watch it again
                  <IconArrowUp aria-hidden
                    size={13}
                    stroke={1.5}
                    className="transition-transform duration-300 ease-out-quint group-hover:-translate-y-1"
                  />
                </a>
                <p>&copy; 2026 Fazal Singh</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
