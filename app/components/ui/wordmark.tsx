import React from "react";

/*
 * Monolog-style wordmark: ultra-heavy rectilinear caps set nearly touching,
 * with two alternate "quirk" glyphs — A1 is a solid triangle with a
 * hand-drawn oval counter, A2 is pixel-stepped (echoing Monolog's
 * spiral-O and pixel-O).
 */

type Glyph = { w: number; d: string; evenOdd?: boolean };

type GlyphKey = "F" | "A1" | "Z" | "A2" | "L" | "S" | "I" | "N" | "G" | "H";

const GLYPHS: Record<GlyphKey, Glyph> = {
  F: { w: 62, d: "M0 0H62V26H30V42H56V68H30V100H0V0Z" },
  A1: {
    w: 70,
    d: "M22 0H48L70 100H0L22 0ZM40 47C46 49 47 57 44 66C41 75 34 79 28 77C23 75 22 67 25 58C28 49 35 45 40 47Z",
    evenOdd: true,
  },
  Z: { w: 60, d: "M0 0H60V24L34 76H60V100H0V76L26 24H0V0Z" },
  A2: {
    w: 70,
    d: "M20 0H50V16H62V48H70V100H44V72H26V100H0V48H8V16H20V0ZM28 24H42V44H28V24Z",
    evenOdd: true,
  },
  L: { w: 56, d: "M0 0H30V72H56V100H0V0Z" },
  S: { w: 64, d: "M0 0H64V24H28V38H64V100H0V76H36V62H0V0Z" },
  I: { w: 30, d: "M0 0H30V100H0V0Z" },
  N: { w: 70, d: "M0 0H26L44 58V0H70V100H44L26 42V100H0V0Z" },
  G: { w: 70, d: "M0 0H70V28H28V72H42V50H70V100H0V0Z" },
  H: { w: 66, d: "M0 0H28V36H38V0H66V100H38V64H28V100H0V0Z" },
};

const LETTER_GAP = 8;
const WORD_GAP = 24;

const FAZAL: GlyphKey[] = ["F", "A1", "Z", "A2", "L"];
const SINGH: GlyphKey[] = ["S", "I", "N", "G", "H"];

function layout(letters: GlyphKey[], startX = 0) {
  let x = startX;
  const placed = letters.map((k) => {
    const at = x;
    x += GLYPHS[k].w + LETTER_GAP;
    return { k, x: at };
  });
  return { placed, end: x - LETTER_GAP };
}

function GlyphPaths({ placed }: { placed: { k: GlyphKey; x: number }[] }) {
  return (
    <>
      {placed.map(({ k, x }, i) => (
        <g key={`${k}-${i}`} transform={`translate(${x}, 0)`}>
          <path
            d={GLYPHS[k].d}
            fillRule={GLYPHS[k].evenOdd ? "evenodd" : undefined}
            clipRule={GLYPHS[k].evenOdd ? "evenodd" : undefined}
          />
        </g>
      ))}
    </>
  );
}

function WordSvg({
  letters,
  className,
}: {
  letters: GlyphKey[];
  className?: string;
}) {
  const { placed, end } = layout(letters);
  return (
    <svg
      viewBox={`0 0 ${end} 100`}
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <GlyphPaths placed={placed} />
    </svg>
  );
}

export function FazalWordmark({ className }: { className?: string }) {
  return <WordSvg letters={FAZAL} className={className} />;
}

export function SinghWordmark({ className }: { className?: string }) {
  return <WordSvg letters={SINGH} className={className} />;
}

export function FazalSinghWordmark({ className }: { className?: string }) {
  const fazal = layout(FAZAL);
  const singh = layout(SINGH, fazal.end + WORD_GAP);
  return (
    <svg
      viewBox={`0 0 ${singh.end} 100`}
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <GlyphPaths placed={[...fazal.placed, ...singh.placed]} />
    </svg>
  );
}
