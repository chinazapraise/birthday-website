"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "@phosphor-icons/react";
import type { WishlistItem } from "@/lib/types";
import { formatNaira } from "@/lib/utils";
import { EASE } from "@/lib/motion";

/**
 * Contribute toward a gift. No fake payments — record as pending only.
 */
export default function ContributionModal({
  item,
  onContribute,
  onClose,
}: {
  item: WishlistItem;
  onContribute: (data: {
    contributorName: string;
    amount: number;
    currency: string;
    anonymous: boolean;
  }) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [anon, setAnon] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const remaining = item.targetAmount - item.amountConfirmed;
  const parsed = Math.round(Number(amount));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError("Add your name so I can thank you.");
      return;
    }
    if (!Number.isFinite(parsed) || parsed <= 0) {
      setError("Enter a valid amount in Naira.");
      return;
    }
    onContribute({
      contributorName: name.trim(),
      amount: parsed,
      currency: item.currency || "NGN",
      anonymous: anon,
    });
    setDone(true);
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

          {done ? (
            <div className="py-6 text-center">
              <p className="font-display text-xl font-bold text-acid">
                Contribution noted. 🙏
              </p>
              <p className="mt-2 text-sm text-cream/60">
                Payment stays pending here (no payment provider is wired yet).
                Tomide will confirm directly with you.
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
                Contributing toward
              </p>
              <h3 className="mt-2 font-display text-2xl font-bold text-cream">
                {item.name}
              </h3>
              <p className="mt-2 text-sm text-cream/50">
                Needed: <span className="text-gold">{formatNaira(remaining)}</span>{" "}
                more ({formatNaira(item.amountConfirmed)} confirmed so far)
              </p>

              <form onSubmit={submit} className="mt-6 space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.15em] text-cream/50">
                    Your name <span className="text-acid">*</span>
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                    className="w-full rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-cream placeholder:text-cream/30 focus:border-acid focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.15em] text-cream/50">
                    Amount (₦) <span className="text-acid">*</span>
                  </label>
                  <input
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    type="number"
                    min={100}
                    placeholder="e.g. 10000"
                    className="w-full rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-cream placeholder:text-cream/30 focus:border-acid focus:outline-none"
                  />
                </div>
                <label className="flex items-center gap-3 text-sm text-cream/60">
                  <input
                    type="checkbox"
                    checked={anon}
                    onChange={(e) => setAnon(e.target.checked)}
                    className="h-4 w-4 accent-[#22d3ee]"
                  />
                  Keep this anonymous
                </label>

                {error && (
                  <p className="text-sm font-medium text-magenta" role="alert">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full rounded-full bg-gradient-to-r from-acid to-violet px-6 py-4 font-display text-sm font-bold uppercase tracking-widest text-ink"
                >
                  Contribute {parsed > 0 ? formatNaira(parsed) : ""}
                </button>
              </form>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}