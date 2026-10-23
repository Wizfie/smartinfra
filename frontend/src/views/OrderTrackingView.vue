<template>
  <div class="py-6 sm:py-10 max-w-4xl mx-auto px-4 sm:px-6 font-sans">
    <!-- Return Navigation Bar (If navigated from Admin, Sales, or Invoice) -->
    <div v-if="backDestination" class="mb-5 flex items-center justify-between bg-white border border-slate-200 px-4 py-2.5 rounded-xl shadow-xs">
      <button
        @click="handleBack"
        type="button"
        class="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-blue-600 transition-colors cursor-pointer group"
      >
        <span class="material-symbols-outlined text-[17px] text-slate-400 group-hover:-translate-x-0.5 transition-transform">arrow_back</span>
        <span>{{ backDestination.label }}</span>
      </button>

      <span class="text-[11px] font-mono text-slate-400">
        {{ authStore.user?.role === 'admin' ? 'Portal Admin' : authStore.user?.role === 'sales' ? 'Portal Sales' : 'Dokumen Faktur' }}
      </span>
    </div>

    <!-- Header Page -->
    <div class="text-center max-w-xl mx-auto mb-6 sm:mb-8">
      <div
        class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-3"
      >
        <span class="material-symbols-outlined text-[15px]">local_shipping</span>
        <span>Pelacakan Pesanan Real-Time</span>
      </div>
      <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
        Cek Status Pengadaan & Aktivasi Server
      </h1>
      <p class="text-xs sm:text-sm text-slate-500 mt-2">
        Masukkan nomor faktur atau nomor pengadaan SmartInfra untuk memantau status pembayaran, proses provisioning, dan aktivasi SLA instans Anda.
      </p>
    </div>

    <!-- Search Box Card -->
    <div class="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm mb-6 sm:mb-8">
      <form @submit.prevent="searchOrder" class="flex flex-col sm:flex-row gap-3">
        <div class="relative flex-1">
          <span
            class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            style="font-size: 20px"
          >
            receipt_long
          </span>
          <input
            type="text"
            v-model="inputOrderNumber"
            placeholder="Contoh: SI-20261018-6384"
            class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-900 placeholder:font-sans placeholder:font-normal placeholder:text-slate-400 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all uppercase"
          />
        </div>
        <button
          type="submit"
          :disabled="loading || !inputOrderNumber.trim()"
          class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span
            v-if="loading"
            class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
          ></span>
          <span v-else class="material-symbols-outlined text-[18px]">search</span>
          <span>Lacak Pesanan</span>
        </button>
      </form>

      <!-- Recent Orders on This Device -->
      <div v-if="recentOrders.length > 0 && !order" class="mt-4 pt-4 border-t border-slate-100">
        <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
          Pesanan Terakhir di Perangkat Ini:
        </span>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="rec in recentOrders"
            :key="rec.order_number"
            @click="quickSelectOrder(rec.order_number)"
            type="button"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 border border-slate-200 rounded-lg text-xs font-mono font-semibold text-slate-700 hover:text-blue-700 transition-colors cursor-pointer"
          >
            <span class="material-symbols-outlined text-slate-400" style="font-size: 14px">history</span>
            <span>{{ rec.order_number }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-if="searched && !loading && !order"
      class="bg-white rounded-2xl border border-rose-200 p-6 sm:p-8 text-center shadow-sm"
    >
      <div class="w-12 h-12 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto mb-3 text-rose-500">
        <span class="material-symbols-outlined text-[28px]">search_off</span>
      </div>
      <h3 class="text-base font-bold text-slate-900">Pesanan Tidak Ditemukan</h3>
      <p class="text-xs text-slate-500 mt-1 max-w-md mx-auto">
        Nomor pesanan <span class="font-mono font-bold text-slate-700">"{{ searchedQuery }}"</span> tidak ditemukan di database. Pastikan nomor faktur lengkap sesuai bukti pemesanan Anda.
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="py-16 text-center">
      <div class="w-9 h-9 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
      <p class="text-xs font-semibold text-slate-500 font-mono">Mencari data pesanan...</p>
    </div>

    <!-- Order Detail Result -->
    <div v-if="order && !loading" class="space-y-6">
      
      <!-- Top Card: Summary & Visual Stepper -->
      <div class="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">No. Pesanan:</span>
              <span class="font-mono font-extrabold text-blue-600 text-sm sm:text-base">{{ order.order_number }}</span>
            </div>
            <p class="text-xs text-slate-500">
              Dipesan pada <span class="font-medium text-slate-700">{{ formatDate(order.created_at) }}</span>
            </p>
          </div>

          <!-- Dynamic Status Badge -->
          <div class="flex items-center gap-2">
            <!-- State 1: Menunggu Pembayaran -->
            <span
              v-if="!isPaid"
              class="px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1.5 shadow-xs"
            >
              <span class="material-symbols-outlined text-[16px]">schedule</span>
              <span>MENUNGGU PEMBAYARAN</span>
            </span>

            <!-- State 2: Terbayar tapi masih proses provisioning (< 60 detik) -->
            <span
              v-else-if="!isProvisioned"
              class="px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-blue-100 text-blue-800 border border-blue-300 flex items-center gap-1.5 shadow-xs animate-pulse"
            >
              <span class="material-symbols-outlined text-[16px] animate-spin">sync</span>
              <span>PROVISIONING OTOMATIS (Sisa {{ secondsLeft }}s)</span>
            </span>

            <!-- State 3: Selesai Provisioning (>= 60 detik) -> AKTIF -->
            <span
              v-else
              class="px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5 shadow-xs"
            >
              <span class="material-symbols-outlined text-[16px]">verified</span>
              <span>NODE AKTIF (SLA 99.9% LIVE)</span>
            </span>
          </div>
        </div>

        <!-- Visual Stepper Progress Tracker -->
        <div class="pt-6">
          <div class="relative flex items-center justify-between">
            <div class="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-slate-100 w-full z-0"></div>
            <!-- Dynamic Filled Stepper Line -->
            <div
              class="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 transition-all duration-700 ease-out z-0"
              :style="{ width: stepperProgressWidth }"
            ></div>

            <!-- Step 1: RFQ Masuk -->
            <div class="relative z-10 flex flex-col items-center">
              <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-sm">
                <span class="material-symbols-outlined text-[14px] sm:text-[16px]">check</span>
              </div>
              <span class="text-[10px] sm:text-[11px] font-bold text-slate-800 mt-1.5 text-center">RFQ Masuk</span>
            </div>

            <!-- Step 2: Pembayaran -->
            <div class="relative z-10 flex flex-col items-center">
              <div
                class="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shadow-sm transition-colors"
                :class="isPaid ? 'bg-blue-600 text-white' : 'bg-amber-500 text-white ring-4 ring-amber-100'"
              >
                <span class="material-symbols-outlined text-[14px] sm:text-[16px]">
                  {{ isPaid ? 'check' : 'pending' }}
                </span>
              </div>
              <span
                class="text-[10px] sm:text-[11px] font-bold mt-1.5 text-center"
                :class="isPaid ? 'text-slate-800' : 'text-amber-700'"
              >
                {{ isPaid ? 'Terbayar' : 'Menunggu' }}
              </span>
            </div>

            <!-- Step 3: Provisioning -->
            <div class="relative z-10 flex flex-col items-center">
              <div
                class="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shadow-sm transition-all"
                :class="
                  !isPaid
                    ? 'bg-slate-200 text-slate-400'
                    : isProvisioned
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-600 text-white ring-4 ring-blue-200 shadow-blue-500/30'
                "
              >
                <span
                  class="material-symbols-outlined text-[14px] sm:text-[16px]"
                  :class="{ 'animate-spin': isPaid && !isProvisioned }"
                >
                  {{ isProvisioned ? 'check' : 'dns' }}
                </span>
              </div>
              <span
                class="text-[10px] sm:text-[11px] font-bold mt-1.5 text-center transition-colors"
                :class="
                  !isPaid
                    ? 'text-slate-400'
                    : isProvisioned
                    ? 'text-slate-800'
                    : 'text-blue-700 animate-pulse font-extrabold'
                "
              >
                {{ isPaid && !isProvisioned ? `Provisioning (${provisioningPercent}%)` : 'Provisioning' }}
              </span>
            </div>

            <!-- Step 4: Aktif / SLA Live -->
            <div class="relative z-10 flex flex-col items-center">
              <div
                class="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shadow-sm transition-all duration-500"
                :class="
                  isProvisioned
                    ? 'bg-emerald-600 text-white ring-4 ring-emerald-200 shadow-emerald-500/20'
                    : 'bg-slate-200 text-slate-400'
                "
              >
                <span class="material-symbols-outlined text-[14px] sm:text-[16px]">
                  {{ isProvisioned ? 'verified' : 'power_settings_new' }}
                </span>
              </div>
              <span
                class="text-[10px] sm:text-[11px] font-bold mt-1.5 text-center transition-colors"
                :class="isProvisioned ? 'text-emerald-700 font-extrabold' : 'text-slate-400'"
              >
                Aktif / SLA Live
              </span>
            </div>
          </div>
        </div>

        <!-- ACTION BOX VARIANT A: Menunggu Pembayaran -->
        <div
          v-if="!isPaid && order.payment"
          class="mt-6 p-4 rounded-xl bg-amber-50/70 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <div class="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-1">
              <span class="material-symbols-outlined text-[16px]">notifications_active</span>
              <span>Selesaikan Pembayaran {{ order.payment.bank_name }}</span>
            </div>
            <p class="text-xs text-amber-800">
              Kode Bayar: <span class="font-mono font-extrabold text-sm text-slate-900 bg-white px-2 py-0.5 rounded border border-amber-300 ml-1 select-all">{{ order.payment.pay_code }}</span>
            </p>
          </div>

          <div class="flex items-center gap-2">
            <button
              @click="copyPayCode(order.payment.pay_code)"
              type="button"
              class="px-3 py-2 bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span class="material-symbols-outlined text-[15px]">{{ copied ? 'check' : 'content_copy' }}</span>
              <span>{{ copied ? 'Disalin!' : 'Salin Kode' }}</span>
            </button>
            <button
              @click="simulatePaymentNow"
              :disabled="simulating"
              type="button"
              class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <span v-if="simulating" class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span v-else class="material-symbols-outlined text-[15px]">credit_score</span>
              <span>Simulasi Bayar Sekarang</span>
            </button>
          </div>
        </div>

        <!-- ACTION BOX VARIANT B: Live Auto-Provisioning (Dalam 60 Detik) -->
        <div
          v-else-if="isPaid && !isProvisioned"
          class="mt-6 p-4 sm:p-5 rounded-xl bg-gradient-to-r from-blue-50/90 via-indigo-50/60 to-blue-50/90 border border-blue-200"
        >
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div class="flex items-center gap-2">
              <span class="relative flex h-3 w-3">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-3 w-3 bg-blue-600"></span>
              </span>
              <div>
                <h4 class="text-xs font-bold text-blue-900">
                  Otomatisasi Orkestrasi Server Sedang Berjalan
                </h4>
                <p class="text-[11px] text-blue-700 font-mono mt-0.5">
                  Tahap: {{ currentStageMessage }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-2 self-start sm:self-auto">
              <span class="px-2.5 py-1 bg-white border border-blue-200 rounded-lg text-xs font-mono font-extrabold text-blue-700 shadow-xs">
                ⏱️ {{ secondsLeft }} detik lagi
              </span>
              <span class="px-2.5 py-1 bg-blue-600 text-white rounded-lg text-xs font-mono font-extrabold shadow-xs">
                {{ provisioningPercent }}%
              </span>
            </div>
          </div>

          <!-- Progress Bar with Animation -->
          <div class="w-full bg-blue-100 rounded-full h-2.5 overflow-hidden shadow-inner">
            <div
              class="bg-blue-600 h-2.5 rounded-full transition-all duration-1000 ease-linear bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600"
              :style="{ width: `${provisioningPercent}%` }"
            ></div>
          </div>

          <p class="text-[11px] text-slate-500 mt-2.5 flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[15px] text-blue-500">info</span>
            <span>Instans akan aktif secara otomatis setelah 1 menit (60 detik) provisioning tanpa perlu me-refresh halaman.</span>
          </p>
        </div>

        <!-- ACTION BOX VARIANT C: Node Aktif & SLA Live (>= 60 Detik) -->
        <div
          v-else-if="isPaid && isProvisioned"
          class="mt-6 p-4 sm:p-5 rounded-xl bg-gradient-to-br from-emerald-50 via-teal-50/50 to-emerald-50/80 border border-emerald-300"
        >
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-200/80">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                <span class="material-symbols-outlined text-[20px]">check_circle</span>
              </div>
              <div>
                <h4 class="text-xs sm:text-sm font-extrabold text-emerald-950 flex items-center gap-1.5">
                  <span>Instans Server Telah Aktif & Operasional Penuh</span>
                  <span class="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                </h4>
                <p class="text-[11px] text-emerald-700">
                  Provisioning selesai secara otomatis. Garansi SLA 99.9% Uptime kini aktif dan termonitor di data center.
                </p>
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-2">
              <button
                @click="showTerminalModal = true"
                type="button"
                class="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-mono font-bold rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <span class="material-symbols-outlined text-[16px] text-emerald-400">terminal</span>
                <span>Buka Web Console</span>
              </button>
              <button
                @click="downloadCredentials"
                type="button"
                class="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <span class="material-symbols-outlined text-[16px]">key</span>
                <span>Unduh Kredensial SSH</span>
              </button>
            </div>
          </div>

          <!-- Node Metrics Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 text-xs">
            <div class="bg-white/80 p-2.5 rounded-lg border border-emerald-200">
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Public IPv4 Node</span>
              <div class="flex items-center justify-between gap-1 mt-0.5">
                <span class="font-mono font-extrabold text-slate-900 select-all">{{ serverIp }}</span>
                <button
                  @click="copyServerIp"
                  type="button"
                  class="text-slate-400 hover:text-emerald-700 cursor-pointer"
                  title="Salin Command SSH"
                >
                  <span class="material-symbols-outlined text-[15px]">{{ copiedIp ? 'check' : 'content_copy' }}</span>
                </button>
              </div>
            </div>

            <div class="bg-white/80 p-2.5 rounded-lg border border-emerald-200">
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Akses Port SSH</span>
              <span class="font-mono font-extrabold text-slate-900 block mt-0.5">Port 22 (TLS 1.3)</span>
            </div>

            <div class="bg-white/80 p-2.5 rounded-lg border border-emerald-200">
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Monitoring Status</span>
              <span class="font-extrabold text-emerald-700 flex items-center gap-1 mt-0.5">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>99.98% Healthy</span>
              </span>
            </div>

            <div class="bg-white/80 p-2.5 rounded-lg border border-emerald-200">
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Lokasi Fasilitas DC</span>
              <span class="font-medium text-slate-800 block mt-0.5 truncate" title="Tier-3 Cyber DC JKT-01">Tier-3 Cyber JKT-01</span>
            </div>
          </div>
        </div>

      </div>

      <!-- Order Details Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <!-- Left Column: Products List (2 cols) -->
        <div class="md:col-span-2 bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm space-y-4">
          <h3 class="font-bold text-slate-900 text-sm flex items-center gap-1.5">
            <span class="material-symbols-outlined text-blue-600 text-[18px]">dns</span>
            <span>Rincian Komponen Infrastruktur</span>
          </h3>

          <div class="divide-y divide-slate-100">
            <div
              v-for="item in order.items"
              :key="item.id"
              class="py-3.5 flex items-center gap-3.5"
            >
              <div class="w-14 h-14 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center p-1 shrink-0 overflow-hidden">
                <img
                  v-if="item.image_url"
                  :src="item.image_url"
                  :alt="item.model"
                  class="w-full h-full object-contain"
                />
                <span v-else class="material-symbols-outlined text-slate-300 text-[24px]">dns</span>
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="font-bold text-xs text-slate-900 truncate">
                  {{ item.brand }} {{ item.model }}
                </h4>
                <p v-if="item.sku" class="text-[11px] font-mono text-slate-400">
                  SKU: {{ item.sku }}
                </p>
                <div class="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                  <span>{{ item.quantity }} unit/instans x {{ formatIDR(item.unit_price) }}</span>
                </div>
              </div>
              <div class="text-right font-mono font-bold text-xs text-slate-900 shrink-0">
                {{ formatIDR(item.subtotal) }}
              </div>
            </div>
          </div>

          <div class="pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
            <span class="font-bold text-slate-500">Total Nilai Pengadaan</span>
            <span class="font-mono font-extrabold text-blue-600 text-base">{{ formatIDR(order.total_amount) }}</span>
          </div>
        </div>

        <!-- Right Column: Shipping & Action (1 col) -->
        <div class="space-y-4">
          <div class="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-3 text-xs">
            <h3 class="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <span class="material-symbols-outlined text-slate-400 text-[16px]">business</span>
              <span>Entitas Perusahaan & Alamat Operasional</span>
            </h3>

            <div>
              <p class="font-bold text-slate-800">{{ order.customer_name }}</p>
              <p class="text-slate-500 font-mono mt-0.5">{{ order.customer_phone }}</p>
              <p class="text-slate-500 mt-0.5">{{ order.customer_email }}</p>
              <p class="text-slate-600 mt-2 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                {{ order.shipping_address }}
              </p>
            </div>
          </div>

          <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
            <router-link
              :to="{
                path: `/pesanan/${order.order_number}`,
                query: { from: route.query.from || authStore.user?.role || 'tracking' }
              }"
              class="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              <span class="material-symbols-outlined text-[16px]">receipt</span>
              <span>Buka Dokumen Kontrak & SLA Digital</span>
            </router-link>

            <button
              @click="resetSearch"
              type="button"
              class="w-full py-2 px-3 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span class="material-symbols-outlined text-[16px]">restart_alt</span>
              <span>Cari Pengadaan Lain</span>
            </button>
          </div>
        </div>

      </div>

    </div>

    <!-- Web Console Terminal Modal -->
    <div
      v-if="showTerminalModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4"
    >
      <div class="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden font-mono flex flex-col text-xs text-slate-200">
        <!-- Terminal Titlebar -->
        <div class="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
            <span class="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
            <span class="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
            <span class="text-slate-400 font-bold ml-2 text-[11px]">
              smartinfra@node-{{ order?.order_number }}:~ (SSH Console)
            </span>
          </div>
          <button
            @click="showTerminalModal = false"
            type="button"
            class="text-slate-400 hover:text-white cursor-pointer"
          >
            <span class="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <!-- Terminal Output -->
        <div class="p-4 sm:p-5 space-y-3 bg-slate-900 text-[11px] leading-relaxed max-h-[70vh] overflow-y-auto">
          <p class="text-emerald-400 font-semibold">
            Connecting to {{ serverIp }}:22 via TLS encrypted session... CONNECTED.
          </p>
          <div class="text-slate-400 border-l-2 border-emerald-500 pl-3 py-1 space-y-0.5">
            <p><span class="text-slate-300 font-bold">OS:</span> Ubuntu 24.04 LTS (Noble Numbat) x86_64</p>
            <p><span class="text-slate-300 font-bold">Host:</span> SmartInfra Compute Node (JKT-DC01-Rack4)</p>
            <p><span class="text-slate-300 font-bold">Kernel:</span> 6.8.0-31-generic</p>
            <p><span class="text-slate-300 font-bold">Status:</span> Production Ready | SLA Active (99.98% healthy)</p>
            <p><span class="text-slate-300 font-bold">Public IP:</span> {{ serverIp }} (Direct Gateway)</p>
          </div>

          <div class="pt-2 text-slate-300">
            <p class="text-emerald-400">root@smartinfra-srv:~# <span class="text-white">systemctl status smartinfra-agent</span></p>
            <p class="text-emerald-300">● smartinfra-agent.service - SmartInfra Real-Time Telemetry & SLA Monitor</p>
            <p class="text-slate-400">&nbsp;&nbsp;Loaded: loaded (/lib/systemd/system/smartinfra-agent.service; enabled)</p>
            <p class="text-slate-400">&nbsp;&nbsp;Active: <span class="text-emerald-400 font-bold">active (running)</span> since provision complete</p>
            <p class="text-slate-400">&nbsp;&nbsp;Tasks: 4 (limit: 4915)</p>
            <p class="text-slate-400">&nbsp;&nbsp;Memory: 42.1M (peak: 48.0M)</p>
          </div>

          <div class="pt-2 text-slate-300">
            <p class="text-emerald-400">root@smartinfra-srv:~# <span class="text-white">ping -c 2 1.1.1.1</span></p>
            <p class="text-slate-400">64 bytes from 1.1.1.1: icmp_seq=1 ttl=59 time=1.04 ms</p>
            <p class="text-slate-400">64 bytes from 1.1.1.1: icmp_seq=2 ttl=59 time=1.02 ms</p>
            <p class="text-slate-400">--- 1.1.1.1 ping statistics: 2 packets transmitted, 2 received, 0% packet loss ---</p>
          </div>

          <div class="pt-2 flex items-center gap-1.5 text-slate-200">
            <span class="text-emerald-400">root@smartinfra-srv:~#</span>
            <span class="inline-block w-2 h-4 bg-emerald-400 animate-pulse"></span>
          </div>
        </div>

        <!-- Terminal Footer -->
        <div class="px-4 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>Session encrypted (Ed25519)</span>
          <button
            @click="showTerminalModal = false"
            type="button"
            class="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs transition-colors cursor-pointer"
          >
            Tutup Terminal
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

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
  if (from === 'invoice') {
    return {
      to: `/pesanan/${order.value?.order_number || inputOrderNumber.value}`,
      label: 'Kembali ke Dokumen Faktur'
    };
  }
  return null;
});

function handleBack() {
  if (window.history.state?.back) {
    router.back();
  } else if (backDestination.value) {
    router.push(backDestination.value.to);
  } else {
    router.push('/katalog');
  }
}

const inputOrderNumber = ref('');
const searchedQuery = ref('');
const searched = ref(false);
const loading = ref(false);
const order = ref(null);
const simulating = ref(false);
const copied = ref(false);
const copiedIp = ref(false);
const showTerminalModal = ref(false);
const recentOrders = ref([]);

// 1 Menit (60 Detik) Provisioning Timer Logic
const PROVISIONING_DURATION_SEC = 60;
const currentTime = ref(Date.now());
let timerInterval = null;

const isPaid = computed(() => {
  return order.value && order.value.payment_status === 'paid';
});

const paidTimestamp = computed(() => {
  if (!order.value || !isPaid.value) return 0;
  // Gunakan paid_at jika ada, fallback ke created_at
  const raw = order.value.paid_at || order.value.created_at;
  return raw ? new Date(raw).getTime() : 0;
});

const elapsedSeconds = computed(() => {
  if (!isPaid.value || !paidTimestamp.value) return 0;
  return Math.max(0, Math.floor((currentTime.value - paidTimestamp.value) / 1000));
});

const isProvisioned = computed(() => {
  if (!isPaid.value) return false;
  return elapsedSeconds.value >= PROVISIONING_DURATION_SEC;
});

const secondsLeft = computed(() => {
  return Math.max(0, PROVISIONING_DURATION_SEC - elapsedSeconds.value);
});

const provisioningPercent = computed(() => {
  if (!isPaid.value) return 0;
  if (isProvisioned.value) return 100;
  return Math.min(99, Math.max(8, Math.round((elapsedSeconds.value / PROVISIONING_DURATION_SEC) * 100)));
});

// Dynamic stepper bar width (0% -> Step 1 -> Step 2 -> Step 3 -> Step 4)
const stepperProgressWidth = computed(() => {
  if (!isPaid.value) return '33.3%';
  if (isProvisioned.value) return '100%';
  // Berjalan dinamis dari Step 2 (33.3%) menuju Step 4 (100%)
  const progressRatio = elapsedSeconds.value / PROVISIONING_DURATION_SEC;
  const width = 33.3 + progressRatio * 66.7;
  return `${Math.min(100, Math.max(33.3, width)).toFixed(1)}%`;
});

const currentStageMessage = computed(() => {
  const sec = elapsedSeconds.value;
  if (sec < 12) return 'Alokasi blok IP publik & subnet VLAN data center...';
  if (sec < 25) return 'Mounting disk NVMe RAID & deployment base OS image...';
  if (sec < 42) return 'Konfigurasi firewall security groups & port out-of-band...';
  if (sec < 55) return 'Verifikasi integritas hardware & handshake telemetry SLA...';
  return 'Finalisasi enkripsi session & pengaktifan instance production...';
});

const serverIp = computed(() => {
  if (!order.value) return '103.152.88.24';
  const seed = (order.value.id || 1) * 37 + 10;
  const octet3 = (seed % 100) + 12;
  const octet4 = (seed % 230) + 7;
  return `103.${octet3}.88.${octet4}`;
});

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

function loadRecentOrders() {
  try {
    const raw = localStorage.getItem('smartinfra_recent_orders') || localStorage.getItem('smartlap_recent_orders');
    if (raw) {
      recentOrders.value = JSON.parse(raw);
    }
  } catch (e) {
    recentOrders.value = [];
  }
}

async function fetchOrderDetails(orderNum) {
  const cleanNum = (orderNum || '').trim().toUpperCase();
  if (!cleanNum) return;

  loading.value = true;
  searched.value = true;
  searchedQuery.value = cleanNum;
  order.value = null;

  try {
    const res = await axios.get(`/api/orders/${cleanNum}`);
    if (res.data.success) {
      order.value = res.data.data;
      saveToRecentOrders(res.data.data);
    }
  } catch (err) {
    console.error('Error fetching order details:', err);
    order.value = null;
  } finally {
    loading.value = false;
  }
}

function saveToRecentOrders(ord) {
  try {
    const existing = JSON.parse(localStorage.getItem('smartinfra_recent_orders') || localStorage.getItem('smartlap_recent_orders') || '[]');
    const updated = [
      {
        order_number: ord.order_number,
        customer_name: ord.customer_name,
        total_amount: ord.total_amount,
        created_at: ord.created_at
      },
      ...existing.filter(o => o.order_number !== ord.order_number)
    ].slice(0, 8);
    localStorage.setItem('smartinfra_recent_orders', JSON.stringify(updated));
    localStorage.setItem('smartlap_recent_orders', JSON.stringify(updated));
    recentOrders.value = updated;
  } catch (e) {
    console.error(e);
  }
}

function searchOrder() {
  if (!inputOrderNumber.value.trim()) return;
  router.replace({ query: { q: inputOrderNumber.value.trim().toUpperCase() } });
  fetchOrderDetails(inputOrderNumber.value);
}

function quickSelectOrder(orderNum) {
  inputOrderNumber.value = orderNum;
  searchOrder();
}

function resetSearch() {
  order.value = null;
  searched.value = false;
  inputOrderNumber.value = '';
  router.replace({ query: {} });
}

function copyPayCode(code) {
  if (!code) return;
  navigator.clipboard.writeText(code);
  copied.value = true;
  setTimeout(() => {
    copied.value = false;
  }, 2000);
}

function copyServerIp() {
  navigator.clipboard.writeText(`ssh root@${serverIp.value} -p 22`);
  copiedIp.value = true;
  setTimeout(() => {
    copiedIp.value = false;
  }, 2000);
}

function downloadCredentials() {
  if (!order.value) return;
  const content = `======================================================
SMARTINFRA CLOUD & BARE-METAL INSTANCE CREDENTIALS
======================================================
Nomor Pesanan : ${order.value.order_number}
Status Node   : AKTIF / PRODUCTION READY (SLA 99.9%)
Public IPv4   : ${serverIp.value}
SSH Port      : 22
Default User  : root / infra-admin
IPMI Console  : https://ipmi.${serverIp.value.replace(/\./g, '-')}.smartinfra.id
Aktivasi Pada : ${formatDate(order.value.paid_at || order.value.created_at)}
Data Center   : Tier-3 Equinix / Cyber DC Jakarta (JKT-DC01)
======================================================
Petunjuk Akses SSH Terminal:
$ ssh -i id_smartinfra.pem root@${serverIp.value} -p 22
======================================================`;
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `kredensial-${order.value.order_number}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

async function simulatePaymentNow() {
  if (!order.value) return;
  simulating.value = true;
  try {
    const res = await axios.post(`/api/orders/${order.value.order_number}/simulate-pay`);
    if (res.data.success) {
      alert('Simulasi pembayaran berhasil! Status pesanan Anda kini LUNAS. Sistem otomatisasi provisioning 1 menit kini dimulai.');
      await fetchOrderDetails(order.value.order_number);
    }
  } catch (err) {
    alert(err.response?.data?.message || 'Gagal memproses simulasi pembayaran');
  } finally {
    simulating.value = false;
  }
}

onMounted(() => {
  loadRecentOrders();
  if (route.query.q) {
    inputOrderNumber.value = route.query.q;
    fetchOrderDetails(route.query.q);
  }

  // Timer interval setiap 1 detik untuk live tracking provisioning
  timerInterval = setInterval(() => {
    currentTime.value = Date.now();
  }, 1000);
});

onUnmounted(() => {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
});
</script>
