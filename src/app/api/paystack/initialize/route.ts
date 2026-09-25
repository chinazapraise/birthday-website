import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export const runtime = "nodejs";

const PAYSTACK_INIT_URL = "https://api.paystack.co/transaction/initialize";

interface InitPayload {
  email: string;
  amount: number; // in NGN
  name: string;
  phone?: string;
  itemId: string;
  itemName: string;
  kind?: "contribution" | "gift";
  anonymous?: boolean;
  contributionId?: string;
  callbackUrl?: string;
}

export async function POST(request: Request) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret || secret.includes("paste_here")) {
    return NextResponse.json(
      { ok: false, error: "PAYSTACK_SECRET_KEY not configured" },
      { status: 500 },
    );
  }

  let body: InitPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad body" }, { status: 400 });
  }

  const {
    email,
    amount,
    name,
    phone,
    itemId,
    itemName,
    kind = "gift",
    anonymous = false,
    contributionId,
    callbackUrl,
  } = body;

  if (!email || !amount || amount <= 0) {
    return NextResponse.json(
      { ok: false, error: "email and valid amount required" },
      { status: 400 },
    );
  }

  const cleanId = (contributionId || crypto.randomUUID()).replace(/-/g, "");
  const reference = `TW${cleanId.slice(0, 16)}`;
  const amountKobo = Math.round(amount * 100);

  let paystackRes: {
    status: boolean;
    message?: string;
    data?: {
      authorization_url: string;
      access_code: string;
      reference: string;
    };
  };

  try {
    const res = await fetch(PAYSTACK_INIT_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.trim(),
        amount: amountKobo,
        reference,
        callback_url: callbackUrl,
        metadata: {
          contributionId: contributionId || reference,
          itemId,
          itemName,
          name: name?.trim() || "Anonymous",
          phone: phone?.trim(),
          anonymous,
          custom_fields: [
            {
              display_name: "Gifter",
              variable_name: "gifter_name",
              value: name?.trim() || "Anonymous",
            },
            {
              display_name: "Wishlist Item",
              variable_name: "item_name",
              value: itemName || "Birthday Gift",
            },
          ],
        },
      }),
      cache: "no-store",
    });
    paystackRes = await res.json();
  } catch (err) {
    console.error("Paystack init fetch failed", err);
    return NextResponse.json(
      { ok: false, error: "Could not initialize checkout with Paystack" },
      { status: 502 },
    );
  }

  if (!paystackRes.status || !paystackRes.data?.authorization_url) {
    console.error("Paystack init rejected", paystackRes);
    return NextResponse.json(
      {
        ok: false,
        error: paystackRes.message || "Failed to initialize Paystack checkout",
      },
      { status: 400 },
    );
  }

  // Pre-record in Supabase so intent is tracked even before webhook/callback
  if (supabaseServer) {
    try {
      await supabaseServer.from("wishlist_contributions").upsert({
        id: contributionId || reference,
        item_id: itemId,
        name: name?.trim() || "",
        email: email.trim(),
        phone: phone?.trim() || "",
        anonymous,
        amount: Math.round(amount),
        currency: "NGN",
        kind,
        paid: false,
        reference,
      });
    } catch (e) {
      console.warn("Supabase pre-recording warning:", e);
    }
  }

  return NextResponse.json({
    ok: true,
    authorizationUrl: paystackRes.data.authorization_url,
    reference,
  });
}
