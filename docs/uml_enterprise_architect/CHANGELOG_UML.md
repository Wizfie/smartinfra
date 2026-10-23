# CHANGELOG: Perbaikan & Standardisasi Diagram UML SmartInfra

Seluruh catatan riwayat perubahan, penyesuaian estetika, eliminasi tumpang tindih (*anti-collision*), dan penyempurnaan diagram UML berbasis standar **Sparx Systems Enterprise Architect v16** untuk sistem **SmartInfra SPK SAW**.

---

## [v2.4.0] — 2026-10-15

### 🚀 Penyempurnaan Sequence Diagram (Text Wrapping & Zero Collision)
- **Implementasi Text Wrapping (2 Baris)**:
  - Mengubah seluruh label pesan yang panjang menjadi format multi-line (*text wrap*) 2 baris (khususnya **Poin 2, 9, dan 10**):
    - **Poin 2**: `2. POST /api/spk/recommend` \n `{profile_id: 1, filters}`.
    - **Poin 9**: `9. JSON Response` \n `{success: true, results: [...] }`.
    - **Poin 10**: `10. Render Hasil Rekomendasi` \n `& Match % di Layar`.
    - **Poin 3 & 4**: Menata pesan query data mentah agar tidak memotong garis hidup `:SAWService`.
    - **Poin 6 & 7**: Menata pesan mandiri (*self-call*) normalisasi dan preferensi SAW agar lapang terhadap garis `:Database`.
- **Koreksi Siklus Hidup Kotak Aktivasi (*Activation Bars*)**:
  - Memperbaiki waktu aktif kotak aktivasi `:Database` sehingga **hanya aktif saat eksekusi query (Langkah 3 ke 4)**, tidak lagi menggantung ke bawah melewati langkah 6 dan 7.
  - Memperbaiki kotak aktivasi `:SAWService` sehingga **hanya aktif saat pemanggilan kalkulasi SAW (Langkah 5 ke 8)**.
- **Pelebaran Spasi Horizontal & Vertikal**:
  - Menata ulang koordinat lifelines menjadi: `User (120)` $\rightarrow$ `WebClient (440)` $\rightarrow$ `SPKController (790)` $\rightarrow$ `SAWService (1140)` $\rightarrow$ `Database (1490)`.
  - Memberikan jarak vertikal lapang antar-pesan sebesar 75-80 px.

### 📄 Sinkronisasi Berkas Model XMI & XML
- **Pembaruan XMI 2.1 & XML**:
  - Menambahkan struktur data model lengkap: kelas `OrderItem`, `LaptopCriteriaValue`, `Profile`, dan `ProfileCriteriaWeight`.
  - Mendefinisikan kardinalitas relasi resmi (`1:N`, `M:N Junction`, dan `1:6`).
  - Menambahkan urutan interaksi 10 pesan sequence diagram ke dalam elemen `<uml:Interaction>`.

### 📚 Dokumentasi & Panduan Anti-Overlap
- **Pembuatan Panduan `README_UML_EA.md`**:
  - Panduan konfigurasi Enterprise Architect untuk mencegah teks terpotong (*Word Wrap Element Text*, *Message Spacing*, *Orthogonal Rounded Style*).
  - Panduan impor XMI 2.1 via shortcut `Ctrl + Alt + I`.
  - Panduan ekspor gambar 300 DPI untuk laporan skripsi.

---

## [v2.3.0] — 2026-10-14

### 💎 Penyempurnaan Class Diagram & Legend Multiplisitas
- **Penambahan Kotak Legend Resmi**:
  - Menambahkan kotak keterangan 2 kolom di area kiri bawah diagram kelas:
    - Kolom 1: Arti angka multiplisitas (`1`, `0..*`, `1..*`, `6`), One-to-Many, dan Many-to-Many dekomposisi via *Junction Table*.
    - Kolom 2: Simbol atribut (`+` Public, `[PK]` Primary Key, `[FK]` Foreign Key, `[Unique]` Constraint, Garis Asosiasi, dan Role Name).
- **Penjelasan Khusus Multiplisitas `6`**:
  - Menjelaskan hubungan 1 ke 6 pada `ProfileCriteriaWeight` dan `LaptopCriteriaValue` sebagai representasi tepat 6 kriteria SAW (C1 Harga, C2 Prosesor, C3 RAM, C4 Storage, C5 GPU, C6 Baterai).
- **Integrasi Bab 3 Skripsi**:
  - Menambahkan paragraf pembahasan akademik mengenai multiplisitas dan simbol kelas pada naskah skripsi Word (`Laporan_RPL_SmartInfra_SPK_SAW.docx`).

---

## [v2.2.0] — 2026-10-14

### 🛠️ Penyempurnaan Use Case Diagram
- **Eliminasi Tumpang Tindih Garis Aktor & Kolom**:
  - Memisahkan kolom use case menjadi 3 kolom vertikal independen (Konsumen di kiri, Sales di tengah, Admin di kanan).
  - Menempatkan aktor di sisi luar masing-masing kolom dengan garis relasi tegak lurus langsung (*orthogonal direct*) tanpa ada garis yang menyilang (*no crossed lines*).
  - Memperbaiki teks nama aktor dan use case agar tidak ada teks yang tampak tercoret atau terpotong batas kanvas.
- **Penyederhanaan Teks Use Case**:
  - Mempersingkat nama use case menjadi padat dan jelas (contoh: *UC-01: Eksplorasi Katalog Laptop*, *UC-02: Konsultasi Rekomendasi SPK SAW*).

---

## [v2.1.0] — 2026-10-14

### 📐 Standardisasi Visual Enterprise Architect (High-Res 300 DPI)
- **Implementasi Frame Enterprise Architect**:
  - Seluruh diagram dibungkus menggunakan *Outer Double Frame* dan *Tab Header Tag* resmi Enterprise Architect (contoh: `uc [Package] ...`, `act [Package] ...`, `class [Package] ...`, `sd [Package] ...`).
- **Palet Warna Resmi Sparx Systems EA**:
  - Actor Head: `#FFF2CC` (Kuning keemasan lembut) dengan outline `#385D8A`.
  - Boundary: `#FFFFFF` dengan frame `#707070`.
  - Entity Classes: Header `#F4EBF9`, Body `#FEFEE6`, Edge `#8064A2`.
  - Sequence Lifelines: Header `#EBF2F8`, Edge `#385D8A`.
- **Ekspor Otomatis Skripsi Word**:
  - Seluruh diagram PNG 300 DPI otomatis diinjeksi ke naskah skripsi `Laporan_RPL_SmartInfra_SPK_SAW.docx` pada Bab 3 tanpa distorsi aspek rasio.
