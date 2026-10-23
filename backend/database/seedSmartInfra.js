const prisma = require('../src/config/prisma');

async function main() {
  console.log('=== Memulai Seeding Database SmartInfra (smartinfra_db) ===');

  // 1. Seed Users (Admin & Solution Architect)
  console.log('[1/4] Seeding Users...');
  await prisma.user.upsert({
    where: { email: 'admin@smartinfra.com' },
    update: {
      name: 'Infrastructure Lead & Sysadmin',
      passwordHash: 'admin123',
      role: 'admin'
    },
    create: {
      name: 'Infrastructure Lead & Sysadmin',
      email: 'admin@smartinfra.com',
      passwordHash: 'admin123',
      role: 'admin'
    }
  });
  console.log('✓ Akun Admin: admin@smartinfra.com / admin123');

  await prisma.user.upsert({
    where: { email: 'consultant@smartinfra.com' },
    update: {
      name: 'IT Solution Architect & Financing Specialist',
      passwordHash: 'consultant123',
      role: 'sales'
    },
    create: {
      name: 'IT Solution Architect & Financing Specialist',
      email: 'consultant@smartinfra.com',
      passwordHash: 'consultant123',
      role: 'sales'
    }
  });
  console.log('✓ Akun Solution Architect (Consultant): consultant@smartinfra.com / consultant123');

  // 2. Seed Criteria (C1 - C9 Full Server Infrastructure)
  console.log('[2/4] Seeding Criteria C1 - C9 Full Server Infrastructure...');
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

  // 3. Seed Profiles & Profile Criteria Weights (3 Workload Profiles)
  console.log('[3/4] Seeding 3 Profil Beban Kerja Software House...');
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
  console.log('✓ 3 Profil Beban Kerja & Bobot SAW tersimpan.');

  // 4. Seed 10 Alternatif Infrastruktur Komputasi (5 Cloud + 5 Dedicated GPU Rig)
  console.log('[4/4] Seeding 10 Alternatif Komputasi (Cloud & GPU Rig)...');
  const infrastructureData = [
    // --- CLOUD INSTANCES (IaaS) ---
    {
      id: 1,
      category: 'cloud_instance',
      brand: 'AWS',
      model: 'AWS EC2 t4g.2xlarge Compute Instance',
      sku: 'AWS-EC2-T4G-2XL',
      price: 1850000.00, // Rp 1.850.000 / bulan
      stock: 50,
      processorName: 'AWS Graviton3 8-Core (ARM Neoverse V1)',
      processorScore: 78.00,
      ramGb: 32,
      storageDesc: '300 GB NVMe SSD (EBS gp3 Burst 3000 IOPS)',
      storageGb: 300,
      gpuName: 'Integrated / Cloud Virtualized Graphics',
      gpuScore: 10.00,
      batteryHours: 99.99, // SLA Uptime %
      weightKg: 0.00,
      screenDesc: 'Cloud Dashboard / Web Console',
      imageUrl: '/images/infrastructures/aws-ec2-t4g.svg',
      description: 'Instance komputasi awan efisiensi tinggi berbasis ARM Graviton3. Sangat hemat biaya operasional (OpEx) untuk backend API, microservices, dan web application production ber-traffic stabil.'
    },
    {
      id: 2,
      category: 'cloud_instance',
      brand: 'Google Cloud',
      model: 'GCP n2-standard-16 Compute Engine',
      sku: 'GCP-N2-STD-16',
      price: 4900000.00, // Rp 4.900.000 / bulan
      stock: 40,
      processorName: 'Intel Xeon Scalable 16-vCPU (Cascade/Ice Lake)',
      processorScore: 86.00,
      ramGb: 64,
      storageDesc: '500 GB NVMe Balanced Persistent Disk (6000 IOPS)',
      storageGb: 500,
      gpuName: 'Integrated Cloud Virtualized Graphics',
      gpuScore: 10.00,
      batteryHours: 99.99,
      weightKg: 0.00,
      screenDesc: 'Google Cloud Console',
      imageUrl: '/images/infrastructures/gcp-n2-standard.svg',
      description: 'Mesin virtual Google Cloud dengan rasio memori dan prosesor seimbang. Dioptimalkan untuk enterprise microservices, kontainer Kubernetes (GKE), dan pemrosesan antrean data simultan.'
    },
    {
      id: 3,
      category: 'cloud_instance',
      brand: 'DigitalOcean',
      model: 'DO Dedicated CPU Droplet 8-vCPU',
      sku: 'DO-DEDICATED-8C',
      price: 2450000.00, // Rp 2.450.000 / bulan
      stock: 60,
      processorName: 'Dedicated AMD EPYC 8-Core 2.8GHz',
      processorScore: 75.00,
      ramGb: 32,
      storageDesc: '250 GB Enterprise NVMe SSD (High-Speed)',
      storageGb: 250,
      gpuName: 'Integrated Virtual Display',
      gpuScore: 10.00,
      batteryHours: 99.95,
      weightKg: 0.00,
      screenDesc: 'DigitalOcean Cloud Panel',
      imageUrl: '/images/infrastructures/digitalocean-droplet.svg',
      description: 'Dedicated CPU Droplet tanpa perebutan sumber daya CPU (no noisy neighbors). Sangat ramah anggaran untuk startup software house dalam hosting staging & production server mandiri.'
    },
    {
      id: 4,
      category: 'cloud_instance',
      brand: 'AWS',
      model: 'AWS EC2 g5.2xlarge GPU Cloud Instance',
      sku: 'AWS-EC2-G5-2XL',
      price: 8750000.00, // Rp 8.750.000 / bulan
      stock: 25,
      processorName: 'AMD EPYC 2nd Gen 8-vCPU',
      processorScore: 82.00,
      ramGb: 32,
      storageDesc: '450 GB NVMe High-Performance Local SSD',
      storageGb: 450,
      gpuName: 'NVIDIA A10G Tensor Core 24GB GDDR6',
      gpuScore: 76.00,
      batteryHours: 99.95,
      weightKg: 0.00,
      screenDesc: 'AWS Management Console',
      imageUrl: '/images/infrastructures/aws-ec2-g5.svg',
      description: 'Instance cloud bertenaga akselerator GPU NVIDIA A10G 24GB VRAM. Solusi ideal untuk menjalankan inferensi LLM, computer vision di cloud, dan rendering grafis tanpa investasi hardware fisik.'
    },
    {
      id: 5,
      category: 'cloud_instance',
      brand: 'Microsoft Azure',
      model: 'Azure D16s v5 Virtual Machine',
      sku: 'AZURE-D16S-V5',
      price: 5200000.00, // Rp 5.200.000 / bulan
      stock: 35,
      processorName: 'Intel Xeon Platinum 8370C 16-vCPU (Ice Lake)',
      processorScore: 85.00,
      ramGb: 64,
      storageDesc: '400 GB Premium SSD v2 (High-Throughput)',
      storageGb: 400,
      gpuName: 'Azure Virtualized Graphic Adaptor',
      gpuScore: 10.00,
      batteryHours: 99.99,
      weightKg: 0.00,
      screenDesc: 'Azure Portal & Azure CLI',
      imageUrl: '/images/infrastructures/azure-d16s-v5.svg',
      description: 'Virtual machine enterprise dari Microsoft Azure dengan arsitektur memori cepat dan integrasi ekosistem korporat. Direkomendasikan untuk sistem ERP, backend .NET/Java, dan database SQL Server.'
    },

    // --- DEDICATED GPU RIGS (Hardware On-Premise) ---
    {
      id: 6,
      category: 'gpu_rig',
      brand: 'NVIDIA / Custom Rig',
      model: 'Dual NVIDIA RTX 4090 AI Dev Rig',
      sku: 'RIG-DUAL-4090-AI',
      price: 78500000.00, // Rp 78.500.000 unit / opsi cicilan
      stock: 8,
      processorName: 'AMD Ryzen Threadripper PRO 5965WX 24-Core 4.5GHz',
      processorScore: 94.00,
      ramGb: 128,
      storageDesc: '2 TB PCIe Gen4 NVMe M.2 (Read 7400 MB/s)',
      storageGb: 2000,
      gpuName: 'Dual NVIDIA GeForce RTX 4090 24GB (Total 48GB VRAM)',
      gpuScore: 95.00,
      batteryHours: 99.50, // Indeks Efisiensi Operasional On-Premise
      weightKg: 18.50,
      screenDesc: 'Multi-Display 4K 144Hz Output Support',
      imageUrl: '/images/infrastructures/dual-rtx-4090-rig.svg',
      description: 'Rig komputasi workstation deep learning dengan dual GPU RTX 4090 (48GB VRAM gabungan) dan 128GB RAM DDR5. Pilihan terpopuler bagi lab software house untuk fine-tuning model LLM lokal dan Stable Diffusion.'
    },
    {
      id: 7,
      category: 'gpu_rig',
      brand: 'NVIDIA Enterprise',
      model: 'NVIDIA RTX A6000 Ada Generation Workstation',
      sku: 'WS-RTX-A6000-ADA',
      price: 135000000.00, // Rp 135.000.000
      stock: 5,
      processorName: 'Intel Xeon W9-3475X 36-Core 4.8GHz Turbo',
      processorScore: 96.00,
      ramGb: 256,
      storageDesc: '4 TB Enterprise Enterprise NVMe U.2 (PCIe Gen4)',
      storageGb: 4000,
      gpuName: 'NVIDIA RTX A6000 Ada Generation 48GB ECC GDDR6',
      gpuScore: 98.00,
      batteryHours: 99.80,
      weightKg: 22.00,
      screenDesc: 'Quad DisplayPort 1.4a ISV Certified',
      imageUrl: '/images/infrastructures/nvidia-rtx-a6000-ada.svg',
      description: 'Workstation AI kelas korporat dengan memori grafis 48GB ECC anti-korupsi data dan sertifikasi driver ISV. Dirancang untuk pelatihan model neural network berkelanjutan 24/7 tanpa risiko crash memori.'
    },
    {
      id: 8,
      category: 'gpu_rig',
      brand: 'NVIDIA / Supermicro',
      model: 'NVIDIA H100 PCIe AI SuperServer 80GB HBM3',
      sku: 'SRV-NVIDIA-H100-80G',
      price: 480000000.00, // Rp 480.000.000
      stock: 3,
      processorName: 'Dual AMD EPYC 9554 64-Core (128 Cores Total)',
      processorScore: 99.00,
      ramGb: 512,
      storageDesc: '8 TB Enterprise NVMe PCIe Gen5 (14000 MB/s)',
      storageGb: 8000,
      gpuName: 'NVIDIA H100 Tensor Core 80GB HBM3 High-Bandwidth',
      gpuScore: 100.00,
      batteryHours: 99.90,
      weightKg: 35.00,
      screenDesc: 'IPMI 2.0 Web GUI / Redfish API Management',
      imageUrl: '/images/infrastructures/nvidia-h100-pcie.svg',
      description: 'SuperServer kelas akselerator AI generasi terbaru dengan arsitektur Hopper dan memori HBM3 bandwidth 3.35 TB/s. Solusi puncak untuk pretraining model pondasi AI berskala miliaran parameter.'
    },
    {
      id: 9,
      category: 'gpu_rig',
      brand: 'Apple Enterprise',
      model: 'Apple Mac Studio M2 Ultra AI Compute Rig',
      sku: 'MAC-STUDIO-M2-ULTRA',
      price: 84000000.00, // Rp 84.000.000
      stock: 12,
      processorName: 'Apple M2 Ultra 24-Core CPU (16 Performance, 8 Efficiency)',
      processorScore: 90.00,
      ramGb: 192,
      storageDesc: '2 TB Ultra-Fast SSD Integrated (7400 MB/s)',
      storageGb: 2000,
      gpuName: '76-Core Integrated GPU (192GB Unified Memory Shared)',
      gpuScore: 84.00,
      batteryHours: 99.60,
      weightKg: 3.60,
      screenDesc: 'Supports up to 8x 4K or 6x 6K Pro Display XDR',
      imageUrl: '/images/infrastructures/mac-studio-m2-ultra.svg',
      description: 'Solusi komputasi ringkas revolusioner dengan 192GB Unified Memory berkecepatan 800 GB/s. Mampu memuat model AI 70B parameter langsung ke memori grafis dengan konsumsi daya listrik super hemat.'
    },
    {
      id: 10,
      category: 'gpu_rig',
      brand: 'Dell Enterprise',
      model: 'Dell PowerEdge R750xa Dual GPU Rack Server',
      sku: 'DELL-R750XA-2L40S',
      price: 185000000.00, // Rp 185.000.000
      stock: 4,
      processorName: 'Dual Intel Xeon Platinum 8360Y 36-Core (72 Cores Total)',
      processorScore: 97.00,
      ramGb: 128,
      storageDesc: '4 TB Hot-Plug SAS/NVMe Enterprise SSD RAID 10',
      storageGb: 4000,
      gpuName: 'Dual NVIDIA L40S 48GB Ada (Total 96GB VRAM)',
      gpuScore: 97.00,
      batteryHours: 99.90,
      weightKg: 28.00,
      screenDesc: 'iDRAC9 Enterprise Remote Management',
      imageUrl: '/images/infrastructures/dell-poweredge-r750xa.svg',
      description: 'Server rackmount 2U berperforma tinggi dengan sertifikasi ganda untuk AI inference dan virtualisasi data center privat. Dilengkapi redundansi catu daya Titanium Hot-Plug dan manajemen iDRAC9.'
    }
  ];

  for (const item of infrastructureData) {
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

    // Sinkronisasi nilai kriteria ke tabel laptop_criteria_values (C1 s/d C9)
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
    const extra = nodeMetrics[item.id] || { c6: 10.0, c8: 90.0, c9: 90.0 };

    const criteriaMappings = [
      { criterionId: 1, rawValue: parseFloat(item.price) },          // C1: Biaya (Cost)
      { criterionId: 2, rawValue: parseFloat(item.processorScore) },  // C2: CPU (Benefit)
      { criterionId: 3, rawValue: parseFloat(item.ramGb) },           // C3: RAM (Benefit)
      { criterionId: 4, rawValue: parseFloat(item.storageGb) },       // C4: Storage (Benefit)
      { criterionId: 5, rawValue: parseFloat(item.gpuScore) },        // C5: GPU/AI (Benefit)
      { criterionId: 6, rawValue: parseFloat(extra.c6) },             // C6: Bandwidth (Benefit)
      { criterionId: 7, rawValue: parseFloat(item.batteryHours) },    // C7: SLA Uptime (Benefit)
      { criterionId: 8, rawValue: parseFloat(extra.c8) },             // C8: Keamanan (Benefit)
      { criterionId: 9, rawValue: parseFloat(extra.c9) }              // C9: Support & DC (Benefit)
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
  console.log('✓ 10 Alternatif Infrastruktur Komputasi & Matriks Nilai SAW berhasil disimpan.');
  console.log('=== SEEDING SMARTINFRA SELESAI DENGAN SUKSES ===');
}

main()
  .catch((e) => {
    console.error('Error saat seeding SmartInfra:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
