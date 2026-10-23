const prisma = require('../src/config/prisma');

async function main() {
  console.log('=== [1/3] SEEDING 9 FULL ENTERPRISE CRITERIA (C1 - C9) ===');

  const criteriaData = [
    {
      id: 1,
      code: 'C1',
      name: 'Biaya Sewa / Investasi Bulanan',
      type: 'cost',
      description: 'Estimasi biaya sewa Cloud instance bulanan (OpEx) atau angsuran pengadaan bare metal server (CapEx) dalam Rupiah.'
    },
    {
      id: 2,
      code: 'C2',
      name: 'Kekuatan Compute Processor (vCPU)',
      type: 'benefit',
      description: 'Skor throughput benchmark komputasi multi-core vCPU / Physical Processor Cores.'
    },
    {
      id: 3,
      code: 'C3',
      name: 'Kapasitas Memori RAM ECC',
      type: 'benefit',
      description: 'Kapasitas RAM sistem dalam Gigabyte (GB) DDR5 Server Memory dengan fitur Error-Correcting Code.'
    },
    {
      id: 4,
      code: 'C4',
      name: 'Storage NVMe Enterprise',
      type: 'benefit',
      description: 'Kapasitas NVMe SSD dalam Gigabyte (GB) & performa kecepatan read/write IOPS.'
    },
    {
      id: 5,
      code: 'C5',
      name: 'Akselerator AI & GPU VRAM',
      type: 'benefit',
      description: 'Kapasitas memori grafis VRAM (GB) & akselerasi Tensor Cores untuk deep learning dan inferensi AI.'
    },
    {
      id: 6,
      code: 'C6',
      name: 'Konektivitas & Bandwidth Jaringan',
      type: 'benefit',
      description: 'Kecepatan throughput port jaringan (Gbps) dan kuota alokasi bandwidth transfer data.'
    },
    {
      id: 7,
      code: 'C7',
      name: 'Garansi Keandalan Uptime SLA',
      type: 'benefit',
      description: 'Jaminan ketersediaan operasional Uptime SLA (%) datacenter (99.9% hingga 99.99%).'
    },
    {
      id: 8,
      code: 'C8',
      name: 'Proteksi Keamanan Anti-DDoS & Skalabilitas',
      type: 'benefit',
      description: 'Skor perlindungan keamanan Anti-DDoS, Hardware Firewall, WAF, dan kemudahan upgrade kapasitas.'
    },
    {
      id: 9,
      code: 'C9',
      name: 'Dukungan Teknis 24/7 & Zona Data Center',
      type: 'benefit',
      description: 'Tingkat SLA respon bantuan teknis 24/7/365 dan optimasi latensi rendah zona datacenter lokal.'
    }
  ];

  for (const c of criteriaData) {
    await prisma.criterion.upsert({
      where: { id: c.id },
      update: { code: c.code, name: c.name, type: c.type, description: c.description },
      create: c
    });
  }
  console.log('✓ 9 Kriteria Komputasi SAW tersimpan.');

  console.log('=== [2/3] SEEDING 3 PROFIL BEBAN KERJA (9 BOBOT SAW = 100%) ===');

  const profilesData = [
    {
      id: 1,
      slug: 'web-microservices',
      name: 'Web & Microservices Backend',
      description: 'Fokus pada efisiensi biaya anggaran (OpEx), keandalan RAM sistem, throughput bandwidth, dan jaminan ketersediaan Uptime SLA 99.9%.',
      iconName: 'dns',
      weights: [
        { criterionId: 1, weight: 0.2000 }, // Biaya Hemat 20%
        { criterionId: 2, weight: 0.1500 }, // CPU 15%
        { criterionId: 3, weight: 0.1500 }, // RAM 15%
        { criterionId: 4, weight: 0.1000 }, // Storage 10%
        { criterionId: 5, weight: 0.0500 }, // GPU minimal 5%
        { criterionId: 6, weight: 0.1500 }, // Bandwidth Jaringan 15%
        { criterionId: 7, weight: 0.1500 }, // SLA Uptime 15%
        { criterionId: 8, weight: 0.0250 }, // Keamanan 2.5%
        { criterionId: 9, weight: 0.0250 }  // Support 2.5%
      ]
    },
    {
      id: 2,
      slug: 'database-bigdata',
      name: 'High-Throughput Database & Big Data',
      description: 'Fokus pada kapasitas RAM raksasa, multi-core CPU paralel, kecepatan throughput IOPS NVMe SSD, dan redundansi Uptime.',
      iconName: 'database',
      weights: [
        { criterionId: 1, weight: 0.1000 }, // Biaya 10%
        { criterionId: 2, weight: 0.2000 }, // CPU 20%
        { criterionId: 3, weight: 0.2500 }, // RAM Utama 25%
        { criterionId: 4, weight: 0.2000 }, // Storage IOPS 20%
        { criterionId: 5, weight: 0.0500 }, // GPU 5%
        { criterionId: 6, weight: 0.0500 }, // Bandwidth 5%
        { criterionId: 7, weight: 0.1000 }, // SLA Uptime 10%
        { criterionId: 8, weight: 0.0250 }, // Keamanan 2.5%
        { criterionId: 9, weight: 0.0250 }  // Support 2.5%
      ]
    },
    {
      id: 3,
      slug: 'ai-deeplearning',
      name: 'AI Model Training & Deep Learning',
      description: 'Fokus mutlak pada GPU VRAM besar, Tensor Cores, komputasi floating-point, dan RAM berkecepatan tinggi.',
      iconName: 'memory',
      weights: [
        { criterionId: 1, weight: 0.0500 }, // Biaya 5%
        { criterionId: 2, weight: 0.1000 }, // CPU 10%
        { criterionId: 3, weight: 0.1500 }, // RAM 15%
        { criterionId: 4, weight: 0.1500 }, // Storage Scratch 15%
        { criterionId: 5, weight: 0.3500 }, // GPU Tensor Utama 35%
        { criterionId: 6, weight: 0.1000 }, // Bandwidth Clustering 10%
        { criterionId: 7, weight: 0.0500 }, // SLA Uptime 5%
        { criterionId: 8, weight: 0.0250 }, // Keamanan 2.5%
        { criterionId: 9, weight: 0.0250 }  // Support 2.5%
      ]
    }
  ];

  for (const p of profilesData) {
    const profile = await prisma.profile.upsert({
      where: { id: p.id },
      update: {
        slug: p.slug,
        name: p.name,
        description: p.description,
        iconName: p.iconName,
        isActive: true
      },
      create: {
        id: p.id,
        slug: p.slug,
        name: p.name,
        description: p.description,
        iconName: p.iconName,
        isActive: true
      }
    });

    for (const w of p.weights) {
      await prisma.profileCriteriaWeight.upsert({
        where: {
          profileId_criterionId: {
            profileId: profile.id,
            criterionId: w.criterionId
          }
        },
        update: { weight: w.weight },
        create: {
          profileId: profile.id,
          criterionId: w.criterionId,
          weight: w.weight
        }
      });
    }
  }
  console.log('✓ 3 Profil Beban Kerja dengan 9 kriteria tersimpan.');

  console.log('=== [3/3] SYNCING 9 CRITERIA VALUES FOR 10 SERVER NODES ===');

  const nodeMetrics = {
    1: { c6: 12.5, c8: 95.0, c9: 96.0 }, // AWS EC2 t4g
    2: { c6: 32.0, c8: 96.0, c9: 97.0 }, // GCP n2-standard
    3: { c6: 10.0, c8: 86.0, c9: 88.0 }, // DO Dedicated
    4: { c6: 25.0, c8: 95.0, c9: 96.0 }, // AWS EC2 g5 GPU
    5: { c6: 30.0, c8: 96.0, c9: 95.0 }, // Azure D16s
    6: { c6: 10.0, c8: 88.0, c9: 90.0 }, // Dual RTX 4090
    7: { c6: 25.0, c8: 92.0, c9: 94.0 }, // RTX A6000 Ada
    8: { c6: 100.0, c8: 97.0, c9: 98.0 }, // NVIDIA H100 SuperServer
    9: { c6: 10.0, c8: 90.0, c9: 92.0 }, // Mac Studio M2 Ultra
    10: { c6: 50.0, c8: 96.0, c9: 97.0 } // Dell PowerEdge R750xa
  };

  const existingNodes = await prisma.laptop.findMany();
  for (const node of existingNodes) {
    const extra = nodeMetrics[node.id] || { c6: 10.0, c8: 90.0, c9: 90.0 };

    const criteriaValues = [
      { criterionId: 1, rawValue: parseFloat(node.price) },
      { criterionId: 2, rawValue: parseFloat(node.processorScore) },
      { criterionId: 3, rawValue: parseFloat(node.ramGb) },
      { criterionId: 4, rawValue: parseFloat(node.storageGb) },
      { criterionId: 5, rawValue: parseFloat(node.gpuScore) },
      { criterionId: 6, rawValue: parseFloat(extra.c6) },
      { criterionId: 7, rawValue: parseFloat(node.batteryHours) }, // SLA Uptime %
      { criterionId: 8, rawValue: parseFloat(extra.c8) },
      { criterionId: 9, rawValue: parseFloat(extra.c9) }
    ];

    for (const cv of criteriaValues) {
      await prisma.laptopCriteriaValue.upsert({
        where: {
          laptopId_criterionId: {
            laptopId: node.id,
            criterionId: cv.criterionId
          }
        },
        update: { rawValue: cv.rawValue },
        create: {
          laptopId: node.id,
          criterionId: cv.criterionId,
          rawValue: cv.rawValue
        }
      });
    }
  }

  console.log('✓ Matriks Nilai SAW 9 Kriteria tersinkronisasi untuk 10 node server.');
  console.log('=== SEED 9 CRITERIA BERHASIL SEMPURNA ===');
}

main()
  .catch((e) => {
    console.error('Error seeding 9 criteria:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
