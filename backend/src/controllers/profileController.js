const prisma = require('../config/prisma');

// Helper to generate a clean slug
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

// GET /api/profiles
exports.getAll = async (req, res) => {
  try {
    const profiles = await prisma.profile.findMany({
      include: {
        weights: {
          include: {
            criterion: true
          }
        }
      },
      orderBy: { id: 'asc' }
    });

    const formatted = profiles.map(p => {
      const weightObj = {};
      const weightsDetail = p.weights.map(w => {
        const val = parseFloat(Number(w.weight).toFixed(2));
        weightObj[w.criterionId] = val;
        return {
          profile_id: w.profileId,
          criterion_id: w.criterionId,
          code: w.criterion.code,
          name: w.criterion.name,
          weight: val
        };
      });

      return {
        id: p.id,
        slug: p.slug,
        name: p.name,
        description: p.description,
        icon_name: p.iconName,
        is_active: p.isActive,
        weights_detail: weightsDetail,
        weights: weightObj
      };
    });

    res.json({
      success: true,
      data: formatted
    });
  } catch (error) {
    console.error('Error fetching profiles (Prisma):', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/profiles (Tambah Profil Baru)
exports.create = async (req, res) => {
  try {
    const { name, slug, description, icon_name = 'person', weights = {} } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Nama profil wajib diisi!'
      });
    }

    // Tentukan slug unik
    let finalSlug = slug ? slugify(slug) : slugify(name);
    const existing = await prisma.profile.findUnique({
      where: { slug: finalSlug }
    });
    if (existing) {
      finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;
    }

    // Ambil daftar kriteria yang tersedia
    const criteria = await prisma.criterion.findMany({
      orderBy: { id: 'asc' }
    });

    // Validasi atau set bobot default seimbang
    let totalWeight = 0;
    const finalWeights = {};

    for (const c of criteria) {
      const w = weights[c.id] !== undefined ? parseFloat(weights[c.id]) : (1 / criteria.length);
      finalWeights[c.id] = parseFloat(w.toFixed(2));
      totalWeight += finalWeights[c.id];
    }

    // Normalisasi jika selisih sedikit dari 1.0
    if (Math.abs(totalWeight - 1.0) > 0.05) {
      return res.status(400).json({
        success: false,
        message: `Total bobot kriteria harus bernilai 1.0 (atau 100%). Total saat ini: ${(totalWeight * 100).toFixed(1)}%`
      });
    }

    const created = await prisma.$transaction(async (tx) => {
      const newProfile = await tx.profile.create({
        data: {
          name: name.trim(),
          slug: finalSlug,
          description: description || `Profil khusus untuk ${name.trim()}`,
          iconName: icon_name,
          isActive: true
        }
      });

      // Simpan bobot kriteria
      for (const c of criteria) {
        await tx.profileCriteriaWeight.create({
          data: {
            profileId: newProfile.id,
            criterionId: c.id,
            weight: finalWeights[c.id]
          }
        });
      }

      return newProfile;
    });

    res.status(201).json({
      success: true,
      message: 'Profil pengguna baru berhasil ditambahkan!',
      data: created
    });
  } catch (error) {
    console.error('Error creating profile (Prisma):', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/profiles/:id/weights
exports.updateWeights = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { weights } = req.body;

    if (!weights || typeof weights !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Format bobot tidak valid. Harus berupa object { criterion_id: weight }'
      });
    }

    // Validasi total bobot (harus mendekati 1.0)
    let totalWeight = 0;
    for (const critId in weights) {
      totalWeight += parseFloat(weights[critId] || 0);
    }

    if (Math.abs(totalWeight - 1.0) > 0.05) {
      return res.status(400).json({
        success: false,
        message: `Total bobot harus bernilai 1.0 (atau 100%). Total saat ini: ${(totalWeight * 100).toFixed(1)}%`
      });
    }

    await prisma.$transaction(async (tx) => {
      for (const critId in weights) {
        const cId = parseInt(critId, 10);
        const wVal = parseFloat(Number(weights[critId] || 0).toFixed(2));

        await tx.profileCriteriaWeight.upsert({
          where: {
            profileId_criterionId: {
              profileId: id,
              criterionId: cId
            }
          },
          update: {
            weight: wVal
          },
          create: {
            profileId: id,
            criterionId: cId,
            weight: wVal
          }
        });
      }
    });

    res.json({
      success: true,
      message: 'Bobot kriteria profil berhasil diperbarui!'
    });
  } catch (error) {
    console.error('Error updating weights (Prisma):', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/profiles/:id
exports.update = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { name, slug, description, icon_name, weights } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Nama profil wajib diisi!'
      });
    }

    // Validasi bobot jika disediakan
    if (weights && typeof weights === 'object') {
      let totalWeight = 0;
      for (const critId in weights) {
        totalWeight += parseFloat(weights[critId] || 0);
      }

      if (Math.abs(totalWeight - 1.0) > 0.05) {
        return res.status(400).json({
          success: false,
          message: `Total bobot harus bernilai 1.0 (atau 100%). Total saat ini: ${(totalWeight * 100).toFixed(1)}%`
        });
      }
    }

    const updated = await prisma.$transaction(async (tx) => {
      const p = await tx.profile.update({
        where: { id },
        data: {
          name: name.trim(),
          slug: slug ? slugify(slug) : undefined,
          description: description !== undefined ? description : undefined,
          iconName: icon_name !== undefined ? icon_name : undefined
        }
      });

      if (weights && typeof weights === 'object') {
        for (const critId in weights) {
          const cId = parseInt(critId, 10);
          const wVal = parseFloat(Number(weights[critId] || 0).toFixed(2));

          await tx.profileCriteriaWeight.upsert({
            where: {
              profileId_criterionId: {
                profileId: id,
                criterionId: cId
              }
            },
            update: { weight: wVal },
            create: {
              profileId: id,
              criterionId: cId,
              weight: wVal
            }
          });
        }
      }

      return p;
    });

    res.json({
      success: true,
      message: 'Profil dan bobot kriteria berhasil diperbarui',
      data: updated
    });
  } catch (error) {
    console.error('Error updating profile (Prisma):', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/profiles/:id
exports.delete = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    const totalProfiles = await prisma.profile.count();
    if (totalProfiles <= 1) {
      return res.status(400).json({
        success: false,
        message: 'Tidak dapat menghapus profil. Sistem membutuhkan minimal 1 profil tersisa.'
      });
    }

    await prisma.profile.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Profil berhasil dihapus'
    });
  } catch (error) {
    console.error('Error deleting profile (Prisma):', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
