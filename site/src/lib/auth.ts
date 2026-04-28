import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHmac, timingSafeEqual } from "node:crypto";

const COOKIE_NAME = "laren_session";
const ONE_DAY = 60 * 60 * 24;
const SESSION_TTL = ONE_DAY * 14;

type SessionPayload = { role: "owner"; iat: number; exp: number };

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("SESSION_SECRET must be set and at least 16 chars");
  }
  return secret;
}

function sign(value: string): string {
  return createHmac("sha256", getSecret()).update(value).digest("base64url");
}

function encodeSession(payload: SessionPayload): string {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = sign(body);
  return `${body}.${sig}`;
}

function decodeSession(token: string): SessionPayload | null {
  const [body, sig] = token.split(".");
  if (!body || !sig) {
    console.log("[auth] decode: malformed token");
    return null;
  }
  const expected = sign(body);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    console.log(
      `[auth] decode: signature mismatch (got ${a.length}b vs expected ${b.length}b)`,
    );
    return null;
  }
  try {
    const payload = JSON.parse(
      Buffer.from(body, "base64url").toString("utf8"),
    ) as SessionPayload;
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      console.log("[auth] decode: expired");
      return null;
    }
    return payload;
  } catch (err) {
    console.log("[auth] decode: parse error", err);
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const cookie = store.get(COOKIE_NAME);
  if (!cookie?.value) {
    console.log("[auth] getSession: no cookie");
    return null;
  }
  const session = decodeSession(cookie.value);
  console.log(
    `[auth] getSession: ${session ? "VALID" : "INVALID"} (cookie len=${cookie.value.length}, secret len=${process.env.SESSION_SECRET?.length})`,
  );
  return session;
}

export async function requireOwner() {
  const session = await getSession();
  if (!session || session.role !== "owner") {
    throw new Error("Unauthorized");
  }
  return session;
}

/** Same as requireOwner but redirects to login instead of throwing — use in pages. */
export async function requireOwnerOrRedirect() {
  const session = await getSession();
  if (!session || session.role !== "owner") {
    redirect("/admin/login");
  }
  return session;
}

export async function loginAsOwner(password: string): Promise<boolean> {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) throw new Error("ADMIN_PASSWORD not set");
  if (password !== expected) return false;
  const now = Math.floor(Date.now() / 1000);
  const store = await cookies();
  store.set(
    COOKIE_NAME,
    encodeSession({ role: "owner", iat: now, exp: now + SESSION_TTL }),
    {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_TTL,
    },
  );
  return true;
}

export async function logout() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
