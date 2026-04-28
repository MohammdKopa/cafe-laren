import { NextResponse, type NextRequest } from "next/server";

/**
 * Edge middleware that runs before every /admin request. Logs the raw
 * Cookie header arriving at the edge so we can confirm whether the
 * browser is sending the session cookie. Doesn't enforce auth itself —
 * page-level guards still do that.
 */
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (!path.startsWith("/admin")) return NextResponse.next();

  const cookieHeader = request.headers.get("cookie") ?? "";
  const hasLarenSession = cookieHeader.includes("laren_session=");
  const cookieNames = cookieHeader
    .split(";")
    .map((c) => c.trim().split("=")[0])
    .filter(Boolean);

  console.log(
    `[mw] ${request.method} ${path} — laren_session: ${hasLarenSession ? "PRESENT" : "MISSING"} — all cookies: [${cookieNames.join(", ")}]`,
  );

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
