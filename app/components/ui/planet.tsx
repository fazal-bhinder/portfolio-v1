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
 * circle. Terrain height also bends the lighting (bump mapping from screen
 * derivatives), which is what makes mountains and crater rims read as relief.
 * Lit from the side so the terminator is in view. Output is premultiplied.
 */
const FRAG = `
#ifdef BUMP
#extension GL_OES_standard_derivatives : enable
#endif
precision highp float;
uniform float uSize, uTime, uSeed, uKind, uRing, uSpin;
uniform vec3 uC0, uC1, uC2, uGlow;

float hash(vec3 p) {
  p = fract(p * 0.3183099 + 0.1);
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}
vec3 hash3(vec3 p) {
  p = vec3(dot(p, vec3(127.1, 311.7, 74.7)), dot(p, vec3(269.5, 183.3, 246.1)), dot(p, vec3(113.5, 271.9, 124.6)));
  return fract(sin(p) * 43758.5453);
}
float noise(vec3 x) {
  vec3 i = floor(x), f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
                 mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
                 mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
}
// each octave is rotated, so the lattice never lines up into a grid
const mat3 M = mat3(0.0, 0.8, 0.6, -0.8, 0.36, -0.48, -0.6, -0.48, 0.64);
float fbm(vec3 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 6; i++) { v += a * noise(p); p = M * p * 2.03; a *= 0.5; }
  return v;
}
float fbm3(vec3 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 3; i++) { v += a * noise(p); p = M * p * 2.03; a *= 0.5; }
  return v / 0.875;
}
// sharp creases: mountain chains, canyon walls
float ridged(vec3 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) {
    float n = 1.0 - abs(2.0 * noise(p) - 1.0);
    v += a * n * n; p = M * p * 2.07; a *= 0.5;
  }
  return v;
}
// impact craters: a bowl with a raised rim around scattered points
float craters(vec3 x) {
  vec3 i = floor(x), f = fract(x);
  float v = 0.0;
  for (int a = -1; a <= 1; a++)
  for (int b = -1; b <= 1; b++)
  for (int c = -1; c <= 1; c++) {
    vec3 g = vec3(float(a), float(b), float(c));
    vec3 o = hash3(i + g);
    float d = length(g + o - f) / (0.16 + 0.3 * fract(o.x * 7.31));
    v += 0.3 * exp(-(d - 1.0) * (d - 1.0) * 26.0) - 0.75 * max(0.0, 1.0 - d * d);
  }
  return v;
}

const vec3 LIGHT = vec3(-0.68, 0.38, 0.5);
const float TILT = 0.38;

// albedo, plus: gloss (open water), h (relief), lights (cities after dark)
vec3 surface(vec3 p, vec3 s, out float gloss, out float h, out float lights) {
  gloss = 0.0; h = 0.0; lights = 0.0;
  vec3 col;
  if (uKind < 0.5) {
    // gas giant: bands of uneven width, torn along their edges by turbulence
    float turb = fbm(vec3(p.x * 2.2, p.y * 7.0, p.z * 2.2) + s);
    float lat = p.y + 0.075 * (turb - 0.5);
    float bands = fbm(vec3(1.7, lat * 8.0, 4.1) + s);
    float fine = fbm(vec3(p.x * 5.0, lat * 36.0, p.z * 5.0) + s + turb * 1.6);
    float v = clamp((bands - 0.5) * 2.8 + 0.5 + (fine - 0.5) * 0.75, 0.0, 1.0);
    col = mix(uC0, uC1, smoothstep(0.1, 0.55, v));
    col = mix(col, uC2, smoothstep(0.6, 0.95, v));
    // one long-lived storm, with a dark collar
    vec3 q = p - normalize(vec3(0.55, -0.32, 0.77));
    float sd = length(vec3(q.x, q.y * 2.3, q.z));
    col = mix(col, mix(uC1, uC2, 0.55 + 0.45 * fbm3(p * 14.0 + s)), smoothstep(0.24, 0.1, sd) * 0.9);
    col *= 1.0 - 0.4 * smoothstep(0.34, 0.26, sd) * smoothstep(0.18, 0.26, sd);
  } else if (uKind < 1.5) {
    // rocky: continents of dust, mountain chains, grain, and impact craters
    float base = fbm(p * 2.0 + s);
    float rg = ridged(p * 2.6 + s * 0.6);
    float grain = fbm(p * 12.0 + s * 1.7);
    float cr = craters(p * 3.6 + s);
    float v = base * 0.55 + rg * 0.32 + grain * 0.14;
    col = mix(uC0, uC1, smoothstep(0.26, 0.55, v));
    col = mix(col, uC2, smoothstep(0.58, 0.82, v));
    col *= (0.78 + 0.44 * grain) * (1.0 + 0.5 * clamp(cr, -0.6, 0.3));
    h = v * 0.2 + cr * 0.055;
  } else if (uKind < 2.5) {
    // ocean world: warped continents, shelf seas, deserts, peaks, ice caps,
    // and a cloud deck drifting over all of it
    vec3 w = p + 0.3 * (vec3(fbm3(p * 1.6 + s), fbm3(p * 1.6 + s + 7.1), fbm3(p * 1.6 + s + 13.7)) - 0.5);
    float e = fbm(w * 1.9 + s) + 0.13 * (ridged(w * 4.2 + s) - 0.45);
    float land = smoothstep(0.525, 0.535, e);
    float up = clamp((e - 0.53) / 0.22, 0.0, 1.0);
    float lat = abs(p.y);
    vec3 sea = mix(uC0, uC1, smoothstep(0.3, 0.52, e));
    sea = mix(sea, uC1 * 1.2 + vec3(0.0, 0.14, 0.12), smoothstep(0.49, 0.53, e) * 0.65);
    float arid = fbm3(p * 3.1 + s * 1.9) + (0.4 - lat) * 0.35;
    vec3 ground = mix(vec3(0.07, 0.2, 0.07), vec3(0.46, 0.37, 0.2), smoothstep(0.45, 0.7, arid));
    ground = mix(ground, vec3(0.3, 0.26, 0.22), smoothstep(0.3, 0.7, up));
    ground = mix(ground, vec3(0.93, 0.96, 1.0), smoothstep(0.72, 0.92, up));
    col = mix(sea, ground, land);
    float cap = smoothstep(0.78, 0.86, lat + 0.1 * fbm3(p * 6.0 + s));
    col = mix(col, vec3(0.92, 0.96, 1.0), cap);
    lights = land * (1.0 - cap) * smoothstep(0.62, 0.8, fbm3(p * 9.0 + s * 3.3)) * step(0.45, noise(p * 70.0 + s));
    // clouds turn a little faster than the ground
    float ca = uTime * 0.008, cc = cos(ca), cs = sin(ca);
    vec3 cp = vec3(cc * p.x - cs * p.z, p.y, cs * p.x + cc * p.z);
    float cl = fbm(cp * 3.0 + s * 2.3 + 0.9 * fbm3(cp * 2.2 + s));
    float clouds = smoothstep(0.5, 0.8, cl);
    col *= 1.0 - 0.35 * smoothstep(0.42, 0.56, cl); // their shadow
    col = mix(col, uC2, clouds * 0.92);
    gloss = (1.0 - land) * (1.0 - cap) * (1.0 - clouds);
    lights *= 1.0 - clouds;
    h = land * up * 0.07 * (1.0 - clouds);
  } else {
    // ice giant: soft bands and thin streaks under a pale haze
    float lat = p.y * 3.2 + (fbm(p * 2.0 + s) - 0.5) * 0.9;
    float bands = 0.5 + 0.5 * sin(lat * 3.14159);
    float streak = fbm(vec3(p.x * 3.0, p.y * 22.0, p.z * 3.0) + s);
    float v = clamp(bands * 0.6 + streak * 0.55 - 0.05, 0.0, 1.0);
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
  // bare rock holds almost no air
  float air = (uKind > 0.5 && uKind < 1.5) ? 0.4 : 1.0;

  vec3 col = vec3(0.0);
  float alpha = 0.0;
  float zs = -10.0; // depth of the sphere surface at this pixel

  // atmosphere spilling past the limb, stronger on the lit side
  float lit = smoothstep(-0.6, 0.6, dot(normalize(vec3(uv, 0.05)), L));
  float halo = exp(-max(d - R, 0.0) / (R * 0.06)) * (0.12 + 0.88 * lit) * air;
  col += uGlow * halo * 0.6;
  alpha = halo * 0.6;

  if (d < R) {
    zs = sqrt(R * R - d * d);
    vec3 n = vec3(uv, zs) / R;

    // tilt the axis, then spin about it
    float ct = cos(TILT), st = sin(TILT);
    vec3 q = vec3(ct * n.x + st * n.y, -st * n.x + ct * n.y, n.z);
    float a = uTime * 0.035 + uSpin;
    float ca = cos(a), sa = sin(a);
    vec3 p = vec3(ca * q.x - sa * q.z, q.y, sa * q.x + ca * q.z);

    float gloss, h, lights;
    vec3 albedo = surface(p, s, gloss, h, lights);

    vec3 nb = n;
#ifdef BUMP
    // tip the normal against the slope of the terrain
    vec3 dpx = dFdx(n), dpy = dFdy(n);
    vec3 r1 = cross(dpy, n), r2 = cross(n, dpx);
    float det = dot(dpx, r1);
    vec3 grad = sign(det) * (dFdx(h) * r1 + dFdy(h) * r2);
    nb = normalize(abs(det) * n - grad);
    nb = normalize(mix(n, nb, smoothstep(0.08, 0.35, n.z)));
#endif

    float ndl = dot(n, L);
    float day = smoothstep(-0.1, 0.22, ndl) * clamp(0.16 + 1.0 * max(dot(nb, L), 0.0), 0.0, 1.2);
    vec3 shade = albedo * (day * 1.12 + 0.008);
    // sun glint on open water
    vec3 hv = normalize(L + vec3(0.0, 0.0, 1.0));
    shade += vec3(1.0, 0.95, 0.85) * pow(max(dot(nb, hv), 0.0), 90.0) * gloss * 0.9;
    // cities come on after dark
    shade += vec3(1.0, 0.76, 0.42) * lights * (1.0 - smoothstep(-0.3, 0.02, ndl)) * 0.85;
    // atmosphere: thin at the centre, thick toward the edge
    float rim = pow(1.0 - n.z, 3.0);
    shade += uGlow * rim * (0.06 + 1.05 * smoothstep(-0.3, 0.55, ndl)) * air;

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
      // hundreds of ringlets, and one wide gap
      float band = smoothstep(0.3, 0.72, fbm(vec3(r * 24.0, uSeed, 3.0)));
      float gap = smoothstep(0.0, 0.03, abs(r - 1.78));
      float a = (0.22 + 0.78 * band) * gap * smoothstep(1.35, 1.4, r) * (1.0 - smoothstep(2.08, 2.16, r));
      // the planet's shadow falls across the far side of the ring
      float t = -dot(P, L);
      float shadow = (t < 0.0 && length(P + L * t) < R) ? 0.1 : 1.0;
      vec3 ring = mix(uC1, uC2, band) * (0.3 + 0.7 * shadow);
      a *= 0.88;
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
  // ponytail: fixed cap on the render size. The biggest globes are drawn at
  // this and stretched; raise it if they ever look soft on a large display.
  const MAX = window.innerWidth < 768 ? 900 : 1400;
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
  // relief shading needs screen-space derivatives; without them globes are smooth
  const bump = gl.getExtension("OES_standard_derivatives") ? "#define BUMP\n" : "";
  gl.attachShader(program, compile(gl.FRAGMENT_SHADER, bump + FRAG));
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
