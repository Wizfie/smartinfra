const prisma = require('../src/config/prisma');

async function main() {
  console.log('=== SEEDING 4 SHARED & VPS BUDGET SERVERS ===');

  const sharedServers = [
    {
      id: 11,
      category: 'shared_server',
      brand: 'IDCloudHost',
      model: 'Cloud VPS Pro ID-01 2-vCPU (Jakarta DC)',
      sku: 'IDC-VPS-PRO-2C',
      price: 180000.00,
      stock: 50,
      processorName: 'Intel Xeon Gold 2-vCPU (Local IIX 10Gbps)',
      processorScore: 62.00,
      ramGb: 4,
      storageDesc: '60 GB Enterprise NVMe SSD (Local Tier IV)',
      storageGb: 60,
      gpuName: 'Integrated Cloud Virtual Display',
      gpuScore: 5.00,
      batteryHours: 99.90, // SLA %
      weightKg: 0.00,
      screenDesc: 'Cloud Control Panel / Web VNC Console',
      imageUrl: '/images/infrastructures/idcloudhost-vps.svg',
      description: 'VPS Cloud murah dengan lokasi data center Tier IV di Jakarta (latency <5ms se-Indonesia). Pilihan pas untuk microservices ringan, bot Telegram/WA, dan staging server.'
    },
    {
      id: 12,
      category: 'shared_server',
      brand: 'Hetzner',
      model: 'Hetzner Cloud CX22 Shared vCPU 2-Core',
      sku: 'HTZ-CX22-2C',
      price: 120000.00,
      stock: 45,
      processorName: 'AMD EPYC 2-Core Shared Compute',
      processorScore: 68.00,
      ramGb: 4,
      storageDesc: '40 GB High-Speed NVMe Storage',
      storageGb: 40,
      gpuName: 'Integrated Virtual Display Adaptor',
      gpuScore: 5.00,
      batteryHours: 99.90,
      weightKg: 0.00,
      screenDesc: 'Hetzner Cloud Console (hcloud CLI)',
      imageUrl: '/images/infrastructures/hetzner-cx22.svg',
      description: 'Instance shared vCPU berkinerja tinggi berbasis AMD EPYC dengan rasio harga-performa paling ekonomis. Sangat andal untuk CI/CD runners, staging API, dan dockerized backend.'
    },
    {
      id: 13,
      category: 'shared_server',
      brand: 'DigitalOcean',
      model: 'DO Basic Droplet 1-vCPU 2GB RAM',
      sku: 'DO-BASIC-1C-2G',
      price: 95000.00,
      stock: 60,
      processorName: '1-vCPU Regular Intel/AMD Shared',
      processorScore: 55.00,
      ramGb: 2,
      storageDesc: '50 GB NVMe SSD Disk Storage',
      storageGb: 50,
      gpuName: 'Integrated Virtual Display',
      gpuScore: 5.00,
      batteryHours: 99.90,
      weightKg: 0.00,
      screenDesc: 'DigitalOcean Cloud Console',
      imageUrl: '/images/infrastructures/digitalocean-basic.svg',
      description: 'Droplet shared CPU paling ramah anggaran untuk pengujian MVP dan aplikasi mahasiswa/startup pemula. Tersedia deploy 1-Click App Docker dan Node.js.'
    },
    {
      id: 14,
      category: 'shared_server',
      brand: 'Niagahoster',
      model: 'Cloud cPanel Shared Hosting Pro Unlimited',
      sku: 'NH-CPANEL-PRO',
      price: 65000.00,
      stock: 80,
      processorName: '1-Core Shared cPanel Managed Host',
      processorScore: 45.00,
      ramGb: 2,
      storageDesc: '30 GB SSD Pure Storage RAID',
      storageGb: 30,
      gpuName: 'Integrated cPanel Display',
      gpuScore: 5.00,
      batteryHours: 99.90,
      weightKg: 0.00,
      screenDesc: 'cPanel Management Dashboard & Softaculous',
      imageUrl: '/images/infrastructures/cpanel-shared-pro.svg',
      description: 'Shared hosting terkelola penuh (fully-managed) dengan cPanel, SSL gratis, dan proteksi Imunify360. Solusi super hemat untuk web landing page, profil bisnis, dan API sederhana.'
    }
  ];

  const nodeExtraMetrics = {
    11: { c6: 10.0, c8: 82.0, c9: 85.0 },
    12: { c6: 10.0, c8: 88.0, c9: 84.0 },
    13: { c6: 1.0, c8: 80.0, c9: 82.0 },
    14: { c6: 1.0, c8: 78.0, c9: 88.0 }
  };

  for (const item of sharedServers) {
    const createdItem = await prisma.laptop.upsert({
      where: { id: item.id },
      update: {
        category: item.category,
        brand: item.brand,
        model: item.model,
        sku: item.sku,
        price: item.price,
        stock: item.stock,
        processorName: item.processorName,
        processorScore: item.processorScore,
        ramGb: item.ramGb,
        storageDesc: item.storageDesc,
        storageGb: item.storageGb,
        gpuName: item.gpuName,
        gpuScore: item.gpuScore,
        batteryHours: item.batteryHours,
        weightKg: item.weightKg,
        screenDesc: item.screenDesc,
        imageUrl: item.imageUrl,
        description: item.description
      },
      create: item
    });

    const extra = nodeExtraMetrics[item.id];
    const criteriaMappings = [
      { criterionId: 1, rawValue: parseFloat(item.price) },
      { criterionId: 2, rawValue: parseFloat(item.processorScore) },
      { criterionId: 3, rawValue: parseFloat(item.ramGb) },
      { criterionId: 4, rawValue: parseFloat(item.storageGb) },
      { criterionId: 5, rawValue: parseFloat(item.gpuScore) },
      { criterionId: 6, rawValue: parseFloat(extra.c6) },
      { criterionId: 7, rawValue: parseFloat(item.batteryHours) },
      { criterionId: 8, rawValue: parseFloat(extra.c8) },
      { criterionId: 9, rawValue: parseFloat(extra.c9) }
    ];

    for (const cm of criteriaMappings) {
      await prisma.laptopCriteriaValue.upsert({
        where: {
          laptopId_criterionId: {
            laptopId: createdItem.id,
            criterionId: cm.criterionId
          }
        },
        update: { rawValue: cm.rawValue },
        create: {
          laptopId: createdItem.id,
          criterionId: cm.criterionId,
          rawValue: cm.rawValue
        }
      });
    }
  }

  console.log('✓ 4 Shared / VPS Budget Servers berhasil ditambahkan dan disinkronkan ke 9 kriteria SAW.');
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
