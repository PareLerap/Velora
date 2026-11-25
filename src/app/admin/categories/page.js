
import Link from "next/link";
import { requireRole } from "@/lib/authorization";
import { getCategories } from "@/queries/categories";
import VeloraNavbar from "@/components/VeloraNavbar";

import {
  addCategory,
  editCategory,
  removeCategory,
} from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function ManageCategoriesPage({
  searchParams,
}) {
  const admin = await requireRole("admin");

  const categories = await getCategories();
  const params = await searchParams;

  // STATISTIK
  const totalProducts = categories.reduce(
    (total, category) =>
      total + Number(category.total_products),
    0
  );

  // PESAN BERHASIL
  const successMessages = {
    created: "Kategori berhasil ditambahkan.",
    updated: "Kategori berhasil diperbarui.",
    deleted: "Kategori berhasil dihapus.",
  };

  // PESAN ERROR
  const errorMessages = {
    invalid: "Data kategori tidak valid.",
    duplicate: "Nama kategori sudah digunakan.",
    "not-found": "Kategori tidak ditemukan.",
    "not-deleted":
      "Kategori masih digunakan produk atau tidak ditemukan.",
    "has-products": "Kategori masih digunakan oleh produk.",
    database: "Terjadi kesalahan pada database.",
  };

  const success =
    typeof params?.success === "string" &&
    Object.hasOwn(successMessages, params.success)
      ? successMessages[params.success]
      : null;

  const error =
    typeof params?.error === "string" &&
    Object.hasOwn(errorMessages, params.error)
      ? errorMessages[params.error]
      : null;

  const inputClass =
    "w-full rounded-xl border border-zinc-700 bg-black px-5 py-4 text-sm text-white outline-none transition-all focus:border-white";

  return (
    <div className="min-h-screen bg-black text-white">

      {/* NAVBAR BERSAMA - 80PX */}
      <VeloraNavbar user={admin} />

      {/* MAIN CONTENT */}
      <main className="mx-auto max-w-7xl px-6 py-12 md:px-12">

        {/* HEADER */}
        <div className="animate-fade-up">

          <p className="mb-4 text-xs tracking-[0.3em] text-zinc-400">
            CATEGORY MANAGEMENT
          </p>

          <h1 className="text-4xl font-black tracking-tight md:text-6xl">
            Manage Categories.
          </h1>

          <p className="mt-4 text-zinc-400">
            Organize and manage marketplace categories.
          </p>

          <Link
            href="/admin"
            className="mt-6 inline-block text-sm text-zinc-400 transition hover:text-white"
          >
            ← Back to Admin Dashboard
          </Link>

        </div>

        {/* SUCCESS MESSAGE */}
        {success && (
          <div
            role="status"
            className="mt-8 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-400"
          >
            ✓ {success}
          </div>
        )}

        {/* ERROR MESSAGE */}
        {error && (
          <div
            role="alert"
            className="mt-8 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400"
          >
            {error}
          </div>
        )}

        {/* STATISTICS */}
        <div className="mt-10 grid grid-cols-2 gap-4">

          {/* TOTAL CATEGORIES */}
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 transition-all hover:-translate-y-1 hover:border-zinc-500">

            <p className="text-xs text-zinc-500">
              01
            </p>

            <p className="mt-4 text-sm text-zinc-400">
              Total Categories
            </p>

            <h2 className="mt-3 text-4xl font-black">
              {categories.length}
            </h2>

          </div>

          {/* TOTAL PRODUCTS */}
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 transition-all hover:-translate-y-1 hover:border-zinc-500">

            <p className="text-xs text-zinc-500">
              02
            </p>

            <p className="mt-4 text-sm text-zinc-400">
              Total Products
            </p>

            <h2 className="mt-3 text-4xl font-black">
              {totalProducts}
            </h2>

          </div>

        </div>

        {/* ADD NEW CATEGORY */}
        <details className="group mt-10 rounded-3xl border border-zinc-800 bg-zinc-900 p-6">

          <summary className="flex cursor-pointer list-none items-center justify-between font-bold">

            <span>+ Add New Category</span>

            <span className="text-zinc-400 transition-transform group-open:rotate-45">
              +
            </span>

          </summary>

          <form
            action={addCategory}
            className="mt-6 space-y-5 border-t border-zinc-800 pt-6"
          >

            {/* CATEGORY NAME */}
            <div>

              <label
                htmlFor="new-name"
                className="mb-3 block text-sm"
              >
                Category Name
              </label>

              <input
                id="new-name"
                type="text"
                name="name"
                placeholder="Enter category name"
                maxLength={100}
                required
                className={inputClass}
              />

            </div>

            {/* CATEGORY DESCRIPTION */}
            <div>

              <label
                htmlFor="new-description"
                className="mb-3 block text-sm"
              >
                Description
              </label>

              <textarea
                id="new-description"
                name="description"
                rows={4}
                maxLength={1000}
                placeholder="Enter category description"
                className={inputClass}
              />

            </div>

            {/* CREATE BUTTON */}
            <button
              type="submit"
              className="rounded-full bg-white px-8 py-4 text-sm font-bold text-black transition-all hover:bg-zinc-300 active:scale-95"
            >
              Create Category ↗
            </button>

          </form>

        </details>

        {/* CATEGORY LIST */}
        <section className="mt-12">

          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">

            <h2 className="text-2xl font-black">
              All Categories.
            </h2>

            <p className="text-sm text-zinc-400">
              {categories.length} categories
            </p>

          </div>

          <div className="grid gap-4 md:grid-cols-2">

            {categories.map((category) => (

              <div
                key={category.id}
                className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 transition-all duration-300 hover:border-zinc-500"
              >

                {/* CATEGORY INFORMATION */}
                <div className="flex items-center justify-between gap-4">

                  <div className="flex min-w-0 items-center gap-4">

                    {/* CATEGORY ICON */}
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-zinc-700 bg-black text-2xl font-black">
                      {category.category_name
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    {/* CATEGORY DETAILS */}
                    <div className="min-w-0 break-words">

                      <h3 className="text-xl font-bold">
                        {category.category_name}
                      </h3>

                      <p className="mt-2 text-xs text-zinc-500">
                        Category ID: {category.id}
                      </p>

                    </div>

                  </div>

                  {/* PRODUCT COUNT */}
                  <span className="shrink-0 rounded-full border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300">
  {category.total_products} Products
</span>

                </div>

                {/* CATEGORY DESCRIPTION */}
                <p className="mt-5 whitespace-pre-wrap break-words text-sm leading-relaxed text-zinc-400">
                  {category.description ||
                    "No description available."}
                </p>

                {/* CATEGORY ACTIONS */}
                <div className="mt-6 space-y-4 border-t border-zinc-800 pt-5">

                  {/* EDIT CATEGORY */}
                  <details className="rounded-xl border border-zinc-700 p-4">

                    <summary className="cursor-pointer list-none text-sm font-semibold">
                      Edit Category ↗
                    </summary>

                    <form
                      action={editCategory}
                      className="mt-5 space-y-4"
                    >

                      <input
                        type="hidden"
                        name="categoryId"
                        value={category.id}
                      />

                      {/* EDIT NAME */}
                      <label className="block text-sm">
                        Category Name

                        <input
                          type="text"
                          name="name"
                          defaultValue={category.category_name}
                          required
                          maxLength={100}
                          className={`${inputClass} mt-2`}
                        />
                      </label>

                      {/* EDIT DESCRIPTION */}
                      <label className="block text-sm">
                        Description

                        <textarea
                          name="description"
                          defaultValue={
                            category.description || ""
                          }
                          rows={3}
                          maxLength={1000}
                          className={`${inputClass} mt-2`}
                        />
                      </label>

                      {/* SAVE CHANGES */}
                      <button
                        type="submit"
                        className="w-full rounded-full bg-white py-3 text-sm font-bold text-black transition-all hover:bg-zinc-300 active:scale-95"
                      >
                        Save Changes
                      </button>

                    </form>

                  </details>

                  {/* DELETE CATEGORY */}
                  {Number(category.total_products) > 0 ? (

                    // CATEGORY IN USE
                    <div className="rounded-xl border border-zinc-800 bg-black/40 p-4">

                      <p className="text-xs text-zinc-500">
                        Category in use — Protected
                      </p>

                    </div>

                  ) : (

                    // CATEGORY NOT IN USE
                    <details className="rounded-xl border border-red-500/30 p-4">

                      <summary className="cursor-pointer list-none text-sm font-semibold text-red-400">
                        Delete Category
                      </summary>

                      <p className="mt-4 text-sm text-zinc-400">
                        Yakin ingin menghapus kategori{" "}
                        <strong className="text-white">
                          {category.category_name}
                        </strong>
                        ?
                      </p>

                      <p className="mt-2 text-xs text-red-400">
                        Tindakan ini tidak dapat dibatalkan.
                      </p>

                      <form
                        action={removeCategory}
                        className="mt-4"
                      >

                        <input
                          type="hidden"
                          name="categoryId"
                          value={category.id}
                        />

                        <button
                          type="submit"
                          className="w-full rounded-full bg-red-600 py-3 text-sm font-bold text-white transition-all hover:bg-red-700 active:scale-95"
                        >
                          Confirm Delete
                        </button>

                      </form>

                    </details>

                  )}

                </div>

              </div>

            ))}

          </div>

          {/* EMPTY STATE */}
          {categories.length === 0 && (

            <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8 text-center">

              <h3 className="text-xl font-bold">
                No Categories Found.
              </h3>

              <p className="mt-3 text-sm text-zinc-400">
                Tambahkan kategori pertama marketplace.
              </p>

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
