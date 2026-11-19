
import { login } from "./actions";
import FloatingProducts from "@/components/FloatingProducts";

export default async function LoginPage({ searchParams }) {
  const params = await searchParams;
  const error = params?.error;

  return (
    <div className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-black px-6 py-24 text-white">

      {/* INTERACTIVE FLOATING BACKGROUND */}
      <FloatingProducts />

      {/* BACK TO HOME */}
      <a
        href="/"
        className="absolute left-6 top-8 z-20 text-sm text-zinc-400 transition-colors duration-300 hover:text-white md:left-12"
      >
        ← Back to Home
      </a>

      {/* LOGIN CARD */}
      <div className="animate-fade-up relative z-10 w-full max-w-md rounded-3xl border border-white/15 bg-zinc-900/60 p-8 shadow-[0_0_80px_rgba(0,0,0,0.6)] backdrop-blur-xl md:p-10">

        {/* BRAND */}
        <div className="mb-10 text-center">

          <h1 className="text-3xl font-black tracking-[0.25em]">
            VELORA
          </h1>

          <p className="mt-3 text-xs tracking-widest text-zinc-400">
            THE FUTURE OF SHOPPING
          </p>

        </div>

        {/* WELCOME TEXT */}
        <h2 className="text-3xl font-black tracking-tight">
          Welcome Back.
        </h2>

        <p className="mt-2 text-sm text-zinc-400">
          Sign in to continue your shopping journey.
        </p>

        {/* ERROR MESSAGE */}
        {error && (
          <div
            role="alert"
            className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400"
          >
            Email atau password tidak valid.
          </div>
        )}

        {/* LOGIN FORM */}
        <form action={login} className="mt-8 space-y-6">

          {/* EMAIL */}
          <div>

            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium"
            >
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
              className="w-full rounded-xl border border-zinc-700 bg-black/60 px-4 py-4 text-sm text-white outline-none transition-all duration-300 placeholder:text-zinc-500 focus:border-white focus:shadow-[0_0_15px_rgba(255,255,255,0.08)]"
            />

          </div>

          {/* PASSWORD */}
          <div>

            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              className="w-full rounded-xl border border-zinc-700 bg-black/60 px-4 py-4 text-sm text-white outline-none transition-all duration-300 placeholder:text-zinc-500 focus:border-white focus:shadow-[0_0_15px_rgba(255,255,255,0.08)]"
            />

          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            className="group flex w-full items-center justify-center gap-3 rounded-full bg-white py-4 font-bold text-black transition-all duration-300 hover:bg-zinc-300 hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] active:scale-95"
          >
            Sign In

            <span className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1">
              ↗
            </span>

          </button>

        </form>

        {/* REGISTER */}
        <div className="mt-8 border-t border-white/10 pt-6 text-center">

          <p className="text-sm text-zinc-400">
            Don&apos;t have an account?
            {" "}

            <a
              href="/register"
              className="font-semibold text-white transition-colors hover:text-zinc-300 hover:underline"
            >
              Sign Up
            </a>

          </p>

        </div>

      </div>

      {/* FOOTER */}
      <footer className="absolute bottom-6 z-10 text-center">

        <p className="text-xs tracking-widest text-zinc-400">
          EVERYTHING YOU NEED, IN ONE PLACE.
        </p>

        <p className="mt-3 text-xs text-zinc-500">
          © 2026 VELORA. All rights reserved.
        </p>

      </footer>

    </div>
  );
}
