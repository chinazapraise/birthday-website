"use client";

import { useState, useEffect } from "react";
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
import ConfettiLayer, { fireConfetti } from "@/components/effects/ConfettiLayer";
import { EASE } from "@/lib/motion";
import { preloadPaystack } from "@/lib/paystack";
import type { WishlistItem } from "@/lib/types";
import type { PrefillDetails } from "@/components/wishlist/ContributionModal";

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
  const {
    contributions,
    addContribution,
    markSuccessful,
    markAttempted,
    updateContribution,
  } = useContributions();

  const [modalItem, setModalItem] = useState<WishlistItem | null>(null);
  const [modalKind, setModalKind] = useState<ModalKind>(null);
  const [prefill, setPrefill] = useState<PrefillDetails | null>(null);
  const [successNotice, setSuccessNotice] = useState<{
    reference: string;
    itemName?: string;
  } | null>(null);

  // Warm up the Paystack popup the moment the wishlist loads, so by the time
  // someone taps "Pay" the checkout script is already cached and loads fast.
  useEffect(() => {
    preloadPaystack();
  }, []);

  // Handle return redirect from Paystack checkout
  useEffect(() => {
    if (typeof window === "undefined") return;
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get("reference") || urlParams.get("trxref");
    if (!ref) return;

    const itemName = urlParams.get("item") || undefined;
    window.history.replaceState({}, "", window.location.pathname);

    void fetch("/api/paystack/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reference: ref }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) {
          markSuccessful(ref, ref);
          fireConfetti("burst", { count: 90, balloons: 5 });
          setSuccessNotice({ reference: ref, itemName });
        }
      })
      .catch((e) => console.warn("Verify check on return failed:", e));
  }, [markSuccessful]);

  const visible = items
    .filter((i) => i.status !== "hidden")
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const numbered = visible.slice(0, 27);
  const outcast = visible.slice(27);

  const openClaim = (item: WishlistItem) => {
    setModalItem(item);
    setModalKind("claim");
  };
  const openContribute = (item: WishlistItem) => {
    setModalItem(item);
    setModalKind("contribute");
    setPrefill(null);
  };
  const closeModal = () => {
    setModalItem(null);
    setModalKind(null);
    setPrefill(null);
  };

  const handleFund = (details: {
    name: string;
    email?: string;
    phone?: string;
    note?: string;
    anonymous: boolean;
  }) => {
    if (!modalItem) return;
    setPrefill({
      name: details.name,
      email: details.email,
      phone: details.phone,
      note: details.note,
      anonymous: details.anonymous,
    });
    setModalKind("contribute");
  };

  const handleClaim = (data: {
    name: string;
    email?: string;
    phone?: string;
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
    email?: string;
    phone?: string;
    note?: string;
    quantity: number;
    anonymous: boolean;
  }): boolean => {
    if (!modalItem) return false;
    addReserve({ wishlistItemId: modalItem.id, ...data });
    return true;
  };

  const handleContribute = (data: {
    name: string;
    email: string;
    phone?: string;
    amount: number;
    currency: string;
    kind: "contribution" | "gift";
    anonymous: boolean;
  }) => {
    if (!modalItem) return null;
    return addContribution({ wishlistItemId: modalItem.id, ...data });
  };

  const handleContributionNote = (id: string, note: string) => {
    updateContribution(id, { note });
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
            getting it now. Contribute if you want to support.
          </motion.p>
        </header>

        {visible.length === 0 ? (
          <p className="py-24 text-center font-hand text-2xl text-cream/50">
            The list is empty for now. Check back later.
          </p>
        ) : (
          <section className="mx-auto max-w-6xl px-6 py-14">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {numbered.map((item, i) => (
                <GiftCard
                  key={item.id}
                  item={item}
                  index={i}
                  number={String(i + 1).padStart(2, "0")}
                  claims={claims}
                  reserves={reserves}
                  onGet={() => openClaim(item)}
                  onContribute={() => openContribute(item)}
                  contributions={contributions}
                />
              ))}
            </div>

            {outcast.map((item) => (
              <div key={item.id} className="mx-auto mt-10 max-w-xl md:mt-14">
                <GiftCard
                  item={item}
                  index={0}
                  outcast
                  claims={claims}
                  reserves={reserves}
                  onGet={() => openClaim(item)}
                  onContribute={() => openContribute(item)}
                  contributions={contributions}
                />
              </div>
            ))}
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
          onFund={handleFund}
          onClose={closeModal}
        />
      )}
      {modalItem && modalKind === "contribute" && (
        <ContributionModal
          key={`${modalItem.id}-${prefill ? "prefilled" : "fresh"}`}
          item={modalItem}
          prefill={prefill}
          onContribute={handleContribute}
          onMarkAttempted={markAttempted}
          onMarkSuccessful={markSuccessful}
          onNote={handleContributionNote}
          onClose={closeModal}
        />
      )}

      {successNotice && (
        <div
          className="fixed inset-0 z-[160] flex items-center justify-center bg-ink/90 p-4 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            className="w-full max-w-md rounded-3xl border border-gold/30 bg-[#120f20] p-6 text-center shadow-2xl md:p-8"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <span className="text-5xl">🎉</span>
            <h3 className="mt-4 font-display text-2xl font-black text-cream">
              Gift Received!
            </h3>
            <p className="mt-2 text-sm text-cream/70">
              {successNotice.itemName
                ? `Your gift for "${successNotice.itemName}" has been processed and received.`
                : "Your birthday gift has been processed and received."}
            </p>
            <p className="mt-3 font-hand text-lg text-gold">
              Thank you so much for celebrating 27 with me! 💛
            </p>
            <button
              onClick={() => setSuccessNotice(null)}
              className="mt-6 w-full rounded-full bg-gradient-to-r from-gold to-sunset px-6 py-3 font-display text-sm font-bold uppercase tracking-widest text-ink transition hover:scale-[1.02]"
            >
              Continue Celebrating
            </button>
          </motion.div>
        </div>
      )}
    </>
  );
}