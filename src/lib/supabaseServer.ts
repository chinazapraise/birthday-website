import { createClient } from "@supabase/supabase-js";

/*
 * Server-only Supabase client. Uses the service_role key — never import
 * this module from a client component.
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseServer =
  url && serviceRole ? createClient(url, serviceRole) : null;

export async function markContributionPaid(
  id: string,
  reference: string,
  amountKobo: number,
): Promise<boolean> {
  if (!supabaseServer) return false;
  const { error } = await supabaseServer
    .from("wishlist_contributions")
    .update({ paid: true, reference })
    .eq("id", id);
  if (error) return false;

  const amountNgn = Math.round(amountKobo / 100);
  const { error: amtError } = await supabaseServer
    .from("wishlist_contributions")
    .update({ amount: amountNgn })
    .eq("id", id);
  return !amtError;
}

export async function updateClaimGifted(
  claimId: string,
  gifted: boolean,
): Promise<boolean> {
  if (!supabaseServer) return false;
  const { error } = await supabaseServer
    .from("wishlist_claims")
    .update({ gifted })
    .eq("id", claimId);
  return !error;
}

export async function deleteContribution(id: string): Promise<boolean> {
  if (!supabaseServer) return false;
  const { error } = await supabaseServer
    .from("wishlist_contributions")
    .delete()
    .eq("id", id);
  return !error;
}