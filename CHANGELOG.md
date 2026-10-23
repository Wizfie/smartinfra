# Change Log — Proyek SmartLap SPK Laptop

Seluruh riwayat perubahan penting, pembaruan fitur, perbaikan bug (*bug fixes*), arsitektur sistem, dan dokumentasi akademik pada sistem **SmartLap (Sistem Pendukung Keputusan Pemilihan Laptop Metode Simple Additive Weighting Berbasis Web)** dicatat dalam dokumen ini.

Format pencatatan ini berpedoman pada [Keep a Changelog](https://keepachangelog.com/id/1.0.0/) dan menganut prinsip [Semantic Versioning](https://semver.org/).

---

## [Unreleased] — 2026-10-15

### 🎨 Visual & UML Architecture (Enterprise Architect v16 Standard)
- **Sequence Diagram Anti-Collision & Multi-line Text Wrap**:
  - Mengimplementasikan *text wrapping* dua baris pada label pesan interaksi sequence diagram (`Poin 2`, `Poin 9`, dan `Poin 10`) untuk mengeliminasi tumpang tindih (*overlap*) terhadap *lifelines* dan kotak aktivasi.
  - Menyeimbangkan jarak horizontal antar-*lifeline* (`User: 120`, `WebClient: 440`, `SPKController: 790`, `SAWService: 1140`, `Database: 1490`).
  - Mengoreksi siklus hidup kotak aktivasi (*execution occurrence*): kotak aktivasi `Database` kini hanya aktif selama eksekusi query (langkah 3 s/d 4), dan kotak aktivasi `SAWService` hanya aktif selama fungsi `calculateSAW` berjalan (langkah 5 s/d 8).
- **Class Diagram & Legend Multiplisitas Resmi**:
  - Menambahkan kotak keterangan (*Legend*) 2 kolom pada *Logical Data Model Class Diagram* yang menjelaskan arti notasi multiplisitas (`1`, `0..*`, `1..*`, `6`), relasi *One-to-Many*, dan dekomposisi *Many-to-Many* melalui *Junction Table* (`OrderItem`, `ProfileCriteriaWeight`, `LaptopCriteriaValue`).
  - Menjelaskan makna spesifik angka multiplisitas `6` sebagai representasi tetap 6 kriteria SAW (C1 Harga, C2 Prosesor, C3 RAM, C4 Storage, C5 GPU, C6 Baterai).
  - Melengkapi rincian simbol visibilitas publik `+`, primary key `[PK]`, foreign key `[FK]`, dan constraint `[Unique]`.
- **Use Case Diagram Refactor**:
  - Merefaktor tata letak diagram ke dalam 3 kolom vertikal independen (Konsumen, Sales, Admin) dengan jalur konektor bebas silang (*no crossed lines*).
  - Menambahkan dependensi formal `<<include>>` (autentikasi sesi JWT & simulasi kredit) dan `<<extend>>` (pelacakan pesanan & audit perhitungan SAW).
- **Activity Diagrams (SPK & Maker-Checker Swimlanes)**:
  - Menyusun Activity Diagram SPK SAW dengan langkah matematis formula Benefit & Cost serta normalisasi matriks $R$.
  - Menyusun Activity Diagram Assisted Checkout dengan 3 *Swimlanes* (*Konsumen*, *Sales Consultant sebagai Maker*, *Admin/Kasir sebagai Checker*).
- **Interoperabilitas Model XMI 2.1 & XML**:
  - Menyinkronkan 100% berkas `SmartLap_Model_Enterprise_Architect.xmi` dan `.xml` agar dapat diimpor langsung ke Sparx Systems Enterprise Architect tanpa galat parsing.
  - Menyusun panduan konfigurasi dan impor resmi pada [README_UML_EA.md](docs/uml_enterprise_architect/README_UML_EA.md).

### 📑 Laporan Skripsi Universitas Pamulang (UNPAM)
- **Pembaruan Naskah Skripsi Word ([Laporan_Skripsi_SmartLap_SPK_SAW.docx](docs/laporan/Laporan_Skripsi_SmartLap_SPK_SAW.docx))**:
  - Menyelaraskan Bab 3 (Analisis dan Perancangan Sistem) dengan diagram visual terbaru beresolusi tinggi (300 DPI).
  - Menambahkan pembahasan akademik terkait definisi multiplisitas relasi dan simbol kelas data model.
  - Melengkapi 11 skenario pengujian fungsional *Black-Box Testing* pada Bab 4 (Autentikasi, RBAC, SPK SAW, Kalkulator Kredit, Pemotongan Stok, Maker-Checker).

---

## [v2.0.0] — 2026-10-10

### 🚀 Role-Based Access Control (RBAC) & Assisted Checkout
- **Fitur Baru Multi-Role User (Admin, Sales Consultant, Konsumen)**:
  - **Portal Sales Consultant (`/sales`)**: Dashboard khusus pramuniaga untuk membantu pelanggan memilih laptop via SPK SAW, melakukan simulasi tenor cicilan, menerbitkan pesanan *Assisted Order*, dan memantau realisasi komisi penjualan (1.5% - 2.5% per unit).
  - **Alur Kerja Maker-Checker**:
    - *Maker*: Sales membuat draft pesanan pelanggan dengan status awal `PENDING`.
    - *Checker*: Administrator/Kasir memvalidasi bukti transfer bank atau persetujuan lembaga pembiayaan kredit (*leasing*).
    - Ketika status diubah menjadi `PAID`, sistem secara otomatis memotong stok laptop di gudang dan mengkreditkan komisi ke akun Sales terkait.
  - **Kalkulator Kredit Multi-Provider**:
    - Integrasi simulasi perhitungan uang muka (DP), bunga tetap per tahun (8% s/d 14%), biaya administrasi, dan angsuran bulanan untuk tenor 6, 12, 18, 24, dan 36 bulan di 10 mitra pembiayaan (BCA Finance, Mandiri Utama Finance, Adira Finance, FIFGROUP, Home Credit, Kredivo, Akulaku, BAF, Indodana, OTO).
- **Backend Service & API (`backend/src`)**:
  - Membuat `salesController.js` dan endpoint API:
    - `POST /api/sales/assisted-order` : Pembuatan pesanan berbantuan oleh Sales.
    - `GET /api/sales/commissions` : Rekapitulasi perolehan komisi pramuniaga.
    - `GET /api/sales/orders` : Monitoring riwayat transaksi penjualan yang ditangani Sales.
  - Menambahkan middleware `authMiddleware.js` dan `roleMiddleware.js` untuk memvalidasi JSON Web Token (JWT) dan mencegah *privilege escalation* (contoh: sales diblokir dari akses rute `/admin`).
  - Memperbarui Prisma schema (`schema.prisma`) dengan menambahkan relasi `salesId` nullable pada model `Order`.
- **Frontend Dashboard (`frontend/src`)**:
  - Mengembangkan tampilan `SalesDashboardView.vue` dengan tab interaktif (Katalog & Konsultasi SPK, Pembuatan SPK Transaksi, Status Verifikasi, Rekap Komisi).
  - Mengintegrasikan guard rute `vue-router` pada `frontend/src/router/index.js` untuk proteksi rute berbasis peran (*Role-Based Guards*).

---

## [v1.5.0] — 2026-09-28

### ⚙️ Engine SPK Simple Additive Weighting (SAW)
- **Algoritma SAW Terverifikasi**:
  - Mengimplementasikan 6 kriteria keputusan:
    1. **C1 (Harga Laptop)**: Tipe *Cost* (bobot default 20% - 30%).
    2. **C2 (Skor Benchmark Prosesor)**: Tipe *Benefit* (bobot default 20% - 25%).
    3. **C3 (Kapasitas RAM)**: Tipe *Benefit* (bobot default 15% - 20%).
    4. **C4 (Kapasitas & Tipe Penyimpanan/SSD)**: Tipe *Benefit* (bobot default 10% - 15%).
    5. **C5 (Skor Benchmark GPU / Kartu Grafis)**: Tipe *Benefit* (bobot default 10% - 25%).
    6. **C6 (Daya Tahan Baterai)**: Tipe *Benefit* (bobot default 5% - 15%).
  - Normalisasi Matriks Keputusan ($R$):
    - Atribut Benefit: $r_{ij} = \frac{x_{ij}}{\max(x_j)}$
    - Atribut Cost: $r_{ij} = \frac{\min(x_j)}{x_{ij}}$
  - Perhitungan Nilai Preferensi Alternatif ($V_i$):
    - $V_i = \sum_{j=1}^{n} w_j \cdot r_{ij}$
    - Konversi otomatis ke persentase skor kecocokan (*Match Percentage*).
- **Persona Kebutuhan Pengguna (User Profiles)**:
  - Menyediakan 6 profil persona siap pakai dengan kombinasi bobot terkalibrasi:
    - *Mahasiswa / Office*: Penekanan pada harga terjangkau (C1) dan baterai tahan lama (C6).
    - *Gamer*: Penekanan pada performa GPU (C5), prosesor (C2), dan RAM (C3).
    - *Desainer Grafis / Editor Video*: Penekanan seimbang pada GPU (C5), prosesor (C2), dan RAM (C3).
    - *Software Engineer / Programmer*: Penekanan pada RAM besar (C3) dan prosesor kencang (C2).
    - *Eksekutif Bisnis / Mobile*: Penekanan pada bobot ringan dan baterai awet (C6).
    - *Kustom Bobot Mandiri*: Pengguna bebas menentukan persentase bobot tiap kriteria dengan validasi normalisasi total $\sum w = 100\%$.
- **Audit & Transparansi Perhitungan**:
  - Menyediakan drawer/modal matriks detail yang menampilkan matriks data mentah ($X$), matriks terternomalisasi ($R$), vektor bobot ($W$), dan hasil preferensi akhir ($V$) untuk validitas ilmiah.

---

## [v1.0.0] — 2026-09-15

### 📦 Inisialisasi Proyek & Katalog Dasar
- **Pondasi Arsitektur Fullstack**:
  - Backend: Node.js runtime, Express.js framework, Prisma ORM v5, MySQL 8.0.
  - Frontend: Vue.js 3 Composition API, Vite build tool, Pinia state management, Tailwind CSS.
  - Konfigurasi master database seeder (`masterSeed.js`) memuat puluhan unit katalog laptop nyata (ASUS ROG, Lenovo Legion, Lenovo ThinkPad, Apple MacBook Air/Pro, Acer Swift, HP Pavilion, Dell XPS).
- **Fitur Dasar E-Commerce**:
  - Pencarian dan penyaringan laptop berdasarkan rentang anggaran (*budget slider*), ukuran RAM, dan merk.
  - Antarmuka katalog modern responsif (desain kartu laptop, spesifikasi rinci, lencana ketersediaan stok).
  - Modul keranjang belanja (*shopping cart*) dan formulir pemesanan mandiri (*self-checkout*).
