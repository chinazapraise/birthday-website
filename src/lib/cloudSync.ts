import { supabase } from "@/lib/supabase";
import type {
  GiftClaim,
  GiftReserve,
  Contribution,
  WishlistItem,
} from "@/lib/types";

/*
 * CLOUD SYNC — Supabase postgres adapter for the wishlist records.
 *
 * Strategy: localStorage stays the live cache (the app is synchronous).
 * Every write also pushes to Supabase; every session start pulls the
 * cloud rows into localStorage so numbers go live across devices.
 *
 * All identity is stored on the row; the PUBLIC card only reads counts,
 * so name/email/phone never leave the DB until Tomide opens /manage.
 */

type ClaimRow = {
  id: string;
  item_id: string;
  name: string;
  email: string;
  phone: string;
  anonymous: boolean;
  gifted: boolean;
  quantity: number;
  note: string;
  created_at: string;
};

type ReserveRow = {
  id: string;
  item_id: string;
  name: string;
  email: string;
  phone: string;
  anonymous: boolean;
  quantity: number;
  note: string;
  created_at: string;
};

type ContributionRow = {
  id: string;
  item_id: string;
  name: string;
  email: string;
  phone: string;
  anonymous: boolean;
  amount: number;
  currency: string;
  kind: string;
  paid: boolean;
  reference: string;
  note: string;
  created_at: string;
};

function claimFromRow(r: ClaimRow): GiftClaim {
  return {
    id: r.id,
    wishlistItemId: r.item_id,
    name: r.name || "Anonymous",
    email: r.email || undefined,
    phone: r.phone || undefined,
    note: r.note || undefined,
    quantity: r.quantity,
    gifted: r.gifted,
    anonymous: r.anonymous,
    createdAt: r.created_at,
  };
}

function reserveFromRow(r: ReserveRow): GiftReserve {
  return {
    id: r.id,
    wishlistItemId: r.item_id,
    name: r.name || "Anonymous",
    email: r.email || undefined,
    phone: r.phone || undefined,
    note: r.note || undefined,
    quantity: r.quantity,
    anonymous: r.anonymous,
    createdAt: r.created_at,
  };
}

function contributionFromRow(r: ContributionRow): Contribution {
  return {
    id: r.id,
    wishlistItemId: r.item_id,
    name: r.name || "Anonymous",
    email: r.email,
    phone: r.phone || undefined,
    amount: Number(r.amount ?? 0),
    currency: r.currency || "NGN",
    kind: r.kind === "gift" ? "gift" : "contribution",
    anonymous: r.anonymous,
    note: r.note || undefined,
    paymentReference: r.reference || undefined,
    paymentStatus: r.paid ? "successful" : "pending",
    createdAt: r.created_at,
  };
}

export async function pullClaims(): Promise<GiftClaim[] | null> {
  const { data, error } = await supabase!
    .from("wishlist_claims")
    .select("*")
    .order("created_at", { ascending: true });
  if (error || !data) return null;
  return (data as ClaimRow[]).map(claimFromRow);
}

export async function pullReserves(): Promise<GiftReserve[] | null> {
  const { data, error } = await supabase!
    .from("wishlist_reserves")
    .select("*")
    .order("created_at", { ascending: true });
  if (error || !data) return null;
  return (data as ReserveRow[]).map(reserveFromRow);
}

export async function pullContributions(): Promise<Contribution[] | null> {
  const { data, error } = await supabase!
    .from("wishlist_contributions")
    .select("*")
    .order("created_at", { ascending: true });
  if (error || !data) return null;
  return (data as ContributionRow[]).map(contributionFromRow);
}

export async function pushClaim(
  claim: GiftClaim,
  exclusive: boolean,
): Promise<boolean> {
  const { error } = await supabase!.from("wishlist_claims").insert({
    id: claim.id,
    item_id: claim.wishlistItemId,
    name: claim.name,
    email: claim.email ?? "",
    phone: claim.phone ?? "",
    anonymous: claim.anonymous,
    gifted: claim.gifted,
    quantity: claim.quantity,
    note: claim.note ?? "",
    exclusive,
  });
  return !error;
}

export async function pushClaimUpdate(
  id: string,
  patch: Partial<GiftClaim>,
): Promise<void> {
  const row: Record<string, unknown> = {};
  if (patch.gifted !== undefined) row.gifted = patch.gifted;
  if (patch.anonymous !== undefined) row.anonymous = patch.anonymous;
  await supabase!.from("wishlist_claims").update(row).eq("id", id);
}

export async function pushReserve(reserve: GiftReserve): Promise<void> {
  const { error } = await supabase!.from("wishlist_reserves").insert({
    id: reserve.id,
    item_id: reserve.wishlistItemId,
    name: reserve.name,
    email: reserve.email ?? "",
    phone: reserve.phone ?? "",
    anonymous: reserve.anonymous,
    quantity: reserve.quantity,
    note: reserve.note ?? "",
  });
  if (error) console.warn("reserve push failed", error.message);
}

export async function pushContribution(
  contribution: Contribution,
): Promise<void> {
  const { error } = await supabase!.from("wishlist_contributions").insert({
    id: contribution.id,
    item_id: contribution.wishlistItemId,
    name: contribution.name ?? "",
    email: contribution.email ?? "",
    phone: contribution.phone ?? "",
    anonymous: contribution.anonymous,
    amount: contribution.amount,
    currency: contribution.currency ?? "NGN",
    kind: contribution.kind,
    note: contribution.note ?? "",
    paid: contribution.paymentStatus === "successful",
    reference: contribution.paymentReference ?? "",
  });
  if (error) console.warn("contribution push failed", error.message);
}

export async function pushContributionPaid(
  id: string,
  reference: string,
): Promise<void> {
  await supabase!
    .from("wishlist_contributions")
    .update({ paid: true, reference })
    .eq("id", id);
}

export async function pushContributionPatch(
  id: string,
  patch: { note?: string; paid?: boolean },
): Promise<void> {
  await supabase!
    .from("wishlist_contributions")
    .update(patch)
    .eq("id", id);
}

/** Returns true when the wishlist item is exclusive (blocks duplicate claims). */
export function isExclusiveItem(item: WishlistItem): boolean {
  return (
    item.kind === "single" ||
    item.kind === "expensive" ||
    item.kind === "trip"
  );
}