import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Temporary, value-free diagnostic. Never returns credentials or project URL. */
export async function GET() {
  let bucketCheck: { ok: boolean; bucketNames?: string[]; error?: string } = {
    ok: false,
    error: "Supabase client unavailable",
  };

  if (supabaseServer) {
    const { data, error } = await supabaseServer.storage.listBuckets();
    bucketCheck = error
      ? { ok: false, error: error.message }
      : { ok: true, bucketNames: (data ?? []).map((bucket) => bucket.name) };
  }

  return NextResponse.json(
    {
      urlConfigured: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
      secretConfigured: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
      clientConfigured: supabaseServer !== null,
      bucketCheck,
    },
    { headers: { "Cache-Control": "no-store, max-age=0" } },
  );
}
