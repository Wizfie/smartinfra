<template>
  <div
    class="bg-slate-50 text-slate-900 antialiased min-h-screen flex flex-col font-sans selection:bg-blue-600 selection:text-white"
  >
    <!-- Sticky Admin Header -->
    <header
      class="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200"
    >
      <div
        class="max-w-[1380px] w-full mx-auto px-4 sm:px-6 h-16 flex items-center justify-between"
      >
        <div class="flex items-center gap-6">
          <router-link class="flex items-center gap-2 sm:gap-2.5" to="/admin">
            <div
              class="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-sm"
            >
              <span
                class="material-symbols-outlined text-white"
                style="font-size: 20px"
                >admin_panel_settings</span
              >
            </div>
            <div class="flex items-center gap-1.5">
              <span
                class="text-sm sm:text-base font-semibold tracking-tight text-slate-900"
                >SmartInfra</span
              >
              <span
                class="bg-blue-600 text-white text-[10px] sm:text-[11px] font-mono px-1.5 py-0.5 rounded font-bold"
                >ADMIN PANEL</span
              >
            </div>
          </router-link>
        </div>

        <!-- Quick Store Link & Admin Identity -->
        <div class="flex items-center gap-2 sm:gap-3">
          <router-link
            to="/"
            class="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all"
            title="Buka Portal Publik"
          >
            <span
              class="material-symbols-outlined text-slate-400"
              style="font-size: 16px"
              >storefront</span
            >
            <span class="hidden sm:inline">Buka Portal Publik</span>
          </router-link>
          <div class="h-5 w-px bg-slate-200 mx-0.5 sm:mx-1"></div>
          <div class="flex items-center gap-2 text-xs">
            <div
              class="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center"
            >
              A
            </div>
            <span class="hidden sm:inline font-medium text-slate-800">Sysadmin Utama</span>
          </div>
          <button
            @click="handleLogout"
            title="Keluar"
            class="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
          >
            <span class="material-symbols-outlined" style="font-size: 16px"
              >logout</span
            >
          </button>
        </div>
      </div>
    </header>

    <!-- Admin Main Navigation Tabs -->
    <div class="bg-white border-b border-slate-200">
      <div
        class="max-w-[1380px] mx-auto px-4 sm:px-6 flex items-center gap-4 sm:gap-8 text-xs font-semibold overflow-x-auto no-scrollbar"
      >
        <button
          @click="switchTab('executive')"
          id="tab-btn-executive"
          class="py-3.5 border-b-2 flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
          :class="
            activeTab === 'executive'
              ? 'border-blue-600 text-blue-600 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900 font-medium'
          "
        >
          <span class="material-symbols-outlined" style="font-size: 17px"
            >space_dashboard</span
          >
          <span>Dashboard Eksekutif</span>
        </button>
        <button
          @click="switchTab('products')"
          id="tab-btn-products"
          class="py-3.5 border-b-2 flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
          :class="
            activeTab === 'products'
              ? 'border-blue-600 text-blue-600 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900 font-medium'
          "
        >
          <span class="material-symbols-outlined" style="font-size: 17px"
            >dns</span
          >
          <span>Kelola Katalog Infrastruktur</span>
        </button>
        <button
          @click="switchTab('profiles')"
          id="tab-btn-profiles"
          class="py-3.5 border-b-2 flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
          :class="
            activeTab === 'profiles'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          "
        >
          <span class="material-symbols-outlined" style="font-size: 16px"
            >group</span
          >
          <span>Kelola Profil & Bobot</span>
        </button>
        <button
          @click="switchTab('orders')"
          id="tab-btn-orders"
          class="py-3.5 border-b-2 flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
          :class="
            activeTab === 'orders'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          "
        >
          <span class="material-symbols-outlined" style="font-size: 16px"
            >receipt_long</span
          >
          <span>Pesanan Masuk</span>
          <span
            v-if="orders.length"
            class="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 font-mono text-[10px]"
          >
            {{ orders.length }} Pesanan
          </span>
        </button>
        <button
          @click="switchTab('saw')"
          id="tab-btn-saw-audit"
          class="py-3.5 border-b-2 flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
          :class="
            activeTab === 'saw'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          "
        >
          <span class="material-symbols-outlined" style="font-size: 16px"
            >calculate</span
          >
          <span>Audit Matriks SAW </span>
        </button>
      </div>
    </div>

    <!-- Main Canvas -->
    <main class="flex-grow max-w-[1380px] w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <!-- ==================== TAB 0: DASHBOARD EKSEKUTIF ==================== -->
      <div v-if="activeTab === 'executive'" class="space-y-8">
        <!-- Top Executive Header -->
        <div
          class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200"
        >
          <div>
            <div
              class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-2"
            >
              <span class="material-symbols-outlined text-[15px]"
                >analytics</span
              >
              <span>Ringkasan Eksekutif & Intelijen Bisnis</span>
            </div>
            <h1 class="text-2xl font-black tracking-tight text-slate-900">
              Dashboard Eksekutif SmartInfra
            </h1>
            <p class="text-xs sm:text-sm text-slate-600 mt-1">
              Pantau arus omset penjualan, status inventaris stok gudang,
              konversi transaksi, dan performa rekomendasi algoritma SPK SAW
              secara real-time.
            </p>
          </div>

          <!-- Quick Actions Bar -->
          <div class="flex flex-wrap items-center gap-2.5">
            <button
              @click="openProductModal()"
              class="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-blue-500/20 transition-all cursor-pointer"
            >
              <span class="material-symbols-outlined text-[16px]">add</span>
              <span>Tambah Node Server</span>
            </button>
            <button
              @click="switchTab('saw')"
              class="px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <span class="material-symbols-outlined text-[16px]"
                >calculate</span
              >
              <span>Audit SPK SAW</span>
            </button>
          </div>
        </div>

        <!-- 4 Key Executive Performance Indicator (KPI) Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <!-- KPI 1: Total Pendapatan / Omset Lunas -->
          <div
            class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-emerald-500/50 transition-all"
          >
            <div class="flex items-center justify-between mb-3">
              <span
                class="text-xs font-bold text-slate-600 uppercase tracking-wider"
                >Total Omset (Lunas)</span
              >
              <div
                class="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center"
              >
                <span class="material-symbols-outlined text-[20px]"
                  >payments</span
                >
              </div>
            </div>
            <p class="text-2xl font-black text-slate-900 font-mono">
              {{ formatIDR(totalRevenue) }}
            </p>
            <div
              class="mt-3 flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-100"
            >
              <span class="font-medium"
                >{{ paidOrdersCount }} Transaksi Lunas</span
              >
              <span
                class="text-emerald-700 font-bold flex items-center gap-0.5"
              >
                <span class="material-symbols-outlined text-[14px]"
                  >check_circle</span
                >
                Terverifikasi
              </span>
            </div>
          </div>

          <!-- KPI 2: Total Valuasi Inventaris -->
          <div
            class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-blue-500/50 transition-all"
          >
            <div class="flex items-center justify-between mb-3">
              <span
                class="text-xs font-bold text-slate-600 uppercase tracking-wider"
                >Valuasi Stok Gudang</span
              >
              <div
                class="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center"
              >
                <span class="material-symbols-outlined text-[20px]"
                  >inventory_2</span
                >
              </div>
            </div>
            <p class="text-2xl font-black text-slate-900 font-mono">
              {{ formatIDR(totalInventoryValuation) }}
            </p>
            <div
              class="mt-3 flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-100"
            >
              <span class="font-medium"
                >{{ totalInventoryStock }} Unit Siap Jual</span
              >
              <span class="text-blue-700 font-bold font-mono"
                >{{ laptops.length }} Konfigurasi</span
              >
            </div>
          </div>

          <!-- KPI 3: Pesanan & Conversion Rate -->
          <div
            class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-amber-500/50 transition-all"
          >
            <div class="flex items-center justify-between mb-3">
              <span
                class="text-xs font-bold text-slate-600 uppercase tracking-wider"
                >Pesanan & Konversi</span
              >
              <div
                class="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center"
              >
                <span class="material-symbols-outlined text-[20px]"
                  >shopping_cart_checkout</span
                >
              </div>
            </div>
            <p class="text-2xl font-black text-slate-900 font-mono">
              {{ orders.length }} Pesanan
            </p>
            <div
              class="mt-3 flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-100"
            >
              <span class="font-medium"
                >Konversi:
                <strong class="text-amber-800"
                  >{{ conversionRate }}%</strong
                ></span
              >
              <span class="text-slate-600 font-medium"
                >{{ pendingOrdersCount }} Menunggu</span
              >
            </div>
          </div>

          <!-- KPI 4: SPK Engine & Knowledge Base -->
          <div
            class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-indigo-500/50 transition-all"
          >
            <div class="flex items-center justify-between mb-3">
              <span
                class="text-xs font-bold text-slate-600 uppercase tracking-wider"
                >Engine Rekomendasi SAW</span
              >
              <div
                class="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center"
              >
                <span class="material-symbols-outlined text-[20px]"
                  >psychology</span
                >
              </div>
            </div>
            <p class="text-2xl font-black text-slate-900 font-mono">
              6 Kriteria
            </p>
            <div
              class="mt-3 flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-100"
            >
              <span class="font-medium"
                >{{ profiles.length }} Profil Target Pengguna</span
              >
              <span class="text-indigo-700 font-bold">100% Valid</span>
            </div>
          </div>
        </div>

        <!-- 2 Columns Grid: Financial Health & Inventory Distribution -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Column 1: Financial Health & Recent Transactions -->
          <div
            class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5"
          >
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-extrabold text-base text-slate-900">
                  Kesehatan Finansial & Arus Kas
                </h3>
                <p class="text-xs text-slate-500 mt-0.5">
                  Perbandingan uang masuk terverifikasi versus tagihan yang
                  menunggu pembayaran.
                </p>
              </div>
              <button
                @click="switchTab('orders')"
                class="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Kelola Pesanan</span>
                <span class="material-symbols-outlined text-[14px]"
                  >arrow_forward</span
                >
              </button>
            </div>

            <!-- Visual Split Progress -->
            <div class="space-y-2">
              <div class="flex justify-between items-center text-xs font-bold">
                <span class="text-emerald-700 flex items-center gap-1">
                  <span
                    class="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"
                  ></span>
                  Lunas: {{ formatIDR(totalRevenue) }} ({{ conversionRate }}%)
                </span>
                <span class="text-amber-700 flex items-center gap-1">
                  <span
                    class="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"
                  ></span>
                  Pending: {{ formatIDR(pendingRevenue) }}
                </span>
              </div>
              <div
                class="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex"
              >
                <div
                  class="bg-emerald-500 h-full transition-all duration-500"
                  :style="{ width: `${conversionRate}%` }"
                ></div>
                <div
                  class="bg-amber-400 h-full transition-all duration-500"
                  :style="{ width: `${100 - conversionRate}%` }"
                ></div>
              </div>
            </div>

            <!-- Summary Stats Box -->
            <div class="grid grid-cols-2 gap-3 pt-2">
              <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span
                  class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block"
                  >Rata-rata Transaksi (AOV)</span
                >
                <span
                  class="text-base font-extrabold text-slate-900 font-mono mt-1 block"
                >
                  {{ formatIDR(avgOrderValue) }}
                </span>
              </div>
              <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span
                  class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block"
                  >Status Pesanan Lunas</span
                >
                <span
                  class="text-base font-extrabold text-emerald-700 font-mono mt-1 block"
                >
                  {{ paidOrdersCount }} dari {{ orders.length }} Transaksi
                </span>
              </div>
            </div>

            <!-- Recent Transactions Mini Table -->
            <div class="pt-2">
              <h4
                class="font-bold text-xs uppercase tracking-wider text-slate-700 mb-2.5"
              >
                5 Transaksi Pesanan Terbaru
              </h4>
              <div
                v-if="orders.length === 0"
                class="text-center py-6 text-xs text-slate-400"
              >
                Belum ada transaksi masuk.
              </div>
              <div v-else class="divide-y divide-slate-100 text-xs">
                <div
                  v-for="ord in recentOrdersList"
                  :key="ord.id"
                  class="py-2.5 flex items-center justify-between"
                >
                  <div>
                    <span class="font-mono font-bold text-blue-600">{{
                      ord.order_number
                    }}</span>
                    <span class="text-slate-500 block text-[11px]"
                      >{{ ord.customer_name }} •
                      {{ formatDate(ord.created_at) }}</span
                    >
                  </div>
                  <div class="text-right">
                    <span class="font-mono font-bold text-slate-900 block">{{
                      formatIDR(ord.total_amount)
                    }}</span>
                    <span
                      class="text-[10px] font-bold px-1.5 py-0.5 rounded-full inline-block"
                      :class="
                        ord.payment_status === 'paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      "
                    >
                      {{ ord.payment_status === "paid" ? "LUNAS" : "PENDING" }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Column 2: Inventory Distribution & Low Stock Alerts -->
          <div
            class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5"
          >
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-extrabold text-base text-slate-900">
                  Distribusi Brand & Stok Gudang
                </h3>
                <p class="text-xs text-slate-500 mt-0.5">
                  Komposisi ketersediaan node server berdasarkan {{ brandDistribution.length }} provider / vendor OEM ({{ laptops.length }} Total Konfigurasi).
                </p>
              </div>
              <div class="flex items-center gap-2">
                <button
                  @click="showAllBrands = !showAllBrands"
                  class="text-xs font-bold text-slate-600 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  :title="showAllBrands ? 'Tampilkan 6 provider teratas' : 'Tampilkan seluruh provider / vendor OEM'"
                >
                  {{ showAllBrands ? 'Tampilkan 6 Teratas' : `Semua (${brandDistribution.length} Brand)` }}
                </button>
                <button
                  @click="switchTab('products')"
                  class="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Kelola Stok</span>
                  <span class="material-symbols-outlined text-[14px]"
                    >arrow_forward</span
                  >
                </button>
              </div>
            </div>

            <!-- Brand Bars (Lengkap 10 Brand) -->
            <div class="space-y-3 max-h-80 overflow-y-auto pr-1">
              <div
                v-for="b in (showAllBrands ? brandDistribution : brandDistribution.slice(0, 6))"
                :key="b.brand"
                class="space-y-1 text-xs"
              >
                <div class="flex justify-between items-center font-medium">
                  <span class="font-bold text-slate-800"
                    >{{ b.brand }} ({{ b.modelsCount }} Model)</span
                  >
                  <span class="font-mono font-bold text-slate-700"
                    >{{ b.totalStock }} Unit</span
                  >
                </div>
                <div
                  class="h-2 w-full bg-slate-100 rounded-full overflow-hidden"
                >
                  <div
                    class="bg-blue-600 h-full rounded-full transition-all duration-300"
                    :style="{
                      width: `${Math.min(100, (b.totalStock / (totalInventoryStock || 1)) * 100)}%`,
                    }"
                  ></div>
                </div>
              </div>
            </div>

            <!-- Low Stock Warnings -->
            <div class="pt-4 border-t border-slate-100">
              <div class="flex items-center justify-between mb-3">
                <span
                  class="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1"
                >
                  <span
                    class="material-symbols-outlined text-amber-500 text-[16px]"
                    >warning</span
                  >
                  Peringatan Stok Menipis (&le; 3 Unit)
                </span>
                <span
                  class="text-xs font-mono font-bold px-2 py-0.5 rounded-full"
                  :class="
                    lowStockLaptops.length > 0
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  "
                >
                  {{ lowStockLaptops.length }} Konfigurasi
                </span>
              </div>

              <div
                v-if="lowStockLaptops.length === 0"
                class="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2"
              >
                <span class="material-symbols-outlined text-[18px]"
                  >verified</span
                >
                <span>Semua kapasitas alokasi node server berada dalam batas aman.</span>
              </div>
              <div v-else class="space-y-2 max-h-48 overflow-y-auto pr-1">
                <div
                  v-for="l in lowStockLaptops"
                  :key="l.id"
                  class="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200 flex items-center justify-between text-xs"
                >
                  <div class="truncate mr-2">
                    <span class="font-bold text-slate-900 block truncate"
                      >{{ l.brand }} {{ l.model }}</span
                    >
                    <span class="text-slate-500 text-[11px] font-mono">{{
                      formatIDR(l.price)
                    }}</span>
                  </div>
                  <div class="flex items-center gap-2 shrink-0">
                    <span
                      class="px-2 py-0.5 bg-rose-100 text-rose-800 font-bold font-mono rounded text-[11px]"
                    >
                      Sisa {{ l.stock }} Unit
                    </span>
                    <button
                      @click="openProductModal(l)"
                      class="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 3: Ringkasan Profil Kriteria Algoritma SAW -->
        <div
          class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4"
        >
          <div
            class="flex flex-col sm:flex-row sm:items-center justify-between gap-2"
          >
            <div>
              <h3 class="font-extrabold text-base text-slate-900">
                Konfigurasi Pembobotan Profil Pengguna (SPK SAW)
              </h3>
              <p class="text-xs text-slate-500 mt-0.5">
                Pemetaan prioritas 9 kriteria C1 (Biaya) hingga C9 (Support & DC) untuk setiap profil beban kerja server.
              </p>
            </div>
            <button
              @click="switchTab('profiles')"
              class="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
            >
              <span>Kelola Semua Profil</span>
              <span class="material-symbols-outlined text-[14px]"
                >arrow_forward</span
              >
            </button>
          </div>

          <div
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2"
          >
            <div
              v-for="p in profiles"
              :key="p.id"
              class="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-400 transition-colors"
            >
              <div class="flex items-center gap-2 mb-2">
                <div
                  class="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center"
                >
                  <span class="material-symbols-outlined text-[16px]">{{
                    p.icon_name || "person"
                  }}</span>
                </div>
                <h4 class="font-bold text-xs text-slate-900 truncate">
                  {{ p.name }}
                </h4>
              </div>
              <p
                class="text-[11px] text-slate-600 line-clamp-2 mb-3 leading-relaxed"
              >
                {{ p.description }}
              </p>
              <div
                class="grid grid-cols-3 gap-1 text-[10px] font-mono text-center"
              >
                <div
                  v-for="c in criteriaList.slice(0, 3)"
                  :key="c.id"
                  class="p-1 rounded bg-white border border-slate-200"
                >
                  <span class="text-slate-400 block">{{ c.code }}</span>
                  <span class="font-bold text-slate-800"
                    >{{ ((p.weights?.[c.id] || 0) * 100).toFixed(0) }}%</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 1: Kelola Katalog Infrastruktur & Komputasi -->
      <div v-if="activeTab === 'products'" class="space-y-6">
        <div
          class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200"
        >
          <div>
            <h1 class="text-xl font-bold tracking-tight text-slate-900">
              Manajemen Katalog Infrastruktur & Komputasi
            </h1>
            <p class="text-xs text-slate-500 mt-0.5">
              Kelola instans cloud server, dedicated GPU node, perbarui kapasitas alokasi, serta parameter kriteria teknis.
            </p>
          </div>
          <button
            @click="openProductModal()"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer self-start sm:self-auto"
          >
            <span class="material-symbols-outlined" style="font-size: 16px"
              >add</span
            >
            <span>Tambah Infrastruktur Baru</span>
          </button>
        </div>

        <!-- Infrastructure Master Table -->
        <div
          class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
        >
          <div
            class="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div class="text-sm font-medium text-slate-700">
              Total Unit:
              <strong class="text-slate-900 font-bold"
                >{{ filteredLaptops.length }} Unit Node</strong
              >
            </div>

            <!-- Search & Per Page Controls -->
            <div class="flex flex-wrap items-center gap-3">
              <div class="relative w-72">
                <span
                  class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 select-none pointer-events-none leading-none flex items-center justify-center"
                  style="font-size: 18px"
                  >search</span
                >
                <input
                  type="text"
                  v-model="productSearch"
                  placeholder="Filter nama instans server, provider, SKU..."
                  class="text-sm py-2 pl-9 pr-8 rounded-lg border border-slate-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 font-medium text-slate-900 placeholder:text-slate-500"
                />
                <button
                  type="button"
                  v-if="productSearch"
                  @click="productSearch = ''"
                  class="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full cursor-pointer transition-colors p-0"
                  title="Hapus pencarian"
                >
                  <span
                    class="material-symbols-outlined leading-none"
                    style="font-size: 14px"
                    >close</span
                  >
                </button>
              </div>

              <div
                class="flex items-center gap-1.5 text-xs text-slate-500 font-mono"
              >
                <span>Per Hal:</span>
                <select
                  v-model.number="productsPerPage"
                  @change="productCurrentPage = 1"
                  class="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-mono font-bold text-slate-700 outline-none"
                >
                  <option :value="5">5</option>
                  <option :value="10">10</option>
                  <option :value="20">20</option>
                </select>
              </div>

              <!-- Toggle Mode Edit Cepat Stok -->
              <button
                type="button"
                @click="isTableEditMode = !isTableEditMode"
                class="px-2.5 py-1 rounded-lg border text-xs font-medium flex items-center gap-1 transition-all cursor-pointer"
                :class="
                  isTableEditMode
                    ? 'bg-blue-50 border-blue-400 text-blue-700 font-semibold shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                "
                :title="
                  isTableEditMode
                    ? 'Kembali ke mode baca'
                    : 'Aktifkan input stok langsung di tabel'
                "
              >
                <span class="material-symbols-outlined" style="font-size: 15px">
                  {{ isTableEditMode ? "check" : "edit_note" }}
                </span>
                <span>{{
                  isTableEditMode ? "Mode Baca" : "Edit Cepat Stok"
                }}</span>
              </button>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-sm">
              <thead
                class="bg-slate-100/90 border-b border-slate-200 text-slate-700 uppercase font-mono text-xs font-bold tracking-wider"
              >
                <tr>
                  <th class="py-3 px-4 w-12 text-center">Foto</th>
                  <th class="py-3 px-4">Instans & Spesifikasi Node</th>
                  <th class="py-3 px-4">Provider / OEM</th>
                  <th class="py-3 px-4 text-right">Harga Resmi</th>
                  <th class="py-3 px-4 text-center">Kapasitas Node</th>
                  <th class="py-3 px-4">Spesifikasi Kunci</th>
                  <th class="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200">
                <tr v-if="filteredLaptops.length === 0">
                  <td colspan="7" class="py-12 text-center text-slate-500">
                    <span
                      class="material-symbols-outlined text-[40px] mb-1 text-slate-400"
                      >search_off</span
                    >
                    <p class="text-sm font-bold text-slate-700">
                      Tidak ada node infrastruktur yang cocok dengan filter "{{ productSearch }}"
                    </p>
                  </td>
                </tr>

                <tr
                  v-for="laptop in paginatedLaptops"
                  :key="laptop.id"
                  class="hover:bg-slate-50/80 transition-colors"
                >
                  <td class="py-3.5 px-4 text-center">
                    <div
                      class="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden mx-auto shrink-0"
                    >
                      <img
                        v-if="laptop.image_url"
                        :src="laptop.image_url"
                        :alt="laptop.model"
                        class="max-h-full max-w-full object-contain p-0.5"
                      />
                      <span
                        v-else
                        class="material-symbols-outlined text-slate-400"
                        style="font-size: 22px"
                        >dns</span
                      >
                    </div>
                  </td>
                  <td
                    class="py-3.5 px-4 font-bold text-slate-900 text-sm sm:text-base"
                  >
                    {{ laptop.brand }} {{ laptop.model }}
                    <span
                      v-if="laptop.sku"
                      class="block text-xs text-slate-600 font-mono font-medium mt-0.5"
                    >
                      SKU: {{ laptop.sku }}
                    </span>
                  </td>
                  <td
                    class="py-3.5 px-4 font-mono font-bold text-slate-800 uppercase text-xs sm:text-sm"
                  >
                    {{ laptop.brand }}
                  </td>
                  <td
                    class="py-3.5 px-4 text-right font-mono font-black text-slate-900 text-sm sm:text-base"
                  >
                    {{ formatIDR(laptop.price) }}
                  </td>
                  <td class="py-3.5 px-4 text-center">
                    <div
                      v-if="isTableEditMode"
                      class="inline-flex items-center gap-1.5"
                    >
                      <input
                        type="number"
                        min="0"
                        :value="laptop.stock"
                        @change="updateStock(laptop.id, $event.target.value)"
                        class="w-16 px-2 py-1 bg-white border-2 border-blue-500 rounded-lg text-center text-xs font-mono font-bold text-slate-900 outline-none shadow-xs"
                      />
                      <span class="text-xs font-mono font-bold text-slate-600"
                        >Unit</span
                      >
                    </div>
                    <span
                      v-else
                      class="px-3 py-1 rounded-md text-xs font-mono font-bold border inline-block"
                      :class="
                        laptop.stock > 0
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-rose-50 text-rose-800 border-rose-300'
                      "
                    >
                      {{ laptop.stock }} Unit
                    </span>
                  </td>
                  <td
                    class="py-3.5 px-4 text-slate-800 font-medium text-xs leading-relaxed"
                  >
                    <span class="font-semibold text-slate-900">{{
                      laptop.processor_name
                    }}</span>
                    •
                    <span class="font-bold text-blue-700"
                      >{{ laptop.ram_gb }}GB RAM</span
                    >
                    •
                    <span>{{
                      laptop.storage_desc || laptop.storage_gb + "GB NVMe"
                    }}</span>
                    •
                    <span class="text-emerald-700 font-semibold font-mono">SLA {{ laptop.battery_hours || 99.9 }}%</span>
                    •
                    <span class="text-slate-600 font-mono">{{ laptop.weight_kg ? laptop.weight_kg + ' Gbps' : '10 Gbps' }}</span>
                  </td>
                  <td class="py-3.5 px-4 text-center">
                    <div class="flex items-center justify-center gap-2">
                      <button
                        @click="openProductModal(laptop)"
                        class="w-8 h-8 rounded-lg border border-slate-300 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 flex items-center justify-center text-slate-700 transition-colors cursor-pointer shadow-xs"
                        title="Edit Data Infrastruktur"
                      >
                        <span
                          class="material-symbols-outlined"
                          style="font-size: 16px"
                          >edit</span
                        >
                      </button>
                      <button
                        @click="deleteLaptop(laptop.id)"
                        class="w-8 h-8 rounded-lg border border-slate-300 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 flex items-center justify-center text-slate-700 transition-colors cursor-pointer shadow-xs"
                        title="Hapus Node Infrastruktur"
                      >
                        <span
                          class="material-symbols-outlined"
                          style="font-size: 16px"
                          >delete</span
                        >
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination Footer -->
          <div
            v-if="filteredLaptops.length > 0"
            class="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-mono"
          >
            <div>
              Menampilkan
              <strong class="text-slate-800">{{
                productStartIndex + 1
              }}</strong>
              -
              <strong class="text-slate-800">{{ productEndIndex }}</strong> dari
              <strong class="text-slate-800">{{
                filteredLaptops.length
              }}</strong>
              unit node infrastruktur
            </div>

            <div class="flex items-center gap-1.5">
              <button
                @click="productCurrentPage--"
                :disabled="productCurrentPage <= 1"
                class="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-semibold transition-all flex items-center gap-1 cursor-pointer font-sans"
              >
                <span class="material-symbols-outlined" style="font-size: 14px"
                  >chevron_left</span
                >
                <span>Sebelumnya</span>
              </button>

              <div class="flex items-center gap-1">
                <button
                  v-for="p in totalProductPages"
                  :key="p"
                  @click="productCurrentPage = p"
                  class="w-7 h-7 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer"
                  :class="
                    productCurrentPage === p
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'border border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  "
                >
                  {{ p }}
                </button>
              </div>

              <button
                @click="productCurrentPage++"
                :disabled="productCurrentPage >= totalProductPages"
                class="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-semibold transition-all flex items-center gap-1 cursor-pointer font-sans"
              >
                <span>Selanjutnya</span>
                <span class="material-symbols-outlined" style="font-size: 14px"
                  >chevron_right</span
                >
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ==================== TAB 2: KELOLA PROFIL PENGGUNA & BOBOT ==================== -->
      <div v-if="activeTab === 'profiles'" class="space-y-6">
        <div
          class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200"
        >
          <div>
            <h1 class="text-xl font-bold tracking-tight text-slate-900">
              Manajemen Profil Pengguna & Pembobotan Kriteria
            </h1>
            <p class="text-xs text-slate-500 mt-0.5">
              Tambah persona profil baru atau sesuaikan bobot dinamis untuk
              algoritma rekomendasi.
            </p>
          </div>
          <button
            @click="openProfileModal"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer self-start sm:self-auto"
          >
            <span class="material-symbols-outlined" style="font-size: 16px"
              >person_add</span
            >
            <span>Tambah Profil Pengguna</span>
          </button>
        </div>

        <!-- Profiles Grid Cards matching admin.html -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            v-for="profile in profiles"
            :key="profile.id"
            class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4 flex flex-col justify-between"
          >
            <div>
              <div
                class="flex items-center justify-between pb-3 border-b border-slate-100"
              >
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-blue-600">{{
                    profile.icon_name || "tune"
                  }}</span>
                  <h3 class="font-bold text-sm text-slate-900">
                    {{ profile.name }}
                  </h3>
                </div>
                <span
                  class="text-xs font-mono font-bold px-2.5 py-1 rounded-md border"
                  :class="
                    isWeightValid(profile)
                      ? 'text-emerald-800 bg-emerald-50 border-emerald-300'
                      : 'text-rose-800 bg-rose-50 border-rose-300'
                  "
                >
                  Total {{ (calcTotalWeight(profile) * 100).toFixed(0) }}%
                </span>
              </div>

              <p
                class="text-xs text-slate-700 font-medium mb-3.5 line-clamp-2 leading-relaxed"
              >
                {{
                  profile.description ||
                  "Karakteristik preferensi kriteria untuk tipe pengguna ini."
                }}
              </p>

              <!-- Daftar Kriteria & Persentase Bobot (High Contrast & Clear Typography) -->
              <div class="space-y-2 text-xs sm:text-sm">
                <div
                  v-for="c in criteriaList"
                  :key="c.id"
                  class="flex justify-between items-center py-0.5"
                >
                  <span class="text-slate-700 font-semibold">
                    {{ c.name }}
                    <span class="text-slate-500 font-normal"
                      >({{ c.code }} -
                      {{ c.id === 1 ? "Cost" : "Benefit" }})</span
                    >
                  </span>
                  <span
                    class="font-mono font-bold text-slate-900 text-xs sm:text-sm"
                  >
                    {{ ((profile.weights[c.id] || 0) * 100).toFixed(0) }}%
                  </span>
                </div>
              </div>
            </div>

            <!-- Footer: Aksi Ikon Simbol Saja -->
            <div
              class="pt-3 border-t border-slate-100 flex items-center justify-end gap-2"
            >
              <button
                @click="openProfileModal(profile)"
                class="w-8 h-8 rounded-lg border border-slate-300 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 flex items-center justify-center text-slate-700 transition-colors cursor-pointer shadow-xs"
                title="Edit Profil & Bobot"
              >
                <span class="material-symbols-outlined" style="font-size: 16px"
                  >edit</span
                >
              </button>
              <button
                @click="deleteProfile(profile.id)"
                class="w-8 h-8 rounded-lg border border-slate-300 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 flex items-center justify-center text-slate-700 transition-colors cursor-pointer shadow-xs"
                title="Hapus Profil"
              >
                <span class="material-symbols-outlined" style="font-size: 16px"
                  >delete</span
                >
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ==================== TAB 3: PESANAN MASUK ==================== -->
      <div v-if="activeTab === 'orders'" class="space-y-6">
        <div
          class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200"
        >
          <div>
            <h1 class="text-xl font-bold tracking-tight text-slate-900">
              Riwayat Pesanan Pelanggan
            </h1>
            <p class="text-xs text-slate-500 mt-0.5">
              Daftar transaksi masuk melalui Web Tamu (Guest Checkout) maupun pesanan kredit via PIC Sales Consultant.
            </p>
          </div>
        </div>

        <div
          class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
        >
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs">
              <thead
                class="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-mono"
              >
                <tr>
                  <th class="py-3 px-4">No. Faktur</th>
                  <th class="py-3 px-4">Nama Pelanggan</th>
                  <th class="py-3 px-4">PIC / Kanal</th>
                  <th class="py-3 px-4">Unit Infrastruktur</th>
                  <th class="py-3 px-4">Metode Bayar</th>
                  <th class="py-3 px-4 text-right">Total Bayar</th>
                  <th class="py-3 px-4 text-center">Status</th>
                  <th class="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 font-mono">
                <tr v-if="orders.length === 0">
                  <td
                    colspan="8"
                    class="py-12 text-center text-slate-400 font-sans"
                  >
                    Belum ada transaksi pesanan yang masuk.
                  </td>
                </tr>
                <tr
                  v-for="order in orders"
                  :key="order.id"
                  class="hover:bg-slate-50"
                >
                  <td class="py-3.5 px-4 font-bold text-blue-600">
                    {{ order.order_number }}
                  </td>
                  <td
                    class="py-3.5 px-4 font-sans font-semibold text-slate-900"
                  >
                    <div>{{ order.customer_name }}</div>
                    <div class="text-[10px] text-slate-400 font-mono">{{ order.customer_phone }}</div>
                  </td>
                  <td class="py-3.5 px-4 font-sans">
                    <span
                      v-if="order.sales_name"
                      class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200"
                    >
                      <span class="material-symbols-outlined text-[13px]">support_agent</span>
                      <span>Sales: {{ order.sales_name }}</span>
                    </span>
                    <span
                      v-else
                      class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200"
                    >
                      <span class="material-symbols-outlined text-[13px]">language</span>
                      <span>Web Tamu</span>
                    </span>
                  </td>
                  <td class="py-3.5 px-4 font-sans text-slate-800">
                    <div>
                      {{
                        order.laptop
                          ? order.laptop.brand + " " + order.laptop.model
                          : order.laptop_name || "-"
                      }}
                    </div>
                    <div v-if="order.is_credit" class="mt-0.5">
                      <span class="inline-block text-[10px] bg-emerald-50 border border-emerald-200 text-emerald-700 px-1.5 py-0.2 rounded font-medium">
                        💳 Kredit {{ order.credit_tenor }}x ({{ order.financing_provider || 'Cicilan' }})
                      </span>
                    </div>
                  </td>
                  <td class="py-3.5 px-4 uppercase font-sans text-slate-700">
                    {{ order.bank_name || order.payment_method || "VA Bank" }}
                  </td>
                  <td class="py-3.5 px-4 text-right font-bold text-slate-900">
                    {{ formatIDR(order.total_amount) }}
                  </td>
                  <td class="py-3.5 px-4 text-center">
                    <span
                      class="px-2.5 py-1 rounded-full text-[10px] font-bold border inline-block"
                      :class="
                        order.payment_status === 'paid'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      "
                    >
                      {{
                        order.payment_status === "paid" ? "✓ LUNAS" : "⏳ PENDING"
                      }}
                    </span>
                  </td>
                  <td class="py-3.5 px-4 text-center">
                    <div class="flex items-center justify-center gap-1.5 font-sans">
                      <button
                        v-if="order.payment_status === 'pending'"
                        @click="confirmOrderPayment(order)"
                        :id="`btn-admin-verify-${order.id}`"
                        class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer transition-colors"
                        title="Verifikasi Pembayaran & Setujui Pesanan"
                      >
                        <span class="material-symbols-outlined text-[13px]">check_circle</span>
                        <span>Verifikasi</span>
                      </button>
                      <router-link
                        :to="`/pesanan/${order.order_number}?from=admin`"
                        class="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-medium"
                        title="Buka Dokumen Faktur"
                      >
                        <span class="material-symbols-outlined text-[13px]">receipt</span>
                        <span>Faktur</span>
                      </router-link>
                      <router-link
                        :to="`/cek-pesanan?q=${order.order_number}&from=admin`"
                        class="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold"
                        title="Pantau Siklus Provisioning & SLA"
                      >
                        <span class="material-symbols-outlined text-[13px]">local_shipping</span>
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

      <!-- ==================== TAB 4: AUDIT MATRIKS SAW (SIDANG) ==================== -->
      <div v-if="activeTab === 'saw'" class="space-y-6">
        <div
          class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200"
        >
          <div>
            <div
              class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[11px] font-mono font-bold mb-1 border border-blue-200"
            >
              Khusus Kebutuhan Audit Akademik / Sidang
            </div>
            <h1 class="text-xl font-bold tracking-tight text-slate-900">
              Transparansi Perhitungan Algoritma SAW
            </h1>
            <p class="text-xs text-slate-500 mt-0.5">
              Tinjau Matriks Keputusan Awal (X), Matriks Normalisasi (R), dan
              Nilai Preferensi (V).
            </p>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs font-mono font-bold text-slate-500"
              >Profil Aktif:</span
            >
            <select
              v-model="auditProfileId"
              @change="fetchSawAudit"
              class="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800 font-mono shadow-xs"
            >
              <option v-for="p in profiles" :key="p.id" :value="p.id">
                {{ p.name }}
              </option>
            </select>
          </div>
        </div>

        <!-- Matriks 1: Keputusan Awal (X) -->
        <div
          class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3"
        >
          <div class="flex items-center justify-between">
            <h3 class="font-bold text-sm text-slate-900">
              1. Matriks Keputusan Awal (X)
            </h3>
            <span class="text-[11px] font-mono text-slate-400"
              >C1: Cost, C2-C6: Benefit</span
            >
          </div>
          <div class="overflow-x-auto border border-slate-200 rounded-lg">
            <table class="w-full text-left border-collapse text-xs font-mono">
              <thead
                class="bg-slate-50 border-b border-slate-200 text-slate-500"
              >
                <tr>
                  <th class="py-2.5 px-3">Alternatif Infrastruktur</th>
                  <th
                    v-for="c in criteriaList"
                    :key="c.id"
                    class="py-2.5 px-3 text-right"
                    :class="
                      c.code === 'C1' ? 'text-rose-600' : 'text-emerald-600'
                    "
                  >
                    {{ c.code }}: {{ c.name }}
                    {{ c.code === "C1" ? "[Cost]" : "[Benefit]" }}
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr
                  v-for="row in sawAuditData?.rawMatrix"
                  :key="row.laptop_id"
                  class="hover:bg-slate-50"
                >
                  <td
                    class="py-2.5 px-3 font-sans font-semibold text-slate-900"
                  >
                    {{ row.brand }} {{ row.model }}
                  </td>
                  <td
                    v-for="c in criteriaList"
                    :key="c.id"
                    class="py-2.5 px-3 text-right font-mono"
                    :class="c.code === 'C1' ? 'font-bold' : ''"
                  >
                    {{
                      c.code === "C1"
                        ? formatIDR(row.scores[c.id])
                        : row.scores[c.id]
                    }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Matriks 2 & 3: Normalisasi (R) & Perangkingan (V) -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div
            class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3"
          >
            <h3 class="font-bold text-sm text-slate-900">
              2. Matriks Normalisasi (R)
            </h3>
            <div
              class="overflow-x-auto border border-slate-200 rounded-lg max-h-96"
            >
              <table class="w-full text-left border-collapse text-xs font-mono">
                <thead
                  class="bg-slate-50 border-b border-slate-200 text-slate-500 sticky top-0 bg-slate-50"
                >
                  <tr>
                    <th class="py-2 px-3">Alternatif</th>
                    <th
                      v-for="c in criteriaList"
                      :key="c.id"
                      class="py-2 px-3 text-right"
                    >
                      r_{{ c.id }}
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <tr
                    v-for="row in sawAuditData?.normalizedMatrix"
                    :key="row.laptop_id"
                    class="hover:bg-slate-50"
                  >
                    <td class="py-2 px-3 font-sans truncate max-w-[140px]">
                      {{ row.brand }} {{ row.model }}
                    </td>
                    <td
                      v-for="c in criteriaList"
                      :key="c.id"
                      class="py-2 px-3 text-right font-mono text-slate-700"
                    >
                      {{
                        Number(
                          row.scores
                            ? row.scores[c.id]
                            : row.normalizedScores
                              ? row.normalizedScores[c.id]
                              : 0,
                        ).toFixed(4)
                      }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div
            class="bg-white rounded-xl border-2 border-blue-600/30 p-5 shadow-sm space-y-3"
          >
            <h3 class="font-bold text-sm text-slate-900">
              3. Perangkingan Akhir Nilai Preferensi (V)
            </h3>
            <div
              class="overflow-x-auto border border-slate-200 rounded-lg max-h-96"
            >
              <table class="w-full text-left border-collapse text-xs font-mono">
                <thead
                  class="bg-slate-50 border-b border-slate-200 text-slate-500 sticky top-0 bg-slate-50"
                >
                  <tr>
                    <th class="py-2 px-3 text-center">Rank</th>
                    <th class="py-2 px-3">Alternatif Infrastruktur</th>
                    <th class="py-2 px-3 text-right">Nilai V</th>
                    <th class="py-2 px-3 text-center">Hasil</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <tr
                    v-for="item in sawAuditData?.results"
                    :key="item.laptop_id"
                    :class="
                      item.rank === 1 ? 'bg-blue-50/50' : 'hover:bg-slate-50'
                    "
                  >
                    <td
                      class="py-2 px-3 text-center font-bold"
                      :class="
                        item.rank === 1 ? 'text-blue-600' : 'text-slate-600'
                      "
                    >
                      #{{ item.rank }}
                    </td>
                    <td
                      class="py-2 px-3 font-sans"
                      :class="
                        item.rank === 1
                          ? 'font-bold text-blue-950'
                          : 'font-medium text-slate-800'
                      "
                    >
                      {{ item.brand }} {{ item.model }}
                    </td>
                    <td
                      class="py-2 px-3 text-right font-bold"
                      :class="
                        item.rank === 1 ? 'text-blue-600' : 'text-slate-700'
                      "
                    >
                      {{ item.preferenceScore }}
                    </td>
                    <td class="py-2 px-3 text-center">
                      <span
                        class="px-2 py-0.5 rounded text-[10px] font-bold"
                        :class="
                          item.rank === 1
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-700'
                        "
                      >
                        {{ item.matchPercentage }}%
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Infrastructure Add / Edit Modal -->
    <div
      v-if="showProductModal"
      class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div
        class="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full p-6 sm:p-8 shadow-xl max-h-[90vh] overflow-y-auto"
      >
        <div
          class="flex items-center justify-between pb-4 border-b border-slate-100 mb-6"
        >
          <h3 class="font-extrabold text-slate-900 text-base">
            {{ editingLaptop ? "Ubah Data Infrastruktur" : "Tambah Node Infrastruktur Baru" }}
          </h3>
          <button
            @click="showProductModal = false"
            class="text-slate-400 hover:text-slate-600"
          >
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form @submit.prevent="saveLaptop" class="space-y-4 text-xs">
          <!-- Visualisasi Arsitektur / Foto Perangkat -->
          <div
            class="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5"
          >
            <div class="flex items-center justify-between">
              <label
                class="block font-bold text-slate-700 uppercase tracking-wider text-[11px]"
              >
                Visualisasi Arsitektur / Foto Perangkat
              </label>
              <button
                type="button"
                @click="showDirectUrlInput = !showDirectUrlInput"
                class="text-blue-600 hover:text-blue-700 text-[11px] font-semibold cursor-pointer"
              >
                {{
                  showDirectUrlInput
                    ? "Sembunyikan Input URL"
                    : "Atau input via URL Web"
                }}
              </button>
            </div>

            <input
              ref="imageFileInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleImageFileChange"
            />

            <!-- Preview & Upload Button -->
            <div class="flex items-center gap-3">
              <div
                class="w-16 h-16 rounded-xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 shadow-xs"
              >
                <img
                  v-if="laptopForm.image_url"
                  :src="laptopForm.image_url"
                  alt="Preview"
                  class="max-h-full max-w-full object-contain p-1"
                />
                <span
                  v-else
                  class="material-symbols-outlined text-slate-300 text-[28px]"
                >
                  image
                </span>
              </div>

              <div class="flex-1 space-y-1.5">
                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    @click="triggerImageUpload"
                    :disabled="isUploadingImage"
                    class="px-3 py-1.5 bg-white border border-slate-200 hover:border-blue-500 hover:text-blue-600 text-slate-700 rounded-xl font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <span class="material-symbols-outlined text-[16px]"
                      >upload</span
                    >
                    <span>{{
                      laptopForm.image_url
                        ? "Ganti Foto"
                        : "Unggah Foto dari Komputer"
                    }}</span>
                  </button>
                  <button
                    v-if="laptopForm.image_url"
                    type="button"
                    @click="removeImage"
                    class="px-2.5 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl font-bold text-xs transition-all cursor-pointer"
                  >
                    Hapus Foto
                  </button>
                </div>
                <p class="text-[11px] text-slate-400">
                  Format didukung: PNG, JPG, WebP. Otomatis disimpan langsung ke
                  database.
                </p>
              </div>
            </div>

            <!-- Fallback Direct URL Input -->
            <div
              v-if="showDirectUrlInput"
              class="pt-2 border-t border-slate-200"
            >
              <label class="block font-semibold text-slate-500 mb-1 text-[11px]"
                >URL Gambar Langsung (Web Link):</label
              >
              <input
                type="url"
                v-model="laptopForm.image_url"
                placeholder="https://example.com/gambar-server-gpu.jpg"
                class="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <!-- Provider, Model & Kategori Infrastruktur -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <div class="flex items-center justify-between mb-1">
                <label class="block font-bold text-slate-500 uppercase text-[11px]"
                  >Provider / OEM</label
                >
                <button
                  type="button"
                  @click="toggleBrandMode"
                  class="text-blue-600 hover:text-blue-700 text-[11px] font-semibold cursor-pointer"
                >
                  {{ isCustomBrand ? "List" : "+ Ketik" }}
                </button>
              </div>

              <!-- Brand Dropdown -->
              <select
                v-if="!isCustomBrand"
                v-model="laptopForm.brand"
                required
                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-blue-500 focus:bg-white font-medium"
              >
                <option value="" disabled>-- Pilih Provider / Vendor OEM --</option>
                <option v-for="b in brandList" :key="b" :value="b">
                  {{ b }}
                </option>
              </select>

              <!-- Brand Custom Input -->
              <input
                v-else
                type="text"
                v-model="laptopForm.brand"
                placeholder="Contoh: RunPod, Supermicro..."
                required
                class="w-full bg-white border border-blue-400 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="block font-bold text-slate-500 uppercase text-[11px] mb-1"
                >Model / Seri Instans Node</label
              >
              <input
                type="text"
                v-model="laptopForm.model"
                placeholder="Contoh: EC2 c6i.4xlarge, Lambda 4x A6000..."
                required
                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>

            <div>
              <label class="block font-bold text-slate-500 uppercase text-[11px] mb-1"
                >Kategori Infrastruktur</label
              >
              <select
                v-model="laptopForm.category"
                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-blue-500 focus:bg-white font-medium"
              >
                <option value="shared_server">Shared Hosting / VPS Budget</option>
                <option value="cloud_instance">Cloud Server / VM Node</option>
                <option value="gpu_rig">Dedicated AI GPU Rig</option>
              </select>
            </div>
          </div>

          <!-- Harga dengan Anti-Typo & Multiplier -->
          <div
            class="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2"
          >
            <div class="flex items-center justify-between">
              <label
                class="block font-bold text-slate-700 uppercase tracking-wider text-[11px]"
              >
                Harga Resmi (IDR)
              </label>
              <!-- Spelling Readout -->
              <span class="text-xs font-extrabold text-blue-700">
                {{ spellOutRupiah(laptopForm.price) }}
              </span>
            </div>

            <div class="relative">
              <span class="absolute left-3 top-2 font-bold text-slate-400"
                >Rp</span
              >
              <input
                type="number"
                v-model.number="laptopForm.price"
                min="0"
                step="50000"
                required
                class="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-3 py-2 text-sm font-bold text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div
              class="flex items-center justify-between gap-2 flex-wrap pt-1 text-[11px]"
            >
              <span class="text-slate-400 font-medium"
                >Bantuan Cepat (Cegah Typo Nol):</span
              >
              <div class="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  @click="adjustPrice(1000000)"
                  class="px-2 py-0.5 bg-white border border-slate-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 rounded-lg font-semibold text-slate-700 cursor-pointer transition-all"
                >
                  +1 Jt
                </button>
                <button
                  type="button"
                  @click="adjustPrice(5000000)"
                  class="px-2 py-0.5 bg-white border border-slate-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 rounded-lg font-semibold text-slate-700 cursor-pointer transition-all"
                >
                  +5 Jt
                </button>
                <button
                  type="button"
                  @click="adjustPrice(10000000)"
                  class="px-2 py-0.5 bg-white border border-slate-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 rounded-lg font-semibold text-slate-700 cursor-pointer transition-all"
                >
                  +10 Jt
                </button>
                <button
                  type="button"
                  @click="multiplyPrice(10)"
                  title="Tambah satu digit nol di belakang"
                  class="px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 rounded-lg font-bold cursor-pointer transition-all"
                >
                  x10 (+0)
                </button>
                <button
                  type="button"
                  @click="dividePrice(10)"
                  title="Hapus satu digit nol di belakang"
                  class="px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 rounded-lg font-bold cursor-pointer transition-all"
                >
                  /10 (-0)
                </button>
              </div>
            </div>
          </div>

          <!-- Stok & RAM -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block font-bold text-slate-500 uppercase mb-1"
                >Kapasitas Node Tersedia</label
              >
              <input
                type="number"
                min="0"
                v-model.number="laptopForm.stock"
                required
                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>
            <div>
              <label class="block font-bold text-slate-500 uppercase mb-1"
                >Kapasitas RAM ECC (GB)</label
              >
              <input
                type="number"
                min="1"
                v-model.number="laptopForm.ram_gb"
                required
                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block font-bold text-slate-500 uppercase mb-1"
                >Nama Prosesor</label
              >
              <input
                type="text"
                v-model="laptopForm.processor_name"
                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
              />
            </div>
            <div>
              <label class="block font-bold text-slate-500 uppercase mb-1"
                >Skor CPU (1-100)</label
              >
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                v-model.number="laptopForm.processor_score"
                @input="limitTwoDecimals($event, laptopForm, 'processor_score')"
                @blur="roundToTwoDecimals(laptopForm, 'processor_score')"
                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block font-bold text-slate-500 uppercase mb-1"
                >Kartu Grafis (GPU)</label
              >
              <input
                type="text"
                v-model="laptopForm.gpu_name"
                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
              />
            </div>
            <div>
              <label class="block font-bold text-slate-500 uppercase mb-1"
                >Skor GPU (1-100)</label
              >
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                v-model.number="laptopForm.gpu_score"
                @input="limitTwoDecimals($event, laptopForm, 'gpu_score')"
                @blur="roundToTwoDecimals(laptopForm, 'gpu_score')"
                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
              />
            </div>
          </div>

          <div class="grid grid-cols-3 gap-4">
            <div>
              <label class="block font-bold text-slate-500 uppercase mb-1"
                >Storage (GB)</label
              >
              <input
                type="number"
                v-model.number="laptopForm.storage_gb"
                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
              />
            </div>
            <div>
              <label class="block font-bold text-slate-500 uppercase mb-1"
                >Garansi Uptime SLA (%)</label
              >
              <input
                type="number"
                step="0.01"
                min="90"
                max="100"
                placeholder="Contoh: 99.95"
                v-model.number="laptopForm.battery_hours"
                @input="limitTwoDecimals($event, laptopForm, 'battery_hours')"
                @blur="roundToTwoDecimals(laptopForm, 'battery_hours')"
                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
              />
            </div>
            <div>
              <label class="block font-bold text-slate-500 uppercase mb-1"
                >Port Bandwidth (Gbps)</label
              >
              <input
                type="number"
                step="0.1"
                min="0"
                placeholder="Contoh: 10 atau 25"
                v-model.number="laptopForm.weight_kg"
                @input="limitTwoDecimals($event, laptopForm, 'weight_kg')"
                @blur="roundToTwoDecimals(laptopForm, 'weight_kg')"
                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
              />
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              @click="showProductModal = false"
              class="px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-sm"
            >
              Simpan Data Infrastruktur
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Profile Add / Edit Modal -->
    <div
      v-if="showProfileModal"
      class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div
        class="bg-white rounded-3xl border border-slate-200 max-w-xl w-full p-6 sm:p-8 shadow-xl max-h-[90vh] overflow-y-auto"
      >
        <div
          class="flex items-center justify-between pb-4 border-b border-slate-100 mb-6"
        >
          <div class="flex items-center gap-2.5">
            <div
              class="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"
            >
              <span class="material-symbols-outlined text-[20px]">{{
                editingProfile ? "edit" : "person_add"
              }}</span>
            </div>
            <div>
              <h3 class="font-extrabold text-slate-900 text-base">
                {{
                  editingProfile
                    ? "Ubah Profil Pengguna"
                    : "Tambah Profil Pengguna Baru"
                }}
              </h3>
              <p class="text-[11px] text-slate-400">
                {{
                  editingProfile
                    ? "Sesuaikan nama, ikon, deskripsi, dan pembobotan kriteria SAW (Total 100%)"
                    : "Tentukan profil preferensi dan distribusi bobot kriteria SAW (Total 100%)"
                }}
              </p>
            </div>
          </div>
          <button
            @click="showProfileModal = false"
            class="text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form @submit.prevent="saveProfile" class="space-y-4 text-xs">
          <div>
            <label class="block font-bold text-slate-500 uppercase mb-1"
              >Nama Profil Pengguna *</label
            >
            <input
              type="text"
              v-model="profileForm.name"
              required
              placeholder="Contoh: Desainer Grafis & 3D, Data Scientist, dsb."
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block font-bold text-slate-500 uppercase mb-1"
                >Pilihan Ikon Profil</label
              >
              <select
                v-model="profileForm.icon_name"
                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 outline-none"
              >
                <option value="palette">palette (Desain / Seni)</option>
                <option value="terminal">
                  terminal (Programmer / Developer)
                </option>
                <option value="analytics">analytics (Data / Analis)</option>
                <option value="draw">draw (Ilustrator / Konten)</option>
                <option value="camera">camera (Fotografi / Video)</option>
                <option value="business_center">
                  business_center (Bisnis / Eksekutif)
                </option>
                <option value="school">school (Pelajar / Edukasi)</option>
                <option value="work">work (Pekerja / Kantor)</option>
                <option value="sports_esports">
                  sports_esports (Gaming / Esports)
                </option>
              </select>
            </div>
            <div>
              <label class="block font-bold text-slate-500 uppercase mb-1"
                >Slug URL (Opsional)</label
              >
              <input
                type="text"
                v-model="profileForm.slug"
                placeholder="desainer-grafis"
                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono outline-none"
              />
            </div>
          </div>

          <div>
            <label class="block font-bold text-slate-500 uppercase mb-1"
              >Deskripsi Profil</label
            >
            <textarea
              v-model="profileForm.description"
              rows="2"
              placeholder="Jelaskan kebutuhan utama tipe pengguna ini (misal: prioritas grafis tinggi, RAM besar, layar warna akurat)..."
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none"
            ></textarea>
          </div>

          <!-- Weights input for 6 criteria -->
          <div class="pt-3 border-t border-slate-100">
            <div class="flex items-center justify-between mb-3">
              <label class="font-bold text-slate-500 uppercase"
                >Distribusi Bobot Kriteria</label
              >
              <span
                class="text-xs font-extrabold"
                :class="
                  isNewProfileWeightValid ? 'text-emerald-600' : 'text-rose-600'
                "
              >
                Total: {{ (newProfileTotalWeight * 100).toFixed(0) }}%
                {{ isNewProfileWeightValid ? "(Valid)" : "(Wajib 100%)" }}
              </span>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div
                v-for="c in criteriaList"
                :key="c.id"
                class="p-2.5 rounded-xl bg-slate-50 border border-slate-200"
              >
                <span class="font-bold text-slate-700 block truncate"
                  >{{ c.code }}: {{ c.name }}</span
                >
                <div class="flex items-center gap-1 mt-1.5">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    v-model.number="profileForm.weights[c.id]"
                    @input="limitTwoDecimals($event, profileForm.weights, c.id)"
                    @blur="roundToTwoDecimals(profileForm.weights, c.id)"
                    class="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-right font-bold text-xs"
                  />
                  <span class="text-[10px] text-slate-400 font-mono"
                    >({{
                      ((profileForm.weights[c.id] || 0) * 100).toFixed(0)
                    }}%)</span
                  >
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              @click="showProfileModal = false"
              class="px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              :disabled="!isNewProfileWeightValid || savingProfile"
              class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5"
            >
              <span
                v-if="savingProfile"
                class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"
              ></span>
              <span>{{
                editingProfile ? "Perbarui Profil" : "Simpan Profil"
              }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { useAuthStore } from "../stores/authStore";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const editingProfile = ref(null);
const showProfileModal = ref(false);
const savingProfile = ref(false);
const profileForm = ref({
  name: "",
  slug: "",
  description: "",
  icon_name: "palette",
  weights: {
    1: 0.2,
    2: 0.25,
    3: 0.2,
    4: 0.15,
    5: 0.1,
    6: 0.1,
  },
});

const newProfileTotalWeight = computed(() => {
  if (!profileForm.value.weights) return 0;
  return Object.values(profileForm.value.weights).reduce(
    (sum, v) => sum + (parseFloat(v) || 0),
    0,
  );
});

const isNewProfileWeightValid = computed(() => {
  return Math.abs(newProfileTotalWeight.value - 1.0) < 0.05;
});

// Helper untuk membatasi ketikan atau paste maksimal 2 digit di belakang koma pada form
function limitTwoDecimals(event, targetObj, field) {
  let val = event.target.value;
  if (val === undefined || val === null || val === "") return;
  val = String(val).replace(",", ".");
  if (val.includes(".")) {
    const parts = val.split(".");
    if (parts[1] && parts[1].length > 2) {
      const fixed = `${parts[0]}.${parts[1].slice(0, 2)}`;
      event.target.value = fixed;
      targetObj[field] = parseFloat(fixed);
    }
  }
}

function roundToTwoDecimals(targetObj, field) {
  if (
    targetObj[field] !== null &&
    targetObj[field] !== undefined &&
    targetObj[field] !== ""
  ) {
    targetObj[field] = parseFloat(Number(targetObj[field]).toFixed(2));
  }
}

// Mode Edit Cepat di Tabel Infrastruktur (Default: Read Mode)
const isTableEditMode = ref(false);

// Mode Edit Inline pada Card Profile (Default: Read Mode / null)
const editingCardProfileId = ref(null);
const tempCardWeights = ref({});

function startCardEdit(profile) {
  editingCardProfileId.value = profile.id;
  tempCardWeights.value = { ...profile.weights };
}

function cancelCardEdit() {
  editingCardProfileId.value = null;
  tempCardWeights.value = {};
}

const isTempWeightValid = computed(() => {
  if (!tempCardWeights.value) return false;
  const total = Object.values(tempCardWeights.value).reduce(
    (sum, v) => sum + (parseFloat(v) || 0),
    0,
  );
  return Math.abs(total - 1.0) < 0.05;
});

function calcTempTotalWeight() {
  if (!tempCardWeights.value) return 0;
  return Object.values(tempCardWeights.value).reduce(
    (sum, v) => sum + (parseFloat(v) || 0),
    0,
  );
}

async function saveCardEdit(profile) {
  if (!isTempWeightValid.value) {
    alert("Total bobot harus bernilai 100%!");
    return;
  }
  try {
    const res = await axios.put(`/api/profiles/${profile.id}/weights`, {
      weights: tempCardWeights.value,
    });
    if (res.data.success) {
      alert("Bobot kriteria profil berhasil disimpan!");
      profile.weights = { ...tempCardWeights.value };
      editingCardProfileId.value = null;
    }
  } catch (err) {
    alert(err.response?.data?.message || "Gagal menyimpan bobot");
  }
}

const validTabs = ["executive", "products", "profiles", "orders", "saw"];
const initialTab =
  route.query.tab && validTabs.includes(route.query.tab)
    ? route.query.tab
    : localStorage.getItem("smartinfra_admin_tab") &&
        validTabs.includes(localStorage.getItem("smartinfra_admin_tab"))
      ? localStorage.getItem("smartinfra_admin_tab")
      : "executive";

const activeTab = ref(initialTab);

function switchTab(tabName) {
  if (!validTabs.includes(tabName)) return;
  activeTab.value = tabName;
  localStorage.setItem("smartinfra_admin_tab", tabName);
  router.replace({ query: { ...route.query, tab: tabName } });
  if (tabName === "orders" || tabName === "executive") {
    fetchOrders();
  }
}

// Executive Dashboard Computed Metrics
const totalRevenue = computed(() => {
  return orders.value
    .filter((o) => o.payment_status === "paid")
    .reduce((sum, o) => sum + (parseFloat(o.total_amount) || 0), 0);
});

const pendingRevenue = computed(() => {
  return orders.value
    .filter((o) => o.payment_status !== "paid")
    .reduce((sum, o) => sum + (parseFloat(o.total_amount) || 0), 0);
});

const paidOrdersCount = computed(() => {
  return orders.value.filter((o) => o.payment_status === "paid").length;
});

const pendingOrdersCount = computed(() => {
  return orders.value.filter((o) => o.payment_status !== "paid").length;
});

const conversionRate = computed(() => {
  if (!orders.value.length) return 0;
  return Math.round((paidOrdersCount.value / orders.value.length) * 100);
});

const avgOrderValue = computed(() => {
  if (!paidOrdersCount.value) return 0;
  return Math.round(totalRevenue.value / paidOrdersCount.value);
});

const totalInventoryStock = computed(() => {
  return laptops.value.reduce(
    (sum, l) => sum + (parseInt(l.stock, 10) || 0),
    0,
  );
});

const totalInventoryValuation = computed(() => {
  return laptops.value.reduce(
    (sum, l) => sum + (parseFloat(l.price) || 0) * (parseInt(l.stock, 10) || 0),
    0,
  );
});

const lowStockLaptops = computed(() => {
  return laptops.value.filter((l) => (parseInt(l.stock, 10) || 0) <= 3);
});

const brandDistribution = computed(() => {
  const counts = {};
  laptops.value.forEach((l) => {
    const b = (l.brand || "Lainnya").trim();
    if (!counts[b]) counts[b] = { count: 0, stock: 0 };
    counts[b].count += 1;
    counts[b].stock += parseInt(l.stock, 10) || 0;
  });
  return Object.keys(counts)
    .map((k) => ({
      brand: k,
      modelsCount: counts[k].count,
      totalStock: counts[k].stock,
    }))
    .sort((a, b) => b.modelsCount - a.modelsCount);
});

const showAllBrands = ref(true);

const recentOrdersList = computed(() => {
  return [...orders.value].slice(0, 5);
});

watch(
  () => route.query.tab,
  (newTab) => {
    if (newTab && validTabs.includes(newTab) && newTab !== activeTab.value) {
      activeTab.value = newTab;
      localStorage.setItem("smartinfra_admin_tab", newTab);
    }
  },
);
const laptops = ref([]);
const profiles = ref([]);
const orders = ref([]);
const criteriaList = ref([
  { id: 1, code: "C1", name: "Biaya Sewa / Investasi", fullName: "Biaya Sewa / Investasi Bulanan", type: "cost" },
  { id: 2, code: "C2", name: "Kekuatan Processor (vCPU)", fullName: "Kekuatan Komputasi Processor (CPU)", type: "benefit" },
  { id: 3, code: "C3", name: "Kapasitas RAM ECC", fullName: "Kapasitas Memori Sistem (RAM)", type: "benefit" },
  { id: 4, code: "C4", name: "Storage NVMe Enterprise", fullName: "Performa & Kapasitas Storage", type: "benefit" },
  { id: 5, code: "C5", name: "Akselerator AI & GPU VRAM", fullName: "Kapasitas AI & GPU VRAM", type: "benefit" },
  { id: 6, code: "C6", name: "Konektivitas & Bandwidth", fullName: "Konektivitas & Bandwidth Jaringan", type: "benefit" },
  { id: 7, code: "C7", name: "Garansi Uptime SLA", fullName: "Garansi Keandalan Uptime SLA", type: "benefit" },
  { id: 8, code: "C8", name: "Proteksi Keamanan Anti-DDoS", fullName: "Proteksi Keamanan Anti-DDoS & Skalabilitas", type: "benefit" },
  { id: 9, code: "C9", name: "Support 24/7 & Zona DC", fullName: "Dukungan Teknis 24/7 & Zona Data Center", type: "benefit" },
]);

const auditProfileId = ref(1);
const sawAuditData = ref(null);

// Search & Pagination untuk Laptop di Tab Kelola Laptop
const productSearch = ref("");
const productCurrentPage = ref(1);
const productsPerPage = ref(10);

const filteredLaptops = computed(() => {
  if (!productSearch.value.trim()) {
    return laptops.value;
  }
  const q = productSearch.value.toLowerCase().trim();
  return laptops.value.filter((l) => {
    return (
      (l.brand && l.brand.toLowerCase().includes(q)) ||
      (l.model && l.model.toLowerCase().includes(q)) ||
      (l.sku && l.sku.toLowerCase().includes(q)) ||
      (l.processor_name && l.processor_name.toLowerCase().includes(q)) ||
      (l.gpu_name && l.gpu_name.toLowerCase().includes(q))
    );
  });
});

const totalProductPages = computed(() => {
  return Math.ceil(filteredLaptops.value.length / productsPerPage.value) || 1;
});

const productStartIndex = computed(() => {
  return (productCurrentPage.value - 1) * productsPerPage.value;
});

const productEndIndex = computed(() => {
  return Math.min(
    productStartIndex.value + productsPerPage.value,
    filteredLaptops.value.length,
  );
});

const paginatedLaptops = computed(() => {
  return filteredLaptops.value.slice(
    productStartIndex.value,
    productEndIndex.value,
  );
});

watch(productSearch, () => {
  productCurrentPage.value = 1;
});

watch(totalProductPages, (pages) => {
  if (productCurrentPage.value > pages) {
    productCurrentPage.value = Math.max(1, pages);
  }
});

// Brand Dropdown & Custom Brand Toggle
const defaultBrands = [
  "AWS",
  "Google Cloud",
  "Microsoft Azure",
  "Lambda Labs",
  "RunPod",
  "Supermicro",
  "Dell EMC",
  "ASUS Enterprise",
  "Lenovo ThinkSystem",
  "NVIDIA DGX",
];

const brandList = computed(() => {
  const existing = laptops.value
    .map((l) => (l.brand || "").trim())
    .filter(Boolean);
  return Array.from(new Set([...defaultBrands, ...existing])).sort((a, b) =>
    a.localeCompare(b),
  );
});

const isCustomBrand = ref(false);

function toggleBrandMode() {
  isCustomBrand.value = !isCustomBrand.value;
}

// Image Upload State & Handlers
const imageFileInput = ref(null);
const isUploadingImage = ref(false);
const showDirectUrlInput = ref(false);

function triggerImageUpload() {
  if (imageFileInput.value) {
    imageFileInput.value.click();
  }
}

function handleImageFileChange(e) {
  const file = e.target.files?.[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("Mohon pilih file gambar yang valid (JPG, PNG, atau WebP).");
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    alert("Ukuran file gambar maksimal 5 MB.");
    return;
  }

  isUploadingImage.value = true;
  const reader = new FileReader();
  reader.onload = (event) => {
    laptopForm.value.image_url = event.target.result;
    isUploadingImage.value = false;
  };
  reader.onerror = () => {
    alert("Gagal membaca file gambar.");
    isUploadingImage.value = false;
  };
  reader.readAsDataURL(file);
}

function removeImage() {
  laptopForm.value.image_url = "";
  if (imageFileInput.value) {
    imageFileInput.value.value = "";
  }
}

// Bantuan Anti-Typo Format Nol Harga
function spellOutRupiah(num) {
  if (!num || isNaN(num) || num <= 0) return "Nol Rupiah";
  const n = Math.round(num);
  if (n >= 1_000_000_000) {
    const b = n / 1_000_000_000;
    return `${Number.isInteger(b) ? b : b.toFixed(2)} Miliar Rupiah`;
  }
  if (n >= 1_000_000) {
    const jt = n / 1_000_000;
    return `${Number.isInteger(jt) ? jt : jt.toFixed(2)} Juta Rupiah`;
  }
  if (n >= 1_000) {
    const rb = n / 1_000;
    return `${Number.isInteger(rb) ? rb : rb.toFixed(1)} Ribu Rupiah`;
  }
  return `${n} Rupiah`;
}

function adjustPrice(delta) {
  const current = Number(laptopForm.value.price) || 0;
  laptopForm.value.price = Math.max(0, current + delta);
}

function multiplyPrice(factor) {
  const current = Number(laptopForm.value.price) || 0;
  laptopForm.value.price = Math.max(0, current * factor);
}

function dividePrice(factor) {
  const current = Number(laptopForm.value.price) || 0;
  laptopForm.value.price = Math.max(0, Math.floor(current / factor));
}

const showProductModal = ref(false);
const editingLaptop = ref(null);
const laptopForm = ref({
  brand: "",
  model: "",
  price: 10000000,
  stock: 10,
  ram_gb: 16,
  processor_name: "Intel Core i5",
  processor_score: 80.0,
  gpu_name: "Integrated Graphics",
  gpu_score: 70.0,
  storage_gb: 512,
  battery_hours: 99.95,
  weight_kg: 10.0,
  image_url: "",
});

function formatIDR(val) {
  if (!val) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(val);
}

function formatDate(dateStr) {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    return d.toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch (e) {
    return String(dateStr);
  }
}

function handleLogout() {
  authStore.logout();
  router.push("/login");
}

async function fetchLaptops() {
  const res = await axios.get("/api/laptops");
  if (res.data.success) laptops.value = res.data.data;
}

async function fetchCriteria() {
  try {
    const res = await axios.get("/api/criteria");
    if (res.data.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
      const nameMap = {
        C1: "Biaya Sewa / Investasi",
        C2: "Kekuatan Processor (vCPU)",
        C3: "Kapasitas RAM ECC",
        C4: "Storage NVMe Enterprise",
        C5: "Akselerator AI & GPU VRAM",
        C6: "Konektivitas & Bandwidth",
        C7: "Garansi Uptime SLA",
        C8: "Proteksi Keamanan Anti-DDoS",
        C9: "Support 24/7 & Zona DC",
      };
      criteriaList.value = res.data.data.map((c) => ({
        id: c.id,
        code: c.code,
        name: nameMap[c.code] || c.name,
        fullName: c.name,
        type: c.type || (c.id === 1 ? "cost" : "benefit"),
      }));
    }
  } catch (err) {
    console.warn("Could not fetch criteria from server, using default:", err);
  }
}

async function fetchProfiles() {
  const res = await axios.get("/api/profiles");
  if (res.data.success) profiles.value = res.data.data;
}

async function fetchOrders() {
  try {
    const token = localStorage.getItem("smartinfra_token") || localStorage.getItem("smartlap_token") || authStore.token;
    const res = await axios.get("/api/orders", {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    if (res.data.success) {
      orders.value = res.data.data;
    }
  } catch (err) {
    console.error("Error fetching orders in Admin Dashboard:", err);
  }
}

async function confirmOrderPayment(order) {
  const confirmMsg = `Konfirmasi pembayaran untuk pesanan ${order.order_number} sebesar ${formatIDR(order.total_amount)}?\n\nStatus pesanan akan disetujui menjadi LUNAS.`;
  if (!window.confirm(confirmMsg)) return;

  try {
    const res = await axios.post(`/api/orders/${order.order_number}/simulate-pay`);
    if (res.data.success) {
      alert(`Pesanan ${order.order_number} berhasil diverifikasi dan disetujui (LUNAS)!`);
      await fetchOrders();
      await fetchLaptops(); // refresh stok jika berkurang
    }
  } catch (err) {
    console.error("Error confirming payment:", err);
    alert(err.response?.data?.message || "Gagal memverifikasi pesanan.");
  }
}

async function fetchSawAudit() {
  const res = await axios.post("/api/spk/recommend", {
    profile_id: auditProfileId.value,
  });
  if (res.data.success) {
    sawAuditData.value = res.data;
  }
}

function calcTotalWeight(p) {
  if (!p.weights) return 0;
  return Object.values(p.weights).reduce(
    (sum, v) => sum + (parseFloat(v) || 0),
    0,
  );
}

function isWeightValid(p) {
  return Math.abs(calcTotalWeight(p) - 1.0) < 0.05;
}

async function saveWeights(p) {
  try {
    const res = await axios.put(`/api/profiles/${p.id}/weights`, {
      weights: p.weights,
    });
    if (res.data.success) {
      alert("Bobot kriteria berhasil disimpan!");
    }
  } catch (err) {
    alert(err.response?.data?.message || "Gagal menyimpan bobot");
  }
}

async function updateStock(id, stock) {
  try {
    await axios.patch(`/api/laptops/${id}/stock`, { stock });
  } catch (err) {
    console.error("Error updating stock:", err);
  }
}

function openProductModal(laptop = null) {
  showDirectUrlInput.value = false;
  if (laptop) {
    editingLaptop.value = laptop;
    laptopForm.value = {
      image_url: laptop.image_url || "",
      ...laptop,
      processor_score: parseFloat(
        Number(laptop.processor_score || 80).toFixed(2),
      ),
      gpu_score: parseFloat(Number(laptop.gpu_score || 70).toFixed(2)),
      battery_hours: parseFloat(Number(laptop.battery_hours || 99.95).toFixed(2)),
      weight_kg: parseFloat(Number(laptop.weight_kg || 10.0).toFixed(2)),
    };
    if (laptop.brand && !brandList.value.includes(laptop.brand)) {
      isCustomBrand.value = true;
    } else {
      isCustomBrand.value = false;
    }
  } else {
    editingLaptop.value = null;
    isCustomBrand.value = false;
    laptopForm.value = {
      brand: brandList.value[0] || "AWS",
      model: "",
      category: "cloud_instance",
      price: 6850000,
      stock: 10,
      ram_gb: 32,
      processor_name: "16 vCPU Intel Xeon Platinum",
      processor_score: 85.0,
      gpu_name: "None (CPU Compute Node)",
      gpu_score: 20.0,
      storage_gb: 500,
      battery_hours: 99.95,
      weight_kg: 10.0,
      image_url: "",
    };
  }
  showProductModal.value = true;
}

async function saveLaptop() {
  try {
    laptopForm.value.processor_score = parseFloat(
      Number(laptopForm.value.processor_score || 80).toFixed(2),
    );
    laptopForm.value.gpu_score = parseFloat(
      Number(laptopForm.value.gpu_score || 70).toFixed(2),
    );
    laptopForm.value.battery_hours = parseFloat(
      Number(laptopForm.value.battery_hours || 99.95).toFixed(2),
    );
    laptopForm.value.weight_kg = parseFloat(
      Number(laptopForm.value.weight_kg || 10.0).toFixed(2),
    );

    if (editingLaptop.value) {
      await axios.put(
        `/api/laptops/${editingLaptop.value.id}`,
        laptopForm.value,
      );
    } else {
      await axios.post("/api/laptops", laptopForm.value);
    }
    showProductModal.value = false;
    fetchLaptops();
  } catch (err) {
    alert(err.response?.data?.message || "Gagal menyimpan data infrastruktur");
  }
}

async function deleteLaptop(id) {
  if (!confirm("Yakin ingin menghapus infrastruktur ini?")) return;
  try {
    await axios.delete(`/api/laptops/${id}`);
    fetchLaptops();
  } catch (err) {
    alert(err.response?.data?.message || "Gagal menghapus data infrastruktur");
  }
}

function openProfileModal(profile = null) {
  if (profile) {
    editingProfile.value = profile;
    const clonedWeights = {};
    if (profile.weights) {
      Object.keys(profile.weights).forEach((k) => {
        clonedWeights[k] = parseFloat(
          Number(profile.weights[k] || 0).toFixed(2),
        );
      });
    } else {
      criteriaList.value.forEach((c) => {
        clonedWeights[c.id] = parseFloat(
          (1 / criteriaList.value.length).toFixed(2),
        );
      });
    }

    profileForm.value = {
      name: profile.name || "",
      slug: profile.slug || "",
      description: profile.description || "",
      icon_name: profile.icon_name || "palette",
      weights: clonedWeights,
    };
  } else {
    editingProfile.value = null;
    profileForm.value = {
      name: "",
      slug: "",
      description: "",
      icon_name: "palette",
      weights: {
        1: 0.20,
        2: 0.15,
        3: 0.15,
        4: 0.10,
        5: 0.05,
        6: 0.15,
        7: 0.15,
        8: 0.025,
        9: 0.025,
      },
    };
  }
  showProfileModal.value = true;
}

async function saveProfile() {
  if (!isNewProfileWeightValid.value) return;
  savingProfile.value = true;
  try {
    const formattedWeights = {};
    for (const k in profileForm.value.weights) {
      formattedWeights[k] = parseFloat(
        Number(profileForm.value.weights[k] || 0).toFixed(2),
      );
    }
    profileForm.value.weights = formattedWeights;

    if (editingProfile.value) {
      const res = await axios.put(
        `/api/profiles/${editingProfile.value.id}`,
        profileForm.value,
      );
      if (res.data.success) {
        alert("Profil pengguna berhasil diperbarui!");
        showProfileModal.value = false;
        await fetchProfiles();
      }
    } else {
      const res = await axios.post("/api/profiles", profileForm.value);
      if (res.data.success) {
        alert("Profil pengguna baru berhasil ditambahkan!");
        showProfileModal.value = false;
        await fetchProfiles();
      }
    }
  } catch (err) {
    alert(err.response?.data?.message || "Gagal menyimpan profil");
  } finally {
    savingProfile.value = false;
  }
}

async function deleteProfile(id) {
  if (
    !confirm(
      "Apakah Anda yakin ingin menghapus profil ini? Algoritma rekomendasi tidak akan lagi menampilkan profil ini.",
    )
  )
    return;
  try {
    const res = await axios.delete(`/api/profiles/${id}`);
    if (res.data.success) {
      alert("Profil berhasil dihapus!");
      await fetchProfiles();
    }
  } catch (err) {
    alert(err.response?.data?.message || "Gagal menghapus profil");
  }
}

onMounted(() => {
  fetchCriteria();
  fetchLaptops();
  fetchProfiles();
  fetchOrders();
  fetchSawAudit();
});
</script>
