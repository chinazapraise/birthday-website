"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useSettings, useWishlist, useClaims, useContributions } from "@/lib/hooks";
import GiftCard from "@/components/wishlist/GiftCard";
import GiftClaimModal from "@/components/wishlist/GiftClaimModal";
import ContributionModal from "@/components/wishlist/ContributionModal";
import FloatingNav from "@/components/nav/FloatingNav";
import MeshBackground from "@/components/ambient/MeshBackground";
import CursorGlow from "@/components/ambient/CursorGlow";
import ConfettiLayer from "@/components/effects/ConfettiLayer";
import { EASE } from "@/lib/motion";
import type { WishlistItem } from "@/lib/types";

/**
 * The wishlist: gift grid with claim + contribution modals.
 * Claiming reserves the gift (no double booking). Contributions stay
 * paymentStatus pending — no fake payment flow.
 */
export default function WishlistExperience() {
  const { settings } = useSettings();
  const { items } = useWishlist();
  const { addClaim } = useClaims();
  const { addContribution } = useContributions();

  const [claimItem, setClaimItem] = useState<WishlistItem | null>(null);
  const [contribItem, setContribItem] = useState<WishlistItem | null>(null);

  const visible = items
    .filter((i) => i.status !== "hidden")
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const handleClaim = (data: {
    claimantName: string;
    contact?: string;
    note?: string;
    anonymousToPublic: boolean;
  }): boolean => {
    if (!claimItem) return false;
    const available = claimItem.quantity - claimItem.quantityReserved;
    if (available < 1) return false;
    addClaim({ wishlistItemId: claimItem.id, ...data });
    return true;
  };

  const handleContribute = (data: {
    contributorName: string;
    amount: number;
    currency: string;
    anonymous: boolean;
  }) => {
    if (!contribItem) return;
    addContribution({ wishlistItemId: contribItem.id, ...data });
  };

  return (
    <>
      <MeshBackground />
      <CursorGlow />
      <ConfettiLayer />
      <FloatingNav />

      <main className="relative z-10 pt-28">
        <header className="mx-auto max-w-3xl px-6 pt-10 text-center">
          <motion.p
            className="font-hand text-2xl text-cream/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {settings.wishlistTitle}
          </motion.p>
          <motion.h1
            className="mt-3 font-display text-4xl font-black text-cream md:text-6xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            {settings.wishlistCopy}
          </motion.h1>
        </header>

        {visible.length === 0 ? (
          <p className="py-24 text-center font-hand text-2xl text-cream/50">
            The list is empty for now. Check back later.
          </p>
        ) : (
          <section className="mx-auto max-w-6xl px-6 py-14">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((item, i) => (
                <GiftCard
                  key={item.id}
                  item={item}
                  index={i}
                  onClaim={() => setClaimItem(item)}
                  onContribute={() => setContribItem(item)}
                />
              ))}
            </div>
            <p className="mt-12 text-center font-hand text-xl text-cream/40">
              Every single one means something. Thank you. 💛
            </p>
          </section>
        )}
      </main>

      {claimItem && (
        <GiftClaimModal
          item={claimItem}
          onClaim={handleClaim}
          onClose={() => setClaimItem(null)}
        />
      )}
      {contribItem && (
        <ContributionModal
          item={contribItem}
          onContribute={handleContribute}
          onClose={() => setContribItem(null)}
        />
      )}
    </>
  );
}