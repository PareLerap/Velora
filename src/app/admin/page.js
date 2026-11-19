
import Link from "next/link";
import { requireRole } from "@/lib/authorization";
import { logout } from "@/app/actions";
import { getSellers } from "@/queries/sellers";

export default async function AdminPage() {
  const user = await requireRole("admin");
  const sellers = await getSellers();

  const pendingCount = sellers.filter(
    (seller) => seller.status === "pending"
  ).length;

  const menus = [
    {
  icon: "👥",
  title: "Manage Users",
  desc: "Kelola akun pengguna",
  href: "/admin/users",
},
    {
      icon: "🏪",
      title: "Seller Approval",
      desc: "Persetujuan akun seller",
      href: "/admin/sellers",
    },
    {
      icon: "📦",
      title: "Manage Products",
      desc: "Kelola produk marketplace",
      href: "/admin/products",
    },
    {
      icon: "📂",
      title: "Manage Categories",
      desc: "Kelola kategori produk",
      href: "/admin/categories",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-zinc-800 bg-black/80 px-6 py-5 backdrop-blur-xl md:px-12">

        <div>
          <h1 className="text-2xl font-black tracking-widest">
            VELORA
          </h1>

          <p className="mt-1 text-xs tracking-widest text-zinc-400">
            ADMIN DASHBOARD
          </p>
        </div>

        <form action={logout}>
          <button
            type="submit"
            className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-all hover:bg-zinc-300 active:scale-95"
          >
            Logout ↗
          </button>
        </form>

      </nav>

      {/* MAIN CONTENT */}
      <main className="mx-auto max-w-7xl px-6 py-12 md:px-12">

        <div className="animate-fade-up">

          <p className="mb-4 text-xs tracking-[0.3em] text-zinc-400">
            ADMIN CONTROL CENTER
          </p>

          <h2 className="text-4xl font-black tracking-tight md:text-6xl">
            Welcome, {user.name}.
          </h2>

          <p className="mt-4 text-zinc-400">
            Manage and monitor the VELORA marketplace.
          </p>

        </div>

        {/* PENDING SELLER NOTIFICATION */}
        {pendingCount > 0 && (
          <Link
            href="/admin/sellers"
            className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-5 transition-all hover:bg-yellow-500/20"
          >
            <div>
              <p className="font-bold text-yellow-400">
                Seller Approval Required
              </p>

              <p className="mt-2 text-sm text-zinc-400">
                {pendingCount} seller sedang menunggu persetujuan.
              </p>
            </div>

            <span className="text-sm font-semibold text-yellow-400">
              Review Now ↗
            </span>
          </Link>
        )}

        {/* MENU DASHBOARD */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

          {menus.map((menu, index) => {
            const content = (
              <>
                <div className="flex items-center justify-between">

                  <span className="text-4xl grayscale">
                    {menu.icon}
                  </span>

                  <span className="text-sm text-zinc-500">
                    0{index + 1}
                  </span>

                </div>

                <h3 className="mt-8 text-xl font-bold">
                  {menu.title}
                </h3>

                <p className="mt-3 text-sm text-zinc-400">
                  {menu.desc}
                </p>

                {/* PENDING COUNT */}
                {menu.title === "Seller Approval" &&
                  pendingCount > 0 && (
                    <div className="mt-4 inline-flex rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-xs text-yellow-400">
                      {pendingCount} Pending
                    </div>
                  )}

                <div className="mt-6 flex items-center justify-between border-t border-zinc-800 pt-4">

                  <span className="text-xs text-zinc-400">
                    {menu.href ? "Open Menu" : "Coming soon"}
                  </span>

                  {menu.href && (
                    <span className="text-xl transition-transform group-hover:-translate-y-1 group-hover:translate-x-1">
                      ↗
                    </span>
                  )}

                </div>
              </>
            );

            const cardClass =
              "group block rounded-3xl border border-zinc-800 bg-zinc-900 p-6 transition-all duration-300";

            return menu.href ? (
              <Link
                key={menu.title}
                href={menu.href}
                className={`${cardClass} hover:-translate-y-2 hover:border-white`}
              >
                {content}
              </Link>
            ) : (
              <div
                key={menu.title}
                className={cardClass}
              >
                {content}
              </div>
            );
          })}

        </div>

      </main>

      {/* FOOTER */}
      <footer className="mt-16 border-t border-zinc-800 py-8 text-center text-xs text-zinc-500">
        © 2026 VELORA. Administrator Control Center.
      </footer>

    </div>
  );
}
