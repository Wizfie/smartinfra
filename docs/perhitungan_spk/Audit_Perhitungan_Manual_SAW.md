# Audit Perhitungan Matematis Algoritma SAW — SmartInfra
## Sistem Pendukung Keputusan Pemilihan & Pengadaan Infrastruktur IT

Dokumen ini memuat pembuktian matematis langkah demi langkah (*step-by-step mathematical audit*) untuk algoritma **Simple Additive Weighting (SAW)** pada sistem **SmartInfra Enterprise Solutions**, yang berfungsi sebagai dokumen pembuktian validasi antara hitungan manual dengan keluaran sistem di **BAB III & BAB IV Laporan Rekayasa Perangkat Lunak (RPL)**.

---

## 1. Penetapan Kriteria & Bobot Preferensi

Misalkan sebuah Software House atau AI Lab memilih profil beban kerja **"Artificial Intelligence & Deep Learning"** dengan bobot preferensi kriteria sebagai berikut:

| Simbol | Kriteria | Sifat Atribut | Bobot ($W_j$) | Keterangan & Dasar Pertimbangan |
|:---:|:---|:---:|:---:|:---|
| **C1** | Biaya Sewa Bulanan / Investasi | **Cost** | **0.15 (15%)** | Biaya sewa cloud atau amortisasi hardware bulanan (semakin hemat semakin baik). |
| **C2** | Kekuatan Komputasi Processor (CPU) | **Benefit** | **0.15 (15%)** | Benchmark skor multi-core vCPU/Physical Core untuk preprocessing data. |
| **C3** | Kapasitas Memori RAM | **Benefit** | **0.20 (20%)** | Kapasitas RAM DDR4/DDR5 ECC untuk memuat dataset ke memori kerja. |
| **C4** | Kecepatan & Kapasitas NVMe | **Benefit** | **0.10 (10%)** | Throughput IOPS read/write untuk checkpoint model dan caching data. |
| **C5** | Kapasitas Akselerasi GPU / VRAM | **Benefit** | **0.35 (35%)** | Kapasitas VRAM & Tensor Cores mutlak untuk komputasi tensor paralel. |
| **C6** | Jaminan Uptime SLA Keandalan | **Benefit** | **0.05 (5%)** | Garansi ketersediaan operasional datacenter tahunan (99.5% s/d 99.99%). |
| **Total** | | | **1.00 (100%)** | $\sum W_j = 1.0$ |

---

## 2. Alternatif Sampel Infrastruktur Komputasi

Diambil 3 sampel alternatif infrastruktur dari katalog SmartInfra:

| Kode | Nama Infrastruktur | C1: Biaya (IDR/Bln) | C2: CPU (Skor) | C3: RAM (GB) | C4: NVMe (GB) | C5: GPU (VRAM GB) | C6: SLA (%) |
|:---:|:---|:---:|:---:|:---:|:---:|:---:|:---:|
| **A1** | AWS EC2 c6i.4xlarge (Cloud Compute) | Rp 7.800.000 | 88.00 | 32 | 500 | 0 | 99.99% |
| **A2** | NVIDIA RTX 4090 Workstation Rig | Rp 14.500.000 | 94.00 | 64 | 2000 | 24 | 99.50% |
| **A3** | NVIDIA RTX A6000 Ada Dual GPU Node | Rp 38.000.000 | 98.00 | 128 | 4000 | 96 | 99.80% |

---

## 3. Langkah 1: Pembentukan Matriks Keputusan ($X$)

$$X = \begin{pmatrix}
7800000 & 88.00 & 32 & 500 & 0 & 99.99 \\
14500000 & 94.00 & 64 & 2000 & 24 & 99.50 \\
38000000 & 98.00 & 128 & 4000 & 96 & 99.80
\end{pmatrix}$$

---

## 4. Langkah 2: Menentukan Nilai Ekstrem Kriteria

- **Kriteria Biaya (Cost):**
  - $\min(C1) = \min(7800000, 14500000, 38000000) = \mathbf{7.800.000}$
- **Kriteria Keuntungan (Benefit):**
  - $\max(C2) = \max(88.00, 94.00, 98.00) = \mathbf{98.00}$
  - $\max(C3) = \max(32, 64, 128) = \mathbf{128}$
  - $\max(C4) = \max(500, 2000, 4000) = \mathbf{4000}$
  - $\max(C5) = \max(0, 24, 96) = \mathbf{96}$
  - $\max(C6) = \max(99.99, 99.50, 99.80) = \mathbf{99.99}$

---

## 5. Langkah 3: Normalisasi Matriks Keputusan ($R$)

Formula normalisasi:
- Kriteria Benefit: $r_{ij} = \frac{x_{ij}}{\max_i(x_{ij})}$
- Kriteria Cost: $r_{ij} = \frac{\min_i(x_{ij})}{x_{ij}}$

### Perhitungan Normalisasi Elemen per Elemen:
- **Baris 1 (A1: AWS EC2 c6i.4xlarge):**
  - $r_{11} = \frac{7800000}{7800000} = \mathbf{1.0000}$
  - $r_{12} = \frac{88.00}{98.00} = \mathbf{0.8980}$
  - $r_{13} = \frac{32}{128} = \mathbf{0.2500}$
  - $r_{14} = \frac{500}{4000} = \mathbf{0.1250}$
  - $r_{15} = \frac{0}{96} = \mathbf{0.0000}$
  - $r_{16} = \frac{99.99}{99.99} = \mathbf{1.0000}$

- **Baris 2 (A2: NVIDIA RTX 4090 Workstation Rig):**
  - $r_{21} = \frac{7800000}{14500000} = \mathbf{0.5379}$
  - $r_{22} = \frac{94.00}{98.00} = \mathbf{0.9592}$
  - $r_{23} = \frac{64}{128} = \mathbf{0.5000}$
  - $r_{24} = \frac{2000}{4000} = \mathbf{0.5000}$
  - $r_{25} = \frac{24}{96} = \mathbf{0.2500}$
  - $r_{26} = \frac{99.50}{99.99} = \mathbf{0.9951}$

- **Baris 3 (A3: NVIDIA RTX A6000 Ada Dual GPU Node):**
  - $r_{31} = \frac{7800000}{38000000} = \mathbf{0.2053}$
  - $r_{32} = \frac{98.00}{98.00} = \mathbf{1.0000}$
  - $r_{33} = \frac{128}{128} = \mathbf{1.0000}$
  - $r_{34} = \frac{4000}{4000} = \mathbf{1.0000}$
  - $r_{35} = \frac{96}{96} = \mathbf{1.0000}$
  - $r_{36} = \frac{99.80}{99.99} = \mathbf{0.9981}$

$$R = \begin{pmatrix}
1.0000 & 0.8980 & 0.2500 & 0.1250 & 0.0000 & 1.0000 \\
0.5379 & 0.9592 & 0.5000 & 0.5000 & 0.2500 & 0.9951 \\
0.2053 & 1.0000 & 1.0000 & 1.0000 & 1.0000 & 0.9981
\end{pmatrix}$$

---

## 6. Langkah 4: Kalkulasi Nilai Preferensi ($V_i$) & Perangkingan Akhir

Formula preferensi:
$$V_i = \sum_{j=1}^{n} w_j \cdot r_{ij}$$

Vektor Bobot: $W = [0.15, 0.15, 0.20, 0.10, 0.35, 0.05]$

- **$V_1$ (AWS EC2 c6i.4xlarge):**
  $$\begin{aligned}
  V_1 &= (0.15 \times 1.0000) + (0.15 \times 0.8980) + (0.20 \times 0.2500) + (0.10 \times 0.1250) + (0.35 \times 0.0000) + (0.05 \times 1.0000) \\
  &= 0.1500 + 0.1347 + 0.0500 + 0.0125 + 0.0000 + 0.0500 \\
  &= \mathbf{0.3972} \quad (39.7\%)
  \end{aligned}$$

- **$V_2$ (NVIDIA RTX 4090 Workstation Rig):**
  $$\begin{aligned}
  V_2 &= (0.15 \times 0.5379) + (0.15 \times 0.9592) + (0.20 \times 0.5000) + (0.10 \times 0.5000) + (0.35 \times 0.2500) + (0.05 \times 0.9951) \\
  &= 0.0807 + 0.1439 + 0.1000 + 0.0500 + 0.0875 + 0.0498 \\
  &= \mathbf{0.5119} \quad (51.2\%)
  \end{aligned}$$

- **$V_3$ (NVIDIA RTX A6000 Ada Dual GPU Node):**
  $$\begin{aligned}
  V_3 &= (0.15 \times 0.2053) + (0.15 \times 1.0000) + (0.20 \times 1.0000) + (0.10 \times 1.0000) + (0.35 \times 1.0000) + (0.05 \times 0.9981) \\
  &= 0.0308 + 0.1500 + 0.2000 + 0.1000 + 0.3500 + 0.0499 \\
  &= \mathbf{0.8807} \quad (88.1\%)
  \end{aligned}$$

---

## 7. Tabel Kesimpulan & Perangkingan Rekomendasi

| Peringkat | Alternatif | Nilai $V_i$ | Kesesuaian (%) | Status Rekomendasi & Analisis Arsitektural |
|:---:|:---|:---:|:---:|:---|
| **1** | **A3: NVIDIA RTX A6000 Ada Dual GPU Node** | **0.8807** | **88.1%** | **Pilihan Utama (Best Match)**: Memiliki 96GB VRAM dan CPU/RAM maksimum yang selaras sempurna dengan beban kerja Deep Learning. |
| **2** | **A2: NVIDIA RTX 4090 Workstation Rig** | **0.5119** | **51.2%** | **Alternatif Terjangkau (Budget GPU)**: Cocok untuk tahap prototyping atau fine-tuning model skala kecil (24GB VRAM). |
| **3** | **A1: AWS EC2 c6i.4xlarge** | **0.3972** | **39.7%** | **Kurang Direkomendasikan**: Meskipun biaya bulanan hemat dan SLA 99.99%, ketiadaan GPU (0 GB VRAM) membuat skor anjlok pada bobot 35% C5. |

---

## 8. Verifikasi Keselarasan Sistem
Hasil kalkulasi audit manual di atas **100% identik** dengan hasil eksekusi algoritma pada modul backend `backend/src/services/sawService.js` dan endpoint API `POST /api/spk/recommend`.
