"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "@phosphor-icons/react";
import type { WishlistItem } from "@/lib/types";
import { fireConfetti } from "@/components/effects/ConfettiLayer";
import { EASE } from "@/lib/motion";

/**
 * "Get this for me" / "I'm getting this" — reserves the item, no double booking.
 */
export default function GiftClaimModal({
  item,
  onClaim,
  onClose,
}: {
  item: WishlistItem;
  onClaim: (data: {
    claimantName: string;
    contact?: string;
    note?: string;
    anonymousToPublic: boolean;
  }) => boolean;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [note, setNote] = useState("");
  const [anon, setAnon] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gone, setGone] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError("Add your name so I know who to thank.");
      return;
    }
    const ok = onClaim({
      claimantName: name.trim(),
      contact: contact.trim() || undefined,
      note: note.trim() || undefined,
      anonymousToPublic: anon,
    });
    if (ok) {
      setGone(true);
      fireConfetti("burst");
    } else {
      setError("Someone just claimed this before you. Pick another gift or contribute instead.");
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[150] flex items-center justify-center bg-ink/90 p-4 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl border border-white/15 bg-[#100d1c] p-6 md:p-8"
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0 }}
          transition={{ duration: 0.35, ease: EASE }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-cream/70 transition hover:border-white/40"
            aria-label="Close"
          >
            <X size={16} />
          </button>

          {gone ? (
            <div className="py-6 text-center">
              <p className="font-display text-xl font-bold text-gold">
                Recorded. 🎁
              </p>
              <p className="mt-2 text-sm text-cream/60">
                You’re getting this for Tomide. It’ll show up as
                “Someone’s got this ❤️” on the board.
              </p>
              <button
                onClick={onClose}
                className="mt-6 rounded-full border border-white/20 px-6 py-3 text-sm text-cream transition hover:border-white/40"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              <p className="text-xs uppercase tracking-[0.2em] text-cream/40">
                Getting for Tomide
              </p>
              <h3 className="mt-2 font-display text-2xl font-bold text-cream">
                {item.name}
              </h3>

              <form onSubmit={submit} className="mt-6 space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.15em] text-cream/50">
                    Your name <span className="text-magenta">*</span>
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                    className="w-full rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-cream placeholder:text-cream/30 focus:border-magenta focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.15em] text-cream/50">
                    Email / phone (optional)
                  </label>
                  <input
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="So I can say thank you properly"
                    className="w-full rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-cream placeholder:text-cream/30 focus:border-magenta focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.15em] text-cream/50">
                    Note (optional)
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={3}
                    placeholder="Anything to say?"
                    className="w-full resize-none rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-cream placeholder:text-cream/30 focus:border-magenta focus:outline-none"
                  />
                </div>
                <label className="flex items-center gap-3 text-sm text-cream/60">
                  <input
                    type="checkbox"
                    checked={anon}
                    onChange={(e) => setAnon(e.target.checked)}
                    className="h-4 w-4 accent-[#f43f9e]"
                  />
                  Keep it a mystery — don’t show my name publicly
                </label>

                {error && (
                  <p className="text-sm font-medium text-magenta" role="alert">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full rounded-full bg-gradient-to-r from-violet to-magenta px-6 py-4 font-display text-sm font-bold uppercase tracking-widest text-ink"
                >
                  Claim gift
                </button>
              </form>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}