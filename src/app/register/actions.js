
"use server";

import bcrypt from "bcryptjs";
import { registerUser } from "@/queries/users";
import { redirect } from "next/navigation";

export async function register(formData) {
  const name = String(formData.get("name") || "").trim();

  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();

  const password = String(formData.get("password") || "");

  const confirmPassword = String(
    formData.get("confirmPassword") || ""
  );

  const role = String(formData.get("role") || "");

  const storeName = String(
    formData.get("storeName") || ""
  ).trim();

  // VALIDASI INPUT
  if (
    !name ||
    name.length > 100 ||
    !email ||
    email.length > 100 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    redirect("/register?error=invalid");
  }

  // VALIDASI ROLE
  if (!["buyer", "seller"].includes(role)) {
    redirect("/register?error=role");
  }

  // VALIDASI PASSWORD
  if (
    password.length < 8 ||
    Buffer.byteLength(password, "utf8") > 72
  ) {
    redirect("/register?error=password");
  }

  if (password !== confirmPassword) {
    redirect("/register?error=confirm");
  }

  // VALIDASI NAMA TOKO
  if (
    role === "seller" &&
    (!storeName || storeName.length > 100)
  ) {
    redirect("/register?error=store");
  }

  // HASH PASSWORD
  const hashedPassword = await bcrypt.hash(password, 10);

  let errorCode = null;

  try {
    await registerUser({
      name,
      email,
      password: hashedPassword,
      role,
      storeName,
    });

  } catch (error) {
    if (error.code === "23505") {
      errorCode = "duplicate";
    } else {
      console.error("Registration failed:", error.code);
      errorCode = "database";
    }
  }

  if (errorCode) {
    redirect(`/register?error=${errorCode}`);
  }

  // REGISTER BERHASIL
  redirect("/login");
}
