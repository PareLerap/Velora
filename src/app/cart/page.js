
import Link from "next/link";
import pool from "@/lib/db";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import VeloraNavbar from "@/components/VeloraNavbar";

import {
  updateCartQuantity,
  removeCartItem,
} from "./actions";

import { checkoutCart } from "./checkout-actions";

export const dynamic = "force-dynamic";

// FORMAT HARGA RUPIAH
function formatPrice(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export default async function CartPage({ searchParams }) {
  const user = await getSession();
  const params = (await searchParams) || {};

  // VALIDASI LOGIN DAN ROLE
  if (!user) {
    redirect("/login");
  }

  if (user.role !== "buyer") {
    redirect("/");
  }

  // =====================================
  // AMBIL DATA KERANJANG
  // =====================================

  const result = await pool.query(
    `SELECT
       ci.id AS item_id,
       ci.product_id,
       ci.quantity,
       p.product_name,
       p.image_url,
       p.price,
       p.stock,
       p.status,
       s.status AS store_status
     FROM carts c
     JOIN cart_items ci
       ON ci.cart_id = c.id
     JOIN products p
       ON p.id = ci.product_id
     JOIN stores s
       ON s.id = p.store_id
     WHERE c.user_id = $1
     ORDER BY ci.id DESC`,
    [user.id]
  );

  const items = result.rows;

  // =====================================
  // HITUNG TOTAL HARGA DAN QUANTITY
  // =====================================

  const total = items.reduce(
    (sum, item) =>
      sum + Number(item.price) * Number(item.quantity),
    0
  );

  const totalQuantity = items.reduce(
    (sum, item) =>
      sum + Number(item.quantity),
    0
  );

  // PERIKSA KELAYAKAN CHECKOUT
  const canCheckout =
    items.length > 0 &&
    items.every((item) => {
      const quantity = Number(item.quantity);
      const stock = Number(item.stock);
      const price = Number(item.price);

      return (
        item.status === "active" &&
        item.store_status === "approved" &&
        Number.isInteger(quantity) &&
        quantity >= 1 &&
        quantity <= 10 &&
        stock >= quantity &&
        Number.isFinite(price) &&
        price > 0
      );
    });

  // PESAN ERROR
  const errorMessages = {
    quantity: "Jumlah produk tidak valid.",
    stock: "Stok produk tidak mencukupi.",
    limit: "Maksimal 10 unit per produk.",
    unavailable: "Produk sedang tidak tersedia.",
    empty: "Keranjang masih kosong.",
  };

  return (
    <div className="min-h-screen bg-black text-white">

      {/* NAVBAR */}
      <VeloraNavbar user={user} />

      <main className="mx-auto max-w-6xl px-6 py-16">

        {/* HEADER */}
        <p className="mb-4 text-xs tracking-[0.3em] text-zinc-400">
          VELORA SHOPPING EXPERIENCE
        </p>

        <h1 className="text-4xl font-black md:text-6xl">
          Shopping Cart.
        </h1>

        <p className="mt-4 text-zinc-400">
          Kelola produk pilihanmu sebelum melakukan checkout.
        </p>

        {/* ================================= */}
        {/* NOTIFIKASI */}
        {/* ================================= */}

        {params.added === "1" && (
          <div
            role="status"
            className="mt-8 rounded-2xl border border-green-700 bg-green-950/40 p-5 text-green-400"
          >
            ✓ Produk berhasil ditambahkan ke keranjang!
          </div>
        )}

        {params.updated === "1" && (
          <div
            role="status"
            className="mt-8 rounded-2xl border border-green-700 bg-green-950/40 p-5 text-green-400"
          >
            ✓ Jumlah produk berhasil diperbarui!
          </div>
        )}

        {params.removed === "1" && (
          <div
            role="status"
            className="mt-8 rounded-2xl border border-green-700 bg-green-950/40 p-5 text-green-400"
          >
            ✓ Produk berhasil dihapus dari keranjang!
          </div>
        )}

        {params.error && (
          <div
            role="alert"
            className="mt-8 rounded-2xl border border-red-700 bg-red-950/40 p-5 text-red-400"
          >
            {errorMessages[params.error] ||
              "Terjadi kesalahan pada keranjang."}
          </div>
        )}

        {/* ================================= */}
        {/* KERANJANG KOSONG */}
        {/* ================================= */}

        {items.length === 0 ? (

          <div className="mt-12 rounded-3xl border border-zinc-800 bg-zinc-900 p-12 text-center">

            <div className="mb-6 text-6xl">
              🛒
            </div>

            <h2 className="text-2xl font-bold">
              Your Cart is Empty.
            </h2>

            <p className="mt-4 text-zinc-400">
              Belum ada produk dalam keranjangmu.
            </p>

            <Link
              href="/products"
              className="mt-8 inline-block rounded-full bg-white px-8 py-4 font-bold text-black transition hover:bg-zinc-300"
            >
              Explore Products ↗
            </Link>

          </div>

        ) : (

          <div className="mt-12 grid gap-8 lg:grid-cols-3">

            {/* ================================= */}
            {/* DAFTAR PRODUK */}
            {/* ================================= */}

            <div className="space-y-5 lg:col-span-2">

              {items.map((item) => {
                const quantity = Number(item.quantity);
                const stock = Number(item.stock);

                const subtotal =
                  Number(item.price) * quantity;

                const unavailable =
                  item.status !== "active" ||
                  item.store_status !== "approved" ||
                  stock < quantity;

                const canIncrease =
                  !unavailable &&
                  quantity < 10 &&
                  quantity < stock;

                return (
                  <div
                    key={item.item_id}
                    className="flex flex-col gap-5 rounded-3xl border border-zinc-800 bg-zinc-900 p-5 transition hover:border-zinc-600 sm:flex-row"
                  >

                    {/* PRODUCT IMAGE */}
                    <div className="flex h-36 w-36 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-zinc-800">

                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.product_name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-6xl font-black text-zinc-600">
                          V
                        </span>
                      )}

                    </div>

                    {/* PRODUCT INFORMATION */}
                    <div className="flex-1">

                      <Link
                        href={`/products/${item.product_id}`}
                        className="text-xl font-bold transition hover:underline"
                      >
                        {item.product_name}
                      </Link>

                      <p className="mt-3 text-lg text-zinc-300">
                        {formatPrice(item.price)}
                      </p>

                      <p className="mt-2 text-xs text-zinc-500">
                        Stok tersedia: {stock}
                      </p>

                      {/* QUANTITY CONTROLS */}
                      <div className="mt-5">

                        <p className="mb-3 text-sm text-zinc-400">
                          Quantity
                        </p>

                        <form
                          action={updateCartQuantity}
                          className="flex items-center gap-3"
                        >

                          <input
                            type="hidden"
                            name="item_id"
                            value={item.item_id}
                          />

                          {/* KURANGI */}
                          <button
                            type="submit"
                            name="quantity"
                            value={quantity - 1}
                            disabled={quantity <= 1}
                            aria-label="Kurangi jumlah"
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-600 text-lg font-bold transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-30"
                          >
                            −
                          </button>

                          <span className="min-w-8 text-center font-bold">
                            {quantity}
                          </span>

                          {/* TAMBAH */}
                          <button
                            type="submit"
                            name="quantity"
                            value={quantity + 1}
                            disabled={!canIncrease}
                            aria-label="Tambah jumlah"
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-600 text-lg font-bold transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-30"
                          >
                            +
                          </button>

                        </form>

                      </div>

                      {/* SUBTOTAL */}
                      <div className="mt-5 border-t border-zinc-800 pt-5">

                        <p className="text-xs text-zinc-500">
                          Subtotal
                        </p>

                        <p className="mt-2 text-xl font-black">
                          {formatPrice(subtotal)}
                        </p>

                      </div>

                      {/* STOCK WARNING */}
                      {unavailable && (
                        <p className="mt-3 text-sm text-red-400">
                          Produk tidak tersedia atau stok tidak mencukupi.
                        </p>
                      )}

                      {/* DELETE BUTTON */}
                      <form
                        action={removeCartItem}
                        className="mt-5"
                      >

                        <input
                          type="hidden"
                          name="item_id"
                          value={item.item_id}
                        />

                        <button
                          type="submit"
                          className="rounded-full border border-red-500/40 px-5 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
                        >
                          🗑 Remove Product
                        </button>

                      </form>

                    </div>

                  </div>
                );
              })}

            </div>

            {/* ================================= */}
            {/* ORDER SUMMARY */}
            {/* ================================= */}

            <div className="h-fit rounded-3xl border border-zinc-800 bg-zinc-900 p-7 lg:sticky lg:top-24">

              <h2 className="text-2xl font-bold">
                Order Summary.
              </h2>

              <p className="mt-3 text-sm text-zinc-400">
                Ringkasan belanja kamu
              </p>

              {/* TOTAL ITEMS */}
              <div className="mt-8 flex justify-between text-zinc-400">
                <span>Total Items</span>
                <span>{totalQuantity}</span>
              </div>

              {/* TOTAL PRODUK BERBEDA */}
              <div className="mt-5 flex justify-between text-zinc-400">
                <span>Products</span>
                <span>{items.length}</span>
              </div>

              {/* TOTAL PRICE */}
              <div className="mt-6 border-t border-zinc-700 pt-6">

                <div className="flex items-center justify-between gap-3">

                  <span className="font-bold">
                    Total
                  </span>

                  <span className="text-xl font-black">
                    {formatPrice(total)}
                  </span>

                </div>

              </div>

              <p className="mt-5 text-xs leading-relaxed text-zinc-500">
                Harga dan stok akan diperiksa kembali
                sebelum pesanan dibuat.
              </p>

              {/* ================================= */}
              {/* CHECKOUT CART */}
              {/* ================================= */}

              <form
                action={checkoutCart}
                className="mt-8"
              >

                <button
                  type="submit"
                  disabled={!canCheckout}
                  className="w-full rounded-full bg-white px-6 py-4 text-center font-bold text-black transition-all duration-300 hover:bg-zinc-300 active:scale-95 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
                >
                  Checkout Cart ↗
                </button>

              </form>

              {!canCheckout && (
                <p className="mt-3 text-center text-xs text-red-400">
                  Periksa stok atau hapus produk yang tidak tersedia.
                </p>
              )}

              {/* CONTINUE SHOPPING */}
              <Link
                href="/products"
                className="mt-4 block rounded-full border border-zinc-600 px-6 py-4 text-center font-bold transition hover:border-white hover:bg-white hover:text-black"
              >
                Continue Shopping ↗
              </Link>

              <p className="mt-6 text-center text-xs text-zinc-500">
                VELORA — Everything you need, in one place.
              </p>

            </div>

          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="mt-20 border-t border-zinc-800 bg-zinc-950 px-6 py-10 text-center">

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
