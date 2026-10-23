# SmartInfra — Enterprise IT Infrastructure Decision Support & Advisory System

> **Sistem Pendukung Keputusan (SPK) Pemilihan & Rekomendasi Infrastruktur Komputasi (Cloud Server Instances & Dedicated GPU Rigs) Menggunakan Metode Simple Additive Weighting (SAW) Berbasis Web Terintegrasi Request for Quotation (RFQ) & Multi-Peran**  
> *Tugas Rekayasa Perangkat Lunak (RPL) — Program Studi Teknik Informatika, Universitas Pamulang (UNPAM) 2026*

---

## 1. Tentang Proyek

**SmartInfra** adalah platform *Enterprise B2B Decision Support & Advisory System* yang dirancang untuk mengatasi kompleksitas pengambilan keputusan pengadaan infrastruktur teknologi informasi bagi *Software House*, *Startup*, *AI Research Lab*, serta *Enterprise IT Departments*.

Pengadaan infrastruktur komputasi modern sering kali menghadapi dilema arsitektur:
1. **Model Pengeluaran (OpEx vs. CapEx)**: Membandingkan sewa fleksibel instans cloud per jam/bulan (*OpEx*) versus pembelian rak server/GPU workstation dedicated (*CapEx*) dengan amortisasi 24–36 bulan.
2. **Kesesuaian Beban Kerja (*Workload Matching*)**: Kebutuhan komputasi bervariasi drastis antara arsitektur web/microservices, database big data in-memory, hingga model training AI / Deep Learning.
3. **Multi-Dimensi Spesifikasi & Biaya Tersembunyi**: Keseimbangan antara vCPU/Cores, kapasitas RAM ECC, kecepatan storage NVMe PCIe IOPS, VRAM akselerasi Tensor Core GPU, hingga jaminan *Service Level Agreement* (SLA Uptime 99.99%).

SmartInfra menerapkan metode **Multi-Attribute Decision Making (MADM)** dengan algoritma **Simple Additive Weighting (SAW)** untuk memberikan rekomendasi arsitektur infrastruktur yang objektif, transparan, dan dapat dipertanggungjawabkan secara matematis.

---

## 2. Fitur Utama Sistem

### A. Mesin Rekomendasi SPK SAW Berbasis Workload
- **3 Profil Beban Kerja Software House**:
  - **Web Apps & Microservices Cluster**: Prioritas pada efisiensi biaya cost-per-instance, kestabilan vCPU, dan jaminan uptime SLA tinggi (99.99%).
  - **Database & Big Data Analytics**: Prioritas pada kapasitas RAM raksasa (DDR5 ECC untuk caching Redis/PostgreSQL) dan kecepatan IOPS NVMe PCIe Gen4.
  - **Artificial Intelligence & Deep Learning**: Prioritas mutlak pada dedicated VRAM & Tensor Cores GPU (NVIDIA RTX 4090, A6000 Ada, H100 SXM5).
- **Transparansi Perhitungan Matematis ($X \to R \to V$)**: Audit visual interaktif menampilkan matriks keputusan awal ($X$), matriks ternormalisasi ($R$), bobot preferensi kriteria ($W$), dan skor akhir ($V$) peringkat 1 sampai 10.

### B. Analisis Finansial TCO (Total Cost of Ownership) & Financing Calculator
- **OpEx vs. CapEx Simulation**: Membandingkan biaya operasional sewa bulanan dengan cicilan pengadaan hardware berjangka (tenor 6, 12, 24, hingga 36 bulan).
- **Daily Burn-Rate Metric**: Mengonversi nilai komputasi bulanan ke dalam biaya operasional harian (*Daily Cost*) untuk kalkulasi budget unit proyek software.
- **Enterprise SLA Breakdown**: Transparansi tier datacenter (Tier 3 vs Tier 4) dan garansi *Zero Downtime*.

### C. Manajemen Multi-Peran (Role-Based Access Control)
- **Sysadmin Utama (Role: `admin`)**:
  - Manajemen katalog infrastruktur (Cloud Instances & GPU Rigs).
  - Konfigurasi bobot kriteria SAW ($C_1 - C_6$) dan profil workload secara fleksibel.
  - Audit trail matriks perhitungan matematis SAW.
- **IT Solution Architect & Financing Consultant (Role: `sales`)**:
  - Monitoring pipeline Request for Quotation (RFQ) dan status deployment SLA.
  - Konsultasi TCO & pembiayaan hardware klien enterprise.
- **Klien / Tech Lead Instansi (Guest Customer)**:
  - Akses rekomendasi dan katalog publik tanpa registrasi (*Guest RFQ*).
  - Filter katalog hingga Rp 500.000.000 dan kapasitas RAM hingga 256GB+.
  - Pengajuan RFQ instan, unduh invoice/faktur SLA digital A4, serta pelacakan provisioning server real-time.

---

## 3. Kriteria dan Pemodelan Algoritma SAW

Sistem mengevaluasi setiap alternatif infrastruktur menggunakan 6 kriteria terukur ($C_1 - C_6$):

| Kode | Nama Kriteria | Tipe Atribut | Satuan / Parameter | Penjelasan |
|:---:|---|:---:|---|---|
| **$C_1$** | Biaya Sewa / Investasi Bulanan | **Cost** (Minimasi) | Rupiah (Rp) | Estimasi pengeluaran bulanan (sewa cloud / cicilan investasi hardware). |
| **$C_2$** | Kekuatan Komputasi CPU | **Benefit** (Maksimasi) | Skor Benchmark | Benchmark performa vCPU / Physical Processor Cores. |
| **$C_3$** | Kapasitas Memori RAM | **Benefit** (Maksimasi) | Gigabyte (GB) | Kapasitas RAM DDR4/DDR5 ECC untuk kestabilan multitasking. |
| **$C_4$** | Kecepatan & Kapasitas NVMe | **Benefit** (Maksimasi) | Skor IOPS & GB | Throughput read/write penyimpanan untuk database dan throughput data. |
| **$C_5$** | Akselerasi GPU / VRAM | **Benefit** (Maksimasi) | Gigabyte (GB) | Kapasitas VRAM & Tensor Cores untuk deep learning dan 3D rendering. |
| **$C_6$** | Jaminan Uptime SLA | **Benefit** (Maksimasi) | Persentase (%) | Garansi ketersediaan operasional datacenter tahunan (99.5% s/d 99.99%). |

### Rumus Normalisasi ($R_{ij}$)

$$
R_{ij} = \begin{cases} 
\dfrac{x_{ij}}{\max_i(x_{ij})}, & \text{jika } j \text{ adalah kriteria Benefit} \\[10pt]
\dfrac{\min_i(x_{ij})}{x_{ij}}, & \text{jika } j \text{ adalah kriteria Cost}
\end{cases}
$$

### Rumus Preferensi Akhir ($V_i$)

$$
V_i = \sum_{j=1}^{n} w_j \cdot R_{ij}
$$

---

## 4. Tech Stack & Desain Antarmuka

- **Frontend**: Vue 3 (Composition API), Vite, Pinia Store, Vue Router 4.
- **Styling**: Tailwind CSS dengan tema enterprise **Blue & White / Slate** (`#2563EB`, `#1E40AF`, `#0F172A`, `#F8FAFC`).
- **Icons**: Google Material Symbols Outlined (100% Offline via NPM package).
- **Backend**: Node.js & Express.js RESTful API.
- **Database**: MySQL dengan Prisma ORM.

---

## 5. Cara Menjalankan Aplikasi

### Persyaratan Sistem
- Node.js versi 18+ atau 20+
- MySQL Server (XAMPP / MariaDB aktif di port 3306)

### 1. Backend Setup
```bash
cd backend
npm install
npx prisma db push
npm run seed
npm run dev
```
Backend berjalan pada: `http://localhost:5001`

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend berjalan pada: `http://localhost:5174`

### Kredensial Pengujian
- **Sysadmin Panel**: `admin@smartinfra.com` / `admin123`
- **IT Solution Architect**: `consultant@smartinfra.com` / `consultant123`
- **Klien Publik**: Akses langsung tanpa login untuk pengajuan RFQ & pelacakan status provisioning
