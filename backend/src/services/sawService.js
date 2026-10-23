/**
 * Modul Engine Perhitungan Simple Additive Weighting (SAW)
 * Mengimplementasikan:
 * 1. Penyusunan Matriks Keputusan (X)
 * 2. Normalisasi Matriks (R) berdasarkan tipe Benefit dan Cost
 * 3. Perhitungan Nilai Preferensi (V) menggunakan vektor bobot W
 * 4. Perangkingan Alternatif dari nilai tertinggi ke terendah
 */

function calculateSAW({ alternatives, criteria, weights, criteriaValues }) {
  if (!alternatives || alternatives.length === 0) {
    return {
      rawMatrix: [],
      normalizedMatrix: [],
      minMaxReference: {},
      results: []
    };
  }

  // 1. Bentuk Peta Nilai Mentah x_ij: { [laptopId]: { [criterionId]: rawValue } }
  const valueMap = {};
  criteriaValues.forEach(cv => {
    if (!valueMap[cv.laptop_id]) {
      valueMap[cv.laptop_id] = {};
    }
    valueMap[cv.laptop_id][cv.criterion_id] = parseFloat(cv.raw_value);
  });

  // Pastikan alternatif yang dihitung memiliki nilai untuk semua kriteria
  const validAlternatives = alternatives.filter(alt => valueMap[alt.id]);

  // 2. Cari Nilai Min & Max untuk setiap Kriteria (Kolom j)
  const minMaxReference = {};
  criteria.forEach(crit => {
    const values = validAlternatives.map(alt => valueMap[alt.id][crit.id] || 0);
    minMaxReference[crit.id] = {
      code: crit.code,
      name: crit.name,
      type: crit.type,
      max: Math.max(...values),
      min: Math.min(...values.filter(v => v > 0)) || Math.min(...values)
    };
  });

  // 3. Normalisasi Matriks R (r_ij)
  const rawMatrix = [];
  const normalizedMatrix = [];

  validAlternatives.forEach(alt => {
    const rawRow = {
      id: alt.id,
      infrastructure_id: alt.id,
      laptop_id: alt.id,
      brand: alt.brand,
      model: alt.model,
      scores: {}
    };

    const normRow = {
      id: alt.id,
      infrastructure_id: alt.id,
      laptop_id: alt.id,
      brand: alt.brand,
      model: alt.model,
      normalizedScores: {}
    };

    criteria.forEach(crit => {
      const x_ij = valueMap[alt.id][crit.id] || 0;
      rawRow.scores[crit.id] = x_ij;

      const ref = minMaxReference[crit.id];
      let r_ij = 0;

      if (crit.type.toLowerCase() === 'benefit') {
        // Formula Benefit: r_ij = x_ij / max(x_j)
        r_ij = ref.max > 0 ? (x_ij / ref.max) : 0;
      } else {
        // Formula Cost: r_ij = min(x_j) / x_ij
        r_ij = x_ij > 0 ? (ref.min / x_ij) : 0;
      }

      // Bulatkan untuk presisi 4 desimal
      normRow.normalizedScores[crit.id] = parseFloat(r_ij.toFixed(4));
    });

    rawMatrix.push(rawRow);
    normalizedMatrix.push(normRow);
  });

  // 4. Hitung Nilai Preferensi V_i = sum(w_j * r_ij)
  const preferenceResults = normalizedMatrix.map((normRow, idx) => {
    const alt = validAlternatives[idx];
    let totalScore = 0;

    criteria.forEach(crit => {
      const r_ij = normRow.normalizedScores[crit.id] || 0;
      const w_j = parseFloat(weights[crit.id] || 0);
      totalScore += (w_j * r_ij);
    });

    const v_i = parseFloat(totalScore.toFixed(4));
    const matchPercentage = parseFloat((v_i * 100).toFixed(1));

    return {
      id: alt.id,
      infrastructure_id: alt.id,
      laptop_id: alt.id,
      brand: alt.brand,
      model: alt.model,
      sku: alt.sku,
      price: parseFloat(alt.price),
      stock: alt.stock,
      processor_name: alt.processor_name,
      ram_gb: alt.ram_gb,
      storage_desc: alt.storage_desc,
      gpu_name: alt.gpu_name,
      battery_hours: parseFloat(alt.battery_hours),
      weight_kg: parseFloat(alt.weight_kg),
      screen_desc: alt.screen_desc,
      image_url: alt.image_url,
      description: alt.description,
      rawScores: rawMatrix[idx].scores,
      normalizedScores: normRow.normalizedScores,
      preferenceScore: v_i,
      matchPercentage: matchPercentage
    };
  });

  // 5. Urutkan Hasil (Perangkingan Descending)
  preferenceResults.sort((a, b) => b.preferenceScore - a.preferenceScore);

  // Tambahkan nomor ranking
  const rankedResults = preferenceResults.map((item, index) => ({
    rank: index + 1,
    ...item
  }));

  return {
    rawMatrix,
    normalizedMatrix,
    minMaxReference,
    results: rankedResults
  };
}

module.exports = {
  calculateSAW
};
