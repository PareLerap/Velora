import pool from "@/lib/db";

export async function getProducts(search = "") {
  const result = await pool.query(`
    SELECT
      p.id,
      p.product_name,
      p.description,
      p.price,
      p.stock,
      p.image_url,
      c.category_name,
      s.store_name
    FROM products p
    JOIN categories c ON p.category_id = c.id
    JOIN stores s ON p.store_id = s.id
    WHERE p.status = 'active'
    AND p.stock > 0
    AND s.status = 'approved'
    AND p.product_name ILIKE $1
    ORDER BY p.id DESC
  `, [`%${search}%`]);

  return result.rows;
}
export async function getProductById(id) {
  const result = await pool.query(`
    SELECT
      p.id,
      p.product_name,
      p.description,
      p.price,
      p.stock,
      p.image_url,
      c.category_name,
      s.store_name
    FROM products p
    JOIN categories c ON p.category_id = c.id
    JOIN stores s ON p.store_id = s.id
    WHERE p.id = $1
    AND p.status = 'active'
    AND s.status = 'approved'
  `, [id]);

  return result.rows[0];
}