<template>
  <div class="bg-slate-50 text-slate-900 antialiased min-h-screen flex flex-col font-sans selection:bg-blue-600 selection:text-white">

    <!-- ╔══════════════════════════════════════════════════════╗ -->
    <!-- ║  STICKY HEADER (sama persis dengan Admin Panel)      ║ -->
    <!-- ╚══════════════════════════════════════════════════════╝ -->
    <header class="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div class="max-w-[1380px] w-full mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <!-- Brand -->
        <div class="flex items-center gap-6">
          <router-link class="flex items-center gap-2 sm:gap-2.5" to="/sales">
            <div class="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-sm">
              <span class="material-symbols-outlined text-white" style="font-size:20px">dns</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="text-sm sm:text-base font-semibold tracking-tight text-slate-900">SmartInfra</span>
              <span class="bg-blue-600 text-white text-[10px] sm:text-[11px] font-mono px-1.5 py-0.5 rounded font-bold">SOLUTIONS PORTAL</span>
            </div>
          </router-link>
        </div>

        <!-- Right Actions -->
        <div class="flex items-center gap-2 sm:gap-3">
          <router-link
            to="/"
            class="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all"
            title="Buka Portal Publik"
          >
            <span class="material-symbols-outlined text-slate-400" style="font-size:16px">storefront</span>
            <span class="hidden sm:inline">Buka Portal Publik</span>
          </router-link>
          <div class="h-5 w-px bg-slate-200 mx-0.5 sm:mx-1"></div>
          <div class="flex items-center gap-2 text-xs">
            <div class="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center">
              {{ authStore.user?.name?.charAt(0) || 'S' }}
            </div>
            <span class="hidden sm:inline font-medium text-slate-800">{{ authStore.user?.name }}</span>
          </div>
          <button
            @click="handleLogout"
            title="Keluar"
            class="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
          >
            <span class="material-symbols-outlined" style="font-size:16px">logout</span>
          </button>
        </div>
      </div>
    </header>

    <!-- ╔══════════════════════════════════════════════════════╗ -->
    <!-- ║  TAB NAVIGATION (sama persis dengan Admin Panel)     ║ -->
    <!-- ╚══════════════════════════════════════════════════════╝ -->
    <div class="bg-white border-b border-slate-200">
      <div class="max-w-[1380px] mx-auto px-4 sm:px-6 flex items-center gap-4 sm:gap-8 text-xs font-semibold overflow-x-auto no-scrollbar">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :id="`tab-btn-${tab.id}`"
          class="py-3.5 border-b-2 flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
          :class="activeTab === tab.id
            ? 'border-blue-600 text-blue-600 font-bold'
            : 'border-transparent text-slate-600 hover:text-slate-900 font-medium'"
        >
          <span class="material-symbols-outlined" style="font-size:17px">{{ tab.icon }}</span>
          <span>{{ tab.label }}</span>
          <span v-if="tab.id === 'orders' && pendingCount" class="px-1.5 rounded-full bg-amber-100 text-amber-800 font-mono text-[10px]">
            {{ pendingCount }}
          </span>
        </button>
      </div>
    </div>

    <!-- ╔══════════════════════════════════════════════════════╗ -->
    <!-- ║  MAIN CANVAS                                         ║ -->
    <!-- ╚══════════════════════════════════════════════════════╝ -->
    <main class="flex-grow max-w-[1380px] w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">

      <!-- ═══════════════════════════════════════════════ -->
      <!-- TAB: DASHBOARD KPI                              -->
      <!-- ═══════════════════════════════════════════════ -->
      <div v-if="activeTab === 'dashboard'" class="space-y-8">

        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-2">
              <span class="material-symbols-outlined text-[15px]">trending_up</span>
              <span>Dashboard Kinerja Konsultasi & Pengadaan B2B</span>
            </div>
            <h1 class="text-2xl font-black tracking-tight text-slate-900">Solutions Architect & RFQ Dashboard</h1>
            <p class="text-xs sm:text-sm text-slate-600 mt-1">
              Monitor pipeline RFQ, rasio pembiayaan TCO OpEx/CapEx, dan aktivasi SLA infrastruktur secara real-time.
            </p>
          </div>
          <div class="flex flex-wrap items-center gap-2.5">
            <button
              @click="activeTab = 'calculator'"
              class="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-blue-500/20 transition-all cursor-pointer"
            >
              <span class="material-symbols-outlined text-[16px]">calculate</span>
              <span>Konsultasi Sizing & Pembiayaan</span>
            </button>
            <button
              @click="loadData"
              :disabled="refreshing"
              class="px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <span class="material-symbols-outlined text-[16px]" :class="refreshing ? 'animate-spin' : ''">refresh</span>
              <span>Refresh Data</span>
            </button>
          </div>
        </div>

        <!-- 4 KPI Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

          <!-- KPI 1: Rasio Kredit -->
          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-emerald-500/50 transition-all">
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-bold text-slate-600 uppercase tracking-wider">Rasio Transaksi Kredit</span>
              <div class="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
                <span class="material-symbols-outlined text-[20px]">percent</span>
              </div>
            </div>
            <p class="text-2xl font-black text-slate-900 font-mono">{{ metrics.credit_ratio_percent || 0 }}<span class="text-base text-slate-400">%</span></p>
            <div class="mt-3 flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-100">
              <span class="font-medium">{{ metrics.credit_orders || 0 }} / {{ metrics.total_orders || 0 }} order</span>
              <span :class="(metrics.credit_ratio_percent || 0) >= 65 ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'">
                Target &gt;65%
              </span>
            </div>
          </div>

          <!-- KPI 2: Antrian Verifikasi -->
          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-amber-500/50 transition-all">
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-bold text-slate-600 uppercase tracking-wider">Antrian Verifikasi</span>
              <div class="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
                <span class="material-symbols-outlined text-[20px]">pending_actions</span>
              </div>
            </div>
            <p class="text-2xl font-black text-slate-900 font-mono">{{ metrics.pending_verification || 0 }}</p>
            <div class="mt-3 flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-100">
              <span class="font-medium">Butuh tindak lanjut</span>
              <span class="text-amber-700 font-bold flex items-center gap-0.5">
                <span class="material-symbols-outlined text-[14px]">schedule</span>
                Pending
              </span>
            </div>
          </div>

          <!-- KPI 3: Volume Pembiayaan -->
          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-blue-500/50 transition-all">
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-bold text-slate-600 uppercase tracking-wider">Volume Pembiayaan</span>
              <div class="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
                <span class="material-symbols-outlined text-[20px]">account_balance</span>
              </div>
            </div>
            <p class="text-xl font-black text-slate-900 font-mono">{{ formatIDR(metrics.credit_revenue || 0) }}</p>
            <div class="mt-3 flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-100">
              <span class="font-medium">Total omzet jalur kredit</span>
              <span class="text-blue-700 font-bold">Kredit</span>
            </div>
          </div>

          <!-- KPI 4: Estimasi Insentif -->
          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-violet-500/50 transition-all">
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-bold text-slate-600 uppercase tracking-wider">Estimasi Insentif</span>
              <div class="w-9 h-9 rounded-xl bg-violet-50 border border-violet-200 text-violet-600 flex items-center justify-center">
                <span class="material-symbols-outlined text-[20px]">savings</span>
              </div>
            </div>
            <p class="text-xl font-black text-slate-900 font-mono">{{ formatIDR(metrics.estimated_incentive || 0) }}</p>
            <div class="mt-3 flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-100">
              <span class="font-medium">~1.5% dari volume kredit</span>
              <span class="text-violet-700 font-bold flex items-center gap-0.5">
                <span class="material-symbols-outlined text-[14px]">check_circle</span>
                Estimasi
              </span>
            </div>
          </div>
        </div>

        <!-- Low Stock Alert -->
        <div v-if="metrics.low_stock_alerts?.length" class="bg-rose-50 border border-rose-200 rounded-2xl p-5">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-7 h-7 rounded-lg bg-rose-100 border border-rose-200 text-rose-600 flex items-center justify-center">
              <span class="material-symbols-outlined text-[16px]">warning</span>
            </div>
            <h3 class="font-bold text-rose-800 text-sm">Peringatan Stok Kritis — Kapasitas Node Tersisa &lt;3 Unit</h3>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-5 gap-2">
            <div
              v-for="item in metrics.low_stock_alerts"
              :key="item.id"
              class="bg-white border border-rose-200 rounded-xl p-3"
            >
              <p class="text-xs font-bold text-slate-800 truncate">{{ item.brand }} {{ item.model }}</p>
              <p class="text-[10px] text-rose-600 font-bold mt-0.5">{{ item.stock }} unit tersisa</p>
            </div>
          </div>
        </div>

        <!-- Quick Action Cards -->
        <div>
          <h2 class="text-sm font-bold text-slate-700 mb-4">Akses Cepat</h2>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button @click="activeTab = 'calculator'"
              class="flex items-center gap-4 p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-blue-300 hover:shadow-md transition-all text-left group"
            >
              <div class="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0">
                <span class="material-symbols-outlined text-[22px]">calculate</span>
              </div>
              <div>
                <p class="font-bold text-slate-900 text-sm">Konsultasi Sizing & Pembiayaan</p>
                <p class="text-xs text-slate-500 mt-0.5">Diagnosis kebutuhan klien & simulasi pembiayaan</p>
              </div>
            </button>
            <button @click="activeTab = 'orders'"
              class="flex items-center gap-4 p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-amber-300 hover:shadow-md transition-all text-left group"
            >
              <div class="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-all shrink-0">
                <span class="material-symbols-outlined text-[22px]">receipt_long</span>
              </div>
              <div>
                <p class="font-bold text-slate-900 text-sm">Pesanan & Kontrak Masuk</p>
                <p class="text-xs text-slate-500 mt-0.5">Verifikasi & konfirmasi pembayaran transaksi</p>
              </div>
            </button>
            <button @click="activeTab = 'stock'"
              class="flex items-center gap-4 p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-emerald-300 hover:shadow-md transition-all text-left group"
            >
              <div class="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all shrink-0">
                <span class="material-symbols-outlined text-[22px]">inventory_2</span>
              </div>
              <div>
                <p class="font-bold text-slate-900 text-sm">Katalog & Ketersediaan Node</p>
                <p class="text-xs text-slate-500 mt-0.5">Pantau kapasitas stok server real-time</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════════ -->
      <!-- TAB: KALKULATOR KREDIT                          -->
      <!-- ═══════════════════════════════════════════════ -->
      <div v-if="activeTab === 'calculator'" class="space-y-6">
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-2">
              <span class="material-symbols-outlined text-[15px]">calculate</span>
              <span>Solutions Sizing & Financing Consultation Engine</span>
            </div>
            <h1 class="text-2xl font-black tracking-tight text-slate-900">Konsultasi Sizing Arsitektur & Pembiayaan</h1>
            <p class="text-xs sm:text-sm text-slate-600 mt-1">Diagnosis beban kerja klien berbasis SPK SAW dan simulasikan komparasi 10 provider pembiayaan B2B.</p>
          </div>
        </div>

        <!-- ═══════════════════════════════════════════════════════════ -->
        <!-- CONSULTATIVE WORKLOAD SIZING & SAW RECOMMENDATION ENGINE   -->
        <!-- ═══════════════════════════════════════════════════════════ -->
        <div class="bg-white rounded-2xl p-5 sm:p-6 text-slate-900 shadow-sm border border-slate-200 space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold mb-1.5">
                <span class="material-symbols-outlined text-[15px]">psychology</span>
                <span>Konsultasi Kebutuhan Klien Berbasis Algoritma SPK SAW</span>
              </div>
              <h2 class="text-lg sm:text-xl font-black text-slate-900">Diagnosis Beban Kerja & Rekomendasi Sizing</h2>
              <p class="text-xs text-slate-500 mt-0.5">
                Tentukan profil kebutuhan dan batasan anggaran klien untuk kalkulasi matematis node terbaik sebelum komparasi pembiayaan.
              </p>
            </div>
            
            <button
              @click="runSizingRecommendation"
              :disabled="sizingLoading"
              type="button"
              class="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto disabled:opacity-50 shrink-0"
            >
              <span v-if="sizingLoading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span v-else class="material-symbols-outlined text-[17px]">auto_fix_high</span>
              <span>{{ sizingHasRun ? 'Hitung Ulang Sizing' : 'Analisis Sizing SAW' }}</span>
            </button>
          </div>

          <!-- 1. Workload Profiles Selection -->
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              1. Pilih Karakteristik Beban Kerja Klien (Workload Profile)
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                v-for="p in sizingProfiles"
                :key="p.id"
                @click="selectedProfileId = p.id; runSizingRecommendation()"
                type="button"
                :class="[
                  'p-4 rounded-xl text-left border transition-all cursor-pointer relative overflow-hidden',
                  selectedProfileId === p.id
                    ? 'bg-blue-50/80 border-blue-500 text-slate-900 ring-2 ring-blue-100 shadow-xs'
                    : 'bg-slate-50/60 border-slate-200 text-slate-600 hover:bg-slate-100/80 hover:border-slate-300'
                ]"
              >
                <div class="flex items-center gap-2.5 mb-1.5">
                  <div :class="selectedProfileId === p.id ? 'w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0' : 'w-8 h-8 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center shrink-0'">
                    <span class="material-symbols-outlined text-[18px]">{{ p.icon }}</span>
                  </div>
                  <h4 class="font-bold text-xs leading-tight" :class="selectedProfileId === p.id ? 'text-blue-900' : 'text-slate-800'">{{ p.name }}</h4>
                </div>
                <p class="text-[11px] leading-relaxed" :class="selectedProfileId === p.id ? 'text-blue-800/80' : 'text-slate-500'">{{ p.desc }}</p>
              </button>
            </div>
          </div>

          <!-- 2. Parameter Teknis & Budget Cap -->
          <div>
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                2. Batas Anggaran & Parameter Teknis Klien
              </label>
              <!-- Target Segmen Presets -->
              <div class="flex flex-wrap items-center gap-1.5">
                <span class="text-[10px] text-slate-400 font-medium mr-0.5">Segmen Target:</span>
                <button
                  v-for="preset in budgetPresets"
                  :key="preset.value"
                  type="button"
                  @click="setBudgetPreset(preset.value)"
                  :class="[
                    'px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer',
                    sizingBudgetCap === preset.value
                      ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  ]"
                >
                  {{ preset.label }}
                </button>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <!-- Budget Cap -->
              <div class="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200">
                <div class="flex justify-between items-center text-xs mb-1.5">
                  <span class="text-slate-600 font-medium">Batas Anggaran Klien:</span>
                  <span class="font-mono font-bold text-blue-700">
                    {{ sizingBudgetCap > 0 ? formatIDR(sizingBudgetCap) : 'Semua Anggaran (Tanpa Batas)' }}
                  </span>
                </div>
                <input
                  type="range"
                  v-model.number="sizingBudgetCap"
                  min="0"
                  max="100000000"
                  step="50000"
                  @change="runSizingRecommendation"
                  class="w-full accent-blue-600 cursor-pointer"
                />
                <div class="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                  <span>Rp 0</span>
                  <span>Rp 25 Jt</span>
                  <span>Rp 100 Jt+</span>
                </div>
              </div>

              <!-- Min RAM -->
              <div class="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200 flex flex-col justify-between">
                <span class="text-slate-600 text-xs font-medium block mb-1.5">Target Min. RAM:</span>
                <select
                  v-model.number="sizingMinRam"
                  @change="runSizingRecommendation"
                  class="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 outline-none font-bold focus:ring-2 focus:ring-blue-500"
                >
                  <option :value="1">Semua Kapasitas RAM (Mulai 1 GB)</option>
                  <option :value="2">Minimal 2 GB RAM</option>
                  <option :value="4">Minimal 4 GB RAM</option>
                  <option :value="8">Minimal 8 GB RAM</option>
                  <option :value="16">Minimal 16 GB ECC</option>
                  <option :value="32">Minimal 32 GB ECC</option>
                  <option :value="64">Minimal 64 GB ECC</option>
                  <option :value="128">Minimal 128 GB ECC+</option>
                </select>
              </div>

              <!-- Category -->
              <div class="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200 flex flex-col justify-between">
                <span class="text-slate-600 text-xs font-medium block mb-1.5">Kategori Infrastruktur:</span>
                <select
                  v-model="sizingCategory"
                  @change="runSizingRecommendation"
                  class="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 outline-none font-bold focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Semua (Cloud VM & Bare Metal GPU)</option>
                  <option value="cloud_instance">Cloud Instance / Virtual Machine</option>
                  <option value="gpu_rig">Bare Metal GPU AI Server Rig</option>
                </select>
              </div>
            </div>
          </div>

          <!-- 3. Top 3 Recommendations Result Cards -->
          <div v-if="sizingResults.length > 0" class="pt-2">
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <span class="material-symbols-outlined text-amber-500 text-[18px]">workspace_premium</span>
                <span>Top 3 Rekomendasi Node Terbaik Berdasarkan Analisis SAW</span>
              </span>
              <span class="text-[11px] text-blue-600 font-mono hidden sm:inline">
                Ranking diurutkan dari skor preferensi Vi tertinggi
              </span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div
                v-for="(rec, index) in sizingResults"
                :key="rec.id"
                class="bg-slate-50/60 rounded-xl p-4 border transition-all flex flex-col justify-between group hover:border-blue-400 hover:bg-white shadow-xs"
                :class="index === 0 ? 'border-amber-300 ring-1 ring-amber-200 bg-amber-50/20' : 'border-slate-200'"
              >
                <div>
                  <div class="flex items-center justify-between gap-2 mb-2">
                    <span
                      class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1"
                      :class="
                        index === 0
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : index === 1
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      "
                    >
                      <span>{{ index === 0 ? '🥇 Rekomendasi Utama' : index === 1 ? '🥈 Hemat Biaya (OpEx)' : '🥉 Performa Ekstrem' }}</span>
                    </span>
                    <span class="text-xs font-mono font-bold text-amber-700">
                      {{ (rec.preferenceScore * 100).toFixed(1) }}% Match
                    </span>
                  </div>

                  <h4 class="font-bold text-xs text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {{ rec.brand }} {{ rec.model }}
                  </h4>

                  <!-- Hardware Specs Badges -->
                  <div class="mt-2.5 space-y-1 text-[11px] text-slate-600 font-mono bg-white p-2.5 rounded-lg border border-slate-200/80">
                    <p class="truncate"><span class="text-slate-400 font-medium">CPU:</span> {{ rec.processor_name }}</p>
                    <p class="truncate"><span class="text-slate-400 font-medium">RAM:</span> {{ rec.ram_gb }}GB ECC • NVMe {{ rec.storage_desc || rec.storage_gb + 'GB' }}</p>
                    <p v-if="rec.gpu_name && !rec.gpu_name.includes('None')" class="truncate text-emerald-600 font-bold"><span class="text-slate-400 font-normal">GPU:</span> {{ rec.gpu_name }}</p>
                    <p class="text-blue-600 font-bold"><span class="text-slate-400 font-normal">SLA:</span> {{ rec.battery_hours || 99.9 }}% Uptime</p>
                  </div>
                </div>

                <div class="mt-3.5 pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
                  <div>
                    <span class="text-[10px] text-slate-400 uppercase font-mono block">Tarif Kontrak:</span>
                    <span class="font-mono font-extrabold text-sm text-slate-900">{{ formatIDR(rec.price) }}</span>
                  </div>
                  <button
                    @click="adoptSizingNode(rec)"
                    type="button"
                    class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer shrink-0"
                    title="Adopsi spesifikasi ini ke formulir pembiayaan"
                  >
                    <span>Pilih & Hitung</span>
                    <span class="material-symbols-outlined text-[15px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="grid lg:grid-cols-5 gap-6">
          <!-- Form Panel -->
          <div class="lg:col-span-2 space-y-5">
            <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
              <!-- Cari Infrastruktur / Node -->
              <div>
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Cari & Pilih Node Infrastruktur dari Katalog</label>
                <input
                  id="calc-search-laptop"
                  v-model="calcSearch"
                  @input="searchLaptops"
                  type="text"
                  placeholder="Ketik nama instans, provider, atau SKU..."
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                />
                <div v-if="laptopSearchResults.length && !calcSelectedLaptop" class="mt-2 bg-white rounded-xl border border-slate-200 shadow-md max-h-48 overflow-y-auto">
                  <button
                    v-for="l in laptopSearchResults"
                    :key="l.id"
                    @click="selectLaptopForCalc(l)"
                    class="w-full text-left px-4 py-3 hover:bg-slate-50 text-sm transition-colors border-b border-slate-100 last:border-0"
                  >
                    <p class="font-semibold text-slate-800">{{ l.brand }} {{ l.model }}</p>
                    <p class="text-xs text-emerald-600 font-mono font-bold mt-0.5">{{ formatIDR(l.price) }}</p>
                  </button>
                </div>
                <!-- Selected Laptop Badge -->
                <div v-if="calcSelectedLaptop" class="mt-2 flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                  <div class="w-9 h-9 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0">
                    <span class="material-symbols-outlined text-emerald-600 text-[18px]">dns</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-xs font-bold text-slate-800 truncate">{{ calcSelectedLaptop.brand }} {{ calcSelectedLaptop.model }}</p>
                    <p class="text-[10px] text-emerald-600 font-mono font-bold">{{ formatIDR(calcSelectedLaptop.price) }}</p>
                  </div>
                  <button @click="calcSelectedLaptop = null; calcSearch = ''" class="text-slate-400 hover:text-rose-500 transition-colors">
                    <span class="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>
              </div>

              <!-- Harga Manual -->
              <div>
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nilai Kontrak / Tarif (Rp)</label>
                <input
                  id="calc-price"
                  v-model.number="calcPrice"
                  type="number"
                  min="0"
                  placeholder="Contoh: 12000000"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-mono"
                />
              </div>

              <!-- DP -->
              <div>
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Uang Muka / DP — <span class="text-emerald-600">{{ calcDpPercent }}%</span> dari harga
                </label>
                <input
                  id="calc-dp"
                  v-model.number="calcDp"
                  type="number"
                  min="0"
                  :max="calcPrice"
                  placeholder="0 (tanpa DP)"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-mono"
                />
                <input type="range" v-model.number="calcDp" min="0" :max="calcPrice || 1" step="500000"
                  class="w-full mt-3 accent-emerald-500 cursor-pointer" />
                <div class="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>Rp 0</span>
                  <span>{{ formatIDR(calcPrice || 0) }}</span>
                </div>
              </div>

              <button
                id="btn-calc-simulate"
                @click="runSimulation"
                :disabled="!calcPrice || calcLoading"
                class="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm shadow-sm shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span v-if="calcLoading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span class="material-symbols-outlined text-[18px]" v-else>play_circle</span>
                Hitung Semua Simulasi Kredit
              </button>
            </div>

            <!-- Daily Affordability Box -->
            <div v-if="calcResult && calcHighlight" class="bg-white rounded-2xl border border-emerald-200 shadow-sm p-5">
              <p class="text-3xl font-black text-slate-900 font-mono">
                {{ formatIDR(calcHighlight.daily_cost) }}<span class="text-base text-slate-400 font-normal">/hari</span>
              </p>
              <p class="text-sm text-slate-600 mt-1.5">
                Efisiensi beban komputasi instans ini mencapai <strong class="text-emerald-600">performa optimal!</strong>
              </p>
              <div class="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs">
                <div class="flex justify-between">
                  <span class="text-slate-500">{{ calcHighlight.provider }} — {{ calcHighlight.tenor }}x</span>
                  <strong class="text-slate-800 font-mono">{{ formatIDR(calcHighlight.monthly) }}/bln</strong>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-500">Total Bayar</span>
                  <strong class="text-slate-800 font-mono">{{ formatIDR(calcHighlight.total) }}</strong>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-500">Total Bunga</span>
                  <strong class="font-mono" :class="calcHighlight.interest > 0 ? 'text-rose-600' : 'text-emerald-600'">
                    {{ calcHighlight.interest > 0 ? formatIDR(calcHighlight.interest) : 'Gratis (0%)' }}
                  </strong>
                </div>
              </div>
              <div v-if="calcSelectedLaptop" class="space-y-2 mt-4">
                <button
                  @click="openAssistedCheckout"
                  class="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span class="material-symbols-outlined text-[16px]">shopping_cart_checkout</span>
                  Buat Pesanan Kredit (Assisted Checkout)
                </button>
                <button
                  v-if="calcHighlight"
                  @click="openProposalModal"
                  type="button"
                  class="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span class="material-symbols-outlined text-[16px] text-emerald-400">description</span>
                  Cetak Proposal Sizing & Penawaran Resmi
                </button>
              </div>
            </div>
          </div>

          <!-- Hasil Simulasi -->
          <div class="lg:col-span-3">
            <div v-if="!calcResult" class="bg-white rounded-2xl border border-dashed border-slate-300 flex flex-col items-center justify-center py-20 text-center">
              <div class="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto mb-4">
                <span class="material-symbols-outlined text-slate-400 text-[28px]">calculate</span>
              </div>
              <p class="text-sm font-semibold text-slate-500">Isi nilai kontrak node & klik Hitung</p>
              <p class="text-xs text-slate-400 mt-1">Sistem akan menampilkan simulasi 10 provider pembiayaan</p>
            </div>

            <div v-else class="space-y-4">
              <!-- Provider Filter -->
              <div class="flex gap-2 flex-wrap">
                <button
                  v-for="t in providerTypes"
                  :key="t.id"
                  @click="calcTypeFilter = t.id"
                  :class="[
                    'px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer',
                    calcTypeFilter === t.id
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  ]"
                >{{ t.label }}</button>
              </div>

              <!-- Provider Cards -->
              <div v-for="provider in filteredProviders" :key="provider.provider"
                class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5"
              >
                <div class="flex items-center gap-3 mb-4">
                  <div :class="[
                    'w-9 h-9 rounded-xl border flex items-center justify-center',
                    provider.type === 'credit_card' ? 'bg-blue-50 border-blue-200' :
                    provider.type === 'paylater' ? 'bg-violet-50 border-violet-200' : 'bg-amber-50 border-amber-200'
                  ]">
                    <span :class="[
                      'material-symbols-outlined text-[18px]',
                      provider.type === 'credit_card' ? 'text-blue-600' :
                      provider.type === 'paylater' ? 'text-violet-600' : 'text-amber-600'
                    ]">
                      {{ provider.type === 'credit_card' ? 'credit_card' : provider.type === 'paylater' ? 'payments' : 'account_balance' }}
                    </span>
                  </div>
                  <div>
                    <p class="font-bold text-slate-900 text-sm">{{ provider.provider }}</p>
                    <p class="text-[10px] text-slate-500">
                      {{ provider.interest_rate_per_month === 0 ? '✓ Cicilan 0% tanpa bunga' : `Bunga flat ${provider.interest_rate_per_month}%/bulan` }}
                    </p>
                  </div>
                  <span v-if="provider.interest_rate_per_month === 0"
                    class="ml-auto px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold"
                  >0% Bunga</span>
                </div>

                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    v-for="t in provider.tenors"
                    :key="t.tenor"
                    @click="setHighlight(provider, t)"
                    :class="[
                      'p-3 rounded-xl border text-left transition-all cursor-pointer',
                      calcHighlight?.provider === provider.provider && calcHighlight?.tenor === t.tenor
                        ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    ]"
                  >
                    <p class="text-[10px] text-slate-500 font-medium">{{ t.tenor }}x Bulan</p>
                    <p class="text-sm font-black text-slate-900 font-mono mt-0.5">{{ formatIDR(t.monthly_installment) }}</p>
                    <p class="text-[10px] text-emerald-600 font-semibold mt-0.5">{{ formatIDR(t.daily_cost) }}/hari</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════════ -->
      <!-- TAB: PESANAN MASUK                              -->
      <!-- ═══════════════════════════════════════════════ -->
      <div v-if="activeTab === 'orders'" class="space-y-6">
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-2">
              <span class="material-symbols-outlined text-[15px]">receipt_long</span>
              <span>Riwayat & Pelacakan Komisi Transaksi</span>
            </div>
            <h1 class="text-2xl font-black tracking-tight text-slate-900">Riwayat Pesanan Sales</h1>
            <p class="text-xs sm:text-sm text-slate-600 mt-1">Pantau status verifikasi transaksi oleh Admin, pelunasan kredit, dan bukti nota transaksi pelanggan Anda.</p>
          </div>
        </div>

        <!-- Filter Tabs -->
        <div class="flex gap-2 flex-wrap">
          <button
            v-for="f in orderFilters"
            :key="f.id"
            @click="orderFilter = f.id"
            :class="[
              'px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer',
              orderFilter === f.id
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
            ]"
          >
            {{ f.label }}
            <span v-if="f.count !== undefined" class="ml-1.5 font-mono">{{ f.count }}</span>
          </button>
        </div>

        <!-- Orders Table -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-slate-50 border-b border-slate-200">
                <tr class="text-left">
                  <th class="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">No. Pesanan</th>
                  <th class="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Pelanggan</th>
                  <th class="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Total</th>
                  <th class="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Metode</th>
                  <th class="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Status Verifikasi</th>
                  <th class="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-if="!filteredOrders.length">
                  <td colspan="6" class="px-5 py-12 text-center text-slate-400 text-sm">
                    <div class="flex flex-col items-center gap-2">
                      <span class="material-symbols-outlined text-[36px] opacity-40">inbox</span>
                      <span>Tidak ada pesanan ditemukan</span>
                    </div>
                  </td>
                </tr>
                <tr v-for="order in filteredOrders" :key="order.id" class="hover:bg-slate-50 transition-colors">
                  <td class="px-5 py-3.5">
                    <p class="font-mono font-bold text-blue-600 text-xs">{{ order.order_number }}</p>
                    <p class="text-[10px] text-slate-400 mt-0.5">{{ formatDate(order.created_at) }}</p>
                  </td>
                  <td class="px-5 py-3.5">
                    <p class="font-semibold text-slate-800 text-xs">{{ order.customer_name }}</p>
                    <p class="text-[10px] text-slate-400 mt-0.5">{{ order.customer_phone }}</p>
                  </td>
                  <td class="px-5 py-3.5">
                    <p class="font-bold text-slate-900 text-xs font-mono">{{ formatIDR(order.total_amount) }}</p>
                    <span v-if="order.is_credit"
                      class="inline-block mt-0.5 text-[10px] bg-emerald-50 border border-emerald-200 text-emerald-700 px-1.5 py-0.5 rounded-md font-medium"
                    >
                      💳 Kredit {{ order.credit_tenor }}x
                    </span>
                  </td>
                  <td class="px-5 py-3.5">
                    <p class="text-xs text-slate-600 max-w-[140px] truncate">{{ order.bank_name || order.payment_method }}</p>
                  </td>
                  <td class="px-5 py-3.5">
                    <span :class="[
                      'text-[10px] font-bold px-2.5 py-1 rounded-full border inline-flex items-center gap-1',
                      order.payment_status === 'paid'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        : order.payment_status === 'cancelled'
                        ? 'bg-rose-50 border-rose-200 text-rose-700'
                        : 'bg-amber-50 border-amber-200 text-amber-700'
                    ]">
                      <span class="material-symbols-outlined text-[13px]">{{ order.payment_status === 'paid' ? 'check_circle' : 'hourglass_top' }}</span>
                      <span>{{ order.payment_status === 'paid' ? 'LUNAS (Terverifikasi)' : order.payment_status === 'cancelled' ? 'BATAL' : 'Menunggu Verifikasi Admin' }}</span>
                    </span>
                  </td>
                  <td class="px-5 py-3.5">
                    <div class="flex items-center gap-1.5">
                      <router-link
                        :to="`/pesanan/${order.order_number}?from=sales`"
                        class="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold transition-colors shadow-xs"
                        title="Buka Dokumen Faktur"
                      >
                        <span class="material-symbols-outlined text-[15px]">receipt</span>
                        <span>Lihat Nota</span>
                      </router-link>
                      <router-link
                        :to="`/cek-pesanan?q=${order.order_number}&from=sales`"
                        class="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold transition-colors shadow-xs"
                        title="Pantau Status & SLA"
                      >
                        <span class="material-symbols-outlined text-[15px]">local_shipping</span>
                        <span>Lacak</span>
                      </router-link>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════════ -->
      <!-- TAB: MONITOR STOK                              -->
      <!-- ═══════════════════════════════════════════════ -->
      <div v-if="activeTab === 'stock'" class="space-y-6">
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-2">
              <span class="material-symbols-outlined text-[15px]">inventory_2</span>
              <span>Katalog Ketersediaan Barang (Read-Only)</span>
            </div>
            <h1 class="text-2xl font-black tracking-tight text-slate-900">Monitor Kapasitas Node Infrastruktur</h1>
            <p class="text-xs sm:text-sm text-slate-600 mt-1">Pantau ketersediaan unit secara real-time untuk asistensi pelanggan. Penambahan stok master dikelola oleh Admin Gudang.</p>
          </div>
          <div>
            <input
              v-model="stockSearch"
              type="text"
              placeholder="Cari instans / node server..."
              class="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-60 shadow-sm"
            />
          </div>
        </div>

        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-slate-50 border-b border-slate-200">
                <tr class="text-left">
                  <th class="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Node Infrastruktur</th>
                  <th class="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Harga</th>
                  <th class="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Jumlah Stok</th>
                  <th class="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Status Ketersediaan</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-if="!filteredStock.length">
                  <td colspan="4" class="px-5 py-12 text-center text-slate-400 text-sm">Data stok tidak tersedia</td>
                </tr>
                <tr v-for="laptop in filteredStock" :key="laptop.id" class="hover:bg-slate-50 transition-colors">
                  <td class="px-5 py-3.5">
                    <p class="font-semibold text-slate-800 text-xs">{{ laptop.brand }} {{ laptop.model }}</p>
                    <p class="text-[10px] text-slate-400 mt-0.5 font-mono">{{ laptop.sku || 'N/A' }}</p>
                  </td>
                  <td class="px-5 py-3.5">
                    <p class="font-mono font-bold text-xs text-slate-800">{{ formatIDR(laptop.price) }}</p>
                  </td>
                  <td class="px-5 py-3.5">
                    <div class="flex items-center gap-1.5">
                      <span :class="[
                        'font-black text-base font-mono',
                        laptop.stock === 0 ? 'text-rose-600' :
                        laptop.stock < 3 ? 'text-amber-600' : 'text-emerald-600'
                      ]">{{ laptop.stock }}</span>
                      <span class="text-xs text-slate-400">unit</span>
                    </div>
                  </td>
                  <td class="px-5 py-3.5">
                    <span
                      v-if="laptop.stock >= 3"
                      class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 border border-emerald-200 text-emerald-700"
                    >
                      <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span>Ready Stock</span>
                    </span>
                    <span
                      v-else-if="laptop.stock > 0"
                      class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 border border-amber-200 text-amber-700"
                    >
                      <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                      <span>Stok Kritis (Sisa {{ laptop.stock }})</span>
                    </span>
                    <span
                      v-else
                      class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 border border-rose-200 text-rose-700"
                    >
                      <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                      <span>Stok Habis</span>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </main>

    <!-- ╔══════════════════════════════════════════════════════╗ -->
    <!-- ║  MODAL: ASSISTED CHECKOUT                            ║ -->
    <!-- ╚══════════════════════════════════════════════════════╝ -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="showAssistedModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="showAssistedModal = false"></div>
        <div class="relative bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <!-- Modal Header -->
          <div class="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                <span class="material-symbols-outlined text-emerald-600 text-[18px]">shopping_cart_checkout</span>
              </div>
              <div>
                <h3 class="font-bold text-slate-900 text-sm">Assisted Checkout — Kredit</h3>
                <p class="text-[10px] text-slate-500">Buat pesanan cicilan atas nama pelanggan</p>
              </div>
            </div>
            <button @click="showAssistedModal = false" class="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer">
              <span class="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          <form @submit.prevent="submitAssistedOrder" class="p-6 space-y-4">
            <!-- Infrastructure Preview -->
            <div v-if="calcSelectedLaptop" class="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-3">
              <div class="w-9 h-9 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-emerald-600 text-[18px]">dns</span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-bold text-slate-800 truncate">{{ calcSelectedLaptop.brand }} {{ calcSelectedLaptop.model }}</p>
                <p class="text-xs text-emerald-600 font-mono font-bold">{{ formatIDR(calcSelectedLaptop.price) }}</p>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="col-span-2">
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nama Pelanggan *</label>
                <input id="ac-name" v-model="acForm.customer_name" required type="text" placeholder="Nama lengkap pelanggan"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">No. WhatsApp *</label>
                <input id="ac-phone" v-model="acForm.customer_phone" required type="tel" placeholder="0812..."
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email</label>
                <input id="ac-email" v-model="acForm.customer_email" type="email" placeholder="email@..."
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all" />
              </div>
              <div class="col-span-2">
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Alamat Pengiriman *</label>
                <textarea id="ac-address" v-model="acForm.shipping_address" required rows="2" placeholder="Alamat lengkap..."
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all resize-none"></textarea>
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Provider Pembiayaan</label>
                <select id="ac-provider" v-model="acForm.financing_provider"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all">
                  <option>BCA Kartu Kredit 0%</option>
                  <option>Mandiri Kartu Kredit 0%</option>
                  <option>BRI Kartu Kredit 0%</option>
                  <option>BNI Kartu Kredit 0%</option>
                  <option>Kredivo</option>
                  <option>Akulaku</option>
                  <option>ShopeePayLater</option>
                  <option>Home Credit</option>
                  <option>FIF (Federal Internusa)</option>
                  <option>AEON Credit Service</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Tenor (Bulan)</label>
                <select id="ac-tenor" v-model.number="acForm.credit_tenor"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all">
                  <option :value="3">3 Bulan</option>
                  <option :value="6">6 Bulan</option>
                  <option :value="12">12 Bulan</option>
                  <option :value="24">24 Bulan</option>
                </select>
              </div>
              <div class="col-span-2">
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Uang Muka / DP (Rp)</label>
                <input id="ac-dp" v-model.number="acForm.dp_amount" type="number" min="0" placeholder="0 (tanpa DP)"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all" />
              </div>
            </div>

            <!-- Ringkasan -->
            <div v-if="calcSelectedLaptop" class="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2">
              <div class="flex justify-between text-slate-600"><span>Tarif Node</span><span class="font-mono font-bold text-slate-800">{{ formatIDR(calcSelectedLaptop.price) }}</span></div>
              <div class="flex justify-between text-slate-600"><span>Uang Muka (DP)</span><span class="font-mono font-bold text-slate-800">{{ formatIDR(acForm.dp_amount || 0) }}</span></div>
              <div class="flex justify-between text-slate-600"><span>Pokok Pembiayaan</span><span class="font-mono font-bold text-slate-800">{{ formatIDR(calcSelectedLaptop.price - (acForm.dp_amount || 0)) }}</span></div>
              <div class="pt-2 border-t border-slate-200 flex justify-between">
                <span class="font-bold text-slate-700">Estimasi Cicilan ~{{ acForm.credit_tenor }}x</span>
                <span class="font-mono font-black text-emerald-600">{{ formatIDR(Math.ceil((calcSelectedLaptop.price - (acForm.dp_amount || 0)) / acForm.credit_tenor)) }}/bln</span>
              </div>
            </div>

            <div v-if="acSuccess" class="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-700 font-medium flex items-center gap-2">
              <span class="material-symbols-outlined text-[16px]">check_circle</span>
              Pesanan berhasil! No: <strong class="font-mono">{{ acSuccess }}</strong>
            </div>
            <div v-if="acError" class="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-700 flex items-center gap-2">
              <span class="material-symbols-outlined text-[16px]">error</span>
              {{ acError }}
            </div>

            <button type="submit" id="btn-ac-submit" :disabled="acLoading"
              class="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-emerald-500/20"
            >
              <span v-if="acLoading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span class="material-symbols-outlined text-[18px]" v-else>check_circle</span>
              Buat Pesanan Kredit
            </button>
          </form>
        </div>
      </div>
    </transition>

    <!-- ═══════════════════════════════════════════════════════════ -->
    <!-- MODAL: DOKUMEN PROPOSAL SIZING & PENAWARAN RESMI B2B        -->
    <!-- ═══════════════════════════════════════════════════════════ -->
    <transition name="fade">
      <div v-if="showProposalModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto">
        <div class="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-slate-900 my-8 space-y-6">
          <!-- Proposal Header -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b-2 border-slate-200 gap-4">
            <div class="flex items-center gap-3">
              <div class="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xl shadow-sm">
                SI
              </div>
              <div>
                <h3 class="font-extrabold text-base text-slate-900">SmartInfra Enterprise Solutions</h3>
                <p class="text-xs text-slate-500 font-mono">B2B Infrastructure Sizing Quotation & Financing Plan</p>
              </div>
            </div>
            <div class="sm:text-right text-xs space-y-0.5">
              <p class="font-mono text-slate-500">Ref: <span class="font-bold text-slate-900">PROP-{{ new Date().getFullYear() }}-{{ calcSelectedLaptop?.id || '01' }}</span></p>
              <p class="text-slate-500">Tanggal: <span class="font-semibold text-slate-800">{{ formatDate(new Date()) }}</span></p>
              <p class="text-slate-500">Konsultan: <span class="font-bold text-blue-700">{{ authStore.user?.name || 'IT Solutions Architect' }}</span></p>
            </div>
          </div>

          <!-- Proposal Client Info -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Ditujukan Kepada Perusahaan Klien:</span>
              <input v-model="proposalClientName" class="font-bold text-slate-900 bg-white border border-slate-200 rounded px-2.5 py-1 mt-1 w-full text-xs" />
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-2">PIC Pengadaan:</span>
              <input v-model="proposalClientPic" class="text-slate-600 bg-white border border-slate-200 rounded px-2.5 py-1 mt-0.5 w-full text-xs" />
            </div>
            <div class="sm:text-right">
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Kategori Analisis Beban Kerja:</span>
              <span class="font-extrabold text-blue-700 text-sm block mt-1">
                {{ sizingProfiles.find(p => p.id === selectedProfileId)?.name || 'Enterprise Workload' }}
              </span>
              <span class="text-slate-500 mt-1 block">Validasi SPK SAW: <strong>Tervalidasi Rekomendasi Utama</strong></span>
            </div>
          </div>

          <!-- Technical Specs Table -->
          <div>
            <h4 class="font-bold text-xs uppercase tracking-wider text-slate-500 mb-2 font-mono">1. Spesifikasi Teknis Node Terpilih</h4>
            <div class="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table class="w-full text-left">
                <thead class="bg-slate-50 border-b border-slate-200 font-mono text-slate-500 text-[10px] uppercase">
                  <tr>
                    <th class="p-3">Komponen</th>
                    <th class="p-3">Rincian Teknis</th>
                    <th class="p-3 text-right">Tarif Resmi</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <tr>
                    <td class="p-3 font-bold text-slate-800">{{ calcSelectedLaptop?.brand }} {{ calcSelectedLaptop?.model }}</td>
                    <td class="p-3 text-slate-600">
                      {{ calcSelectedLaptop?.processor_name }} • {{ calcSelectedLaptop?.ram_gb }}GB ECC RAM • {{ calcSelectedLaptop?.storage_desc || calcSelectedLaptop?.storage_gb + 'GB NVMe' }} • SLA {{ calcSelectedLaptop?.battery_hours || 99.9 }}%
                    </td>
                    <td class="p-3 text-right font-mono font-bold text-slate-900">{{ formatIDR(calcSelectedLaptop?.price) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Financing Options Table -->
          <div>
            <h4 class="font-bold text-xs uppercase tracking-wider text-slate-500 mb-2 font-mono">2. Skema & Opsi Pembiayaan B2B</h4>
            <div class="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table class="w-full text-left">
                <thead class="bg-slate-50 border-b border-slate-200 font-mono text-slate-500 text-[10px] uppercase">
                  <tr>
                    <th class="p-3">Opsi Pembiayaan</th>
                    <th class="p-3">Tenor</th>
                    <th class="p-3">Uang Muka (DP)</th>
                    <th class="p-3 text-right">Estimasi Angsuran / Bulan</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <tr class="bg-emerald-50/40">
                    <td class="p-3 font-bold text-emerald-900">Rekomendasi: {{ calcHighlight?.provider }}</td>
                    <td class="p-3 font-mono font-bold">{{ calcHighlight?.tenor }} Bulan</td>
                    <td class="p-3 font-mono">{{ formatIDR(calcDp || 0) }}</td>
                    <td class="p-3 text-right font-mono font-extrabold text-emerald-700 text-sm">{{ formatIDR(calcHighlight?.monthly) }}/bln</td>
                  </tr>
                  <tr>
                    <td class="p-3 text-slate-700">Tunai / Transfer PO 30 Hari (CapEx Penuh)</td>
                    <td class="p-3 font-mono">Lunas</td>
                    <td class="p-3 font-mono">-</td>
                    <td class="p-3 text-right font-mono font-bold text-slate-900">{{ formatIDR(calcPrice) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Sign-off Block -->
          <div class="grid grid-cols-2 gap-8 pt-4 border-t border-slate-200 text-xs">
            <div class="space-y-12">
              <span class="text-slate-400 font-medium">Disiapkan Oleh:</span>
              <div>
                <p class="font-bold text-slate-900 underline">{{ authStore.user?.name || 'Solutions Architect' }}</p>
                <p class="text-slate-500 font-mono text-[11px]">IT Solutions Architect & Financing Specialist</p>
              </div>
            </div>
            <div class="space-y-12 text-right">
              <span class="text-slate-400 font-medium">Disetujui Oleh Klien:</span>
              <div>
                <p class="font-bold text-slate-900 underline">{{ proposalClientPic || '(PIC Pelanggan)' }}</p>
                <p class="text-slate-500 font-mono text-[11px]">{{ proposalClientName || 'Perusahaan Klien' }}</p>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-3 pt-4 border-t border-slate-100 print:hidden">
            <button
              @click="showProposalModal = false"
              type="button"
              class="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-600 transition-colors cursor-pointer"
            >
              Tutup
            </button>
            <button
              @click="printProposal"
              type="button"
              class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span class="material-symbols-outlined text-[16px]">print</span>
              <span>Cetak / Simpan PDF Proposal</span>
            </button>
          </div>
        </div>
      </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

const router = useRouter();
const authStore = useAuthStore();

// ─── Tabs ────────────────────────────────────────────────────
const activeTab = ref('dashboard');
const tabs = [
  { id: 'dashboard',  label: 'Dashboard Solusi & RFQ',       icon: 'space_dashboard' },
  { id: 'calculator', label: 'Konsultasi Sizing & Pembiayaan', icon: 'calculate' },
  { id: 'orders',     label: 'Pesanan & Kontrak Masuk',     icon: 'receipt_long' },
  { id: 'stock',      label: 'Katalog & Ketersediaan Node',  icon: 'inventory_2' },
];

// ─── Dashboard Metrics ────────────────────────────────────────
const metrics = ref({});
const refreshing = ref(false);

async function loadMetrics() {
  try {
    const res = await axios.get('/api/sales/metrics', {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    metrics.value = res.data.data || {};
  } catch (e) {
    console.error('loadMetrics:', e);
  }
}

// ─── Orders ──────────────────────────────────────────────────
const orders = ref([]);
const orderFilter = ref('all');

const pendingCount = computed(() => orders.value.filter(o => o.payment_status === 'pending').length);

const orderFilters = computed(() => [
  { id: 'all',     label: 'Semua Pesanan',       count: orders.value.length },
  { id: 'credit',  label: 'Kredit / Cicilan',    count: orders.value.filter(o => o.is_credit).length },
  { id: 'cash',    label: 'Tunai / Transfer',    count: orders.value.filter(o => !o.is_credit).length },
  { id: 'pending', label: 'Menunggu Verifikasi', count: orders.value.filter(o => o.payment_status === 'pending').length },
  { id: 'paid',    label: 'Sudah Lunas',         count: orders.value.filter(o => o.payment_status === 'paid').length },
]);

const filteredOrders = computed(() => {
  if (orderFilter.value === 'credit')  return orders.value.filter(o => o.is_credit);
  if (orderFilter.value === 'cash')    return orders.value.filter(o => !o.is_credit);
  if (orderFilter.value === 'pending') return orders.value.filter(o => o.payment_status === 'pending');
  if (orderFilter.value === 'paid')    return orders.value.filter(o => o.payment_status === 'paid');
  return orders.value;
});

async function loadOrders() {
  try {
    const res = await axios.get('/api/orders', {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    orders.value = res.data.data || [];
  } catch (e) {
    console.error('loadOrders:', e);
  }
}

// ─── Stock (Read-Only Real-Time Monitoring) ─────────────────
const allLaptops = ref([]);
const stockSearch = ref('');

const filteredStock = computed(() => {
  const q = stockSearch.value.toLowerCase();
  if (!q) return allLaptops.value;
  return allLaptops.value.filter(l => `${l.brand} ${l.model}`.toLowerCase().includes(q));
});

async function loadLaptops() {
  try {
    const res = await axios.get('/api/laptops?limit=200');
    allLaptops.value = res.data.data || [];
  } catch (e) {
    console.error('loadLaptops:', e);
  }
}

// ─── Calculator ─────────────────────────────────────────────
const calcSearch   = ref('');
const calcPrice    = ref(null);
const calcDp       = ref(0);
const calcLoading  = ref(false);
const calcResult   = ref(null);
const calcHighlight = ref(null);
const calcSelectedLaptop = ref(null);
const calcTypeFilter = ref('all');
const laptopSearchResults = ref([]);

const calcDpPercent = computed(() => {
  if (!calcPrice.value || !calcDp.value) return 0;
  return Math.round((calcDp.value / calcPrice.value) * 100);
});

const providerTypes = [
  { id: 'all', label: 'Semua Provider' },
  { id: 'credit_card', label: 'Kartu Kredit 0%' },
  { id: 'paylater', label: 'Paylater Digital' },
  { id: 'multifinance', label: 'Multifinance' },
];

const filteredProviders = computed(() => {
  if (!calcResult.value) return [];
  if (calcTypeFilter.value === 'all') return calcResult.value;
  return calcResult.value.filter(p => p.type === calcTypeFilter.value);
});

let searchTimeout = null;
function searchLaptops() {
  if (searchTimeout) clearTimeout(searchTimeout);
  if (!calcSearch.value.trim()) { laptopSearchResults.value = []; return; }
  searchTimeout = setTimeout(() => {
    const q = calcSearch.value.toLowerCase();
    laptopSearchResults.value = allLaptops.value
      .filter(l => `${l.brand} ${l.model}`.toLowerCase().includes(q))
      .slice(0, 8);
  }, 250);
}

function selectLaptopForCalc(laptop) {
  calcSelectedLaptop.value = laptop;
  calcPrice.value = parseFloat(laptop.price);
  calcDp.value = 0;
  calcSearch.value = `${laptop.brand} ${laptop.model}`;
  laptopSearchResults.value = [];
}

async function runSimulation() {
  if (!calcPrice.value) return;
  calcLoading.value = true;
  calcResult.value = null;
  calcHighlight.value = null;
  try {
    const res = await axios.get('/api/sales/credit-calculator', {
      params: { price: calcPrice.value, dp_amount: calcDp.value || 0 }
    });
    calcResult.value = res.data.data;
    // Auto-highlight BCA CC 12x
    const bca = calcResult.value.find(p => p.provider === 'BCA Kartu Kredit 0%');
    if (bca) {
      const t12 = bca.tenors.find(t => t.tenor === 12) || bca.tenors[0];
      setHighlight(bca, t12);
    }
  } catch (e) {
    console.error('Simulation error:', e);
  } finally {
    calcLoading.value = false;
  }
}

function setHighlight(provider, tenor) {
  calcHighlight.value = {
    provider: provider.provider,
    tenor: tenor.tenor,
    monthly: tenor.monthly_installment,
    daily_cost: tenor.daily_cost,
    total: tenor.total_cost,
    interest: tenor.total_interest
  };
}

// ─── Sizing & SAW Consultation State ─────────────────────────
const sizingProfiles = ref([
  {
    id: 1,
    name: 'Web & Microservices Backend',
    icon: 'dns',
    desc: 'Optimasi biaya OpEx, SLA 99.9%, dan responsivitas web traffic tinggi.'
  },
  {
    id: 2,
    name: 'High-Throughput Database & Big Data',
    icon: 'database',
    desc: 'Kapasitas RAM ECC masif, throughput disk NVMe IOPS tinggi, dan failover redundan.'
  },
  {
    id: 3,
    name: 'AI Model Training & Deep Learning',
    icon: 'smart_toy',
    desc: 'Fokus komputasi GPU VRAM besar, Tensor Cores paralel, dan high-memory.'
  }
]);

const budgetPresets = [
  { label: 'Semua Budget', value: 0 },
  { label: 'Entry VPS (< Rp 500 Rb)', value: 500000 },
  { label: 'Cloud Node (< Rp 2.5 Jt)', value: 2500000 },
  { label: 'Database Cluster (< Rp 15 Jt)', value: 15000000 },
  { label: 'Enterprise (< Rp 100 Jt)', value: 100000000 },
];

function setBudgetPreset(val) {
  sizingBudgetCap.value = val;
  runSizingRecommendation();
}

const selectedProfileId = ref(1);
const sizingBudgetCap = ref(0); // 0 = no cap, recommend best node across all tiers
const sizingCategory = ref('all');
const sizingMinRam = ref(1); // 1GB+ includes lightweight VPS
const sizingLoading = ref(false);
const sizingResults = ref([]);
const sizingHasRun = ref(false);

async function runSizingRecommendation() {
  sizingLoading.value = true;
  sizingHasRun.value = true;
  try {
    const filters = {};
    if (sizingBudgetCap.value && sizingBudgetCap.value > 0) {
      filters.max_price = sizingBudgetCap.value;
    }
    if (sizingCategory.value && sizingCategory.value !== 'all') {
      filters.category = sizingCategory.value;
    }
    if (sizingMinRam.value && sizingMinRam.value > 1) {
      filters.min_ram = sizingMinRam.value;
    }

    const res = await axios.post('/api/spk/recommend', {
      profile_id: selectedProfileId.value,
      filters
    });

    if (res.data.success) {
      sizingResults.value = (res.data.results || []).slice(0, 3);
    }
  } catch (err) {
    console.error('Error running sizing recommendation:', err);
  } finally {
    sizingLoading.value = false;
  }
}

function adoptSizingNode(rec) {
  calcSelectedLaptop.value = rec;
  calcPrice.value = parseFloat(rec.price);
  calcDp.value = 0;
  calcSearch.value = `${rec.brand} ${rec.model}`;
  runSimulation();
}

// ─── Formal RFQ Sizing Proposal Modal ────────────────────────
const showProposalModal = ref(false);
const proposalClientName = ref('PT Inovasi Digital Nusantara');
const proposalClientPic = ref('Bpk. Hendra Gunawan (Head of Infrastructure)');

function openProposalModal() {
  if (!calcSelectedLaptop.value || !calcHighlight.value) return;
  showProposalModal.value = true;
}

function printProposal() {
  window.print();
}

// ─── Assisted Checkout ───────────────────────────────────────
const showAssistedModal = ref(false);
const acLoading = ref(false);
const acSuccess = ref('');
const acError = ref('');
const acForm = ref({
  customer_name: '',
  customer_email: '',
  customer_phone: '',
  shipping_address: '',
  financing_provider: 'BCA Kartu Kredit 0%',
  credit_tenor: 12,
  dp_amount: 0
});

function openAssistedCheckout() {
  acSuccess.value = '';
  acError.value = '';
  acForm.value = {
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    shipping_address: '',
    financing_provider: 'BCA Kartu Kredit 0%',
    credit_tenor: calcHighlight.value?.tenor || 12,
    dp_amount: calcDp.value || 0
  };
  showAssistedModal.value = true;
}

async function submitAssistedOrder() {
  if (!calcSelectedLaptop.value) return;
  acLoading.value = true;
  acError.value = '';
  acSuccess.value = '';
  try {
    const paymentMethod = acForm.value.financing_provider.includes('Kartu Kredit') ? 'credit_card' : 'paylater';
    const res = await axios.post('/api/sales/orders/create-assisted', {
      customer_name: acForm.value.customer_name,
      customer_email: acForm.value.customer_email,
      customer_phone: acForm.value.customer_phone,
      shipping_address: acForm.value.shipping_address,
      payment_method: paymentMethod,
      is_credit: true,
      credit_tenor: acForm.value.credit_tenor,
      dp_amount: acForm.value.dp_amount || 0,
      financing_provider: acForm.value.financing_provider,
      items: [{ laptop_id: calcSelectedLaptop.value.id, quantity: 1 }]
    }, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    acSuccess.value = res.data.data.order_number;
    await Promise.all([loadOrders(), loadMetrics()]);
  } catch (e) {
    acError.value = e.response?.data?.message || 'Gagal membuat pesanan';
  } finally {
    acLoading.value = false;
  }
}

// ─── Global Load & Lifecycle ─────────────────────────────────
async function loadData() {
  refreshing.value = true;
  await Promise.all([loadMetrics(), loadOrders(), loadLaptops()]);
  refreshing.value = false;
}

function handleLogout() {
  authStore.logout();
  router.push('/login');
}

// ─── Helpers ─────────────────────────────────────────────────
function formatIDR(val) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val || 0);
}
function formatDate(d) {
  if (!d) return '-';
  return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

onMounted(() => {
  if (!authStore.token || !authStore.user) {
    router.push('/login');
    return;
  }
  loadData();
  runSizingRecommendation();
});
</script>
