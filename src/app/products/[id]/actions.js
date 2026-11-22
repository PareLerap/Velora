
"use server";

import pool from "@/lib/db";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

class CheckoutValidationError extends Error {
  constructor(code) {
    super(code);
    this.code = code;
  }
}

export async function buyNow(formData) {
  // Pastikan hanya Buyer yang bisa membeli
  const user = await getSession();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "buyer") {
    throw new Error("Hanya akun Buyer yang dapat membeli produk.");
  }

  const productId = Number(formData.get("product_id"));
  const quantity = Number(formData.get("quantity"));

  if (!Number.isSafeInteger(productId) || productId <= 0) {
    throw new Error("ID produk tidak valid.");
  }

  if (
    !Number.isSafeInteger(quantity) ||
    quantity < 1 ||
    quantity > 10
  ) {
    throw new Error("Jumlah pembelian harus antara 1 sampai 10.");
  }

  const client = await pool.connect();

  let orderId = null;
  let errorCode = null;

  try {
    await client.query("BEGIN");

    // Kunci produk selama transaksi agar stok aman
    const productResult = await client.query(
      `SELECT
         p.id,
         p.store_id,
         p.price,
         p.stock,
         p.status,
         s.status AS store_status
       FROM products p
       JOIN stores s ON s.id = p.store_id
       WHERE p.id = $1
       FOR UPDATE OF p`,
      [productId]
    );

    const product = productResult.rows[0];

    if (
      !product ||
      product.status !== "active" ||
      product.store_status !== "approved"
    ) {
      throw new CheckoutValidationError("unavailable");
    }

    if (Number(product.stock) < quantity) {
      throw new CheckoutValidationError("stock");
    }

    if (
      !Number.isFinite(Number(product.price)) ||
      Number(product.price) <= 0
    ) {
      throw new CheckoutValidationError("unavailable");
    }

    // Buat pesanan. Harga dihitung di database,
    // bukan dari nilai yang dikirim browser.
    const orderResult = await client.query(
      `INSERT INTO orders
         (user_id, store_id, total_price, status)
       VALUES
         ($1, $2, $3::numeric * $4::integer, 'pending')
       RETURNING id`,
      [user.id, product.store_id, product.price, quantity]
    );

    orderId = orderResult.rows[0].id;

    // Simpan detail barang yang dibeli
    await client.query(
      `INSERT INTO order_items
         (order_id, product_id, quantity, price)
       VALUES ($1, $2, $3, $4)`,
      [orderId, productId, quantity, product.price]
    );

    // Kurangi stok
    const stockResult = await client.query(
      `UPDATE products
       SET stock = stock - $1
       WHERE id = $2
         AND stock >= $1
       RETURNING id`,
      [quantity, productId]
    );

    if (stockResult.rows.length === 0) {
      throw new CheckoutValidationError("stock");
    }

    // Simpan semua perubahan
    await client.query("COMMIT");

  } catch (error) {
    await client.query("ROLLBACK");

    if (error instanceof CheckoutValidationError) {
      errorCode = error.code;
    } else {
      throw error;
    }

  } finally {
    client.release();
  }

  if (errorCode) {
    redirect(
      `/products/${productId}?checkout_error=${errorCode}`
    );
  }

  revalidatePath(`/products/${productId}`);
  revalidatePath("/seller/orders");

  redirect(`/products/${productId}?order_id=${orderId}`);
}
