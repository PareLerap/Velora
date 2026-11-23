
import Link from "next/link";
import pool from "@/lib/db";
import { getProductById } from "@/queries/products";
import { getSession } from "@/lib/auth";
import { buyNow } from "./actions";
import { addToCart } from "@/app/cart/actions";
import { submitReview } from "./review-actions";
import { notFound } from "next/navigation";
import VeloraNavbar from "@/components/VeloraNavbar";

export const dynamic = "force-dynamic";

// FORMAT RUPIAH
function formatPrice(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

// TAMPILKAN BINTANG
function ratingStars(value) {
  const rating = Math.max(
    0,
    Math.min(5, Math.round(Number(value) || 0))
  );

  return "★".repeat(rating) + "☆".repeat(5 - rating);
}

export default async function ProductDetail({
  params,
  searchParams,
}) {
  const { id } = await params;
  const query = (await searchParams) || {};
  const productId = Number(id);

  // VALIDASI ID
  if (
    !/^\d+$/.test(id) ||
    !Number.isInteger(productId) ||
    productId <= 0 ||
    productId > 2147483647
  ) {
    notFound();
  }

  // DATA PRODUK DAN USER
  const product = await getProductById(productId);
  const user = await getSession();

  if (!product) {
    notFound();
  }

  const isBuyer = user?.role === "buyer";
  const isAvailable = Number(product.stock) > 0;

  // CEK PESANAN BERHASIL
  const orderId = Number(query.order_id);
  let orderSuccessful = false;

  if (
    isBuyer &&
    Number.isSafeInteger(orderId) &&
    orderId > 0
  ) {
    const result = await pool.query(
      `SELECT o.id
       FROM orders o
       JOIN order_items oi ON oi.order_id = o.id
       WHERE o.id = $1
         AND o.user_id = $2
         AND oi.product_id = $3
       LIMIT 1`,
      [orderId, user.id, productId]
    );

    orderSuccessful = result.rows.length > 0;
  }

  const checkoutError =
    typeof query.checkout_error === "string"
      ? query.checkout_error
      : null;

  // ===================================
  // REVIEW DAN RATING
  // ===================================

  const reviewsResult = await pool.query(
    `SELECT id, rating, comment, created_at
     FROM reviews
     WHERE product_id = $1
     ORDER BY created_at DESC NULLS LAST, id DESC`,
    [productId]
  );

  const reviews = reviewsResult.rows;

  const averageRating = reviews.length
    ? (
        reviews.reduce(
          (total, review) =>
            total + Number(review.rating),
          0
        ) / reviews.length
      ).toFixed(1)
    : "0.0";

  // CEK HAK REVIEW
  let canReview = false;
  let hasReviewed = false;

  if (isBuyer) {
    const [purchaseResult, existingReview] =
      await Promise.all([
        pool.query(
          `SELECT 1
           FROM orders o
           JOIN order_items oi
             ON oi.order_id = o.id
           WHERE o.user_id = $1
             AND oi.product_id = $2
             AND o.status = 'completed'
           LIMIT 1`,
          [user.id, productId]
        ),

        pool.query(
          `SELECT 1
           FROM reviews
           WHERE user_id = $1
             AND product_id = $2
           LIMIT 1`,
          [user.id, productId]
        ),
      ]);

    canReview = purchaseResult.rowCount > 0;
    hasReviewed = existingReview.rowCount > 0;
  }

  // ===================================
  // HALAMAN DETAIL PRODUK
  // ===================================

  return (
    <div className="min-h-screen bg-black text-white">

      {/* NAVBAR */}
      <VeloraNavbar user={user} />

      <main className="mx-auto max-w-7xl px-6 py-16 md:px-16">

        {/* BREADCRUMB */}
        <p className="mb-10 text-sm text-zinc-500">
          <Link href="/" className="hover:text-white">
            Home
          </Link>
          {" / "}
          {product.category_name}
          {" / "}
          {product.product_name}
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

            {/* RATING PRODUK */}
            <div className="mt-5 flex items-center gap-3">

              <span className="text-lg text-yellow-400">
                {ratingStars(averageRating)}
              </span>

              <span className="text-sm text-zinc-400">
                {reviews.length > 0
                  ? `${averageRating} (${reviews.length} ulasan)`
                  : "Belum ada ulasan"}
              </span>

            </div>

            {/* PRICE */}
            <p className="mt-8 text-3xl font-bold">
              {formatPrice(product.price)}
            </p>

            {/* STOCK */}
            <div className="mt-6 inline-flex rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-300">
              {isAvailable
                ? `In Stock — ${product.stock} tersedia`
                : "Out of Stock"}
            </div>

            {/* DESCRIPTION */}
            <div className="mt-8 border-t border-zinc-800 pt-8">

              <h2 className="mb-4 text-lg font-bold">
                Product Description
              </h2>

              <p className="leading-relaxed text-zinc-400">
                {product.description ||
                  "Belum ada deskripsi produk."}
              </p>

            </div>

            {/* ================================= */}
            {/* BUY NOW DAN SHOPPING CART */}
            {/* ================================= */}

            <div className="mt-10">

              {!user ? (

                /* BELUM LOGIN */
                <>
                  <Link
                    href="/login"
                    className="block rounded-full bg-white px-8 py-4 text-center font-bold text-black transition hover:bg-zinc-300"
                  >
                    Login to Shop ↗
                  </Link>

                  <p className="mt-4 text-center text-xs text-zinc-500">
                    Silakan login untuk melakukan pembelian.
                  </p>
                </>

              ) : isBuyer ? (

                /* BUYER */
                <>

                  {/* BUYER INFORMATION */}
                  <div className="mb-6 rounded-2xl border border-green-500/30 bg-green-500/10 p-5">

                    <p className="text-sm font-bold text-green-400">
                      ✓ Buyer Account Active
                    </p>

                    <p className="mt-2 text-sm text-zinc-300">
                      Selamat datang, {user.name}!
                    </p>

                    <p className="mt-1 text-xs text-zinc-400">
                      Kamu bisa melakukan pembelian produk.
                    </p>

                  </div>

                  {/* ORDER SUCCESS */}
                  {orderSuccessful && (
                    <div
                      role="status"
                      className="mb-6 rounded-2xl border border-green-500/30 bg-green-500/10 p-6"
                    >

                      <h3 className="text-lg font-bold text-green-400">
                        ✓ Order Berhasil!
                      </h3>

                      <p className="mt-3 text-sm text-zinc-300">
                        Pesanan #{orderId} berhasil dibuat.
                      </p>

                      <p className="mt-2 text-sm text-zinc-400">
                        Pesanan sudah tersimpan dan menunggu
                        diproses oleh Seller.
                      </p>

                      <Link
                        href="/orders"
                        className="mt-5 inline-block rounded-full border border-green-500/40 px-5 py-3 text-sm font-bold text-green-400 transition hover:bg-green-500/10"
                      >
                        View My Orders ↗
                      </Link>

                    </div>
                  )}

                  {/* CHECKOUT ERROR */}
                  {checkoutError && (
                    <div
                      role="alert"
                      className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-5"
                    >

                      <p className="text-sm text-red-400">
                        {checkoutError === "stock"
                          ? "Stok produk tidak mencukupi."
                          : "Produk tidak tersedia untuk pembelian."}
                      </p>

                    </div>
                  )}

                  {/* ================================= */}
                  {/* PRODUK TERSEDIA */}
                  {/* ================================= */}

                  {isAvailable ? (

                    <div className="space-y-4">

                      {/* BUY NOW */}
                      <form
                        action={buyNow}
                        className="space-y-5"
                      >

                        <input
                          type="hidden"
                          name="product_id"
                          value={product.id}
                        />

                        {/* QUANTITY */}
                        <div>

                          <label
                            htmlFor="quantity"
                            className="mb-3 block text-sm font-semibold text-zinc-300"
                          >
                            Quantity
                          </label>

                          <input
                            id="quantity"
                            type="number"
                            name="quantity"
                            min="1"
                            max={Math.min(
                              10,
                              Number(product.stock)
                            )}
                            defaultValue="1"
                            required
                            className="w-28 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-white"
                          />

                          <p className="mt-3 text-xs text-zinc-500">
                            Maksimal 10 unit per transaksi,
                            sesuai stok tersedia.
                          </p>

                        </div>

                        {/* BUY BUTTON */}
                        <button
                          type="submit"
                          className="w-full rounded-full bg-white px-8 py-4 text-center font-bold text-black transition-all duration-300 hover:bg-zinc-300 active:scale-95"
                        >
                          Buy Now ↗
                        </button>

                        <p className="text-center text-xs text-zinc-500">
                          Pesanan akan langsung dibuat setelah
                          menekan Buy Now.
                        </p>

                      </form>

                      {/* ================================= */}
                      {/* ADD TO CART - FITUR BARU */}
                      {/* ================================= */}

                      <form
                        action={addToCart}
                        className="space-y-3"
                      >

                        <input
                          type="hidden"
                          name="product_id"
                          value={product.id}
                        />

                        <input
                          type="hidden"
                          name="quantity"
                          value="1"
                        />

                        <button
                          type="submit"
                          className="flex w-full items-center justify-center gap-3 rounded-full border border-white px-8 py-4 font-bold text-white transition-all duration-300 hover:bg-white hover:text-black active:scale-95"
                        >
                          🛒 Add to Cart
                        </button>

                      </form>

                      {/* VIEW SHOPPING CART */}
                      <Link
                        href="/cart"
                        className="block py-3 text-center text-sm font-medium text-zinc-400 transition hover:text-white hover:underline"
                      >
                        View Shopping Cart ↗
                      </Link>

                      <p className="text-center text-xs text-zinc-500">
                        Beli langsung atau simpan produk
                        ke keranjang untuk dibeli nanti.
                      </p>

                    </div>

                  ) : (

                    /* OUT OF STOCK */
                    <div className="space-y-4">

                      <button
                        type="button"
                        disabled
                        className="w-full cursor-not-allowed rounded-full bg-zinc-700 px-8 py-4 font-bold text-zinc-300"
                      >
                        Out of Stock
                      </button>

                      <p className="text-center text-xs text-zinc-500">
                        Produk sedang tidak tersedia.
                      </p>

                      <Link
                        href="/cart"
                        className="block text-center text-sm text-zinc-400 hover:text-white hover:underline"
                      >
                        View Shopping Cart ↗
                      </Link>

                    </div>
                  )}

                </>

              ) : (

                /* SELLER / ADMIN */
                <div className="rounded-2xl border border-zinc-700 bg-zinc-900 p-6">

                  <p className="text-sm font-bold text-white">
                    Account: {user.role.toUpperCase()}
                  </p>

                  <p className="mt-3 text-sm text-zinc-400">
                    Kamu sedang login sebagai {user.name}.
                    Pembelian hanya tersedia untuk akun Buyer.
                  </p>

                  <Link
                    href={
                      user.role === "admin"
                        ? "/admin"
                        : "/seller"
                    }
                    className="mt-5 inline-block rounded-full bg-white px-6 py-3 text-sm font-bold text-black transition hover:bg-zinc-300"
                  >
                    Back to Dashboard ↗
                  </Link>

                </div>

              )}

            </div>

          </div>

        </div>

        {/* ================================= */}
        {/* CUSTOMER REVIEWS */}
        {/* ================================= */}

        <section className="mt-20 border-t border-zinc-800 pt-12">

          <h2 className="text-3xl font-black">
            Customer Reviews.
          </h2>

          {/* RATING SUMMARY */}
          <div className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-900 p-8">

            <div className="flex flex-wrap items-center gap-5">

              <span className="text-5xl font-black">
                {reviews.length > 0
                  ? averageRating
                  : "—"}
              </span>

              <div>

                <p className="text-xl text-yellow-400">
                  {ratingStars(averageRating)}
                </p>

                <p className="mt-2 text-sm text-zinc-400">
                  {reviews.length} ulasan pelanggan
                </p>

              </div>

            </div>

          </div>

          {/* REVIEW SUCCESS */}
          {query.review_success === "1" && (
            <div
              role="status"
              className="mt-6 rounded-2xl border border-green-500/30 bg-green-500/10 p-5"
            >

              <p className="text-sm text-green-400">
                ✓ Ulasan berhasil dikirim!
              </p>

            </div>
          )}

          {/* REVIEW ERROR */}
          {query.review_error && (
            <div
              role="alert"
              className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-5"
            >

              <p className="text-sm text-red-400">
                {query.review_error === "invalid"
                  ? "Rating atau komentar tidak valid."
                  : "Kamu belum memenuhi syarat atau sudah mengulas produk ini."}
              </p>

            </div>
          )}

          {/* ================================= */}
          {/* FORM REVIEW */}
          {/* ================================= */}

          {isBuyer && canReview && !hasReviewed && (
            <form
              action={submitReview}
              className="mt-8 space-y-6 rounded-3xl border border-zinc-800 bg-zinc-950 p-6 md:p-8"
            >

              <h3 className="text-xl font-bold">
                Beri Ulasan Produk
              </h3>

              <p className="text-sm text-zinc-400">
                Bagikan pengalamanmu setelah membeli produk ini.
              </p>

              <input
                type="hidden"
                name="product_id"
                value={productId}
              />

              {/* RATING */}
              <fieldset>

                <legend className="mb-4 text-sm font-semibold text-zinc-300">
                  Rating Produk
                </legend>

                <div className="flex flex-wrap gap-3">

                  {[1, 2, 3, 4, 5].map((value) => (
                    <label
                      key={value}
                      className="cursor-pointer"
                    >

                      <input
                        type="radio"
                        name="rating"
                        value={value}
                        required
                        className="peer sr-only"
                      />

                      <span className="inline-block rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm font-bold text-zinc-300 transition hover:border-white peer-checked:border-white peer-checked:bg-white peer-checked:text-black peer-focus-visible:ring-2 peer-focus-visible:ring-white">
                        {value} ★
                      </span>

                    </label>
                  ))}

                </div>

              </fieldset>

              {/* KOMENTAR */}
              <div>

                <label
                  htmlFor="review-comment"
                  className="mb-3 block text-sm font-semibold text-zinc-300"
                >
                  Ulasan Kamu
                </label>

                <textarea
                  id="review-comment"
                  name="comment"
                  rows={4}
                  maxLength={1000}
                  placeholder="Ceritakan pengalamanmu menggunakan produk ini..."
                  className="w-full rounded-2xl border border-zinc-700 bg-black px-5 py-4 text-white outline-none transition focus:border-white"
                />

              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                className="w-full rounded-full bg-white px-8 py-4 font-bold text-black transition hover:bg-zinc-300"
              >
                Kirim Ulasan ↗
              </button>

            </form>
          )}

          {/* SUDAH PERNAH REVIEW */}
          {isBuyer && hasReviewed && (
            <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-950 p-6">

              <p className="text-sm text-zinc-300">
                ✓ Kamu sudah memberikan ulasan untuk produk ini.
              </p>

            </div>
          )}

          {/* BELUM BOLEH REVIEW */}
          {isBuyer && !canReview && !hasReviewed && (
            <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-950 p-6">

              <p className="text-sm text-zinc-400">
                Kamu dapat memberikan ulasan setelah membeli
                produk dan pesanan berstatus completed.
              </p>

            </div>
          )}

          {/* ================================= */}
          {/* DAFTAR ULASAN */}
          {/* ================================= */}

          <div className="mt-10 space-y-5">

            {reviews.length === 0 ? (

              <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-10 text-center">

                <p className="text-zinc-400">
                  Belum ada ulasan untuk produk ini.
                </p>

              </div>

            ) : (

              reviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6"
                >

                  <p className="text-sm font-bold text-white">
                    Ulasan Pembeli
                  </p>

                  <p className="mt-3 text-xl text-yellow-400">
                    {ratingStars(review.rating)}
                  </p>

                  <p className="mt-4 whitespace-pre-wrap break-words leading-relaxed text-zinc-300">
                    {review.comment || "Tidak ada komentar."}
                  </p>

                  <p className="mt-4 text-xs text-zinc-500">
                    {review.created_at
                      ? new Date(
                          review.created_at
                        ).toLocaleDateString("id-ID")
                      : ""}
                  </p>

                </div>
              ))

            )}

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
