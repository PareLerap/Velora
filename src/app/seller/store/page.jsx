
import Link from "next/link";
import pool from "@/lib/db";
import { requireApprovedSeller } from "@/lib/authorization";
import { updateStore } from "./actions";
import VeloraNavbar from "@/components/VeloraNavbar";

export default async function ManageStorePage({ searchParams }) {
  const user = await requireApprovedSeller();
  const params = await searchParams;

  // AMBIL DATA TOKO SELLER
  const result = await pool.query(
    `SELECT id, store_name, description,
            address, image_url, status
     FROM stores
     WHERE user_id = $1
       AND status = 'approved'
     LIMIT 1`,
    [user.id]
  );

  const store = result.rows[0];

  const inputClass =
    "w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-sm text-white outline-none transition focus:border-white";

  return (
    <div className="min-h-screen bg-black text-white">

      {/* NAVBAR BERSAMA - 80PX */}
      <VeloraNavbar user={user} />

      {/* MAIN CONTENT */}
      <main className="mx-auto max-w-7xl px-6 py-12 md:px-12">

        {/* HEADER */}
        <div>
          <p className="mb-4 text-xs tracking-[0.3em] text-zinc-400">
            SELLER CONTROL CENTER
          </p>

          <h1 className="text-4xl font-black tracking-tight md:text-6xl">
            Manage Store.
          </h1>

          <p className="mt-4 text-zinc-400">
            Customize and manage your store identity on VELORA.
          </p>

          <Link
            href="/seller"
            className="mt-6 inline-block text-sm text-zinc-400 transition hover:text-white"
          >
            ← Back to Seller Dashboard
          </Link>
        </div>

        {/* JIKA TOKO TIDAK DITEMUKAN */}
        {!store ? (
          <div className="mt-12 rounded-3xl border border-zinc-800 bg-zinc-900 p-10">
            <h2 className="text-xl font-bold">
              Store Unavailable
            </h2>

            <p className="mt-3 text-zinc-400">
              Toko kamu belum tersedia atau belum disetujui.
            </p>
          </div>
        ) : (
          <div className="mt-12 grid gap-8 lg:grid-cols-3">

            {/* STORE OVERVIEW */}
            <div className="h-fit rounded-3xl border border-zinc-800 bg-zinc-900 p-8">

              <h2 className="text-xl font-bold">
                Store Overview
              </h2>

              {/* STORE IMAGE */}
              <div className="mt-8 flex h-28 w-28 items-center justify-center overflow-hidden rounded-2xl border border-zinc-700 bg-black">

                {store.image_url ? (
                  <img
                    src={store.image_url}
                    alt={store.store_name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-5xl">
                    🏪
                  </span>
                )}

              </div>

              {/* STORE NAME */}
              <h3 className="mt-6 break-words text-2xl font-bold">
                {store.store_name}
              </h3>

              <p className="mt-2 text-sm text-zinc-400">
                Owned by {user.name}
              </p>

              {/* STORE STATUS */}
              <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 text-xs font-semibold text-green-400">

                <span className="h-2 w-2 rounded-full bg-green-400" />

                APPROVED STORE

              </div>

              {/* DESCRIPTION */}
              <div className="mt-8 border-t border-zinc-800 pt-6">

                <p className="text-xs uppercase tracking-widest text-zinc-500">
                  Description
                </p>

                <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-relaxed text-zinc-300">
                  {store.description ||
                    "No description provided."}
                </p>

              </div>

              {/* STORE ADDRESS */}
              <div className="mt-6 border-t border-zinc-800 pt-6">

                <p className="text-xs uppercase tracking-widest text-zinc-500">
                  Store Address
                </p>

                <p className="mt-3 whitespace-pre-wrap break-words text-sm text-zinc-300">
                  {store.address ||
                    "No address provided."}
                </p>

              </div>

              {/* MANAGE PRODUCTS BUTTON */}
              <Link
                href="/seller/products"
                className="mt-8 block rounded-full border border-zinc-700 px-5 py-3 text-center text-sm font-semibold transition hover:bg-zinc-800"
              >
                Manage Products ↗
              </Link>

            </div>

            {/* EDIT STORE INFORMATION */}
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8 lg:col-span-2">

              {/* FORM HEADER */}
              <div className="border-b border-zinc-800 pb-6">

                <h2 className="text-2xl font-bold">
                  Store Information.
                </h2>

                <p className="mt-2 text-sm text-zinc-400">
                  Update your store information and appearance.
                </p>

              </div>

              {/* SUCCESS NOTIFICATION */}
              {params?.saved === "1" && (
                <div
                  role="status"
                  className="mt-6 rounded-xl border border-green-500/30 bg-green-500/10 px-5 py-4 text-sm text-green-400"
                >
                  Store information updated successfully.
                </div>
              )}

              {/* UPDATE STORE FORM */}
              <form
                action={updateStore}
                className="mt-8 space-y-7"
              >

                {/* STORE NAME */}
                <div>
                  <label
                    htmlFor="store_name"
                    className="mb-3 block text-sm font-semibold"
                  >
                    Store Name
                  </label>

                  <input
                    id="store_name"
                    name="store_name"
                    type="text"
                    defaultValue={store.store_name}
                    maxLength={100}
                    required
                    className={inputClass}
                    placeholder="Enter your store name"
                  />
                </div>

                {/* STORE DESCRIPTION */}
                <div>
                  <label
                    htmlFor="description"
                    className="mb-3 block text-sm font-semibold"
                  >
                    Store Description
                  </label>

                  <textarea
                    id="description"
                    name="description"
                    rows={5}
                    maxLength={2000}
                    defaultValue={store.description || ""}
                    className={inputClass}
                    placeholder="Tell customers about your store"
                  />
                </div>

                {/* STORE ADDRESS */}
                <div>
                  <label
                    htmlFor="address"
                    className="mb-3 block text-sm font-semibold"
                  >
                    Store Address
                  </label>

                  <textarea
                    id="address"
                    name="address"
                    rows={3}
                    maxLength={500}
                    defaultValue={store.address || ""}
                    className={inputClass}
                    placeholder="Enter your store address"
                  />
                </div>

                {/* STORE IMAGE URL */}
                <div>
                  <label
                    htmlFor="image_url"
                    className="mb-3 block text-sm font-semibold"
                  >
                    Store Image URL
                  </label>

                  <input
                    id="image_url"
                    name="image_url"
                    type="text"
                    defaultValue={store.image_url || ""}
                    className={inputClass}
                    placeholder="/images/store.jpg"
                  />

                  <p className="mt-3 text-xs text-zinc-500">
                    Use a direct image URL or a path from your
                    public folder.
                  </p>
                </div>

                {/* SAVE CHANGES */}
                <div className="border-t border-zinc-800 pt-7">

                  <button
                    type="submit"
                    className="w-full rounded-full bg-white px-8 py-4 text-sm font-bold text-black transition hover:bg-zinc-300 active:scale-95 sm:w-auto"
                  >
                    Save Store Changes ↗
                  </button>

                </div>

              </form>

            </div>

          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="mt-16 border-t border-zinc-800 py-8 text-center text-xs text-zinc-500">
        © 2026 VELORA. Seller Store Management.
      </footer>

    </div>
  );
}
