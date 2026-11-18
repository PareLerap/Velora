# VELORA — E-Commerce Marketplace

**Everything You Need, In One Place.**

VELORA merupakan aplikasi e-commerce marketplace berbasis web yang dikembangkan menggunakan Next.js. Aplikasi ini dirancang untuk menghubungkan penjual dan pembeli dalam satu platform digital dengan sistem pengelolaan produk, toko, transaksi, dan pengguna.

## 1. Latar Belakang

Perkembangan teknologi informasi mendorong aktivitas jual beli beralih ke platform digital. Marketplace menjadi salah satu solusi yang memudahkan penjual dalam memasarkan produk dan pembeli dalam menemukan barang yang dibutuhkan.

VELORA dikembangkan sebagai aplikasi marketplace yang menyediakan sistem pengelolaan dengan beberapa jenis pengguna, yaitu Admin, Seller, dan Buyer. Setiap pengguna memiliki hak akses dan fungsi yang berbeda sesuai perannya.

## 2. Tujuan Pengembangan

- Membangun platform marketplace berbasis web.
- Mempermudah penjual dalam mengelola toko dan produk.
- Mempermudah pembeli dalam mencari dan melakukan pemesanan produk.
- Menyediakan pengelolaan transaksi dan pesanan secara terstruktur.
- Menerapkan sistem autentikasi dan hak akses berdasarkan role pengguna.

## 3. Teknologi yang Digunakan

| Teknologi | Kegunaan |
|---|---|
| Next.js | Framework pengembangan aplikasi web |
| React.js | Membangun komponen antarmuka |
| JavaScript (JSX) | Bahasa pemrograman aplikasi |
| Tailwind CSS | Mengatur tampilan dan desain |
| PostgreSQL | Sistem manajemen basis data |
| Raw SQL | Membuat dan mengelola query database |
| Git & GitHub | Version control dan penyimpanan kode |

## 4. Jenis Pengguna dan Hak Akses

### Admin
- Mengelola data pengguna.
- Menyetujui atau menolak pendaftaran seller.
- Mengelola kategori produk.
- Menghapus produk yang bermasalah.

### Seller
- Mengelola informasi toko.
- Menambahkan, mengubah, dan menghapus produk.
- Mengelola stok produk.
- Melihat pesanan masuk.
- Memperbarui status pesanan.

### Buyer
- Melihat dan mencari produk.
- Mengelola profil pengguna.
- Menambahkan produk ke keranjang.
- Melakukan checkout.
- Melihat riwayat dan status pesanan.
- Memberikan ulasan setelah pesanan selesai.

### Guest
- Melihat halaman utama marketplace.
- Melihat daftar dan detail produk.
- Melihat kategori produk.
- Melakukan login atau registrasi untuk mengakses fitur pengguna.

## 5. Fitur Utama yang Direncanakan

1. **Authentication & Authorization** — Login, registrasi, dan pengaturan hak akses pengguna.
2. **Product Management** — Pengelolaan produk dan stok.
3. **Category Management** — Pengelolaan kategori produk.
4. **Store Management** — Pengelolaan informasi toko seller.
5. **Shopping Cart** — Pengelolaan keranjang belanja.
6. **Checkout** — Proses pembuatan pesanan tanpa payment gateway.
7. **Order Management** — Pengelolaan dan pelacakan pesanan.
8. **Review & Rating** — Penilaian produk berdasarkan pesanan yang telah selesai.

## 6. Struktur Database yang Direncanakan

Database VELORA direncanakan memiliki tabel berikut:

| Tabel | Fungsi |
|---|---|
| users | Menyimpan data pengguna |
| stores | Menyimpan informasi toko |
| categories | Menyimpan kategori produk |
| products | Menyimpan data produk |
| carts | Menyimpan keranjang pengguna |
| cart_items | Menyimpan detail isi keranjang |
| orders | Menyimpan data pesanan |
| order_items | Menyimpan detail produk dalam pesanan |
| reviews | Menyimpan ulasan dan rating |

## 7. Instalasi dan Menjalankan Project

Pastikan Node.js dan npm sudah terpasang.

**Langkah 1 — Clone repository**

```bash
git clone https://github.com/PareLerap/Velora.git
```

**Langkah 2 — Masuk ke folder project**

```bash
cd Velora
```

**Langkah 3 — Install dependencies**

```bash
npm install
```

**Langkah 4 — Jalankan development server**

```bash
npm run dev
```

**Langkah 5 — Buka aplikasi**

Akses alamat berikut melalui browser:

```text
http://localhost:3000
```

## 8. Struktur Folder Project

```text
velora/
├── public/
├── src/
│   └── app/
│       ├── favicon.ico
│       ├── globals.css
│       ├── layout.js
│       └── page.js
├── .gitignore
├── package.json
├── package-lock.json
├── next.config.mjs
└── README.md
```

Struktur folder dapat berkembang sesuai penambahan fitur dan kebutuhan aplikasi.

## 9. Pengembangan Project

Pengembangan VELORA dilakukan secara bertahap, meliputi:

1. Inisialisasi project dan pembuatan tampilan awal.
2. Perancangan database PostgreSQL.
3. Implementasi autentikasi dan hak akses pengguna.
4. Pengembangan halaman marketplace dan pengelolaan produk.
5. Implementasi fitur keranjang dan checkout.
6. Pengembangan dashboard seller dan admin.
7. Pengujian fitur dan perbaikan sistem.

## 10. Status Pengembangan

Saat README ini dibuat, project telah memiliki:

- Inisialisasi project Next.js.
- Konfigurasi Tailwind CSS.
- Tampilan awal homepage VELORA.
- Repository GitHub dan version control Git.

Fitur database, autentikasi, transaksi, dan dashboard masih dalam tahap pengembangan.

## 11. Repository

GitHub: https://github.com/PareLerap/Velora

---

**VELORA — Everything You Need, In One Place.**

Developed as an individual final project for Web Programming Practicum, 2026.
