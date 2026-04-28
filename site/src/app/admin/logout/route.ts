import { NextResponse, type NextRequest } from "next/server";
import { logout } from "@/lib/auth";

/**
 * POST-only — GET would let Next.js Link prefetching silently log
 * the user out (prefetch-on-hover would run the handler).
 */
export async function POST(request: NextRequest) {
  await logout();
  console.log("[auth-route] logout: cookie cleared");
  return NextResponse.redirect(new URL("/admin/login", request.url), {
    status: 303,
  });
}

// Catch accidental GETs (or prefetches) — just bounce to login without
// touching the session cookie.
export async function GET(request: NextRequest) {
  return NextResponse.redirect(new URL("/admin/login", request.url), {
    status: 303,
  });
}
