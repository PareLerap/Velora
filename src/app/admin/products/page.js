
import Link from "next/link";
import Image from "next/image";
import { requireRole } from "@/lib/authorization";
import { getAdminProducts } from "@/queries/products";
import { removeAdminProduct } from "@/app/admin/actions";
import VeloraNavbar from "@/components/VeloraNavbar";

export const dynamic = "force-dynamic";

export default async function ManageProductsPage({
  searchParams,
}) {
  const admin = await requireRole("admin");

  const products = await getAdminProducts();
  const params = await searchParams;

  const search =
    typeof params?.search === "string"
      ? params.search.trim()
      : "";

  const status = ["active", "inactive"].includes(params?.status)
    ? params.status
    : "all";

  // STATISTIK PRODUK
  const statistics = [
    {
      title: "Total Products",
      count: products.length,
    },
    {
      title: "Active Products",
      count: products.filter(
        (product) => product.status === "active"
      ).length,
    },
    {
      title: "Inactive Products",
      count: products.filter(
        (product) => product.status === "inactive"
      ).length,
    },
  ];

  // SEARCH DAN FILTER
  const filteredProducts = products.filter((product) => {
    const keyword = search.toLowerCase();

    const matchesSearch = [
      product.product_name,
      product.store_name,
      product.category_name,
      product.seller_name,
    ].some((value) =>
      String(value || "").toLowerCase().includes(keyword)
    );

    const matchesStatus =
      status === "all" || product.status === status;

    return matchesSearch && matchesStatus;
  });

  // FORMAT HARGA
  const formatPrice = (price) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(Number(price));

  return (
    <div className="min-h-screen bg-black text-white">

      {/* NAVBAR BERSAMA - 80PX */}
      <VeloraNavbar user={admin} />

      {/* MAIN CONTENT */}
      <main className="mx-auto max-w-7xl px-6 py-12 md:px-12">

        {/* HEADER */}
        <div className="animate-fade-up">

          <p className="mb-4 text-xs tracking-[0.3em] text-zinc-400">
            PRODUCT MANAGEMENT
          </p>

          <h1 className="text-4xl font-black tracking-tight md:text-6xl">
            Manage Products.
          </h1>

          <p className="mt-4 text-zinc-400">
            Monitor and moderate all marketplace products.
          </p>

          <Link
            href="/admin"
            className="mt-6 inline-block text-sm text-zinc-400 transition hover:text-white"
          >
            ← Back to Admin Dashboard
          </Link>

        </div>

        {/* SUCCESS MESSAGE */}
        {params?.success === "removed" && (
          <div
            role="status"
            className="mt-8 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-400"
          >
            ✓ Produk berhasil dinonaktifkan dari marketplace.
          </div>
        )}

        {/* ERROR MESSAGE */}
        {params?.error && (
          <div
            role="alert"
            className="mt-8 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400"
          >
            {params.error === "not-removed"
              ? "Produk tidak ditemukan atau sudah dinonaktifkan."
              : params.error === "invalid"
              ? "ID produk tidak valid."
              : "Gagal memproses data produk."}
          </div>
        )}

        {/* STATISTICS */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">

          {statistics.map((item, index) => (
            <div
              key={item.title}
              className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-zinc-500"
            >

              <p className="text-xs text-zinc-500">
                0{index + 1}
              </p>

              <p className="mt-4 text-sm text-zinc-400">
                {item.title}
              </p>

              <h2 className="mt-3 text-4xl font-black">
                {item.count}
              </h2>

            </div>
          ))}

        </div>

        {/* SEARCH DAN FILTER */}
        <form
          action="/admin/products"
          method="GET"
          className="mt-10 flex flex-col gap-3 md:flex-row"
        >

          <input
            type="search"
            name="search"
            aria-label="Cari produk"
            defaultValue={search}
            placeholder="Search product, category or store..."
            className="min-w-0 flex-1 rounded-full border border-zinc-700 bg-zinc-900 px-6 py-4 text-sm outline-none transition-all focus:border-white"
          />

          <select
            name="status"
            aria-label="Filter status produk"
            defaultValue={status}
            className="rounded-full border border-zinc-700 bg-zinc-900 px-6 py-4 text-sm text-white outline-none focus:border-white"
          >

            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>

          </select>

          <button
            type="submit"
            className="rounded-full bg-white px-8 py-4 text-sm font-bold text-black transition-all hover:bg-zinc-300 active:scale-95"
          >
            Search
          </button>

          <Link
            href="/admin/products"
            className="rounded-full border border-zinc-700 px-6 py-4 text-center text-sm transition-all hover:bg-zinc-800"
          >
            Reset
          </Link>

        </form>

        {/* PRODUCT LIST */}
        <section className="mt-12">

          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">

            <h2 className="text-2xl font-black">
              All Products.
            </h2>

            <p className="text-sm text-zinc-400">
              {filteredProducts.length} products
            </p>

          </div>

          <div className="grid items-start gap-5 lg:grid-cols-2">

            {filteredProducts.map((product) => (
              <article
                key={product.id}
                className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 p-6 transition-all duration-300 hover:border-zinc-500"
              >

                {/* PRODUCT INFORMATION */}
                <div className="flex flex-col gap-5 sm:flex-row">

                  {/* PRODUCT IMAGE */}
                  <div className="relative flex aspect-square w-full shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-zinc-800 bg-black sm:w-32">

                    {product.image_url?.startsWith("/images/") ? (
                      <Image
                        src={product.image_url}
                        alt={product.product_name}
                        fill
                        sizes="(max-width: 640px) 100vw, 128px"
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-4xl text-zinc-600">
                        ◇
                      </span>
                    )}

                  </div>

                  {/* PRODUCT DETAIL */}
                  <div className="min-w-0 flex-1 break-words">

                    <span className="text-xs uppercase tracking-widest text-zinc-500">
                      {product.category_name}
                    </span>

                    <h3 className="mt-2 text-xl font-bold">
                      {product.product_name}
                    </h3>

                    <p className="mt-2 text-sm text-zinc-400">
                      {product.store_name}
                    </p>

                    <p className="mt-1 text-xs text-zinc-500">
                      Seller: {product.seller_name}
                    </p>

                    <p className="mt-4 text-lg font-black">
                      {formatPrice(product.price)}
                    </p>

                    <p className="mt-2 text-sm text-zinc-400">
                      Stock: {product.stock}
                    </p>

                  </div>

                </div>

                {/* PRODUCT STATUS */}
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">

                  <span className="text-xs text-zinc-500">
                    Product ID: {product.id}
                  </span>

                  <span
                    className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase ${
                      product.status === "active"
                        ? "border-green-500/30 bg-green-500/10 text-green-400"
                        : "border-red-500/30 bg-red-500/10 text-red-400"
                    }`}
                  >
                    ● {product.status}
                  </span>

                </div>

                {/* PRODUCT DESCRIPTION */}
                <details className="mt-5 rounded-xl border border-zinc-800 p-4">

                  <summary className="cursor-pointer text-sm font-semibold">
                    View Description
                  </summary>

                  <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-relaxed text-zinc-400">
                    {product.description ||
                      "No description available."}
                  </p>

                </details>

                {/* PRODUCT ACTIONS */}
                <div className="mt-5 space-y-3 border-t border-zinc-800 pt-5">

                  {product.status === "active" ? (
                    <>

                      {/* VIEW PRODUCT */}
                      <Link
                        href={`/products/${product.id}`}
                        className="block rounded-full border border-zinc-700 px-5 py-3 text-center text-sm font-semibold transition-all hover:bg-white hover:text-black"
                      >
                        View Product ↗
                      </Link>

                      {/* REMOVE PRODUCT */}
                      <details className="rounded-xl border border-red-500/30 p-4">

                        <summary className="cursor-pointer list-none text-sm font-semibold text-red-400">
                          Remove Product
                        </summary>

                        <p className="mt-4 text-sm leading-relaxed text-zinc-400">
                          Yakin ingin menonaktifkan produk{" "}
                          <strong className="text-white">
                            {product.product_name}
                          </strong>
                          ?
                        </p>

                        <p className="mt-3 text-xs text-red-400">
                          Produk tidak akan tampil pada katalog marketplace.
                          Riwayat transaksi tetap tersimpan.
                        </p>

                        {/* CONFIRM REMOVE */}
                        <form
                          action={removeAdminProduct}
                          className="mt-5"
                        >

                          <input
                            type="hidden"
                            name="productId"
                            value={product.id}
                          />

                          <button
                            type="submit"
                            className="w-full rounded-full bg-red-600 py-3 text-sm font-bold text-white transition-all hover:bg-red-700 active:scale-95"
                          >
                            Confirm Remove
                          </button>

                        </form>

                      </details>

                    </>
                  ) : (

                    <div className="rounded-xl border border-zinc-800 bg-black/40 p-4 text-xs text-zinc-500">
                      Product Inactive — Not visible in marketplace.
                    </div>

                  )}

                </div>

              </article>
            ))}

          </div>

          {/* EMPTY STATE */}
          {filteredProducts.length === 0 && (
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-12 text-center">

              <h3 className="text-xl font-bold">
                No Products Found.
              </h3>

              <p className="mt-3 text-sm text-zinc-400">
                Tidak ada produk yang sesuai dengan pencarian.
              </p>

              <Link
                href="/admin/products"
                className="mt-6 inline-block rounded-full bg-white px-6 py-3 text-sm font-semibold text-black"
              >
                Show All Products
              </Link>

            </div>
          )}

        </section>

      </main>

      {/* FOOTER */}
      <footer className="mt-16 border-t border-zinc-800 py-8 text-center text-xs text-zinc-500">
        © 2026 VELORA. Administrator Control Center.
      </footer>

    </div>
  );
}
