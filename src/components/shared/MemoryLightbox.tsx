"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, CaretLeft, CaretRight, Play } from "@phosphor-icons/react";
import { useEffect } from "react";
import type { TimelineMedia } from "@/lib/types";
import PhotoPlaceholder from "@/components/ui/PhotoPlaceholder";
import { fireConfetti } from "@/components/effects/ConfettiLayer";

/**
 * Immersive lightbox with caption, prev/next, keyboard + swipe.
 */
export default function MemoryLightbox({
  media,
  index,
  label,
  onClose,
  onIndexChange,
}: {
  media: TimelineMedia[];
  index: number;
  label: string;
  onClose: () => void;
  onIndexChange: (i: number) => void;
}) {
  const item = media[index];

  useEffect(() => {
    fireConfetti("burst", { y: window.innerHeight * 0.32, count: 22 });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight")
        onIndexChange((index + 1) % media.length);
      if (e.key === "ArrowLeft")
        onIndexChange((index - 1 + media.length) % media.length);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [media.length, index, onClose, onIndexChange]);

  if (!item) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[150] flex items-center justify-center bg-ink/95 p-4 backdrop-blur-xl md:p-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <button
          className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-cream transition hover:border-white/50"
          onClick={onClose}
          aria-label="Close lightbox"
        >
          <X size={20} />
        </button>

        {media.length > 1 && (
          <>
            <button
              className="absolute left-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 text-cream transition hover:border-white/50 md:left-8"
              onClick={(e) => {
                e.stopPropagation();
                onIndexChange((index - 1 + media.length) % media.length);
              }}
              aria-label="Previous memory"
            >
              <CaretLeft size={20} />
            </button>
            <button
              className="absolute right-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 text-cream transition hover:border-white/50 md:right-8"
              onClick={(e) => {
                e.stopPropagation();
                onIndexChange((index + 1) % media.length);
              }}
              aria-label="Next memory"
            >
              <CaretRight size={20} />
            </button>
          </>
        )}

        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(_, info) => {
            if (info.offset.x < -60) onIndexChange((index + 1) % media.length);
            if (info.offset.x > 60)
              onIndexChange((index - 1 + media.length) % media.length);
          }}
          className="max-h-full w-full max-w-3xl cursor-grab active:cursor-grabbing"
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.94, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.96, opacity: 0 }}
          key={item.id}
        >
          <div className="overflow-hidden rounded-2xl border border-white/15">
            {item.type === "video" ? (
              <div className="relative flex aspect-video items-center justify-center bg-[#171327]">
                <Play size={40} className="text-cream/60" />
                <span className="absolute inset-0 flex items-center justify-center font-mono text-xs uppercase tracking-widest text-cream/40">
                  [VIDEO PLACEHOLDER]
                </span>
              </div>
            ) : item.url ? (
              <PhotoPlaceholder
                label={item.placeholderLabel}
                aspect={item.type === "artifact" ? "4:5" : "16:9"}
                className="rounded-none border-0"
                url={item.url}
                alt={item.alt}
              />
            ) : (
              <PhotoPlaceholder
                label={item.placeholderLabel}
                aspect={item.type === "artifact" ? "4:5" : "16:9"}
                className="rounded-none border-0"
              />
            )}
          </div>

          <div className="mt-4 pb-8 text-center">
            <p className="text-cream/90 md:text-lg">
              {item.caption ?? item.funnyCaption ?? ""}
            </p>
            {item.funnyCaption && item.funnyCaption !== item.caption && (
              <p className="mt-1 font-hand text-xl text-magenta">
                {item.funnyCaption}
              </p>
            )}
            <p className="mt-2 font-mono text-xs uppercase tracking-[0.25em] text-cream/35">
              {label}
            </p>
            {media.length > 1 && (
              <p className="mt-2 text-xs text-cream/40">
                {index + 1} / {media.length} · swipe or use arrow keys
              </p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}