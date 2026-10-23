const prisma = require('../src/config/prisma');

async function main() {
  console.log('=== [1/2] GENERATING 150 DIVERSE ENTERPRISE SERVER PRODUCTS ===');

  const products = [];
  let idCounter = 1;

  // -------------------------------------------------------------
  // 1. SHARED HOSTING & BUDGET VPS (45 PRODUCTS: IDs 1 - 45)
  // -------------------------------------------------------------
  const sharedTemplates = [
    { brand: 'Tencent Cloud', prefix: 'Tencent Lighthouse', skuPrefix: 'TC-LH', basePrice: 68000, img: '/images/infrastructures/tencent-cloud.svg', cpuVendor: 'Intel Xeon / AMD EPYC' },
    { brand: 'Alibaba Cloud', prefix: 'Alibaba Simple App Server', skuPrefix: 'ALI-SAS', basePrice: 72000, img: '/images/infrastructures/alibaba-cloud.svg', cpuVendor: 'Intel Xeon Platinum' },
    { brand: 'IDCloudHost', prefix: 'IDCloudHost Cloud VPS Pro', skuPrefix: 'IDC-VPS', basePrice: 85000, img: '/images/infrastructures/idcloudhost-vps.svg', cpuVendor: 'Intel Xeon Gold E5' },
    { brand: 'Niagahoster', prefix: 'Niagahoster cPanel Cloud Pro', skuPrefix: 'NH-CP', basePrice: 49000, img: '/images/infrastructures/cpanel-shared-pro.svg', cpuVendor: 'Cloud Linux Shared Core' },
    { brand: 'DigitalOcean', prefix: 'DO Basic Shared Droplet', skuPrefix: 'DO-BAS', basePrice: 95000, img: '/images/infrastructures/digitalocean-basic.svg', cpuVendor: 'Intel Xeon / AMD EPYC' },
    { brand: 'Hetzner', prefix: 'Hetzner Cloud CX', skuPrefix: 'HTZ-CX', basePrice: 75000, img: '/images/infrastructures/hetzner-cx22.svg', cpuVendor: 'AMD EPYC Shared' },
    { brand: 'Linode', prefix: 'Linode Shared Nanode', skuPrefix: 'LND-SH', basePrice: 78000, img: '/images/infrastructures/digitalocean-basic.svg', cpuVendor: 'AMD EPYC 7002' },
    { brand: 'Vultr', prefix: 'Vultr High Frequency VPS', skuPrefix: 'VLT-HF', basePrice: 92000, img: '/images/infrastructures/digitalocean-basic.svg', cpuVendor: 'Intel Xeon 3.8GHz+' },
    { brand: 'Biznet Gio', prefix: 'Biznet NEO Lite Cloud', skuPrefix: 'BZN-NEO', basePrice: 89000, img: '/images/infrastructures/idcloudhost-vps.svg', cpuVendor: 'Intel Xeon Scalable Local' },
    { brand: 'Rumahweb', prefix: 'Rumahweb Cloud VPS NVMe', skuPrefix: 'RMW-VPS', basePrice: 58000, img: '/images/infrastructures/cpanel-shared-pro.svg', cpuVendor: 'Intel Xeon E5 v4' },
    { brand: 'Hostinger', prefix: 'Hostinger KVM VPS Pro', skuPrefix: 'HST-KVM', basePrice: 65000, img: '/images/infrastructures/cpanel-shared-pro.svg', cpuVendor: 'AMD EPYC Zen3' },
    { brand: 'OVHcloud', prefix: 'OVHcloud Value Starter', skuPrefix: 'OVH-VAL', basePrice: 70000, img: '/images/infrastructures/hetzner-cx22.svg', cpuVendor: 'Intel Xeon D' },
    { brand: 'Scaleway', prefix: 'Scaleway Stardust Learning', skuPrefix: 'SCW-STD', basePrice: 45000, img: '/images/infrastructures/hetzner-cx22.svg', cpuVendor: 'AMD EPYC Micro' },
    { brand: 'DomaiNesia', prefix: 'DomaiNesia Cloud KVM Starter', skuPrefix: 'DMN-KVM', basePrice: 62000, img: '/images/infrastructures/cpanel-shared-pro.svg', cpuVendor: 'Intel Xeon Gold' },
    { brand: 'Exabytes', prefix: 'Exabytes Linux SSD Starter', skuPrefix: 'EXB-LNX', basePrice: 55000, img: '/images/infrastructures/cpanel-shared-pro.svg', cpuVendor: 'Intel Xeon Quad' }
  ];

  const tiersShared = [
    { name: '1-vCPU 1GB', cores: 1, ram: 1, disk: 25, priceMul: 1.0, cpuScore: 48, bw: 1.0, sec: 78, sup: 80 },
    { name: '1-vCPU 2GB', cores: 1, ram: 2, disk: 50, priceMul: 1.4, cpuScore: 54, bw: 2.5, sec: 82, sup: 83 },
    { name: '2-vCPU 4GB', cores: 2, ram: 4, disk: 80, priceMul: 2.2, cpuScore: 66, bw: 5.0, sec: 85, sup: 86 }
  ];

  let sIdx = 0;
  while (products.length < 45) {
    const tpl = sharedTemplates[sIdx % sharedTemplates.length];
    const tier = tiersShared[Math.floor(sIdx / sharedTemplates.length) % tiersShared.length];
    const price = Math.round((tpl.basePrice * tier.priceMul) / 1000) * 1000;

    products.push({
      id: idCounter++,
      category: 'shared_server',
      brand: tpl.brand,
      model: `${tpl.prefix} ${tier.name} NVMe`,
      sku: `${tpl.skuPrefix}-${tier.cores}C-${tier.ram}G`,
      price: price,
      stock: 30 + (sIdx % 25),
      processorName: `${tpl.cpuVendor} (${tier.cores} Shared vCPU)`,
      processorScore: tier.cpuScore,
      ramGb: tier.ram,
      storageDesc: `${tier.disk} GB NVMe SSD Disk (High Throughput)`,
      storageGb: tier.disk,
      gpuName: 'Integrated Virtual Display (No GPU Acceleration)',
      gpuScore: 5.0,
      batteryHours: 99.9, // SLA 99.9%
      weightKg: 0.0,
      screenDesc: 'Web Dashboard Console / SSH Terminal Access',
      imageUrl: tpl.img,
      description: `Solusi server hemat biaya dari ${tpl.brand} untuk hosting web, microservice, bot, staging test, dan API endpoint ringan berkinerja stabil.`,
      c6: tier.bw,
      c8: tier.sec,
      c9: tier.sup
    });
    sIdx++;
  }

  // -------------------------------------------------------------
  // 2. CLOUD INSTANCES / IAAS (65 PRODUCTS: IDs 46 - 110)
  // -------------------------------------------------------------
  const cloudProviders = [
    { brand: 'AWS', prefix: 'AWS EC2', skuPrefix: 'AWS-EC2', img: '/images/infrastructures/aws-ec2-t4g.svg', basePrice: 1200000 },
    { brand: 'Google Cloud', prefix: 'GCP Compute Engine', skuPrefix: 'GCP-CE', img: '/images/infrastructures/gcp-n2-standard.svg', basePrice: 1350000 },
    { brand: 'Microsoft Azure', prefix: 'Azure Virtual Machine', skuPrefix: 'AZR-VM', img: '/images/infrastructures/azure-d16s-v5.svg', basePrice: 1300000 },
    { brand: 'Tencent Cloud', prefix: 'Tencent Cloud CVM Standard', skuPrefix: 'TC-CVM', img: '/images/infrastructures/tencent-cloud.svg', basePrice: 950000 },
    { brand: 'Alibaba Cloud', prefix: 'Alibaba Cloud ECS Enterprise', skuPrefix: 'ALI-ECS', img: '/images/infrastructures/alibaba-cloud.svg', basePrice: 980000 },
    { brand: 'Oracle Cloud', prefix: 'Oracle Cloud OCI Compute', skuPrefix: 'OCI-CMP', img: '/images/infrastructures/aws-ec2-t4g.svg', basePrice: 1100000 },
    { brand: 'Huawei Cloud', prefix: 'Huawei Cloud ECS High-I/O', skuPrefix: 'HWI-ECS', img: '/images/infrastructures/alibaba-cloud.svg', basePrice: 990000 },
    { brand: 'DigitalOcean', prefix: 'DO Dedicated CPU Droplet', skuPrefix: 'DO-DED', img: '/images/infrastructures/digitalocean-droplet.svg', basePrice: 900000 },
    { brand: 'IBM Cloud', prefix: 'IBM Cloud Virtual Server', skuPrefix: 'IBM-VS', img: '/images/infrastructures/azure-d16s-v5.svg', basePrice: 1400000 },
    { brand: 'Hetzner', prefix: 'Hetzner Dedicated Root Cloud', skuPrefix: 'HTZ-DED', img: '/images/infrastructures/hetzner-cx22.svg', basePrice: 750000 }
  ];

  const cloudConfigs = [
    { name: 'c6i.xlarge (4-vCPU 8GB)', cores: 4, ram: 8, disk: 150, mul: 1.0, score: 75, bw: 12.5, sec: 92, sup: 94 },
    { name: 'm6i.2xlarge (8-vCPU 32GB)', cores: 8, ram: 32, disk: 300, mul: 2.1, score: 82, bw: 15.0, sec: 94, sup: 95 },
    { name: 'c7g.4xlarge (16-vCPU 32GB)', cores: 16, ram: 32, disk: 450, mul: 3.2, score: 87, bw: 25.0, sec: 95, sup: 95 },
    { name: 'r6i.4xlarge (16-vCPU 64GB)', cores: 16, ram: 64, disk: 600, mul: 4.3, score: 88, bw: 25.0, sec: 95, sup: 96 },
    { name: 'm7a.8xlarge (32-vCPU 128GB)', cores: 32, ram: 128, disk: 1000, mul: 7.2, score: 94, bw: 32.0, sec: 96, sup: 96 },
    { name: 'r7i.16xlarge (64-vCPU 256GB)', cores: 64, ram: 256, disk: 2000, mul: 13.5, score: 97, bw: 50.0, sec: 97, sup: 97 },
    { name: 'x2iezn.6xlarge (24-vCPU 384GB)', cores: 24, ram: 384, disk: 3000, mul: 18.0, score: 96, bw: 50.0, sec: 98, sup: 98 }
  ];

  let cIdx = 0;
  while (products.length < 110) {
    const prov = cloudProviders[cIdx % cloudProviders.length];
    const cfg = cloudConfigs[Math.floor(cIdx / cloudProviders.length) % cloudConfigs.length];
    const price = Math.round((prov.basePrice * cfg.mul) / 10000) * 10000;

    products.push({
      id: idCounter++,
      category: 'cloud_instance',
      brand: prov.brand,
      model: `${prov.prefix} ${cfg.name}`,
      sku: `${prov.skuPrefix}-${cfg.cores}C-${cfg.ram}G`,
      price: price,
      stock: 20 + (cIdx % 30),
      processorName: `Intel Xeon Platinum / AMD EPYC (${cfg.cores} vCPU Dedicated)`,
      processorScore: cfg.score,
      ramGb: cfg.ram,
      storageDesc: `${cfg.disk} GB NVMe SSD (PCIe Gen4 IOPS Tinggi)`,
      storageGb: cfg.disk,
      gpuName: 'Integrated Cloud Virtual Display Adaptor',
      gpuScore: 10.0,
      batteryHours: 99.9,
      weightKg: 0.0,
      screenDesc: 'Cloud Web Console / REST API Management / Terraform',
      imageUrl: prov.img,
      description: `Virtual cloud compute enterprise dari ${prov.brand} dengan SLA Uptime 99.99%. Sangat cocok untuk produksi microservices, database cluster, Kubernetes, dan sistem ERP korporat.`,
      c6: cfg.bw,
      c8: cfg.sec,
      c9: cfg.sup
    });
    cIdx++;
  }

  // -------------------------------------------------------------
  // 3. DEDICATED GPU RIGS & HPC SERVERS (40 PRODUCTS: IDs 111 - 150)
  // -------------------------------------------------------------
  const gpuBrands = [
    { brand: 'NVIDIA Enterprise', prefix: 'NVIDIA DGX / HGX System', skuPrefix: 'NV-DGX', img: '/images/infrastructures/nvidia-h100-pcie.svg', basePrice: 65000000 },
    { brand: 'Dell Enterprise', prefix: 'Dell PowerEdge GPU Server', skuPrefix: 'DEL-GPU', img: '/images/infrastructures/dell-poweredge-r750xa.svg', basePrice: 55000000 },
    { brand: 'Supermicro', prefix: 'Supermicro AI SuperServer', skuPrefix: 'SMC-AI', img: '/images/infrastructures/nvidia-h100-pcie.svg', basePrice: 48000000 },
    { brand: 'HPE', prefix: 'HPE ProLiant Cray AI Server', skuPrefix: 'HPE-CRY', img: '/images/infrastructures/dell-poweredge-r750xa.svg', basePrice: 52000000 },
    { brand: 'Lenovo Enterprise', prefix: 'Lenovo ThinkSystem AI Node', skuPrefix: 'LNV-AI', img: '/images/infrastructures/nvidia-rtx-a6000-ada.svg', basePrice: 46000000 },
    { brand: 'ASUS Server', prefix: 'ASUS ESC High-Density GPU', skuPrefix: 'ASU-ESC', img: '/images/infrastructures/dual-rtx-4090-rig.svg', basePrice: 42000000 },
    { brand: 'Gigabyte Server', prefix: 'Gigabyte G-Series HPC Node', skuPrefix: 'GIG-HPC', img: '/images/infrastructures/dual-rtx-4090-rig.svg', basePrice: 44000000 },
    { brand: 'Lambda Labs', prefix: 'Lambda TensorStation AI Rig', skuPrefix: 'LMB-AI', img: '/images/infrastructures/dual-rtx-4090-rig.svg', basePrice: 38000000 },
    { brand: 'Tencent Cloud', prefix: 'Tencent Cloud GPU CVM GN10X', skuPrefix: 'TC-GPU', img: '/images/infrastructures/tencent-cloud.svg', basePrice: 28000000 },
    { brand: 'Apple Enterprise', prefix: 'Apple Mac Studio M2 Ultra Rig', skuPrefix: 'APL-M2U', img: '/images/infrastructures/mac-studio-m2-ultra.svg', basePrice: 75000000 }
  ];

  const gpuRigConfigs = [
    { name: '1x NVIDIA RTX 4090 24GB AI Workstation', gpu: 'NVIDIA RTX 4090 24GB GDDR6X', gpuScore: 88, cores: 16, ram: 64, disk: 2000, mul: 1.0, cpuScore: 88, bw: 10.0, sec: 88, sup: 90, wt: 16.5 },
    { name: 'Dual NVIDIA RTX 4090 48GB VRAM Cluster Rig', gpu: 'Dual NVIDIA RTX 4090 24GB (Total 48GB)', gpuScore: 94, cores: 24, ram: 128, disk: 4000, mul: 1.8, cpuScore: 92, bw: 25.0, sec: 90, sup: 92, wt: 22.0 },
    { name: '1x NVIDIA RTX A6000 Ada 48GB ECC Rig', gpu: 'NVIDIA RTX A6000 Ada 48GB ECC', gpuScore: 96, cores: 32, ram: 192, disk: 4000, mul: 2.7, cpuScore: 94, bw: 40.0, sec: 94, sup: 94, wt: 24.0 },
    { name: 'Dual NVIDIA L40S 96GB Ada AI Inference Server', gpu: 'Dual NVIDIA L40S 48GB (Total 96GB VRAM)', gpuScore: 97, cores: 48, ram: 256, disk: 8000, mul: 3.8, cpuScore: 96, bw: 50.0, sec: 96, sup: 96, wt: 28.0 },
    { name: '4x NVIDIA A100 80GB SXM4 High-Bandwidth Rig', gpu: 'Quad NVIDIA A100 80GB SXM4 (Total 320GB VRAM)', gpuScore: 99, cores: 64, ram: 512, disk: 12000, mul: 6.5, cpuScore: 98, bw: 100.0, sec: 97, sup: 98, wt: 32.0 },
    { name: '8x NVIDIA H100 80GB HBM3 Hopper SuperServer', gpu: 'Octa NVIDIA H100 80GB HBM3 (Total 640GB VRAM)', gpuScore: 100, cores: 128, ram: 1024, disk: 16000, mul: 11.0, cpuScore: 99, bw: 400.0, sec: 99, sup: 99, wt: 42.0 }
  ];

  let gIdx = 0;
  while (products.length < 150) {
    const gb = gpuBrands[gIdx % gpuBrands.length];
    const gc = gpuRigConfigs[Math.floor(gIdx / gpuBrands.length) % gpuRigConfigs.length];
    const price = Math.round((gb.basePrice * gc.mul) / 100000) * 100000;

    products.push({
      id: idCounter++,
      category: 'gpu_rig',
      brand: gb.brand,
      model: `${gb.prefix} ${gc.name}`,
      sku: `${gb.skuPrefix}-${gc.cores}C-${gc.ram}G-GPU`,
      price: price,
      stock: 3 + (gIdx % 8),
      processorName: `AMD EPYC 9004 / Intel Xeon Scalable (${gc.cores} Cores)`,
      processorScore: gc.cpuScore,
      ramGb: gc.ram,
      storageDesc: `${gc.disk >= 1000 ? gc.disk / 1000 + ' TB' : gc.disk + ' GB'} PCIe Gen5 NVMe U.2 Enterprise`,
      storageGb: gc.disk,
      gpuName: gc.gpu,
      gpuScore: gc.gpuScore,
      batteryHours: 99.9,
      weightKg: gc.wt,
      screenDesc: 'IPMI 2.0 / Redfish Out-of-Band Management / Terminal',
      imageUrl: gb.img,
      description: `Sistem server komputasi akselerator AI dan Deep Learning kelas korporat dari ${gb.brand}. Dirancang untuk pelatihan model bahasa berskala besar (LLM), fine-tuning model difusi, dan pemrosesan paralel berkecepatan tinggi.`,
      c6: gc.bw,
      c8: gc.sec,
      c9: gc.sup
    });
    gIdx++;
  }

  console.log(`Generated ${products.length} products. Inserting to database...`);

  // Upsert all 150 products into Prisma laptop table
  for (const item of products) {
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
      create: {
        id: item.id,
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
      }
    });

    // Sync all 9 criteria values
    const criteriaMappings = [
      { criterionId: 1, rawValue: parseFloat(item.price) },
      { criterionId: 2, rawValue: parseFloat(item.processorScore) },
      { criterionId: 3, rawValue: parseFloat(item.ramGb) },
      { criterionId: 4, rawValue: parseFloat(item.storageGb) },
      { criterionId: 5, rawValue: parseFloat(item.gpuScore) },
      { criterionId: 6, rawValue: parseFloat(item.c6) },
      { criterionId: 7, rawValue: parseFloat(item.batteryHours) },
      { criterionId: 8, rawValue: parseFloat(item.c8) },
      { criterionId: 9, rawValue: parseFloat(item.c9) }
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

  console.log(`✓ Berhasil seeding ${products.length} node infrastruktur server & 9 kriteria SAW!`);
  console.log('=== SEED 150 SERVER BERHASIL LENGKAP ===');
}

main()
  .catch((err) => {
    console.error('Error during 150 servers seeding:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
