
import "server-only";

import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import pool from "@/lib/db";

const COOKIE_NAME = "velora_session";
const SESSION_DURATION = 60 * 60 * 24 * 7; // 7 hari

function getSecretKey() {
  const secret = process.env.JWT_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET belum dikonfigurasi dengan benar.");
  }

  return new TextEncoder().encode(secret);
}

// MEMBUAT SESSION SETELAH LOGIN BERHASIL
export async function createSession(userId) {
  const token = await new SignJWT({
    userId: String(userId),
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecretKey());

  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION,
  });
}

// MENGAMBIL USER YANG SEDANG LOGIN
export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) return null;

  let userId;

  try {
    const { payload } = await jwtVerify(
      token,
      getSecretKey(),
      { algorithms: ["HS256"] }
    );

    userId = Number(payload.userId);

    if (!Number.isSafeInteger(userId) || userId <= 0) {
      return null;
    }
  } catch {
    return null;
  }

  // Cek user terbaru dari database
  const result = await pool.query(
    `SELECT id, name, email, role
     FROM users
     WHERE id = $1`,
    [userId]
  );

  return result.rows[0] ?? null;
}

// MENGHAPUS SESSION SAAT LOGOUT
export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
