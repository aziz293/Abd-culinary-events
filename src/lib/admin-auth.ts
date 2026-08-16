import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "abd_admin_session";
const SECRET = process.env.ADMIN_SESSION_SECRET || "abd-culinary-events-dev-secret-change-me";

function sign(value: string) {
  return createHmac("sha256", SECRET).update(value).digest("hex");
}

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || "abd-admin-2026";
}

export async function createAdminSession() {
  const token = sign("admin-ok");
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8, // 8h
  });
}

export async function clearAdminSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function isAdminAuthenticated() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return false;
  const expected = sign("admin-ok");
  try {
    return timingSafeEqual(Buffer.from(token), Buffer.from(expected));
  } catch {
    return false;
  }
}
