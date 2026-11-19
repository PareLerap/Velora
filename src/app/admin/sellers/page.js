
import { requireRole } from "@/lib/authorization";
import { getSellers } from "@/queries/sellers";
import { approveSeller, rejectSeller } from "../actions";

export const dynamic = "force-dynamic";

export default async function SellerApprovalPage({ searchParams }) {
  await requireRole("admin");

  const sellers = await getSellers();
  const params = await searchParams;

  const pending = sellers.filter(
    (seller) => seller.status === "pending"
  ).length;

  const approved = sellers.filter(
    (seller) => seller.status === "approved"
  ).length;

  const rejected = sellers.filter(
    (seller) => seller.status === "rejected"
  ).length;

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

        <a
          href="/admin"
          className="text-sm text-zinc-400 transition-all hover:text-white"
        >
          ← Back to Dashboard
        </a>

      </nav>

      <main className="mx-auto max-w-7xl px-6 py-12 md:px-12">

        {/* HEADER */}
        <div className="animate-fade-up">

          <p className="mb-4 text-xs tracking-[0.3em] text-zinc-400">
            SELLER MANAGEMENT
          </p>

          <h2 className="text-4xl font-black tracking-tight md:text-6xl">
            Seller Approval.
          </h2>

          <p className="mt-4 text-zinc-400">
            Review and manage seller applications.
          </p>

        </div>

        {/* SUCCESS MESSAGE */}
        {params?.success === "approved" && (
          <div role="status" className="mt-8 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-400">
            Seller berhasil disetujui.
          </div>
        )}

        {params?.success === "rejected" && (
          <div role="status" className="mt-8 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
            Pendaftaran Seller berhasil ditolak.
          </div>
        )}

        {params?.error === "not-updated" && (
          <div role="alert" className="mt-8 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-sm text-yellow-400">
            Status gagal diubah. Seller mungkin sudah diproses.
          </div>
        )}

        {/* STATISTICS */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">

            <p className="text-sm text-zinc-400">
              Pending Sellers
            </p>

            <h3 className="mt-4 text-5xl font-black text-yellow-400">
              {pending}
            </h3>

            <p className="mt-3 text-xs text-zinc-500">
              Waiting for approval
            </p>

          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">

            <p className="text-sm text-zinc-400">
              Approved Sellers
            </p>

            <h3 className="mt-4 text-5xl font-black text-green-400">
              {approved}
            </h3>

            <p className="mt-3 text-xs text-zinc-500">
              Ready to sell
            </p>

          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">

            <p className="text-sm text-zinc-400">
              Rejected Sellers
            </p>

            <h3 className="mt-4 text-5xl font-black text-red-400">
              {rejected}
            </h3>

            <p className="mt-3 text-xs text-zinc-500">
              Application rejected
            </p>

          </div>

        </div>

        {/* SELLER LIST */}
        <section className="mt-14">

          <div className="mb-6 flex items-center justify-between">

            <h2 className="text-2xl font-black">
              All Sellers.
            </h2>

            <p className="text-sm text-zinc-400">
              {sellers.length} sellers
            </p>

          </div>

          <div className="space-y-4">

            {sellers.map((seller) => (

              <div
                key={seller.store_id}
                className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 transition-all duration-300 hover:border-zinc-600"
              >

                <div className="flex flex-wrap items-start justify-between gap-5">

                  {/* STORE INFORMATION */}
                  <div className="flex min-w-0 items-center gap-4">

                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-zinc-700 bg-black text-3xl grayscale">
                      🏪
                    </div>

                    <div className="min-w-0 break-words">

                      <h3 className="text-xl font-bold">
                        {seller.store_name}
                      </h3>

                      <p className="mt-1 text-sm text-zinc-400">
                        Owner: {seller.name}
                      </p>

                      <p className="mt-1 text-xs text-zinc-500">
                        {seller.email}
                      </p>

                    </div>

                  </div>

                  {/* STATUS */}
                  <span
                    className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase ${
                      seller.status === "pending"
                        ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-400"
                        : seller.status === "approved"
                        ? "border-green-500/30 bg-green-500/10 text-green-400"
                        : "border-red-500/30 bg-red-500/10 text-red-400"
                    }`}
                  >
                    {seller.status}
                  </span>

                </div>

                {/* STORE DESCRIPTION */}
                <p className="mt-5 text-sm text-zinc-400">
                  {seller.description || "Belum ada deskripsi toko."}
                </p>

                {/* APPROVAL BUTTONS */}
                {seller.status === "pending" && (

                  <div className="mt-6 flex flex-wrap gap-3 border-t border-zinc-800 pt-5">

                    {/* APPROVE */}
                    <form action={approveSeller}>

                      <input
                        type="hidden"
                        name="storeId"
                        value={seller.store_id}
                      />

                      <button
                        type="submit"
                        className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-all hover:bg-green-400 active:scale-95"
                      >
                        ✓ Approve
                      </button>

                    </form>

                    {/* REJECT */}
                    <form action={rejectSeller}>

                      <input
                        type="hidden"
                        name="storeId"
                        value={seller.store_id}
                      />

                      <button
                        type="submit"
                        className="rounded-full border border-red-500/40 px-6 py-3 text-sm font-semibold text-red-400 transition-all hover:bg-red-500/10 active:scale-95"
                      >
                        × Reject
                      </button>

                    </form>

                  </div>

                )}

              </div>

            ))}

            {sellers.length === 0 && (

              <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-12 text-center">

                <h3 className="text-xl font-bold">
                  No Sellers Found.
                </h3>

                <p className="mt-3 text-sm text-zinc-400">
                  Belum ada Seller yang terdaftar.
                </p>

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
