"use client";

import { useStories } from "@/lib/hooks";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import MagazineStory from "@/components/stories/MagazineStory";
import { EASE } from "@/lib/motion";
import { fireConfettiAtPoint } from "@/components/effects/ConfettiLayer";
import { cn } from "@/lib/utils";
import {
  CaretLeft,
  CaretRight,
  EnvelopeSimple,
  X,
} from "@phosphor-icons/react";

const pad = (n: number) => String(n).padStart(2, "0");

const pageVariants: Variants = {
  enter: (d: number) => ({
    x: d > 0 ? 160 : -160,
    rotateY: d > 0 ? 14 : -14,
    opacity: 0,
  }),
  center: {
    x: 0,
    rotateY: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: EASE },
  },
  exit: (d: number) => ({
    x: d > 0 ? -160 : 160,
    rotateY: d > 0 ? -14 : 14,
    opacity: 0,
    transition: { duration: 0.35, ease: EASE },
  }),
};

/**
 * The Storybook. A closed magazine cover taps open into one focused
 * page at a time: Story 01 is the feature, right arrow turns to 02,
 * left arrow turns back. New public stories auto-number as pages.
 */
export default function StoryGallery() {
  const { stories } = useStories();
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const total = stories.length;
  const pageRef = useRef<HTMLDivElement>(null);
  const touchX = useRef(0);

  const turn = useCallback(
    (d: 1 | -1) => {
      if (d === 1) {
        if (page < total - 1) {
          setDir(1);
          setPage((p) => p + 1);
        }
      } else {
        if (page > 0) {
          setDir(-1);
          setPage((p) => p - 1);
        }
      }
    },
    [page, total],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") turn(1);
      if (e.key === "ArrowLeft") turn(-1);
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, turn]);

  useEffect(() => {
    pageRef.current?.scrollTo({ top: 0 });
  }, [page]);

  if (total === 0) {
    return (
      <p className="py-14 text-center font-hand text-2xl text-cream/50">
        Apparently everyone is still gathering evidence 😂. Be the first.
      </p>
    );
  }

  const story = stories[Math.min(page, total - 1)];
  const compact =
    story.body.length > 650 ||
    (story.photos.length > 1 && story.body.length > 420);

  return (
    <>
      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="[perspective:1800px]">
          <AnimatePresence>
            {!open && (
              <motion.button
                key="cover"
                type="button"
                onClick={(e) => {
                  fireConfettiAtPoint(e, 18);
                  setDir(1);
                  setPage(0);
                  setOpen(true);
                }}
                className="group relative mx-auto block w-full max-w-xl cursor-pointer text-left"
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, ease: EASE }}
                exit={{
                  rotateY: -52,
                  x: "-30%",
                  scale: 0.92,
                  opacity: 0,
                  transformOrigin: "left center",
                  transition: { duration: 0.7, ease: EASE },
                }}
                whileHover={{ y: -8 }}
                style={{ transformOrigin: "left center" }}
                aria-label="Open the storybook"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-3xl border border-white/15 bg-[#100d1c] shadow-[0_0_80px_rgba(139,92,246,0.15)]">
                  <div className="absolute inset-0 bg-gradient-to-br from-violet/20 via-transparent to-magenta/15" />
                  <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(115deg,transparent_49.5%,#f7efdf_49.5%,#f7efdf_50.5%,transparent_50.5%),linear-gradient(-115deg,transparent_49.5%,#f7efdf_49.5%,#f7efdf_50.5%,transparent_50.5%)]" />

                  <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/10" />

                  <div className="relative flex h-full flex-col px-10 pb-10 pt-12">
                    <div className="flex items-center gap-3">
                      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-acid/60" />
                      <p className="text-[0.6rem] font-bold uppercase tracking-[0.35em] text-acid">
                        The Story So Far
                      </p>
                      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-acid/60" />
                    </div>

                    <div className="mt-6 text-center">
                      <p className="font-display text-[5rem] font-black leading-none text-cream md:text-[7rem]">
                        <span className="hero-27">27</span>
                      </p>
                      <h2 className="mt-2 font-display text-2xl font-bold uppercase tracking-[0.2em] text-cream md:text-3xl">
                        Storybook
                      </h2>
                      <p className="mx-auto mt-4 max-w-xs font-hand text-xl leading-snug text-cream/65">
                        A birthday magazine written by the people who know him.
                      </p>
                    </div>

                    <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-5">
                      <p className="text-[0.6rem] font-bold uppercase tracking-[0.3em] text-cream/40">
                        In this issue
                      </p>
                      <ol className="mt-3 space-y-2.5">
                        {stories.slice(0, 4).map((s, i) => (
                          <li
                            key={s.id}
                            className="flex items-baseline gap-3 text-sm text-cream/80"
                          >
                            <span className="font-mono text-xs font-bold text-magenta">
                              {pad(i + 1)}
                            </span>
                            <span className="truncate">{s.title}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div className="mt-auto pt-6 text-center">
                      <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.2em] text-cream/45">
                        <EnvelopeSimple size={12} weight="fill" className="text-acid" />
                        {total} {total === 1 ? "chapter" : "chapters"} inside
                        <span className="text-cream/25">·</span> Vol. I
                      </div>
                      <p className="mt-4 animate-pulse font-hand text-2xl text-cream/70 transition group-hover:text-cream">
                        tap to open →
                      </p>
                    </div>
                  </div>
                </div>
              </motion.button>
            )}
          </AnimatePresence>

          {open && (
            <motion.div
              key="magazine"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <div className="mb-5 flex items-center justify-between">
                <p className="font-hand text-xl text-cream/60">
                  Story {pad(story ? page + 1 : 1)} of {pad(total)}
                </p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.15em] text-cream/60 transition hover:border-magenta/40 hover:text-cream"
                >
                  <X size={12} weight="bold" /> close book
                </button>
              </div>

              <div className="relative h-[62dvh] min-h-[420px] max-h-[680px] w-full sm:min-h-[480px]">
                <div className="absolute inset-0 rounded-3xl bg-black/40 blur-2xl" />
                <div className="absolute inset-0 [perspective:1600px]">
                  <AnimatePresence custom={dir} initial={false} mode="popLayout">
                    {story && (
                      <motion.div
                        key={story.id}
                        custom={dir}
                        variants={pageVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="absolute inset-0"
                        style={{ transformOrigin: "center" }}
                      >
                        <div className="absolute inset-x-2 top-3 bottom-3 sm:inset-x-3 md:inset-x-8 md:top-8 md:bottom-8">
                          <div
                            ref={pageRef}
                            onTouchStart={(e) => {
                              touchX.current = e.touches[0]?.clientX ?? 0;
                            }}
                            onTouchEnd={(e) => {
                              const dx =
                                (e.changedTouches[0]?.clientX ?? 0) -
                                touchX.current;
                              if (Math.abs(dx) < 50) return;
                              turn(dx < 0 ? 1 : -1);
                            }}
                            className="h-full touch-pan-y overflow-y-auto overscroll-contain rounded-2xl border border-white/10 bg-[#100d1c] shadow-[0_20px_60px_rgba(0,0,0,0.5)] [scrollbar-width:thin]"
                          >
                            <MagazineStory
                              story={story}
                              number={pad(page + 1)}
                              variant="spread"
                              index={page}
                              compact={compact}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  type="button"
                  onClick={() => turn(-1)}
                  disabled={page === 0}
                  aria-label="Previous story"
                  className={cn(
                    "absolute left-1 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-ink/80 text-cream shadow-lg backdrop-blur transition sm:-left-2 md:-left-5",
                    page === 0
                      ? "cursor-not-allowed opacity-30"
                      : "hover:border-acid/50 hover:text-acid",
                  )}
                >
                  <CaretLeft size={20} weight="bold" />
                </button>

                <button
                  type="button"
                  onClick={() => turn(1)}
                  disabled={page >= total - 1}
                  aria-label="Next story"
                  className={cn(
                    "absolute right-1 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-ink/80 text-cream shadow-lg backdrop-blur transition sm:-right-2 md:-right-5",
                    page >= total - 1
                      ? "cursor-not-allowed opacity-30"
                      : "hover:border-magenta/50 hover:text-magenta",
                  )}
                >
                  <CaretRight size={20} weight="bold" />
                </button>
              </div>

              <div className="mt-6 flex items-center justify-center gap-2">
                {stories.map((s, i) => (
                  <span
                    key={s.id}
                    onClick={() => {
                      setDir(i > page ? 1 : -1);
                      setPage(i);
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        setDir(i > page ? 1 : -1);
                        setPage(i);
                      }
                    }}
                    aria-label={`Go to story ${pad(i + 1)}`}
                    className={cn(
                      "h-1.5 cursor-pointer rounded-full transition-all",
                      i === page
                        ? "w-6 bg-gradient-to-r from-violet to-magenta"
                        : "w-1.5 bg-white/25 hover:bg-white/50",
                    )}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}