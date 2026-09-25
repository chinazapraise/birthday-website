/* Client-side fire-and-forget helper for the gift-action email notification.
 * Sends a POST to /api/notify; failures (or no Gmail config) are swallowed so
 * a notification problem never breaks a visitor's gift flow. */

export type NotifyAction =
  | "claim"
  | "reserve"
  | "contribution"
  | "gifted";

export async function notifyGiftAction(
  action: NotifyAction,
  data: {
    itemName?: string;
    name?: string;
    note?: string;
    amount?: string;
  } = {},
): Promise<boolean> {
  try {
    const res = await fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ...data }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      if (body?.pending) void 0;
      return false;
    }
    return true;
  } catch {
    return false;
  }
}