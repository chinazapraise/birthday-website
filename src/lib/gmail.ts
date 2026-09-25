/* Server-side Gmail helper. Uses OAuth refresh-token creds exported from the
 * gws CLI (Google Workspace API auth) to send email on Tomide's account. */

type GmailCredentials = {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  to: string;
};

function creds(): GmailCredentials | null {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GMAIL_REFRESH_TOKEN;
  const to = process.env.GMAIL_TO;
  if (!clientId || !clientSecret || !refreshToken || !to) return null;
  return { clientId, clientSecret, refreshToken, to };
}

async function getAccessToken(c: GmailCredentials): Promise<string | null> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: c.clientId,
      client_secret: c.clientSecret,
      refresh_token: c.refreshToken,
      grant_type: "refresh_token",
    }),
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) {
    console.error("gmail token refresh failed", res.status);
    return null;
  }
  const data = (await res.json()) as { access_token?: string };
  return data.access_token ?? null;
}

/** Base64url-encode for the Gmail API. */
function encodeBase64Url(input: string): string {
  return Buffer.from(input, "utf-8").toString("base64url");
}

/**
 * Send an HTML email to the owner for a gift action. Never throws — returns
 * a boolean so callers can fire-and-forget.
 */
export async function sendGiftNotificationEmail(params: {
  subject: string;
  html: string;
}): Promise<boolean> {
  const c = creds();
  if (!c) {
    console.warn("gmail not configured — missing GOOGLE_* env vars");
    return false;
  }

  const token = await getAccessToken(c);
  if (!token) return false;

  const raw = encodeBase64Url(
    [
      `To: ${c.to}`,
      "Content-Type: text/html; charset=UTF-8",
      `Subject: ${params.subject}`,
      "",
      params.html,
    ].join("\r\n"),
  );

  try {
    const res = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ raw }),
      signal: AbortSignal.timeout(20000),
    });
    if (!res.ok) {
      console.error("gmail send failed", res.status, await res.text());
      return false;
    }
    return true;
  } catch {
    return false;
  }
}