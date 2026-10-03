"use client";

/*
 * ADMIN AUTH — client-side gate for the owner area.
 * The password ships in the bundle (it's a static site, no backend), so this
 * is "lock the door" convenience, not real security. Override at build time
 * with NEXT_PUBLIC_ADMIN_PASSWORD.
 */

const DEFAULT_PASSWORD = "birthdayadmin";
const SESSION_KEY = "bday.admin";

function envPassword(): string | null {
  if (typeof process === "undefined") return null;
  const v = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
  return v && v.length > 0 ? v : null;
}

export function getAdminPassword(): string {
  return envPassword() ?? DEFAULT_PASSWORD;
}

export function isAdminAuthed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

export function login(password: string): boolean {
  if (password === getAdminPassword()) {
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* storage unavailable — session-only anyway */
    }
    return true;
  }
  return false;
}

export function logout(): void {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}