
"use server";

import pool from "@/lib/db";
import { requireApprovedSeller } from "@/lib/authorization";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(formData) {
  const user = await requireApprovedSeller();

  const orderId = Number(formData.get("order_id"));
  const status = String(formData.get("status") || "");

  const allowedStatuses = [
    "processing",
    "shipped",
    "completed",
    "cancelled",
  ];

  if (!Number.isInteger(orderId) || orderId < 1) {
    throw new Error("ID pesanan tidak valid.");
  }

  if (!allowedStatuses.includes(status)) {
    throw new Error("Status pesanan tidak valid.");
  }

  // Ambil toko yang dimiliki Seller
  const storeResult = await pool.query(
    `SELECT id
     FROM stores
     WHERE user_id = $1
       AND status = 'approved'
     LIMIT 1`,
    [user.id]
  );

  const store = storeResult.rows[0];

  if (!store) {
    throw new Error("Toko tidak ditemukan.");
  }

  // Update status dengan validasi alur dan kepemilikan
  const result = await pool.query(
    `UPDATE orders o
     SET status = $1
     WHERE o.id = $2

       AND (o.store_id = $3 OR o.store_id IS NULL)

       AND EXISTS (
         SELECT 1
         FROM order_items oi
         JOIN products p ON p.id = oi.product_id
         WHERE oi.order_id = o.id
           AND p.store_id = $3
       )

       AND NOT EXISTS (
         SELECT 1
         FROM order_items oi
         JOIN products p ON p.id = oi.product_id
         WHERE oi.order_id = o.id
           AND p.store_id <> $3
       )

       AND (
         (o.status = 'pending'
          AND $1 IN ('processing', 'cancelled'))

         OR

         (o.status = 'processing'
          AND $1 IN ('shipped', 'cancelled'))

         OR

         (o.status = 'shipped'
          AND $1 = 'completed')
       )

     RETURNING o.id`,
    [status, orderId, store.id]
  );

  if (result.rows.length === 0) {
    throw new Error(
      "Perubahan status ditolak. Periksa alur status dan kepemilikan pesanan."
    );
  }

  revalidatePath("/seller/orders");
}
