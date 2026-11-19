
import { register } from "./actions";
import FloatingProducts from "@/components/FloatingProducts";

export default async function RegisterPage({ searchParams }) {
  const params = await searchParams;

  const errors = {
    invalid: "Nama atau email tidak valid.",
    password: "Password minimal 8 karakter dan maksimal 72 byte.",
    confirm: "Konfirmasi password tidak sesuai.",
    duplicate: "Email sudah terdaftar.",
    role: "Role pengguna tidak valid.",
    store: "Nama toko wajib diisi dan maksimal 100 karakter.",
    database: "Registrasi gagal. Silakan coba kembali.",
  };

  const error = typeof params?.error === "string"
    ? params.error
    : "";

  const inputClass =
    "w-full rounded-xl border border-zinc-700 bg-black/60 px-4 py-4 text-sm text-white outline-none transition-all placeholder:text-zinc-500 focus:border-white";

  return (
    <div className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-black px-6 py-24 text-white">

      <FloatingProducts />

      {/* BACK TO HOME */}
      <a
        href="/"
        className="absolute left-6 top-8 z-20 text-sm text-zinc-400 transition-colors hover:text-white md:left-12"
      >
        ← Back to Home
      </a>

      {/* REGISTER CARD */}
      <div className="animate-fade-up relative z-10 w-full max-w-lg rounded-3xl border border-white/15 bg-zinc-900/60 p-8 shadow-2xl backdrop-blur-xl md:p-10">

        {/* BRAND */}
        <div className="mb-8 text-center">

          <h1 className="text-3xl font-black tracking-[0.25em]">
            VELORA
          </h1>

          <p className="mt-3 text-xs tracking-widest text-zinc-400">
            THE FUTURE OF SHOPPING
          </p>

        </div>

        <h2 className="text-3xl font-black tracking-tight">
          Join VELORA
        </h2>

        <p className="mt-2 text-sm text-zinc-400">
          Start your shopping or selling journey.
        </p>

        {/* ERROR MESSAGE */}
        {Object.hasOwn(errors, error) && (
          <div
            role="alert"
            className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400"
          >
            {errors[error]}
          </div>
        )}

        {/* REGISTER FORM */}
        <form action={register} className="mt-8 space-y-5">

          {/* NAME */}
          <div>
            <label htmlFor="name" className="mb-2 block text-sm">
              Full Name
            </label>

            <input
              id="name"
              type="text"
              name="name"
              placeholder="Enter your full name"
              autoComplete="name"
              maxLength={100}
              required
              className={inputClass}
            />
          </div>

          {/* EMAIL */}
          <div>
            <label htmlFor="email" className="mb-2 block text-sm">
              Email Address
            </label>

            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              autoComplete="email"
              maxLength={100}
              required
              className={inputClass}
            />
          </div>

          {/* ROLE */}
          <div>
            <label htmlFor="role" className="mb-2 block text-sm">
              Account Type
            </label>

            <select
              id="role"
              name="role"
              defaultValue="buyer"
              required
              className={inputClass}
            >
              <option value="buyer">Buyer — Shop Products</option>
              <option value="seller">Seller — Sell Products</option>
            </select>
          </div>

          {/* STORE NAME */}
          <div>
            <label htmlFor="storeName" className="mb-2 block text-sm">
              Store Name
            </label>

            <input
              id="storeName"
              type="text"
              name="storeName"
              placeholder="Enter your store name"
              maxLength={100}
              className={inputClass}
            />

            <p className="mt-2 text-xs text-zinc-400">
              Wajib diisi untuk Seller. Buyer boleh mengosongkan.
            </p>
          </div>

          {/* PASSWORD */}
          <div>
            <label htmlFor="password" className="mb-2 block text-sm">
              Password
            </label>

            <input
              id="password"
              type="password"
              name="password"
              placeholder="Minimum 8 characters"
              autoComplete="new-password"
              minLength={8}
              maxLength={72}
              required
              className={inputClass}
            />
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <label htmlFor="confirmPassword" className="mb-2 block text-sm">
              Confirm Password
            </label>

            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              placeholder="Repeat your password"
              autoComplete="new-password"
              required
              className={inputClass}
            />
          </div>

          {/* REGISTER BUTTON */}
          <button
            type="submit"
            className="w-full rounded-full bg-white py-4 font-bold text-black transition-all duration-300 hover:bg-zinc-300 active:scale-95"
          >
            Create Account ↗
          </button>

        </form>

        {/* LOGIN LINK */}
        <div className="mt-8 border-t border-white/10 pt-6 text-center">

          <p className="text-sm text-zinc-400">
            Already have an account?
            {" "}
            <a
              href="/login"
              className="font-semibold text-white hover:underline"
            >
              Sign In
            </a>
          </p>

        </div>

      </div>

      <footer className="absolute bottom-6 z-10 text-center text-xs text-zinc-500">
        © 2026 VELORA. All rights reserved.
      </footer>

    </div>
  );
}
