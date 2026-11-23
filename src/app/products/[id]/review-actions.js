
"use server";

import pool from "@/lib/db";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function submitReview(formData) {
  // CEK LOGIN DAN ROLE
  const user = await getSession();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "buyer") {
    redirect("/");
  }

  // AMBIL DATA DARI FORM
  const productId = Number(formData.get("product_id"));
  const rating = Number(formData.get("rating"));
  const comment = String(
    formData.get("comment") || ""
  ).trim();

  // VALIDASI PRODUK
  if (
    !Number.isSafeInteger(productId) ||
    productId < 1 ||
    productId > 2147483647
  ) {
    redirect("/");
  }

  const productUrl = `/products/${productId}`;

  // VALIDASI RATING DAN KOMENTAR
  if (
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5 ||
    comment.length > 1000
  ) {
    redirect(`${productUrl}?review_error=invalid`);
  }

  // HANYA BUYER DENGAN PESANAN COMPLETED
  // SATU ULASAN PER BUYER DAN PRODUK
  const result = await pool.query(
    `INSERT INTO reviews
      (user_id, product_id, order_id, rating, comment, created_at)
     SELECT
       $1,
       $2,
       o.id,
       $3,
       $4,
       NOW()
     FROM orders o
     JOIN order_items oi
       ON oi.order_id = o.id
     WHERE o.user_id = $1
       AND oi.product_id = $2
       AND o.status = 'completed'
       AND NOT EXISTS (
         SELECT 1
         FROM reviews r
         WHERE r.user_id = $1
           AND r.product_id = $2
       )
     ORDER BY o.id DESC
     LIMIT 1
     ON CONFLICT (user_id, product_id) DO NOTHING
     RETURNING id`,
    [
      user.id,
      productId,
      rating,
      comment || null,
    ]
  );

  // PESANAN BELUM COMPLETED ATAU SUDAH REVIEW
  if (result.rowCount === 0) {
    redirect(`${productUrl}?review_error=not_allowed`);
  }

  // REFRESH DATA REVIEW
  revalidatePath(productUrl);

  // TAMPILKAN NOTIFIKASI BERHASIL
  redirect(`${productUrl}?review_success=1`);
}
