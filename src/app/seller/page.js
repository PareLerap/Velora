
import { requireApprovedSeller } from "@/lib/authorization";
import { logout } from "@/app/actions";

export default async function SellerPage() {
  const user = await requireApprovedSeller();

  const menus = [
    {
      icon: "🏪",
      title: "Manage Store",
      desc: "Kelola informasi dan profil toko",
    },
    {
      icon: "📦",
      title: "Manage Products",
      desc: "Tambah, edit, dan hapus produk",
    },
    {
      icon: "🛒",
      title: "Manage Orders",
      desc: "Kelola pesanan pelanggan",
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
            SELLER DASHBOARD
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
            SELLER CONTROL CENTER
          </p>

          <h2 className="text-4xl font-black tracking-tight md:text-6xl">
            Welcome, {user.name}.
          </h2>

          <p className="mt-4 text-zinc-400">
            Manage your store and grow your business with VELORA.
          </p>

          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 text-xs font-semibold text-green-400">

            <span className="h-2 w-2 rounded-full bg-green-400" />

            Store Approved

          </div>

        </div>

        {/* SELLER MENU */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">

          {menus.map((menu, index) => (
            <div
              key={menu.title}
              className="group rounded-3xl border border-zinc-800 bg-zinc-900 p-8 transition-all duration-500 hover:-translate-y-2 hover:border-zinc-500"
            >

              <div className="flex items-center justify-between">

                <span className="text-4xl grayscale">
                  {menu.icon}
                </span>

                <span className="text-sm text-zinc-500">
                  0{index + 1}
                </span>

              </div>

              <h3 className="mt-8 text-2xl font-bold">
                {menu.title}
              </h3>

              <p className="mt-3 text-sm text-zinc-400">
                {menu.desc}
              </p>

              <div className="mt-8 border-t border-zinc-800 pt-4">
                <span className="text-xs text-zinc-500">
                  Coming soon
                </span>
              </div>

            </div>
          ))}

        </div>

      </main>

      {/* FOOTER */}
      <footer className="mt-16 border-t border-zinc-800 py-8 text-center text-xs text-zinc-500">
        © 2026 VELORA. Seller Control Center.
      </footer>

    </div>
  );
}
