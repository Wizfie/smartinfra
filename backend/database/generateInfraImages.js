const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '../../frontend/public/images/infrastructures');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// 10 Produk Infrastruktur Komputasi (5 Cloud + 5 Dedicated GPU Rig)
// Tema: Biru dan Putih / Slate Profesional (Enterprise Corporate, No rainbow AI gradients)
const products = [
  // --- CLOUD INSTANCES ---
  {
    filename: 'aws-ec2-t4g.svg',
    name: 'AWS EC2 t4g.2xlarge',
    category: 'Cloud Server',
    badge: 'AWS Graviton3',
    primaryColor: '#0284c7', // Sky Blue
    accentColor: '#2563eb',  // Royal Blue
    bgColor: '#f0f9ff',      // Light Blue Tint
    type: 'cloud'
  },
  {
    filename: 'gcp-n2-standard.svg',
    name: 'GCP n2-standard-16',
    category: 'Cloud Server',
    badge: 'Google Cloud Compute',
    primaryColor: '#1d4ed8', // Blue
    accentColor: '#3b82f6',  // Vivid Blue
    bgColor: '#eff6ff',
    type: 'cloud'
  },
  {
    filename: 'digitalocean-droplet.svg',
    name: 'DO Dedicated CPU Droplet',
    category: 'Cloud Server',
    badge: 'DigitalOcean Cloud',
    primaryColor: '#0369a1',
    accentColor: '#0284c7',
    bgColor: '#f0fdf4',
    type: 'cloud'
  },
  {
    filename: 'aws-ec2-g5.svg',
    name: 'AWS EC2 g5.2xlarge GPU',
    category: 'Cloud GPU Instance',
    badge: 'NVIDIA A10G Cloud',
    primaryColor: '#1e40af',
    accentColor: '#2563eb',
    bgColor: '#f8fafc',
    type: 'cloud_gpu'
  },
  {
    filename: 'azure-d16s-v5.svg',
    name: 'Azure D16s v5 Virtual Machine',
    category: 'Cloud Server',
    badge: 'Microsoft Azure',
    primaryColor: '#2563eb',
    accentColor: '#60a5fa',
    bgColor: '#eff6ff',
    type: 'cloud'
  },

  // --- DEDICATED GPU RIGS ---
  {
    filename: 'dual-rtx-4090-rig.svg',
    name: 'Dual RTX 4090 AI Dev Rig',
    category: 'Dedicated GPU Rig',
    badge: 'Dual 24GB VRAM (48GB)',
    primaryColor: '#1e3a8a', // Deep Navy
    accentColor: '#2563eb', // Clean Blue
    bgColor: '#f8fafc',
    type: 'gpu_rig'
  },
  {
    filename: 'nvidia-rtx-a6000-ada.svg',
    name: 'NVIDIA RTX A6000 Ada Workstation',
    category: 'Enterprise AI Rig',
    badge: '48GB ECC VRAM',
    primaryColor: '#0f172a', // Slate Dark
    accentColor: '#0284c7', // Tech Blue
    bgColor: '#f1f5f9',
    type: 'gpu_rig'
  },
  {
    filename: 'nvidia-h100-pcie.svg',
    name: 'NVIDIA H100 PCIe AI SuperServer',
    category: 'HPC SuperServer',
    badge: '80GB HBM3 High-Bandwidth',
    primaryColor: '#1e293b',
    accentColor: '#3b82f6',
    bgColor: '#f8fafc',
    type: 'server_rack'
  },
  {
    filename: 'mac-studio-m2-ultra.svg',
    name: 'Apple Mac Studio M2 Ultra Rig',
    category: 'Compact AI Compute',
    badge: '192GB Unified Memory',
    primaryColor: '#334155',
    accentColor: '#64748b',
    bgColor: '#f8fafc',
    type: 'workstation'
  },
  {
    filename: 'dell-poweredge-r750xa.svg',
    name: 'Dell PowerEdge R750xa GPU Server',
    category: 'Enterprise 2U Server',
    badge: 'Dual Xeon + L40S',
    primaryColor: '#1e40af',
    accentColor: '#0284c7',
    bgColor: '#f0f9ff',
    type: 'server_rack'
  }
];

function generateSVG(p) {
  if (p.type === 'cloud' || p.type === 'cloud_gpu') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="${p.bgColor}"/>
    </linearGradient>
    <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#0f172a" flood-opacity="0.08"/>
    </filter>
  </defs>

  <!-- Background Canvas -->
  <rect width="600" height="400" fill="url(#bgGrad)" rx="16"/>

  <!-- Grid Blueprint Accents -->
  <g opacity="0.06" stroke="${p.primaryColor}" stroke-width="1">
    <line x1="50" y1="0" x2="50" y2="400"/>
    <line x1="150" y1="0" x2="150" y2="400"/>
    <line x1="250" y1="0" x2="250" y2="400"/>
    <line x1="350" y1="0" x2="350" y2="400"/>
    <line x1="450" y1="0" x2="450" y2="400"/>
    <line x1="550" y1="0" x2="550" y2="400"/>
    <line x1="0" y1="80" x2="600" y2="80"/>
    <line x1="0" y1="160" x2="600" y2="160"/>
    <line x1="0" y1="240" x2="600" y2="240"/>
    <line x1="0" y1="320" x2="600" y2="320"/>
  </g>

  <!-- Top Badge -->
  <rect x="40" y="32" width="170" height="28" rx="14" fill="${p.primaryColor}" opacity="0.1"/>
  <text x="54" y="51" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="700" fill="${p.primaryColor}">
    ${p.category.toUpperCase()}
  </text>

  <!-- Specification Sub-badge -->
  <rect x="220" y="32" width="200" height="28" rx="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="1"/>
  <text x="234" y="50" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="600" fill="#475569">
    ${p.badge}
  </text>

  <!-- Central Cloud & Server Rack Illustration -->
  <g transform="translate(140, 80)" filter="url(#cardShadow)">
    <!-- Server Chassis 1U Unit -->
    <rect x="20" y="110" width="280" height="48" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
    <rect x="30" y="122" width="8" height="24" rx="2" fill="${p.primaryColor}"/>
    <rect x="44" y="122" width="8" height="24" rx="2" fill="${p.primaryColor}"/>
    <!-- Server LEDs -->
    <circle cx="270" cy="126" r="3.5" fill="#10b981"/>
    <circle cx="282" cy="126" r="3.5" fill="${p.accentColor}"/>
    <rect x="70" y="128" width="160" height="12" rx="3" fill="#f1f5f9"/>

    <!-- Server Chassis 2U Unit -->
    <rect x="20" y="168" width="280" height="48" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
    <rect x="30" y="180" width="8" height="24" rx="2" fill="${p.accentColor}"/>
    <rect x="44" y="180" width="8" height="24" rx="2" fill="${p.accentColor}"/>
    <!-- Server LEDs -->
    <circle cx="270" cy="184" r="3.5" fill="#10b981"/>
    <circle cx="282" cy="184" r="3.5" fill="#10b981"/>
    <rect x="70" y="186" width="160" height="12" rx="3" fill="#f1f5f9"/>

    <!-- Cloud Icon Shape over Servers -->
    <path d="M160 20 C138 20 120 36 116 57 C100 60 88 74 88 91 C88 110 104 125 124 125 L196 125 C214 125 228 111 228 94 C228 78 217 65 202 63 C200 39 182 20 160 20 Z"
          fill="#ffffff" stroke="${p.primaryColor}" stroke-width="3" filter="url(#cardShadow)"/>
    
    <!-- Circuit lines in cloud -->
    <circle cx="160" cy="65" r="5" fill="${p.primaryColor}"/>
    <line x1="160" y1="70" x2="160" y2="100" stroke="${p.primaryColor}" stroke-width="2"/>
    <circle cx="140" cy="85" r="4" fill="${p.accentColor}"/>
    <circle cx="180" cy="85" r="4" fill="${p.accentColor}"/>
    <line x1="140" y1="85" x2="160" y2="85" stroke="${p.primaryColor}" stroke-width="2"/>
    <line x1="180" y1="85" x2="160" y2="85" stroke="${p.primaryColor}" stroke-width="2"/>
  </g>

  <!-- Bottom Hardware Name -->
  <text x="300" y="340" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="700" fill="#0f172a" text-anchor="middle">
    ${p.name}
  </text>
  <text x="300" y="365" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="500" fill="#64748b" text-anchor="middle">
    High-Availability Cloud Virtualization • SLA 99.99% Uptime
  </text>
</svg>`;
  }

  if (p.type === 'gpu_rig' || p.type === 'workstation') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="${p.bgColor}"/>
    </linearGradient>
    <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#0f172a" flood-opacity="0.08"/>
    </filter>
  </defs>

  <!-- Background Canvas -->
  <rect width="600" height="400" fill="url(#bgGrad)" rx="16"/>

  <!-- Top Badge -->
  <rect x="40" y="32" width="180" height="28" rx="14" fill="${p.primaryColor}" opacity="0.1"/>
  <text x="54" y="51" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="700" fill="${p.primaryColor}">
    ${p.category.toUpperCase()}
  </text>

  <!-- Specification Sub-badge -->
  <rect x="230" y="32" width="220" height="28" rx="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="1"/>
  <text x="244" y="50" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="600" fill="#475569">
    ${p.badge}
  </text>

  <!-- GPU Rig Workstation Visual Illustration -->
  <g transform="translate(130, 80)" filter="url(#cardShadow)">
    <!-- Main Tower / Frame -->
    <rect x="30" y="20" width="280" height="200" rx="10" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
    
    <!-- Motherboard Panel -->
    <rect x="45" y="35" width="250" height="170" rx="6" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.5"/>

    <!-- Dual GPU Card 1 -->
    <rect x="65" y="50" width="210" height="60" rx="6" fill="#ffffff" stroke="${p.primaryColor}" stroke-width="2"/>
    <!-- GPU Fans -->
    <circle cx="115" cy="80" r="20" fill="#f1f5f9" stroke="${p.accentColor}" stroke-width="1.5"/>
    <circle cx="115" cy="80" r="6" fill="${p.primaryColor}"/>
    <circle cx="170" cy="80" r="20" fill="#f1f5f9" stroke="${p.accentColor}" stroke-width="1.5"/>
    <circle cx="170" cy="80" r="6" fill="${p.primaryColor}"/>
    <circle cx="225" cy="80" r="20" fill="#f1f5f9" stroke="${p.accentColor}" stroke-width="1.5"/>
    <circle cx="225" cy="80" r="6" fill="${p.primaryColor}"/>

    <!-- Dual GPU Card 2 -->
    <rect x="65" y="125" width="210" height="60" rx="6" fill="#ffffff" stroke="${p.accentColor}" stroke-width="2"/>
    <!-- GPU Fans -->
    <circle cx="115" cy="155" r="20" fill="#f1f5f9" stroke="${p.primaryColor}" stroke-width="1.5"/>
    <circle cx="115" cy="155" r="6" fill="${p.accentColor}"/>
    <circle cx="170" cy="155" r="20" fill="#f1f5f9" stroke="${p.primaryColor}" stroke-width="1.5"/>
    <circle cx="170" cy="155" r="6" fill="${p.accentColor}"/>
    <circle cx="225" cy="155" r="20" fill="#f1f5f9" stroke="${p.primaryColor}" stroke-width="1.5"/>
    <circle cx="225" cy="155" r="6" fill="${p.accentColor}"/>

    <!-- Status Power Indicator -->
    <circle cx="280" cy="30" r="4" fill="#10b981"/>
    <circle cx="292" cy="30" r="4" fill="${p.accentColor}"/>
  </g>

  <!-- Bottom Hardware Name -->
  <text x="300" y="340" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="700" fill="#0f172a" text-anchor="middle">
    ${p.name}
  </text>
  <text x="300" y="365" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="500" fill="#64748b" text-anchor="middle">
    High-Performance Tensor Computing • On-Premise Deep Learning
  </text>
</svg>`;
  }

  // Fallback / Server Rack
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="${p.bgColor}"/>
    </linearGradient>
    <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#0f172a" flood-opacity="0.08"/>
    </filter>
  </defs>

  <rect width="600" height="400" fill="url(#bgGrad)" rx="16"/>

  <rect x="40" y="32" width="180" height="28" rx="14" fill="${p.primaryColor}" opacity="0.1"/>
  <text x="54" y="51" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="700" fill="${p.primaryColor}">
    ${p.category.toUpperCase()}
  </text>

  <rect x="230" y="32" width="220" height="28" rx="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="1"/>
  <text x="244" y="50" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="600" fill="#475569">
    ${p.badge}
  </text>

  <!-- Server Rack Illustration -->
  <g transform="translate(140, 80)" filter="url(#cardShadow)">
    <rect x="10" y="10" width="300" height="210" rx="8" fill="#ffffff" stroke="#94a3b8" stroke-width="2"/>
    
    <!-- Rack Rails -->
    <rect x="20" y="25" width="280" height="40" rx="4" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
    <circle cx="280" cy="45" r="4" fill="#10b981"/>
    <circle cx="290" cy="45" r="4" fill="${p.accentColor}"/>
    <rect x="35" y="35" width="80" height="20" rx="3" fill="${p.primaryColor}" opacity="0.15"/>
    <text x="45" y="49" font-family="monospace" font-size="10" font-weight="bold" fill="${p.primaryColor}">BLADE 01</text>

    <rect x="20" y="75" width="280" height="40" rx="4" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
    <circle cx="280" cy="95" r="4" fill="#10b981"/>
    <circle cx="290" cy="95" r="4" fill="#10b981"/>
    <rect x="35" y="85" width="80" height="20" rx="3" fill="${p.accentColor}" opacity="0.15"/>
    <text x="45" y="99" font-family="monospace" font-size="10" font-weight="bold" fill="${p.accentColor}">BLADE 02</text>

    <rect x="20" y="125" width="280" height="80" rx="4" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
    <circle cx="280" cy="145" r="4" fill="#10b981"/>
    <circle cx="290" cy="145" r="4" fill="#3b82f6"/>
    <!-- Storage Bays -->
    <rect x="35" y="140" width="20" height="50" rx="2" fill="#e2e8f0"/>
    <rect x="60" y="140" width="20" height="50" rx="2" fill="#e2e8f0"/>
    <rect x="85" y="140" width="20" height="50" rx="2" fill="#e2e8f0"/>
    <rect x="110" y="140" width="20" height="50" rx="2" fill="#e2e8f0"/>
    <rect x="145" y="145" width="130" height="40" rx="4" fill="${p.primaryColor}" opacity="0.1"/>
    <text x="160" y="170" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" fill="${p.primaryColor}">HPC ACCELERATOR</text>
  </g>

  <text x="300" y="340" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="700" fill="#0f172a" text-anchor="middle">
    ${p.name}
  </text>
  <text x="300" y="365" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="500" fill="#64748b" text-anchor="middle">
    Enterprise Rackmount • Mission-Critical Data Center SLA
  </text>
</svg>`;
}

console.log('--- Generating Clean Blue & White Vector SVGs for SmartInfra ---');
products.forEach(p => {
  const filePath = path.join(targetDir, p.filename);
  const content = generateSVG(p);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✓ Created: ${p.filename}`);
});

console.log('Semua 10 gambar SVG infrastruktur komputasi berhasil dibuat!');
