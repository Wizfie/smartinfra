# Panduan Model UML Sparx Systems Enterprise Architect (EA) — SmartInfra

Dokumentasi resmi arsitektur sistem berbasis **UML 2.1 / XMI 2.1** untuk sistem **SmartInfra (Sistem Pendukung Keputusan Pengadaan & Advisory Infrastruktur IT Menggunakan Metode Simple Additive Weighting Berbasis Web)**. Berkas dalam direktori ini kompatibel penuh dengan aplikasi pemodelan **Sparx Systems Enterprise Architect (v14, v15, v16+)**.

---

## 📁 Struktur Berkas Model

| Nama Berkas | Format | Deskripsi |
| :--- | :--- | :--- |
| `SmartInfra_Model_Enterprise_Architect.xmi` | OMG XMI 2.1 | Berkas pertukaran model standar UML OMG untuk impor ke Enterprise Architect. |
| `SmartInfra_Model_Enterprise_Architect.xml` | XML 2.1 | Salinan format XML untuk interoperabilitas dan pratinjau teks editor. |
| `diagrams/01_Use_Case_Diagram_SmartInfra.png` | PNG 300 DPI | Diagram Use Case resmi SmartInfra (3 Aktor, 14 Use Case, batas sistem tegas). |
| `diagrams/02_Activity_Diagram_SPK_SAW.png` | PNG 300 DPI | Diagram Aktivitas proses algoritma SPK SAW (Filter $\rightarrow$ Normalisasi $\rightarrow$ Perankingan). |
| `diagrams/03_Activity_Diagram_Assisted_Checkout.png` | PNG 300 DPI | Diagram Aktivitas Maker-Checker (Solution Architect Assisted RFQ $\rightarrow$ Verifikasi Admin). |
| `diagrams/04_Class_Diagram_Logical_Data_Model.png` | PNG 300 DPI | Logical Data Model lengkap dengan Legend Multiplicity (`1`, `0..*`, `1..*`, `6`) & Simbol. |
| `diagrams/05_Sequence_Diagram_SPK_SAW.png` | PNG 300 DPI | Diagram Sequence eksekusi SPK SAW dengan *Text Wrapping* bebas overlap & durasi aktivasi akurat. |
| `CHANGELOG_UML.md` | Markdown | Catatan riwayat perubahan penyempurnaan estetika diagram dan perbaikan overlap. |

---

## 🚀 Panduan Impor Model ke Sparx Enterprise Architect

1. Jalankan aplikasi **Sparx Systems Enterprise Architect**.
2. Buat proyek baru (*File* $\rightarrow$ *New Project* $\rightarrow$ `SmartInfra.qea` atau `SmartInfra.eapx`).
3. Pada panel **Project Browser / Model Explorer**:
   - Klik kanan pada root node **Model** $\rightarrow$ pilih menu **Publish** $\rightarrow$ **Model Exchange** $\rightarrow$ **Import XMI** (atau gunakan pintasan keyboard: `Ctrl + Alt + I`).
4. Pada jendela dialog *Import Package from XMI*:
   - Klik tombol **Browse (...)** lalu pilih berkas `SmartInfra_Model_Enterprise_Architect.xmi`.
   - Pastikan opsi **Import Diagrams** dan **Treat Imported Datatypes as External** dicentang.
5. Klik **Import**. Seluruh paket model (*01. Use Case Model*, *02. Activity Model*, *03. Logical Data Model*, dan *04. Sequence Model*) akan otomatis terbentuk secara hierarkis.

---

## 🛠️ Panduan Konfigurasi Enterprise Architect: Mencegah Overlap & Teks Terpotong

Untuk memastikan diagram tampil rapi, proporsional, dan tidak terjadi tumpang tindih (*overlap*) atau teks terpotong (*text clipped*) saat dibuka atau diekspor di Enterprise Architect, terapkan pengaturan berikut:

### 1. Pengaturan *Word Wrap* (Bungkus Teks Otomatis)
- **Masalah**: Teks use case atau nama pesan sequence yang panjang sering menembus garis batas kotak atau garis vertikal.
- **Solusi di EA**:
  - Klik kanan pada kanvas diagram $\rightarrow$ pilih **Properties** (atau tekan `F4`).
  - Masuk ke tab **Appearance** / **Diagram**.
  - Centang opsi **Word Wrap Element Text** dan **Word Wrap Connector Labels**.
  - Atur batas karakter wrap (*Wrap Margin*) pada angka `25` - `35` karakter.

### 2. Pengaturan Layout Sequence Diagram
- **Masalah**: Teks pesan sequence menabrak garis hidup (*lifeline*) atau kotak aktivasi (*activation bar*).
- **Solusi di EA**:
  - **Jarak Antar-Lifeline**: Atur jarak horizontal antar-lifeline minimal **220 - 300 pixel**.
  - **Jarak Antar-Pesan (*Message Spacing*)**: Pada menu *Diagram Properties* $\rightarrow$ *Sequence*, atur *Message Spacing* ke **60 - 75 pixel**. Hal ini memberikan ruang vertikal yang cukup untuk pesan 2 baris (*wrapped text*).
  - **Siklus Kotak Aktivasi (*Activation Rectangle*)**: 
    - Pastikan *Execution Occurrence* (kotak putih aktivasi) pada Database hanya diaktifkan selama proses *Query* berlangsung (Langkah 3 ke 4), kemudian dinonaktifkan (*Deactivate*).
    - Kotak aktivasi `:SAWService` hanya diaktifkan saat fungsi `calculateSAW` dipanggil (Langkah 5) hingga hasil dikembalikan (Langkah 8).

### 3. Pengaturan Garis Penghubung (*Connectors & Multiplicity*)
- **Masalah**: Garis asosiasi kelas saling silang (*crossing lines*) atau label multiplisitas menumpuk di atas garis.
- **Solusi di EA**:
  - Ubah gaya garis (*Line Style*) menjadi **Orthogonal - Rounded** atau **Tree Style - Vertical/Horizontal** (Klik kanan konektor $\rightarrow$ *Line Style* $\rightarrow$ *Orthogonal Rounded*).
  - Label multiplisitas dapat digeser secara manual dengan menahan tombol `Shift` sambil menyeret (*drag*) label teks ke posisi yang lapang.
  - Sembunyikan kompartemen method/operasi pada kelas data model: Klik kanan kelas $\rightarrow$ *Compartment Visibility* $\rightarrow$ hilangkan centang *Operations* (karena entitas database hanya menampilkan atribut data).

### 4. Standar Tipografi dan Ekspor Gambar Resolusi Tinggi (300 DPI)
- **Font Rekomendasi**: Gunakan font **Segoe UI**, **Arial**, atau **Inter** dengan ukuran:
  - Judul Elemen / Aktor: **9.5 pt Bold**.
  - Atribut / Isi Teks: **8.5 pt Regular**.
  - Label Multiplisitas: **8.5 pt Bold**.
- **Ekspor Gambar di EA**:
  - Tekan `Ctrl + T` (Save Diagram Image) $\rightarrow$ pilih format **PNG**.
  - Pada *Tools* $\rightarrow$ *Options* $\rightarrow$ *Diagram* $\rightarrow$ *Image Format*, pastikan opsi resolusi diatur ke **High Quality / 300 DPI** agar teks tidak pecah atau buram saat dimasukkan ke dalam dokumen skripsi Microsoft Word.

---

## 📌 Rangkuman Notasi Simbol & Multiplisitas (Kardinalitas)

| Notasi | Nama Notasi | Arti & Contoh Penerapan pada SmartInfra |
| :---: | :--- | :--- |
| `1` | **One (Mandatory)** | Tepat 1 instans entitas wajib ada. Contoh: Setiap `Order` wajib memiliki tepat 1 penanggung jawab `User` (Sales). |
| `0..*` / `*` | **Zero to Many (Optional)** | 0 atau banyak instans. Contoh: 1 `User` sales dapat menangani banyak `Order` (`0..*`). |
| `1..*` | **One or More (Mandatory)** | Minimal 1 atau lebih instans wajib ada. Contoh: 1 `Order` harus memuat minimal 1 `OrderItem` (`1..*`). |
| `6` | **Exact Six (SAW Criteria)** | Tepat 6 instans data. Menandakan 6 kriteria pembobotan SPK SAW (C1 Biaya s/d C6 Baterai) pada `ProfileCriteriaWeight` dan `LaptopCriteriaValue`. |
| `+` | **Public Visibility** | Atribut publik yang dapat diakses oleh lapisan *Controller* dan *Service*. |
| `[PK]` | **Primary Key** | Kunci utama unik setiap baris data tabel basis data. |
| `[FK]` | **Foreign Key** | Kunci tamu penunjuk integritas relasional ke tabel induk. |
| `[Unique]` | **Unique Constraint** | Nilai atribut tidak boleh kembar di tabel basis data (misal: `orderNumber`, `slug`). |
| `M:N Junction` | **Associative Entity** | Pemecahan relasi *Many-to-Many* menjadi dua relasi *One-to-Many* via tabel perantara (misal: `OrderItem` menjembatani `Order` dan `Laptop`). |
