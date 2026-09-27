"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { Wish } from "@/lib/types";
import { EASE } from "@/lib/motion";
import { formatDate, initials } from "@/lib/utils";
import { fireConfetti } from "@/components/effects/ConfettiLayer";
import { ArrowRight, Lock } from "@phosphor-icons/react";

const ROTATIONS = ["-2", "1.5", "-1", "2", "-1.5", "0.5"];

/**
 * One hanging birthday pumpkin. Tap the pumpkin to crack it open,
 * then read the wish as part of the normal page flow.
 */
export default function WishCard({
  wish,
  index,
  open,
  onOpen,
  onNext,
  hasNext,
}: {
  wish: Wish;
  index: number;
  open: boolean;
  onOpen: () => void;
  onNext: () => void;
  hasNext: boolean;
}) {
  const rot = ROTATIONS[index % ROTATIONS.length];

  const reveal = () => {
    if (open) return;
    onOpen();
    fireConfetti("burst", { count: 30 });
  };

  return (
    <motion.article
      className="mx-auto w-full max-w-2xl scroll-mt-28 text-center [perspective:1400px]"
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: (index % 6) * 0.07, ease: EASE }}
    >
      <div className="relative flex min-h-[360px] flex-col items-center pt-2">
        <div className="h-24 w-px bg-gradient-to-b from-transparent via-cream/50 to-cream/15" />
        <div className="h-3 w-3 rounded-full border border-cream/30 bg-ink shadow-[0_0_20px_rgba(247,239,223,0.25)]" />

        <AnimatePresence>
          {!open && (
            <motion.div
              key="pumpkin"
              className="group relative mt-[-2px] flex w-full flex-col items-center"
              exit={{ opacity: 0, scale: 1.08, y: 20, rotate: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <motion.button
                type="button"
                className="relative h-64 w-64 touch-manipulation outline-none sm:h-72 sm:w-72"
                style={{ rotate: `${rot}deg` }}
                animate={{ rotate: [`${Number(rot) - 1.4}deg`, `${Number(rot) + 1.4}deg`, `${Number(rot) - 1.4}deg`] }}
                transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
                whileTap={{ scale: 0.96 }}
                onClick={reveal}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") reveal();
                }}
                aria-label={`Open wish from ${wish.senderName}`}
              >
                <span className="absolute left-1/2 top-1 h-12 w-8 -translate-x-1/2 rotate-6 rounded-t-full bg-gradient-to-b from-[#79502a] to-[#3f2818]" />
                <span className="absolute left-1/2 top-10 h-44 w-44 -translate-x-1/2 rounded-[48%] bg-gradient-to-b from-sunset to-[#b84a26] shadow-[inset_18px_0_34px_rgba(255,255,255,0.13),inset_-18px_0_28px_rgba(0,0,0,0.22),0_24px_70px_rgba(244,63,94,0.24)]" />
                <span className="absolute left-[22%] top-12 h-40 w-24 rounded-[50%] bg-gradient-to-b from-[#ff9a43] to-[#c45124] shadow-[inset_-10px_0_20px_rgba(0,0,0,0.15)]" />
                <span className="absolute right-[22%] top-12 h-40 w-24 rounded-[50%] bg-gradient-to-b from-[#ff8c38] to-[#a93f20] shadow-[inset_10px_0_20px_rgba(255,255,255,0.12)]" />
                <span className="absolute left-1/2 top-[6.2rem] z-10 -translate-x-1/2 rounded-full border border-white/20 bg-black/25 px-5 py-3 backdrop-blur">
                  <span className="block font-display text-2xl font-black text-cream">
                    {initials(wish.anonymous ? "Anonymous" : wish.senderName)}
                  </span>
                </span>
                <span className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/20 bg-ink/70 px-4 py-2 text-xs uppercase tracking-[0.22em] text-cream/75 backdrop-blur transition group-hover:text-cream">
                  tap to open
                </span>
              </motion.button>

              <p className="mt-2 font-hand text-2xl text-cream/70">
                A hanging birthday pumpkin from{" "}
                <span className="text-cream">
                  {wish.anonymous ? "Anonymous" : wish.senderName}
                </span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {open && (
            <motion.div
              key="wish"
              className="relative mt-4 w-full rounded-3xl border border-white/15 bg-[#171324]/95 p-6 text-left shadow-[0_24px_80px_rgba(0,0,0,0.4)] sm:p-8"
              initial={{ y: 42, scale: 0.94, opacity: 0, rotateX: -8 }}
              animate={{ y: 0, scale: 1, opacity: 1, rotateX: 0 }}
              transition={{ type: "spring", stiffness: 170, damping: 18 }}
              role="button"
              tabIndex={0}
              aria-label={`Wish from ${wish.senderName}`}
            >
              <div className="pointer-events-none absolute -top-10 left-1/2 flex -translate-x-1/2 items-end gap-1">
                <span className="h-16 w-16 -rotate-12 rounded-[45%] bg-sunset/80 opacity-70 blur-[1px]" />
                <span className="h-20 w-20 rounded-[45%] bg-magenta/70 opacity-60 blur-[1px]" />
                <span className="h-16 w-16 rotate-12 rounded-[45%] bg-gold/80 opacity-70 blur-[1px]" />
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="font-display text-xs font-bold uppercase tracking-[0.2em] text-magenta">
                  {wish.anonymous ? "Anonymous" : wish.senderName}
                </span>
                {wish.relationship ? (
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[0.65rem] uppercase tracking-wider text-cream/50">
                    {wish.relationship}
                  </span>
                ) : null}
              </div>

              <div className="mt-3 flex items-center gap-3 border-y border-white/10 py-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/25 bg-gradient-to-br from-violet/40 to-magenta/30 text-sm font-bold text-cream">
                  {initials(
                    wish.anonymous ? "Anonymous" : wish.senderName,
                  )}
                </span>
                <p className="font-hand text-xl leading-tight text-cream/80">
                  Dear Tomide,
                </p>
              </div>

              <p className="mt-5 whitespace-pre-wrap text-base leading-8 text-cream/85">
                {wish.message}
              </p>

              <div className="mt-6 flex flex-col gap-4 border-t border-white/10 pt-5 text-[0.65rem] uppercase tracking-[0.2em] text-cream/35 sm:flex-row sm:items-center sm:justify-between">
                <span>
                  {wish.anonymous && (
                    <Lock size={11} weight="fill" className="mr-1 inline -mt-0.5" />
                  )}
                  sealed {formatDate(wish.createdAt)}
                </span>
                <span className="font-hand normal-case tracking-normal text-cream/50">
                  {wish.anonymous ? "a secret admirer" : `- ${wish.senderName}`}
                </span>
              </div>

              <button
                type="button"
                onClick={onNext}
                className="mt-7 flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-magenta/35 bg-magenta/15 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-cream transition hover:border-magenta/70 hover:bg-magenta/25 sm:w-auto"
              >
                {hasNext ? "Next Wish" : "Start Again"} <ArrowRight size={16} weight="bold" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  );
}
