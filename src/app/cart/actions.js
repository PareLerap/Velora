
"use server";

import pool from "@/lib/db";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

class CartValidationError extends Error {
  constructor(code) {
    super(code);
    this.code = code;
  }
}

// =====================================
// REFRESH HALAMAN SETELAH CART BERUBAH
// =====================================
function refreshCartPages() {
  revalidatePath("/cart");
  revalidatePath("/");
  revalidatePath("/products");
}

// =====================================
// ADD TO CART
// =====================================
export async function addToCart(formData) {
  const user = await getSession();

  // VALIDASI LOGIN
  if (!user) {
    redirect("/login");
  }

  // HANYA BUYER
  if (user.role !== "buyer") {
    redirect("/");
  }

  const productId = Number(formData.get("product_id"));
  const quantity = Number(formData.get("quantity"));

  // VALIDASI ID PRODUK
  if (
    !Number.isSafeInteger(productId) ||
    productId <= 0 ||
    productId > 2147483647
  ) {
    redirect("/products");
  }

  // VALIDASI QUANTITY
  if (
    !Number.isSafeInteger(quantity) ||
    quantity < 1 ||
    quantity > 10
  ) {
    redirect("/cart?error=quantity");
  }

  const client = await pool.connect();
  let errorCode = null;

  try {
    await client.query("BEGIN");

    // BUAT KERANJANG JIKA BELUM ADA
    // SEKALIGUS KUNCI KERANJANG BUYER
    const cartResult = await client.query(
      `INSERT INTO carts (user_id)
       VALUES ($1)
       ON CONFLICT (user_id)
       DO UPDATE
       SET user_id = EXCLUDED.user_id
       RETURNING id`,
      [user.id]
    );

    const cartId = cartResult.rows[0].id;

    // AMBIL PRODUK DAN KUNCI STOK
    const productResult = await client.query(
      `SELECT
         p.id,
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

    // VALIDASI STATUS PRODUK DAN SELLER
    if (
      !product ||
      product.status !== "active" ||
      product.store_status !== "approved"
    ) {
      throw new CartValidationError("unavailable");
    }

    // CEK JUMLAH BARANG SEBELUMNYA
    const existingResult = await client.query(
      `SELECT quantity
       FROM cart_items
       WHERE cart_id = $1
         AND product_id = $2`,
      [cartId, productId]
    );

    const existingQuantity = Number(
      existingResult.rows[0]?.quantity || 0
    );

    const newQuantity = existingQuantity + quantity;

    // BATAS MAKSIMAL 10 PRODUK
    if (newQuantity > 10) {
      throw new CartValidationError("limit");
    }

    // CEK STOK
    if (newQuantity > Number(product.stock)) {
      throw new CartValidationError("stock");
    }

    // TAMBAH ATAU UPDATE PRODUK DI CART
    await client.query(
      `INSERT INTO cart_items
         (cart_id, product_id, quantity)
       VALUES ($1, $2, $3)
       ON CONFLICT (cart_id, product_id)
       DO UPDATE
       SET quantity = EXCLUDED.quantity`,
      [cartId, productId, newQuantity]
    );

    await client.query("COMMIT");

  } catch (error) {
    await client.query("ROLLBACK");

    if (error instanceof CartValidationError) {
      errorCode = error.code;
    } else {
      throw error;
    }

  } finally {
    client.release();
  }

  // HANDLE ERROR
  if (errorCode) {
    redirect(`/cart?error=${errorCode}`);
  }

  // REFRESH NAVBAR DAN KERANJANG
  refreshCartPages();
  revalidatePath(`/products/${productId}`);

  redirect("/cart?added=1");
}

// =====================================
// UPDATE CART QUANTITY
// =====================================
export async function updateCartQuantity(formData) {
  const user = await getSession();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "buyer") {
    redirect("/");
  }

  const itemId = Number(formData.get("item_id"));
  const quantity = Number(formData.get("quantity"));

  // VALIDASI INPUT
  if (
    !Number.isSafeInteger(itemId) ||
    itemId <= 0 ||
    itemId > 2147483647 ||
    !Number.isSafeInteger(quantity) ||
    quantity < 1 ||
    quantity > 10
  ) {
    redirect("/cart?error=quantity");
  }

  const client = await pool.connect();
  let errorCode = null;

  try {
    await client.query("BEGIN");

    // KUNCI KERANJANG AGAR TIDAK BENTROK
    // DENGAN CHECKOUT
    const cartResult = await client.query(
      `SELECT id
       FROM carts
       WHERE user_id = $1
       FOR UPDATE`,
      [user.id]
    );

    if (cartResult.rowCount === 0) {
      throw new CartValidationError("unavailable");
    }

    const cartId = cartResult.rows[0].id;

    // UPDATE HANYA ITEM MILIK BUYER
    // SERTA VALIDASI STOK DAN STATUS
    const result = await client.query(
      `UPDATE cart_items AS ci
       SET quantity = $3
       FROM products AS p,
            stores AS s
       WHERE ci.id = $1
         AND ci.cart_id = $2
         AND ci.product_id = p.id
         AND p.store_id = s.id
         AND p.status = 'active'
         AND s.status = 'approved'
         AND p.stock >= $3
       RETURNING ci.id`,
      [itemId, cartId, quantity]
    );

    if (result.rowCount === 0) {
      throw new CartValidationError("stock");
    }

    await client.query("COMMIT");

  } catch (error) {
    await client.query("ROLLBACK");

    if (error instanceof CartValidationError) {
      errorCode = error.code;
    } else {
      throw error;
    }

  } finally {
    client.release();
  }

  if (errorCode) {
    redirect(`/cart?error=${errorCode}`);
  }

  // REFRESH NAVBAR DAN TOTAL KERANJANG
  refreshCartPages();

  redirect("/cart?updated=1");
}

// =====================================
// REMOVE CART ITEM
// =====================================
export async function removeCartItem(formData) {
  const user = await getSession();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "buyer") {
    redirect("/");
  }

  const itemId = Number(formData.get("item_id"));

  if (
    !Number.isSafeInteger(itemId) ||
    itemId <= 0 ||
    itemId > 2147483647
  ) {
    redirect("/cart?error=quantity");
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // KUNCI KERANJANG BUYER
    const cartResult = await client.query(
      `SELECT id
       FROM carts
       WHERE user_id = $1
       FOR UPDATE`,
      [user.id]
    );

    if (cartResult.rowCount > 0) {
      const cartId = cartResult.rows[0].id;

      // HAPUS PRODUK HANYA DARI CART MILIK BUYER
      await client.query(
        `DELETE FROM cart_items
         WHERE id = $1
           AND cart_id = $2`,
        [itemId, cartId]
      );
    }

    await client.query("COMMIT");

  } catch (error) {
    await client.query("ROLLBACK");
    throw error;

  } finally {
    client.release();
  }

  // REFRESH NAVBAR DAN CART
  refreshCartPages();

  redirect("/cart?removed=1");
}
