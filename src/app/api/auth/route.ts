import { NextRequest, NextResponse } from "next/server";

import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  createSessionValue,
  verifyPasscode,
} from "@/server/auth";

// Lightweight in-memory rate limit: IP -> attempt timestamps.
// Single-instance app (one user), so a Map is sufficient.
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const RATE_LIMIT_MAX = 10;
const attempts = new Map<string, number[]>();

function clientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const recent = (attempts.get(ip) ?? []).filter((t) => t > windowStart);
  recent.push(now);
  attempts.set(ip, recent);
  // Opportunistic cleanup so the map doesn't grow unbounded.
  if (attempts.size > 1000) {
    for (const [key, stamps] of attempts) {
      if (stamps.every((t) => t <= windowStart)) attempts.delete(key);
    }
  }
  return recent.length > RATE_LIMIT_MAX;
}

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      { status: 429 },
    );
  }

  let passcode: unknown;
  try {
    const body = await req.json();
    passcode = (body as { passcode?: unknown })?.passcode;
  } catch {
    return NextResponse.json(
      { error: "Invalid passcode" },
      { status: 401 },
    );
  }

  if (typeof passcode !== "string" || !verifyPasscode(passcode)) {
    return NextResponse.json({ error: "Invalid passcode" }, { status: 401 });
  }

  // Defense in depth: token creation requires AUTH_SECRET to be set.
  if (!process.env.AUTH_SECRET) {
    return NextResponse.json(
      { error: "Server misconfigured" },
      { status: 500 },
    );
  }

  const token = createSessionValue();
  const res = new NextResponse(null, { status: 204 });
  const secure = process.env.NODE_ENV === "production";
  res.headers.set(
    "Set-Cookie",
    `${SESSION_COOKIE}=${token}; HttpOnly; Path=/; Max-Age=${SESSION_MAX_AGE_SECONDS}; SameSite=Lax${
      secure ? "; Secure" : ""
    }`,
  );
  return res;
}
