import { NextResponse } from "next/server";
import { markContributionPaid } from "@/lib/supabaseServer";

export const runtime = "nodejs";

const VERIFY_TIMEOUT_MS = 15000;
const PAYSTACK_VERIFY_URL = "https://api.paystack.co/transaction/verify";

/**
 * Verify a Paystack transaction server-side with the secret key, then
 * mark the matched contribution as paid in Supabase. The client's clearly
 * exposed public key can never do this — only this route holds the secret.
 *
 * Non-final Paystack statuses (pending/processing) return 202 with the raw
 * status so the client can keep refreshing instead of hanging forever.
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

  let { reference, contributionId } = body;
  if (!reference) {
    return NextResponse.json(
      { ok: false, error: "missing reference" },
      { status: 400 },
    );
  }

  let verify: { status: boolean; data?: { status?: string; amount?: number } };
  try {
    const res = await fetch(
      `${PAYSTACK_VERIFY_URL}/${encodeURIComponent(reference)}`,
      {
        headers: { Authorization: `Bearer ${secret}` },
        signal: AbortSignal.timeout(VERIFY_TIMEOUT_MS),
        cache: "no-store",
      },
    );
    verify = await res.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "verify request failed" },
      { status: 502 },
    );
  }

  // Payment not final yet — let the client poll again rather than fail.
  if (verify.status === true && verify.data?.status === "pending") {
    return NextResponse.json(
      { ok: false, pending: true, error: "payment pending" },
      { status: 202 },
    );
  }

  if (verify.status !== true || verify.data?.status !== "success") {
    return NextResponse.json(
      { ok: false, error: "payment not successful" },
      { status: 402 },
    );
  }

  const amountKobo = verify.data.amount ?? 0;
  if (!contributionId) {
    const meta = (verify.data as { metadata?: { contributionId?: string } })?.metadata;
    contributionId = meta?.contributionId || reference;
  }
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