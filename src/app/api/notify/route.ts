import { NextResponse } from "next/server";
import { sendGiftNotificationEmail } from "@/lib/gmail";

export const runtime = "nodejs";

const ISOLATION_COLORS: Record<string, string> = {
  claim: "#7a0a15",
  reserve: "#b8860b",
  contribution: "#a6e22e",
  gifted: "#7a0a15",
};

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderEmail(params: {
  action: GiftAction["action"];
  itemName?: string;
  name?: string;
  note?: string;
  amount?: string;
}): { subject: string; html: string } {
  const action = params.action;
  const accent = ISOLATION_COLORS[action] ?? "#7a0a15";
  const icon =
    action === "claim"
      ? "💝"
      : action === "reserve"
        ? "📦"
        : action === "gifted"
          ? "🎁"
          : "💳";
  const title =
    action === "claim"
      ? "A Gift Was Claimed"
      : action === "reserve"
        ? "An Item Was Reserved"
        : action === "gifted"
          ? "A Gift Was Marked Gifted"
          : "A Contribution Was Made";
  const detail = [
    `<tr><td style="padding:6px 0;color:#ffffff;">Gift</td><td style="padding:6px 0;color:#ffffff;font-weight:600;text-align:right;">${esc(params.itemName ?? "—")}</td></tr>`,
    `<tr><td style="padding:6px 0;color:#ffffff;">From</td><td style="padding:6px 0;color:#ffffff;text-align:right;">${esc(params.name ?? "Anonymous")}</td></tr>`,
    params.amount
      ? `<tr><td style="padding:6px 0;color:#ffffff;">Amount</td><td style="padding:6px 0;color:#ffffff;text-align:right;">${esc(params.amount)}</td></tr>`
      : "",
    params.note
      ? `<tr><td style="padding:6px 0;color:#ffffff;">Note</td><td style="padding:6px 0;color:#ffffff;font-style:italic;text-align:right;">“${esc(params.note)}”</td></tr>`
      : "",
  ].join("");

  const html = `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;background-color:#050505;font-family:Montserrat,Arial,sans-serif;">
  <tr>
    <td align="center" style="padding:48px 24px;">
      <table role="presentation" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
        <tr>
          <td align="center" style="padding-bottom:24px;font-size:14px;letter-spacing:3px;color:#7a0a15;font-weight:700;">TOMIDE WILLIAMS</td>
        </tr>
        <tr>
          <td align="center" style="padding:32px;background-color:#111111;border-radius:16px;">
            <div style="font-size:40px;margin-bottom:12px;">${icon}</div>
            <div style="font-family:Cinzel,serif;font-size:24px;font-weight:700;color:#ffffff;margin-bottom:6px;">${title}</div>
            <div style="font-size:13px;color:#a0a0a0;margin-bottom:24px;">${new Date().toUTCString()}</div>
            <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;">
              ${detail}
            </table>
            <div style="margin-top:28px;border-top:1px solid #222222;padding-top:20px;">
              <a href="https://tomidewilliams.com/admin" style="display:inline-block;background-color:${accent};color:#ffffff;text-decoration:none;padding:12px 24px;font-size:12px;font-weight:700;letter-spacing:2px;border-radius:8px;">OPEN OWNER AREA</a>
            </div>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding-top:24px;font-size:11px;color:#555555;">
            Birthday wishlist · automatic notification
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`;

  return { subject: `${title} · ${esc(params.itemName ?? "Wishlist")}`, html };
}

export type GiftAction = {
  action: "claim" | "reserve" | "contribution" | "gifted";
  itemName?: string;
  name?: string;
  note?: string;
  amount?: string;
};

/**
 * Fire a branded email notification for a gift action. Best-effort: any
 * failure returns ok:false but never blocks the visitor's flow.
 */
export async function POST(request: Request) {
  let body: GiftAction;
  try {
    body = (await request.json()) as GiftAction;
  } catch {
    return NextResponse.json({ ok: false, error: "bad body" }, { status: 400 });
  }

  const allowed: GiftAction["action"][] = [
    "claim",
    "reserve",
    "contribution",
    "gifted",
  ];
  if (!allowed.includes(body.action)) {
    return NextResponse.json(
      { ok: false, error: "unknown action" },
      { status: 400 },
    );
  }

  const { subject, html } = renderEmail(body);
  const sent = await sendGiftNotificationEmail({ subject, html });

  return NextResponse.json(
    sent
      ? { ok: true }
      : { ok: false, error: "email not sent (see server log)" },
    { status: sent ? 200 : 502 },
  );
}