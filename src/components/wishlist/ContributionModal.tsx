"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, LockKey, Coin, Minus, Plus } from "@phosphor-icons/react";
import type { WishlistItem, Contribution } from "@/lib/types";
import { formatNaira } from "@/lib/utils";
import { EASE } from "@/lib/motion";
import { fireConfetti } from "@/components/effects/ConfettiLayer";
import { openPaystackCheckout, preloadPaystack } from "@/lib/paystack";
import { fundingPlanFor, fixedFundingAmount, unitPriceFor } from "@/lib/giftFlow";

type Step = "amount" | "pay" | "done" | "note";

export interface PrefillDetails {
  name?: string;
  email?: string;
  phone?: string;
  note?: string;
  anonymous?: boolean;
}

/**
 * Contribution flow for expensive/trip gifts ("Contribute"),
 * and cash gifts ("Gift now"). Paystack-style steps:
 * amount → pay (opens real Paystack popup) → "Gift sent!" → optional note.
 * No public amounts, no progress bars, no totals shown elsewhere.
 */
export default function ContributionModal({
  item,
  prefill,
  onContribute,
  onMarkAttempted,
  onMarkSuccessful,
  onNote,
  onClose,
}: {
  item: WishlistItem;
  prefill?: PrefillDetails | null;
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
  onNote: (id: string, note: string) => void;
  onClose: () => void;
}) {
  const plan = fundingPlanFor(item);
  const lockedAmount = fixedFundingAmount(plan);
  const unitPrice = unitPriceFor(item);
  const isFixed = lockedAmount !== null;
  const isUnits = unitPrice !== null;
  const isGift = isFixed || item.kind === "cash";
  const [step, setStep] = useState<Step>("amount");
  const [name, setName] = useState(prefill?.name ?? "");
  const [email, setEmail] = useState(prefill?.email ?? "");
  const [phone, setPhone] = useState(prefill?.phone ?? "");
  const [amount, setAmount] = useState("");
  const [units, setUnits] = useState(1);
  const [note, setNote] = useState(prefill?.note ?? "");
  const [anonymous, setAnonymous] = useState(prefill?.anonymous ?? false);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [contribId, setContribId] = useState<string | null>(null);
  const [contribution, setContribution] = useState<Contribution | null>(null);
  const verifyRef = useRef(0);

  const verifyPayment = async (created: Contribution, reference: string, attempts = 0) => {
    verifyRef.current += 1;
    const run = verifyRef.current;
    try {
      const res = await fetch("/api/paystack/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference, contributionId: created.id }),
      });
      const data = await res.json();
      if (run !== verifyRef.current) return;
      if (data.ok) {
        onMarkSuccessful(created.id, reference);
        setProcessing(false);
        setVerifying(false);
        setStep("note");
        fireConfetti("burst", { count: 60, balloons: 4 });
        return;
      }
      // Paystack says "pending" — the bank is still settling. Retry a couple
      // of times before surfacing a refresh affordance.
      if (res.status === 202 && attempts < 3) {
        window.setTimeout(() => {
          void verifyPayment(created, reference, attempts + 1);
        }, 2000);
        return;
      }
      setProcessing(false);
      setVerifying(false);
      setError(
        res.status === 202
          ? "The bank is still confirming this payment. Check again in a moment."
          : "Payment wasn't confirmed yet. Check your email and try again.",
      );
    } catch {
      if (run !== verifyRef.current) return;
      setProcessing(false);
      setVerifying(false);
      setError("Couldn't reach the payment check. Check again below.");
    }
  };

  const parsed = isFixed
    ? lockedAmount
    : isUnits
      ? units * unitPrice
      : Math.round(Number(amount));

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
    if (isFixed) {
      if (lockedAmount === null) {
        setError("This gift needs an amount configured.");
        return;
      }
    } else if (isUnits) {
      if (units < 1) {
        setError("Sponsor at least one seat.");
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
      kind: isGift ? "gift" : "contribution",
      anonymous,
    });
    if (!created) {
      setError("Something went wrong starting the payment.");
      return;
    }
    setContribution(created);
    setContribId(created.id);
    onMarkAttempted(created.id);
    setProcessing(true);
    setVerifying(true);

    const reference = `TW${created.id.replace(/-/g, "").slice(0, 16)}`;
    await openPaystackCheckout({
      email: email.trim(),
      amountKobo: parsed * 100,
      currency: "NGN",
      reference,
      onSuccess: async (ref) => {
        await verifyPayment(created, ref);
      },
      onClose: () => {
        setProcessing(false);
        setVerifying(false);
        setError("Payment window closed. Nothing was charged.");
        setStep("amount");
      },
    });
  };

  const recheckPayment = () => {
    setError(null);
    setVerifying(true);
    if (contribution) {
      const reference = `TW${contribution.id.replace(/-/g, "").slice(0, 16)}`;
      void verifyPayment(contribution, reference, 3);
    }
  };

  const submitNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (contribId) onNote(contribId, note.trim());
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
                {isGift ? "Gifting" : "Contributing toward"}
              </p>
              <h3 className="mt-2 font-display text-2xl font-bold text-cream">
                {item.name}
              </h3>
              {isFixed && lockedAmount !== null && (
                <p className="mt-3 font-display text-3xl font-bold text-gold">
                  {formatNaira(lockedAmount)}
                </p>
              )}
              {isFixed && plan?.unitPrice !== undefined && plan.covers !== undefined && (
                <p className="mt-1 text-xs text-cream/40">
                  {formatNaira(plan.unitPrice)} × {plan.covers} — one payment, no
                  need to work it out.
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
                {isUnits && (
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.15em] text-cream/50">
                      How many seats? <span className="text-gold">*</span>
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setUnits((u) => Math.max(1, u - 1))}
                        disabled={units <= 1}
                        aria-label="One seat fewer"
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-black/20 text-cream transition hover:border-gold disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <Minus size={16} weight="bold" />
                      </button>
                      <div className="flex-1 text-center">
                        <p className="font-display text-3xl font-bold text-gold">
                          {units}
                        </p>
                        <p className="mt-0.5 text-xs text-cream/40">
                          {units === 1 ? "seat" : "seats"} × {formatNaira(unitPrice)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setUnits((u) => u + 1)}
                        aria-label="One seat more"
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-black/20 text-cream transition hover:border-gold"
                      >
                        <Plus size={16} weight="bold" />
                      </button>
                    </div>
                    <p className="mt-3 text-center font-display text-xl font-bold text-cream">
                      {formatNaira(units * unitPrice)}
                    </p>
                  </div>
                )}

                {!isFixed && !isUnits && (
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.15em] text-cream/50">
                      How much would you like to send? <span className="text-gold">*</span>
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
                    Stay anonymous.
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
                  {isFixed ? (
                    <>
                      <Coin size={15} weight="bold" /> Gift {item.name} 🎁
                    </>
                  ) : isUnits ? (
                    <>
                      Sponsor {units} {units === 1 ? "seat" : "seats"} 🎁
                    </>
                  ) : (
                    <>
                      Send my gift 🎁
                    </>
                  )}
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
              {isGift && (
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
                    {verifying
                      ? "Confirming with the bank…"
                      : "Opening payment…"}
                  </span>
                ) : (
                  <>
                    <LockKey size={15} weight="bold" /> Pay {formatNaira(parsed)}
                  </>
                )}
              </button>
              {processing && verifying && (
                <p className="mt-2 text-xs text-cream/40">
                  This can take a few seconds. We check the bank on your behalf
                  — no need to click anything.
                </p>
              )}
              {error && !processing && (
                <div className="mt-3 rounded-xl border border-magenta/40 bg-magenta/10 px-4 py-3">
                  <p className="text-sm font-medium text-magenta" role="alert">
                    {error}
                  </p>
                  {contribution && (
                    <button
                      onClick={recheckPayment}
                      className="mt-2 w-full rounded-full border border-magenta/60 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-magenta transition hover:border-magenta"
                    >
                      Check again
                    </button>
                  )}
                </div>
              )}
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
                {isGift
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