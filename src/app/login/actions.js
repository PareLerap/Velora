"use server";

import bcrypt from "bcryptjs";
import pool from "@/lib/db";
import { createSession } from "@/lib/auth";
import { getAccountPath } from "@/lib/authorization";
import { redirect } from "next/navigation";

export async function login(formData) {
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();

  const password = String(formData.get("password") || "");

  // VALIDASI INPUT
  if (
    !email ||
    !password ||
    email.length > 100 ||
    Buffer.byteLength(password, "utf8") > 72
  ) {
    redirect("/login?error=invalid");
  }

  // MENCARI USER
  const result = await pool.query(
    `SELECT id, name, email, password, role
     FROM users
     WHERE email = $1`,
    [email]
  );

  const user = result.rows[0];

  if (!user) {
    redirect("/login?error=invalid");
  }

  // VALIDASI PASSWORD
  const passwordValid = await bcrypt.compare(
    password,
    user.password
  );

  if (!passwordValid) {
    redirect("/login?error=invalid");
  }

  // VALIDASI ROLE
  if (!["admin", "seller", "buyer"].includes(user.role)) {
    redirect("/login?error=invalid");
  }

  // MENENTUKAN TUJUAN LOGIN
  const path = await getAccountPath(user);

  // MEMBUAT SESSION
  await createSession(user.id);

  // REDIRECT BERDASARKAN ROLE
  redirect(path);
}