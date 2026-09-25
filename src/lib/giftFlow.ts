import type { WishlistItem } from "@/lib/types";

export interface FundingPlan {
  mode: "open" | "fixed";
  amount?: number;
  unitPrice?: number;
  covers?: number;
}

export type PostSubmitStep = "claim" | "choose" | "fund";

export function fundingPlanFor(item: WishlistItem): FundingPlan | null {
  const configured = item.funding;
  if (configured) {
    if (configured.mode === "none") return null;
    return {
      mode: configured.mode,
      amount: configured.amount,
      unitPrice: configured.unitPrice,
      covers: configured.covers,
    };
  }
  if (item.kind === "cash") {
    return typeof item.cashAmount === "number"
      ? { mode: "fixed", amount: item.cashAmount }
      : null;
  }
  return { mode: "open" };
}

export function fixedFundingAmount(plan: FundingPlan | null): number | null {
  if (!plan || plan.mode !== "fixed") return null;
  if (typeof plan.amount === "number" && plan.amount > 0) {
    return Math.round(plan.amount);
  }
  if (
    typeof plan.unitPrice === "number" &&
    typeof plan.covers === "number" &&
    plan.unitPrice > 0 &&
    plan.covers > 0
  ) {
    return Math.round(plan.unitPrice * plan.covers);
  }
  return null;
}

export function unitPriceFor(item: WishlistItem): number | null {
  const plan = fundingPlanFor(item);
  if (!plan || plan.mode !== "open") return null;
  return typeof plan.unitPrice === "number" && plan.unitPrice > 0
    ? Math.round(plan.unitPrice)
    : null;
}

export function canClaimGift(item: WishlistItem): boolean {
  return item.kind !== "cash";
}

export function canFundGift(item: WishlistItem): boolean {
  return fundingPlanFor(item) !== null;
}

export function postSubmitStep(
  item: WishlistItem,
  opts?: { canClaim?: boolean },
): PostSubmitStep {
  if (!canFundGift(item)) return "claim";
  if (opts?.canClaim === false) return "fund";
  if (!canClaimGift(item)) return "fund";
  return "choose";
}

export function fundingSummary(item: WishlistItem): string | null {
  const plan = fundingPlanFor(item);
  if (!plan) return null;
  if (plan.mode === "open") return "Open cash contributions";
  const amount = fixedFundingAmount(plan);
  if (amount === null) return "Fixed cash gift";
  if (
    typeof plan.unitPrice === "number" &&
    typeof plan.covers === "number" &&
    plan.amount === undefined
  ) {
    return `₦${plan.unitPrice.toLocaleString()} × ${plan.covers}`;
  }
  return `₦${amount.toLocaleString()}`;
}
