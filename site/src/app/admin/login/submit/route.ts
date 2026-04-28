import { NextResponse, type NextRequest } from "next/server";
import { createHmac } from "node:crypto";

// Same constants/encoding as src/lib/auth.ts. We inline here so the
// route handler can set the cookie atomically on the redirect response —
// avoiding the Server-Action+redirect+cookie persistence weirdness that
// drops the cookie on subsequent navigations.

const COOKIE_NAME = "laren_session";
const ONE_DAY = 60 * 60 * 24;
const SESSION_TTL = ONE_DAY * 14;

function sign(value: string, secret: string): string {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

function encodeSession(secret: string): string {
  const now = Math.floor(Date.now() / 1000);
  const payload = { role: "owner", iat: now, exp: now + SESSION_TTL };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${sign(body, secret)}`;
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const password = String(formData.get("password") ?? "");

  const expected = process.env.ADMIN_PASSWORD;
  const secret = process.env.SESSION_SECRET;

  if (!expected || !secret || secret.length < 16) {
    console.error("[auth-route] missing ADMIN_PASSWORD or SESSION_SECRET");
    return NextResponse.redirect(new URL("/admin/login?error=1", request.url), {
      status: 303,
    });
  }

  if (password !== expected) {
    console.log("[auth-route] login: wrong password");
    return NextResponse.redirect(new URL("/admin/login?error=1", request.url), {
      status: 303,
    });
  }

  const token = encodeSession(secret);
  const expires = new Date(Date.now() + SESSION_TTL * 1000);

  const response = NextResponse.redirect(new URL("/admin", request.url), {
    status: 303,
  });

  // Set cookie directly on the redirect response — this bypasses the
  // cookies().set() flow used in Server Actions which sometimes loses
  // the cookie across navigations on Vercel.
  response.cookies.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL,
    expires,
  });

  console.log("[auth-route] login: success, cookie set");
  return response;
}

export async function GET() {
  // No GET — login uses POST only.
  return NextResponse.redirect(
    new URL("/admin/login", process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
    { status: 303 },
  );
}
