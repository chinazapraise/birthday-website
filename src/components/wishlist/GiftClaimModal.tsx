"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ArrowRight, HandHeart, CheckCircle } from "@phosphor-icons/react";
import type { WishlistItem } from "@/lib/types";
import { fireConfetti } from "@/components/effects/ConfettiLayer";
import { EASE } from "@/lib/motion";
import { clamp } from "@/lib/utils";

type Mode = "claim" | "reserve";

/**
 * "Get It For Me" — two-intent modal.
 * Reserve = interested (never blocks). Claim = commitment (blocks exclusive gifts).
 * Multi gifts allow quantity (e.g. wall frames).
 * Anonymous option keeps the name private on the public card.
 */
export default function GiftClaimModal({
  item,
  canClaim,
  onClaim,
  onReserve,
  onClose,
}: {
  item: WishlistItem;
  canClaim: boolean;
  onClaim: (data: {
    name: string;
    email?: string;
    phone?: string;
    note?: string;
    quantity: number;
    anonymous: boolean;
  }) => boolean;
  onReserve: (data: {
    name: string;
    email?: string;
    phone?: string;
    quantity: number;
    anonymous: boolean;
  }) => boolean;
  onClose: () => void;
}) {
  const [mode, setMode] = useState<Mode>(canClaim ? "claim" : "reserve");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [anonymous, setAnonymous] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<null | "claim" | "reserve">(null);

  const isMulti = item.kind === "multi";
  const maxQ = clamp(item.maxQuantity ?? 1, 1, 99);

  const switchMode = (m: Mode) => {
    setMode(m);
    setError(null);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError("Add your name so I know who to thank.");
      return;
    }
    const q = isMulti ? clamp(quantity, 1, maxQ) : 1;

    if (mode === "claim") {
      const ok = onClaim({
        name: name.trim(),
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        note: note.trim() || undefined,
        quantity: q,
        anonymous,
      });
      if (ok) {
        setDone("claim");
        fireConfetti("burst", { count: 70, balloons: 4 });
      } else {
        setError(
          item.kind === "trip"
            ? "Someone already sponsored this one. Pick another or contribute instead."
            : "Someone just claimed this before you. Pick another gift or contribute instead.",
        );
      }
    } else {
      onReserve({
        name: name.trim(),
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        quantity: q,
        anonymous,
      });
      setDone("reserve");
      fireConfetti("burst", { count: 26 });
    }
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
        aria-label={`Claim or reserve ${item.name}`}
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

          {done ? (
            <div className="py-6 text-center">
              <p className="font-display text-xl font-bold text-gold">
                {done === "claim" ? "Gift sent. 🎁" : "Reserved. ✅"}
              </p>
              <p className="mt-2 text-sm text-cream/60">
                {done === "claim"
                  ? item.kind === "trip"
                    ? "That's the trip covered. I'll be packing my bags soon."
                    : item.kind === "multi"
                      ? "You're getting this for Tomide. It stays open so others can gift it too."
                      : "You're getting this for Tomide. It'll show up as claimed on the board."
                  : "You're interested, noted. It doesn't block anyone else. You can claim it properly anytime."}
                {isMulti && quantity > 1 && (
                  <span> You reserved {quantity} of this one.</span>
                )}
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
                {item.kind === "trip" ? "Sponsoring for Tomide" : "Getting for Tomide"}
              </p>
              <h3 className="mt-2 font-display text-2xl font-bold text-cream">
                {item.name}
              </h3>

              {/* Reserve vs Claim toggle */}
              <div className="mt-5 grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-black/20 p-1">
                <button
                  type="button"
                  onClick={() => switchMode("claim")}
                  disabled={!canClaim}
                  className={`flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-bold uppercase tracking-wider transition disabled:cursor-not-allowed disabled:opacity-40 ${
                    mode === "claim"
                      ? "bg-gradient-to-r from-violet to-magenta text-ink"
                      : "text-cream/60 hover:text-cream"
                  }`}
                >
                  <CheckCircle size={14} weight="bold" /> Claim
                </button>
                <button
                  type="button"
                  onClick={() => switchMode("reserve")}
                  className={`flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-bold uppercase tracking-wider transition ${
                    mode === "reserve"
                      ? "bg-gradient-to-r from-gold to-sunset text-ink"
                      : "text-cream/60 hover:text-cream"
                  }`}
                >
                  <HandHeart size={14} weight="bold" /> Reserve
                </button>
              </div>
              <p className="mt-2 text-center text-xs text-cream/45">
                {mode === "claim" && !canClaim
                  ? "Someone already claimed this. You can only reserve."
                  : ""}
              </p>

              <form onSubmit={submit} className="mt-5 space-y-4">
                {isMulti && maxQ > 1 && (
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.15em] text-cream/50">
                      Quantity <span className="text-cream/35">(max {maxQ})</span>
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => clamp(q - 1, 1, maxQ))}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-cream transition hover:border-white/40"
                        aria-label="Fewer"
                      >
                        –
                      </button>
                      <span className="w-10 text-center font-display text-xl font-bold text-cream">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => clamp(q + 1, 1, maxQ))}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-cream transition hover:border-white/40"
                        aria-label="More"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.15em] text-cream/50">
                    Your name <span className="text-magenta">*</span>
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    placeholder="Name"
                    className="w-full rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-cream placeholder:text-cream/30 focus:border-magenta focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.15em] text-cream/50">
                    Email <span className="text-cream/35">(recommended)</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    placeholder="So I can say thank you properly"
                    className="w-full rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-cream placeholder:text-cream/30 focus:border-magenta focus:outline-none"
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
                    className="w-full rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-cream placeholder:text-cream/30 focus:border-magenta focus:outline-none"
                  />
                </div>
                {mode === "claim" && (
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.15em] text-cream/50">
                      Note (optional)
                    </label>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      rows={2}
                      placeholder="Anything to say?"
                      className="w-full resize-none rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-cream placeholder:text-cream/30 focus:border-magenta focus:outline-none"
                    />
                  </div>
                )}

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-4 py-3 transition hover:border-white/25">
                  <input
                    type="checkbox"
                    checked={anonymous}
                    onChange={(e) => setAnonymous(e.target.checked)}
                    className="h-4 w-4 accent-magenta"
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
                  className={`flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 font-display text-sm font-bold uppercase tracking-widest transition-transform hover:scale-[1.01] ${
                    mode === "claim"
                      ? "bg-gradient-to-r from-violet to-magenta text-ink"
                      : "bg-gradient-to-r from-gold to-sunset text-ink"
                  }`}
                >
                  <ArrowRight size={16} weight="bold" />{" "}
                  {mode === "claim"
                    ? item.kind === "trip"
                      ? "Sponsor this trip"
                      : "Claim gift"
                    : "Reserve"}
                </button>
              </form>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}