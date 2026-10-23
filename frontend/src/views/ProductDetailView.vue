<template>
  <div class="py-4 sm:py-8 font-sans">
    <div class="max-w-[1380px] w-full mx-auto px-4 sm:px-6 space-y-6 sm:space-y-8">
      
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-xs font-mono text-slate-500 overflow-x-auto no-scrollbar py-1">
        <router-link to="/" class="hover:text-blue-600 transition-colors shrink-0">Beranda</router-link>
        <span class="shrink-0">/</span>
        <router-link to="/katalog" class="hover:text-blue-600 transition-colors shrink-0">Katalog Komputasi</router-link>
        <span class="shrink-0">/</span>
        <span class="text-slate-900 font-semibold truncate">{{ laptop?.brand }} {{ laptop?.model }}</span>
      </nav>

      <!-- Loading State -->
      <div v-if="loading" class="py-24 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div class="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p class="text-sm font-semibold text-slate-600">Memuat rincian spesifikasi infrastruktur...</p>
      </div>

      <!-- Not Found -->
      <div v-else-if="!laptop" class="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto shadow-sm">
        <span class="material-symbols-outlined text-slate-400 text-[48px] mb-2">dns</span>
        <h3 class="text-base font-bold text-slate-800">Infrastruktur komputasi tidak ditemukan</h3>
        <router-link to="/katalog" class="inline-block mt-4 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-sm hover:bg-blue-700 transition-colors">
          Kembali ke Katalog
        </router-link>
      </div>

      <!-- Product Detail Content -->
      <div v-else class="space-y-6 sm:space-y-8">
        
        <!-- Product Showcase (2-Column) -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 bg-white p-4 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
          
          <!-- Left Column: Product Image & Interactive Multi-Angle Gallery -->
          <div class="lg:col-span-6 space-y-4">
            
            <!-- Main Display Window -->
            <div class="bg-gradient-to-b from-slate-50 to-slate-100/80 rounded-2xl p-4 sm:p-6 h-72 sm:h-[400px] flex items-center justify-center border border-slate-200 relative overflow-hidden group shadow-inner">
              
              <!-- Badges Header -->
              <div class="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span class="bg-blue-600 text-white text-[10px] sm:text-[11px] font-mono font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                  <span class="material-symbols-outlined text-[13px]">verified</span>
                  <span>{{ laptop.category === 'gpu_rig' ? 'Dedicated Rig (CapEx)' : laptop.category === 'shared_server' ? 'Shared / VPS Budget (OpEx)' : 'Cloud Server (OpEx)' }}</span>
                </span>
                <span class="bg-slate-900/85 backdrop-blur-md text-white text-[10px] sm:text-[11px] font-mono px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm border border-slate-700/50">
                  <span class="material-symbols-outlined text-[13px] text-blue-400">{{ activeTabInfo.icon }}</span>
                  <span>{{ activeTabInfo.badgeTitle }}</span>
                </span>
              </div>

              <!-- VIEW 0: Tampak Depan Chassis / Main Image -->
              <div v-if="activeGalleryTab === 0" class="w-full h-full flex flex-col items-center justify-center p-2">
                <img
                  v-if="laptop.image_url && !detailImageFailed"
                  :src="laptop.image_url"
                  :alt="laptop.model"
                  @error="handleDetailImageError"
                  class="max-h-[85%] max-w-[85%] object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-md"
                />
                <span v-else class="material-symbols-outlined text-slate-300 text-[130px]">
                  {{ laptop.category === 'gpu_rig' ? 'dns' : 'cloud' }}
                </span>
                <div class="absolute bottom-2 text-center">
                  <span class="text-[11px] font-mono font-bold text-slate-500 bg-white/80 px-2.5 py-0.5 rounded-full border border-slate-200 shadow-2xs">
                    Tampak Depan (Front Enclosure Chassis)
                  </span>
                </div>
              </div>

              <!-- VIEW 1: Arsitektur Komputasi (CPU & AI Tensor GPU) -->
              <div v-else-if="activeGalleryTab === 1" class="w-full h-full flex flex-col items-center justify-center p-4">
                <div class="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                  <div class="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div class="flex items-center gap-2">
                      <div class="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                        <span class="material-symbols-outlined text-[18px]">developer_board</span>
                      </div>
                      <div>
                        <h4 class="text-xs font-bold text-slate-900">Arsitektur Komputasi Host</h4>
                        <p class="text-[10px] text-slate-500 font-mono">Dual-Engine Sockets & Tensor Cores</p>
                      </div>
                    </div>
                    <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      PCIe 5.0 Active
                    </span>
                  </div>

                  <!-- CPU Socket Component Card -->
                  <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between gap-3">
                    <div class="flex items-center gap-2.5 min-w-0">
                      <span class="material-symbols-outlined text-blue-600 text-[22px]">memory</span>
                      <div class="min-w-0">
                        <span class="block text-[10px] font-bold text-slate-500 uppercase font-mono">Prosesor Host (CPU)</span>
                        <p class="text-xs font-bold text-slate-900 truncate">{{ laptop.processor_name }}</p>
                      </div>
                    </div>
                    <span class="shrink-0 text-xs font-mono font-extrabold text-blue-700 bg-white px-2 py-1 rounded-lg border border-slate-200 shadow-2xs">
                      Skor {{ laptop.processor_score }}/100
                    </span>
                  </div>

                  <!-- GPU Accelerator Component Card -->
                  <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between gap-3">
                    <div class="flex items-center gap-2.5 min-w-0">
                      <span class="material-symbols-outlined text-indigo-600 text-[22px]">auto_awesome</span>
                      <div class="min-w-0">
                        <span class="block text-[10px] font-bold text-slate-500 uppercase font-mono">AI Accelerator (GPU)</span>
                        <p class="text-xs font-bold text-slate-900 truncate">{{ laptop.gpu_name }}</p>
                      </div>
                    </div>
                    <span class="shrink-0 text-xs font-mono font-extrabold text-indigo-700 bg-white px-2 py-1 rounded-lg border border-slate-200 shadow-2xs">
                      Skor {{ laptop.gpu_score }}/100
                    </span>
                  </div>
                </div>
              </div>

              <!-- VIEW 2: Sub-Sistem Memori RAM ECC & NVMe Storage Array -->
              <div v-else-if="activeGalleryTab === 2" class="w-full h-full flex flex-col items-center justify-center p-4">
                <div class="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                  <div class="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div class="flex items-center gap-2">
                      <div class="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                        <span class="material-symbols-outlined text-[18px]">storage</span>
                      </div>
                      <div>
                        <h4 class="text-xs font-bold text-slate-900">Arsitektur Memori & Penyimpanan</h4>
                        <p class="text-[10px] text-slate-500 font-mono">Multi-Channel ECC & NVMe Array</p>
                      </div>
                    </div>
                    <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      Tier-1 NVMe IOPS
                    </span>
                  </div>

                  <!-- RAM Banks -->
                  <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                    <div class="flex items-center justify-between text-xs">
                      <span class="font-bold text-slate-700 flex items-center gap-1.5">
                        <span class="material-symbols-outlined text-blue-600 text-[16px]">straighten</span>
                        <span>Kapasitas Alokasi RAM</span>
                      </span>
                      <strong class="font-mono text-blue-700 text-sm">{{ laptop.ram_gb }} GB High-Speed ECC</strong>
                    </div>
                    <div class="grid grid-cols-4 gap-1.5 pt-1">
                      <div v-for="b in 4" :key="b" class="h-4 bg-blue-100 rounded border border-blue-300 flex items-center justify-center">
                        <span class="text-[8px] font-mono font-bold text-blue-800">CH-{{ b }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- NVMe Storage -->
                  <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between gap-3">
                    <div class="flex items-center gap-2.5 min-w-0">
                      <span class="material-symbols-outlined text-slate-700 text-[20px]">hard_drive</span>
                      <div class="min-w-0">
                        <span class="block text-[10px] font-bold text-slate-500 uppercase font-mono">Primary Storage Array</span>
                        <p class="text-xs font-bold text-slate-900 truncate">{{ laptop.storage_desc }}</p>
                      </div>
                    </div>
                    <span class="shrink-0 text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                      Hot-Swap Bay
                    </span>
                  </div>
                </div>
              </div>

              <!-- VIEW 3: Redundansi Daya (PSU) & Port Jaringan I/O (SLA) -->
              <div v-else-if="activeGalleryTab === 3" class="w-full h-full flex flex-col items-center justify-center p-4">
                <div class="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                  <div class="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div class="flex items-center gap-2">
                      <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <span class="material-symbols-outlined text-[18px]">verified_user</span>
                      </div>
                      <div>
                        <h4 class="text-xs font-bold text-slate-900">Tampak Belakang & Redundansi (SLA)</h4>
                        <p class="text-[10px] text-slate-500 font-mono">Dual Titanium PSU & Network Uplink</p>
                      </div>
                    </div>
                    <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      SLA {{ laptop.battery_hours }}%
                    </span>
                  </div>

                  <!-- Dual Titanium PSU -->
                  <div class="grid grid-cols-2 gap-2.5">
                    <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
                      <span class="material-symbols-outlined text-emerald-600 text-[18px]">power</span>
                      <span class="block text-[10px] font-mono font-bold text-slate-700 mt-0.5">PSU 1 (Active)</span>
                      <span class="text-[9px] text-slate-500 font-mono">Titanium Hot-Plug</span>
                    </div>
                    <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
                      <span class="material-symbols-outlined text-emerald-600 text-[18px]">power</span>
                      <span class="block text-[10px] font-mono font-bold text-slate-700 mt-0.5">PSU 2 (Redundant)</span>
                      <span class="text-[9px] text-slate-500 font-mono">1+1 Failover Ready</span>
                    </div>
                  </div>

                  <!-- Network & Management -->
                  <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs font-medium">
                    <div class="flex items-center gap-2">
                      <span class="material-symbols-outlined text-blue-600 text-[18px]">lan</span>
                      <span>Dual 25GbE / 100GbE Uplink + iDRAC / IPMI</span>
                    </div>
                    <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  </div>
                </div>
              </div>

            </div>

            <!-- 4 Interactive Component Thumbnails -->
            <div class="grid grid-cols-4 gap-2 sm:gap-3">
              <button
                v-for="tab in galleryTabs"
                :key="tab.id"
                @click="activeGalleryTab = tab.id"
                type="button"
                class="rounded-xl p-2 sm:p-2.5 flex flex-col items-center justify-center text-center transition-all cursor-pointer relative overflow-hidden"
                :class="
                  activeGalleryTab === tab.id
                    ? 'border-2 border-blue-600 bg-blue-50/70 shadow-xs'
                    : 'border border-slate-200 bg-white hover:bg-slate-50/80 hover:border-blue-300'
                "
              >
                <span
                  class="material-symbols-outlined text-[20px] sm:text-[22px] transition-colors"
                  :class="activeGalleryTab === tab.id ? 'text-blue-600 font-bold' : 'text-slate-500'"
                >
                  {{ tab.icon }}
                </span>
                <span
                  class="text-[10px] sm:text-[11px] font-bold mt-1 block truncate max-w-full"
                  :class="activeGalleryTab === tab.id ? 'text-blue-900' : 'text-slate-800'"
                >
                  {{ tab.title }}
                </span>
                <span
                  class="text-[9px] sm:text-[10px] font-mono block truncate max-w-full"
                  :class="activeGalleryTab === tab.id ? 'text-blue-700 font-semibold' : 'text-slate-600'"
                >
                  {{ tab.sub }}
                </span>

                <!-- Active Strip Indicator -->
                <div
                  v-if="activeGalleryTab === tab.id"
                  class="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-b-xl"
                ></div>
              </button>
            </div>
          </div>

          <!-- Right Column: Specs & Purchasing CTAs -->
          <div class="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div>
              <div class="flex items-center gap-2 mb-2">
                <span class="text-xs font-mono font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-100">
                  Enterprise SLA • {{ laptop.brand }}
                </span>
                <span v-if="laptop.sku" class="text-xs font-mono text-slate-500">SKU: {{ laptop.sku }}</span>
              </div>
              <h1 class="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">
                {{ laptop.brand }} {{ laptop.model }}
              </h1>
              <p class="text-sm text-slate-600 mt-2 leading-relaxed">
                {{ laptop.description || 'Infrastruktur komputasi enterprise berkinerja tinggi yang dirancang untuk mendukung beban kerja AI training, microservices production, dan pipeline data ber-traffic tinggi.' }}
              </p>

              <!-- Price & Capacity Stock -->
              <div class="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-baseline justify-between">
                <div>
                  <span class="text-xs text-slate-500 font-mono block">
                    {{ laptop.category === 'gpu_rig' ? 'Investasi Pengadaan (CapEx)' : 'Biaya Sewa Bulanan (OpEx)' }}
                  </span>
                  <span class="text-2xl lg:text-3xl font-bold font-mono text-slate-900">
                    {{ formatIDR(laptop.price) }}
                  </span>
                </div>
                <div class="text-right">
                  <span
                    v-if="laptop.stock > 0"
                    class="inline-flex items-center gap-1.5 text-xs text-blue-700 font-medium bg-blue-50 px-3 py-1 rounded-full border border-blue-200"
                  >
                    <span class="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                    Tersedia ({{ laptop.stock }} Node/Unit)
                  </span>
                  <span
                    v-else
                    class="inline-flex items-center gap-1.5 text-xs text-rose-700 font-medium bg-rose-50 px-3 py-1 rounded-full border border-rose-200"
                  >
                    <span class="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
                    Alokasi Penuh
                  </span>
                </div>
              </div>

              <!-- TCO Simulation Banner -->
              <div class="mt-3 p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div class="flex items-center gap-2.5">
                  <div class="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <span class="material-symbols-outlined text-[18px]">calculate</span>
                  </div>
                  <div>
                    <span class="text-slate-800 font-medium block">
                      Estimasi pembiayaan mulai <strong class="text-blue-700 font-extrabold font-mono text-sm">{{ formatIDR(Math.round(laptop.price / 12)) }}</strong> / bulan
                    </span>
                    <span class="text-slate-500 text-[11px] block">Simulasi komparasi OpEx vs CapEx kontrak 12 s/d 24 bulan</span>
                  </div>
                </div>
                <button
                  type="button"
                  @click="showCreditModal = true"
                  class="w-full sm:w-auto justify-center px-3.5 py-2.5 sm:py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
                >
                  <span class="material-symbols-outlined text-[16px]">calculate</span>
                  <span>Simulasi TCO</span>
                </button>
              </div>

              <!-- Quick Spec Highlights -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 mt-4 text-xs font-mono">
                <div class="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span class="text-slate-500 block text-[11px]">Processor (CPU):</span>
                  <span class="font-semibold text-slate-800">{{ laptop.processor_name }}</span>
                </div>
                <div class="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span class="text-slate-500 block text-[11px]">AI GPU / Accelerator:</span>
                  <span class="font-semibold text-slate-800">{{ laptop.gpu_name }}</span>
                </div>
                <div class="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span class="text-slate-500 block text-[11px]">RAM & Storage:</span>
                  <span class="font-semibold text-slate-800">{{ laptop.ram_gb }}GB / {{ laptop.storage_desc }}</span>
                </div>
                <div class="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span class="text-slate-500 block text-[11px]">SLA & Form Factor:</span>
                  <span class="font-semibold text-slate-800">Uptime {{ laptop.battery_hours }}% / {{ laptop.category === 'gpu_rig' ? 'Dedicated Rig' : 'Virtual Instance' }}</span>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="pt-6 border-t border-slate-200 space-y-3">
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <router-link
                  to="/katalog"
                  class="inline-flex items-center justify-center gap-2 h-12 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-800 text-sm font-semibold transition-all"
                >
                  <span class="material-symbols-outlined" style="font-size: 18px;">arrow_back</span>
                  <span>Katalog</span>
                </router-link>
                <button
                  @click="addToCart($event)"
                  :disabled="laptop.stock <= 0"
                  class="inline-flex items-center justify-center gap-2 h-12 rounded-lg border text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  :class="isAddedTemporarily ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-blue-600 bg-blue-50 text-blue-700 hover:bg-blue-100'"
                >
                  <span class="material-symbols-outlined" style="font-size: 18px;">{{ isAddedTemporarily ? 'check_circle' : 'playlist_add' }}</span>
                  <span>{{ isAddedTemporarily ? 'Dimasukkan ke Draft!' : '+ Draft RFQ' }}</span>
                </button>
                <button
                  @click="buyNow"
                  :disabled="laptop.stock <= 0"
                  class="inline-flex items-center justify-center gap-2 h-12 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <span class="material-symbols-outlined" style="font-size: 18px;">fact_check</span>
                  <span>Ajukan RFQ Sekarang</span>
                </button>
              </div>

              <!-- Trust Badges -->
              <div class="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-[11px] sm:text-xs text-slate-500 font-mono pt-2">
                <span class="flex items-center gap-1.5"><span class="material-symbols-outlined text-blue-600" style="font-size: 16px;">verified</span> Enterprise SLA Support</span>
                <span class="flex items-center gap-1.5"><span class="material-symbols-outlined text-blue-600" style="font-size: 16px;">lock</span> Security & Privacy Compliant</span>
                <span class="flex items-center gap-1.5"><span class="material-symbols-outlined text-slate-600" style="font-size: 16px;">support_agent</span> Dedicated Solution Architect</span>
              </div>
            </div>

          </div>

        </div>

        <!-- Technical Specs Table (Full Detail) -->
        <div class="bg-white p-4 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h2 class="text-xl font-bold text-slate-900 tracking-tight">Spesifikasi Detail Komputasi</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm divide-y md:divide-y-0">
            <div class="space-y-4">
              <div class="flex justify-between py-2 border-b border-slate-100">
                <span class="text-slate-500">Prosesor (CPU / vCPU)</span>
                <span class="font-semibold text-slate-900 font-mono text-right">{{ laptop.processor_name }}</span>
              </div>
              <div class="flex justify-between py-2 border-b border-slate-100">
                <span class="text-slate-500">Akselerator AI & Grafis (GPU)</span>
                <span class="font-semibold text-slate-900 font-mono text-right">{{ laptop.gpu_name }}</span>
              </div>
              <div class="flex justify-between py-2 border-b border-slate-100">
                <span class="text-slate-500">Kapasitas Memori (RAM)</span>
                <span class="font-semibold text-slate-900 font-mono text-right">{{ laptop.ram_gb }} GB High-Speed / ECC</span>
              </div>
              <div class="flex justify-between py-2 border-b border-slate-100">
                <span class="text-slate-500">Penyimpanan (Storage)</span>
                <span class="font-semibold text-slate-900 font-mono text-right">{{ laptop.storage_desc }}</span>
              </div>
              <div class="flex justify-between py-2 border-b border-slate-100">
                <span class="text-slate-500">Konektivitas & Port Jaringan (C6)</span>
                <span class="font-semibold text-slate-900 font-mono text-right">{{ getCriterionVal('C6', 10) }} Gbps Uplink Port</span>
              </div>
            </div>

            <div class="space-y-4">
              <div class="flex justify-between py-2 border-b border-slate-100">
                <span class="text-slate-500">Kategori Infrastruktur</span>
                <span class="font-semibold text-slate-900 font-mono text-right">{{ laptop.category === 'gpu_rig' ? 'Dedicated On-Premise GPU Rig' : laptop.category === 'shared_server' ? 'Shared Hosting & VPS Budget' : 'Virtual Cloud Instance (IaaS)' }}</span>
              </div>
              <div class="flex justify-between py-2 border-b border-slate-100">
                <span class="text-slate-500">Jaminan Ketersediaan (SLA)</span>
                <span class="font-semibold text-slate-900 font-mono text-right">Uptime SLA {{ laptop.battery_hours }}%</span>
              </div>
              <div class="flex justify-between py-2 border-b border-slate-100">
                <span class="text-slate-500">Manajemen Antarmuka</span>
                <span class="font-semibold text-slate-900 font-mono text-right">{{ laptop.screen_desc || 'API / Web Dashboard Console' }}</span>
              </div>
              <div class="flex justify-between py-2 border-b border-slate-100">
                <span class="text-slate-500">Proteksi Keamanan & Skalabilitas (C8)</span>
                <span class="font-semibold text-slate-900 font-mono text-right">Anti-DDoS & WAF (Skor {{ getCriterionVal('C8', 90) }}/100)</span>
              </div>
              <div class="flex justify-between py-2 border-b border-slate-100">
                <span class="text-slate-500">Dukungan Teknis & Datacenter (C9)</span>
                <span class="font-semibold text-slate-900 font-mono text-right">24/7 Support Tier (Skor {{ getCriterionVal('C9', 92) }}/100)</span>
              </div>
              <div class="flex justify-between py-2 border-b border-slate-100">
                <span class="text-slate-500">Kapasitas Alokasi Tersedia</span>
                <span class="font-semibold text-slate-900 font-mono text-right">{{ laptop.stock }} Node / Unit</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Matriks Evaluasi 9 Kriteria SAW Server (Enterprise Multi-Attribute Score) -->
        <div class="bg-white p-5 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
                <span class="text-xs uppercase font-bold tracking-wider text-blue-700 font-mono">
                  Engine Simple Additive Weighting (SAW)
                </span>
              </div>
              <h2 class="text-xl font-extrabold text-slate-900 tracking-tight mt-1">
                Matriks Nilai 9 Kriteria Evaluasi Server
              </h2>
              <p class="text-xs text-slate-500 mt-0.5">
                Nilai mentah (raw matrix x_ij) yang diolah dalam algoritma SAW untuk menentukan kesesuaian beban kerja.
              </p>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-50 text-slate-700 font-bold border border-slate-200">
                C1: Cost • C2 - C9: Benefit
              </span>
            </div>
          </div>

          <!-- 9 Criteria Interactive Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="c in criteriaDisplayList"
              :key="c.code"
              class="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-blue-400 hover:shadow-xs transition-all space-y-2.5 group"
            >
              <div class="flex items-center justify-between">
                <span
                  class="font-mono text-xs font-bold px-2 py-0.5 rounded"
                  :class="c.type === 'Cost' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'"
                >
                  {{ c.code }} [{{ c.type }}]
                </span>
                <span class="material-symbols-outlined text-slate-400 group-hover:text-blue-600 text-[20px] transition-colors">
                  {{ c.icon }}
                </span>
              </div>

              <div>
                <h4 class="font-bold text-xs text-slate-900 line-clamp-1" :title="c.name">
                  {{ c.name }}
                </h4>
                <p class="text-[11px] text-slate-500 leading-snug line-clamp-1 mt-0.5">
                  {{ c.desc }}
                </p>
              </div>

              <div class="pt-2 border-t border-slate-200/60 flex items-baseline justify-between">
                <span class="text-[10px] uppercase font-mono font-bold text-slate-400">Nilai Parameter:</span>
                <span class="font-mono font-extrabold text-xs sm:text-sm text-slate-900">
                  {{ c.formattedValue }}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Credit Simulation Modal -->
      <CreditSimulationModal
        :is-open="showCreditModal"
        :laptop="laptop"
        @close="showCreditModal = false"
      />

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { useCartStore } from '../stores/cartStore';
import { useCartAnimation } from '../composables/useCartAnimation';
import CreditSimulationModal from '../components/CreditSimulationModal.vue';

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();
const { triggerFlyToCart } = useCartAnimation();

const laptop = ref(null);
const loading = ref(true);
const isAddedTemporarily = ref(false);
const showCreditModal = ref(false);
const activeGalleryTab = ref(0);
const detailImageFailed = ref(false);

function handleDetailImageError(event) {
  const cat = laptop.value?.category;
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
  detailImageFailed.value = true;
}

const galleryTabs = computed(() => {
  if (!laptop.value) return [];
  const isGpu = laptop.value.category === 'gpu_rig';
  return [
    {
      id: 0,
      title: 'Tampak Depan',
      sub: isGpu ? 'Chassis Rack' : 'Cloud Host',
      badgeTitle: 'Chassis Overview',
      icon: isGpu ? 'dns' : 'cloud',
      type: 'chassis'
    },
    {
      id: 1,
      title: 'Komputasi',
      sub: `${laptop.value.ram_gb}GB / Cores`,
      badgeTitle: 'CPU & GPU Engine',
      icon: 'developer_board',
      type: 'compute'
    },
    {
      id: 2,
      title: 'Memori & Storage',
      sub: `${laptop.value.storage_gb || 512}GB NVMe`,
      badgeTitle: 'RAM & NVMe Bays',
      icon: 'storage',
      type: 'memory'
    },
    {
      id: 3,
      title: 'Redundansi I/O',
      sub: `SLA ${laptop.value.battery_hours}%`,
      badgeTitle: 'Dual PSU & Multi-GbE',
      icon: 'verified_user',
      type: 'power_sla'
    }
  ];
});

const activeTabInfo = computed(() => {
  return galleryTabs.value[activeGalleryTab.value] || galleryTabs.value[0] || {};
});

function getCriterionVal(code, fallback = 0) {
  if (!laptop.value?.criteria_values) return fallback;
  const c = laptop.value.criteria_values.find(x => x.code === code);
  return c ? c.raw_value : fallback;
}

const criteriaDisplayList = computed(() => {
  if (!laptop.value) return [];
  const map = {};
  if (Array.isArray(laptop.value.criteria_values)) {
    laptop.value.criteria_values.forEach(cv => {
      map[cv.code] = cv.raw_value;
    });
  }

  const c1 = map['C1'] ?? laptop.value.price;
  const c2 = map['C2'] ?? laptop.value.processor_score;
  const c3 = map['C3'] ?? laptop.value.ram_gb;
  const c4 = map['C4'] ?? laptop.value.storage_gb;
  const c5 = map['C5'] ?? laptop.value.gpu_score;
  const c6 = map['C6'] ?? 10.0;
  const c7 = map['C7'] ?? laptop.value.battery_hours;
  const c8 = map['C8'] ?? 90.0;
  const c9 = map['C9'] ?? 92.0;

  return [
    {
      code: 'C1',
      name: 'Biaya Sewa / Investasi Bulanan',
      type: 'Cost',
      icon: 'payments',
      desc: 'Makin hemat biaya, nilai preferensi SAW makin tinggi',
      formattedValue: `${formatIDR(c1)} / bln`
    },
    {
      code: 'C2',
      name: 'Kekuatan Compute Processor (vCPU)',
      type: 'Benefit',
      icon: 'memory',
      desc: 'Throughput multi-core processor & konkurensi request',
      formattedValue: `Skor ${c2} / 100`
    },
    {
      code: 'C3',
      name: 'Kapasitas Memori RAM ECC',
      type: 'Benefit',
      icon: 'developer_board',
      desc: 'Kapasitas RAM DDR5 sistem berkecepatan tinggi',
      formattedValue: `${c3} GB RAM ECC`
    },
    {
      code: 'C4',
      name: 'Storage NVMe Enterprise',
      type: 'Benefit',
      icon: 'storage',
      desc: 'Kapasitas & kecepatan IOPS throughput SSD NVMe',
      formattedValue: `${c4 >= 1000 ? (c4 / 1000).toFixed(1) + ' TB' : c4 + ' GB'} NVMe`
    },
    {
      code: 'C5',
      name: 'Akselerator AI & GPU VRAM',
      type: 'Benefit',
      icon: 'psychology',
      desc: 'Komputasi Tensor Cores & VRAM deep learning AI',
      formattedValue: c5 > 20 ? `Skor ${c5} / 100 (${laptop.value.gpu_name})` : 'Virtual / Basic Display'
    },
    {
      code: 'C6',
      name: 'Konektivitas & Bandwidth Jaringan',
      type: 'Benefit',
      icon: 'lan',
      desc: 'Kecepatan throughput port uplink jaringan (Gbps)',
      formattedValue: `${c6} Gbps Uplink`
    },
    {
      code: 'C7',
      name: 'Garansi Keandalan Uptime SLA',
      type: 'Benefit',
      icon: 'verified',
      desc: 'Jaminan ketersediaan layanan sistem tanpa downtime',
      formattedValue: `Uptime ${c7}% SLA`
    },
    {
      code: 'C8',
      name: 'Proteksi Keamanan Anti-DDoS & Skalabilitas',
      type: 'Benefit',
      icon: 'shield',
      desc: 'Mitigasi DDoS L3/L4/L7, Hardware WAF & elastisitas',
      formattedValue: `Skor ${c8} / 100`
    },
    {
      code: 'C9',
      name: 'Dukungan Teknis 24/7 & Zona Data Center',
      type: 'Benefit',
      icon: 'support_agent',
      desc: 'Respon cepat 24/7/365 & latensi rendah DC lokal',
      formattedValue: `Skor ${c9} / 100`
    }
  ];
});

function formatIDR(val) {
  if (!val) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(val);
}

async function fetchLaptopDetail() {
  loading.value = true;
  try {
    const res = await axios.get(`/api/laptops/${route.params.id}`);
    if (res.data.success) {
      laptop.value = res.data.data;
    }
  } catch (err) {
    console.error('Error fetching laptop detail:', err);
  } finally {
    loading.value = false;
  }
}

function addToCart(event) {
  if (!laptop.value) return;
  triggerFlyToCart(event, laptop.value);
  isAddedTemporarily.value = true;
  setTimeout(() => {
    isAddedTemporarily.value = false;
  }, 1500);
}

function buyNow() {
  if (!laptop.value) return;
  cartStore.addItem(laptop.value);
  router.push('/checkout');
}

onMounted(() => {
  fetchLaptopDetail();
});
</script>
