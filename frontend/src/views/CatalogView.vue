<template>
  <main class="flex-grow max-w-[1380px] w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 font-sans">
    <!-- Breadcrumb & Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4 mb-6 sm:mb-8">
      <div>
        <div class="flex items-center gap-2 text-xs text-slate-500 font-mono mb-1">
          <router-link to="/" class="hover:text-blue-600">Beranda</router-link>
          <span>/</span>
          <span class="text-slate-900 font-medium">Katalog Komputasi</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">Katalog Infrastruktur Komputasi</h1>
        <p class="text-xs sm:text-sm text-slate-500 mt-1">Jelajahi varian Cloud Server (IaaS) dan Dedicated GPU Rig dengan spesifikasi enterprise teruji.</p>
      </div>

      <!-- Quick Action: Ke Rekomendasi Pintar -->
      <router-link to="/" class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-700 text-xs font-semibold transition-all self-start sm:self-auto">
        <span class="material-symbols-outlined text-[18px]">dns</span>
        <span>Butuh Analisis SPK? Gunakan Rekomendasi Arsitektur</span>
      </router-link>
    </div>

    <!-- 2-Column Grid: Left Filters & Right Products -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
      <!-- Mobile Filter Toggle Button -->
      <div class="lg:hidden col-span-1">
        <button
          type="button"
          @click="showMobileFilter = !showMobileFilter"
          class="w-full py-3 px-4 bg-white border border-slate-300 rounded-xl font-bold text-xs flex items-center justify-between text-slate-800 shadow-xs cursor-pointer hover:border-blue-500 transition-colors"
        >
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px] text-blue-600">tune</span>
            <span>Filter & Pencarian Spesifikasi</span>
            <span v-if="activeFilterCount > 0" class="px-2 py-0.5 rounded-full bg-blue-600 text-white font-mono text-[10px] font-bold">
              {{ activeFilterCount }} Aktif
            </span>
          </div>
          <span class="material-symbols-outlined text-[20px] text-slate-500 transition-transform duration-200" :class="{ 'rotate-180': showMobileFilter }">
            expand_more
          </span>
        </button>
      </div>

      <!-- LEFT FILTER PANEL -->
      <aside
        class="lg:col-span-1 space-y-5 transition-all duration-200"
        :class="showMobileFilter ? 'block' : 'hidden lg:block'"
      >
        <!-- Search Input -->
        <div class="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs uppercase font-bold tracking-wider text-slate-700 font-mono flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[16px] text-blue-600">search</span>
              Pencarian
            </span>
            <button v-if="searchQuery" @click="searchQuery = ''; fetchLaptops()" class="text-xs text-blue-600 font-semibold hover:underline cursor-pointer">Reset</button>
          </div>
          <div class="relative">
            <span class="material-symbols-outlined absolute left-3 top-2.5 text-slate-400" style="font-size: 18px;">search</span>
            <input
              type="text"
              v-model="searchQuery"
              @input="debounceFetch"
              placeholder="Cari provider, CPU, atau GPU..."
              class="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 font-medium text-slate-900 placeholder:text-slate-400 transition-all"
            />
          </div>
        </div>

        <!-- TINGKAT 1: Filter Kategori (Parent Utama) -->
        <div class="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-3.5">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-1.5">
              <span class="w-5 h-5 rounded-full bg-blue-600 text-white font-mono text-[10px] font-bold flex items-center justify-center">1</span>
              <span class="text-xs uppercase font-bold tracking-wider text-slate-800 font-mono">Kategori Utama</span>
            </div>
            <span class="text-[10px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full font-semibold">Tingkat 1</span>
          </div>

          <div class="space-y-1.5 text-xs sm:text-sm text-slate-800">
            <!-- Semua Kategori -->
            <label
              class="flex items-center justify-between cursor-pointer py-2 px-2.5 rounded-xl transition-all"
              :class="selectedCategory === 'all' ? 'font-bold text-blue-700 bg-blue-50/80 ring-1 ring-blue-600/30' : 'font-medium hover:bg-slate-50'"
            >
              <div class="flex items-center gap-2">
                <input
                  type="radio"
                  name="categoryRadio"
                  value="all"
                  :checked="selectedCategory === 'all'"
                  @change="handleCategoryChange('all')"
                  class="text-blue-600 focus:ring-blue-500"
                />
                <span>Semua Kategori</span>
              </div>
              <span class="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full" :class="selectedCategory === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'">
                {{ categoryCounts.all || 0 }}
              </span>
            </label>

            <!-- Shared Hosting & VPS Budget -->
            <label
              class="flex items-center justify-between cursor-pointer py-2 px-2.5 rounded-xl transition-all"
              :class="selectedCategory === 'shared_server' ? 'font-bold text-emerald-700 bg-emerald-50/80 ring-1 ring-emerald-600/30' : 'font-medium hover:bg-slate-50'"
            >
              <div class="flex items-center gap-2">
                <input
                  type="radio"
                  name="categoryRadio"
                  value="shared_server"
                  :checked="selectedCategory === 'shared_server'"
                  @change="handleCategoryChange('shared_server')"
                  class="text-emerald-600 focus:ring-emerald-500"
                />
                <span class="flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-[16px] text-emerald-600">dns</span>
                  <span>Shared & Budget VPS</span>
                </span>
              </div>
              <span class="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full" :class="selectedCategory === 'shared_server' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'">
                {{ categoryCounts.shared_server || 0 }}
              </span>
            </label>

            <!-- Cloud Server (IaaS) -->
            <label
              class="flex items-center justify-between cursor-pointer py-2 px-2.5 rounded-xl transition-all"
              :class="selectedCategory === 'cloud_instance' ? 'font-bold text-blue-700 bg-blue-50/80 ring-1 ring-blue-600/30' : 'font-medium hover:bg-slate-50'"
            >
              <div class="flex items-center gap-2">
                <input
                  type="radio"
                  name="categoryRadio"
                  value="cloud_instance"
                  :checked="selectedCategory === 'cloud_instance'"
                  @change="handleCategoryChange('cloud_instance')"
                  class="text-blue-600 focus:ring-blue-500"
                />
                <span class="flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-[16px] text-blue-600">cloud</span>
                  <span>Cloud Server (IaaS)</span>
                </span>
              </div>
              <span class="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full" :class="selectedCategory === 'cloud_instance' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'">
                {{ categoryCounts.cloud_instance || 0 }}
              </span>
            </label>

            <!-- Dedicated GPU Rig -->
            <label
              class="flex items-center justify-between cursor-pointer py-2 px-2.5 rounded-xl transition-all"
              :class="selectedCategory === 'gpu_rig' ? 'font-bold text-indigo-700 bg-indigo-50/80 ring-1 ring-indigo-600/30' : 'font-medium hover:bg-slate-50'"
            >
              <div class="flex items-center gap-2">
                <input
                  type="radio"
                  name="categoryRadio"
                  value="gpu_rig"
                  :checked="selectedCategory === 'gpu_rig'"
                  @change="handleCategoryChange('gpu_rig')"
                  class="text-indigo-600 focus:ring-indigo-500"
                />
                <span class="flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-[16px] text-indigo-600">memory</span>
                  <span>Dedicated GPU Rig</span>
                </span>
              </div>
              <span class="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full" :class="selectedCategory === 'gpu_rig' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'">
                {{ categoryCounts.gpu_rig || 0 }}
              </span>
            </label>
          </div>
        </div>

        <!-- TINGKAT 2: Filter Provider (Hierarkis berdasarkan Kategori Terpilih) -->
        <div class="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-3.5">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-1.5">
              <span class="w-5 h-5 rounded-full bg-blue-600 text-white font-mono text-[10px] font-bold flex items-center justify-center">2</span>
              <span class="text-xs uppercase font-bold tracking-wider text-slate-800 font-mono">Provider & OEM</span>
            </div>
            <span class="text-[10px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full font-semibold">Tingkat 2</span>
          </div>

          <!-- Keterangan konteks hierarki -->
          <div class="text-[11px] text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100 flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[14px] text-blue-500">subdirectory_arrow_right</span>
            <span>Khusus kategori: <strong class="text-slate-800">{{ getCategoryLabel(selectedCategory) }}</strong></span>
          </div>

          <!-- Mini search provider if providers > 6 -->
          <div v-if="brandsWithCount.length > 6" class="relative">
            <span class="material-symbols-outlined absolute left-2.5 top-2 text-slate-400 text-[14px]">search</span>
            <input
              type="text"
              v-model="providerSearch"
              placeholder="Cari nama provider..."
              class="w-full pl-7 pr-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-800 placeholder:text-slate-400"
            />
          </div>

          <div class="space-y-1 text-xs sm:text-sm text-slate-800 max-h-56 overflow-y-auto pr-1">
            <!-- Semua Provider -->
            <label
              class="flex items-center justify-between cursor-pointer py-1.5 px-2 rounded-lg transition-all"
              :class="selectedBrand === 'all' ? 'font-bold text-blue-700 bg-blue-50/80 ring-1 ring-blue-600/20' : 'font-medium hover:bg-slate-50'"
            >
              <div class="flex items-center gap-2">
                <input
                  type="radio"
                  name="brandRadio"
                  value="all"
                  v-model="selectedBrand"
                  @change="handleBrandChange('all')"
                  class="text-blue-600 focus:ring-blue-500"
                />
                <span>Semua Provider</span>
              </div>
              <span class="text-[10px] font-mono text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded font-bold">
                {{ currentCategoryTotal }}
              </span>
            </label>

            <!-- Brand Items -->
            <label
              v-for="b in filteredBrandsWithCount"
              :key="b.brand"
              class="flex items-center justify-between cursor-pointer py-1.5 px-2 rounded-lg transition-all"
              :class="selectedBrand === b.brand ? 'font-bold text-blue-700 bg-blue-50/80 ring-1 ring-blue-600/20' : 'font-medium hover:bg-slate-50'"
            >
              <div class="flex items-center gap-2 truncate pr-1">
                <input
                  type="radio"
                  name="brandRadio"
                  :value="b.brand"
                  v-model="selectedBrand"
                  @change="handleBrandChange(b.brand)"
                  class="text-blue-600 focus:ring-blue-500"
                />
                <span class="truncate">{{ b.brand }}</span>
              </div>
              <span class="text-[10px] font-mono text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded font-bold shrink-0">
                {{ b.count }}
              </span>
            </label>
          </div>
        </div>

        <!-- TINGKAT 3: Filter RAM (Hierarkis sesuai Skala Kategori) -->
        <div class="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-3.5">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-1.5">
              <span class="w-5 h-5 rounded-full bg-blue-600 text-white font-mono text-[10px] font-bold flex items-center justify-center">3</span>
              <span class="text-xs uppercase font-bold tracking-wider text-slate-800 font-mono">Kapasitas RAM</span>
            </div>
            <span class="text-[10px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full font-semibold">Tingkat 3</span>
          </div>

          <div class="grid grid-cols-2 gap-2 text-xs font-mono">
            <button
              v-for="opt in ramOptions"
              :key="opt.val"
              type="button"
              @click="toggleRam(opt.val)"
              class="py-2 px-2.5 rounded-xl border text-center transition-all cursor-pointer font-bold shadow-2xs"
              :class="selectedRam === opt.val ? 'border-blue-600 bg-blue-600 text-white shadow-blue-500/20' : 'border-slate-200 hover:border-blue-400 bg-white text-slate-700'"
            >
              {{ opt.label }}
            </button>
          </div>
        </div>

        <!-- TINGKAT 4: Rentang Budget (Hierarkis sesuai Kategori) -->
        <div class="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-3.5">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-1.5">
              <span class="w-5 h-5 rounded-full bg-blue-600 text-white font-mono text-[10px] font-bold flex items-center justify-center">4</span>
              <span class="text-xs uppercase font-bold tracking-wider text-slate-800 font-mono">Rentang Budget</span>
            </div>
            <button v-if="isBudgetFiltered" @click="resetBudget" class="text-xs text-blue-600 font-semibold hover:underline cursor-pointer">Reset</button>
          </div>

          <input
            type="range"
            :min="currentBudgetConfig.min"
            :max="currentBudgetConfig.max"
            :step="currentBudgetConfig.step"
            v-model.number="maxPrice"
            @change="fetchLaptops"
            class="w-full accent-blue-600 cursor-pointer"
          />

          <div class="flex justify-between items-center text-xs font-mono">
            <span class="text-slate-600">{{ formatBudgetLabel(currentBudgetConfig.min) }}</span>
            <span class="font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
              Maks. {{ formatBudgetLabel(maxPrice) }}
            </span>
          </div>
        </div>

        <!-- Filter Stok Tersedia -->
        <div class="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <label class="flex items-center gap-2.5 cursor-pointer font-semibold text-slate-800 text-sm select-none">
            <input
              type="checkbox"
              v-model="inStockOnly"
              @change="fetchLaptops"
              class="rounded text-blue-600 focus:ring-blue-500 border-slate-300"
            />
            <span>Hanya Node Tersedia</span>
          </label>
        </div>
      </aside>

      <!-- RIGHT PRODUCT LISTINGS -->
      <section class="lg:col-span-3 space-y-5">
        <!-- ACTIVE HIERARCHICAL FILTERS BREADCRUMBS -->
        <div v-if="activeFilterCount > 0" class="bg-blue-50/80 border border-blue-200/90 rounded-2xl p-3.5 sm:p-4 flex flex-wrap items-center justify-between gap-3 text-xs shadow-xs">
          <div class="flex items-center flex-wrap gap-2">
            <span class="font-bold text-blue-900 flex items-center gap-1 font-mono uppercase tracking-wider text-[11px] mr-1">
              <span class="material-symbols-outlined text-[16px] text-blue-600">account_tree</span>
              Hierarki Filter:
            </span>

            <!-- Level 1: Kategori -->
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white border border-blue-200 text-blue-900 font-bold shadow-2xs">
              <span class="text-[10px] text-slate-600 font-mono font-normal uppercase">1. Kategori:</span>
              <span>{{ getCategoryLabel(selectedCategory) }}</span>
            </span>

            <!-- Level 2: Provider (if not all) -->
            <template v-if="selectedBrand !== 'all'">
              <span class="text-blue-400 font-bold">➔</span>
              <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white border border-blue-200 text-blue-900 font-bold shadow-2xs">
                <span class="text-[10px] text-slate-600 font-mono font-normal uppercase">2. Provider:</span>
                <span>{{ selectedBrand }}</span>
                <button @click="handleBrandChange('all')" class="hover:text-red-600 cursor-pointer ml-1 text-slate-400 hover:scale-110 transition-transform">✕</button>
              </span>
            </template>

            <!-- Level 3: RAM (if selected) -->
            <template v-if="selectedRam">
              <span class="text-blue-400 font-bold">➔</span>
              <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white border border-blue-200 text-blue-900 font-bold shadow-2xs">
                <span class="text-[10px] text-slate-600 font-mono font-normal uppercase">3. RAM:</span>
                <span>≥ {{ selectedRam }} GB</span>
                <button @click="toggleRam('')" class="hover:text-red-600 cursor-pointer ml-1 text-slate-400 hover:scale-110 transition-transform">✕</button>
              </span>
            </template>

            <!-- Level 4: Budget (if filtered) -->
            <template v-if="isBudgetFiltered">
              <span class="text-blue-400 font-bold">➔</span>
              <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white border border-blue-200 text-blue-900 font-bold shadow-2xs">
                <span class="text-[10px] text-slate-600 font-mono font-normal uppercase">4. Budget:</span>
                <span>≤ {{ formatBudgetLabel(maxPrice) }}</span>
                <button @click="resetBudget" class="hover:text-red-600 cursor-pointer ml-1 text-slate-400 hover:scale-110 transition-transform">✕</button>
              </span>
            </template>

            <!-- Search query chip -->
            <template v-if="searchQuery">
              <span class="text-blue-400 font-bold">➔</span>
              <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white border border-blue-200 text-blue-900 font-bold shadow-2xs">
                <span class="text-[10px] text-slate-600 font-mono font-normal uppercase">Cari:</span>
                <span>"{{ searchQuery }}"</span>
                <button @click="searchQuery = ''; fetchLaptops()" class="hover:text-red-600 cursor-pointer ml-1 text-slate-400 hover:scale-110 transition-transform">✕</button>
              </span>
            </template>
          </div>

          <button
            @click="resetFilters"
            class="px-2.5 py-1 rounded-lg bg-blue-100/70 hover:bg-blue-200/70 text-blue-800 font-bold text-xs transition-colors cursor-pointer ml-auto flex items-center gap-1"
          >
            <span class="material-symbols-outlined text-[14px]">refresh</span>
            <span>Reset Semua</span>
          </button>
        </div>

        <!-- Sorting & Per-Page Controls Bar -->
        <div id="catalog-products-heading" class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div class="text-sm font-medium text-slate-700">
            Menampilkan <span class="font-bold text-slate-900">{{ laptops.length ? startIndex + 1 : 0 }} - {{ endIndex }}</span> dari <span class="font-bold text-slate-900">{{ laptops.length }}</span> Node Tersedia
          </div>
          <div class="flex flex-wrap items-center gap-3">
            <div class="flex items-center gap-1.5 text-xs">
              <span class="font-bold text-slate-600">Per Hal:</span>
              <select
                v-model.number="perPage"
                @change="currentPage = 1"
                class="py-1.5 px-2 rounded-lg border border-slate-300 bg-white font-semibold text-slate-800 outline-none cursor-pointer text-xs"
              >
                <option :value="9">9 Item</option>
                <option :value="12">12 Item</option>
                <option :value="18">18 Item</option>
                <option :value="24">24 Item</option>
              </select>
            </div>

            <div class="flex items-center gap-1.5 text-xs">
              <span class="font-bold text-slate-700">Urutkan:</span>
              <select
                v-model="sortBy"
                @change="handleSortChange"
                class="text-xs sm:text-sm py-1.5 pl-2.5 pr-7 rounded-lg border border-slate-300 bg-white font-semibold text-slate-800 focus:ring-2 focus:ring-blue-600 outline-none cursor-pointer"
              >
                <option value="default">Terbaru</option>
                <option value="bestseller">🔥 Paling Laris (Terpopuler)</option>
                <option value="price_asc">Harga: Termurah ke Termahal</option>
                <option value="price_desc">Harga: Termahal ke Termurah</option>
                <option value="ram_desc">Spesifikasi RAM Terbesar</option>
                <option value="name_asc">Nama Seri A - Z</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="py-20 text-center">
          <div class="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p class="text-sm font-semibold text-slate-600">Memuat katalog infrastruktur server...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="laptops.length === 0" class="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto">
          <span class="material-symbols-outlined text-slate-400 text-[48px] mb-2">search_off</span>
          <h3 class="text-base font-bold text-slate-800">Tidak ada produk ditemukan</h3>
          <p class="text-xs text-slate-500 mt-1 mb-4">Silakan atur kembali kata kunci atau opsi filter Anda.</p>
          <button
            @click="resetFilters"
            class="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-all cursor-pointer"
          >
            Reset Filter
          </button>
        </div>

        <!-- Infrastructure Cards Grid with Pagination -->
        <div v-else class="space-y-8">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <InfrastructureCard
              v-for="laptop in paginatedLaptops"
              :key="laptop.id"
              :laptop="laptop"
            />
          </div>

          <!-- Bottom Pagination Controls -->
          <div
            v-if="totalPages > 1"
            class="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div class="text-xs font-medium text-slate-500 font-mono">
              Halaman <strong class="text-slate-800">{{ currentPage }}</strong> dari <strong class="text-slate-800">{{ totalPages }}</strong> (Total {{ laptops.length }} Infrastruktur)
            </div>

            <div class="flex items-center gap-1.5 flex-wrap justify-center">
              <button
                @click="prevPage"
                :disabled="currentPage <= 1"
                class="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold text-slate-700 transition-all flex items-center gap-1 cursor-pointer shadow-xs"
              >
                <span class="material-symbols-outlined text-[16px]">chevron_left</span>
                <span>Sebelumnya</span>
              </button>

              <div class="flex items-center gap-1">
                <template v-for="(p, idx) in visiblePages" :key="idx">
                  <span v-if="p === '...'" class="w-7 text-center text-xs text-slate-400 font-bold select-none">...</span>
                  <button
                    v-else
                    @click="goToPage(p)"
                    class="w-8 h-8 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer shadow-xs"
                    :class="currentPage === p ? 'bg-blue-600 text-white ring-2 ring-blue-600/20' : 'border border-slate-200 bg-white hover:bg-slate-50 text-slate-700'"
                  >
                    {{ p }}
                  </button>
                </template>
              </div>

              <button
                @click="nextPage"
                :disabled="currentPage >= totalPages"
                class="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold text-slate-700 transition-all flex items-center gap-1 cursor-pointer shadow-xs"
              >
                <span>Selanjutnya</span>
                <span class="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Floating Back to Top Button -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-4 scale-90"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-4 scale-90"
    >
      <button
        v-if="showBackToTop"
        @click="scrollToTop"
        type="button"
        class="fixed bottom-20 sm:bottom-24 right-6 z-40 p-3 sm:px-4 sm:py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-600/30 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-1.5 cursor-pointer group"
        title="Kembali ke atas halaman"
        aria-label="Kembali ke atas"
      >
        <span class="material-symbols-outlined text-[20px] sm:text-[22px] group-hover:-translate-y-0.5 transition-transform duration-200">
          arrow_upward
        </span>
        <span class="text-xs font-bold hidden sm:inline-block">
          Ke Atas
        </span>
      </button>
    </transition>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import axios from 'axios';
import InfrastructureCard from '../components/InfrastructureCard.vue';

const laptops = ref([]);
const brands = ref([]);
const brandsWithCount = ref([]);
const categoryCounts = ref({ all: 0, shared_server: 0, cloud_instance: 0, gpu_rig: 0 });
const loading = ref(false);

const searchQuery = ref('');
const selectedCategory = ref('all');
const selectedBrand = ref('all');
const selectedRam = ref('');
const providerSearch = ref('');
const inStockOnly = ref(false);
const sortBy = ref('default');
const showMobileFilter = ref(false);

// Kalibrasi Budget per Kategori
const categoryBudgetConfigs = {
  all: { min: 20000, max: 300000000, step: 5000000, defaultMax: 300000000 },
  shared_server: { min: 20000, max: 350000, step: 10000, defaultMax: 350000 },
  cloud_instance: { min: 500000, max: 26000000, step: 500000, defaultMax: 26000000 },
  gpu_rig: { min: 25000000, max: 300000000, step: 5000000, defaultMax: 300000000 }
};

const currentBudgetConfig = computed(() => {
  return categoryBudgetConfigs[selectedCategory.value] || categoryBudgetConfigs.all;
});

const maxPrice = ref(categoryBudgetConfigs.all.defaultMax);

const isBudgetFiltered = computed(() => {
  return Number(maxPrice.value) < currentBudgetConfig.value.defaultMax;
});

// Opsi RAM yang menyesuaikan arsitektur kategori secara hierarkis
const ramOptions = computed(() => {
  if (selectedCategory.value === 'shared_server') {
    return [
      { label: 'Semua', val: '' },
      { label: '≥ 1 GB', val: '1' },
      { label: '≥ 2 GB', val: '2' },
      { label: '≥ 4 GB', val: '4' }
    ];
  }
  if (selectedCategory.value === 'cloud_instance') {
    return [
      { label: 'Semua', val: '' },
      { label: '≥ 16 GB', val: '16' },
      { label: '≥ 32 GB', val: '32' },
      { label: '≥ 64 GB', val: '64' },
      { label: '≥ 128 GB', val: '128' }
    ];
  }
  if (selectedCategory.value === 'gpu_rig') {
    return [
      { label: 'Semua', val: '' },
      { label: '≥ 64 GB', val: '64' },
      { label: '≥ 128 GB', val: '128' },
      { label: '≥ 192 GB', val: '192' },
      { label: '≥ 256 GB', val: '256' }
    ];
  }
  return [
    { label: 'Semua', val: '' },
    { label: '≥ 4 GB', val: '4' },
    { label: '≥ 32 GB', val: '32' },
    { label: '≥ 64 GB', val: '64' },
    { label: '≥ 128 GB', val: '128' }
  ];
});

// Daftar provider yang disaring untuk kategori aktif
const filteredBrandsWithCount = computed(() => {
  if (!providerSearch.value.trim()) return brandsWithCount.value;
  const q = providerSearch.value.toLowerCase();
  return brandsWithCount.value.filter(b => b.brand.toLowerCase().includes(q));
});

const currentCategoryTotal = computed(() => {
  return categoryCounts.value[selectedCategory.value] ?? categoryCounts.value.all ?? 0;
});

function getCategoryLabel(cat) {
  if (cat === 'shared_server') return 'Shared & Budget VPS';
  if (cat === 'cloud_instance') return 'Cloud Server (IaaS)';
  if (cat === 'gpu_rig') return 'Dedicated GPU Rig';
  return 'Semua Kategori';
}

function formatBudgetLabel(val) {
  const num = Number(val) || 0;
  if (num >= 1000000) {
    const jt = num / 1000000;
    return `Rp ${jt % 1 === 0 ? jt : jt.toFixed(1)} Jt`;
  }
  return `Rp ${Math.round(num / 1000)} Rb`;
}

const activeFilterCount = computed(() => {
  let count = 0;
  if (searchQuery.value && searchQuery.value.trim() !== '') count++;
  if (selectedCategory.value && selectedCategory.value !== 'all') count++;
  if (selectedBrand.value && selectedBrand.value !== 'all') count++;
  if (selectedRam.value && selectedRam.value !== '') count++;
  if (isBudgetFiltered.value) count++;
  if (inStockOnly.value) count++;
  return count;
});

// Pagination State
const currentPage = ref(1);
const perPage = ref(12);

const totalPages = computed(() => {
  return Math.ceil(laptops.value.length / perPage.value) || 1;
});

const startIndex = computed(() => {
  return (currentPage.value - 1) * perPage.value;
});

const endIndex = computed(() => {
  return Math.min(startIndex.value + perPage.value, laptops.value.length);
});

const paginatedLaptops = computed(() => {
  return laptops.value.slice(startIndex.value, endIndex.value);
});

// Smart page window (e.g., 1, 2, 3, ..., 9)
const visiblePages = computed(() => {
  const total = totalPages.value;
  const current = currentPage.value;
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages = [];
  pages.push(1);
  if (current > 3) {
    pages.push('...');
  }
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  if (current < total - 2) {
    pages.push('...');
  }
  pages.push(total);
  return pages;
});

const STORAGE_KEY = 'smartinfra_catalog_state';

function saveCatalogState() {
  try {
    const state = {
      searchQuery: searchQuery.value,
      selectedCategory: selectedCategory.value,
      selectedBrand: selectedBrand.value,
      selectedRam: selectedRam.value,
      maxPrice: maxPrice.value,
      inStockOnly: inStockOnly.value,
      sortBy: sortBy.value,
      currentPage: currentPage.value
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to save catalog state:', e);
  }
}

function restoreCatalogState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.searchQuery !== undefined) searchQuery.value = parsed.searchQuery;
      if (parsed.selectedCategory !== undefined) selectedCategory.value = parsed.selectedCategory;
      if (parsed.selectedBrand !== undefined) selectedBrand.value = parsed.selectedBrand;
      if (parsed.selectedRam !== undefined) selectedRam.value = parsed.selectedRam;
      if (parsed.maxPrice !== undefined) {
        const p = Number(parsed.maxPrice);
        // Migrasi jika nilai simpanan lama masih dalam skala < 500
        if (p <= 500) {
          maxPrice.value = (categoryBudgetConfigs[selectedCategory.value] || categoryBudgetConfigs.all).defaultMax;
        } else {
          maxPrice.value = p;
        }
      }
      if (parsed.inStockOnly !== undefined) inStockOnly.value = Boolean(parsed.inStockOnly);
      if (parsed.sortBy !== undefined) sortBy.value = parsed.sortBy;
      if (parsed.currentPage !== undefined) currentPage.value = Number(parsed.currentPage) || 1;
      return true;
    }
  } catch (e) {
    console.warn('Failed to restore catalog state:', e);
  }
  return false;
}

function goToPage(page) {
  if (page === '...' || page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  saveCatalogState();
  scrollToProductTop();
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
    saveCatalogState();
    scrollToProductTop();
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    saveCatalogState();
    scrollToProductTop();
  }
}

function scrollToProductTop() {
  const el = document.getElementById('catalog-products-heading');
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function handleSortChange() {
  currentPage.value = 1;
  saveCatalogState();
  fetchLaptops();
}

let fetchTimer = null;
function debounceFetch() {
  clearTimeout(fetchTimer);
  fetchTimer = setTimeout(() => {
    currentPage.value = 1;
    saveCatalogState();
    fetchLaptops();
  }, 300);
}

// Handler Hierarki: Saat Kategori Berubah
function handleCategoryChange(cat) {
  selectedCategory.value = cat;
  // Reset filter anak yang bergantung pada kategori
  selectedBrand.value = 'all';
  selectedRam.value = '';
  providerSearch.value = '';
  maxPrice.value = (categoryBudgetConfigs[cat] || categoryBudgetConfigs.all).defaultMax;
  currentPage.value = 1;
  saveCatalogState();
  fetchLaptops();
}

// Handler Hierarki: Saat Brand Berubah
function handleBrandChange(brand) {
  selectedBrand.value = brand;
  currentPage.value = 1;
  saveCatalogState();
  fetchLaptops();
}

// Handler Hierarki: Saat RAM Berubah
function toggleRam(ram) {
  selectedRam.value = selectedRam.value === ram ? '' : ram;
  currentPage.value = 1;
  saveCatalogState();
  fetchLaptops();
}

// Reset Budget ke Batas Maks Kategori Aktif
function resetBudget() {
  maxPrice.value = currentBudgetConfig.value.defaultMax;
  currentPage.value = 1;
  saveCatalogState();
  fetchLaptops();
}

async function fetchLaptops() {
  loading.value = true;
  saveCatalogState();
  try {
    const params = {};
    if (searchQuery.value) params.search = searchQuery.value;
    if (selectedCategory.value && selectedCategory.value !== 'all') params.category = selectedCategory.value;
    if (selectedBrand.value && selectedBrand.value !== 'all') params.brand = selectedBrand.value;
    if (selectedRam.value) params.min_ram = selectedRam.value;
    if (isBudgetFiltered.value) params.max_price = maxPrice.value;
    if (inStockOnly.value) params.in_stock = 'true';
    if (sortBy.value !== 'default') params.sort = sortBy.value;

    const res = await axios.get('/api/laptops', { params });
    if (res.data.success) {
      laptops.value = res.data.data;
      if (res.data.brands) {
        brands.value = res.data.brands;
      }
      if (res.data.brandsWithCount) {
        brandsWithCount.value = res.data.brandsWithCount;
      }
      if (res.data.categoryCounts) {
        categoryCounts.value = res.data.categoryCounts;
      }
      if (currentPage.value > totalPages.value) {
        currentPage.value = 1;
      }
    }
  } catch (err) {
    console.error('Error fetching laptops:', err);
  } finally {
    loading.value = false;
  }
}

function resetFilters() {
  searchQuery.value = '';
  selectedCategory.value = 'all';
  selectedBrand.value = 'all';
  selectedRam.value = '';
  providerSearch.value = '';
  maxPrice.value = categoryBudgetConfigs.all.defaultMax;
  inStockOnly.value = false;
  sortBy.value = 'default';
  currentPage.value = 1;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {}
  fetchLaptops();
}

// Floating Back to Top State & Handlers
const showBackToTop = ref(false);

function handleScroll() {
  showBackToTop.value = window.scrollY > 300;
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

onMounted(() => {
  restoreCatalogState();
  fetchLaptops();
  window.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>
