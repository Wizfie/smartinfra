<template>
  <main class="flex-grow max-w-[1380px] w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-6 sm:gap-8 font-sans">
    
    <!-- Hero Header -->
    <section class="max-w-3xl">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 mb-3">
        <span class="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
        <span class="text-xs font-semibold tracking-wide">B2B IT Solution Provider & Advisory</span>
      </div>
      <h1 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
        Rekomendasi Cerdas Infrastruktur Cloud Server & AI GPU Rig
      </h1>
      <p class="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
        Pilih profil beban kerja komputasi proyek Anda di bawah ini. Sistem kami secara objektif memprioritaskan spesifikasi terpenting dengan metode Simple Additive Weighting (SAW) untuk analisis efisiensi biaya (TCO) dan performa komputasi optimal.
      </p>
    </section>

    <!-- Persona Selector Grid (3-column Bento Style) -->
    <section>
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div>
          <span class="text-xs uppercase font-semibold tracking-wider text-slate-500 font-mono">
            Langkah 1: Pilih Profil Beban Kerja Proyek
          </span>
          <p class="text-xs text-slate-500 font-medium">Pilih preset beban kerja atau aktifkan mode kustomisasi bobot mandiri</p>
        </div>
        <button
          @click="toggleCustomProfile"
          id="btn-toggle-custom-weights"
          class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs border self-start sm:self-auto"
          :class="spkStore.isCustomProfile 
            ? 'bg-blue-600 text-white border-blue-600 shadow-blue-500/20' 
            : 'bg-white text-slate-700 border-slate-300 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300'"
        >
          <span class="material-symbols-outlined text-[16px]">tune</span>
          <span>{{ spkStore.isCustomProfile ? 'Mode Kustom Aktif' : 'Atur Bobot Mandiri (Custom)' }}</span>
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="(profile, idx) in spkStore.profiles"
          :key="profile.id"
          @click="selectProfile(profile.id)"
          class="bg-white rounded-xl p-5 shadow-sm transition-all cursor-pointer flex flex-col justify-between group relative"
          :class="!spkStore.isCustomProfile && spkStore.selectedProfileId === profile.id 
            ? 'border-2 border-blue-600 ring-4 ring-blue-600/10' 
            : 'border border-slate-200 hover:border-slate-300'"
        >
          <!-- Active Floating Badge -->
          <div v-if="!spkStore.isCustomProfile && spkStore.selectedProfileId === profile.id" class="absolute -top-3 right-5">
            <span class="bg-blue-600 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 shadow-sm">
              <span class="material-symbols-outlined" style="font-size: 14px;">check</span>
              <span>Profil Aktif</span>
            </span>
          </div>

          <div>
            <div class="flex items-center justify-between mb-3">
              <div
                class="w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
                :class="!spkStore.isCustomProfile && spkStore.selectedProfileId === profile.id ? 'bg-blue-600 text-white shadow-sm' : 'bg-blue-50 text-blue-700 group-hover:bg-blue-600 group-hover:text-white'"
              >
                <span class="material-symbols-outlined">{{ getProfileIcon(profile.name) }}</span>
              </div>
              <span
                class="text-xs font-mono px-2 py-0.5 rounded"
                :class="spkStore.selectedProfileId === profile.id 
                  ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200' 
                  : 'bg-slate-50 text-slate-500 border border-slate-200'"
              >
                {{ spkStore.selectedProfileId === profile.id ? 'Aktif' : `Profil 0${idx + 1}` }}
              </span>
            </div>

            <h3
              class="font-bold text-lg transition-colors"
              :class="spkStore.selectedProfileId === profile.id ? 'text-slate-900' : 'text-slate-800 group-hover:text-blue-600'"
            >
              {{ profile.name }}
            </h3>
            <p class="text-sm text-slate-500 mt-1.5 leading-relaxed">
              {{ profile.description }}
            </p>
          </div>

          <!-- Bottom Priority Badges -->
          <div class="mt-6 pt-4 border-t border-slate-100">
            <span class="text-xs text-slate-400 block mb-2 font-mono">Prioritas Kriteria:</span>
            <div class="flex flex-wrap gap-1.5 text-xs font-mono">
              <span
                v-for="(tag, tIdx) in getProfileTags(profile.name)"
                :key="tIdx"
                class="px-2 py-0.5 rounded"
                :class="!spkStore.isCustomProfile && spkStore.selectedProfileId === profile.id ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200' : 'bg-slate-100 text-slate-700'"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Panel Kustomisasi Bobot Mandiri (In-Memory Simulation) -->
      <transition enter-active-class="transition duration-200 ease-out" enter-from-class="transform opacity-0 -translate-y-2" enter-to-class="transform opacity-100 translate-y-0" leave-active-class="transition duration-150 ease-in" leave-from-class="transform opacity-100 translate-y-0" leave-to-class="transform opacity-0 -translate-y-2">
        <div v-if="spkStore.isCustomProfile" class="mt-4 p-5 sm:p-6 bg-blue-50/40 border-2 border-blue-600/30 rounded-2xl shadow-sm space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-blue-200/60">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <span class="material-symbols-outlined text-[18px]">tune</span>
              </div>
              <div>
                <h4 class="font-extrabold text-sm text-slate-900">Simulasi Pembobotan Mandiri (9 Kriteria SAW)</h4>
                <p class="text-[11px] text-slate-500">Bobot dihitung langsung di memori browser Anda tanpa memengaruhi profil default database.</p>
              </div>
            </div>

            <div class="flex items-center gap-2 flex-wrap">
              <span
                class="px-2.5 py-1 rounded-lg text-xs font-mono font-bold border"
                :class="isCustomWeightValid 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300' 
                  : 'bg-amber-50 text-amber-700 border-amber-300'"
              >
                Total: {{ (customTotalWeight * 100).toFixed(1) }}% {{ isCustomWeightValid ? '✓' : '(Wajib 100%)' }}
              </span>
              <button
                @click="spkStore.normalizeCustomWeights"
                class="px-2.5 py-1 bg-white hover:bg-blue-50 text-blue-700 border border-blue-300 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                title="Skalakan semua bobot proporsional agar tepat bernilai 100%"
              >
                Normalisasi ke 100%
              </button>
              <button
                @click="spkStore.resetCustomWeights"
                class="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-600 border border-slate-300 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                title="Kembalikan bobot ke preset profil saat ini"
              >
                Reset Default
              </button>
            </div>
          </div>

          <!-- Sliders Grid for 9 Criteria -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            <div
              v-for="c in criteriaMeta"
              :key="c.id"
              class="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-1.5"
            >
              <div class="flex justify-between items-center text-xs">
                <div class="flex items-center gap-1.5 font-semibold text-slate-800">
                  <span class="font-mono text-[10px] px-1.5 py-0.5 rounded font-bold" :class="c.type === 'Cost' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'">{{ c.code }}</span>
                  <span class="truncate max-w-[150px]" :title="c.name">{{ c.short }}</span>
                </div>
                <span class="font-mono font-bold text-blue-700">
                  {{ (((spkStore.customWeights?.[c.id] ?? 0) * 100)).toFixed(0) }}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="0.60"
                step="0.01"
                :value="spkStore.customWeights?.[c.id] ?? 0"
                @input="onSliderChange(c.id, $event.target.value)"
                class="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
              <p class="text-[10px] text-slate-400 truncate">{{ c.desc }}</p>
            </div>
          </div>
        </div>
      </transition>
    </section>

    <!-- Quick Filter: Kategori, Anggaran Maksimal & Vendor -->
    <section class="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 sm:gap-6">
      
      <!-- Filter Kategori Komputasi -->
      <div class="w-full md:w-1/4">
        <label class="block text-xs font-mono uppercase tracking-wider text-slate-500 mb-1">
          Kategori Infrastruktur
        </label>
        <select
          v-model="spkStore.filters.category"
          @change="triggerCalculation"
          class="w-full text-xs py-2.5 px-3 rounded-lg border border-slate-200 bg-slate-50 font-medium focus:outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer"
        >
          <option value="all">Semua Kategori (Shared, Cloud & GPU)</option>
          <option value="shared_server">Shared & VPS Budget (Entry / Hemat)</option>
          <option value="cloud_instance">Cloud Server Instances (IaaS)</option>
          <option value="gpu_rig">Dedicated GPU Rig (Hardware)</option>
        </select>
      </div>

      <!-- Slider Anggaran Maksimal -->
      <div class="w-full md:w-2/5">
        <label class="block text-xs font-mono uppercase tracking-wider text-slate-500 mb-1">
          Pagu Anggaran Maksimal
        </label>
        <div class="flex items-center gap-3">
          <input
            type="range"
            min="50000"
            max="500000000"
            step="50000"
            v-model.number="spkStore.filters.max_price"
            @change="triggerCalculation"
            class="w-full accent-blue-600 cursor-pointer"
          />
          <span class="text-xs font-mono font-bold text-slate-900 shrink-0">
            {{ formatIDR(spkStore.filters.max_price) }}
          </span>
        </div>
      </div>

      <!-- Preferensi Vendor / Brand -->
      <div class="w-full md:w-1/4">
        <label class="block text-xs font-mono uppercase tracking-wider text-slate-500 mb-1">
          Penyedia / Vendor
        </label>
        <select
          v-model="spkStore.filters.brand"
          @change="triggerCalculation"
          class="w-full text-xs py-2.5 px-3 rounded-lg border border-slate-200 bg-slate-50 font-medium focus:outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer"
        >
          <option value="all">Semua Provider (AWS, GCP, NVIDIA dll)</option>
          <option v-for="b in availableBrands" :key="b" :value="b">{{ b }}</option>
        </select>
      </div>

      <!-- Button Submit -->
      <div class="w-full md:w-auto md:self-end">
        <button
          @click="triggerCalculation"
          class="w-full md:w-auto h-10 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <span class="material-symbols-outlined" style="font-size: 18px;">tune</span>
          <span>Analisis SAW</span>
        </button>
      </div>
    </section>

    <!-- Top Recommendations Results Section -->
    <section class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-2">
        <div>
          <h2 class="text-xl font-bold text-slate-900">Hasil Rekomendasi Infrastruktur Terbaik</h2>
          <p class="text-xs text-slate-500 mt-0.5">
            Disesuaikan dengan profil beban kerja: <span class="font-semibold text-slate-900">{{ currentProfileName }}</span>
          </p>
        </div>
        <div class="flex items-center gap-3">
          <div class="inline-flex items-center gap-1.5 text-xs font-mono text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
            <span class="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            <span>{{ spkStore.recommendations.length }} Alternatif Teruji</span>
          </div>
          <router-link
            to="/katalog"
            class="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>Buka Katalog Lengkap</span>
            <span class="material-symbols-outlined" style="font-size: 16px;">arrow_forward</span>
          </router-link>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="spkStore.loading" class="py-16 text-center bg-white rounded-xl border border-slate-200">
        <div class="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p class="text-sm font-semibold text-slate-600">Menghitung matriks normalisasi & perangkingan SAW...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="spkStore.recommendations.length === 0" class="bg-white rounded-xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-sm">
        <span class="material-symbols-outlined text-slate-400 text-[48px] mb-2">dns</span>
        <h3 class="text-base font-bold text-slate-800">Tidak ada infrastruktur yang cocok</h3>
        <p class="text-xs text-slate-500 mt-1 mb-4">
          Coba naikkan batas pagu anggaran Anda atau pilih Semua Kategori untuk melihat opsi komputasi lainnya.
        </p>
        <button
          @click="resetBudget"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-all shadow-sm cursor-pointer"
        >
          Reset Filter Anggaran
        </button>
      </div>

      <!-- Recommendations Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        <InfrastructureCard
          v-for="rec in spkStore.recommendations"
          :key="rec.id || rec.laptop_id"
          :laptop="rec.laptop || rec"
          :rank="rec.rank"
          :matchPercentage="rec.matchPercentage"
        />
      </div>
    </section>

  </main>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useSpkStore } from '../stores/spkStore';
import InfrastructureCard from '../components/InfrastructureCard.vue';

const spkStore = useSpkStore();

const availableBrands = computed(() => {
  if (spkStore.brands && spkStore.brands.length > 0) {
    return spkStore.brands;
  }
  return ['AWS', 'Google Cloud', 'DigitalOcean', 'Microsoft Azure', 'NVIDIA / Custom Rig', 'NVIDIA Enterprise', 'NVIDIA / Supermicro', 'Apple Enterprise', 'Dell Enterprise'];
});

const currentProfileName = computed(() => {
  if (spkStore.isCustomProfile) {
    return 'Kustomisasi Mandiri (Non-Persisten)';
  }
  const p = spkStore.profiles.find(x => x.id === spkStore.selectedProfileId);
  return p ? p.name : 'Web & Microservices Backend';
});

function getProfileIcon(name) {
  if (!name) return 'dns';
  const lower = name.toLowerCase();
  if (lower.includes('web') || lower.includes('microservices')) return 'dns';
  if (lower.includes('database') || lower.includes('bigdata') || lower.includes('data')) return 'database';
  if (lower.includes('ai') || lower.includes('deep') || lower.includes('learning')) return 'memory';
  return 'dns';
}

const criteriaMeta = [
  { id: 1, code: 'C1', name: 'Biaya Sewa / Investasi Bulanan', short: 'Biaya Sewa', type: 'Cost', desc: 'Makin murah, nilai makin tinggi' },
  { id: 2, code: 'C2', name: 'Kekuatan Compute Processor (vCPU)', short: 'Compute vCPU', type: 'Benefit', desc: 'Throughput multi-core processor' },
  { id: 3, code: 'C3', name: 'Kapasitas Memori RAM ECC', short: 'RAM ECC', type: 'Benefit', desc: 'Kapasitas RAM DDR5 anti-crash' },
  { id: 4, code: 'C4', name: 'Storage NVMe Enterprise', short: 'Storage NVMe', type: 'Benefit', desc: 'Kapasitas & kecepatan IOPS SSD' },
  { id: 5, code: 'C5', name: 'Akselerator AI & GPU VRAM', short: 'AI GPU VRAM', type: 'Benefit', desc: 'Tensor Cores & VRAM deep learning' },
  { id: 6, code: 'C6', name: 'Konektivitas & Bandwidth Jaringan', short: 'Bandwidth Jaringan', type: 'Benefit', desc: 'Throughput port uplink (Gbps)' },
  { id: 7, code: 'C7', name: 'Garansi Keandalan Uptime SLA', short: 'Uptime SLA (%)', type: 'Benefit', desc: 'Jaminan ketersediaan sistem 24/7' },
  { id: 8, code: 'C8', name: 'Proteksi Keamanan & Skalabilitas', short: 'Keamanan & Skalabilitas', type: 'Benefit', desc: 'Anti-DDoS, WAF & elastisitas' },
  { id: 9, code: 'C9', name: 'Dukungan Teknis 24/7 & Zona DC', short: 'Support 24/7 & Zona DC', type: 'Benefit', desc: 'Respon insiden & latensi rendah DC' }
];

const customTotalWeight = computed(() => {
  if (!spkStore.customWeights) return 0;
  return Object.values(spkStore.customWeights).reduce((acc, v) => acc + (parseFloat(v) || 0), 0);
});

const isCustomWeightValid = computed(() => {
  return Math.abs(customTotalWeight.value - 1.0) < 0.01;
});

function toggleCustomProfile() {
  if (spkStore.isCustomProfile) {
    spkStore.setProfile(spkStore.selectedProfileId);
  } else {
    spkStore.enableCustomProfile();
  }
}

let sliderTimeout = null;
function onSliderChange(criterionId, val) {
  spkStore.updateCustomWeight(criterionId, val);
  if (sliderTimeout) clearTimeout(sliderTimeout);
  sliderTimeout = setTimeout(() => {
    spkStore.calculateRecommendations(spkStore.customWeights);
  }, 300);
}

function getProfileTags(name) {
  if (!name) return ['Efisiensi Biaya', 'Performa Stabil'];
  const lower = name.toLowerCase();
  if (lower.includes('web') || lower.includes('microservices')) {
    return ['Biaya 20%', 'Bandwidth 15%', 'SLA Uptime 15%', 'RAM 15%'];
  }
  if (lower.includes('database') || lower.includes('bigdata') || lower.includes('data')) {
    return ['RAM ECC 25%', 'Storage NVMe 20%', 'CPU vCPU 20%', 'SLA 10%'];
  }
  if (lower.includes('ai') || lower.includes('deep') || lower.includes('learning')) {
    return ['AI GPU Tensor 35%', 'RAM ECC 15%', 'Storage Scratch 15%', 'Bandwidth 10%'];
  }
  return ['Spesifikasi Seimbang', 'Enterprise SLA'];
}

function selectProfile(id) {
  spkStore.setProfile(id);
}

function triggerCalculation() {
  spkStore.calculateRecommendations();
}

function resetBudget() {
  spkStore.filters.category = 'all';
  spkStore.filters.max_price = 500000000;
  spkStore.filters.brand = 'all';
  spkStore.calculateRecommendations();
}

function formatIDR(val) {
  if (!val) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(val);
}

onMounted(async () => {
  if (spkStore.profiles.length === 0) {
    await spkStore.fetchProfiles();
  }
  await spkStore.fetchBrands();
  spkStore.calculateRecommendations();
});
</script>
