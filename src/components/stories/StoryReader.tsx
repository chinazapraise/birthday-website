"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "@phosphor-icons/react";
import type { CommunityStory } from "@/lib/types";
import { EASE } from "@/lib/motion";
import MagazineStory from "@/components/stories/MagazineStory";

export default function StoryReader({
  story,
  number,
  onClose,
}: {
  story: CommunityStory;
  number: string;
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
          className="relative max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-3xl border border-white/15 bg-[#100d1c] shadow-2xl"
          initial={{ scale: 0.95, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.96, opacity: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-ink/60 text-cream backdrop-blur transition hover:border-white/50"
            aria-label="Close story"
          >
            <X size={18} />
          </button>

          <div className="max-h-[92vh] overflow-y-auto p-6 md:p-12">
            <MagazineStory
              story={story}
              number={number}
              variant="spread"
              index={parseInt(number, 10) - 1}
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}