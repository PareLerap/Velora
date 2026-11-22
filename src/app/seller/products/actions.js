
"use server";

import pool from "@/lib/db";
import { requireApprovedSeller } from "@/lib/authorization";
import { revalidatePath } from "next/cache";

async function getMyStore() {
  const user = await requireApprovedSeller();

  const result = await pool.query(
    `SELECT id, store_name
     FROM stores
     WHERE user_id = $1 AND status = 'approved'
     LIMIT 1`,
    [user.id]
  );

  if (result.rows.length === 0) {
    throw new Error("Toko belum disetujui.");
  }

  return result.rows[0];
}

function validateProduct(formData) {
  const productName = String(
    formData.get("product_name") || ""
  ).trim();

  const description = String(
    formData.get("description") || ""
  ).trim();

  const categoryId = Number(formData.get("category_id"));
  const price = Number(formData.get("price"));
  const stock = Number(formData.get("stock"));

  const imageUrl = String(
    formData.get("image_url") || ""
  ).trim();

  if (!productName || productName.length > 150) {
    throw new Error("Nama produk tidak valid.");
  }

  if (!Number.isInteger(categoryId) || categoryId < 1) {
    throw new Error("Kategori tidak valid.");
  }

  if (!Number.isFinite(price) || price <= 0) {
    throw new Error("Harga harus lebih dari nol.");
  }

  if (!Number.isInteger(stock) || stock < 0) {
    throw new Error("Stok tidak valid.");
  }

  if (
    imageUrl &&
    !(
      /^https?:\/\//i.test(imageUrl) ||
      (imageUrl.startsWith("/") && !imageUrl.startsWith("//"))
    )
  ) {
    throw new Error("URL gambar tidak valid.");
  }

  return {
    productName,
    description,
    categoryId,
    price,
    stock,
    imageUrl,
  };
}

async function validateCategory(categoryId) {
  const result = await pool.query(
    "SELECT id FROM categories WHERE id = $1",
    [categoryId]
  );

  if (result.rows.length === 0) {
    throw new Error("Kategori tidak ditemukan.");
  }
}

function refreshProducts() {
  revalidatePath("/seller/products");
  revalidatePath("/admin/products");
  revalidatePath("/products");
}

// TAMBAH PRODUK
export async function addProduct(formData) {
  const store = await getMyStore();
  const data = validateProduct(formData);

  await validateCategory(data.categoryId);

  await pool.query(
    `INSERT INTO products
      (store_id, category_id, product_name,
       description, price, stock, status, image_url)
     VALUES ($1, $2, $3, $4, $5, $6, 'active', $7)`,
    [
      store.id,
      data.categoryId,
      data.productName,
      data.description,
      data.price,
      data.stock,
      data.imageUrl || null,
    ]
  );

  refreshProducts();
}

// EDIT PRODUK
export async function editProduct(formData) {
  const store = await getMyStore();
  const data = validateProduct(formData);

  const productId = Number(formData.get("product_id"));

  if (!Number.isInteger(productId) || productId < 1) {
    throw new Error("ID produk tidak valid.");
  }

  await validateCategory(data.categoryId);

  const result = await pool.query(
    `UPDATE products
     SET category_id = $1,
         product_name = $2,
         description = $3,
         price = $4,
         stock = $5,
         image_url = $6
     WHERE id = $7 AND store_id = $8
     RETURNING id`,
    [
      data.categoryId,
      data.productName,
      data.description,
      data.price,
      data.stock,
      data.imageUrl || null,
      productId,
      store.id,
    ]
  );

  if (result.rows.length === 0) {
    throw new Error("Produk tidak ditemukan atau bukan milik toko.");
  }

  refreshProducts();
}

// AKTIFKAN / NONAKTIFKAN PRODUK
export async function toggleProduct(formData) {
  const store = await getMyStore();

  const productId = Number(formData.get("product_id"));

  if (!Number.isInteger(productId) || productId < 1) {
    throw new Error("ID produk tidak valid.");
  }

  const result = await pool.query(
    `UPDATE products
     SET status = CASE
       WHEN status = 'active' THEN 'inactive'
       ELSE 'active'
     END
     WHERE id = $1 AND store_id = $2
     RETURNING id`,
    [productId, store.id]
  );

  if (result.rows.length === 0) {
    throw new Error("Produk tidak ditemukan atau bukan milik toko.");
  }

  refreshProducts();
}
