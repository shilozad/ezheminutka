import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "ezheminutka_admin";
export const SESSION_SECONDS = 8 * 60 * 60;
export type SessionPayload = { userId: string; sessionVersion: number; expiresAt: number };

function secret() {
  const value = process.env.ADMIN_SESSION_SECRET;
  return value && Buffer.byteLength(value, "utf8") >= 32 ? value : null;
}
export function createSessionToken(payload: SessionPayload): string {
  const key = secret();
  if (!key) throw new Error("ADMIN_SESSION_SECRET must contain at least 32 bytes");
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${createHmac("sha256", key).update(body).digest("base64url")}`;
}
export function verifySessionToken(token: string): SessionPayload | null {
  try {
    const key = secret();
    if (!key) return null;
    const [body, signature, extra] = token.split(".");
    if (!body || !signature || extra) return null;
    const supplied = Buffer.from(signature, "base64url");
    const expected = createHmac("sha256", key).update(body).digest();
    if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return null;
    const payload = JSON.parse(Buffer.from(body, "base64url").toString()) as SessionPayload;
    if (
      !payload.userId ||
      !Number.isInteger(payload.sessionVersion) ||
      payload.expiresAt <= Date.now()
    )
      return null;
    return payload;
  } catch {
    return null;
  }
}
export async function setAdminSession(userId: string, sessionVersion: number) {
  const expiresAt = Date.now() + SESSION_SECONDS * 1000;
  (await cookies()).set(ADMIN_COOKIE, createSessionToken({ userId, sessionVersion, expiresAt }), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
}
export async function clearAdminSession() {
  (await cookies()).set(ADMIN_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}
