/**
 * Edge-safe session verification (Web Crypto only — no node:crypto).
 *
 * Shared token format with src/server/auth.ts:
 *   <issued-at-ms>.<hex HMAC-SHA256(issued-at-ms, AUTH_SECRET)>
 *
 * This module is imported by middleware (Edge runtime). Keep it free of
 * node builtins. The node-runtime helpers live in src/server/auth.ts.
 */

export const SESSION_COOKIE = "stratum_session";
export const SESSION_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function bytesToHex(bytes: Uint8Array): string {
  let out = "";
  for (const b of bytes) out += b.toString(16).padStart(2, "0");
  return out;
}

async function hmacHex(payload: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  return bytesToHex(new Uint8Array(sig));
}

/** Constant-time string comparison (avoids early-exit length/timing leaks). */
function safeEqual(a: string, b: string): boolean {
  const len = Math.max(a.length, b.length);
  let diff = a.length === b.length ? 0 : 1;
  for (let i = 0; i < len; i++) {
    const ca = i < a.length ? a.charCodeAt(i) : 0;
    const cb = i < b.length ? b.charCodeAt(i) : 0;
    diff |= ca ^ cb;
  }
  return diff === 0;
}

/** Verify a session token's HMAC signature and age. Never throws. */
export async function isValidSessionEdge(
  value: string | undefined,
): Promise<boolean> {
  try {
    if (!value) return false;
    const secret = process.env.AUTH_SECRET;
    if (!secret) return false;

    const dot = value.lastIndexOf(".");
    if (dot <= 0) return false;
    const payload = value.slice(0, dot);
    const sig = value.slice(dot + 1);

    const expected = await hmacHex(payload, secret);
    if (!safeEqual(sig, expected)) return false;

    const issuedAt = Number(payload);
    if (!Number.isFinite(issuedAt)) return false;
    const age = Date.now() - issuedAt;
    return age >= 0 && age < SESSION_MAX_AGE_MS;
  } catch {
    return false;
  }
}
