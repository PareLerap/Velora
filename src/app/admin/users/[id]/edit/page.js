
import Link from "next/link";
import { requireRole } from "@/lib/authorization";
import { getUserById } from "@/queries/users";
import { editUser } from "@/app/admin/actions";
import { notFound, redirect } from "next/navigation";

export default async function EditUserPage({
  params,
  searchParams,
}) {
  const admin = await requireRole("admin");

  const { id } = await params;
  const query = await searchParams;

  const userId = Number(id);

  // VALIDASI ID
  if (
    !/^\d+$/.test(id) ||
    !Number.isInteger(userId) ||
    userId <= 0 ||
    userId > 2147483647
  ) {
    notFound();
  }

  // MELINDUNGI AKUN ADMIN SENDIRI
  if (userId === admin.id) {
    redirect("/admin/users?error=self");
  }

  // MENGAMBIL DATA USER
  const user = await getUserById(userId);

  if (!user) {
    notFound();
  }

  const errors = {
    invalid: "Nama atau email tidak valid.",
    duplicate: "Email sudah digunakan pengguna lain.",
    database: "Gagal memperbarui data pengguna.",
    "not-found": "Pengguna tidak ditemukan.",
  };

  const error =
    typeof query?.error === "string" ? query.error : "";

  const inputClass =
    "w-full rounded-xl border border-zinc-700 bg-black px-5 py-4 text-sm text-white outline-none transition-all focus:border-white";

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

        <Link
          href="/admin/users"
          className="text-sm text-zinc-400 transition-colors hover:text-white"
        >
          ← Back to Users
        </Link>

      </nav>

      {/* MAIN CONTENT */}
      <main className="mx-auto max-w-2xl px-6 py-12">

        <div className="animate-fade-up">

          <p className="mb-4 text-xs tracking-[0.3em] text-zinc-400">
            USER MANAGEMENT
          </p>

          <h2 className="text-4xl font-black tracking-tight md:text-6xl">
            Edit User.
          </h2>

          <p className="mt-4 text-zinc-400">
            Update registered user information.
          </p>

        </div>

        {/* EDIT CARD */}
        <div className="mt-10 rounded-3xl border border-zinc-800 bg-zinc-900 p-8 md:p-10">

          {/* USER PROFILE */}
          <div className="flex items-center gap-5 border-b border-zinc-800 pb-8">

            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-zinc-700 bg-black text-4xl font-black">
              {user.name.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0 break-words">

              <h3 className="text-xl font-bold">
                {user.name}
              </h3>

              <p className="mt-2 text-sm text-zinc-400">
                User ID: {user.id}
              </p>

              <p className="mt-2 text-xs uppercase tracking-widest text-zinc-500">
                {user.role}
              </p>

            </div>

          </div>

          {/* ERROR MESSAGE */}
          {Object.hasOwn(errors, error) && (
            <div
              role="alert"
              className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400"
            >
              {errors[error]}
            </div>
          )}

          {/* EDIT FORM */}
          <form action={editUser} className="mt-8 space-y-6">

            <input
              type="hidden"
              name="userId"
              value={user.id}
            />

            {/* FULL NAME */}
            <div>

              <label
                htmlFor="name"
                className="mb-3 block text-sm font-medium"
              >
                Full Name
              </label>

              <input
                id="name"
                type="text"
                name="name"
                defaultValue={user.name}
                maxLength={100}
                required
                className={inputClass}
              />

            </div>

            {/* EMAIL */}
            <div>

              <label
                htmlFor="email"
                className="mb-3 block text-sm font-medium"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                name="email"
                defaultValue={user.email}
                maxLength={100}
                required
                className={inputClass}
              />

            </div>

            {/* ROLE */}
            <div>

              <label
                htmlFor="role"
                className="mb-3 block text-sm font-medium"
              >
                Account Role
              </label>

              <input
                id="role"
                type="text"
                value={user.role}
                disabled
                className="w-full cursor-not-allowed rounded-xl border border-zinc-800 bg-zinc-800 px-5 py-4 text-sm uppercase text-zinc-400"
              />

              <p className="mt-3 text-xs text-zinc-500">
                Account role cannot be changed.
              </p>

            </div>

            {/* SAVE BUTTON */}
            <button
              type="submit"
              className="w-full rounded-full bg-white py-4 font-bold text-black transition-all duration-300 hover:bg-zinc-300 active:scale-95"
            >
              Save Changes ↗
            </button>

            {/* CANCEL BUTTON */}
            <Link
              href="/admin/users"
              className="block rounded-full border border-zinc-700 py-4 text-center text-sm font-semibold text-zinc-300 transition-all hover:bg-zinc-800"
            >
              Cancel
            </Link>

          </form>

        </div>

      </main>

      {/* FOOTER */}
      <footer className="mt-10 border-t border-zinc-800 py-8 text-center text-xs text-zinc-500">
        © 2026 VELORA. Administrator Control Center.
      </footer>

    </div>
  );
}
