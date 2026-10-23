<template>
  <div
    class="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative"
    :class="rank === 1 ? 'border-2 border-blue-600/70 ring-2 ring-blue-600/10' : 'border border-slate-200 hover:border-slate-300'"
  >
    <div>
      <!-- Image Area -->
      <div class="relative bg-slate-100 p-4 h-52 flex items-center justify-center border-b border-slate-200 overflow-hidden">
        <!-- Rank / Match Badge for SPK -->
        <span
          v-if="rank"
          class="absolute top-3 left-3 text-xs font-mono font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm z-10"
          :class="rank === 1 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-white'"
        >
          <span class="material-symbols-outlined" style="font-size: 14px;">verified</span>
          Peringkat {{ rank }} <span v-if="matchPercentage">({{ matchPercentage }}%)</span>
        </span>

        <!-- Category Badge (Top Right) -->
        <span
          class="absolute top-3 right-3 text-[11px] font-bold px-2.5 py-1 rounded-full z-10 shadow-xs flex items-center gap-1 font-mono"
          :class="{
            'bg-indigo-700 text-white': laptop.category === 'gpu_rig',
            'bg-emerald-600 text-white': laptop.category === 'shared_server',
            'bg-blue-600 text-white': laptop.category === 'cloud_instance' || !laptop.category
          }"
        >
          <span class="material-symbols-outlined text-[13px] leading-none">
            {{ laptop.category === 'gpu_rig' ? 'memory' : laptop.category === 'shared_server' ? 'layers' : 'cloud' }}
          </span>
          <span>
            {{ laptop.category === 'gpu_rig' ? 'GPU Rig' : laptop.category === 'shared_server' ? 'Shared / VPS' : 'Cloud Server' }}
          </span>
        </span>

        <!-- Stock / Capacity Badge (Bottom Right) -->
        <span
          class="absolute bottom-2.5 right-2.5 text-xs font-bold px-2.5 py-1 rounded-full z-10 font-mono shadow-xs"
          :class="laptop.stock > 0 ? 'bg-blue-50 text-blue-800 border border-blue-300' : 'bg-rose-50 text-rose-800 border border-rose-300'"
        >
          {{ laptop.stock > 0 ? `Kapasitas: ${laptop.stock} Node` : 'Alokasi Penuh' }}
        </span>

        <img
          v-if="laptop.image_url && !imageFailed"
          :src="laptop.image_url"
          :alt="laptop.model"
          @error="handleImageError"
          class="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div v-else class="flex flex-col items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors w-full h-full p-4">
          <span class="material-symbols-outlined text-[68px] font-light text-slate-400">
            {{ laptop.category === 'gpu_rig' ? 'memory' : laptop.category === 'shared_server' ? 'layers' : 'cloud' }}
          </span>
          <span class="text-xs font-bold tracking-wide uppercase mt-1 text-slate-600 font-mono text-center truncate max-w-[200px]">{{ laptop.brand }}</span>
        </div>
      </div>

      <!-- Details Body -->
      <div class="p-5">
        <!-- Brand & SLA / SKU -->
        <div class="text-xs font-mono text-slate-600 mb-1.5 flex items-center justify-between">
          <span class="uppercase tracking-wider font-bold text-blue-700">{{ laptop.brand }} • Enterprise SLA</span>
          <span v-if="laptop.sku" class="truncate max-w-[140px] font-medium text-slate-500">{{ laptop.sku }}</span>
        </div>

        <!-- Model Title -->
        <router-link :to="`/infrastructure/${laptop.id || laptop.laptop_id}`" class="block">
          <h3 class="font-extrabold text-base sm:text-lg text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1" :title="laptop.model">
            {{ laptop.model }}
          </h3>
        </router-link>

        <!-- Price & TCO Teaser -->
        <div class="mt-1.5 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
          <div>
            <p class="font-mono text-xl font-black text-slate-900">
              {{ formatIDR(laptop.price) }}
            </p>
            <span class="text-[10px] text-slate-500 font-semibold font-mono">
              {{ laptop.category === 'gpu_rig' ? 'Investasi Unit (CapEx)' : 'Tarif Sewa Bulanan (OpEx)' }}
            </span>
          </div>
          <button
            type="button"
            @click="showCreditModal = true"
            class="text-[11px] font-bold text-blue-700 hover:text-blue-900 hover:underline flex items-center gap-0.5 cursor-pointer self-start sm:self-auto"
            title="Buka kalkulator analisis TCO dan simulasi pembiayaan"
          >
            <span class="material-symbols-outlined text-[13px]">calculate</span>
            <span>Simulasi TCO</span>
          </button>
        </div>

        <!-- Specs Badges (High Legibility) -->
        <div class="flex flex-wrap gap-1.5 mt-3 text-xs">
          <span class="px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 font-semibold border border-slate-200/80 truncate max-w-[170px]" :title="laptop.processor_name">
            {{ laptop.processor_name }}
          </span>
          <span class="px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 font-semibold border border-slate-200/80">
            {{ laptop.ram_gb }}GB RAM
          </span>
          <span class="px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 font-semibold border border-slate-200/80 truncate max-w-[150px]" :title="laptop.storage_desc">
            {{ laptop.storage_desc }}
          </span>
          <span v-if="laptop.gpu_name && laptop.gpu_score > 30" class="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-900 font-bold border border-indigo-200 truncate max-w-[160px]" :title="laptop.gpu_name">
            {{ laptop.gpu_name }}
          </span>
          <span v-if="laptop.battery_hours" class="px-2.5 py-1 rounded-md bg-blue-50 text-blue-800 font-bold border border-blue-200">
            SLA {{ laptop.battery_hours }}% Uptime
          </span>
        </div>

        <!-- Match Bar (When matchPercentage is provided) -->
        <div v-if="matchPercentage" class="mt-4 pt-3 border-t border-slate-100">
          <div class="flex justify-between items-center text-xs mb-1">
            <span class="text-slate-700 font-bold">Kesesuaian Beban Kerja</span>
            <span class="font-extrabold text-sm" :class="rank === 1 ? 'text-blue-600' : 'text-slate-900'">{{ matchPercentage }}%</span>
          </div>
          <div class="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-500"
              :class="rank === 1 ? 'bg-blue-600' : 'bg-slate-700'"
              :style="{ width: `${matchPercentage}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="p-5 pt-0 grid grid-cols-2 gap-2 mt-2">
      <router-link
        :to="`/infrastructure/${laptop.id || laptop.laptop_id}`"
        class="inline-flex items-center justify-center gap-1.5 h-10 px-3 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-800 text-sm font-bold transition-colors shadow-xs"
      >
        <span class="material-symbols-outlined" style="font-size: 17px;">info</span>
        <span>Detail Spek</span>
      </router-link>
      <button
        @click="handleAddToCart(laptop, $event)"
        :disabled="laptop.stock <= 0"
        class="inline-flex items-center justify-center gap-1.5 h-10 px-3 rounded-lg text-white text-sm font-bold shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        :class="isAdded ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'"
      >
        <span class="material-symbols-outlined" style="font-size: 17px;">{{ isAdded ? 'check' : 'playlist_add' }}</span>
        <span>{{ isAdded ? 'Dimasukkan' : '+ Ajukan RFQ' }}</span>
      </button>
    </div>

    <!-- Credit Simulation Modal -->
    <CreditSimulationModal
      :is-open="showCreditModal"
      :laptop="laptop"
      @close="showCreditModal = false"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useCartStore } from '../stores/cartStore';
import { useCartAnimation } from '../composables/useCartAnimation';
import { useRouter } from 'vue-router';
import CreditSimulationModal from './CreditSimulationModal.vue';

const props = defineProps({
  laptop: {
    type: Object,
    required: true
  },
  rank: {
    type: Number,
    default: null
  },
  matchPercentage: {
    type: [Number, String],
    default: null
  }
});

const cartStore = useCartStore();
const router = useRouter();
const { triggerFlyToCart } = useCartAnimation();
const isAdded = ref(false);
const showCreditModal = ref(false);
const imageFailed = ref(false);

function handleImageError(event) {
  const cat = props.laptop?.category;
  if (cat === 'gpu_rig' && !event.target.src.includes('dual-rtx-4090-rig.svg')) {
    event.target.src = '/images/infrastructures/dual-rtx-4090-rig.svg';
    return;
  }
  if (cat === 'shared_server' && !event.target.src.includes('cpanel-shared-pro.svg')) {
    event.target.src = '/images/infrastructures/cpanel-shared-pro.svg';
    return;
  }
  if (!event.target.src.includes('aws-ec2-t4g.svg')) {
    event.target.src = '/images/infrastructures/aws-ec2-t4g.svg';
    return;
  }
  imageFailed.value = true;
}

function formatIDR(val) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(val);
}

function handleAddToCart(laptop, event) {
  triggerFlyToCart(event, laptop);
  isAdded.value = true;
  setTimeout(() => {
    isAdded.value = false;
  }, 1200);
}
</script>
