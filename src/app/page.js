
import { getProducts } from "@/queries/products";

export const dynamic = "force-dynamic";

export default async function Home({ searchParams }) {
  const params = await searchParams;
  const search =
    typeof params?.search === "string" ? params.search : "";

  const products = await getProducts(search);

  return (
    <div className="min-h-screen bg-black text-white">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/80 px-4 py-4 backdrop-blur-xl md:px-12">

        <div className="mx-auto flex max-w-7xl items-center justify-between">

          {/* LOGO */}
          <a
            href="/"
            className="text-xl font-black tracking-[0.25em] transition-opacity hover:opacity-60 md:text-2xl"
          >
            VELORA
          </a>

          {/* NAVIGATION */}
          <div className="hidden items-center gap-10 md:flex">

            <a href="/" className="text-sm font-medium transition-colors hover:text-gray-400">
              Home
            </a>

            <a href="#produk" className="text-sm font-medium transition-colors hover:text-gray-400">
              Produk
            </a>

            <a href="#kategori" className="text-sm font-medium transition-colors hover:text-gray-400">
              Kategori
            </a>

          </div>

          {/* AUTH BUTTON */}
          <div className="flex items-center gap-3 md:gap-5">

            <a
              href="/login"
              className="text-sm font-medium transition-colors hover:text-gray-400"
            >
              Login
            </a>

            <a
              href="/register"
              className="rounded-full bg-white px-4 py-3 text-sm font-semibold text-black transition-all duration-300 hover:scale-105 hover:bg-zinc-300 active:scale-95 md:px-5"
            >
              Daftar ↗
            </a>

          </div>

        </div>

      </nav>

      {/* HERO SECTION */}
      <section className="relative flex min-h-[80vh] items-center overflow-hidden bg-black px-8 py-24 text-white md:px-20">

        {/* DEKORASI BACKGROUND */}
        <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-white/10 blur-3xl" />

        <div className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-white/5 blur-3xl" />

        <div className="relative z-10 grid w-full items-center gap-16 lg:grid-cols-2">

          {/* HERO TEXT */}
          <div className="animate-fade-up">

            <p className="mb-6 text-xs tracking-[0.5em] text-gray-400">
              THE FUTURE OF SHOPPING
            </p>

            <h1 className="text-5xl font-black leading-none tracking-tighter md:text-7xl">
              Everything
              <br />
              You Need.
              <br />
              <span className="text-gray-500">
                In One Place.
              </span>
            </h1>

            <p className="mt-8 max-w-md leading-relaxed text-gray-400">
              Discover a better way to shop.
              Explore curated products and find everything
              you need, only at VELORA.
            </p>

            <a
              href="#produk"
              className="mt-10 inline-flex items-center gap-5 rounded-full bg-white px-8 py-4 font-semibold text-black transition-all duration-300 hover:scale-105 hover:bg-gray-200 motion-reduce:transition-none"
            >
              Explore Products
              <span>↗</span>
            </a>

          </div>

          {/* FLOATING OBJECT */}
          <div className="flex items-center justify-center">

            <div className="animate-float flex h-64 w-64 items-center justify-center rounded-full border border-white/20 bg-gradient-to-br from-zinc-700 to-black shadow-2xl md:h-96 md:w-96">

              <span className="text-8xl font-black md:text-[150px]">
                V
              </span>

            </div>

          </div>

        </div>
      </section>

      {/* KATEGORI */}
      <section
        id="kategori"
        className="scroll-mt-24 border-t border-white/10 bg-black px-6 py-20 md:px-16"
      >

        <p className="mb-3 text-xs tracking-[0.3em] text-zinc-400">
          EXPLORE COLLECTIONS
        </p>

        <h2 className="mb-10 text-4xl font-black tracking-tight">
          Shop by Category.
        </h2>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">

          {[
            "Elektronik",
            "Fashion",
            "Makanan",
            "Kecantikan",
            "Rumah Tangga",
          ].map((kategori, index) => (

            <a
              key={kategori}
              href="#produk"
              className="group relative flex h-48 flex-col justify-between overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-4 transition-all duration-500 hover:-translate-y-2 hover:border-white hover:bg-white hover:text-black motion-reduce:transition-none md:p-6"
            >

              <span className="text-sm text-zinc-400 group-hover:text-zinc-600">
                0{index + 1}
              </span>

              <span className="absolute right-5 top-4 text-2xl transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1">
                ↗
              </span>

              <h3 className="break-words text-lg font-bold md:text-xl">
                {kategori}
              </h3>

            </a>

          ))}

        </div>
      </section>

      {/* PRODUK */}
      <section
        id="produk"
        className="scroll-mt-24 border-t border-white/10 bg-black px-6 py-20 md:px-16"
      >

        {/* SEARCH BAR */}
        <form
          action="/#produk"
          method="GET"
          className="mb-12 flex gap-3"
        >

          <input
            type="search"
            name="search"
            aria-label="Cari produk"
            defaultValue={search}
            placeholder="Search your favorite products..."
            className="min-w-0 flex-1 rounded-full border border-zinc-700 bg-zinc-900 px-5 py-4 text-white outline-none transition-all placeholder:text-zinc-500 focus:border-white md:px-6"
          />

          <button
            type="submit"
            className="rounded-full bg-white px-5 py-4 font-semibold text-black transition-all hover:bg-zinc-300 active:scale-95 md:px-8"
          >
            Search
          </button>

        </form>

        <p className="mb-3 text-xs tracking-[0.3em] text-zinc-400">
          DISCOVER YOUR NEXT FAVORITE
        </p>

        <div className="mb-10 flex items-center justify-between gap-4">

          <h2 className="text-3xl font-black tracking-tight md:text-4xl">
            Featured Products.
          </h2>

          <a
            href="/products"
            className="shrink-0 text-sm text-zinc-400 transition-colors hover:text-white"
          >
            Lihat Semua ↗
          </a>

        </div>

        {/* HASIL PENCARIAN */}
        {search && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">

            <p className="text-sm text-zinc-400">
              Hasil pencarian "{search}" — {products.length} produk
            </p>

            <a
              href="/#produk"
              className="text-sm text-white underline hover:text-zinc-400"
            >
              Reset pencarian
            </a>

          </div>
        )}

        {/* PRODUCT GRID */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

          {products.map((product) => (

            <div
              key={product.id}
              className="group overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 transition-all duration-500 hover:-translate-y-2 hover:border-zinc-500 hover:shadow-xl hover:shadow-white/5"
            >

              {/* GAMBAR PRODUK */}
              <div className="relative flex h-64 items-center justify-center overflow-hidden bg-zinc-800">

                <span className="absolute left-4 top-4 z-10 rounded-full bg-white px-3 py-1 text-xs font-medium text-black">
                  {product.category_name}
                </span>

                {product.image_url ? (

                  <img
                    src={product.image_url}
                    alt={product.product_name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                ) : (

                  <span className="text-6xl font-black text-zinc-600">
                    V
                  </span>

                )}

              </div>

              {/* INFORMASI PRODUK */}
              <div className="p-5">

                <p className="text-xs text-zinc-400">
                  {product.store_name}
                </p>

                <h3 className="mt-2 text-lg font-bold text-white">
                  {product.product_name}
                </h3>

                <p className="mt-2 text-sm text-zinc-400">
                  Stok: {product.stock}
                </p>

                <p className="mt-4 text-xl font-bold text-white">
                  {Number(product.price).toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    maximumFractionDigits: 0,
                  })}
                </p>

                <a
                  href={`/products/${product.id}`}
                  className="mt-5 block rounded-full bg-white py-3 text-center text-sm font-semibold text-black transition-all duration-300 hover:bg-zinc-300 active:scale-95"
                >
                  View Product ↗
                </a>

              </div>

            </div>

          ))}

        </div>

        {/* PRODUK KOSONG */}
        {products.length === 0 && (

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 py-16 text-center">

            <p className="text-2xl font-bold text-white">
              {search ? "Product Not Found." : "No Products Available."}
            </p>

            <p className="mt-3 text-sm text-zinc-400">
              {search
                ? "Coba gunakan kata kunci yang berbeda."
                : "Belum ada produk yang tersedia."}
            </p>

            {search && (
              <a
                href="/#produk"
                className="mt-6 inline-block rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-all hover:bg-zinc-300"
              >
                Show All Products
              </a>
            )}

          </div>

        )}

      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-zinc-950 px-8 py-12 text-center">

        <h2 className="text-2xl font-black tracking-[0.25em] text-white">
          VELORA
        </h2>

        <p className="mt-3 text-sm text-zinc-400">
          Everything you need, in one place.
        </p>

        <p className="mt-6 text-xs text-zinc-500">
          © 2026 VELORA. All rights reserved.
        </p>

      </footer>

    </div>
  );
}
