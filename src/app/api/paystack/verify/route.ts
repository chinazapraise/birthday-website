import { NextResponse } from "next/server";
import { markContributionPaid } from "@/lib/supabaseServer";

export const runtime = "nodejs";

/**
 * Verify a Paystack transaction server-side with the secret key, then
 * mark the matched contribution as paid in Supabase. The client's clearly
 * exposed public key can never do this — only this route holds the secret.
 */
export async function POST(request: Request) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret || secret.includes("paste_here")) {
    return NextResponse.json(
      { ok: false, error: "PAYSTACK_SECRET_KEY not configured" },
      { status: 500 },
    );
  }

  let body: { reference?: string; contributionId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad body" }, { status: 400 });
  }

  const { reference, contributionId } = body;
  if (!reference || !contributionId) {
    return NextResponse.json(
      { ok: false, error: "missing reference" },
      { status: 400 },
    );
  }

  let verify: { status: boolean; data?: { status?: string; amount?: number } };
  try {
    const res = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      { headers: { Authorization: `Bearer ${secret}` } },
    );
    verify = await res.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "verify request failed" },
      { status: 502 },
    );
  }

  if (verify.status !== true || verify.data?.status !== "success") {
    return NextResponse.json(
      { ok: false, error: "payment not successful" },
      { status: 402 },
    );
  }

  const amountKobo = verify.data.amount ?? 0;
  const marked = await markContributionPaid(
    contributionId,
    reference,
    amountKobo,
  );
  if (!marked) {
    return NextResponse.json(
      { ok: false, error: "could not mark paid" },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, amount: amountKobo });
}