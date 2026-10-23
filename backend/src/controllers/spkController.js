const prisma = require('../config/prisma');
const { calculateSAW } = require('../services/sawService');

// POST /api/spk/recommend
exports.getRecommendations = async (req, res) => {
  try {
    const { profile_id = 1, profile_slug, custom_weights, filters = {} } = req.body;

    // 1. Ambil Kriteria
    const criteria = await prisma.criterion.findMany({
      orderBy: { id: 'asc' }
    });

    // 2. Tentukan Profil Pengguna
    let currentProfile = null;
    if (profile_slug) {
      currentProfile = await prisma.profile.findUnique({
        where: { slug: profile_slug }
      });
    } else {
      currentProfile = await prisma.profile.findUnique({
        where: { id: parseInt(profile_id, 10) }
      });
    }

    if (!currentProfile) {
      currentProfile = { id: 1, name: 'Default', slug: 'default' };
    }

    // Ambil Bobot Default dari DB
    const weightRows = await prisma.profileCriteriaWeight.findMany({
      where: { profileId: currentProfile.id }
    });

    const weights = {};
    weightRows.forEach(row => {
      weights[row.criterionId] = parseFloat(row.weight);
    });

    // Jika user memberikan custom weights, timpa bobot default
    if (custom_weights && typeof custom_weights === 'object') {
      Object.keys(custom_weights).forEach(k => {
        weights[k] = parseFloat(custom_weights[k]);
      });
    }

    // 3. Filter Alternatif Laptop
    const whereConditions = {
      stock: { gt: 0 }
    };

    if (filters.category && filters.category !== 'all') {
      whereConditions.category = filters.category;
    }

    if (filters.max_price) {
      whereConditions.price = { lte: parseFloat(filters.max_price) };
    }

    if (filters.brand && filters.brand !== 'Semua Brand' && filters.brand !== 'all') {
      whereConditions.brand = filters.brand;
    }

    if (filters.min_ram) {
      whereConditions.ramGb = { gte: parseInt(filters.min_ram, 10) };
    }

    // Ambil daftar unique brand
    const distinctBrands = await prisma.laptop.findMany({
      distinct: ['brand'],
      select: { brand: true },
      orderBy: { brand: 'asc' }
    });
    const brands = distinctBrands.map(b => b.brand).filter(Boolean);

    const laptops = await prisma.laptop.findMany({
      where: whereConditions
    });

    if (laptops.length === 0) {
      return res.json({
        success: true,
        profile: currentProfile,
        weights,
        criteria,
        brands,
        results: [],
        message: 'Tidak ada infrastruktur yang cocok dengan filter yang diberikan.'
      });
    }

    // Ubah format data laptop agar sesuai dengan sawService
    const alternatives = laptops.map(l => ({
      id: l.id,
      category: l.category || 'cloud_instance',
      brand: l.brand,
      model: l.model,
      sku: l.sku,
      price: parseFloat(l.price),
      stock: l.stock,
      processor_name: l.processorName,
      processor_score: parseFloat(l.processorScore),
      ram_gb: l.ramGb,
      storage_desc: l.storageDesc,
      storage_gb: l.storageGb,
      gpu_name: l.gpuName,
      gpu_score: parseFloat(l.gpuScore),
      battery_hours: parseFloat(l.batteryHours),
      weight_kg: parseFloat(l.weightKg),
      screen_desc: l.screenDesc,
      image_url: l.imageUrl,
      description: l.description
    }));

    // 4. Ambil Nilai Matriks Laptop terhadap Kriteria
    const laptopIds = alternatives.map(a => a.id);
    const criteriaValuesRaw = await prisma.laptopCriteriaValue.findMany({
      where: {
        laptopId: { in: laptopIds }
      }
    });

    const criteriaValues = criteriaValuesRaw.map(cv => ({
      laptop_id: cv.laptopId,
      criterion_id: cv.criterionId,
      raw_value: parseFloat(cv.rawValue)
    }));

    // 5. Jalankan Algoritma SAW
    const sawOutput = calculateSAW({
      alternatives,
      criteria,
      weights,
      criteriaValues
    });

    res.json({
      success: true,
      profile: currentProfile,
      weights,
      criteria,
      brands,
      minMaxReference: sawOutput.minMaxReference,
      rawMatrix: sawOutput.rawMatrix,
      normalizedMatrix: sawOutput.normalizedMatrix,
      results: sawOutput.results
    });
  } catch (error) {
    console.error('Error in SPK calculate (Prisma):', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/criteria
exports.getCriteria = async (req, res) => {
  try {
    const criteria = await prisma.criterion.findMany({
      orderBy: { id: 'asc' }
    });
    res.json({
      success: true,
      data: criteria
    });
  } catch (error) {
    console.error('Error fetching criteria (Prisma):', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

