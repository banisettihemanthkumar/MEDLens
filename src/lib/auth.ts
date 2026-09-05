/**
 * auth.ts — Zero-config auth
 *
 * Session tokens are still cookie-based (base64 encoded). The difference is
 * that user lookup against the database has been removed. A single hardcoded
 * demo clinician account is available without any env var setup.
 */
import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "medlens_session";

export async function hashPassword(plainText: string): Promise<string> {
  // Use Web Crypto API (available in all environments including Vercel Edge)
  const encoder = new TextEncoder();
  const data = encoder.encode(plainText + "medlens_salt_2026");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function verifyPassword(plainText: string, hashed: string): Promise<boolean> {
  const candidateHash = await hashPassword(plainText);
  return candidateHash === hashed;
}

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export function createSessionToken(user: SessionUser): string {
  const payload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    iat: Date.now(),
    exp: Date.now() + 1000 * 60 * 60 * 24 * 7,
  };
  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

export function parseSessionToken(token: string): SessionUser | null {
  try {
    const raw = Buffer.from(token, "base64url").toString("utf-8");
    const data = JSON.parse(raw);
    if (!data || !data.sub || (data.exp && Date.now() > data.exp)) return null;
    return { id: data.sub, email: data.email, name: data.name, role: data.role || "CLINICIAN" };
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;
    return parseSessionToken(token);
  } catch {
    return null;
  }
}

export async function setSessionCookie(user: SessionUser) {
  const token = createSessionToken(user);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
