
import Link from "next/link";
import pool from "@/lib/db";
import { requireApprovedSeller } from "@/lib/authorization";
import VeloraNavbar from "@/components/VeloraNavbar";

import {
  addProduct,
  editProduct,
  toggleProduct,
} from "./actions";

export default async function SellerProductsPage() {
  const user = await requireApprovedSeller();

  // AMBIL TOKO SELLER
  const storeResult = await pool.query(
    `SELECT id, store_name
     FROM stores
     WHERE user_id = $1
       AND status = 'approved'
     LIMIT 1`,
    [user.id]
  );

  const store = storeResult.rows[0];

  if (!store) {
    return (
      <div className="min-h-screen bg-black text-white">
        <VeloraNavbar user={user} />

        <main className="mx-auto max-w-7xl px-6 py-12">
          <h1 className="text-3xl font-bold">
            Store Unavailable
          </h1>

          <p className="mt-4 text-zinc-400">
            Toko belum tersedia atau belum disetujui.
          </p>

          <Link
            href="/seller"
            className="mt-6 inline-block underline"
          >
            Back to Dashboard
          </Link>
        </main>
      </div>
    );
  }

  // AMBIL PRODUK DAN KATEGORI
  const [productsResult, categoriesResult] = await Promise.all([
    pool.query(
      `SELECT p.*, c.category_name
       FROM products p
       LEFT JOIN categories c
         ON p.category_id = c.id
       WHERE p.store_id = $1
       ORDER BY p.id DESC`,
      [store.id]
    ),

    pool.query(
      `SELECT id, category_name
       FROM categories
       ORDER BY category_name`
    ),
  ]);

  const products = productsResult.rows;
  const categories = categoriesResult.rows;

  // FORMAT HARGA
  const formatPrice = (price) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(Number(price));

  // STYLE INPUT
  const inputClass =
    "w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-sm text-white outline-none focus:border-white";

  return (
    <div className="min-h-screen bg-black text-white">

      {/* NAVBAR BERSAMA - TINGGI 80PX */}
      <VeloraNavbar user={user} />

      {/* MAIN CONTENT */}
      <main className="mx-auto max-w-7xl px-6 py-12 md:px-12">

        {/* HEADER */}
        <div className="animate-fade-up">

          <p className="mb-4 text-xs tracking-[0.3em] text-zinc-400">
            SELLER CONTROL CENTER
          </p>

          <h1 className="text-4xl font-black tracking-tight md:text-6xl">
            Manage Products.
          </h1>

          <p className="mt-4 text-zinc-400">
            Manage your product catalog at{" "}
            {store.store_name}.
          </p>

          <Link
            href="/seller"
            className="mt-6 inline-block text-sm text-zinc-400 transition hover:text-white"
          >
            ← Back to Seller Dashboard
          </Link>

        </div>

        {/* ADD NEW PRODUCT */}
        <details className="group mt-10 rounded-3xl border border-zinc-800 bg-zinc-900 p-6">

          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-semibold">

            <span>
              ＋ Add New Product
            </span>

            <span className="text-zinc-400 transition-transform group-open:rotate-45">
              +
            </span>

          </summary>

          {/* ADD PRODUCT FORM */}
          <form
            action={addProduct}
            className="mt-8 space-y-5"
          >

            <div className="grid gap-5 md:grid-cols-2">

              {/* PRODUCT NAME */}
              <div>
                <label className="mb-2 block text-sm">
                  Product Name
                </label>

                <input
                  name="product_name"
                  required
                  maxLength={150}
                  placeholder="Nama produk"
                  className={inputClass}
                />
              </div>

              {/* CATEGORY */}
              <div>
                <label className="mb-2 block text-sm">
                  Category
                </label>

                <select
                  name="category_id"
                  required
                  defaultValue=""
                  className={inputClass}
                >
                  <option value="" disabled>
                    Pilih kategori
                  </option>

                  {categories.map((category) => (
                    <option
                      key={category.id}
                      value={category.id}
                    >
                      {category.category_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* PRICE */}
              <div>
                <label className="mb-2 block text-sm">
                  Price (Rp)
                </label>

                <input
                  type="number"
                  name="price"
                  min="1"
                  step="1"
                  required
                  placeholder="150000"
                  className={inputClass}
                />
              </div>

              {/* STOCK */}
              <div>
                <label className="mb-2 block text-sm">
                  Stock
                </label>

                <input
                  type="number"
                  name="stock"
                  min="0"
                  step="1"
                  required
                  placeholder="10"
                  className={inputClass}
                />
              </div>

            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="mb-2 block text-sm">
                Description
              </label>

              <textarea
                name="description"
                rows={4}
                placeholder="Deskripsi produk"
                className={inputClass}
              />
            </div>

            {/* IMAGE URL */}
            <div>
              <label className="mb-2 block text-sm">
                Image URL
              </label>

              <input
                name="image_url"
                placeholder="/images/products/contoh.jpg"
                className={inputClass}
              />
            </div>

            {/* SAVE BUTTON */}
            <button
              type="submit"
              className="rounded-full bg-white px-8 py-3 font-bold text-black transition hover:bg-zinc-300"
            >
              Save Product ↗
            </button>

          </form>

        </details>

        {/* PRODUCT LIST */}
        <section className="mt-12">

          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">

            <div>
              <h2 className="text-2xl font-bold">
                My Products.
              </h2>

              <p className="mt-2 text-sm text-zinc-400">
                Kelola seluruh produk di toko kamu.
              </p>
            </div>

            <span className="text-sm text-zinc-400">
              {products.length} Products
            </span>

          </div>

          {/* EMPTY STATE */}
          {products.length === 0 ? (

            <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-12 text-center">

              <div className="text-5xl">
                📦
              </div>

              <h3 className="mt-5 text-xl font-bold">
                No Products Yet.
              </h3>

              <p className="mt-3 text-sm text-zinc-400">
                Tambahkan produk pertama untuk mulai
                mengelola katalog toko.
              </p>

            </div>

          ) : (

            <div className="grid gap-6 lg:grid-cols-2">

              {products.map((product) => (

                <article
                  key={product.id}
                  className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6"
                >

                  {/* PRODUCT INFORMATION */}
                  <div className="flex gap-5">

                    {/* PRODUCT IMAGE */}
                    <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white text-4xl">

                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.product_name}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <span>📦</span>
                      )}

                    </div>

                    {/* PRODUCT DETAILS */}
                    <div className="min-w-0 flex-1">

                      <p className="text-xs uppercase tracking-widest text-zinc-400">
                        {product.category_name ||
                          "Uncategorized"}
                      </p>

                      <h3 className="mt-2 break-words text-xl font-bold">
                        {product.product_name}
                      </h3>

                      <p className="mt-3 text-lg font-bold">
                        {formatPrice(product.price)}
                      </p>

                      <p className="mt-1 text-sm text-zinc-400">
                        Stock: {product.stock ?? 0}
                      </p>

                    </div>

                  </div>

                  {/* PRODUCT STATUS */}
                  <div className="mt-6 flex items-center justify-between border-b border-zinc-800 pb-5">

                    <span className="text-xs text-zinc-500">
                      Product ID: {product.id}
                    </span>

                    <span
                      className={
                        product.status === "active"
                          ? "rounded-full border border-green-500/30 bg-green-500/10 px-3 py-2 text-xs font-semibold text-green-400"
                          : "rounded-full border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-400"
                      }
                    >
                      {product.status === "active"
                        ? "ACTIVE"
                        : "INACTIVE"}
                    </span>

                  </div>

                  {/* EDIT PRODUCT */}
                  <details className="mt-5 rounded-2xl border border-zinc-700 p-4">

                    <summary className="cursor-pointer font-semibold">
                      Edit Product
                    </summary>

                    <form
                      action={editProduct}
                      className="mt-6 space-y-4"
                    >

                      {/* PRODUCT ID */}
                      <input
                        type="hidden"
                        name="product_id"
                        value={product.id}
                      />

                      {/* PRODUCT NAME */}
                      <div>
                        <label className="mb-2 block text-xs text-zinc-400">
                          Product Name
                        </label>

                        <input
                          name="product_name"
                          defaultValue={product.product_name}
                          required
                          maxLength={150}
                          className={inputClass}
                        />
                      </div>

                      {/* CATEGORY */}
                      <div>
                        <label className="mb-2 block text-xs text-zinc-400">
                          Category
                        </label>

                        <select
                          name="category_id"
                          defaultValue={product.category_id}
                          required
                          className={inputClass}
                        >
                          {categories.map((category) => (
                            <option
                              key={category.id}
                              value={category.id}
                            >
                              {category.category_name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* PRICE AND STOCK */}
                      <div className="grid grid-cols-2 gap-3">

                        <div>
                          <label className="mb-2 block text-xs text-zinc-400">
                            Price (Rp)
                          </label>

                          <input
                            type="number"
                            name="price"
                            min="1"
                            step="1"
                            defaultValue={product.price}
                            required
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-xs text-zinc-400">
                            Stock
                          </label>

                          <input
                            type="number"
                            name="stock"
                            min="0"
                            step="1"
                            defaultValue={product.stock ?? 0}
                            required
                            className={inputClass}
                          />
                        </div>

                      </div>

                      {/* DESCRIPTION */}
                      <div>
                        <label className="mb-2 block text-xs text-zinc-400">
                          Description
                        </label>

                        <textarea
                          name="description"
                          rows={3}
                          defaultValue={product.description ?? ""}
                          className={inputClass}
                        />
                      </div>

                      {/* IMAGE URL */}
                      <div>
                        <label className="mb-2 block text-xs text-zinc-400">
                          Image URL
                        </label>

                        <input
                          name="image_url"
                          defaultValue={product.image_url ?? ""}
                          placeholder="Image URL"
                          className={inputClass}
                        />
                      </div>

                      {/* SAVE CHANGES */}
                      <button
                        type="submit"
                        className="w-full rounded-full bg-white py-3 font-bold text-black transition hover:bg-zinc-300"
                      >
                        Save Changes
                      </button>

                    </form>

                  </details>

                  {/* ACTIVATE / DEACTIVATE PRODUCT */}
                  <form
                    action={toggleProduct}
                    className="mt-4"
                  >

                    <input
                      type="hidden"
                      name="product_id"
                      value={product.id}
                    />

                    <button
                      type="submit"
                      className="w-full rounded-2xl border border-zinc-700 px-5 py-3 text-left text-sm font-semibold transition hover:bg-zinc-800"
                    >
                      {product.status === "active"
                        ? "Deactivate Product"
                        : "Activate Product"}
                    </button>

                  </form>

                </article>

              ))}

            </div>

          )}

        </section>

      </main>

      {/* FOOTER */}
      <footer className="mt-16 border-t border-zinc-800 py-8 text-center text-xs text-zinc-500">
        © 2026 VELORA. Seller Product Management.
      </footer>

    </div>
  );
}
