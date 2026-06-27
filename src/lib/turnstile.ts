import { config } from "@/lib/config";

/**
 * Cloudflare Turnstile verification (optional).
 *
 * Off by default (ENABLE_CLOUDFLARE_TURNSTILE=false) so normal users never see a
 * challenge. When enabled, routes pass the client token here for server-side
 * verification before doing variable-cost work.
 */
export async function verifyTurnstile(
  token: string | undefined,
  ip?: string,
): Promise<boolean> {
  // If disabled or not configured, treat as a pass (no challenge required).
  if (!config.turnstile.enabled || !config.turnstile.secretKey) return true;
  if (!token) return false;

  try {
    const body = new URLSearchParams();
    body.set("secret", config.turnstile.secretKey);
    body.set("response", token);
    if (ip) body.set("remoteip", ip);

    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      { method: "POST", body },
    );
    if (!res.ok) return false;
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

/** Whether the client should render a Turnstile widget at all. */
export function turnstileRequired(): boolean {
  return config.turnstile.enabled && !!config.turnstile.siteKey;
}
