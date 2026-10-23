<template>
  <div class="py-6 sm:py-10 print:py-0 print:m-0 bg-slate-100/60 print:bg-white min-h-screen font-sans">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 print:max-w-full print:px-0 print:mx-0">
      
      <!-- Top Smart Return Navigation Bar (Print Hidden) -->
      <div v-if="order" class="mb-4 flex items-center justify-between print:hidden">
        <button
          @click="handleBack"
          type="button"
          class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition-all shadow-xs cursor-pointer group"
        >
          <span class="material-symbols-outlined text-[17px] text-slate-500 group-hover:-translate-x-0.5 transition-transform">arrow_back</span>
          <span>{{ backDestination.label }}</span>
        </button>

        <div class="flex items-center gap-2">
          <router-link
            :to="{
              path: '/cek-pesanan',
              query: {
                q: order.order_number,
                from: route.query.from || authStore.user?.role || 'invoice'
              }
            }"
            class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold transition-all shadow-xs"
          >
            <span class="material-symbols-outlined text-[16px]">local_shipping</span>
            <span>Live Tracker & SLA</span>
          </router-link>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="py-20 text-center">
        <div class="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p class="text-sm font-semibold text-slate-600">Memuat faktur pesanan...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="!order" class="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
        <span class="material-symbols-outlined text-slate-400 text-[48px] mb-2">receipt_long</span>
        <h2 class="text-lg font-bold text-slate-800">Faktur Tidak Ditemukan</h2>
        <p class="text-xs text-slate-500 mt-1 mb-6">Nomor pesanan yang Anda tuju tidak terdaftar di sistem kami.</p>
        <button
          @click="handleBack"
          type="button"
          class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
        >
          {{ backDestination.label }}
        </button>
      </div>

      <!-- Invoice Receipt Paper -->
      <div
        v-else
        class="bg-white rounded-3xl border border-slate-200 p-4 sm:p-10 shadow-md space-y-6 sm:space-y-7 print:border-none print:shadow-none print:p-0 print:space-y-5 print:rounded-none"
      >
        
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b-2 border-slate-200">
          <div class="flex items-center gap-3.5">
            <div class="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shrink-0">
              <span class="material-symbols-outlined text-[26px]">dns</span>
            </div>
            <div>
              <span class="text-xl font-black text-slate-900 tracking-tight block">SmartInfra Enterprise Solutions</span>
              <span class="text-xs text-slate-500 font-medium block">Dokumen Penawaran Resmi (RFQ) & Perjanjian SLA</span>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <span
              v-if="order.payment_status === 'paid'"
              class="px-4 py-1.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5 shadow-xs"
            >
              <span class="material-symbols-outlined text-[16px]">verified</span>
              <span>LUNAS / PAID</span>
            </span>
            <span
              v-else-if="order.payment_status === 'cancelled'"
              class="px-4 py-1.5 rounded-full text-xs font-black bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1.5"
            >
              <span class="material-symbols-outlined text-[16px]">cancel</span>
              <span>DIBATALKAN</span>
            </span>
            <span
              v-else
              class="px-4 py-1.5 rounded-full text-xs font-black bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1.5"
            >
              <span class="material-symbols-outlined text-[16px]">schedule</span>
              <span>MENUNGGU PEMBAYARAN</span>
            </span>
          </div>
        </div>

        <!-- Live Provisioning / Order Tracking Banner (Print Hidden) -->
        <div
          v-if="order.payment_status === 'paid'"
          class="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden"
        >
          <div class="flex items-center gap-2.5">
            <span class="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <span class="material-symbols-outlined text-[20px]">dns</span>
            </span>
            <div>
              <h5 class="text-xs font-bold text-slate-900">Pantau Siklus Provisioning & Akses Server</h5>
              <p class="text-[11px] text-slate-500">Sistem melakukan provisioning otomatis dalam 1 menit menuju status Aktif / SLA Live.</p>
            </div>
          </div>
          <router-link
            :to="{
              path: '/cek-pesanan',
              query: {
                q: order.order_number,
                from: route.query.from || authStore.user?.role || 'invoice'
              }
            }"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 shrink-0"
          >
            <span class="material-symbols-outlined text-[16px]">local_shipping</span>
            <span>Buka Live Tracker</span>
          </router-link>
        </div>

        <!-- Meta Info (2 Columns) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs bg-slate-50/70 p-4 sm:p-5 rounded-2xl border border-slate-200/80 print:bg-transparent print:border-slate-300 print:p-3">
          <div>
            <span class="font-bold text-slate-500 uppercase tracking-wider block mb-1 font-mono text-[10px]">
              Tujuan Penerima & Pengiriman
            </span>
            <h4 class="font-black text-slate-900 text-sm sm:text-base">{{ order.customer_name }}</h4>
            <p class="text-slate-700 font-medium mt-0.5">{{ order.customer_phone }} • {{ order.customer_email }}</p>
            <p class="text-slate-600 mt-1.5 leading-relaxed">{{ order.shipping_address }}</p>
          </div>

          <div class="sm:text-right space-y-1.5">
            <span class="font-bold text-slate-500 uppercase tracking-wider block mb-1 font-mono text-[10px]">
              Detail Informasi Transaksi
            </span>
            <div>
              <span class="text-slate-500">Nomor Faktur:</span>
              <span class="font-mono font-black text-slate-900 ml-1.5 text-sm">{{ order.order_number }}</span>
            </div>
            <div>
              <span class="text-slate-500">Tanggal Order:</span>
              <span class="font-medium text-slate-800 ml-1.5">{{ formatDate(order.created_at) }}</span>
            </div>
            <div>
              <span class="text-slate-500">Metode Bayar:</span>
              <span class="font-bold text-slate-800 uppercase ml-1.5">{{ order.payment?.bank_name || order.payment_method }}</span>
            </div>
            <div v-if="order.paid_at">
              <span class="text-slate-500">Waktu Pelunasan:</span>
              <span class="font-bold text-emerald-700 ml-1.5">{{ formatDate(order.paid_at) }}</span>
            </div>
          </div>
        </div>

        <!-- Items Table -->
        <div>
          <div class="flex items-center justify-between mb-2.5">
            <span class="font-bold text-slate-700 text-xs uppercase tracking-wider font-mono">Rincian Komponen & Layanan</span>
            <span class="text-[11px] text-slate-400 font-mono">{{ order.items?.length || 0 }} Komponen Terdaftar</span>
          </div>

          <div class="border border-slate-200 rounded-2xl overflow-hidden print:border-slate-300">
            <table class="w-full text-left border-collapse text-xs">
              <thead class="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-mono uppercase text-[10px] print:bg-slate-100">
                <tr>
                  <th class="py-2.5 px-4 w-12 text-center">No</th>
                  <th class="py-2.5 px-4">Deskripsi Infrastruktur / Spesifikasi</th>
                  <th class="py-2.5 px-4 text-center w-24">Jumlah</th>
                  <th class="py-2.5 px-4 text-right w-36">Harga Satuan</th>
                  <th class="py-2.5 px-4 text-right w-40">Subtotal</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 print:divide-slate-200">
                <tr v-for="(item, idx) in order.items" :key="item.id" class="hover:bg-slate-50/50">
                  <td class="py-3 px-4 text-center font-mono text-slate-400 font-semibold">{{ idx + 1 }}</td>
                  <td class="py-3 px-4">
                    <span class="font-bold text-slate-900 block text-xs">{{ item.brand }} {{ item.model }}</span>
                    <span v-if="item.screen_desc" class="text-[11px] text-slate-500 block mt-0.5">
                      {{ item.screen_desc }}
                    </span>
                    <span v-if="item.sku" class="text-[10px] font-mono text-slate-400 block mt-0.5">
                      SKU: {{ item.sku }}
                    </span>
                  </td>
                  <td class="py-3 px-4 text-center font-mono font-bold text-slate-700">{{ item.quantity }}</td>
                  <td class="py-3 px-4 text-right font-mono text-slate-700">{{ formatIDR(item.unit_price) }}</td>
                  <td class="py-3 px-4 text-right font-mono font-bold text-slate-900">{{ formatIDR(item.subtotal) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Total Breakdown & Signatures -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 pt-2">
          <!-- Left: Terms & Conditions -->
          <div class="space-y-2 text-xs text-slate-500 max-w-sm">
            <h5 class="font-bold text-slate-700 uppercase font-mono text-[10px]">Ketentuan & Kebijakan SLA:</h5>
            <p class="text-[11px] leading-relaxed">
              1. Dokumen ini merupakan bukti tagihan dan pesanan resmi yang diotorisasi oleh SmartInfra Enterprise Solutions.<br />
              2. Garansi Uptime SLA 99.9% berlaku otomatis sejak pembayaran terverifikasi lunas.<br />
              3. Seluruh unit infrastruktur dipelihara di Data Center Tier-3 dengan proteksi Anti-DDoS 24/7.
            </p>
            <p class="text-[10px] font-mono text-slate-400">
              Dicetak pada: {{ currentPrintDate }}
            </p>
          </div>

          <!-- Right: Numeric Totals Box -->
          <div class="w-full sm:w-80 space-y-2 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200 print:bg-transparent print:border-none print:p-0">
            <div class="flex justify-between text-slate-600 font-medium">
              <span>Subtotal Infrastruktur ({{ totalUnits }} Instans/Unit):</span>
              <span class="font-mono font-bold text-slate-900">{{ formatIDR(order.total_amount) }}</span>
            </div>
            <div class="flex justify-between text-slate-600 font-medium">
              <span>Setup Provisioning & SLA:</span>
              <span class="font-mono font-bold text-emerald-600">Rp 0 (Termasuk)</span>
            </div>
            <div class="flex justify-between text-slate-600 font-medium">
              <span>Biaya Layanan Cloud Gateway:</span>
              <span class="font-mono font-bold text-emerald-600">Rp 0</span>
            </div>
            <div class="flex justify-between pt-2.5 border-t border-slate-200 text-sm font-bold text-slate-900">
              <span>Total Nilai Pengadaan:</span>
              <span class="font-mono text-xl font-black text-blue-600">{{ formatIDR(order.total_amount) }}</span>
            </div>
          </div>
        </div>

        <!-- Print & Navigation Actions (Hidden on Print) -->
        <div class="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
          <button
            @click="handleBack"
            type="button"
            class="text-xs font-bold text-slate-600 hover:text-blue-600 flex items-center gap-1.5 transition-colors cursor-pointer group"
          >
            <span class="material-symbols-outlined text-[18px] group-hover:-translate-x-0.5 transition-transform">arrow_back</span>
            <span>{{ backDestination.label }}</span>
          </button>

          <div class="flex items-center gap-3">
            <router-link
              :to="{
                path: '/cek-pesanan',
                query: {
                  q: order.order_number,
                  from: route.query.from || authStore.user?.role || 'invoice'
                }
              }"
              class="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <span class="material-symbols-outlined text-[16px]">local_shipping</span>
              <span>Lacak Status Pengadaan</span>
            </router-link>

            <button
              @click="printInvoice"
              type="button"
              class="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-blue-500/20 cursor-pointer"
            >
              <span class="material-symbols-outlined text-[18px]">print</span>
              <span>Cetak / Simpan PDF</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const order = ref(null);
const loading = ref(true);

const totalUnits = computed(() => {
  if (!order.value || !order.value.items) return 0;
  return order.value.items.reduce((sum, item) => sum + (parseInt(item.quantity, 10) || 1), 0);
});

const currentPrintDate = computed(() => {
  const d = new Date();
  return d.toLocaleString('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
});

// Smart Back Navigation Helper (Roles & Query aware)
const backDestination = computed(() => {
  const from = route.query.from;
  if (from === 'admin' || (!from && authStore.user?.role === 'admin')) {
    return {
      to: { path: '/admin', query: { tab: 'orders' } },
      label: 'Kembali ke Panel Admin'
    };
  }
  if (from === 'sales' || (!from && authStore.user?.role === 'sales')) {
    return {
      to: { path: '/sales', query: { tab: 'orders' } },
      label: 'Kembali ke Portal Sales'
    };
  }
  if (from === 'tracking') {
    return {
      to: { path: '/cek-pesanan', query: { q: order.value?.order_number } },
      label: 'Kembali ke Lacak Pengadaan'
    };
  }
  return {
    to: '/katalog',
    label: 'Kembali ke Katalog'
  };
});

function handleBack() {
  if (window.history.state?.back) {
    router.back();
  } else {
    router.push(backDestination.value.to);
  }
}

function formatIDR(val) {
  if (!val) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(val);
}

function formatDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleString('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
}

function printInvoice() {
  window.print();
}

async function fetchOrder() {
  loading.value = true;
  try {
    const res = await axios.get(`/api/orders/${route.params.orderNumber}`);
    if (res.data.success) {
      order.value = res.data.data;
    }
  } catch (err) {
    console.error('Error fetching order invoice:', err);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchOrder();
});
</script>
