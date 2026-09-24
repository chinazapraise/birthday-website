"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "@phosphor-icons/react";
import type { CommunityStory } from "@/lib/types";
import { EASE } from "@/lib/motion";
import { formatDate } from "@/lib/utils";

export default function StoryReader({
  story,
  onClose,
}: {
  story: CommunityStory;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[150] flex items-center justify-center bg-ink/95 p-4 backdrop-blur-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-3xl border border-white/15 bg-[#100d1c] p-6 shadow-2xl md:p-10"
          initial={{ scale: 0.95, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.96, opacity: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-cream transition hover:border-white/50"
            aria-label="Close story"
          >
            <X size={18} />
          </button>

          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em] text-cream/40">
            {story.year && <span className="text-acid">{story.year}</span>}
            <span>{story.meetingContext}</span>
          </div>

          <h2 className="mt-4 font-display text-2xl font-bold text-cream md:text-3xl">
            {story.title}
          </h2>

          <p className="mt-1 font-hand text-xl text-cream/50">
            — {story.senderName}
          </p>

          <div className="mt-6 max-h-[46vh] overflow-y-auto pr-2 leading-relaxed text-cream/80 [scrollbar-width:thin]">
            {story.body.split("\n").map((p, i) => (
              <p key={i} className="mb-4">
                {p}
              </p>
            ))}
          </div>

          {story.funnyPromptAnswer && (
            <p className="mt-4 rounded-2xl border border-magenta/25 bg-magenta/[0.07] p-4 text-sm italic text-cream/70">
              <span className="font-semibold not-italic text-magenta">
                Something Tomide will deny:
              </span>{" "}
              {story.funnyPromptAnswer}
            </p>
          )}

          <p className="mt-6 text-right text-xs text-cream/35">
            {formatDate(story.createdAt)}
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}