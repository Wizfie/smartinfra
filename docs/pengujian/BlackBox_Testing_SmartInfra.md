# Pengujian Black-Box (Black-Box Testing) — SmartInfra
## Sistem Pendukung Keputusan Pemilihan & Pengadaan Infrastruktur IT

Dokumen ini memuat hasil pengujian kotak hitam (*Black-Box Testing*) untuk sistem **SmartInfra Enterprise Solutions**. Pengujian berfokus pada validasi fungsionalitas antarmuka, kalkulasi matematis SPK SAW, alur pengajuan Request for Quotation (RFQ), kalkulator TCO OpEx vs CapEx, dan penegakan hak akses peran (*Role-Based Access Control* / RBAC).

---

## Tabel Hasil Pengujian Black-Box (11 Skenario Uji)

| ID Uji | Fitur / Modul | Skenario Pengujian | Data Uji (Input) | Hasil yang Diharapkan | Hasil Pengujian Nyata | Kesimpulan |
|:---:|:---|:---|:---|:---|:---|:---:|
| **BB-01** | Autentikasi Pengguna | Login akun Sysadmin Utama | `admin@smartinfra.com` / `admin123` | Sistem memvalidasi kredensial, menyimpan token JWT, dan mengarahkan otomatis ke portal `/admin` | Sesuai Harapan | **Valid** |
| **BB-02** | Autentikasi Pengguna | Login akun IT Solution Architect | `consultant@smartinfra.com` / `consultant123` | Sistem memvalidasi kredensial dan mengarahkan otomatis ke portal `/sales` | Sesuai Harapan | **Valid** |
| **BB-03** | Autentikasi Pengguna | Login dengan kata sandi salah | `admin@smartinfra.com` / `passwordsalah` | Sistem menolak akses dan memunculkan notifikasi *"Email atau kata sandi tidak valid"* | Sesuai Harapan | **Valid** |
| **BB-04** | Keamanan Akses (RBAC) | Akun Solution Architect membuka URL admin secara paksa | Mengakses URL `http://localhost:5174/admin` | Sistem menolak akses (*HTTP 403 Forbidden*) dan mengarahkan kembali ke portal `/sales` | Sesuai Harapan | **Valid** |
| **BB-05** | Rekomendasi SPK SAW | Klien memilih profil beban kerja Software House | Klik profil *"AI & Deep Learning"* (Bobot GPU 35%, RAM 20%, CPU 15%) | Algoritma SAW mengeksekusi normalisasi dan menampilkan peringkat server dengan node GPU VRAM tinggi di peringkat teratas | Sesuai Harapan | **Valid** |
| **BB-06** | Rekomendasi SPK SAW | Penyaringan kategori infrastruktur komputasi | Filter: Kategori *"Dedicated GPU Rigs"*, Anggaran Maks Rp 100.000.000, RAM Min 64GB | Sistem menyaring alternatif yang relevan dan hanya memproses node GPU yang lolos kriteria | Sesuai Harapan | **Valid** |
| **BB-07** | Kalkulator TCO & Financing | Simulasi komparasi sewa bulanan (OpEx) vs investasi (CapEx) | Input harga node Rp 38.000.000, Tenor 24 bulan, DP 20% | Sistem menghitung estimasi angsuran bulanan, biaya operasional harian (*daily burn-rate*), dan komparasi OpEx vs CapEx secara real-time | Sesuai Harapan | **Valid** |
| **BB-08** | *Assisted RFQ Checkout* | Solution Architect membuat draf RFQ atas nama entitas klien | Formulir: PT Teknologi Maju, PIC Teknis, No. WA, Alamat Datacenter, Metode B2B Bank Transfer | Permohonan RFQ berstatus `PENDING` berhasil dibuat dengan nomor faktur resmi (INFRA-XXXX) dan tercatat ID konsultan | Sesuai Harapan | **Valid** |
| **BB-09** | Verifikasi & Provisioning Admin | Admin memverifikasi pembayaran & mengaktifkan SLA | Klik tombol *"Verifikasi & Aktivasi SLA"* pada tab Pesanan Masuk Admin | Status transaksi berubah menjadi `LUNAS (Paid)`, tanggal aktivasi tercatat, dan SLA node menjadi Live | Sesuai Harapan | **Valid** |
| **BB-10** | Monitor Kapasitas Node | Solution Architect memantau ketersediaan instans/unit | Meninjau tabel di tab *Monitor Infrastruktur* portal konsultan | Tabel bersifat *Read-Only* (tanpa akses mutasi alokasi unit), menampilkan status ketersediaan node real-time | Sesuai Harapan | **Valid** |
| **BB-11** | Proteksi Mutasi Alokasi Unit | Akun Konsultan menembak API mutasi stok instans | Request `PATCH /api/infrastructures/:id/stock` dengan token Konsultan | Backend menolak mutasi (*HTTP 403 Forbidden*), alokasi kapasitas hanya dapat dimodifikasi oleh Sysadmin | Sesuai Harapan | **Valid** |

---

## Rekapitulasi Hasil Pengujian
- **Total Kasus Uji:** 11
- **Jumlah Valid:** 11 (100%)
- **Jumlah Tidak Valid:** 0 (0%)
- **Kesimpulan:** Seluruh fungsionalitas sistem, mesin SPK SAW, alur pengadaan RFQ, dan prinsip pemisahan wewenang (*Segregation of Duties*) berjalan sesuai spesifikasi kebutuhan rekayasa perangkat lunak.
