<template>
  <div class="py-4 sm:py-8 font-sans">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="mb-6 sm:mb-8">
        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Pengajuan Pengadaan Infrastruktur (RFQ)</h1>
        <p class="text-xs sm:text-sm text-slate-500 mt-1">
          Lengkapi data instansi dan PIC teknis untuk menerbitkan dokumen penawaran resmi (*Request for Quotation*) dan surat perjanjian tingkat layanan (*SLA*).
        </p>
      </div>

      <!-- Empty Cart State -->
      <div v-if="cartStore.items.length === 0 && !activeOrder" class="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center max-w-lg mx-auto shadow-sm">
        <div class="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
          <span class="material-symbols-outlined text-[32px]">inventory_2</span>
        </div>
        <h2 class="text-base sm:text-lg font-bold text-slate-900">Draft Pengadaan Masih Kosong</h2>
        <p class="text-xs text-slate-500 mt-1.5 mb-6">
          Anda belum memilih paket Cloud Server atau GPU Rig untuk diajukan. Silakan gunakan katalog komputasi atau mesin rekomendasi arsitektur kami.
        </p>
        <router-link
          to="/"
          class="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
        >
          <span class="material-symbols-outlined text-[18px]">dns</span>
          <span>Analisis Rekomendasi Arsitektur</span>
        </router-link>
      </div>

      <!-- Checkout Grid -->
      <div v-else-if="!activeOrder" class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        <!-- Left: Customer & Shipping Form -->
        <div class="lg:col-span-7 space-y-6">
          <div class="bg-white rounded-3xl border border-slate-200 p-4 sm:p-8 shadow-sm">
            <h2 class="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span class="material-symbols-outlined text-blue-600 text-[20px]">domain</span>
              <span>Informasi Instansi & PIC Penanggung Jawab</span>
            </h2>

            <form @submit.prevent="handleCheckout" class="space-y-4">
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Nama Lengkap PIC / Lead Engineer *
                </label>
                <input
                  type="text"
                  v-model="form.customer_name"
                  required
                  placeholder="Contoh: Pratama DevOps Lead / PT Solusi Digital"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                />
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Nomor WhatsApp / Kontak Kerja *
                  </label>
                  <input
                    type="tel"
                    v-model="form.customer_phone"
                    required
                    placeholder="0812xxxxxxxx"
                    class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Email Resmi Perusahaan / PIC *
                  </label>
                  <input
                    type="email"
                    v-model="form.customer_email"
                    required
                    placeholder="devops@perusahaan.com"
                    class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Nama Instansi & Alamat Penagihan / Alamat Pengiriman Server *
                </label>
                <textarea
                  v-model="form.shipping_address"
                  required
                  rows="3"
                  placeholder="Nama instansi/perusahaan, lantai, gedung kantor, atau lokasi data center penempatan server..."
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                ></textarea>
              </div>

              <!-- Payment Method Selection -->
              <div class="pt-4 border-t border-slate-100">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Metode Pembayaran & Opsi Kredit
                </label>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    v-for="method in paymentMethods"
                    :key="method.id"
                    class="flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all text-xs relative overflow-hidden"
                    :class="form.payment_method === method.id ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/10' : 'border-slate-200 hover:border-slate-300'"
                  >
                    <input
                      type="radio"
                      :value="method.id"
                      v-model="form.payment_method"
                      class="text-blue-600 focus:ring-blue-500"
                    />
                    <div class="flex-1">
                      <div class="flex items-center gap-1.5">
                        <span class="font-bold text-slate-900">{{ method.name }}</span>
                        <span v-if="method.badge" class="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                          {{ method.badge }}
                        </span>
                      </div>
                      <span class="text-[11px] text-slate-500 block">{{ method.desc }}</span>
                    </div>
                  </label>
                </div>

                <!-- Credit / Installment Simulation Widget inside Checkout -->
                <div
                  v-if="form.payment_method === 'credit_card' || form.payment_method === 'paylater'"
                  class="mt-4 p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/40 border-2 border-blue-200/80 space-y-4 animate-in fade-in duration-200"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span class="material-symbols-outlined text-blue-600 text-[20px]">
                        {{ form.payment_method === 'credit_card' ? 'credit_card' : 'payments' }}
                      </span>
                      <h4 class="font-bold text-xs text-slate-900 uppercase tracking-wider">
                        {{ form.payment_method === 'credit_card' ? 'Simulasi Cicilan Kartu Kredit 0%' : 'Simulasi Kredit Paylater Instan' }}
                      </h4>
                    </div>
                    <span class="text-[11px] font-bold px-2 py-0.5 rounded-full" :class="form.payment_method === 'credit_card' ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-100 text-indigo-800'">
                      {{ form.payment_method === 'credit_card' ? 'Bunga 0%' : 'Bunga 1.75%' }}
                    </span>
                  </div>

                  <!-- Tenor Selection -->
                  <div>
                    <span class="block text-[11px] font-bold uppercase text-slate-600 mb-2">
                      Pilih Tenor Pembayaran
                    </span>
                    <div class="grid grid-cols-4 gap-2">
                      <button
                        v-for="t in (form.payment_method === 'credit_card' ? [3, 6, 12, 24] : [3, 6, 12])"
                        :key="t"
                        type="button"
                        @click="form.installment_tenor = t"
                        class="py-2 px-1 rounded-xl text-center border font-bold text-xs transition-all cursor-pointer"
                        :class="form.installment_tenor === t ? 'bg-blue-600 text-white border-blue-600 shadow-xs' : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'"
                      >
                        <span class="block font-mono font-black">{{ t }}x</span>
                        <span class="text-[10px] block opacity-85">{{ t }} Bulan</span>
                      </button>
                    </div>
                  </div>

                  <!-- Live Installment Calculation Summary -->
                  <div class="p-3.5 rounded-xl bg-white border border-blue-100 flex items-center justify-between">
                    <div>
                      <span class="text-[11px] text-slate-500 block">Estimasi Tagihan Per Bulan:</span>
                      <span class="text-base sm:text-lg font-black font-mono text-blue-700">
                        {{ formatIDR(checkoutMonthlyInstallment) }}
                        <span class="text-xs font-normal text-slate-500 font-sans">/ bln</span>
                      </span>
                    </div>
                    <div class="text-right text-[11px] text-slate-500">
                      <span>Total {{ form.installment_tenor }}x Pembayaran:</span>
                      <span class="block font-bold font-mono text-slate-800">
                        {{ formatIDR(checkoutTotalCreditPayment) }}
                      </span>
                    </div>
                  </div>

                  <!-- Simulated Credit Card Input Preview -->
                  <div v-if="form.payment_method === 'credit_card'" class="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
                    <div class="sm:col-span-2">
                      <label class="block font-semibold text-slate-600 mb-1">Nomor Kartu Kredit (Sandbox)</label>
                      <input
                        type="text"
                        v-model="simulatedCardNumber"
                        placeholder="4532 0000 0000 1234"
                        class="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono text-xs text-slate-800"
                      />
                    </div>
                    <div>
                      <label class="block font-semibold text-slate-600 mb-1">Masa Berlaku</label>
                      <input
                        type="text"
                        value="12/28"
                        readonly
                        class="w-full bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono text-xs text-slate-600 text-center"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Submit Button -->
              <div class="pt-4">
                <button
                  type="submit"
                  :disabled="submitting"
                  class="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span v-if="submitting" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span class="material-symbols-outlined text-[20px]">
                    {{ (form.payment_method === 'credit_card' || form.payment_method === 'paylater') ? 'credit_score' : 'lock' }}
                  </span>
                  <span>{{ (form.payment_method === 'credit_card' || form.payment_method === 'paylater') ? 'Proses Pengajuan & Bayar Cicilan' : 'Bayar Sekarang (Buka Simulator Pembayaran)' }}</span>
                </button>
                <p class="text-[11px] text-slate-400 text-center mt-2.5">
                  Transaksi menggunakan simulasi perbankan aman sandbox tanpa potongan biaya kartu.
                </p>
              </div>
            </form>
          </div>
        </div>

        <!-- Right: Order Summary -->
        <div class="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-4 sm:p-8 shadow-sm space-y-6">
          <div class="flex items-center justify-between pb-4 border-b border-slate-100">
            <h2 class="text-base font-bold text-slate-900">Ringkasan Pesanan</h2>
            <span class="text-xs font-semibold text-slate-500">{{ cartStore.totalCount }} Item</span>
          </div>

          <!-- Items List -->
          <div class="space-y-4 max-h-96 overflow-y-auto pr-1">
            <div
              v-for="item in cartStore.items"
              :key="item.id"
              class="flex items-center gap-3.5 pb-4 border-b border-slate-50 last:border-0"
            >
              <div class="w-14 h-14 rounded-xl bg-slate-100 p-2 flex items-center justify-center shrink-0">
                <img v-if="item.image_url" :src="item.image_url" :alt="item.model" class="max-h-full max-w-full object-contain" />
                <span v-else class="material-symbols-outlined text-slate-400 text-[24px]">dns</span>
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="font-bold text-xs text-slate-900 truncate">{{ item.brand }} {{ item.model }}</h4>
                <span class="text-[11px] text-slate-400 block">{{ formatIDR(item.price) }}</span>
                
                <div class="flex items-center gap-2 mt-1.5">
                  <div class="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                    <button
                      @click="cartStore.updateQuantity(item.id, item.quantity - 1)"
                      class="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-200 transition-colors"
                    >
                      -
                    </button>
                    <span class="px-2.5 py-0.5 text-xs font-bold text-slate-800">{{ item.quantity }}</span>
                    <button
                      @click="cartStore.updateQuantity(item.id, item.quantity + 1)"
                      class="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-200 transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <button
                    @click="cartStore.removeItem(item.id)"
                    class="text-[11px] text-rose-500 hover:underline"
                  >
                    Hapus
                  </button>
                </div>
              </div>
              <div class="text-right">
                <span class="text-xs font-bold text-slate-900 block">
                  {{ formatIDR(item.price * item.quantity) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Total Calculation -->
          <div class="pt-4 border-t border-slate-100 space-y-2 text-xs">
            <div class="flex justify-between text-slate-500">
              <span>Subtotal Produk</span>
              <span class="font-semibold text-slate-800">{{ formatIDR(cartStore.totalPrice) }}</span>
            </div>
            <div class="flex justify-between text-slate-500">
              <span>Biaya Pengiriman (Asuransi)</span>
              <span class="font-semibold text-emerald-600">Gratis (Rp 0)</span>
            </div>
            <div class="flex justify-between text-slate-500">
              <span>Biaya Layanan Simulasi</span>
              <span class="font-semibold text-emerald-600">Rp 0</span>
            </div>
            <div class="pt-3 border-t border-slate-100 flex justify-between items-baseline">
              <span class="text-sm font-bold text-slate-900">Total Pembayaran</span>
              <span class="text-xl font-extrabold text-blue-600">
                {{ formatIDR(cartStore.totalPrice) }}
              </span>
            </div>
          </div>
        </div>

      </div>

      <!-- Payment Simulation Modal / View -->
      <div v-else class="max-w-xl mx-auto bg-white rounded-3xl border border-slate-200 p-4 sm:p-8 shadow-lg text-center space-y-5 sm:space-y-6">
        <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto ring-8 ring-blue-50/50">
          <span class="material-symbols-outlined text-[28px] sm:text-[32px]">account_balance</span>
        </div>

        <div>
          <span class="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Simulator Pembayaran Instan
          </span>
          <h2 class="text-xl sm:text-2xl font-extrabold text-slate-900 mt-3">Menunggu Pembayaran</h2>
          <p class="text-xs text-slate-500 mt-1">
            Pesanan Anda telah dicatat dengan nomor: <span class="font-mono font-bold text-slate-800 break-all">{{ activeOrder.order_number }}</span>
          </p>
        </div>

        <!-- Virtual Account Box (When method is VA or QRIS) -->
        <div v-if="activeOrder.payment_method !== 'credit_card' && activeOrder.payment_method !== 'paylater'" class="p-4 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-200/80">
            <span class="text-xs font-semibold text-slate-500">Metode Bayar</span>
            <span class="text-xs font-bold text-slate-800">{{ activeOrder.payment_info.bank_name }}</span>
          </div>

          <div>
            <span class="text-[11px] text-slate-400 block uppercase tracking-wider font-semibold">Nomor Kode Bayar / Virtual Account</span>
            <div class="flex items-center justify-between mt-1">
              <span class="text-lg sm:text-2xl font-mono font-bold text-slate-900 tracking-wider break-all">
                {{ activeOrder.payment_info.pay_code }}
              </span>
              <button
                @click="copyCode(activeOrder.payment_info.pay_code)"
                class="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-1 cursor-pointer shrink-0 ml-2"
              >
                <span class="material-symbols-outlined text-[14px]">content_copy</span>
                <span>{{ copied ? 'Tersalin' : 'Salin' }}</span>
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between pt-3 border-t border-slate-200/80">
            <span class="text-xs font-semibold text-slate-500">Total Nominal</span>
            <span class="text-base font-extrabold text-blue-600">
              {{ formatIDR(activeOrder.total_amount) }}
            </span>
          </div>
        </div>

        <!-- Simulated Credit Card Box (When method is Credit Card) -->
        <div v-else-if="activeOrder.payment_method === 'credit_card'" class="space-y-4 text-left">
          <div class="p-4 sm:p-6 rounded-2xl bg-blue-900 border border-blue-800 text-white shadow-lg relative overflow-hidden">
            <div class="flex items-center justify-between mb-4 sm:mb-6">
              <div class="flex items-center gap-2">
                <span class="w-8 h-6 rounded bg-blue-400 border border-blue-300 inline-block shadow-xs"></span>
                <span class="text-xs uppercase font-bold tracking-widest text-slate-200">SmartInfra Corporate Card</span>
              </div>
              <span class="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-blue-800 text-white border border-blue-700">
                Cicilan 0%
              </span>
            </div>
            
            <p class="font-mono text-lg sm:text-2xl font-bold tracking-widest text-white/95 my-3 sm:my-4 break-all">
              {{ activeOrder.payment_info.pay_code }}
            </p>

            <div class="flex items-center justify-between pt-2 text-xs font-mono text-slate-300 gap-2">
              <div class="truncate">
                <span class="text-[10px] uppercase text-blue-200 block">Nama Pemegang Rekening</span>
                <span class="font-bold uppercase text-white truncate block">{{ activeOrder.customer_name }}</span>
              </div>
              <div class="text-right shrink-0">
                <span class="text-[10px] uppercase text-blue-200 block">Total Pengadaan</span>
                <span class="font-bold text-white font-mono">{{ formatIDR(activeOrder.total_amount) }}</span>
              </div>
            </div>
          </div>
          
          <div class="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center gap-2">
            <span class="material-symbols-outlined text-blue-600 text-[18px] shrink-0">verified_user</span>
            <span>Simulasi Otorisasi 3D Secure / Visa Corporate OTP Sandbox siap disetujui.</span>
          </div>
        </div>

        <!-- Simulated Paylater Box (When method is Paylater) -->
        <div v-else class="space-y-4 text-left">
          <div class="p-4 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 text-white shadow-lg relative overflow-hidden">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-blue-400 text-[24px]">account_balance_wallet</span>
                <span class="font-bold text-sm tracking-wide">B2B Leasing & Pembiayaan Usaha</span>
              </div>
              <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white font-mono">
                Plafon Disetujui
              </span>
            </div>

            <div class="p-3 rounded-xl bg-slate-800 border border-slate-700 space-y-1.5 text-xs font-mono">
              <div class="flex justify-between text-slate-300">
                <span>Kode Kontrak Pengadaan:</span>
                <strong class="text-white">{{ activeOrder.payment_info.pay_code }}</strong>
              </div>
              <div class="flex justify-between text-slate-300">
                <span>Instansi Penerima:</span>
                <strong class="text-white truncate max-w-[160px]">{{ activeOrder.customer_name }}</strong>
              </div>
              <div class="flex justify-between text-slate-300">
                <span>Total Pembiayaan:</span>
                <strong class="text-blue-300">{{ formatIDR(activeOrder.total_amount) }}</strong>
              </div>
            </div>
          </div>
        </div>

        <!-- Action: Simulate Payment Success -->
        <div class="space-y-3 pt-2">
          <button
            @click="triggerSimulatePayment"
            :disabled="simulating"
            class="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span v-if="simulating" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            <span class="material-symbols-outlined text-[22px] group-hover:scale-110 transition-transform">
              {{ (activeOrder.payment_method === 'credit_card' || activeOrder.payment_method === 'paylater') ? 'verified_user' : 'check_circle' }}
            </span>
            <span>
              {{ activeOrder.payment_method === 'credit_card' ? '[ OTORISASI & SETUJUI PEMBAYARAN KARTU KREDIT ]' : activeOrder.payment_method === 'paylater' ? '[ KONFIRMASI KONTRAK CICILAN PAYLATER ]' : '[ SIMULASIKAN PEMBAYARAN BERHASIL ]' }}
            </span>
          </button>
          <p class="text-[11px] text-slate-400 leading-relaxed">
            Klik tombol hijau di atas untuk memicu simulasi pembayaran instan (Sandbox). Sistem akan mengonfirmasi status LUNAS dan menerbitkan faktur digital resmi.
          </p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useCartStore } from '../stores/cartStore';

const router = useRouter();
const cartStore = useCartStore();

const paymentMethods = [
  { id: 'bca_va', name: 'BCA Virtual Account', desc: 'Verifikasi instan otomatis' },
  { id: 'mandiri_va', name: 'Mandiri Virtual Account', desc: 'Verifikasi instan otomatis' },
  { id: 'bri_va', name: 'BRI Virtual Account', desc: 'Verifikasi instan otomatis' },
  { id: 'qris', name: 'QRIS Realtime', desc: 'Gopay, OVO, ShopeePay, Dana' },
  { id: 'credit_card', name: 'Kartu Kredit Cicilan 0%', desc: 'BCA, Mandiri, BRI, CIMB', badge: 'Promo 0%' },
  { id: 'paylater', name: 'Paylater & Kredit Instan', desc: 'Kredivo, Akulaku, SpayLater', badge: 'Proses Cepat' }
];

const form = ref({
  customer_name: '',
  customer_phone: '',
  customer_email: '',
  shipping_address: '',
  payment_method: 'bca_va',
  installment_tenor: 12
});

const simulatedCardNumber = ref('4532 8812 9011 2345');

const checkoutMonthlyInstallment = computed(() => {
  const total = cartStore.totalPrice || 0;
  const t = form.value.installment_tenor || 12;
  if (t <= 0) return total;
  if (form.value.payment_method === 'credit_card') {
    return Math.round(total / t);
  }
  // Paylater flat 1.75%
  return Math.round((total / t) + (total * 0.0175));
});

const checkoutTotalCreditPayment = computed(() => {
  const t = form.value.installment_tenor || 12;
  return checkoutMonthlyInstallment.value * t;
});

const submitting = ref(false);
const activeOrder = ref(null);
const copied = ref(false);
const simulating = ref(false);

function formatIDR(val) {
  if (!val) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(val);
}

function copyCode(text) {
  navigator.clipboard.writeText(text);
  copied.value = true;
  setTimeout(() => { copied.value = false; }, 2000);
}

async function handleCheckout() {
  if (cartStore.items.length === 0) return;

  submitting.value = true;
  try {
    const isCredit = form.value.payment_method === 'credit_card' || form.value.payment_method === 'paylater';
    const payload = {
      customer_name: form.value.customer_name,
      customer_phone: form.value.customer_phone,
      customer_email: form.value.customer_email || 'contact@smartinfra.com',
      shipping_address: form.value.shipping_address,
      payment_method: form.value.payment_method,
      installment_tenor: isCredit ? form.value.installment_tenor : null,
      items: cartStore.items
        .filter(item => (item.id || item.laptop_id) && !isNaN(parseInt(item.id || item.laptop_id, 10)))
        .map(item => ({
          laptop_id: parseInt(item.id || item.laptop_id, 10),
          quantity: item.quantity || 1
        }))
    };

    const res = await axios.post('/api/orders/checkout', payload);
    if (res.data.success) {
      activeOrder.value = res.data.data;
      cartStore.clearCart(); // Clear cart once order is registered

      // Simpan riwayat pesanan lokal agar langsung muncul di Cek Pesanan
      try {
        const existing = JSON.parse(localStorage.getItem('smartinfra_recent_orders') || '[]');
        const updated = [
          {
            order_number: res.data.data.order_number,
            customer_name: res.data.data.customer_name,
            total_amount: res.data.data.total_amount,
            created_at: new Date().toISOString()
          },
          ...existing.filter(o => o.order_number !== res.data.data.order_number)
        ].slice(0, 8);
        localStorage.setItem('smartinfra_recent_orders', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save to local recent orders:', e);
      }
    }
  } catch (err) {
    alert(err.response?.data?.message || 'Gagal memproses pesanan');
  } finally {
    submitting.value = false;
  }
}

async function triggerSimulatePayment() {
  if (!activeOrder.value) return;

  simulating.value = true;
  try {
    const res = await axios.post(`/api/orders/${activeOrder.value.order_number}/simulate-pay`);
    if (res.data.success) {
      router.push(`/pesanan/${activeOrder.value.order_number}`);
    }
  } catch (err) {
    alert(err.response?.data?.message || 'Simulasi pembayaran gagal');
  } finally {
    simulating.value = false;
  }
}
</script>
