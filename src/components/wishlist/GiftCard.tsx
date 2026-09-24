"use client";

import { motion } from "framer-motion";
import type { WishlistItem, GiftClaim, GiftReserve, Contribution } from "@/lib/types";
import { formatNaira } from "@/lib/utils";
import { Gift, ArrowRight, HandHeart, Coin } from "@phosphor-icons/react";
import { EASE } from "@/lib/motion";
import { giftStats, giftStatusView } from "@/lib/giftStatus";

const TONE: Record<string, string> = {
  available: "text-acid border-acid/40",
  reserved: "text-gold border-gold/40",
  contributed: "text-violet border-violet/40",
  claimed: "text-magenta border-magenta/40",
  gifted: "text-acid border-acid/40",
};

function actionLabel(item: WishlistItem): string {
  switch (item.kind) {
    case "trip":
      return "Sponsor Trip";
    case "cash":
      return `Gift ${compactNaira(item.cashAmount ?? 0)}`;
    case "expensive":
      return "Get It For Me";
    default:
      return "Get It For Me";
  }
}

function compactNaira(amount: number): string {
  if (amount >= 1_000_000) return `₦${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) {
    const k = amount / 1_000;
    return `₦${Number.isInteger(k) ? k : k.toFixed(1)}K`;
  }
  return `₦${amount.toLocaleString()}`;
}

/**
 * Wishlist gift card — all states are derived live from records.
 * No prices shown except fixed cash gifts.
 */
export default function GiftCard({
  item,
  index,
  number,
  outcast,
  claims,
  reserves,
  contributions,
  onGet,
  onContribute,
}: {
  item: WishlistItem;
  index: number;
  number?: string;
  outcast?: boolean;
  claims: GiftClaim[];
  reserves: GiftReserve[];
  contributions: Contribution[];
  onGet: () => void;
  onContribute: () => void;
}) {
  const stats = giftStats(item, claims, reserves, contributions);
  const view = giftStatusView(item, stats);
  const isCash = item.kind === "cash";
  const hasContribute = view.contributable || isCash;
  const donatedCount = isCash ? stats.gifted : stats.contributorCount;

  return (
    <motion.article
      className={`group flex flex-col justify-between overflow-hidden rounded-3xl border bg-white/[0.03] p-6 transition ${
        outcast
          ? "border-dashed border-white/25 hover:border-gold/40"
          : "border-white/10 hover:border-gold/40"
      }`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.08, ease: EASE }}
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl font-bold text-cream">
            {item.name}
          </h3>
          <div className="flex shrink-0 items-center gap-2">
            {number && (
              <span className="font-mono text-[0.6rem] tracking-[0.15em] text-cream/30">
                {outcast ? "☆" : number}
              </span>
            )}
            <span className="text-gold">
              <Gift size={22} weight="duotone" />
            </span>
          </div>
        </div>

        <p className="mt-2 text-sm leading-relaxed text-cream/60">
          {item.description}
        </p>
        {item.funnyNote && (
          <p className="mt-2 font-hand text-lg text-sunset/80">
            {item.funnyNote}
          </p>
        )}

        {isCash && item.cashAmount !== undefined && (
          <p className="mt-4 font-display text-2xl font-bold text-gold">
            {formatNaira(item.cashAmount)}
          </p>
        )}

        {/* Social proof — human microcopy only. No amounts, no progress. */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${TONE[view.tone]}`}
          >
            {view.primary}
          </span>
          {view.secondary && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1 text-xs text-cream/50">
              {view.secondary}
            </span>
          )}
        </div>
      </div>

      <div className="mt-5">
        {donatedCount > 0 && !isCash && !view.primary.includes("claimed") && (
          <p className="mb-3 text-xs text-cream/45">
            {`${donatedCount} ${donatedCount === 1 ? "person has" : "people have"} contributed`}
          </p>
        )}

        <div className="flex gap-2">
          {item.kind !== "cash" && (
            <button
              onClick={onGet}
              disabled={!view.claimable}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-white/20 px-4 py-3 text-xs font-bold uppercase tracking-wider text-cream transition hover:border-gold hover:text-gold disabled:cursor-not-allowed disabled:opacity-40"
            >
              <HandHeart size={15} weight="bold" />
              {view.claimable ? actionLabel(item) : view.primary}
            </button>
          )}
          {hasContribute && (
            <button
              onClick={onContribute}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-full bg-gradient-to-r px-4 py-3 text-xs font-bold uppercase tracking-wider transition-transform hover:scale-[1.02] ${
                isCash
                  ? "from-gold to-sunset text-ink"
                  : "from-violet/90 to-magenta/90 text-cream"
              }`}
            >
              {isCash ? (
                <>
                  <Coin size={15} weight="bold" /> Gift now <ArrowRight size={14} weight="bold" />
                </>
              ) : (
                <>
                  Contribute <ArrowRight size={14} weight="bold" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}