import { supabaseServer } from "@/lib/supabaseServer";
import type { YearPhoto, Person } from "@/lib/types";

/*
 * Server-only. Photos live in a PUBLIC Supabase Storage bucket so every
 * visitor can load them, and the ordered list (year -> photos, in admin
 * priority order) lives in a single JSON manifest in the same bucket.
 *
 * No database table is involved, so this needs no SQL/DDL — only the
 * service_role key, which can create buckets and objects via the API.
 */

const BUCKET = "timeline-photos";
const MANIFEST_PATH = "manifest.json";
const PEOPLE_PATH = "people.json";

export type PhotoManifest = Record<string, YearPhoto[]>;

function bucket() {
  if (!supabaseServer) return null;
  return supabaseServer.storage.from(BUCKET);
}

export function storageConfigured(): boolean {
  return bucket() !== null;
}

export async function readManifest(): Promise<PhotoManifest> {
  const parsed = await readManifestText();
  if (!parsed) return {};
  try {
    const value: unknown = JSON.parse(parsed);
    if (!value || typeof value !== "object" || Array.isArray(value)) return {};
    const out: PhotoManifest = {};
    for (const [yearId, list] of Object.entries(value as Record<string, unknown>)) {
      if (!Array.isArray(list)) continue;
      out[yearId] = list.filter(
        (p): p is YearPhoto =>
          Boolean(p) &&
          typeof (p as YearPhoto).id === "string" &&
          typeof (p as YearPhoto).url === "string",
      );
    }
    return out;
  } catch {
    return {};
  }
}

/*
 * Read through the authenticated endpoint with a cache-busting query.
 * The bucket is public, so a plain download can be served from the CDN
 * and hand back a stale manifest — which silently loses admin writes.
 */
async function readManifestText(): Promise<string | null> {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!base || !key) return null;
  try {
    const res = await fetch(
      `${base}/storage/v1/object/${BUCKET}/${MANIFEST_PATH}?fresh=${Date.now()}`,
      { headers: { authorization: `Bearer ${key}` }, cache: "no-store" },
    );
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

export async function writeManifest(manifest: PhotoManifest): Promise<boolean> {
  const b = bucket();
  if (!b) return false;
  const { error } = await b.upload(MANIFEST_PATH, JSON.stringify(manifest, null, 2), {
    contentType: "application/json",
    cacheControl: "no-store",
    upsert: true,
  });
  if (error) console.error("photo manifest write failed", error.message);
  return !error;
}

export async function readPeople(): Promise<Person[] | null> {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!base || !key) return null;
  try {
    const res = await fetch(
      `${base}/storage/v1/object/${BUCKET}/${PEOPLE_PATH}?fresh=${Date.now()}`,
      { headers: { authorization: `Bearer ${key}` }, cache: "no-store" },
    );
    if (!res.ok) return null;
    const text = await res.text();
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? (parsed as Person[]) : null;
  } catch {
    return null;
  }
}

export async function writePeople(people: Person[]): Promise<boolean> {
  const b = bucket();
  if (!b) return false;
  const { error } = await b.upload(PEOPLE_PATH, JSON.stringify(people, null, 2), {
    contentType: "application/json",
    cacheControl: "no-store",
    upsert: true,
  });
  if (error) console.error("people write failed", error.message);
  return !error;
}

/** Store one compressed image and return its public URL. */
export async function uploadPhoto(
  base64: string,
  contentType: string,
): Promise<string | null> {
  const b = bucket();
  if (!b) return null;
  const path = `photos/${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${extFor(contentType)}`;
  let buffer: Buffer;
  try {
    buffer = Buffer.from(base64, "base64");
  } catch {
    return null;
  }
  if (!buffer.length) return null;

  const { error } = await b.upload(path, buffer, {
    contentType,
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) {
    console.error("photo upload failed", error.message);
    return null;
  }
  return b.getPublicUrl(path).data.publicUrl;
}

export async function deletePhoto(publicUrl: string): Promise<boolean> {
  const b = bucket();
  if (!b) return false;
  const path = pathFromPublicUrl(publicUrl);
  if (!path) return false;
  const { error } = await b.remove([path]);
  if (error) console.error("photo delete failed", error.message);
  return !error;
}

function pathFromPublicUrl(publicUrl: string): string | null {
  const marker = `/object/public/${BUCKET}/`;
  const i = publicUrl.indexOf(marker);
  if (i === -1) return null;
  const path = publicUrl.slice(i + marker.length);
  return path.startsWith("photos/") ? path : null;
}

function extFor(contentType: string): string {
  switch (contentType) {
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    case "image/avif":
      return "avif";
    default:
      return "jpg";
  }
}
