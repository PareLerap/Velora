
import "server-only";
import pool from "@/lib/db";

export async function registerUser({
  name,
  email,
  password,
  role,
  storeName,
}) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // MEMBUAT AKUN BARU
    const result = await client.query(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [name, email, password, role]
    );

    const userId = result.rows[0].id;

    // JIKA SELLER, BUAT TOKO
    if (role === "seller") {
      await client.query(
        `INSERT INTO stores (user_id, store_name, status)
         VALUES ($1, $2, $3)`,
        [userId, storeName, "pending"]
      );
    }

    // JIKA BUYER, BUAT KERANJANG
    if (role === "buyer") {
      await client.query(
        `INSERT INTO carts (user_id)
         VALUES ($1)`,
        [userId]
      );
    }

    await client.query("COMMIT");

    return userId;

  } catch (error) {
    await client.query("ROLLBACK");
    throw error;

  } finally {
    client.release();
  }
}

// MENGAMBIL SELURUH PENGGUNA
export async function getUsers() {
  const result = await pool.query(`
    SELECT
      u.id,
      u.name,
      u.email,
      u.role,
      u.created_at,
      s.store_name,
      s.status AS seller_status
    FROM users u
    LEFT JOIN stores s ON u.id = s.user_id
    ORDER BY u.id DESC
  `);

  return result.rows;
}
// MENGAMBIL USER BERDASARKAN ID
export async function getUserById(id) {
  const result = await pool.query(
    `SELECT id, name, email, role
     FROM users
     WHERE id = $1`,
    [id]
  );

  return result.rows[0] ?? null;
}

// MENGEDIT DATA USER
export async function updateUser(id, name, email, adminId) {
  const result = await pool.query(
    `UPDATE users
     SET name = $1, email = $2
     WHERE id = $3
     AND id <> $4
     RETURNING id`,
    [name, email, id, adminId]
  );

  return result.rowCount > 0;
}

// MENGHAPUS AKUN PENGGUNA
export async function deleteUser(userId, adminId) {
  // VALIDASI ID
  if (
    !Number.isInteger(userId) ||
    userId <= 0 ||
    userId > 2147483647
  ) {
    return "invalid";
  }

  // MELINDUNGI AKUN ADMIN SENDIRI
  if (userId === adminId) {
    return "self";
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // CEK DAN KUNCI DATA USER
    const result = await client.query(
      `SELECT id, role
       FROM users
       WHERE id = $1
       FOR UPDATE`,
      [userId]
    );

    if (result.rowCount === 0) {
      await client.query("ROLLBACK");
      return "not-found";
    }

    // HAPUS KERANJANG PENGGUNA
    await client.query(
      `DELETE FROM carts
       WHERE user_id = $1`,
      [userId]
    );

    // HAPUS PRODUK SELLER DARI KERANJANG BUYER
    await client.query(
      `DELETE FROM cart_items
       WHERE product_id IN (
         SELECT p.id
         FROM products p
         JOIN stores s ON p.store_id = s.id
         WHERE s.user_id = $1
       )`,
      [userId]
    );

    // HAPUS PRODUK MILIK SELLER
    await client.query(
      `DELETE FROM products
       WHERE store_id IN (
         SELECT id
         FROM stores
         WHERE user_id = $1
       )`,
      [userId]
    );

    // HAPUS TOKO
    await client.query(
      `DELETE FROM stores
       WHERE user_id = $1`,
      [userId]
    );

    // HAPUS AKUN PENGGUNA
    await client.query(
      `DELETE FROM users
       WHERE id = $1
       AND id <> $2`,
      [userId, adminId]
    );

    await client.query("COMMIT");

    return "deleted";

  } catch (error) {
    await client.query("ROLLBACK");

    // FOREIGN KEY VIOLATION
    if (error.code === "23503") {
      return "has-relations";
    }

    console.error("Delete user failed:", error.code);

    return "database";

  } finally {
    client.release();
  }
}

