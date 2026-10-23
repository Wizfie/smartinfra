# Pengujian White-Box (White-Box Testing) — SmartInfra
## Sistem Pendukung Keputusan Pemilihan & Pengadaan Infrastruktur IT

Dokumen ini memuat pengujian kotak putih (*White-Box Testing*) terhadap modul komputasi inti: **Engine Algoritma Simple Additive Weighting (SAW)** yang berlokasi pada berkas `backend/src/services/sawService.js` untuk perankingan infrastruktur server & GPU rig.

Metode pengujian yang diterapkan adalah **Basis Path Testing** untuk mengukur **Kompleksitas Siklomatis (*Cyclomatic Complexity*)** dan memastikan seluruh percabangan kode dieksekusi secara tuntas.

---

## 1. Kode Program yang Diuji (`calculateSAW`)

```javascript
1:  function calculateSAW({ alternatives, criteria, weights, criteriaValues }) {
2:    if (!alternatives || alternatives.length === 0) {
3:      return { rawMatrix: [], normalizedMatrix: [], results: [] };
      }
4:    const valueMap = {};
      criteriaValues.forEach(cv => { ... });
5:    const validAlternatives = alternatives.filter(alt => valueMap[alt.id]);
6:    const minMaxReference = {};
      criteria.forEach(crit => { /* hitung min & max kriteria */ });
7:    validAlternatives.forEach(alt => {
8:      criteria.forEach(crit => {
9:        if (crit.type.toLowerCase() === 'benefit') {
10:         r_ij = ref.max > 0 ? (x_ij / ref.max) : 0;
          } else {
11:         r_ij = x_ij > 0 ? (ref.min / x_ij) : 0;
          }
12:       normRow.normalizedScores[crit.id] = r_ij;
        });
      });
13:   const preferenceResults = normalizedMatrix.map((normRow, idx) => {
        let totalScore = 0;
        criteria.forEach(crit => { totalScore += (w_j * r_ij); });
        return { preferenceScore: totalScore, ... };
      });
14:   preferenceResults.sort((a, b) => b.preferenceScore - a.preferenceScore);
15:   return { results: preferenceResults };
    }
```

---

## 2. Diagram Graf Alir (Flowgraph)

```
        [ Simpul 1 ]  (Entry point fungsi calculateSAW)
             │
             ├────────[ alternatives == 0 ? ]────────► [ Simpul 3 ] (Return hasil kosong)
             ▼ (Tidak)
        [ Simpul 2 ]  (Inisialisasi valueMap & validAlternatives)
             │
             ▼
        [ Simpul 4 ]  (Perhitungan min/max referensi kriteria)
             │
             ▼
   ┌──► [ Simpul 5 ]  (Loop tiap alternatif)
   │         │
   │         ▼
   │    [ Simpul 6 ]  (Loop tiap kriteria)
   │         │
   │         ├────────[ crit.type == 'benefit' ]──────► [ Simpul 7 ] (Formula Benefit: x_ij / max)
   │         │                                             │
   │         └────────[ crit.type == 'cost' ]─────────► [ Simpul 8 ] (Formula Cost: min / x_ij)
   │                                                       │
   │                                                       ▼
   │                                                  [ Simpul 9 ] (Simpan skor ternormalisasi r_ij)
   │                                                       │
   └──────────────────[ Akhir Loop Kriteria/Alternatif ]───┘
             │
             ▼
        [ Simpul 10 ] (Kalkulasi nilai preferensi V_i = sum(w_j * r_ij))
             │
             ▼
        [ Simpul 11 ] (Sorting peringkat V_i descending)
             │
             ▼
        [ Simpul 12 ] (Exit point: Return hasil akhir)
```

---

## 3. Perhitungan Kompleksitas Siklomatis (*Cyclomatic Complexity*)

- **Jumlah Simpul / Nodes ($N$):** 12
- **Jumlah Sisi / Edges ($E$):** 14
- **Jumlah Titik Keputusan / Predicate Nodes ($P$):** 3
  1. Kondisi pengecekan data alternatif kosong (`alternatives.length === 0`)
  2. Kondisi iterasi perulangan alternatif
  3. Kondisi seleksi jenis atribut kriteria (`crit.type === 'benefit'`)

### Perhitungan:
1. $V(G) = E - N + 2 = 14 - 12 + 2 = \mathbf{4}$
2. $V(G) = P + 1 = 3 + 1 = \mathbf{4}$
3. $V(G) = \text{Jumlah Region } (R) = \mathbf{4}$

Nilai $V(G) = 4$ membuktikan bahwa terdapat **4 Jalur Independen (*Basis Paths*)** yang wajib diuji.

---

## 4. Lintasan Jalur Independen (*Basis Paths*)

- **Jalur 1:** `1 - 2 - 3`
- **Jalur 2:** `1 - 2 - 4 - 5 - 6 - 7 - 9 - 10 - 11 - 12`
- **Jalur 3:** `1 - 2 - 4 - 5 - 6 - 8 - 9 - 10 - 11 - 12`
- **Jalur 4:** `1 - 2 - 4 - 5 - 6 - (Kombinasi 7 & 8) - 9 - 10 - 11 - 12`

---

## 5. Tabel Eksekusi Kasus Uji White-Box

| Kasus Uji | Lintasan Jalur | Masukan Uji (Input) | Luaran Diharapkan | Hasil Uji Nyata | Kesimpulan |
|:---:|:---:|:---|:---|:---|:---:|
| **WB-01** | Jalur 1 | `alternatives = []` | Mengembalikan `{ results: [] }` tanpa terjadi exception error | Mengembalikan objek kosong dengan benar | **Berhasil** |
| **WB-02** | Jalur 2 | Alternatif dengan kriteria tipe *Benefit* (Processor C2, RAM C3) | $r_{ij} = x_{ij} / \max(x_j)$, nilai $r_{ij} \le 1.0$ | Nilai ternormalisasi benefit terhitung tepat | **Berhasil** |
| **WB-03** | Jalur 3 | Alternatif dengan kriteria tipe *Cost* (Harga C1) | $r_{ij} = \min(x_j) / x_{ij}$, laptop harga terendah mendapat skor 1.0 | Nilai ternormalisasi cost terhitung tepat | **Berhasil** |
| **WB-04** | Jalur 4 | Dataset 5 laptop lengkap dengan 6 kriteria gabungan *Cost & Benefit* | Matriks $R$ ternormalisasi sempurna, nilai $V_i = \sum (w_j \cdot r_{ij})$ terhitung dan alternatif terurut | Semua alternatif terurut sesuai nilai preferensi dari tertinggi ke terendah | **Berhasil** |

---

## 6. Kesimpulan Pengujian White-Box
Seluruh jalur independen pada modul perhitungan algoritma SAW telah diuji secara komprehensif dengan hasil **100% Path Coverage**, bebas dari kebocoran logika (*logic flaws*) maupun pembagian dengan nol (*division by zero*).
