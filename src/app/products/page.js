
import Link from "next/link";
import pool from "@/lib/db";
import { getSession } from "@/lib/auth";
import VeloraNavbar from "@/components/VeloraNavbar";

export const dynamic = "force-dynamic";

// FORMAT HARGA RUPIAH
function formatPrice(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export default async function AllProductsPage() {
  const user = await getSession();

  // =====================================
  // AMBIL PRODUK YANG BOLEH DITAMPILKAN
  // =====================================

  const result = await pool.query(
    `SELECT
       p.id,
       p.product_name,
       p.price,
       p.stock,
       p.image_url,
       p.status,
       p.store_id
     FROM products p
     JOIN stores s
       ON s.id = p.store_id
     WHERE p.stock > 0
       AND p.status = 'active'
       AND s.status = 'approved'
     ORDER BY p.id DESC`
  );

  const products = result.rows;

  return (
    <div className="min-h-screen bg-black text-white">

      {/* NAVBAR */}
      <VeloraNavbar user={user} />

      {/* MAIN CONTENT */}
      <main className="mx-auto max-w-7xl px-6 py-16 md:px-12">

        {/* BREADCRUMB */}
        <div className="mb-10 text-sm text-zinc-500">
          <Link
            href="/"
            className="transition hover:text-white"
          >
            Home
          </Link>

          <span className="mx-2">/</span>

          <span className="text-white">
            All Products
          </span>
        </div>

        {/* HEADER */}
        <div className="mb-12">

          <p className="mb-4 text-xs tracking-[0.3em] text-zinc-400">
            EXPLORE VELORA COLLECTION
          </p>

          <h1 className="text-4xl font-black tracking-tight md:text-6xl">
            All Products.
          </h1>

          <p className="mt-5 max-w-2xl text-zinc-400">
            Discover our collection of premium products.
            Everything you need, in one place.
          </p>

          <div className="mt-8 border-b border-zinc-800 pb-5">
            <p className="text-sm text-zinc-400">
              {products.length} Products Available
            </p>
          </div>

        </div>

        {/* ================================= */}
        {/* PRODUCT COLLECTION */}
        {/* ================================= */}

        {products.length === 0 ? (

          /* NO PRODUCTS */
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-12 text-center">

            <h2 className="text-2xl font-bold">
              No Products Available
            </h2>

            <p className="mt-3 text-zinc-400">
              Belum ada produk aktif yang tersedia saat ini.
            </p>

            <Link
              href="/"
              className="mt-8 inline-block rounded-full bg-white px-8 py-3 font-bold text-black transition hover:bg-zinc-300"
            >
              Back to Home ↗
            </Link>

          </div>

        ) : (

          /* PRODUCT GRID */
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {products.map((product) => {

              const productName =
                product.product_name || "VELORA Product";

              return (
                <div
                  key={product.id}
                  className="group overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 transition-all duration-300 hover:-translate-y-1 hover:border-zinc-500"
                >

                  {/* PRODUCT IMAGE */}
                  <Link href={`/products/${product.id}`}>

                    <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-zinc-800">

                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={productName}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <span className="text-8xl font-black text-zinc-600">
                          V
                        </span>
                      )}

                      {/* AVAILABLE BADGE */}
                      <div className="absolute left-4 top-4 rounded-full bg-white px-4 py-2 text-xs font-bold text-black">
                        Available
                      </div>

                    </div>

                  </Link>

                  {/* PRODUCT INFORMATION */}
                  <div className="p-6">

                    <p className="mb-3 text-xs uppercase tracking-widest text-zinc-500">
                      VELORA COLLECTION
                    </p>

                    <h2 className="min-h-12 text-lg font-bold leading-snug">
                      {productName}
                    </h2>

                    {/* STOCK */}
                    <p className="mt-3 text-sm text-zinc-400">
                      Stok: {product.stock}
                    </p>

                    {/* PRICE */}
                    <p className="mt-5 text-2xl font-black">
                      {formatPrice(product.price)}
                    </p>

                    {/* VIEW PRODUCT */}
                    <Link
                      href={`/products/${product.id}`}
                      className="mt-6 block rounded-full bg-white px-6 py-3 text-center text-sm font-bold text-black transition hover:bg-zinc-300"
                    >
                      View Product ↗
                    </Link>

                  </div>

                </div>
              );
            })}

          </div>
        )}

        {/* BACK TO HOME */}
        <div className="mt-16 text-center">

          <Link
            href="/"
            className="inline-block rounded-full border border-zinc-700 px-8 py-4 text-sm font-semibold transition hover:border-white hover:bg-white hover:text-black"
          >
            ← Back to Home
          </Link>

        </div>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-zinc-800 bg-zinc-950 px-6 py-10 text-center">

        <h2 className="text-xl font-black tracking-[0.25em]">
          VELORA
        </h2>

        <p className="mt-3 text-sm text-zinc-400">
          Everything you need, in one place.
        </p>

        <p className="mt-5 text-xs text-zinc-500">
          © 2026 VELORA. All rights reserved.
        </p>

      </footer>

    </div>
  );
}
