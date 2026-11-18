
import { getProductById } from "@/queries/products";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ProductDetail({ params }) {
  const { id } = await params;

  const productId = Number(id);

  if (
    !/^\d+$/.test(id) ||
    !Number.isInteger(productId) ||
    productId <= 0 ||
    productId > 2147483647
  ) {
    notFound();
  }

  const product = await getProductById(productId);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black text-white">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/80 px-6 py-5 backdrop-blur-xl md:px-16">

        <div className="flex items-center justify-between">

          <a href="/" className="text-2xl font-black tracking-[0.25em]">
            VELORA
          </a>

          <a
            href="/#produk"
            className="text-sm text-zinc-400 transition-colors hover:text-white"
          >
            ← Back to Shopping
          </a>

        </div>

      </nav>

      {/* PRODUCT DETAIL */}
      <main className="mx-auto max-w-7xl px-6 py-16 md:px-16">

        <p className="mb-10 text-sm text-zinc-500">
          Home / {product.category_name} / {product.product_name}
        </p>

        <div className="grid items-start gap-12 lg:grid-cols-2">

          {/* PRODUCT IMAGE */}
          <div className="group relative flex aspect-square items-center justify-center overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900">

            <span className="absolute left-5 top-5 z-10 rounded-full bg-white px-4 py-2 text-xs font-semibold text-black">
              {product.category_name}
            </span>

            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.product_name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <span className="text-9xl font-black text-zinc-700">
                V
              </span>
            )}

          </div>

          {/* PRODUCT INFORMATION */}
          <div className="animate-fade-up">

            <p className="mb-4 text-xs tracking-[0.3em] text-zinc-400">
              VELORA COLLECTION
            </p>

            <h1 className="text-4xl font-black tracking-tight md:text-6xl">
              {product.product_name}
            </h1>

            <p className="mt-4 text-sm text-zinc-400">
              Sold by {product.store_name}
            </p>

            <p className="mt-8 text-3xl font-bold">
              {Number(product.price).toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
                maximumFractionDigits: 0,
              })}
            </p>

            <div className="mt-6 inline-flex rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-300">
              {product.stock > 0
                ? `In Stock — ${product.stock} tersedia`
                : "Out of Stock"}
            </div>

            {/* DESCRIPTION */}
            <div className="mt-8 border-t border-zinc-800 pt-8">

              <h2 className="mb-4 text-lg font-bold">
                Product Description
              </h2>

              <p className="leading-relaxed text-zinc-400">
                {product.description || "Belum ada deskripsi produk."}
              </p>

            </div>

            {/* LOGIN BUTTON */}
            <a
              href="/login"
              className="mt-10 block rounded-full bg-white px-8 py-4 text-center font-bold text-black transition-all duration-300 hover:bg-zinc-300 active:scale-95"
            >
              Login to Shop ↗
            </a>

            <p className="mt-4 text-center text-xs text-zinc-500">
              Silakan login untuk melakukan pembelian.
            </p>

          </div>

        </div>

        {/* PRODUCT REVIEWS */}
        <section className="mt-20 border-t border-zinc-800 pt-12">

          <h2 className="text-3xl font-black">
            Customer Reviews.
          </h2>

          <div className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-900 p-10 text-center">

            <p className="text-zinc-400">
              Fitur ulasan belum tersedia.
            </p>

          </div>

        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-zinc-950 px-6 py-10 text-center">

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
