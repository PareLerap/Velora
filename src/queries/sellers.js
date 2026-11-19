
import "server-only";
import pool from "@/lib/db";

// MENGAMBIL SELURUH SELLER
export async function getSellers() {
  const result = await pool.query(`
    SELECT
      s.id AS store_id,
      u.id AS user_id,
      u.name,
      u.email,
      s.store_name,
      s.description,
      s.status,
      s.created_at
    FROM stores s
    JOIN users u ON s.user_id = u.id
    WHERE u.role = 'seller'
    ORDER BY
      CASE
        WHEN s.status = 'pending' THEN 0
        ELSE 1
      END,
      s.created_at DESC
  `);

  return result.rows;
}

// MENGUBAH STATUS SELLER
export async function updateSellerStatus(storeId, status) {
  if (
    !Number.isInteger(storeId) ||
    storeId <= 0 ||
    storeId > 2147483647
  ) {
    throw new Error("ID toko tidak valid.");
  }

  if (!["approved", "rejected"].includes(status)) {
    throw new Error("Status seller tidak valid.");
  }

  const result = await pool.query(`
    UPDATE stores s
    SET status = $1
    FROM users u
    WHERE s.user_id = u.id
    AND u.role = 'seller'
    AND s.id = $2
    AND s.status = 'pending'
    RETURNING s.id
  `, [status, storeId]);

  return result.rowCount > 0;
}
