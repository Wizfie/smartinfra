# Panduan Standar Pemodelan UML Berbasis Sparx Systems Enterprise Architect (EA)

Dokumen ini merupakan panduan teknis dan cetak biru (*blueprint standard*) untuk merancang, mengonfigurasi, dan mengekspor model diagram UML ke format standar **Sparx Systems Enterprise Architect (XMI 2.1 / UML 2.1)** agar dapat digunakan kembali (*reusable*) pada proyek-proyek rekayasa perangkat lunak lainnya.

---

## 1. Standar Spesifikasi Format Berkas

Enterprise Architect (Sparx Systems) menggunakan standar pertukaran model berbasis OMG XML Metadata Interchange (XMI):
- **Format Rekomendasi:** XMI Versi 2.1 (UML Versi 2.1 / 2.5).
- **Encoding Berkas:** `windows-1252` atau `UTF-8`.
- **Ekstensi Berkas:** `.xmi` atau `.xml`.
- **Namespace Header Standar:**
```xml
<?xml version="1.0" encoding="windows-1252"?>
<xmi:XMI xmi:version="2.1" 
         xmlns:uml="http://schema.omg.org/spec/UML/2.1" 
         xmlns:xmi="http://schema.omg.org/spec/XMI/2.1">
  <xmi:Documentation exporter="Enterprise Architect" exporterVersion="6.5"/>
  <uml:Model xmi:type="uml:Model" xmi:id="EAID_MODEL_ROOT" name="Nama_Model_Proyek" visibility="public">
    <!-- Konten Package di sini -->
  </uml:Model>
</xmi:XMI>
```

---

## 2. Struktur Hirarki Paket Standar (Standard Package Hierarchy)

Agar model arsitektur sistem rapi, modular, dan sesuai standar evaluasi akademik / enterprise, susun paket model ke dalam 5 folder utama:

```text
Helpdesk Ticketing System (Root Package)
 ├── 01. Use Case Model
 │    ├── Actors (Aktor Primer & Sekunder)
 │    ├── Use Cases (Fitur Fungsional Sistem)
 │    └── Associations (Garis Relasi Aktor-Skenario)
 ├── 02. Activity Model
 │    ├── Activity: Alur Sistem Berjalan (Existing Flow)
 │    └── Activity: Alur Sistem Usulan (To-Be System Flow)
 ├── 03. Logical Data Model (Classes & Entities)
 │    ├── Database Classes / Entitas Tabel
 │    ├── Attributes & Primitive Types (Integer, String, Text, DateTime, Boolean)
 │    └── Table Relationships (One-to-Many / Foreign Keys)
 ├── 04. Sequence Model (Interactions)
 │    ├── Interaction 1: Alur Pembuatan / Transaksi Utama
 │    ├── Interaction 2: Alur Penanganan / Troubleshooting
 │    └── Interaction 3: Alur Eskalasi & Penyelesaian
 └── 05. Software Flowchart & Logic
      └── Activity / Control Flowchart: Logika Program & Percabangan RBAC
```

---

## 3. Spesifikasi Elemen Tiap Model UML

### A. 01. Use Case Model
- **Aturan Penamaan Aktor:**
  - Gunakan peran resmi sistem (misal: `Admin / CPIG Helpdesk`, `IT Support Engineer`).
  - Hindari aktor fiktif atau aktor luar yang tidak berinteraksi langsung dengan sistem web.
- **Aturan Penamaan Use Case:**
  - Format kode berurutan: `UC-XX: Kata Kerja Objek` (contoh: `UC-01: Autentikasi Pengguna & Sesi`, `UC-02: Manajemen Tiket & Penugasan`).
- **Sintaks XMI:**
```xml
<!-- Aktor -->
<packagedElement xmi:type="uml:Actor" xmi:id="EAID_ACT_ADMIN" name="Admin / CPIG Helpdesk" visibility="public"/>

<!-- Use Case -->
<packagedElement xmi:type="uml:UseCase" xmi:id="EAID_UC_01" name="UC-01: Autentikasi Pengguna &amp; Sesi" visibility="public"/>

<!-- Relasi Asosiasi -->
<packagedElement xmi:type="uml:Association" xmi:id="EAID_ASC_001" name="rel_Admin_UC01" visibility="public">
  <memberEnd xmi:idref="EAID_ACT_ADMIN"/>
  <memberEnd xmi:idref="EAID_UC_01"/>
</packagedElement>
```

---

### B. 02. Activity Diagram Model
Gunakan elemen UML standar:
- `<node xmi:type="uml:InitialNode" .../>` : Titik Mulai (*Start*).
- `<node xmi:type="uml:OpaqueAction" .../>` : Aktivitas / Proses Kegiatan.
- `<node xmi:type="uml:DecisionNode" .../>` : Titik Percabangan / Keputusan (*Belah Ketupat*).
- `<node xmi:type="uml:ActivityFinalNode" .../>` : Titik Berhenti (*End*).

---

### C. 03. Logical Data Model (Class Diagram Basis Data)
Memetakan kamus data dan skema tabel database (MySQL / PostgreSQL):
```xml
<packagedElement xmi:type="uml:Class" xmi:id="EAID_CLS_TICKET" name="Ticket" visibility="public">
  <ownedAttribute xmi:type="uml:Property" xmi:id="EAID_ATTR_01" name="id" visibility="public">
    <type xmi:type="uml:PrimitiveType" href="http://schema.omg.org/spec/UML/2.1/uml.xml#Integer"/>
  </ownedAttribute>
  <ownedAttribute xmi:type="uml:Property" xmi:id="EAID_ATTR_02" name="ticketNumber" visibility="public">
    <type xmi:type="uml:PrimitiveType" href="http://schema.omg.org/spec/UML/2.1/uml.xml#String"/>
  </ownedAttribute>
  <ownedAttribute xmi:type="uml:Property" xmi:id="EAID_ATTR_03" name="status" visibility="public">
    <type xmi:type="uml:PrimitiveType" href="http://schema.omg.org/spec/UML/2.1/uml.xml#String"/>
  </ownedAttribute>
</packagedElement>
```

*Tipe Data Primitif yang Didukung:* `Integer`, `String`, `Text`, `Float`, `Boolean`, `DateTime`.

---

### D. 04. Sequence Diagram Model
Lifeline merepresentasikan arsitektur berlapis (*layered architecture*):
1. **Aktor Manusia:** `Admin / Operator` atau `IT Engineer`
2. **Boundary / UI:** `:WebClient (Vue.js / React UI)`
3. **Control / API:** `:TicketController` (Backend API Service)
4. **Service Logic:** `:SLAService` / `:BusinessService`
5. **Entity / Database:** `:Database (MySQL)` *(Hindari nama ORM seperti Prisma, gunakan nama DBMS langsung)*

```xml
<packagedElement xmi:type="uml:Interaction" xmi:id="EAID_SEQ_01" name="Sequence Diagram: Pembuatan Tiket &amp; Dispatch" visibility="public">
  <lifeline xmi:type="uml:Lifeline" xmi:id="EAID_LIFE_ADMIN" name="Admin / CPIG Helpdesk"/>
  <lifeline xmi:type="uml:Lifeline" xmi:id="EAID_LIFE_UI" name=":WebClient (UI)"/>
  <lifeline xmi:type="uml:Lifeline" xmi:id="EAID_LIFE_CTRL" name=":TicketController"/>
  <lifeline xmi:type="uml:Lifeline" xmi:id="EAID_LIFE_SLA" name=":SLAService"/>
  <lifeline xmi:type="uml:Lifeline" xmi:id="EAID_LIFE_DB" name=":Database (MySQL)"/>
</packagedElement>
```

---

## 4. Standar Estetika Visual Enterprise Architect (Jika Merender SVG/PNG)

Jika Anda ingin menghasilkan gambar diagram yang identik dengan tampilan visual asli Sparx Systems Enterprise Architect:

| Komponen | Spesifikasi Enterprise Architect | Nilai / Kode Warna |
| :--- | :--- | :--- |
| **Bingkai Diagram (Frame)** | Garis tepi ganda tipis dengan tab lipat kiri atas | Border `#707070`, Lebar 1.2px |
| **Label Tab Frame** | Teks jenis diagram, nama package, dan judul | `uc [package] 01. Use Case Model [Judul]` |
| **Warna Use Case Oval** | Biru pastel lembut khas Enterprise Architect | Fill `#D8E8F8`, Stroke `#385D8A` (1.3px) |
| **Warna Aktor (Kepala)** | Peach/Cream pastel | Fill `#FFF2CC`, Stroke `#385D8A` (1.4px) |
| **Warna Class / Entitas** | Kuning gading pastel | Fill `#FEFEE6`, Stroke `#8064A2` atau `#385D8A` |
| **Warna Lifeline Sequence** | Biru abu-abu lembut | Fill `#EBF2F8`, Stroke `#385D8A` (1.2px) |
| **Tipografi** | Huruf resmi antarmuka Windows Enterprise | `'Segoe UI', Arial, sans-serif` |
| **Keterbacaan Label** | Mencegah tumpang tindih teks pada garis | White halo filter (`stroke="#FFFFFF"`, lebar 3px) |

---

## 5. Script Generator Otomatis Berbasis Python (Boilerplate Template)

Simpan skrip berikut sebagai `generate_ea_model.py` untuk proyek baru:

```python
import os
import uuid

def uid(prefix="EAID"):
    return f"{prefix}_{uuid.uuid4().hex.upper()}"

def build_xmi(project_name, actors, use_cases, classes, sequences):
    model_id = f"EAID_MODEL_{project_name.upper().replace(' ', '_')}"
    pkg_root = f"EAID_PKG_ROOT_{project_name.upper().replace(' ', '_')}"

    xml = f"""<?xml version="1.0" encoding="windows-1252"?>
<xmi:XMI xmi:version="2.1" xmlns:uml="http://schema.omg.org/spec/UML/2.1" xmlns:xmi="http://schema.omg.org/spec/XMI/2.1">
  <xmi:Documentation exporter="Enterprise Architect" exporterVersion="6.5"/>
  <uml:Model xmi:type="uml:Model" xmi:id="{model_id}" name="{project_name}" visibility="public">
    <packagedElement xmi:type="uml:Package" xmi:id="{pkg_root}" name="{project_name}" visibility="public">
      
      <!-- 01. USE CASE MODEL -->
      <packagedElement xmi:type="uml:Package" xmi:id="EAID_PKG_UC" name="01. Use Case Model" visibility="public">
"""
    for act_id, act_name in actors:
        xml += f"""        <packagedElement xmi:type="uml:Actor" xmi:id="{act_id}" name="{act_name}" visibility="public"/>\n"""

    for uc_id, uc_name in use_cases:
        xml += f"""        <packagedElement xmi:type="uml:UseCase" xmi:id="{uc_id}" name="{uc_name}" visibility="public"/>\n"""

    xml += """      </packagedElement>
    </packagedElement>
  </uml:Model>
</xmi:XMI>
"""
    return xml
```

---

## 6. Prosedur Impor ke Sparx Systems Enterprise Architect

Untuk memasukkan berkas `.xml` atau `.xmi` ke dalam Enterprise Architect:

1. Buka aplikasi **Sparx Systems Enterprise Architect**.
2. Buat proyek baru (*New Project*) atau buka berkas `.eapx` / `.qea` yang ada.
3. Pada panel **Project Browser**, klik kanan pada root model atau package tujuan.
4. Pilih menu:
   - **Publish** $\rightarrow$ **Model Exchange** $\rightarrow$ **Import XMI**
   - *(Atau tekan tombol pintas keyboard: `Ctrl + Alt + I`)*.
5. Pada kotak dialog *Import Package from XMI*:
   - Pilih berkas target: `Enterprise_Architect_Helpdesk_GTT.xml` atau `.xmi`.
   - Centang opsi **Import Diagrams** jika ingin diagram langsung digenerate.
   - Klik tombol **Import**.
6. Model akan langsung terstruktur rapi di Project Browser siap ditinjau atau diekspor ke format gambar/laporan docx.
