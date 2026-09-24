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
  const contrib = contributions.filter((x) => x.wishlistItemId === item.id);

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

export function giftStatusView(
  item: WishlistItem,
  stats: GiftStats,
): GiftStatusView {
  const kind: GiftKind = item.kind;

  if (kind === "cash") {
    const n = stats.gifted;
    const proof =
      n > 0
        ? n === 1
          ? "1 person has gifted this"
          : `${n} people have gifted this`
        : "";
    return {
      primary: "Available",
      secondary: proof,
      tone: n > 0 ? "gifted" : "available",
      claimable: false,
      contributable: true,
      p1: proof,
      p2: "",
    };
  }

  if (kind === "multi") {
    const reservedTxt =
      stats.reserved > 0 ? people(stats.reserved) + " reserved" : "";
    const proof =
      stats.claims > 0
        ? stats.claims === 1
          ? "1 person has gifted this"
          : `${stats.claims} people have gifted this`
        : "";
    return {
      primary: "Available",
      secondary: proof || reservedTxt,
      tone:
        stats.claims > 0 ? "gifted" : stats.reserved > 0 ? "reserved" : "available",
      claimable: true,
      contributable: false,
      p1: proof,
      p2: reservedTxt,
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
        kind !== "single" && stats.contributed > 0
          ? people(stats.contributed) + " contributed"
          : "",
      tone: gifted ? "gifted" : "claimed",
      claimable: false,
      contributable: kind !== "single" && !gifted,
      p1: gifted ? "gifted" : "claimed",
      p2:
        kind !== "single" && stats.contributed > 0
          ? people(stats.contributed) + " contributed"
          : "",
    };
  }

  const p1 =
    stats.reserved > 0
      ? people(stats.reserved) + " reserved"
      : stats.contributed > 0
        ? people(stats.contributed) + " contributed"
        : "Available";
  const p2 =
    stats.reserved > 0 && stats.contributed > 0
      ? people(stats.contributed) + " contributed"
      : "";
  return {
    primary: stats.reserved > 0 || stats.contributed > 0 ? p1 : "Available",
    secondary: p2,
    tone:
      stats.reserved > 0
        ? "reserved"
        : stats.contributed > 0
          ? "contributed"
          : "available",
    claimable: true,
    contributable: kind === "expensive" || kind === "trip",
    p1,
    p2,
  };
}