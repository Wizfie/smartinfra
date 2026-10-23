<template>
  <div class="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans print:bg-white">
    <Navbar v-if="!isStaffRoute" class="print:hidden" />
    <main class="flex-1 print:p-0 print:m-0">
      <router-view />
    </main>
    <Footer v-if="!isStaffRoute" class="print:hidden" />

    <!-- Global Floating Cart Toast Notification -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform translate-y-8 opacity-0 scale-95"
      enter-to-class="transform translate-y-0 opacity-100 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100 scale-100"
      leave-to-class="transform translate-y-4 opacity-0 scale-95"
    >
      <div
        v-if="cartStore.toast"
        class="fixed bottom-6 right-6 z-[99998] max-w-sm bg-white/95 backdrop-blur-md border border-blue-200/80 rounded-2xl shadow-2xl p-3.5 flex items-center gap-3.5 ring-1 ring-black/5 print:hidden"
      >
        <div
          class="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 overflow-hidden"
        >
          <img
            v-if="cartStore.toast.image_url"
            :src="cartStore.toast.image_url"
            :alt="cartStore.toast.model"
            class="w-full h-full object-contain p-1"
          />
          <span
            v-else
            class="material-symbols-outlined text-blue-600"
            style="font-size: 24px"
            >dns</span
          >
        </div>
        <div class="flex-1 min-w-0 pr-1">
          <div class="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600">
            <span class="material-symbols-outlined" style="font-size: 14px">check_circle</span>
            <span>Masuk Keranjang</span>
          </div>
          <p class="text-xs font-bold text-slate-900 truncate">
            {{ cartStore.toast.brand }} {{ cartStore.toast.model }}
          </p>
          <p class="text-[11px] font-mono text-slate-500">
            {{ cartStore.totalCount }} unit di keranjang
          </p>
        </div>
        <div class="flex items-center gap-1.5 shrink-0">
          <router-link
            to="/checkout"
            class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            Lihat
          </router-link>
          <button
            @click="cartStore.dismissToast"
            class="w-6 h-6 rounded-md hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <span class="material-symbols-outlined" style="font-size: 16px">close</span>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
import { useCartStore } from './stores/cartStore';

const route = useRoute();
const cartStore = useCartStore();
const isStaffRoute = computed(() => route.path.startsWith('/admin') || route.path.startsWith('/sales'));
</script>
