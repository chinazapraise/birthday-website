"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  useSettings,
  useWishlist,
  useClaims,
  useReserves,
  useContributions,
} from "@/lib/hooks";
import GiftCard from "@/components/wishlist/GiftCard";
import GiftClaimModal from "@/components/wishlist/GiftClaimModal";
import ContributionModal from "@/components/wishlist/ContributionModal";
import FloatingNav from "@/components/nav/FloatingNav";
import MeshBackground from "@/components/ambient/MeshBackground";
import CursorGlow from "@/components/ambient/CursorGlow";
import ConfettiLayer from "@/components/effects/ConfettiLayer";
import { EASE } from "@/lib/motion";
import type { WishlistItem } from "@/lib/types";

type ModalKind = "claim" | "contribute" | null;

/**
 * The wishlist — 27 for 27, plus one open slot.
 *
 * Every card derives its state live:
 *   Reserve = intent, never blocks.
 *   Claim   = commitment, blocks single/expensive/trip gifts.
 *   Contribute = money toward expensive trips & gifts, or cash gifts.
 */
export default function WishlistExperience() {
  const { settings } = useSettings();
  const { items } = useWishlist();
  const { claims, addClaim } = useClaims();
  const { reserves, addReserve } = useReserves();
  const { contributions, addContribution } = useContributions();

  const [modalItem, setModalItem] = useState<WishlistItem | null>(null);
  const [modalKind, setModalKind] = useState<ModalKind>(null);

  const visible = items
    .filter((i) => i.status !== "hidden")
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const openClaim = (item: WishlistItem) => {
    setModalItem(item);
    setModalKind("claim");
  };
  const openContribute = (item: WishlistItem) => {
    setModalItem(item);
    setModalKind("contribute");
  };
  const closeModal = () => {
    setModalItem(null);
    setModalKind(null);
  };

  const handleClaim = (data: {
    name: string;
    contact?: string;
    note?: string;
    quantity: number;
    anonymous: boolean;
  }): boolean => {
    if (!modalItem) return false;
    const current = claims.filter((c) => c.wishlistItemId === modalItem.id);
    const exclusive =
      modalItem.kind === "single" ||
      modalItem.kind === "expensive" ||
      modalItem.kind === "trip";
    if (exclusive && current.length > 0) return false;
    const created = addClaim({ wishlistItemId: modalItem.id, ...data });
    return created !== null;
  };

  const handleReserve = (data: {
    name: string;
    contact?: string;
    quantity: number;
    anonymous: boolean;
  }): boolean => {
    if (!modalItem) return false;
    addReserve({ wishlistItemId: modalItem.id, ...data });
    return true;
  };

  const handleContribute = (data: {
    email: string;
    amount: number;
    currency: string;
    kind: "contribution" | "gift";
    anonymous: boolean;
  }) => {
    if (!modalItem) return;
    addContribution({ wishlistItemId: modalItem.id, ...data });
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
          <motion.p
            className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-cream/50"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
          >
            Reserve it if you&apos;re considering it. Claim it if you&apos;re
            getting it. Contribute if you want to chip in.
          </motion.p>
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
                  claims={claims}
                  reserves={reserves}
                  onGet={() => openClaim(item)}
                  onContribute={() => openContribute(item)}
                  contributions={contributions}
                />
              ))}
            </div>
            <p className="mt-12 text-center font-hand text-xl text-cream/40">
              Every single one means something. Thank you. 💛
            </p>
          </section>
        )}
      </main>

      {modalItem && modalKind === "claim" && (
        <GiftClaimModal
          item={modalItem}
          canClaim={(() => {
            const exclusive =
              modalItem.kind === "single" ||
              modalItem.kind === "expensive" ||
              modalItem.kind === "trip";
            return (
              !exclusive ||
              !claims.some((x) => x.wishlistItemId === modalItem.id)
            );
          })()}
          onClaim={handleClaim}
          onReserve={handleReserve}
          onClose={closeModal}
        />
      )}
      {modalItem && modalKind === "contribute" && (
        <ContributionModal
          item={modalItem}
          onContribute={handleContribute}
          onClose={closeModal}
        />
      )}
    </>
  );
}