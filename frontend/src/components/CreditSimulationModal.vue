<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
  >
    <div
      class="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full p-4 sm:p-8 space-y-5 sm:space-y-6 animate-in fade-in zoom-in duration-200 my-4 sm:my-8"
    >
      <!-- Header -->
      <div class="flex items-start justify-between pb-4 border-b border-slate-100">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-[22px] sm:text-[24px]">calculate</span>
          </div>
          <div>
            <h3 class="font-extrabold text-base sm:text-lg text-slate-900 leading-tight">
              Kalkulator Analisis Biaya TCO & Pembiayaan
            </h3>
            <p class="text-[11px] sm:text-xs text-slate-500 mt-0.5">
              Simulasikan estimasi komparasi biaya operasional bulanan (OpEx) dan cicilan investasi hardware (CapEx).
            </p>
          </div>
        </div>
        <button
          @click="close"
          class="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
        >
          <span class="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>

      <!-- Infrastructure Info Preview -->
      <div v-if="laptop" class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 text-xs">
        <div class="flex items-center gap-3 truncate">
          <div class="w-10 h-10 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center shrink-0">
            <img v-if="laptop.image_url" :src="laptop.image_url" :alt="laptop.model" class="max-h-full max-w-full object-contain" />
            <span v-else class="material-symbols-outlined text-slate-400 text-[18px]">dns</span>
          </div>
          <div class="truncate">
            <span class="font-bold text-slate-900 block truncate">{{ laptop.brand }} {{ laptop.model }}</span>
            <span class="text-slate-500 text-[11px]">{{ laptop.category === 'gpu_rig' ? 'Investasi Unit Hardware' : 'Tarif Sewa Bulanan' }}</span>
          </div>
        </div>
        <div class="text-right shrink-0">
          <span class="font-mono font-black text-slate-900 text-sm sm:text-base">{{ formatIDR(currentPrice) }}</span>
        </div>
      </div>

      <!-- Simulation Options -->
      <div class="space-y-4 text-xs">
        
        <!-- Skema Pembiayaan -->
        <div>
          <label class="block font-bold uppercase tracking-wider text-slate-500 mb-2">
            Pilihan Skema Pembiayaan / Komitmen
          </label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            <button
              type="button"
              @click="scheme = 'cc_0'"
              class="p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5"
              :class="scheme === 'cc_0' ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-600/10 text-blue-950 font-bold' : 'border-slate-200 hover:border-slate-300 text-slate-700'"
            >
              <span class="material-symbols-outlined text-[20px]" :class="scheme === 'cc_0' ? 'text-blue-600' : 'text-slate-400'">verified</span>
              <div>
                <span class="block font-bold">Kontrak Komitmen 0%</span>
                <span class="text-[10px] text-slate-500 block">Bunga 0% (Annual Reserved / BCA / Mandiri)</span>
              </div>
            </button>
            <button
              type="button"
              @click="scheme = 'paylater'"
              class="p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5"
              :class="scheme === 'paylater' ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-600/10 text-blue-950 font-bold' : 'border-slate-200 hover:border-slate-300 text-slate-700'"
            >
              <span class="material-symbols-outlined text-[20px]" :class="scheme === 'paylater' ? 'text-blue-600' : 'text-slate-400'">payments</span>
              <div>
                <span class="block font-bold">Leasing & Pembiayaan Usaha</span>
                <span class="text-[10px] text-slate-500 block">Kredit Usaha Multifinance / B2B Leasing</span>
              </div>
            </button>
          </div>
        </div>

        <!-- Uang Muka (DP) Selection -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="font-bold uppercase tracking-wider text-slate-500">
              Uang Muka / Alokasi Awal (DP): {{ dpPercent }}%
            </label>
            <span class="font-mono font-bold text-slate-800">{{ formatIDR(dpAmount) }}</span>
          </div>
          <div class="grid grid-cols-4 gap-2">
            <button
              v-for="p in [0, 10, 20, 30]"
              :key="p"
              type="button"
              @click="dpPercent = p"
              class="py-2 rounded-lg font-bold border transition-all cursor-pointer text-center"
              :class="dpPercent === p ? 'bg-blue-600 text-white border-blue-600 shadow-xs' : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'"
            >
              {{ p === 0 ? 'DP 0%' : `${p}%` }}
            </button>
          </div>
        </div>

        <!-- Pilihan Tenor (Bulan) -->
        <div>
          <label class="block font-bold uppercase tracking-wider text-slate-500 mb-2">
            Jangka Waktu Komitmen / Tenor
          </label>
          <div class="grid grid-cols-4 gap-2">
            <button
              v-for="t in availableTenors"
              :key="t"
              type="button"
              @click="tenor = t"
              class="py-2.5 rounded-xl font-bold border transition-all cursor-pointer text-center"
              :class="tenor === t ? 'bg-blue-700 text-white border-blue-700 shadow-sm' : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'"
            >
              <span class="block text-sm font-mono font-black">{{ t }}x</span>
              <span class="text-[10px] block opacity-80">{{ t }} Bulan</span>
            </button>
          </div>
        </div>

      </div>

      <!-- Result Card (Clean Solid Corporate Blue, No AI rainbow gradient) -->
      <div class="p-5 rounded-2xl bg-blue-600 border border-blue-700 text-white shadow-md space-y-4">
        <div class="flex items-end justify-between">
          <div>
            <span class="text-xs uppercase font-bold tracking-wider text-blue-100 block">
              Estimasi Anggaran / Bulan (OpEx/Cicilan)
            </span>
            <div class="text-2xl sm:text-3xl font-black font-mono mt-1">
              {{ formatIDR(monthlyInstallment) }}
              <span class="text-xs font-normal text-blue-200 font-sans">/ bln</span>
            </div>
          </div>
          <div class="text-right">
            <span class="text-xs px-2.5 py-1 rounded-full bg-blue-700 font-bold font-mono border border-blue-500">
              {{ tenor }} Bulan ({{ scheme === 'cc_0' ? 'Bunga 0%' : 'Bunga 1.75%' }})
            </span>
          </div>
        </div>

        <div class="pt-3 border-t border-blue-500/60 grid grid-cols-3 gap-2 text-[11px] text-blue-100">
          <div>
            <span class="block text-blue-200">Alokasi Awal (DP)</span>
            <strong class="font-mono text-white block">{{ formatIDR(dpAmount) }}</strong>
          </div>
          <div>
            <span class="block text-blue-200">Total Pokok Pengadaan</span>
            <strong class="font-mono text-white block">{{ formatIDR(loanAmount) }}</strong>
          </div>
          <div class="text-right">
            <span class="block text-blue-200">Total Estimasi TCO</span>
            <strong class="font-mono text-white block">{{ formatIDR(totalPayment) }}</strong>
          </div>
        </div>
      </div>

      <!-- Action Button -->
      <div class="flex items-center gap-3 pt-2">
        <button
          type="button"
          @click="close"
          class="flex-1 py-3 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
        >
          Tutup
        </button>
        <button
          type="button"
          @click="proceedToCheckout"
          class="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span class="material-symbols-outlined text-[18px]">fact_check</span>
          <span>Ajukan Pengadaan RFQ</span>
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../stores/cartStore';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  laptop: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close']);

const router = useRouter();
const cartStore = useCartStore();

const scheme = ref('cc_0'); // 'cc_0' atau 'paylater'
const dpPercent = ref(0);
const tenor = ref(12);
const availableTenors = [3, 6, 12, 24];

const currentPrice = computed(() => {
  return parseFloat(props.laptop?.price || 10000000);
});

const dpAmount = computed(() => {
  return Math.round((currentPrice.value * dpPercent.value) / 100);
});

const loanAmount = computed(() => {
  return Math.max(0, currentPrice.value - dpAmount.value);
});

const monthlyInterestRate = computed(() => {
  return scheme.value === 'cc_0' ? 0 : 0.0175; // 0% untuk CC, flat 1.75% untuk Paylater
});

const monthlyInstallment = computed(() => {
  if (tenor.value <= 0) return 0;
  if (scheme.value === 'cc_0') {
    return Math.round(loanAmount.value / tenor.value);
  }
  const principalPerMonth = loanAmount.value / tenor.value;
  const interestPerMonth = loanAmount.value * monthlyInterestRate.value;
  return Math.round(principalPerMonth + interestPerMonth);
});

const totalPayment = computed(() => {
  return dpAmount.value + (monthlyInstallment.value * tenor.value);
});

function formatIDR(val) {
  if (!val) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(val);
}

function close() {
  emit('close');
}

function proceedToCheckout() {
  if (props.laptop) {
    cartStore.addItem(props.laptop, 1);
  }
  close();
  router.push('/checkout');
}
</script>
