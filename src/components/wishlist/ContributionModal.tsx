"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ArrowRight, LockKey } from "@phosphor-icons/react";
import type { WishlistItem, Contribution } from "@/lib/types";
import { formatNaira } from "@/lib/utils";
import { EASE } from "@/lib/motion";
import { fireConfetti } from "@/components/effects/ConfettiLayer";
import { openPaystackCheckout, preloadPaystack } from "@/lib/paystack";

type Step = "amount" | "pay" | "done" | "note";

/**
 * Contribution flow for expensive/trip gifts ("Contribute"),
 * and cash gifts ("Gift now"). Paystack-style steps:
 * amount → pay (opens real Paystack popup) → "Gift sent!" → optional note.
 * No public amounts, no progress bars, no totals shown elsewhere.
 */
export default function ContributionModal({
  item,
  onContribute,
  onMarkAttempted,
  onMarkSuccessful,
  onClose,
}: {
  item: WishlistItem;
  onContribute: (data: {
    name: string;
    email: string;
    phone?: string;
    amount: number;
    currency: string;
    kind: "contribution" | "gift";
    anonymous: boolean;
  }) => Contribution | null;
  onMarkAttempted: (id: string) => void;
  onMarkSuccessful: (id: string, reference: string) => void;
  onClose: () => void;
}) {
  const isCash = item.kind === "cash";
  const [step, setStep] = useState<Step>("amount");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [contribution, setContribution] = useState<Contribution | null>(null);

  const fixedAmount = isCash ? item.cashAmount ?? 0 : 0;
  const parsed = isCash ? fixedAmount : Math.round(Number(amount));

  // Warm up the Paystack script the moment the modal opens so the
  // checkout popup is instant by the time the user taps "Pay".
  useEffect(() => {
    preloadPaystack();
  }, []);

  const submitAmount = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError("Add your name so I know who to thank.");
      return;
    }
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

  const submitPay = async () => {
    setError(null);
    // Record intent first so a reference exists even if the popup is closed.
    const created = onContribute({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      amount: parsed,
      currency: "NGN",
      kind: isCash ? "gift" : "contribution",
      anonymous,
    });
    if (!created) {
      setError("Something went wrong starting the payment.");
      return;
    }
    setContribution(created);
    onMarkAttempted(created.id);
    setProcessing(true);

    const reference = `TW${created.id.replace(/-/g, "").slice(0, 16)}`;
    await openPaystackCheckout({
      email: email.trim(),
      amountKobo: parsed * 100,
      currency: "NGN",
      reference,
      onSuccess: async (ref) => {
        try {
          const res = await fetch("/api/paystack/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reference: ref, contributionId: created.id }),
          });
          const data = await res.json();
          if (data.ok) {
            onMarkSuccessful(created.id, ref);
            setProcessing(false);
            setStep(isCash ? "done" : "note");
            fireConfetti("burst", { count: 60, balloons: 4 });
          } else {
            setProcessing(false);
            setError(
              data.error === "payment not successful"
                ? "Payment wasn't confirmed. Try again."
                : "Payment couldn't be verified. Try again.",
            );
            setStep("amount");
          }
        } catch {
          setProcessing(false);
          setError("Couldn't connect to the payment check. Try again.");
          setStep("amount");
        }
      },
      onClose: () => {
        setProcessing(false);
        setError("Payment window closed. Nothing was charged.");
        setStep("amount");
      },
    });
  };

  const submitNote = (e: React.FormEvent) => {
    e.preventDefault();
    void note;
    setStep("done");
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[150] flex items-end justify-center bg-ink/90 backdrop-blur-md sm:p-4 md:items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label={`Contribute to ${item.name}`}
      >
        <motion.div
          className="relative max-h-[92dvh] w-full max-w-md overflow-y-auto overscroll-contain rounded-t-3xl border-t border-white/15 bg-[#100d1c] p-6 pb-10 sm:rounded-t-3xl md:rounded-3xl md:border md:p-8"
          style={{
            paddingBottom: "max(2.5rem, env(safe-area-inset-bottom, 0px))",
          }}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ duration: 0.38, ease: EASE }}
          onClick={(e) => e.stopPropagation()}
        >
          <span
            className="absolute left-1/2 top-3 h-1 w-10 -translate-x-1/2 rounded-full bg-white/20 md:hidden"
            aria-hidden="true"
          />
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-cream/70 transition hover:border-white/40"
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
                    Your name <span className="text-gold">*</span>
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    placeholder="Name"
                    className="w-full rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-cream placeholder:text-cream/30 focus:border-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.15em] text-cream/50">
                    Your email <span className="text-gold">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-cream placeholder:text-cream/30 focus:border-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.15em] text-cream/50">
                    Phone <span className="text-cream/35">(recommended)</span>
                  </label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="WhatsApp number, in case…"
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
                      inputMode="numeric"
                      min={100}
                      step={100}
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
                    Stay anonymous. The gift still shows on the board — your name just won&apos;t.
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