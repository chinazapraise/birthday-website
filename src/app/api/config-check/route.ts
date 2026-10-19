import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Temporary, value-free diagnostic. Reports only whether server-side
 * Supabase configuration is present; never returns credentials or URL.
 * Remove after troubleshooting.
 */
export async function GET() {
  return NextResponse.json(
    {
      urlConfigured: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
      secretConfigured: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
      clientConfigured: supabaseServer !== null,
    },
    { headers: { "Cache-Control": "no-store, max-age=0" } },
  );
}
