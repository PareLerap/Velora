
"use server";

import pool from "@/lib/db";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

class CartCheckoutError extends Error {
  constructor(code) {
    super(code);
    this.code = code;
  }
}

export async function checkoutCart() {
  const user = await getSession();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "buyer") {
    redirect("/");
  }

  const client = await pool.connect();
  let errorCode = null;
  let purchasedProductIds = [];

  try {
    await client.query("BEGIN");

    // KUNCI KERANJANG BUYER
    // MENCEGAH CHECKOUT GANDA
    const cartResult = await client.query(
      `SELECT id
       FROM carts
       WHERE user_id = $1
       FOR UPDATE`,
      [user.id]
    );

    if (cartResult.rowCount === 0) {
      throw new CartCheckoutError("empty");
    }

    const cartId = cartResult.rows[0].id;

    // AMBIL DAN KUNCI SELURUH PRODUK
    const itemsResult = await client.query(
      `SELECT
         ci.id AS item_id,
         ci.product_id,
         ci.quantity,
         p.store_id,
         p.price,
         p.stock,
         p.status,
         s.status AS store_status
       FROM cart_items ci
       JOIN products p ON p.id = ci.product_id
       JOIN stores s ON s.id = p.store_id
       WHERE ci.cart_id = $1
       ORDER BY p.id ASC
       FOR UPDATE OF p, ci`,
      [cartId]
    );

    const items = itemsResult.rows;

    if (items.length === 0) {
      throw new CartCheckoutError("empty");
    }

    // VALIDASI SEMUA PRODUK SEBELUM CHECKOUT
    for (const item of items) {
      const quantity = Number(item.quantity);

      if (
        !Number.isSafeInteger(quantity) ||
        quantity < 1 ||
        quantity > 10
      ) {
        throw new CartCheckoutError("quantity");
      }

      if (
        item.status !== "active" ||
        item.store_status !== "approved"
      ) {
        throw new CartCheckoutError("unavailable");
      }

      if (Number(item.stock) < quantity) {
        throw new CartCheckoutError("stock");
      }

      if (
        !Number.isFinite(Number(item.price)) ||
        Number(item.price) <= 0
      ) {
        throw new CartCheckoutError("unavailable");
      }
    }

    // KELOMPOKKAN PRODUK BERDASARKAN SELLER
    const storeIds = [
      ...new Set(items.map((item) => item.store_id)),
    ];

    // BUAT SATU PESANAN UNTUK SETIAP SELLER
    for (const storeId of storeIds) {
      // TOTAL DIHITUNG DATABASE AGAR AKURAT
      const orderResult = await client.query(
        `INSERT INTO orders
           (user_id, store_id, total_price, status)
         SELECT
           $1,
           $2,
           SUM(p.price * ci.quantity),
           'pending'
         FROM cart_items ci
         JOIN products p ON p.id = ci.product_id
         WHERE ci.cart_id = $3
           AND p.store_id = $2
         RETURNING id`,
        [user.id, storeId, cartId]
      );

      const orderId = orderResult.rows[0].id;

      // SIMPAN SEMUA DETAIL PRODUK SELLER
      await client.query(
        `INSERT INTO order_items
           (order_id, product_id, quantity, price)
         SELECT
           $1,
           ci.product_id,
           ci.quantity,
           p.price
         FROM cart_items ci
         JOIN products p ON p.id = ci.product_id
         WHERE ci.cart_id = $2
           AND p.store_id = $3`,
        [orderId, cartId, storeId]
      );
    }

    // KURANGI STOK SETIAP PRODUK
    for (const item of items) {
      const stockResult = await client.query(
        `UPDATE products
         SET stock = stock - $1
         WHERE id = $2
           AND stock >= $1
         RETURNING id`,
        [item.quantity, item.product_id]
      );

      if (stockResult.rowCount === 0) {
        throw new CartCheckoutError("stock");
      }
    }

    // KOSONGKAN ISI KERANJANG
    await client.query(
      `DELETE FROM cart_items
       WHERE cart_id = $1`,
      [cartId]
    );

    // SEMUA TRANSAKSI BERHASIL
    await client.query("COMMIT");

    purchasedProductIds = items.map(
      (item) => item.product_id
    );

  } catch (error) {
    await client.query("ROLLBACK");

    if (error instanceof CartCheckoutError) {
      errorCode = error.code;
    } else {
      throw error;
    }

  } finally {
    client.release();
  }

  // ERROR CHECKOUT
  if (errorCode) {
    redirect(`/cart?error=${errorCode}`);
  }

  // REFRESH HALAMAN TERKAIT
  revalidatePath("/cart");
  revalidatePath("/orders");
  revalidatePath("/seller/orders");
  revalidatePath("/products");
  revalidatePath("/");

  for (const productId of purchasedProductIds) {
    revalidatePath(`/products/${productId}`);
  }

  // KE RIWAYAT PESANAN BUYER
  redirect("/orders");
}
