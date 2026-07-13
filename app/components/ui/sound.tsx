"use client";

import * as React from "react";
import { Volume2, VolumeX } from "lucide-react";

const STORAGE_KEY = "sound-enabled";
const MUSIC_SRC = "/sounds/heartleaf.mp3";
const MUSIC_VOLUME = 0.12;

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const Ctx =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctx) return null;
    audioCtx = new Ctx();
  }
  return audioCtx;
}

// short synthesized tick, like the iOS keyboard tap
function playTick(kind: "click" | "hover") {
  const ctx = getCtx();
  if (!ctx || ctx.state !== "running") return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  if (kind === "click") {
    osc.frequency.setValueAtTime(2200, now);
    osc.frequency.exponentialRampToValueAtTime(900, now + 0.03);
    gain.gain.setValueAtTime(0.18, now);
  } else {
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.02);
    gain.gain.setValueAtTime(0.05, now);
  }
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.06);
}

type SoundContextValue = {
  enabled: boolean;
  toggle: () => void;
};

const SoundContext = React.createContext<SoundContextValue>({
  enabled: true,
  toggle: () => {},
});

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = React.useState(true);
  const enabledRef = React.useRef(enabled);
  const musicRef = React.useRef<HTMLAudioElement | null>(null);
  const startedRef = React.useRef(false);

  React.useEffect(() => {
    setEnabled(localStorage.getItem(STORAGE_KEY) !== "off");
  }, []);

  React.useEffect(() => {
    enabledRef.current = enabled;
    const music = musicRef.current;
    if (!music) return;
    if (enabled && startedRef.current) {
      music.play().catch(() => {});
    } else {
      music.pause();
    }
  }, [enabled]);

  React.useEffect(() => {
    const music = new Audio(MUSIC_SRC);
    music.loop = true;
    music.volume = MUSIC_VOLUME;
    music.preload = "auto";
    musicRef.current = music;

    const isInteractive = (target: EventTarget | null) =>
      target instanceof Element && target.closest("a, button, [data-sound]");

    // browsers only allow audio after a user gesture: unlock everything
    // on the first click, then start the music
    const onClick = (e: MouseEvent) => {
      getCtx()?.resume().catch(() => {});
      if (!startedRef.current) {
        startedRef.current = true;
        if (enabledRef.current) music.play().catch(() => {});
      }
      if (enabledRef.current && isInteractive(e.target)) playTick("click");
    };

    const onMouseOver = (e: MouseEvent) => {
      if (!enabledRef.current) return;
      const el = isInteractive(e.target);
      const from =
        e.relatedTarget instanceof Element &&
        e.relatedTarget.closest("a, button, [data-sound]");
      if (el && el !== from) playTick("hover");
    };

    document.addEventListener("click", onClick);
    document.addEventListener("mouseover", onMouseOver);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("mouseover", onMouseOver);
      music.pause();
      musicRef.current = null;
    };
  }, []);

  const toggle = React.useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
      // toggling counts as the first gesture too
      if (next && !startedRef.current && musicRef.current) {
        startedRef.current = true;
        musicRef.current.play().catch(() => {});
      }
      return next;
    });
  }, []);

  return (
    <SoundContext.Provider value={{ enabled, toggle }}>
      {children}
    </SoundContext.Provider>
  );
}

export const SoundToggle: React.FC<{ className?: string }> = ({
  className,
}) => {
  const { enabled, toggle } = React.useContext(SoundContext);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="p-2">
        <div className="h-[18px] w-[18px]" />
      </div>
    );
  }

  return (
    <button
      aria-label={enabled ? "Mute sounds" : "Unmute sounds"}
      onClick={toggle}
      className={`p-2 cursor-pointer hover:text-accent dark:hover:text-accent transition-colors duration-200 ${
        className ?? "text-zinc-600 dark:text-zinc-400"
      }`}
    >
      {enabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
    </button>
  );
};
