export function isTurnstileConfigured() {
  return Boolean(process.env.TURNSTILE_SECRET_KEY && process.env.TURNSTILE_SITE_KEY);
}

export function getTurnstileSiteKey() {
  return process.env.TURNSTILE_SITE_KEY ?? "";
}

function isProductionHost() {
  const url = process.env.APP_URL ?? "";
  return Boolean(url) && !/localhost|127\.0\.0\.1/i.test(url);
}

/**
 * Verifies a Cloudflare Turnstile token.
 * Local/dev without keys skips verification. Production without keys rejects
 * submissions so the form cannot silently accept bot traffic.
 */
export async function verifyTurnstile(token: string, remoteIp?: string | null) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    if (isProductionHost()) {
      return {
        ok: false as const,
        error: "Form protection is not configured. Please call us for a quote instead.",
      };
    }
    return { ok: true as const, skipped: true as const };
  }

  if (!token.trim()) {
    return { ok: false as const, error: "Please complete the captcha and try again." };
  }

  try {
    const body = new URLSearchParams();
    body.set("secret", secret);
    body.set("response", token);
    if (remoteIp) body.set("remoteip", remoteIp);

    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    const payload = (await response.json()) as { success?: boolean; "error-codes"?: string[] };
    if (!payload.success) {
      return { ok: false as const, error: "Captcha check failed. Please try again." };
    }
    return { ok: true as const, skipped: false as const };
  } catch {
    return { ok: false as const, error: "Captcha check failed. Please try again." };
  }
}
