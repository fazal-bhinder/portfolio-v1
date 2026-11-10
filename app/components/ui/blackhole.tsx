"use client";

import { useEffect, useRef } from "react";
import type { MotionValue } from "framer-motion";

const VERT = `
attribute vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }
`;

/*
 * A ray tracer for a non-rotating black hole. Every pixel fires a photon and
 * bends it step by step with the Schwarzschild null-geodesic acceleration,
 *   a = -1.5 * h^2 * x / |x|^5      (h = angular momentum, horizon radius = 1)
 * so the far side of the accretion disk really is lifted over the top of the
 * shadow, and the photon ring really is light that went around the back.
 * The output is premultiplied: outside the disk and the shadow it is
 * transparent, so the page's own starfield shows through.
 */
const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform float uDist;
uniform vec2 uLook;
uniform float uShift;

const float R_IN = 2.6;
const float R_OUT = 9.0;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
  return v;
}

// gas orbits faster the closer in it is; t winds the pattern up
float gas(vec2 xz, float r, float t) {
  float a = t / (r * sqrt(r));
  float c = cos(a), s = sin(a);
  vec2 q = mat2(c, -s, s, c) * xz;
  // fine rings across the radius, broken up around the orbit
  return fbm(vec2(r * 3.4, 0.0) + q * 0.35) * (0.55 + 0.9 * fbm(q * 0.9));
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  // on wide screens the hole slides right as the camera closes in, and the
  // picture is mirrored so the bright arm of the disk sweeps away from the text
  uv.x = uShift - uv.x;
  // a few degrees of roll, so the disk is not dead level
  float roll = -0.13;
  uv = mat2(cos(roll), -sin(roll), sin(roll), cos(roll)) * uv;

  float elev = 0.105 + uLook.y * 0.07;
  float az = uLook.x * 0.3;
  vec3 ro = uDist * vec3(sin(az) * cos(elev), sin(elev), -cos(az) * cos(elev));
  vec3 fw = normalize(-ro);
  vec3 rt = normalize(cross(vec3(0.0, 1.0, 0.0), fw));
  vec3 up = cross(fw, rt);
  vec3 vel = normalize(fw * 1.7 + rt * uv.x + up * uv.y);

  vec3 pos = ro;
  vec3 hv = cross(pos, vel);
  float h2 = dot(hv, hv);

  vec3 col = vec3(0.0);
  float alpha = 0.0;
  float haze = 0.0;
  float shadow = 0.0;

  // the winding is reset on two offset clocks and cross-faded, so the
  // pattern never shears into mush
  float clock = uTime * 0.04;
  float t1 = fract(clock), t2 = fract(clock + 0.5);
  float blend = abs(1.0 - 2.0 * t1);

  for (int i = 0; i < 220; i++) {
    float r2 = dot(pos, pos);
    if (r2 < 1.0) { shadow = 1.0; break; }
    if (r2 > uDist * uDist * 1.6) break;

    float dt = 0.045 * (1.0 + sqrt(r2) * 0.4);
    vel += -1.5 * h2 * pos / (r2 * r2 * sqrt(r2)) * dt;
    vec3 next = pos + vel * dt;

    // soft glow hugging the disk plane
    float rxz = length(pos.xz);
    if (rxz > R_IN && rxz < R_OUT) {
      haze += exp(-abs(pos.y) * 5.0) * dt / (1.0 + (rxz - R_IN) * 0.9);
    }

    // did this step cross the disk plane?
    if (pos.y * next.y < 0.0 && alpha < 0.98) {
      vec3 hit = mix(pos, next, pos.y / (pos.y - next.y));
      float r = length(hit.xz);
      if (r > R_IN && r < R_OUT) {
        float rr = (r - R_IN) / (R_OUT - R_IN);
        float n = mix(gas(hit.xz, r, t1 * 60.0), gas(hit.xz, r, t2 * 60.0), blend);
        float dens = smoothstep(0.0, 0.06, rr) * (1.0 - smoothstep(0.45, 1.0, rr));
        dens *= 0.25 + 1.5 * n;

        // white-hot at the inner edge, cooling outward
        vec3 heat = mix(vec3(1.0, 0.92, 0.78), vec3(1.0, 0.62, 0.26), smoothstep(0.0, 0.45, rr));
        heat = mix(heat, vec3(0.7, 0.22, 0.07), smoothstep(0.4, 1.0, rr));

        // relativistic beaming: the side orbiting toward the camera is brighter
        vec3 orbit = normalize(vec3(-hit.z, 0.0, hit.x));
        float beam = pow(1.0 + 0.5 * dot(orbit, -normalize(vel)), 3.0);

        float a = clamp(dens, 0.0, 1.0);
        col += (1.0 - alpha) * heat * a * beam * (0.62 / (0.4 + rr * 2.4));
        alpha += (1.0 - alpha) * a * 0.9;
      }
    }
    pos = next;
  }

  col += vec3(1.0, 0.7, 0.4) * haze * 0.1 * (1.0 - alpha * 0.6);
  // filmic roll-off so the hot inner edge blooms instead of clipping
  col = 1.0 - exp(-col * 1.1);

  float cover = clamp(max(alpha, shadow), 0.0, 1.0);
  gl_FragColor = vec4(col, max(cover, max(col.r, max(col.g, col.b))));
}
`;

/**
 * The black hole at the end of the film. `approach` (0 to 1) flies the camera
 * in. Renders at reduced resolution and only while on screen.
 */
export function BlackHole({
  approach,
  className,
}: {
  approach: MotionValue<number>;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const gl = canvas?.getContext("webgl", { premultipliedAlpha: true, antialias: false });
    // no WebGL: the CSS fallback underneath stays visible
    if (!canvas || !gl) return;

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
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);
    canvas.dataset.live = ""; // hides the CSS fallback

    // one triangle that covers the screen
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, "uRes");
    const uTime = gl.getUniformLocation(program, "uTime");
    const uDist = gl.getUniformLocation(program, "uDist");
    const uLook = gl.getUniformLocation(program, "uLook");
    const uShift = gl.getUniformLocation(program, "uShift");

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let visible = false;
    let raf = 0;
    const look = { x: 0, y: 0, tx: 0, ty: 0 };

    // The picture is ray-marched (220 steps per pixel), so how many pixels it
    // can afford depends on the GPU. Start at a middling budget, then let
    // tune() grow it toward the screen's real resolution while frames stay
    // smooth, and shrink it when they do not.
    const phone = window.innerWidth < 768;
    let budget = phone ? 220_000 : 700_000;
    let ceiling = phone ? 600_000 : 2_400_000;

    const resize = () => {
      const { clientWidth: cw, clientHeight: ch } = canvas;
      const dpr = Math.min(window.devicePixelRatio, 2);
      const scale = Math.min(dpr, Math.sqrt(budget / Math.max(cw * ch, 1)));
      canvas.width = Math.max(1, Math.round(cw * scale));
      canvas.height = Math.max(1, Math.round(ch * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (still) render(0);
    };

    const render = (now: number) => {
      look.x += (look.tx - look.x) * 0.05;
      look.y += (look.ty - look.y) * 0.05;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, now / 1000);
      // far away and small, then close enough that the disk leaves the frame
      const aspect = canvas.width / canvas.height;
      const portrait = aspect < 1 ? 1.7 : 1;
      const near = approach.get();
      gl.uniform1f(uDist, (30 - 17.5 * near) * portrait);
      // up to a fifth of the screen width, only where there is width to spare
      gl.uniform1f(uShift, Math.max(0, aspect - 1.1) * 0.42 * Math.min(near * 1.4, 1));
      gl.uniform2f(uLook, look.x, look.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    // ponytail: frame pacing is judged from requestAnimationFrame gaps, which
    // also stretch when the page itself is busy. If that ever shrinks the
    // picture on a fast machine, time the draw with EXT_disjoint_timer_query.
    let drawn = 0;
    let last = 0;
    let ticks = 0;
    let span = 0;
    let slow = 0;
    const tune = (gap: number) => {
      span += gap;
      if (++ticks < 40) return;
      const average = span / ticks;
      ticks = span = 0;
      const full =
        canvas.clientWidth * canvas.clientHeight * Math.min(window.devicePixelRatio, 2) ** 2;
      if (average > 24) {
        // two slow windows in a row: back off, and remember not to climb back
        if (++slow < 2) return;
        ceiling = budget * 0.9;
        budget = Math.max(budget * 0.7, 120_000);
      } else {
        slow = 0;
        if (average > 19 || budget >= Math.min(ceiling, full)) return;
        budget = Math.min(budget * 1.3, ceiling, full);
      }
      resize();
    };

    const loop = (now: number) => {
      if (last) tune(Math.min(now - last, 100));
      last = now;
      // the disk turns slowly: about 30 frames a second is plenty, at any refresh rate
      if (now - drawn > 30) {
        drawn = now;
        render(now);
      }
      raf = requestAnimationFrame(loop);
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(raf);
      last = ticks = span = 0; // time off screen is not a slow frame
      if (visible && !still) raf = requestAnimationFrame(loop);
      else if (visible) render(0);
    });
    observer.observe(canvas);

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      look.tx = (e.clientX / window.innerWidth) * 2 - 1;
      look.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const unsubscribe = still ? approach.on("change", () => visible && render(0)) : undefined;

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", move, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      unsubscribe?.();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", move);
    };
  }, [approach]);

  return (
    <div aria-hidden className={className}>
      <canvas ref={ref} className="peer absolute inset-0 h-full w-full" />
      {/* fallback if WebGL is unavailable: a shadow with a glowing rim */}
      <div className="absolute left-1/2 top-1/2 aspect-square w-[34vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-black shadow-[0_0_60px_10px_rgb(255_190_120/0.55),0_0_180px_40px_rgb(255_140_60/0.25)] peer-data-[live]:hidden" />
    </div>
  );
}
