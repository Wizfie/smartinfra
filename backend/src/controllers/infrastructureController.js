const prisma = require('../config/prisma');

// Helper: sync laptop criteria values via Prisma
async function syncCriteriaValues(tx, laptopId, laptopData) {
  const mappings = [
    { code: 'C1', val: parseFloat(laptopData.price) },
    { code: 'C2', val: parseFloat(laptopData.processorScore || laptopData.processor_score || 80.00) },
    { code: 'C3', val: parseFloat(laptopData.ramGb || laptopData.ram_gb || 32) },
    { code: 'C4', val: parseFloat(laptopData.storageGb || laptopData.storage_gb || 512) },
    { code: 'C5', val: parseFloat(laptopData.gpuScore || laptopData.gpu_score || 10.00) },
    { code: 'C6', val: parseFloat(laptopData.bandwidthGbps || laptopData.bandwidth_gbps || 25.0) },
    { code: 'C7', val: parseFloat(laptopData.batteryHours || laptopData.battery_hours || 99.99) },
    { code: 'C8', val: parseFloat(laptopData.securityScore || laptopData.security_score || 95.0) },
    { code: 'C9', val: parseFloat(laptopData.supportScore || laptopData.support_score || 95.0) }
  ];

  const criteria = await tx.criterion.findMany();
  const codeToId = {};
  criteria.forEach(c => { codeToId[c.code] = c.id; });

  for (const m of mappings) {
    const critId = codeToId[m.code];
    if (critId) {
      await tx.laptopCriteriaValue.upsert({
        where: {
          laptopId_criterionId: {
            laptopId,
            criterionId: critId
          }
        },
        update: {
          rawValue: m.val
        },
        create: {
          laptopId,
          criterionId: critId,
          rawValue: m.val
        }
      });
    }
  }
}

// GET /api/laptops
exports.getAll = async (req, res) => {
  try {
    const { search, brand, category, min_price, max_price, min_ram, in_stock, sort } = req.query;

    const where = {};

    if (category && category !== 'all') {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { brand: { contains: search } },
        { model: { contains: search } },
        { processorName: { contains: search } }
      ];
    }

    if (brand && brand !== 'all' && brand !== 'Semua Brand') {
      where.brand = brand;
    }

    if (min_price || max_price) {
      where.price = {};
      if (min_price) where.price.gte = parseFloat(min_price);
      if (max_price) where.price.lte = parseFloat(max_price);
    }

    if (min_ram) {
      where.ramGb = { gte: parseInt(min_ram, 10) };
    }

    if (in_stock === 'true' || in_stock === '1') {
      where.stock = { gt: 0 };
    }

    let orderBy = { id: 'desc' };
    switch (sort) {
      case 'price_asc':
        orderBy = { price: 'asc' };
        break;
      case 'price_desc':
        orderBy = { price: 'desc' };
        break;
      case 'ram_desc':
        orderBy = { ramGb: 'desc' };
        break;
      case 'name_asc':
        orderBy = { model: 'asc' };
        break;
      default:
        orderBy = { id: 'desc' };
    }

    const laptops = await prisma.laptop.findMany({
      where,
      orderBy: sort === 'bestseller' ? undefined : orderBy,
      include: {
        orderItems: {
          select: {
            quantity: true,
            order: {
              select: {
                paymentStatus: true
              }
            }
          }
        }
      }
    });

    // Hitung total node per kategori
    const categoryGroup = await prisma.laptop.groupBy({
      by: ['category'],
      _count: { id: true }
    });
    const categoryCounts = {
      all: 0,
      shared_server: 0,
      cloud_instance: 0,
      gpu_rig: 0
    };
    categoryGroup.forEach(g => {
      const cat = g.category || 'cloud_instance';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + g._count.id;
      categoryCounts.all += g._count.id;
    });

    // Ambil daftar unique brand yang disesuaikan secara hierarkis dengan kategori yang dipilih
    const brandWhere = (category && category !== 'all') ? { category } : {};
    const brandGroup = await prisma.laptop.groupBy({
      by: ['brand'],
      where: brandWhere,
      _count: { id: true },
      orderBy: { brand: 'asc' }
    });
    const brands = brandGroup.map(b => b.brand);
    const brandsWithCount = brandGroup.map(b => ({ brand: b.brand, count: b._count.id }));

    // Format output untuk frontend
    let formatted = laptops.map(l => {
      const totalSold = (l.orderItems || []).reduce((acc, item) => {
        if (!item.order || item.order.paymentStatus !== 'cancelled') {
          return acc + (item.quantity || 1);
        }
        return acc;
      }, 0);

      return {
        id: l.id,
        category: l.category || 'cloud_instance',
        brand: l.brand,
        model: l.model,
        sku: l.sku,
        price: parseFloat(l.price),
        stock: l.stock,
        total_sold: totalSold,
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
        description: l.description,
        created_at: l.createdAt
      };
    });

    // Urutkan berdasarkan penjualan terlaris jika sort === 'bestseller'
    if (sort === 'bestseller') {
      formatted.sort((a, b) => {
        if (b.total_sold !== a.total_sold) {
          return b.total_sold - a.total_sold;
        }
        return b.processor_score - a.processor_score;
      });
    }

    res.json({
      success: true,
      total: formatted.length,
      categoryCounts,
      brands,
      brandsWithCount,
      data: formatted
    });
  } catch (error) {
    console.error('Error fetching laptops (Prisma):', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/laptops/:id
exports.getById = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const laptop = await prisma.laptop.findUnique({
      where: { id },
      include: {
        criteriaValues: {
          include: {
            criterion: true
          }
        },
        orderItems: {
          select: {
            quantity: true,
            order: {
              select: {
                paymentStatus: true
              }
            }
          }
        }
      }
    });

    if (!laptop) {
      return res.status(404).json({ success: false, message: 'Node infrastruktur tidak ditemukan' });
    }

    const totalSold = (laptop.orderItems || []).reduce((acc, item) => {
      if (!item.order || item.order.paymentStatus !== 'cancelled') {
        return acc + (item.quantity || 1);
      }
      return acc;
    }, 0);

    const formatted = {
      id: laptop.id,
      category: laptop.category || 'cloud_instance',
      brand: laptop.brand,
      model: laptop.model,
      sku: laptop.sku,
      price: parseFloat(laptop.price),
      stock: laptop.stock,
      total_sold: totalSold,
      processor_name: laptop.processorName,
      processor_score: parseFloat(laptop.processorScore),
      ram_gb: laptop.ramGb,
      storage_desc: laptop.storageDesc,
      storage_gb: laptop.storageGb,
      gpu_name: laptop.gpuName,
      gpu_score: parseFloat(laptop.gpuScore),
      battery_hours: parseFloat(laptop.batteryHours),
      weight_kg: parseFloat(laptop.weightKg),
      screen_desc: laptop.screenDesc,
      image_url: laptop.imageUrl,
      description: laptop.description,
      criteria_values: laptop.criteriaValues.map(cv => ({
        code: cv.criterion.code,
        name: cv.criterion.name,
        type: cv.criterion.type,
        raw_value: parseFloat(cv.rawValue)
      }))
    };

    res.json({
      success: true,
      data: formatted
    });
  } catch (error) {
    console.error('Error fetching laptop detail (Prisma):', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/laptops
exports.create = async (req, res) => {
  try {
    const {
      category = 'cloud_instance',
      brand,
      model,
      sku,
      price,
      stock = 10,
      processor_name,
      processor_score = 80.00,
      ram_gb,
      storage_desc,
      storage_gb = 512,
      gpu_name,
      gpu_score = 70.00,
      battery_hours = 99.9,
      weight_kg = 1.40,
      screen_desc,
      image_url,
      description
    } = req.body;

    if (!brand || !model || !price || !ram_gb) {
      return res.status(400).json({
        success: false,
        message: 'Brand, Model, Harga, dan RAM wajib diisi!'
      });
    }

    const created = await prisma.$transaction(async (tx) => {
      const laptop = await tx.laptop.create({
        data: {
          category: category || 'cloud_instance',
          brand,
          model,
          sku: sku || null,
          price: parseFloat(price),
          stock: parseInt(stock, 10),
          processorName: processor_name || 'Standard Processor',
          processorScore: parseFloat(processor_score),
          ramGb: parseInt(ram_gb, 10),
          storageDesc: storage_desc || `${storage_gb}GB SSD`,
          storageGb: parseInt(storage_gb, 10),
          gpuName: gpu_name || 'Integrated Graphics',
          gpuScore: parseFloat(gpu_score),
          batteryHours: parseFloat(battery_hours),
          weightKg: parseFloat(weight_kg),
          screenDesc: screen_desc || '14.0" FHD IPS',
          imageUrl: image_url || null,
          description: description || ''
        }
      });

      await syncCriteriaValues(tx, laptop.id, {
        price,
        processor_score,
        ram_gb,
        storage_gb,
        gpu_score,
        battery_hours
      });

      return laptop;
    });

    res.status(201).json({
      success: true,
      message: 'Infrastruktur berhasil ditambahkan',
      data: created
    });
  } catch (error) {
    console.error('Error creating laptop (Prisma):', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/laptops/:id
exports.update = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const data = req.body;

    const updated = await prisma.$transaction(async (tx) => {
      const laptop = await tx.laptop.update({
        where: { id },
        data: {
          category: data.category !== undefined ? data.category : undefined,
          brand: data.brand,
          model: data.model,
          sku: data.sku,
          price: data.price ? parseFloat(data.price) : undefined,
          stock: data.stock !== undefined ? parseInt(data.stock, 10) : undefined,
          processorName: data.processor_name || data.processorName,
          processorScore: data.processor_score ? parseFloat(data.processor_score) : undefined,
          ramGb: data.ram_gb ? parseInt(data.ram_gb, 10) : undefined,
          storageDesc: data.storage_desc || data.storageDesc,
          storageGb: data.storage_gb ? parseInt(data.storage_gb, 10) : undefined,
          gpuName: data.gpu_name || data.gpuName,
          gpuScore: data.gpu_score ? parseFloat(data.gpu_score) : undefined,
          batteryHours: data.battery_hours ? parseFloat(data.battery_hours) : undefined,
          weightKg: data.weight_kg ? parseFloat(data.weight_kg) : undefined,
          screenDesc: data.screen_desc || data.screenDesc,
          imageUrl: data.image_url !== undefined ? (data.image_url || null) : (data.imageUrl !== undefined ? (data.imageUrl || null) : undefined),
          description: data.description
        }
      });

      await syncCriteriaValues(tx, id, laptop);
      return laptop;
    });

    res.json({
      success: true,
      message: 'Data infrastruktur berhasil diperbarui',
      data: updated
    });
  } catch (error) {
    console.error('Error updating laptop (Prisma):', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/laptops/:id/stock
exports.updateStock = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const stock = parseInt(req.body.stock, 10);

    const updated = await prisma.laptop.update({
      where: { id },
      data: { stock }
    });

    res.json({
      success: true,
      message: 'Stok berhasil diperbarui',
      data: { id: updated.id, stock: updated.stock }
    });
  } catch (error) {
    console.error('Error updating stock (Prisma):', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/laptops/:id
exports.delete = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.laptop.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Node infrastruktur berhasil dihapus'
    });
  } catch (error) {
    console.error('Error deleting laptop (Prisma):', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/brands or /api/laptops/brands
exports.getBrands = async (req, res) => {
  try {
    const distinctBrands = await prisma.laptop.findMany({
      distinct: ['brand'],
      select: { brand: true },
      orderBy: { brand: 'asc' }
    });
    const brands = distinctBrands.map(b => b.brand).filter(Boolean);
    res.json({
      success: true,
      brands,
      data: brands
    });
  } catch (error) {
    console.error('Error fetching brands (Prisma):', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

