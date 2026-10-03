import { NextResponse } from "next/server";
import { isValidAdminPassword } from "@/lib/adminAuth";
import {
  readCloudWishes,
  appendCloudWish,
  updateCloudWishStatus,
  wishesCloudConfigured,
} from "@/lib/wishesCloud";
import type { Wish, WishSubmission } from "@/lib/types";

export const runtime = "nodejs";

const noStore = { "Cache-Control": "no-store, max-age=0" } as const;

export async function GET() {
  if (!wishesCloudConfigured()) {
    return NextResponse.json({ ok: false, error: "not configured" }, { status: 503 });
  }
  const wishes = await readCloudWishes();
  return NextResponse.json({ ok: true, wishes }, { headers: noStore });
}

export async function POST(request: Request) {
  if (!wishesCloudConfigured()) {
    return NextResponse.json({ ok: false, error: "not configured" }, { status: 503 });
  }

  const body = (await request.json().catch(() => null)) as Partial<Wish> | null;
  if (!body || !body.senderName || !body.message) {
    return NextResponse.json({ ok: false, error: "senderName and message are required" }, { status: 400 });
  }

  const wish: Wish = {
    id: typeof body.id === "string" && body.id ? body.id : crypto.randomUUID(),
    senderName: String(body.senderName).trim(),
    relationship: body.relationship ? String(body.relationship).trim() : undefined,
    message: String(body.message).trim(),
    photoUrl: typeof body.photoUrl === "string" ? body.photoUrl : undefined,
    voiceUrl: typeof body.voiceUrl === "string" ? body.voiceUrl : undefined,
    anonymous: Boolean(body.anonymous),
    status: "published",
    createdAt: typeof body.createdAt === "string" ? body.createdAt : new Date().toISOString(),
  };

  const saved = await appendCloudWish(wish);
  return NextResponse.json({ ok: true, wish: saved }, { headers: noStore });
}

export async function PATCH(request: Request) {
  if (!isValidAdminPassword(request.headers.get("x-admin-password") ?? "")) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  if (!wishesCloudConfigured()) {
    return NextResponse.json({ ok: false, error: "not configured" }, { status: 503 });
  }

  const body = (await request.json().catch(() => null)) as {
    id?: string;
    status?: "published" | "hidden" | "removed";
  } | null;

  if (!body?.id || !body?.status) {
    return NextResponse.json({ ok: false, error: "id and status are required" }, { status: 400 });
  }

  const ok = await updateCloudWishStatus(body.id, body.status);
  return NextResponse.json({ ok }, { headers: noStore });
}
