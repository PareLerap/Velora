
import DeleteUserButton from "@/components/DeleteUserButton";
import Link from "next/link";
import { requireRole } from "@/lib/authorization";
import { getUsers } from "@/queries/users";
import VeloraNavbar from "@/components/VeloraNavbar";

export const dynamic = "force-dynamic";

export default async function ManageUsersPage({ searchParams }) {
  const admin = await requireRole("admin");
  const users = await getUsers();
  const params = await searchParams;

  const search =
    typeof params?.search === "string"
      ? params.search.trim()
      : "";

  const role = ["admin", "seller", "buyer"].includes(params?.role)
    ? params.role
    : "all";

  // STATISTIK PENGGUNA
  const statistics = [
    {
      title: "Total Users",
      count: users.length,
    },
    {
      title: "Admins",
      count: users.filter((user) => user.role === "admin").length,
    },
    {
      title: "Sellers",
      count: users.filter((user) => user.role === "seller").length,
    },
    {
      title: "Buyers",
      count: users.filter((user) => user.role === "buyer").length,
    },
  ];

  // SEARCH DAN FILTER
  const filteredUsers = users.filter((user) => {
    const keyword = search.toLowerCase();

    const matchesSearch =
      user.name.toLowerCase().includes(keyword) ||
      user.email.toLowerCase().includes(keyword);

    const matchesRole =
      role === "all" || user.role === role;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-h-screen bg-black text-white">

      {/* NAVBAR BERSAMA - 80PX */}
      <VeloraNavbar user={admin} />

      <main className="mx-auto max-w-7xl px-6 py-12 md:px-12">

        {/* HEADER */}
        <div className="animate-fade-up">

          <p className="mb-4 text-xs tracking-[0.3em] text-zinc-400">
            USER MANAGEMENT
          </p>

          <h1 className="text-4xl font-black tracking-tight md:text-6xl">
            Manage Users.
          </h1>

          <p className="mt-4 text-zinc-400">
            Manage all registered marketplace accounts.
          </p>

          <Link
            href="/admin"
            className="mt-6 inline-block text-sm text-zinc-400 transition hover:text-white"
          >
            ← Back to Admin Dashboard
          </Link>

        </div>

        {/* NOTIFIKASI EDIT BERHASIL */}
        {params?.success === "updated" && (
          <div
            role="status"
            className="animate-fade-up mt-8 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-400"
          >
            ✓ Data pengguna berhasil diperbarui.
          </div>
        )}

        {/* NOTIFIKASI DELETE BERHASIL */}
        {params?.success === "deleted" && (
          <div
            role="status"
            className="animate-fade-up mt-8 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-400"
          >
            ✓ Akun pengguna berhasil dihapus.
          </div>
        )}

        {/* NOTIFIKASI ERROR */}
        {params?.error && (
          <div
            role="alert"
            className="animate-fade-up mt-8 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400"
          >
            {params.error === "self"
              ? "Anda tidak dapat mengubah atau menghapus akun sendiri."
              : params.error === "has-relations"
              ? "Akun tidak dapat dihapus karena memiliki data transaksi terkait."
              : params.error === "not-found"
              ? "Pengguna tidak ditemukan."
              : params.error === "invalid"
              ? "ID pengguna tidak valid."
              : "Gagal memproses data pengguna."}
          </div>
        )}

        {/* STATISTICS */}
        <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">

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
          action="/admin/users"
          method="GET"
          className="mt-12 flex flex-col gap-3 md:flex-row"
        >

          <input
            type="search"
            name="search"
            aria-label="Cari pengguna"
            defaultValue={search}
            placeholder="Search name or email..."
            className="min-w-0 flex-1 rounded-full border border-zinc-700 bg-zinc-900 px-6 py-4 text-sm outline-none transition-all placeholder:text-zinc-500 focus:border-white"
          />

          <select
            name="role"
            aria-label="Filter role"
            defaultValue={role}
            className="rounded-full border border-zinc-700 bg-zinc-900 px-6 py-4 text-sm text-white outline-none focus:border-white"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="seller">Seller</option>
            <option value="buyer">Buyer</option>
          </select>

          <button
            type="submit"
            className="rounded-full bg-white px-8 py-4 text-sm font-bold text-black transition-all hover:bg-zinc-300 active:scale-95"
          >
            Search
          </button>

          <Link
            href="/admin/users"
            className="rounded-full border border-zinc-700 px-6 py-4 text-center text-sm transition-all hover:bg-zinc-800"
          >
            Reset
          </Link>

        </form>

        {/* USER LIST */}
        <section className="mt-12">

          <div className="mb-6 flex items-center justify-between gap-4">

            <h2 className="text-2xl font-black">
              Registered Users.
            </h2>

            <p className="text-sm text-zinc-400">
              {filteredUsers.length} users
            </p>

          </div>

          <div className="space-y-4">

            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 transition-all duration-300 hover:border-zinc-500"
              >

                <div className="flex flex-wrap items-center justify-between gap-4">

                  {/* USER INFORMATION */}
                  <div className="flex min-w-0 items-center gap-4">

                    {/* AVATAR */}
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-zinc-700 bg-black text-2xl font-black">
                      {user.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0 break-words">

                      <h3 className="text-lg font-bold">
                        {user.name}
                      </h3>

                      <p className="mt-1 text-sm text-zinc-400">
                        {user.email}
                      </p>

                      <p className="mt-1 text-xs text-zinc-500">
                        User ID: {user.id}
                      </p>

                    </div>

                  </div>

                  {/* ROLE BADGE */}
                  <span
                    className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase ${
                      user.role === "admin"
                        ? "border-purple-500/30 bg-purple-500/10 text-purple-400"
                        : user.role === "seller"
                        ? "border-blue-500/30 bg-blue-500/10 text-blue-400"
                        : "border-zinc-600 bg-zinc-800 text-zinc-300"
                    }`}
                  >
                    {user.role}
                  </span>

                </div>

                {/* SELLER INFORMATION */}
                {user.role === "seller" && (
                  <div className="mt-5 rounded-xl border border-zinc-800 bg-black/40 p-4">

                    <p className="text-sm text-zinc-400">
                      Store:{" "}

                      <span className="font-semibold text-white">
                        {user.store_name || "Belum ada toko"}
                      </span>
                    </p>

                    <p className="mt-2 text-xs text-zinc-400">
                      Status:{" "}

                      <span
                        className={
                          user.seller_status === "approved"
                            ? "text-green-400"
                            : user.seller_status === "pending"
                            ? "text-yellow-400"
                            : user.seller_status === "rejected"
                            ? "text-red-400"
                            : "text-zinc-400"
                        }
                      >
                        {user.seller_status || "Unknown"}
                      </span>
                    </p>

                  </div>
                )}

                {/* USER ACTIONS */}
                <div className="mt-6 border-t border-zinc-800 pt-5">

                  {user.id === admin.id ? (

                    <p className="text-sm text-green-400">
                      ◈ Your Account — Protected
                    </p>

                  ) : (

                    <div className="flex flex-wrap gap-3">

                      {/* EDIT USER */}
                      <Link
                        href={`/admin/users/${user.id}/edit`}
                        className="rounded-full border border-zinc-600 px-5 py-3 text-xs font-semibold text-white transition-all duration-300 hover:bg-white hover:text-black active:scale-95"
                      >
                        Edit User ↗
                      </Link>

                      {/* DELETE USER */}
                      <DeleteUserButton
                        userId={user.id}
                        userName={user.name}
                      />

                    </div>

                  )}

                </div>

              </div>
            ))}

            {/* EMPTY STATE */}
            {filteredUsers.length === 0 && (
              <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-12 text-center">

                <h3 className="text-xl font-bold">
                  No Users Found.
                </h3>

                <p className="mt-3 text-sm text-zinc-400">
                  Tidak ada pengguna yang sesuai dengan pencarian.
                </p>

                <Link
                  href="/admin/users"
                  className="mt-6 inline-block rounded-full bg-white px-6 py-3 text-sm font-semibold text-black"
                >
                  Show All Users
                </Link>

              </div>
            )}

          </div>

        </section>

      </main>

      {/* FOOTER */}
      <footer className="mt-16 border-t border-zinc-800 py-8 text-center text-xs text-zinc-500">
        © 2026 VELORA. Administrator Control Center.
      </footer>

    </div>
  );
}
