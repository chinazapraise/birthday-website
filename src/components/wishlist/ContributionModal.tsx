"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Coin,
  Minus,
  Plus,
  Copy,
  CheckCircle,
} from "@phosphor-icons/react";
import type { WishlistItem, Contribution } from "@/lib/types";
import { formatNaira } from "@/lib/utils";
import { EASE } from "@/lib/motion";
import { fundingPlanFor, fixedFundingAmount, unitPriceFor } from "@/lib/giftFlow";

type Step = "amount" | "transfer" | "note" | "done";

const OPAY_ACCOUNT_NAME = "Onyebuchi Chinaza Praise";
const OPAY_ACCOUNT_NUMBER = "9160631930";
const OPAY_BANK_NAME = "OPay";

export interface PrefillDetails {
  name?: string;
  email?: string;
  phone?: string;
  note?: string;
  anonymous?: boolean;
}

interface ContributionModalProps {
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

  

  onNote: (id: string, note: string) => void;
  onClose: () => void;
}

export default function ContributionModal({
  item,
  prefill,
  onContribute,
  onMarkAttempted,
  onNote,
  onClose,
}: ContributionModalProps) {
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
  const [copied, setCopied] = useState(false);
  const [contribId, setContribId] = useState<string | null>(null);

  const parsed = isFixed
    ? lockedAmount
    : isUnits
      ? units * unitPrice
      : Math.round(Number(amount));

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
      if (lockedAmount === null || lockedAmount <= 0) {
        setError("This gift needs a valid amount configured.");
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

    setProcessing(true);

    try {
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
        setError("Something went wrong recording your contribution. Please try again.");
        return;
      }

      setContribId(created.id);

      // Records the contribution as pending, not successful.
      onMarkAttempted(created.id);

      setStep("transfer");
    } catch (err) {
      console.error("Could not create contribution:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const copyAccountNumber = async () => {
    try {
      await navigator.clipboard.writeText(OPAY_ACCOUNT_NUMBER);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError(
        "Could not copy the account number. Please copy it manually.",
      );
    }
  };

  const confirmTransferAttempt = () => {
    // This only advances the screen.
    // It deliberately does NOT mark the contribution as successful.
    setError(null);
    setStep("note");
  };

  const submitNote = (e: React.FormEvent) => {
    e.preventDefault();

    if (contribId && note.trim()) {
      onNote(contribId, note.trim());
    }

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

              {isFixed &&
                plan?.unitPrice !== undefined &&
                plan.covers !== undefined && (
                  <p className="mt-1 text-xs text-cream/40">
                    {formatNaira(plan.unitPrice)} × {plan.covers} — one
                    payment, no need to work it out.
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
                          {units === 1 ? "seat" : "seats"} ×{" "}
                          {formatNaira(unitPrice)}
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
                      How much would you like to send?{" "}
                      <span className="text-gold">*</span>
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
                  disabled={processing}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold to-sunset px-6 py-4 font-display text-sm font-bold uppercase tracking-widest text-ink transition-transform hover:scale-[1.01] disabled:opacity-75"
                >
                  {processing ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink/30 border-t-ink" />
                      Preparing transfer details…
                    </span>
                  ) : isFixed ? (
                    <>
                      <Coin size={15} weight="bold" /> Gift {item.name} 🎁
                    </>
                  ) : isUnits ? (
                    <>
                      Sponsor {units} {units === 1 ? "seat" : "seats"} 🎁
                    </>
                  ) : (
                    <>Continue to bank transfer 🎁</>
                  )}
                </button>
              </form>
            </>
          )}

          {step === "transfer" && (
            <div className="py-2">
              <p className="text-xs uppercase tracking-[0.2em] text-cream/40">
                Manual bank transfer
              </p>

              <h3 className="mt-2 font-display text-2xl font-bold text-cream">
                Complete your gift
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-cream/60">
                Transfer the exact amount below to the account provided.
                Your contribution will remain pending until the payment is
                checked and confirmed.
              </p>

              <div className="mt-5 rounded-2xl border border-gold/30 bg-gold/5 p-4">
                <p className="text-xs uppercase tracking-[0.15em] text-cream/45">
                  Amount to transfer
                </p>
                <p className="mt-1 font-display text-3xl font-bold text-gold">
                  {formatNaira(parsed)}
                </p>
                <p className="mt-1 text-xs text-cream/45">
                  For: {item.name}
                </p>
              </div>

              <div className="mt-4 space-y-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-cream/40">
                    Bank
                  </p>
                  <p className="mt-1 text-base font-semibold text-cream">
                    {OPAY_BANK_NAME}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-cream/40">
                    Account name
                  </p>
                  <p className="mt-1 text-base font-semibold text-cream">
                    {OPAY_ACCOUNT_NAME}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-cream/40">
                    Account number
                  </p>

                  <div className="mt-1 flex items-center justify-between gap-3">
                    <p className="font-display text-xl font-bold tracking-wider text-gold">
                      {OPAY_ACCOUNT_NUMBER}
                    </p>

                    <button
                      type="button"
                      onClick={copyAccountNumber}
                      className="flex shrink-0 items-center gap-2 rounded-full border border-white/20 px-3 py-2 text-xs text-cream transition hover:border-gold"
                    >
                      {copied ? (
                        <>
                          <CheckCircle size={16} weight="bold" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy size={16} />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-xs leading-relaxed text-cream/50">
                Please double-check the account name and amount before
                sending. Do not transfer more than the amount displayed.
              </p>

              {error && (
                <p className="mt-3 text-sm font-medium text-magenta" role="alert">
                  {error}
                </p>
              )}

              <button
                type="button"
                onClick={confirmTransferAttempt}
                className="mt-5 w-full rounded-full bg-gradient-to-r from-gold to-sunset px-6 py-4 font-display text-sm font-bold uppercase tracking-widest text-ink transition hover:scale-[1.01]"
              >
                I've made the transfer
              </button>

              <p className="mt-3 text-center text-xs leading-relaxed text-cream/40">
                This only notifies the website that you intend to have
                transferred. It does not verify or confirm payment.
              </p>

              <button
                type="button"
                onClick={() => setStep("amount")}
                className="mt-3 w-full rounded-full border border-white/15 px-6 py-3 text-sm text-cream/60 transition hover:border-white/40"
              >
                Back
              </button>
            </div>
          )}

          {step === "note" && (
            <form onSubmit={submitNote} className="py-2">
              <p className="font-display text-xl font-bold text-gold">
                Thank you for your kindness. 🤍
              </p>

           <p className="mt-2 text-sm leading-relaxed text-cream/60">
                Your contribution has been recorded as pending. It will only
                be confirmed after the account owner verifies that the money
                has arrived.
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
