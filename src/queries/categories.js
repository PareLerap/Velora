
import "server-only";
import pool from "@/lib/db";

// MENAMPILKAN SEMUA KATEGORI
export async function getCategories() {
  const result = await pool.query(`
    SELECT
      c.id,
      c.category_name,
      c.description,
      c.created_at,
      COUNT(p.id)::int AS total_products
    FROM categories c
    LEFT JOIN products p ON c.id = p.category_id
    GROUP BY c.id
    ORDER BY c.id ASC
  `);

  return result.rows;
}

// MENGAMBIL KATEGORI BERDASARKAN ID
export async function getCategoryById(id) {
  const result = await pool.query(
    `SELECT * FROM categories WHERE id = $1`,
    [id]
  );

  return result.rows[0] ?? null;
}

// MENAMBAHKAN KATEGORI
export async function createCategory(name, description) {
  const result = await pool.query(
    `INSERT INTO categories (category_name, description)
     VALUES ($1, $2)
     RETURNING id`,
    [name, description]
  );

  return result.rows[0];
}

// MENGEDIT KATEGORI
export async function updateCategory(id, name, description) {
  const result = await pool.query(
    `UPDATE categories
     SET category_name = $1, description = $2
     WHERE id = $3
     RETURNING id`,
    [name, description, id]
  );

  return result.rowCount > 0;
}

// MENGHAPUS KATEGORI
export async function deleteCategory(id) {
  const result = await pool.query(
    `DELETE FROM categories
     WHERE id = $1
     AND NOT EXISTS (
       SELECT 1 FROM products
       WHERE category_id = $1
     )
     RETURNING id`,
    [id]
  );

  return result.rowCount > 0;
}
