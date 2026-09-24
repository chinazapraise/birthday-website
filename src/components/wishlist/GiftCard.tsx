"use client";

import { motion } from "framer-motion";
import type { WishlistItem } from "@/lib/types";
import { formatNaira, statusLabel } from "@/lib/utils";
import { Gift, ArrowRight } from "@phosphor-icons/react";
import { EASE } from "@/lib/motion";

const STATUS_ACCENT: Record<WishlistItem["status"], string> = {
  available: "text-acid border-acid/40",
  reserved: "text-gold border-gold/40",
  "partially funded": "text-violet border-violet/40",
  funded: "text-magenta border-magenta/40",
  purchased: "text-cream border-white/40",
  received: "text-cream border-white/40",
  hidden: "text-cream/40 border-white/20",
};

/**
 * Wishlist gift card. Claim / contribute via modals from the page.
 */
export default function GiftCard({
  item,
  index,
  onClaim,
  onContribute,
}: {
  item: WishlistItem;
  index: number;
  onClaim: () => void;
  onContribute: () => void;
}) {
  const fullyReserved = statusLabel(item) === "Someone's got this";

  return (
    <motion.article
      className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-gold/40"
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
          <span className="shrink-0 text-gold">
            <Gift size={22} weight="duotone" />
          </span>
        </div>

        <p className="mt-2 text-sm leading-relaxed text-cream/60">
          {item.description}
        </p>
        {item.funnyNote && (
          <p className="mt-2 font-hand text-lg text-sunset/80">
            {item.funnyNote}
          </p>
        )}

        <p className="mt-4 font-display text-xl font-bold text-gold">
          {formatNaira(item.price)}
        </p>
      </div>

      <div className="mt-5">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${STATUS_ACCENT[item.status]}`}
        >
          {statusLabel(item)}
        </span>

        <div className="mt-4 flex gap-2">
          {item.allowClaim && (
            <button
              onClick={onClaim}
              disabled={fullyReserved}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-white/20 px-4 py-3 text-xs font-bold uppercase tracking-wider text-cream transition hover:border-gold hover:text-gold disabled:cursor-not-allowed disabled:opacity-40"
            >
              {fullyReserved ? "Got it" : "Getting this"}
            </button>
          )}
          {item.allowContribution && (
            <button
              onClick={onContribute}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-gold/90 to-sunset/90 px-4 py-3 text-xs font-bold uppercase tracking-wider text-ink transition-transform hover:scale-[1.02]"
            >
              Contribute <ArrowRight size={14} weight="bold" />
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}