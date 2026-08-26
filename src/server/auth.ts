/**
 * Node-runtime auth helpers (route handlers).
 *
 * Session token format (shared with src/server/auth-edge.ts):
 *   <issued-at-ms>.<hex HMAC-SHA256(issued-at-ms, AUTH_SECRET)>
 *
 * The edge-runtime (middleware) variant lives in src/server/auth-edge.ts.
 */

import { createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "stratum_session";
export const SESSION_MAX_AGE_SECONDS = 30 * 24 * 60 * 60; // 30 days

function hmacHex(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

/**
 * Constant-time comparison of the user's passcode against APP_PASSCODE.
 * Both sides are re-hashed to normalize length before timingSafeEqual
 * (which requires equal-length buffers). Returns false when the env var
 * is missing/empty — never throws.
 */
export function verifyPasscode(input: string): boolean {
  try {
    const expected = process.env.APP_PASSCODE;
    if (!expected || typeof input !== "string") return false;
    // SHA-256 both sides so timingSafeEqual always gets equal-length buffers.
    const a = createHmac("sha256", "passcode-norm").update(input).digest();
    const b = createHmac("sha256", "passcode-norm").update(expected).digest();
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/** Create an HMAC-signed session token: <issued-at-ms>.<hex-sig>. */
export function createSessionValue(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET is not set");
  const payload = String(Date.now());
  return `${payload}.${hmacHex(payload, secret)}`;
}

/**
 * Verify a session token's HMAC signature and that it is < 30 days old.
 * Invalid / garbage / missing input returns false — never throws.
 */
export function isValidSession(value: string | undefined): boolean {
  try {
    if (!value) return false;
    const secret = process.env.AUTH_SECRET;
    if (!secret) return false;

    const dot = value.lastIndexOf(".");
    if (dot <= 0) return false;
    const payload = value.slice(0, dot);
    const sig = value.slice(dot + 1);

    const expected = hmacHex(payload, secret);
    // Normalize lengths so timingSafeEqual can't throw on mismatch.
    const a = createHmac("sha256", "sig-norm").update(sig).digest();
    const b = createHmac("sha256", "sig-norm").update(expected).digest();
    if (!timingSafeEqual(a, b)) return false;

    const issuedAt = Number(payload);
    if (!Number.isFinite(issuedAt)) return false;
    const age = Date.now() - issuedAt;
    return age >= 0 && age < SESSION_MAX_AGE_SECONDS * 1000;
  } catch {
    return false;
  }
}
