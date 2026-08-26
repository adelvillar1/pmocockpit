import { NextRequest, NextResponse } from "next/server";

import { SESSION_COOKIE, isValidSessionEdge } from "@/server/auth-edge";

export async function middleware(req: NextRequest) {
  const session = req.cookies.get(SESSION_COOKIE)?.value;
  if (await isValidSessionEdge(session)) {
    return NextResponse.next();
  }
  const loginUrl = new URL("/login", req.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    /*
     * Match everything except:
     * - /login (the login page itself)
     * - /api/auth (login + logout endpoints)
     * - /_next/* (Next.js static assets)
     * - favicon.ico
     */
    "/((?!login|api/auth|_next|favicon.ico).*)",
  ],
};
