"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "../../lib/utils";

export type PlanetLook = {
  kind: "gas" | "rock" | "ocean" | "ice";
  /** [deep, mid, highlight] */
  colors: [string, string, string];
  /** atmosphere colour */
  glow: string;
  seed: number;
  ring?: boolean;
};

const KIND = { gas: 0, rock: 1, ocean: 2, ice: 3 } as const;

const VERT = `
attribute vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }
`;

/*
 * One planet per draw call: a ray-cast sphere with a procedural surface.
 * The surface is 3D noise sampled on the rotated sphere itself, so it wraps
 * and turns like a real globe instead of a flat picture sliding behind a
 * circle. Lit from one side with a soft terminator and an atmosphere that
 * brightens toward the limb. Output is premultiplied alpha.
 */
const FRAG = `
precision highp float;
uniform float uSize, uTime, uSeed, uKind, uRing, uSpin;
uniform vec3 uC0, uC1, uC2, uGlow;

float hash(vec3 p) {
  p = fract(p * 0.3183099 + 0.1);
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}
float noise(vec3 x) {
  vec3 i = floor(x), f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
                 mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
                 mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
}
float fbm(vec3 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.02 + 11.3; a *= 0.5; }
  return v;
}

const vec3 LIGHT = vec3(-0.58, 0.42, 0.7);
const float TILT = 0.38;

vec3 surface(vec3 p, vec3 s, out float gloss) {
  gloss = 0.0;
  vec3 col;
  if (uKind < 0.5) {
    // gas giant: latitude bands, sheared by turbulence
    float swirl = fbm(p * 2.4 + s);
    float lat = p.y * 5.5 + (swirl - 0.5) * 1.5;
    float bands = 0.5 + 0.5 * sin(lat * 3.14159 + fbm(vec3(p.x * 2.0, p.y * 13.0, p.z * 2.0) + s) * 2.6);
    float fine = fbm(vec3(p.x * 5.0, p.y * 28.0, p.z * 5.0) + s);
    float v = clamp(bands * 0.72 + fine * 0.4, 0.0, 1.0);
    col = mix(uC0, uC1, smoothstep(0.12, 0.6, v));
    col = mix(col, uC2, smoothstep(0.62, 0.98, v));
  } else if (uKind < 1.5) {
    // rocky: broad terrain plus fine grain, with ridged highlands
    float h = fbm(p * 2.1 + s);
    float grain = fbm(p * 8.0 + s * 1.7);
    float ridge = 1.0 - abs(2.0 * fbm(p * 3.6 + s * 0.6) - 1.0);
    float v = h * 0.6 + grain * 0.25 + ridge * 0.2;
    col = mix(uC0, uC1, smoothstep(0.3, 0.58, v));
    col = mix(col, uC2, smoothstep(0.62, 0.82, v));
    col *= 0.82 + 0.36 * grain;
  } else if (uKind < 2.5) {
    // ocean world: seas, land, and a cloud deck drifting over both
    float h = fbm(p * 1.7 + s) + 0.1 * fbm(p * 7.0 + s);
    float land = smoothstep(0.54, 0.57, h);
    vec3 sea = mix(uC0, uC1, smoothstep(0.3, 0.56, h));
    vec3 ground = mix(uC1 * 0.55 + vec3(0.02, 0.1, 0.05), uC1 * 0.9 + vec3(0.14, 0.12, 0.06), fbm(p * 5.0 + s));
    col = mix(sea, ground, land);
    float clouds = smoothstep(0.5, 0.74, fbm(p * 3.0 + s * 2.3 + vec3(uTime * 0.012, 0.0, 0.0)));
    col = mix(col, uC2, clouds * 0.9);
    gloss = (1.0 - land) * (1.0 - clouds);
  } else {
    // ice giant: soft bands under a pale haze
    float lat = p.y * 3.2 + (fbm(p * 2.0 + s) - 0.5) * 0.9;
    float bands = 0.5 + 0.5 * sin(lat * 3.14159);
    float v = clamp(bands * 0.6 + fbm(vec3(p.x * 3.0, p.y * 16.0, p.z * 3.0) + s) * 0.5, 0.0, 1.0);
    col = mix(uC0, uC1, smoothstep(0.1, 0.6, v));
    col = mix(col, uC2, smoothstep(0.6, 1.0, v));
  }
  return col;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uSize * 2.0 - 1.0;
  float px = 2.0 / uSize;
  float R = mix(0.8, 0.44, uRing);
  float d = length(uv);
  vec3 L = normalize(LIGHT);
  vec3 s = vec3(uSeed * 1.31, uSeed * 0.77, uSeed * 2.13);

  vec3 col = vec3(0.0);
  float alpha = 0.0;
  float zs = -10.0; // depth of the sphere surface at this pixel

  // atmosphere spilling past the limb, stronger on the lit side
  float lit = smoothstep(-0.7, 0.7, dot(normalize(vec3(uv, 0.05)), L));
  float halo = exp(-max(d - R, 0.0) / (R * 0.075)) * (0.2 + 0.8 * lit);
  col += uGlow * halo * 0.55;
  alpha = halo * 0.55;

  if (d < R) {
    zs = sqrt(R * R - d * d);
    vec3 n = vec3(uv, zs) / R;

    // tilt the axis, then spin about it
    float ct = cos(TILT), st = sin(TILT);
    vec3 q = vec3(ct * n.x + st * n.y, -st * n.x + ct * n.y, n.z);
    float a = uTime * 0.035 + uSpin;
    float ca = cos(a), sa = sin(a);
    vec3 p = vec3(ca * q.x - sa * q.z, q.y, sa * q.x + ca * q.z);

    float gloss;
    vec3 albedo = surface(p, s, gloss);

    float ndl = dot(n, L);
    float day = smoothstep(-0.12, 0.85, ndl);
    vec3 shade = albedo * (day * 1.15 + 0.012);
    // sun glint on open water
    vec3 hv = normalize(L + vec3(0.0, 0.0, 1.0));
    shade += vec3(1.0, 0.96, 0.88) * pow(max(dot(n, hv), 0.0), 60.0) * gloss * 0.55 * day;
    // atmosphere: thin at the centre, thick toward the edge
    float rim = pow(1.0 - n.z, 2.6);
    shade += uGlow * rim * (0.12 + 0.9 * smoothstep(-0.35, 0.6, ndl));

    float edge = smoothstep(R, R - 1.5 * px, d);
    col = mix(col, shade, edge);
    alpha = max(alpha, edge);
  }

  if (uRing > 0.5) {
    // ring plane through the centre, tipped toward the camera
    vec3 N = normalize(vec3(-0.36, 0.86, 0.36));
    float z = -(uv.x * N.x + uv.y * N.y) / N.z;
    vec3 P = vec3(uv, z);
    float r = length(P) / R;
    if (r > 1.35 && r < 2.16 && z > zs) {
      float band = 0.55 + 0.45 * sin(r * 46.0) * sin(r * 17.0 + uSeed);
      float gap = smoothstep(0.0, 0.03, abs(r - 1.78));
      float a = band * gap * smoothstep(1.35, 1.42, r) * (1.0 - smoothstep(2.05, 2.16, r));
      // the planet's shadow falls across the far side of the ring
      float t = -dot(P, L);
      float shadow = (t < 0.0 && length(P + L * t) < R) ? 0.12 : 1.0;
      vec3 ring = mix(uC1, uC2, band) * (0.35 + 0.65 * shadow);
      a *= 0.85;
      col = mix(col, ring, a);
      alpha = max(alpha, a);
    }
  }

  gl_FragColor = vec4(col, clamp(alpha, 0.0, 1.0));
}
`;

const rgb = (hex: string) =>
  [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255) as [number, number, number];

/*
 * Every planet on the page shares ONE WebGL context (browsers cap how many a
 * page may hold). Each planet is rendered into it, then copied into that
 * planet's own 2D canvas, which lives in the page flow and scrolls natively.
 */
type Renderer = {
  draw: (target: CanvasRenderingContext2D, look: PlanetLook, spin: number, time: number) => void;
};
let shared: Renderer | null | undefined;

function getRenderer(): Renderer | null {
  if (shared !== undefined) return shared;
  shared = null;

  const canvas = document.createElement("canvas");
  const MAX = window.innerWidth < 768 ? 1024 : 1600;
  canvas.width = canvas.height = MAX;
  const gl = canvas.getContext("webgl", { premultipliedAlpha: true, antialias: false });
  if (!gl) return null;

  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
  };
  const program = gl.createProgram()!;
  gl.attachShader(program, compile(gl.VERTEX_SHADER, VERT));
  gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(program, "p");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  gl.enable(gl.SCISSOR_TEST);

  const u = (name: string) => gl.getUniformLocation(program, name);
  const U = {
    size: u("uSize"), time: u("uTime"), seed: u("uSeed"), kind: u("uKind"),
    ring: u("uRing"), spin: u("uSpin"), c0: u("uC0"), c1: u("uC1"), c2: u("uC2"), glow: u("uGlow"),
  };

  shared = {
    draw(target, look, spin, time) {
      const px = Math.min(target.canvas.width, MAX);
      if (px < 2) return;
      gl.viewport(0, 0, px, px);
      gl.scissor(0, 0, px, px);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(U.size, px);
      gl.uniform1f(U.time, time);
      gl.uniform1f(U.seed, look.seed);
      gl.uniform1f(U.kind, KIND[look.kind]);
      gl.uniform1f(U.ring, look.ring ? 1 : 0);
      gl.uniform1f(U.spin, spin);
      gl.uniform3f(U.c0, ...rgb(look.colors[0]));
      gl.uniform3f(U.c1, ...rgb(look.colors[1]));
      gl.uniform3f(U.c2, ...rgb(look.colors[2]));
      gl.uniform3f(U.glow, ...rgb(look.glow));
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      // GL's origin is bottom-left; the drawn square sits at the bottom of the buffer
      target.clearRect(0, 0, target.canvas.width, target.canvas.height);
      target.drawImage(canvas, 0, MAX - px, px, px, 0, 0, target.canvas.width, target.canvas.height);
    },
  };
  return shared;
}

/**
 * A live, lit globe. Size it with className (give it a width). Drag it
 * sideways to spin it; let go and it coasts.
 */
export function Planet({
  look,
  className,
  label,
}: {
  look: PlanetLook;
  className?: string;
  /** what the planet stands for, for screen readers; omit if decorative */
  label?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    const renderer = getRenderer();
    if (!canvas || !ctx || !renderer) {
      setFailed(true); // the CSS globe below takes over
      return;
    }

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio, 2);
    let spin = 0;
    let velocity = 0;
    let dragging = false;
    let lastX = 0;
    let visible = false;
    let raf = 0;
    let frame = 0;

    const paint = (now: number) => renderer.draw(ctx, look, spin, still ? 0 : now / 1000);

    const loop = (now: number) => {
      if (!dragging && Math.abs(velocity) > 0.0002) {
        spin += velocity;
        velocity *= 0.95;
      }
      // the globe turns slowly: every other frame is plenty unless it is being spun
      if (frame++ % 2 === 0 || dragging || Math.abs(velocity) > 0.001) paint(now);
      raf = requestAnimationFrame(loop);
    };

    const resize = () => {
      const size = Math.round(canvas.clientWidth * dpr);
      if (size && size !== canvas.width) canvas.width = canvas.height = size;
      paint(performance.now());
    };
    const sizes = new ResizeObserver(resize);
    sizes.observe(canvas);

    // only spend frames on planets that are on screen
    const views = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        cancelAnimationFrame(raf);
        if (visible) {
          paint(performance.now());
          if (!still) raf = requestAnimationFrame(loop);
        }
      },
      { rootMargin: "200px" }
    );
    views.observe(canvas);

    const down = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      velocity = 0;
      canvas.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const step = ((e.clientX - lastX) / Math.max(canvas.clientWidth, 1)) * 2.6;
      lastX = e.clientX;
      spin -= step;
      velocity = -step;
      if (still) paint(0);
    };
    const up = () => {
      dragging = false;
    };
    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);

    return () => {
      cancelAnimationFrame(raf);
      sizes.disconnect();
      views.disconnect();
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
    };
  }, [look]);

  return (
    <div
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn("relative aspect-square", className)}
    >
      {failed ? (
        // no WebGL: a plain shaded globe in the same colours
        <div
          className="absolute inset-[10%] rounded-full"
          style={{
            background: `radial-gradient(circle at 32% 30%, ${look.colors[2]}, ${look.colors[1]} 38%, ${look.colors[0]} 70%, #020308 100%)`,
            boxShadow: `0 0 40px -6px ${look.glow}`,
          }}
        />
      ) : (
        // pan-y: a sideways drag spins the globe, a vertical one still scrolls the page
        <canvas
          ref={ref}
          className="absolute inset-0 h-full w-full cursor-grab touch-pan-y active:cursor-grabbing"
        />
      )}
    </div>
  );
}
