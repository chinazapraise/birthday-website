"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ArrowRight, LockKey } from "@phosphor-icons/react";
import type { WishlistItem } from "@/lib/types";
import { formatNaira } from "@/lib/utils";
import { EASE } from "@/lib/motion";

type Step = "amount" | "pay" | "done" | "note";

/**
 * Contribution flow for expensive/trip gifts ("Contribute"),
 * and cash gifts ("Gift now"). Paystack-style steps:
 * amount → pay → "Gift sent!" → optional note → back.
 * No public amounts, no progress bars, no totals shown elsewhere.
 */
export default function ContributionModal({
  item,
  onContribute,
  onClose,
}: {
  item: WishlistItem;
  onContribute: (data: {
    email: string;
    amount: number;
    currency: string;
    kind: "contribution" | "gift";
    anonymous: boolean;
  }) => void;
  onClose: () => void;
}) {
  const isCash = item.kind === "cash";
  const [step, setStep] = useState<Step>("amount");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const fixedAmount = isCash ? item.cashAmount ?? 0 : 0;
  const parsed = isCash ? fixedAmount : Math.round(Number(amount));

  const submitAmount = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError("Add your email so I can thank you properly.");
      return;
    }
    if (isCash) {
      if (item.cashAmount === undefined) {
        setError("This gift needs an amount configured.");
        return;
      }
    } else if (!Number.isFinite(parsed) || parsed <= 0) {
      setError("Enter a valid amount in Naira.");
      return;
    }
    setStep("pay");
  };

  const submitPay = () => {
    setProcessing(true);
    // Payment gateway hooks in here (Paystack). For the demo we record the
    // intent locally — no fake money changes hands.
    setTimeout(() => {
      onContribute({
        email: email.trim(),
        amount: parsed,
        currency: "NGN",
        kind: isCash ? "gift" : "contribution",
        anonymous,
      });
      setProcessing(false);
      setStep(isCash ? "done" : "note");
    }, 900);
  };

  const submitNote = (e: React.FormEvent) => {
    e.preventDefault();
    void note;
    setStep("done");
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

          {step === "amount" && (
            <>
              <p className="text-xs uppercase tracking-[0.2em] text-cream/40">
                {isCash ? "Gifting" : "Contributing toward"}
              </p>
              <h3 className="mt-2 font-display text-2xl font-bold text-cream">
                {item.name}
              </h3>
              {isCash && item.cashAmount !== undefined && (
                <p className="mt-3 font-display text-3xl font-bold text-gold">
                  {formatNaira(item.cashAmount)}
                </p>
              )}

              <form onSubmit={submitAmount} className="mt-6 space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.15em] text-cream/50">
                    Your email <span className="text-gold">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-cream placeholder:text-cream/30 focus:border-gold focus:outline-none"
                  />
                </div>
                {!isCash && (
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.15em] text-cream/50">
                      Amount (₦) <span className="text-gold">*</span>
                    </label>
                    <input
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      type="number"
                      min={100}
                      placeholder="e.g. 10000"
                      className="w-full rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-cream placeholder:text-cream/30 focus:border-gold focus:outline-none"
                    />
                  </div>
                )}

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-4 py-3 transition hover:border-white/25">
                  <input
                    type="checkbox"
                    checked={anonymous}
                    onChange={(e) => setAnonymous(e.target.checked)}
                    className="h-4 w-4 accent-gold"
                  />
                  <span className="text-xs leading-snug text-cream/55">
                    Stay anonymous. Only Tomide will know who chipped in.
                  </span>
                </label>

                {error && (
                  <p className="text-sm font-medium text-magenta" role="alert">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold to-sunset px-6 py-4 font-display text-sm font-bold uppercase tracking-widest text-ink transition-transform hover:scale-[1.01]"
                >
                  Continue <ArrowRight size={15} weight="bold" />
                </button>
              </form>
            </>
          )}

          {step === "pay" && (
            <div className="py-2 text-center">
              <p className="text-xs uppercase tracking-[0.2em] text-cream/40">
                Confirm payment
              </p>
              <h3 className="mt-2 font-display text-2xl font-bold text-cream">
                {item.name}
              </h3>
              <p className="mt-3 font-display text-3xl font-bold text-gold">
                {formatNaira(parsed)}
              </p>
              <p className="mt-1 text-xs text-cream/40">{email.trim()}</p>
              {isCash && (
                <p className="mt-3 text-sm text-cream/55">
                  A once-off gift. You&apos;re giving {formatNaira(parsed)} for
                  the birthday. 🎉
                </p>
              )}

              <button
                onClick={submitPay}
                disabled={processing}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-acid to-violet px-6 py-4 font-display text-sm font-bold uppercase tracking-widest text-ink transition-transform hover:scale-[1.01] disabled:opacity-60"
              >
                {processing ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink/30 border-t-ink" />
                    Processing…
                  </span>
                ) : (
                  <>
                    <LockKey size={15} weight="bold" /> Pay {formatNaira(parsed)}
                  </>
                )}
              </button>
              <button
                onClick={() => setStep("amount")}
                className="mt-3 w-full rounded-full border border-white/15 px-6 py-3 text-sm text-cream/60 transition hover:border-white/40"
              >
                Back
              </button>
            </div>
          )}

          {step === "note" && (
            <form onSubmit={submitNote} className="py-2">
              <p className="font-display text-xl font-bold text-acid">
                Gift sent. 🎉
              </p>
              <p className="mt-2 text-sm text-cream/60">
                Thank you. Want to leave a note with it?
              </p>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                placeholder="Optional: a short note for Tomide"
                className="mt-4 w-full resize-none rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-cream placeholder:text-cream/30 focus:border-acid focus:outline-none"
              />
              <button
                type="submit"
                className="mt-4 w-full rounded-full border border-white/20 px-6 py-3 text-sm text-cream transition hover:border-white/40"
              >
                Done
              </button>
            </form>
          )}

          {step === "done" && (
            <div className="py-6 text-center">
              <p className="font-display text-xl font-bold text-acid">
                Gift sent. 🎁
              </p>
              <p className="mt-2 text-sm text-cream/60">
                {isCash
                  ? "This will show up quietly as “gifted” on the board. No amounts, no fuss."
                  : "Your contribution is recorded. It’ll show up as contributed on the card."}
              </p>
              <button
                onClick={onClose}
                className="mt-6 rounded-full border border-white/20 px-6 py-3 text-sm text-cream transition hover:border-white/40"
              >
                Back to the wishlist
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}