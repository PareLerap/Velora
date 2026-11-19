
import {
  requireRole,
  getAccountPath,
} from "@/lib/authorization";

import { logout } from "@/app/actions";
import { redirect, notFound } from "next/navigation";
import FloatingProducts from "@/components/FloatingProducts";

export default async function SellerStatusPage({ params }) {
  const { status } = await params;

  if (!["pending", "rejected"].includes(status)) {
    notFound();
  }

  const user = await requireRole("seller");

  const path = await getAccountPath(user);

  if (path !== `/seller/${status}`) {
    redirect(path);
  }

  const isPending = status === "pending";

  return (
    <div className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-black px-6 py-20 text-white">

      {/* FLOATING BACKGROUND */}
      <FloatingProducts />

      {/* STATUS CARD */}
      <div className="animate-fade-up relative z-10 w-full max-w-lg rounded-3xl border border-white/15 bg-zinc-900/70 p-8 text-center shadow-2xl backdrop-blur-xl md:p-12">

        {/* BRAND */}
        <h1 className="text-3xl font-black tracking-[0.25em]">
          VELORA
        </h1>

        <p className="mt-3 text-xs tracking-widest text-zinc-400">
          SELLER CENTER
        </p>

        {/* STATUS ICON */}
        <div
          className={`mx-auto my-8 flex h-24 w-24 items-center justify-center rounded-full border text-5xl ${
            isPending
              ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-400"
              : "border-red-500/30 bg-red-500/10 text-red-400"
          }`}
        >
          {isPending ? "◷" : "×"}
        </div>

        {/* STATUS LABEL */}
        <p
          className={`mb-4 text-xs font-semibold tracking-[0.3em] ${
            isPending ? "text-yellow-400" : "text-red-400"
          }`}
        >
          {isPending
            ? "PENDING APPROVAL"
            : "ACCOUNT REJECTED"}
        </p>

        {/* TITLE */}
        <h2 className="text-3xl font-black tracking-tight">
          {isPending
            ? "Akun Anda sedang ditinjau."
            : "Pendaftaran Anda ditolak."}
        </h2>

        {/* USER INFORMATION */}
        <p className="mt-5 text-sm text-zinc-300">
          Hello, {user.name}.
        </p>

        {/* DESCRIPTION */}
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
          {isPending
            ? "Pendaftaran toko Anda sedang menunggu persetujuan Admin. Anda dapat mulai berjualan setelah akun disetujui."
            : "Mohon maaf, pendaftaran toko Anda belum dapat disetujui oleh Admin."}
        </p>

        <div className="mt-8 border-t border-zinc-700 pt-8">

          {/* REFRESH STATUS */}
          <a
            href={`/seller/${status}`}
            className="block rounded-full border border-zinc-600 py-4 text-sm font-semibold transition-all duration-300 hover:border-white hover:bg-zinc-800 active:scale-95"
          >
            Refresh Status ↻
          </a>

          {/* LOGOUT BUTTON */}
          <form action={logout} className="mt-4">

            <button
              type="submit"
              className="w-full rounded-full bg-white py-4 font-bold text-black transition-all duration-300 hover:bg-zinc-300 active:scale-95"
            >
              Logout ↗
            </button>

          </form>

        </div>

      </div>

      {/* FOOTER */}
      <footer className="absolute bottom-6 z-10 text-center text-xs text-zinc-500">
        © 2026 VELORA. Seller Center.
      </footer>

    </div>
  );
}
