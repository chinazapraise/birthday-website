import type {
  WishlistItem,
  GiftClaim,
  GiftReserve,
  Contribution,
  GiftKind,
} from "@/lib/types";

export interface GiftStats {
  reserved: number;
  contributed: number;
  gifted: number;
  claims: number;
  claimed: boolean;
  claim: GiftClaim | null;
  /** humans duplicate-free count for contributions/gifts */
  contributorCount: number;
}

export function giftStats(
  item: WishlistItem,
  claims: GiftClaim[],
  reserves: GiftReserve[],
  contributions: Contribution[],
): GiftStats {
  const c = claims.filter((x) => x.wishlistItemId === item.id);
  const r = reserves.filter((x) => x.wishlistItemId === item.id);
  // Only count confirmed (paid) contributions publicly — records are
  // written when payment starts, so unpaid intents must not raise the count.
  const contrib = contributions.filter(
    (x) =>
      x.wishlistItemId === item.id && x.paymentStatus === "successful",
  );

  return {
    reserved: r.length,
    contributed: contrib.filter((x) => x.kind === "contribution").length,
    gifted: contrib.filter((x) => x.kind === "gift").length,
    claims: c.length,
    claimed: c.length > 0,
    claim: c[0] ?? null,
    contributorCount: new Set(
      contrib.map((x) => (x.email || "").toLowerCase()),
    ).size,
  };
}

/**
 * Public microcopy + tone for a card. Rules:
 * - claimed → "Someone claimed this" (single/expensive/trip)
 * - multi   → "N people getting this" when claims exist
 * - cash    → "N people gifted this"
 * - else    → "N people reserved" / "N people contributed"
 */
export interface GiftStatusView {
  primary: string;
  secondary: string;
  tone: "available" | "reserved" | "contributed" | "claimed" | "gifted";
  claimable: boolean;
  contributable: boolean;
  p1: string;
  p2: string;
}

function plural(n: number, word: string, pluralWord?: string): string {
  return `${n} ${n === 1 ? word : pluralWord ?? `${word}s`}`;
}

function people(n: number): string {
  return plural(n, "person");
}

function reservedPhrase(n: number): string {
  return n > 0 ? `${people(n)} reserved this` : "";
}

function contributedPhrase(n: number): string {
  return n > 0 ? `${people(n)} contributed` : "";
}

function giftedPhrase(n: number): string {
  return n > 0 ? `${n} ${n === 1 ? "person has" : "people have"} gifted this` : "";
}

export function giftStatusView(
  item: WishlistItem,
  stats: GiftStats,
): GiftStatusView {
  const kind: GiftKind = item.kind;

  if (kind === "cash") {
    const proof = giftedPhrase(stats.gifted);
    return {
      primary: proof || "Available",
      secondary: "",
      tone: stats.gifted > 0 ? "gifted" : "available",
      claimable: false,
      contributable: true,
      p1: proof,
      p2: "",
    };
  }

  if (kind === "multi") {
    const gifted = giftedPhrase(stats.claims);
    const reserved = reservedPhrase(stats.reserved);
    return {
      primary: gifted || reserved || "Available",
      secondary: gifted && reserved ? reserved : "",
      tone:
        stats.claims > 0 ? "gifted" : stats.reserved > 0 ? "reserved" : "available",
      claimable: true,
      contributable: false,
      p1: gifted,
      p2: reserved,
    };
  }

  // single / expensive / trip
  if (stats.claimed) {
    const gifted = stats.claim?.gifted;
    return {
      primary:
        kind === "trip"
          ? gifted
            ? "Someone sponsored this"
            : "Someone's sponsoring this"
          : gifted
            ? "Someone gifted this"
            : "Someone claimed this",
      secondary:
        stats.contributed > 0
          ? contributedPhrase(stats.contributed)
          : reservedPhrase(stats.reserved),
      tone: gifted ? "gifted" : "claimed",
      claimable: false,
      contributable: false,
      p1: gifted ? "gifted" : "claimed",
      p2: contributedPhrase(stats.contributed),
    };
  }

  const reserved = reservedPhrase(stats.reserved);
  const contributed = contributedPhrase(stats.contributed);
  return {
    primary: reserved || contributed || "Available",
    secondary: reserved && contributed ? contributed : "",
    tone:
      stats.reserved > 0
        ? "reserved"
        : stats.contributed > 0
          ? "contributed"
          : "available",
    claimable: true,
    contributable: kind === "expensive" || kind === "trip",
    p1: reserved,
    p2: contributed,
  };
}