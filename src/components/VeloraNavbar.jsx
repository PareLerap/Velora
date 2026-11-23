
import Link from "next/link";
import { logout } from "@/app/actions";
import pool from "@/lib/db";

export default async function VeloraNavbar({ user }) {
  const isBuyer = user?.role === "buyer";

  // HITUNG JUMLAH BARANG DI KERANJANG BUYER
  let cartCount = 0;

  if (isBuyer) {
    const result = await pool.query(
      `SELECT
         COALESCE(SUM(ci.quantity), 0)::integer AS cart_count
       FROM carts c
       LEFT JOIN cart_items ci
         ON ci.cart_id = c.id
       WHERE c.user_id = $1`,
      [user.id]
    );

    cartCount = Number(
      result.rows[0]?.cart_count || 0
    );
  }

  return (
    <nav className="sticky top-0 z-50 h-20 border-b border-white/10 bg-black/90 px-4 backdrop-blur-xl md:px-12">

      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-3">

        {/* LOGO */}
        <Link
          href="/"
          className="shrink-0 text-xl font-black tracking-[0.2em] text-white transition-opacity hover:opacity-70 md:text-2xl md:tracking-[0.25em]"
        >
          VELORA
        </Link>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden items-center gap-8 lg:flex">

          <Link
            href="/"
            className="text-sm text-white transition hover:text-zinc-400"
          >
            Home
          </Link>

          <Link
            href="/#produk"
            className="text-sm text-white transition hover:text-zinc-400"
          >
            Produk
          </Link>

          <Link
            href="/#kategori"
            className="text-sm text-white transition hover:text-zinc-400"
          >
            Kategori
          </Link>

        </div>

        {/* ACCOUNT NAVIGATION */}
        <div className="flex min-w-0 items-center gap-2 sm:gap-4">

          {user ? (
            <>

              {/* BUYER MENU */}
              {isBuyer && (
                <>

                  {/* MY ORDERS */}
                  <Link
                    href="/orders"
                    className="hidden shrink-0 rounded-full border border-zinc-700 px-3 py-2.5 text-xs font-semibold text-white transition hover:border-white sm:block sm:px-4 sm:text-sm"
                  >
                    My Orders
                  </Link>

                  {/* SHOPPING CART */}
                  <Link
                    href="/cart"
                    aria-label={`Shopping Cart, ${cartCount} barang`}
                    title="Shopping Cart"
                    className="group relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-zinc-700 text-white transition-all duration-300 hover:border-white hover:bg-white hover:text-black sm:h-12 sm:w-12"
                  >

                    {/* CART ICON */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="23"
                      height="23"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <circle cx="9" cy="21" r="1" />
                      <circle cx="20" cy="21" r="1" />
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                    </svg>

                    {/* CART BADGE */}
                    {cartCount > 0 && (
                      <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[10px] font-black text-black ring-2 ring-black transition group-hover:bg-zinc-300">
                        {cartCount > 99
                          ? "99+"
                          : cartCount}
                      </span>
                    )}

                  </Link>

                </>
              )}

              {/* USER INFORMATION */}
              <div className="hidden max-w-[160px] text-right md:block">

                <p className="truncate text-sm font-semibold text-white">
                  Hello, {user.name}!
                </p>

                <p className="mt-1 text-[10px] uppercase tracking-widest text-zinc-400">
                  {user.role}
                </p>

              </div>

              {/* LOGOUT */}
              <form action={logout}>

                <button
                  type="submit"
                  className="shrink-0 rounded-full bg-white px-3 py-2.5 text-xs font-semibold text-black transition hover:bg-zinc-300 sm:px-5 sm:py-3 sm:text-sm"
                >
                  Logout ↗
                </button>

              </form>

            </>
          ) : (
            <>

              {/* LOGIN */}
              <Link
                href="/login"
                className="text-sm text-white transition hover:text-zinc-400"
              >
                Login
              </Link>

              {/* REGISTER */}
              <Link
                href="/register"
                className="rounded-full bg-white px-3 py-2.5 text-xs font-semibold text-black transition hover:bg-zinc-300 sm:px-5 sm:py-3 sm:text-sm"
              >
                Daftar ↗
              </Link>

            </>
          )}

        </div>

      </div>

    </nav>
  );
}
