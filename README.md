
# VELORA — E-Commerce Marketplace

**Everything You Need, In One Place.**

VELORA merupakan aplikasi e-commerce marketplace berbasis web yang dikembangkan menggunakan Next.js, Tailwind CSS, dan PostgreSQL. Aplikasi ini menghubungkan penjual dan pembeli dalam satu platform digital dengan sistem pengelolaan produk, toko, keranjang belanja, transaksi, dan pengguna.

VELORA menerapkan sistem multi-role yang terdiri dari Admin, Seller, dan Buyer. Setiap pengguna memiliki hak akses dan fitur yang berbeda sesuai dengan perannya.

## 1. Latar Belakang

Perkembangan teknologi informasi membuat aktivitas jual beli semakin banyak dilakukan melalui platform digital. Marketplace menjadi salah satu solusi yang memudahkan penjual dalam memasarkan produknya dan membantu pembeli menemukan barang yang dibutuhkan.

VELORA dikembangkan sebagai aplikasi marketplace dengan sistem pengelolaan yang terintegrasi, mulai dari pendaftaran pengguna, pengelolaan toko, katalog produk, keranjang belanja, hingga pemrosesan pesanan.

## 2. Tujuan Pengembangan

- Membangun platform marketplace berbasis web.
- Mempermudah Seller dalam mengelola toko, produk, dan pesanan.
- Mempermudah Buyer mencari, memilih, dan membeli produk.
- Menerapkan sistem keranjang belanja dan checkout.
- Menyediakan pengelolaan transaksi yang terstruktur.
- Menerapkan autentikasi dan otorisasi berdasarkan role pengguna.
- Mengintegrasikan aplikasi dengan database PostgreSQL.

## 3. Teknologi yang Digunakan

| Teknologi | Kegunaan |
|---|---|
| Next.js | Framework utama aplikasi |
| React.js | Membangun komponen antarmuka |
| JavaScript (JSX) | Bahasa pemrograman aplikasi |
| Tailwind CSS | Styling dan desain responsif |
| PostgreSQL | Penyimpanan data aplikasi |
| Raw SQL | Pengelolaan dan manipulasi database |
| Node.js | Runtime JavaScript |
| bcryptjs | Hashing dan verifikasi password |
| Git & GitHub | Version control dan repository |

## 4. Jenis Pengguna dan Hak Akses

### Admin

Admin memiliki hak akses untuk mengelola aktivitas marketplace, meliputi:

- Melihat dashboard Admin.
- Mengelola data pengguna.
- Menyetujui atau menolak pendaftaran Seller.
- Mengelola kategori produk.
- Mengawasi data produk marketplace.
- Mengelola produk sesuai hak akses Admin.

### Seller

Seller merupakan pengguna yang dapat mengelola toko setelah mendapatkan persetujuan Admin.

Fitur Seller meliputi:

- Mengelola informasi toko.
- Menambahkan produk baru.
- Mengubah informasi produk.
- Mengelola harga dan stok.
- Mengaktifkan atau menonaktifkan produk.
- Melihat pesanan yang masuk.
- Memperbarui status pesanan.
- Mengelola produk berdasarkan toko masing-masing.

### Buyer

Buyer merupakan pengguna yang dapat melakukan aktivitas pembelian produk.

Fitur Buyer meliputi:

- Melihat katalog dan detail produk.
- Mencari produk berdasarkan kata kunci.
- Melihat kategori produk.
- Menambahkan produk ke keranjang belanja.
- Menambah atau mengurangi jumlah barang.
- Menghapus produk dari keranjang.
- Melakukan pembelian langsung melalui Buy Now.
- Melakukan checkout dari keranjang.
- Melihat riwayat dan status pesanan.
- Memberikan rating dan ulasan setelah pesanan selesai.

### Guest

Pengunjung yang belum login dapat:

- Melihat homepage VELORA.
- Menjelajahi katalog produk.
- Melihat informasi dan detail produk.
- Mengakses halaman login dan registrasi.

## 5. Fitur Utama

### 5.1 Authentication & Authorization

VELORA menyediakan sistem registrasi, login, logout, dan pengaturan hak akses berdasarkan role.

Password pengguna disimpan dalam bentuk hash menggunakan bcryptjs. Sistem juga membatasi akses halaman serta operasi tertentu sesuai dengan role pengguna.

### 5.2 Product Management

Seller dapat melakukan pengelolaan produk, seperti:

- Menambahkan produk.
- Mengubah informasi produk.
- Mengelola harga dan stok.
- Mengaktifkan atau menonaktifkan produk.
- Mengelola gambar produk.

Produk yang tidak aktif, stoknya habis, atau berasal dari toko yang belum disetujui tidak ditampilkan dalam katalog All Products.

### 5.3 Category Management

Admin dapat menambahkan, mengubah, dan menghapus kategori produk. Kategori digunakan untuk mengelompokkan produk dalam marketplace.

### 5.4 Store Management

Seller dapat mengelola informasi toko. Toko harus mendapatkan persetujuan Admin agar produk dapat dipasarkan.

### 5.5 Shopping Cart

VELORA menyediakan sistem keranjang belanja yang terhubung langsung dengan PostgreSQL.

Fitur keranjang meliputi:

- Menambahkan produk ke keranjang.
- Menyimpan beberapa produk.
- Mengubah jumlah barang menggunakan tombol tambah dan kurang.
- Menghapus produk dari keranjang.
- Menghitung subtotal dan total harga.
- Menampilkan jumlah barang pada ikon keranjang di Navbar.
- Menyimpan isi keranjang setelah halaman di-refresh.

### 5.6 Checkout

VELORA menyediakan dua metode pemesanan:

**Buy Now**

Buyer dapat membeli produk secara langsung dari halaman detail produk.

**Checkout Cart**

Buyer dapat melakukan checkout terhadap seluruh produk dalam keranjang.

Sistem checkout melakukan validasi stok, harga, status produk, dan status toko sebelum pesanan dibuat.

Jika produk berasal dari Seller berbeda, sistem membuat pesanan terpisah untuk setiap Seller.

Proses checkout menggunakan transaksi database PostgreSQL dengan mekanisme `BEGIN`, `COMMIT`, dan `ROLLBACK` untuk menjaga konsistensi data.

VELORA belum menggunakan payment gateway. Pesanan yang berhasil dibuat memiliki status awal `pending`.

### 5.7 Order Management

Sistem menyediakan pengelolaan pesanan dengan status:

- `pending`
- `processing`
- `shipped`
- `completed`
- `cancelled`

Seller dapat memperbarui status pesanan melalui dashboard, sedangkan Buyer dapat melihat status pesanan melalui halaman My Orders.

### 5.8 Review & Rating

Buyer dapat memberikan ulasan terhadap produk yang sudah dibeli dengan pesanan berstatus `completed`.

Fitur ulasan meliputi:

- Rating 1–5 bintang.
- Komentar produk.
- Perhitungan rata-rata rating.
- Tampilan ulasan pada halaman detail produk.
- Pembatasan satu ulasan per Buyer untuk setiap produk.

Data ulasan tersimpan di database PostgreSQL.

### 5.9 Search & Product Catalog

VELORA menyediakan fitur pencarian produk berdasarkan kata kunci.

Sistem menampilkan produk yang sesuai dengan pencarian dan memberikan informasi jika tidak ditemukan produk yang cocok.

Halaman All Products menyediakan daftar produk yang tersedia untuk dibeli.

Katalog demo mencakup produk dari kategori Elektronik, Fashion, Makanan, Kecantikan, dan Rumah Tangga.

Produk dikelola oleh beberapa toko berikut:

| Nama Toko | Kategori Produk |
|---|---|
| Velora Tech Store | Elektronik |
| VELORA Fashion Official | Fashion |
| Daily Bites | Makanan |
| Aura Beauty | Kecantikan |
| Homely Living | Rumah Tangga |

## 6. Struktur Database

VELORA menggunakan PostgreSQL dengan tabel utama berikut:

| Tabel | Fungsi |
|---|---|
| `users` | Menyimpan data akun dan role pengguna |
| `stores` | Menyimpan informasi toko |
| `categories` | Menyimpan kategori produk |
| `products` | Menyimpan data produk, harga, gambar, dan stok |
| `carts` | Menyimpan keranjang Buyer |
| `cart_items` | Menyimpan isi keranjang |
| `orders` | Menyimpan data pesanan |
| `order_items` | Menyimpan detail produk dalam pesanan |
| `reviews` | Menyimpan rating dan ulasan produk |

Relasi database digunakan untuk menghubungkan pengguna, toko, produk, pesanan, keranjang, dan ulasan.

## 7. Instalasi dan Menjalankan Project

### Persyaratan

Pastikan perangkat telah memiliki:

- Node.js
- npm
- PostgreSQL
- Git

### Langkah 1 — Clone Repository

```bash
git clone https://github.com/PareLerap/Velora.git
```

### Langkah 2 — Masuk ke Folder Project

```bash
cd Velora
```

### Langkah 3 — Install Dependencies

```bash
npm install
```

### Langkah 4 — Konfigurasi Database

Buat database PostgreSQL kosong bernama `velora_db` melalui pgAdmin atau PostgreSQL.

```sql
CREATE DATABASE velora_db;
```

Project ini menyediakan file backup lengkap database yang berada pada:

```text
DATABASE/velora_demo_full.sql
```

File tersebut berisi struktur tabel, relasi, kategori, akun demo, toko, produk, dan data pengujian aplikasi.

Untuk melakukan import database, jalankan perintah berikut melalui terminal pada root folder project:

```bash
psql -U postgres -d velora_db -v ON_ERROR_STOP=1 -f "DATABASE/velora_demo_full.sql"
```

Jika perintah `psql` belum tersedia pada PATH Windows, gunakan PowerShell dengan lokasi instalasi PostgreSQL yang sesuai. Contoh untuk PostgreSQL 18:

```powershell
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -d velora_db -v ON_ERROR_STOP=1 -f "DATABASE/velora_demo_full.sql"
```

Masukkan password PostgreSQL lokal apabila diminta.

File `velora_demo_full.sql` merupakan backup lengkap sehingga tidak perlu menjalankan file SQL 01–04 secara terpisah setelah melakukan import.

Pastikan proses import dilakukan pada database kosong untuk menghindari duplikasi tabel dan data.

### Langkah 5 — Konfigurasi Environment Variables

Buat file `.env.local` pada root folder project.

Sesuaikan nama variabel dan nilai konfigurasi koneksi PostgreSQL dengan konfigurasi yang digunakan pada file `src/lib/db.js`.

Gunakan database `velora_db` dan tambahkan variabel `JWT_SECRET` dengan panjang minimal 32 karakter.

Untuk menghasilkan JWT_SECRET secara acak, jalankan perintah berikut:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Masukkan hasil tersebut sebagai nilai `JWT_SECRET` pada file `.env.local`.

File `.env.local`, password PostgreSQL asli, dan JWT_SECRET bersifat rahasia dan tidak boleh diunggah ke GitHub.

### Langkah 6 — Jalankan Development Server

```bash
npm run dev
```

### Langkah 7 — Buka Aplikasi

Akses alamat berikut melalui browser:

```text
http://localhost:3000
```

### Langkah 8 — Production Build

Untuk memeriksa apakah aplikasi berhasil dikompilasi:

```bash
npm run build
```

Menjalankan aplikasi dalam mode production:

```bash
npm run start
```

## 8. Akun Demo

Untuk mempermudah proses demonstrasi dan pengujian aplikasi, VELORA menyediakan akun demo berdasarkan masing-masing role pengguna.

| Role | Email | Password | Nama Toko |
|---|---|---|---|
| Admin | admin@velora.test | VeloraDemo123! | - |
| Seller | seller@velora.test | VeloraDemo2026! | Velora Tech Store |
| Seller | testseller@velora.test | VeloraTest123! | VELORA Fashion Official |
| Seller | dailybites@velora.test | VeloraTest123! | Daily Bites |
| Seller | aurabeauty@velora.test | VeloraTest123! | Aura Beauty |
| Seller | homelyliving@velora.test | VeloraTest123! | Homely Living |
| Buyer | testbuyer@velora.test | VeloraTest123! | - |

### Kegunaan Akun Demo

- **Admin:** Menguji dashboard Admin, pengelolaan pengguna, persetujuan Seller, kategori, dan produk.
- **Seller:** Menguji pengelolaan toko, produk, stok, serta pemrosesan pesanan.
- **Buyer:** Menguji katalog produk, keranjang belanja, checkout, riwayat pesanan, serta rating dan ulasan.

Akun demo dapat digunakan melalui halaman login:

```text
http://localhost:3000/login
```

Data akun demo telah disertakan dalam backup database `velora_demo_full.sql`.

Seluruh akun demo disediakan khusus untuk keperluan demonstrasi dan pengujian lokal, bukan untuk penggunaan pada lingkungan production.

## 9. Struktur Folder Project

```text
velora/
├── DATABASE/
│   ├── 01_create_tables.sql
│   ├── 02_insert_data.sql
│   ├── 03_update_tables.sql
│   ├── 04_update_images.sql
│   ├── velora_demo_full.sql
│   └── generate_password.cjs
│
├── public/
│   └── images/
│       └── products/
│
├── src/
│   ├── app/
│   │   ├── admin/
│   │   ├── seller/
│   │   ├── products/
│   │   │   ├── page.js
│   │   │   └── [id]/
│   │   │       ├── page.js
│   │   │       ├── actions.js
│   │   │       └── review-actions.js
│   │   ├── cart/
│   │   │   ├── page.js
│   │   │   ├── actions.js
│   │   │   └── checkout-actions.js
│   │   ├── orders/
│   │   ├── login/
│   │   ├── register/
│   │   ├── globals.css
│   │   ├── layout.js
│   │   └── page.js
│   │
│   ├── components/
│   │   └── VeloraNavbar.jsx
│   │
│   ├── lib/
│   │   ├── db.js
│   │   ├── auth.js
│   │   └── authorization.js
│   │
│   └── queries/
│
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

Struktur di atas menunjukkan folder dan file utama yang digunakan dalam pengembangan VELORA.

Seluruh file SQL disimpan pada folder `DATABASE` di luar folder aplikasi.

## 10. Alur Penggunaan Sistem

1. Pengguna melakukan registrasi sebagai Buyer atau Seller.
2. Admin melakukan persetujuan terhadap pendaftaran Seller.
3. Seller yang telah disetujui dapat mengelola toko dan produk.
4. Buyer dapat mencari serta melihat detail produk.
5. Buyer dapat melakukan pembelian langsung atau menambahkan produk ke keranjang.
6. Sistem memvalidasi stok dan membuat pesanan.
7. Seller menerima dan memproses pesanan.
8. Buyer memantau status pesanan.
9. Setelah pesanan selesai, Buyer dapat memberikan rating dan ulasan produk.

## 11. Pengujian Sistem

Beberapa pengujian yang telah dilakukan selama pengembangan:

- Pengujian login menggunakan password yang salah.
- Pengujian registrasi dengan email duplikat.
- Pengujian akses halaman berdasarkan role.
- Pengujian checkout dan perubahan stok.
- Pengujian penyimpanan data pesanan di PostgreSQL.
- Pengujian checkout ketika stok tidak mencukupi.
- Pengujian penambahan, perubahan jumlah, dan penghapusan produk dalam keranjang.
- Pengujian checkout keranjang.
- Pengujian ulasan dan pencegahan ulasan ganda.
- Pengujian fitur pencarian.
- Pengujian tampilan produk aktif dan nonaktif.
- Pengujian registrasi dan persetujuan Seller baru.
- Pengujian pengelolaan toko oleh Seller.
- Pengujian penambahan produk dari beberapa toko.
- Pengujian kompilasi menggunakan `npm run build` selama pengembangan.
- Pengujian backup dan import database.
- Pengujian import backup pada database terpisah bernama `velora_test`.
- Verifikasi jumlah data setelah proses import database.

Pengujian dilakukan secara bertahap dan disertai perbaikan ketika ditemukan kesalahan.

## 12. Status Pengembangan

Per 25 November 2026, VELORA telah memiliki fitur utama marketplace yang dapat dijalankan dan diuji.

Fitur yang telah diimplementasikan meliputi:

- Sistem autentikasi dan multi-role.
- Dashboard Admin dan Seller.
- Pengelolaan produk dan kategori.
- Sistem persetujuan Seller.
- Pengelolaan beberapa toko dalam satu marketplace.
- Keranjang belanja.
- Checkout langsung dan checkout keranjang.
- Manajemen pesanan.
- Ulasan dan rating produk.
- Pencarian dan katalog produk.
- Validasi stok dan transaksi database.
- Backup lengkap database beserta data demo.

Katalog produk telah diperbarui dengan penambahan beberapa toko dan produk dari berbagai kategori.

Backup database telah berhasil diimpor pada database pengujian terpisah untuk memastikan struktur dan data dapat digunakan kembali.

Proyek berada pada tahap akhir pengujian aplikasi, pemeriksaan production build, dan persiapan presentasi.

## 13. Repository

GitHub: https://github.com/PareLerap/Velora

---

**VELORA — Everything You Need, In One Place.**

Developed as an individual final project for Web Programming Practicum, 2026.
