"use client";

import { useRef, useState } from "react";
import { SpeakerHigh, SpeakerSlash } from "@phosphor-icons/react";

/**
 * Optional background audio. Never autoplays audibly — requires a tap.
 */
export default function AudioControl({ src }: { src?: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  const reduceMotion = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      if (reduceMotion()) return;
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label={playing ? "Turn sound off" : "Turn sound on"}
      className="fixed bottom-5 right-5 z-[70] flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/40 text-cream backdrop-blur-md transition hover:border-white/35"
    >
      {playing ? (
        <SpeakerHigh size={18} weight="bold" />
      ) : (
        <SpeakerSlash size={18} weight="bold" />
      )}
      {src && (
        <audio ref={audioRef} src={src} loop preload="none">
          <track kind="captions" />
        </audio>
      )}
    </button>
  );
}