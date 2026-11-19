
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
