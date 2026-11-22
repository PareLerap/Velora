
import Link from "next/link";
import { logout } from "@/app/actions";

export default function VeloraNavbar({ user }) {
  const isBuyer = user?.role === "buyer";
  const isSeller = user?.role === "seller";
  const isAdmin = user?.role === "admin";

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
            className="text-sm text-white hover:text-zinc-400"
          >
            Home
          </Link>

          <Link
            href="/#produk"
            className="text-sm text-white hover:text-zinc-400"
          >
            Produk
          </Link>

          <Link
            href="/#kategori"
            className="text-sm text-white hover:text-zinc-400"
          >
            Kategori
          </Link>
        </div>

        {/* ACCOUNT NAVIGATION */}
        <div className="flex min-w-0 items-center gap-2 sm:gap-4">

          {user ? (
            <>
              {isBuyer && (
                <Link
                  href="/orders"
                  className="shrink-0 rounded-full border border-zinc-700 px-3 py-2.5 text-xs font-semibold text-white transition hover:border-white sm:px-4 sm:text-sm"
                >
                  My Orders
                </Link>
              )}


              <div className="hidden max-w-[160px] text-right md:block">
                <p className="truncate text-sm font-semibold text-white">
                  Hello, {user.name}!
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-widest text-zinc-400">
                  {user.role}
                </p>
              </div>

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
              <Link
                href="/login"
                className="text-sm text-white hover:text-zinc-400"
              >
                Login
              </Link>

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
