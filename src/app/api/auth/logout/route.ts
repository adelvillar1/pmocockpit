import { NextResponse } from "next/server";

import { SESSION_COOKIE } from "@/server/auth";

/** POST /api/auth/logout — clear the session cookie. */
export async function POST() {
  const res = new NextResponse(null, { status: 204 });
  res.headers.set(
    "Set-Cookie",
    `${SESSION_COOKIE}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`,
  );
  return res;
}
