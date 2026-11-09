"use client";

import { useEffect, useRef } from "react";

/**
 * Extra forward thrust, 0 to 1. A scene writes to it (see the warp jump in
 * sections/projects.tsx) and the starfield reads it every frame.
 */
export const warp = { value: 0 };

const DEPTH = 1600; // how far the star volume extends in front of the camera
const SPREAD = 1100; // half-width of the volume
const TINTS = ["243,239,230", "190,220,255", "255,228,190"]; // white, blue, gold

/**
 * The sky behind the whole film: a volume of stars the camera flies through.
 * Scrolling is the engine: scroll down and you travel forward, scroll fast
 * and the stars smear into streaks.
 */
export function Space() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio, 1.5);
    const count = window.innerWidth < 768 ? 700 : 1700;

    const stars = Array.from({ length: count }, (_, i) => ({
      x: (Math.random() * 2 - 1) * SPREAD,
      y: (Math.random() * 2 - 1) * SPREAD,
      z: Math.random() * DEPTH,
      size: 0.5 + Math.random(),
      phase: Math.random() * 6.28,
      // mostly white, a few blue and gold; grouped so fillStyle changes 3 times
      tint: i < count * 0.72 ? 0 : i < count * 0.88 ? 1 : 2,
    }));

    let w = 0;
    let h = 0;
    let lastY = window.scrollY;
    let velocity = 0;
    let lastTime = performance.now();
    let raf = 0;

    const draw = (now: number) => {
      const dt = Math.min(now - lastTime, 50);
      lastTime = now;

      const y = window.scrollY;
      velocity += (y - lastY - velocity) * 0.2;
      lastY = y;

      // idle drift + scroll thrust + whatever a scene asks for
      const speed = still ? 0 : dt * 0.012 + velocity * 0.55 + warp.value * dt * 1.5;
      const stretch = Math.abs(speed) > 1.2 ? speed * 5 : 0;

      ctx.clearRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h / 2;
      const focal = Math.max(w, h) * 0.62;
      let tint = -1;

      for (const s of stars) {
        s.z -= speed;
        if (s.z < 1) s.z += DEPTH;
        else if (s.z > DEPTH) s.z -= DEPTH;

        const k = focal / s.z;
        const px = cx + s.x * k;
        const py = cy + s.y * k;
        if (px < 0 || px > w || py < 0 || py > h) continue;

        const near = 1 - s.z / DEPTH; // 0 far, 1 right in front of the lens
        const twinkle = still ? 1 : 0.8 + 0.2 * Math.sin(now * 0.0015 + s.phase);
        const size = (0.5 + near * 1.8) * s.size * dpr;

        if (s.tint !== tint) {
          tint = s.tint;
          ctx.fillStyle = ctx.strokeStyle = `rgb(${TINTS[tint]})`;
        }
        ctx.globalAlpha = (0.28 + near * near * 0.72) * twinkle;

        if (stretch) {
          // where this star was a moment ago, further down the z axis
          const k2 = focal / Math.max(s.z + stretch, 1);
          ctx.lineWidth = size;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(cx + s.x * k2, cy + s.y * k2);
          ctx.stroke();
        } else {
          ctx.fillRect(px - size / 2, py - size / 2, size, size);
        }
      }

      if (!still) raf = requestAnimationFrame(draw);
    };

    const resize = () => {
      w = canvas.width = Math.round(window.innerWidth * dpr);
      h = canvas.height = Math.round(window.innerHeight * dpr);
      if (still) draw(performance.now());
    };
    resize();
    window.addEventListener("resize", resize);
    if (!still) raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <div className="nebula absolute inset-0" />
      <canvas ref={ref} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
