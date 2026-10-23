<template>
  <div class="min-h-[80vh] flex items-center justify-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans">
    <div class="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
      
      <!-- Logo & Title -->
      <div class="text-center mb-6">
        <div class="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white mx-auto mb-3 shadow-md shadow-blue-500/20">
          <span class="material-symbols-outlined text-[24px]">lock</span>
        </div>
        <h2 class="text-2xl font-extrabold text-slate-900 tracking-tight">Portal Masuk Staf & Konsultan</h2>
        <p class="text-xs text-slate-500 mt-1">
          Akses manajemen infrastruktur Cloud/GPU, kalibrasi profil SAW, analisis TCO, & rekap pengadaan.
        </p>
      </div>

      <!-- Quick Credential Switcher -->
      <div class="mb-5">
        <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400 text-center mb-2">Pilih Akun Cepat</p>
        <div class="grid grid-cols-2 gap-2">
          <button
            type="button"
            id="btn-quick-admin"
            @click="fillCredential('admin@smartinfra.com', 'admin123')"
            :class="[
              'flex flex-col items-center p-3 rounded-2xl border-2 text-xs font-semibold transition-all',
              email === 'admin@smartinfra.com'
                ? 'border-blue-600 bg-blue-50 text-blue-700'
                : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50'
            ]"
          >
            <span class="material-symbols-outlined text-[22px] mb-1">shield_person</span>
            <span>Sysadmin Infra</span>
            <span class="font-normal text-[10px] opacity-70">admin@smartinfra.com</span>
          </button>
          <button
            type="button"
            id="btn-quick-sales"
            @click="fillCredential('consultant@smartinfra.com', 'consultant123')"
            :class="[
              'flex flex-col items-center p-3 rounded-2xl border-2 text-xs font-semibold transition-all',
              email === 'consultant@smartinfra.com'
                ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:bg-emerald-50'
            ]"
          >
            <span class="material-symbols-outlined text-[22px] mb-1">badge</span>
            <span>Solution Architect</span>
            <span class="font-normal text-[10px] opacity-70">consultant@smartinfra.com</span>
          </button>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
        <span class="material-symbols-outlined text-[18px]">error</span>
        <span>{{ errorMessage }}</span>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Email
          </label>
          <input
            id="input-email"
            type="email"
            v-model="email"
            required
            placeholder="email@smartinfra.com"
            class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
          />
        </div>

        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Kata Sandi
          </label>
          <input
            id="input-password"
            type="password"
            v-model="password"
            required
            placeholder="••••••••"
            class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
          />
        </div>

        <button
          type="submit"
          id="btn-login-submit"
          :disabled="loading"
          class="w-full py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <span v-if="loading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          <span>Masuk Portal</span>
        </button>
      </form>

      <!-- Guest Option -->
      <div class="mt-6 pt-6 border-t border-slate-100 text-center">
        <router-link
          to="/"
          class="text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors inline-flex items-center gap-1"
        >
          <span class="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Eksplorasi Katalog Tanpa Login (Klien/Tamu)</span>
        </router-link>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('admin@smartinfra.com');
const password = ref('admin123');
const loading = ref(false);
const errorMessage = ref('');

function fillCredential(e, p) {
  email.value = e;
  password.value = p;
  errorMessage.value = '';
}

async function handleLogin() {
  loading.value = true;
  errorMessage.value = '';
  try {
    const res = await authStore.login(email.value, password.value);
    if (res.success) {
      // Redirect berdasarkan role
      if (authStore.user?.role === 'sales') {
        router.push('/sales');
      } else if (authStore.user?.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } else {
      errorMessage.value = res.message || 'Login gagal';
    }
  } catch (err) {
    errorMessage.value = 'Terjadi kesalahan sistem';
  } finally {
    loading.value = false;
  }
}
</script>
