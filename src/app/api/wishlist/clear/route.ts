import { NextResponse } from "next/server";
import { clearAllGiftActivity } from "@/lib/supabaseServer";
import { isValidAdminPassword } from "@/lib/adminAuth";

export const runtime = "nodejs";

/**
 * Wipe every claim, reserve and contribution from Supabase. Only callable
 * with the admin password (sent as x-admin-password header). This is the
 * cleanup path used to release test gift actions built up during the build.
 */
export async function POST(request: Request) {
  const password = request.headers.get("x-admin-password") ?? "";
  if (!isValidAdminPassword(password)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const cleared = await clearAllGiftActivity();
  if (!cleared) {
    return NextResponse.json(
      { ok: false, error: "partial or failed clearance" },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}