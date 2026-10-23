<template>
  <!-- Sticky Top Navbar -->
  <header
    class="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 print:hidden"
  >
    <div
      class="max-w-[1380px] w-full mx-auto px-4 sm:px-6 h-16 flex items-center justify-between"
    >
      <div class="flex items-center gap-6">
        <router-link class="flex items-center gap-2.5" to="/" @click="mobileMenuOpen = false">
          <div
            class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm"
          >
            <span
              class="material-symbols-outlined text-white"
              style="font-size: 20px"
              >dns</span
            >
          </div>
          <div class="flex items-center gap-1.5">
            <span class="text-base font-bold tracking-tight text-slate-900"
              >SmartInfra</span
            >
            <span
              class="bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-mono px-1.5 py-0.5 rounded font-semibold"
              >B2B Advisory</span
            >
          </div>
        </router-link>
        <nav class="hidden md:flex items-center gap-6 ml-4">
          <router-link
            to="/"
            class="text-sm font-medium transition-colors"
            :class="
              $route.path === '/'
                ? 'text-blue-600 font-semibold border-b-2 border-blue-600 pb-1'
                : 'text-slate-600 hover:text-blue-600'
            "
          >
            Rekomendasi Arsitektur
          </router-link>
          <router-link
            to="/katalog"
            class="text-sm font-medium transition-colors"
            :class="
              $route.path === '/katalog'
                ? 'text-blue-600 font-semibold border-b-2 border-blue-600 pb-1'
                : 'text-slate-600 hover:text-blue-600'
            "
          >
            Katalog Komputasi
          </router-link>
          <router-link
            to="/cek-pesanan"
            class="text-sm font-medium transition-colors"
            :class="
              $route.path === '/cek-pesanan'
                ? 'text-blue-600 font-semibold border-b-2 border-blue-600 pb-1'
                : 'text-slate-600 hover:text-blue-600'
            "
          >
            Lacak Pengadaan
          </router-link>
        </nav>
      </div>

      <div class="flex items-center gap-2 sm:gap-3">
        <!-- Cart Button with Label & Badge -->
        <router-link
          id="navbar-cart-btn"
          to="/checkout"
          @click="mobileMenuOpen = false"
          class="relative h-9 px-2.5 sm:px-3 flex items-center gap-1.5 sm:gap-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-all duration-300 text-xs font-semibold"
          :class="{ 'scale-105 border-blue-500 shadow-md ring-4 ring-blue-100': cartStore.isBouncing }"
          title="Draft Pengadaan (RFQ)"
        >
          <!-- Expanding ripple ring during landing -->
          <span
            v-if="cartStore.isBouncing"
            class="absolute inset-0 rounded-lg bg-blue-400 opacity-75 animate-ping pointer-events-none"
          ></span>

          <div class="relative flex items-center justify-center">
            <span
              class="material-symbols-outlined transition-transform duration-300"
              :class="{ 'rotate-12 text-blue-600': cartStore.isBouncing }"
              style="font-size: 19px"
            >
              fact_check
            </span>
            <span
              v-if="cartStore.totalCount > 0"
              class="sm:hidden absolute -top-1.5 -right-2 bg-blue-600 text-white font-mono text-[10px] min-w-4 h-4 px-1 rounded-full flex items-center justify-center font-bold shadow-xs transition-all duration-300"
              :class="{ 'scale-125 bg-emerald-600': cartStore.isBouncing }"
            >
              {{ cartStore.totalCount }}
            </span>
          </div>

          <!-- Text Label "Draft RFQ" -->
          <span class="hidden sm:inline font-semibold text-slate-800">Draft RFQ</span>

          <!-- Desktop Badge Counter -->
          <span
            v-if="cartStore.totalCount > 0"
            class="hidden sm:inline-flex items-center justify-center bg-blue-600 text-white font-mono text-[11px] font-bold px-1.5 py-0.5 rounded-full min-w-5 h-4.5 leading-none shadow-xs transition-all duration-300"
            :class="{ 'scale-110 bg-emerald-600': cartStore.isBouncing }"
          >
            {{ cartStore.totalCount }}
          </span>
        </router-link>

        <!-- Mobile Hamburger Menu Button -->
        <button
          type="button"
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="md:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
          :aria-expanded="mobileMenuOpen"
          aria-label="Menu Navigasi Mobile"
        >
          <span class="material-symbols-outlined text-[22px]">
            {{ mobileMenuOpen ? 'close' : 'menu' }}
          </span>
        </button>
      </div>
    </div>

    <!-- Mobile Slide-Down Navigation Menu -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="mobileMenuOpen"
        class="md:hidden border-t border-slate-200 bg-white/98 backdrop-blur-md px-4 py-3 space-y-1 shadow-lg"
      >
        <router-link
          to="/"
          @click="mobileMenuOpen = false"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors"
          :class="$route.path === '/' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700 hover:bg-slate-50'"
        >
          <span class="material-symbols-outlined text-[20px] text-blue-600">dns</span>
          <span>Rekomendasi Arsitektur (SPK SAW)</span>
        </router-link>

        <router-link
          to="/katalog"
          @click="mobileMenuOpen = false"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors"
          :class="$route.path === '/katalog' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700 hover:bg-slate-50'"
        >
          <span class="material-symbols-outlined text-[20px] text-blue-600">cloud</span>
          <span>Katalog Komputasi Cloud & GPU</span>
        </router-link>

        <router-link
          to="/cek-pesanan"
          @click="mobileMenuOpen = false"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors"
          :class="$route.path === '/cek-pesanan' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700 hover:bg-slate-50'"
        >
          <span class="material-symbols-outlined text-[20px] text-emerald-600">fact_check</span>
          <span>Lacak Status Pengadaan (RFQ)</span>
        </router-link>

        <router-link
          to="/login"
          @click="mobileMenuOpen = false"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors border-t border-slate-100 text-slate-500 hover:text-slate-900"
        >
          <span class="material-symbols-outlined text-[20px]">admin_panel_settings</span>
          <span>Masuk Portal Konsultan & Admin</span>
        </router-link>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref } from "vue";
import { useCartStore } from "../stores/cartStore";

const cartStore = useCartStore();
const mobileMenuOpen = ref(false);
</script>
