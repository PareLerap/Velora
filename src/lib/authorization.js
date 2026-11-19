import "server-only";

import pool from "@/lib/db";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

// MENGAMBIL STATUS SELLER
export async function getSellerStatus(userId) {
  const result = await pool.query(
    `SELECT status FROM stores WHERE user_id = $1`,
    [userId]
  );

  return result.rows[0]?.status ?? null;
}

// MENENTUKAN HALAMAN BERDASARKAN ROLE
export async function getAccountPath(user) {
  if (user.role === "admin") {
    return "/admin";
  }

  if (user.role === "seller") {
    const status = await getSellerStatus(user.id);

    if (status === "approved") {
      return "/seller";
    }

    if (status === "rejected") {
      return "/seller/rejected";
    }

    return "/seller/pending";
  }

  return "/";
}

// MEMBATASI AKSES BERDASARKAN ROLE
export async function requireRole(role) {
  const user = await getSession();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== role) {
    redirect(await getAccountPath(user));
  }

  return user;
}

// MEMBATASI AKSES SELLER
export async function requireApprovedSeller() {
  const user = await requireRole("seller");
  const path = await getAccountPath(user);

  if (path !== "/seller") {
    redirect(path);
  }

  return user;
}