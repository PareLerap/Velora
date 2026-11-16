
export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black">

      {/* NAVBAR */}
      <nav className="flex items-center justify-between border-b px-8 py-5">
        <h1 className="text-2xl font-bold tracking-widest">
          VELORA
        </h1>

        <div className="hidden gap-8 md:flex">
          <a href="#" className="hover:text-gray-500">Home</a>
          <a href="#produk" className="hover:text-gray-500">Produk</a>
          <a href="#" className="hover:text-gray-500">Kategori</a>
        </div>

        <div className="flex items-center gap-4">
          <a href="#" className="text-sm">Login</a>
          <a
            href="#"
            className="rounded-full bg-black px-5 py-2 text-sm text-white"
          >
            Daftar
          </a>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="bg-gray-100 px-8 py-20 text-center">
        <p className="mb-4 text-sm tracking-widest text-gray-500">
          WELCOME TO VELORA
        </p>

        <h2 className="text-4xl font-bold md:text-6xl">
          Everything You Need,
          <br />
          In One Place.
        </h2>

        <p className="mx-auto mt-5 max-w-xl text-gray-600">
          Temukan berbagai produk pilihan dengan mudah
          hanya di VELORA.
        </p>

        <a
          href="#produk"
          className="mt-8 inline-block rounded-full bg-black px-8 py-3 text-white hover:bg-gray-700"
        >
          Jelajahi Produk
        </a>
      </section>

      {/* KATEGORI */}
      <section className="px-8 py-12">
        <h2 className="mb-6 text-2xl font-bold">
          Kategori Pilihan
        </h2>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-lg bg-gray-100 p-8 text-center">
            <p className="text-3xl">👕</p>
            <p className="mt-3 font-semibold">Fashion</p>
          </div>

          <div className="rounded-lg bg-gray-100 p-8 text-center">
            <p className="text-3xl">💻</p>
            <p className="mt-3 font-semibold">Elektronik</p>
          </div>

          <div className="rounded-lg bg-gray-100 p-8 text-center">
            <p className="text-3xl">⌚</p>
            <p className="mt-3 font-semibold">Aksesoris</p>
          </div>

          <div className="rounded-lg bg-gray-100 p-8 text-center">
            <p className="text-3xl">🏠</p>
            <p className="mt-3 font-semibold">Rumah Tangga</p>
          </div>
        </div>
      </section>

      {/* PRODUK */}
      <section id="produk" className="px-8 py-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            Produk Pilihan
          </h2>
          <a href="#" className="text-sm text-gray-500">
            Lihat Semua
          </a>
        </div>

        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">

          <div className="overflow-hidden rounded-lg border">
            <div className="flex h-48 items-center justify-center bg-gray-100 text-6xl">
              👟
            </div>
            <div className="p-4">
              <h3 className="font-semibold">Sneakers Casual</h3>
              <p className="mt-2 text-gray-500">Rp250.000</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border">
            <div className="flex h-48 items-center justify-center bg-gray-100 text-6xl">
              🎒
            </div>
            <div className="p-4">
              <h3 className="font-semibold">Tas Minimalis</h3>
              <p className="mt-2 text-gray-500">Rp180.000</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border">
            <div className="flex h-48 items-center justify-center bg-gray-100 text-6xl">
              🎧
            </div>
            <div className="p-4">
              <h3 className="font-semibold">Headphone</h3>
              <p className="mt-2 text-gray-500">Rp320.000</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border">
            <div className="flex h-48 items-center justify-center bg-gray-100 text-6xl">
              ⌚
            </div>
            <div className="p-4">
              <h3 className="font-semibold">Jam Tangan</h3>
              <p className="mt-2 text-gray-500">Rp150.000</p>
            </div>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-10 bg-black px-8 py-8 text-center text-white">
        <h2 className="text-xl font-bold tracking-widest">
          VELORA
        </h2>
        <p className="mt-2 text-sm text-gray-400">
          Everything you need, in one place.
        </p>
        <p className="mt-5 text-xs text-gray-500">
          © 2026 VELORA. All rights reserved.
        </p>
      </footer>

    </div>
  );
}
