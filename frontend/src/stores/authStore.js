import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('smartinfra_token') || localStorage.getItem('smartlap_token') || null);
  const savedUser = localStorage.getItem('smartinfra_user') || localStorage.getItem('smartlap_user');
  const user = ref(savedUser ? JSON.parse(savedUser) : null);

  // ─── Role Checks ──────────────────────────────────────────────
  const isAdmin  = computed(() => user.value?.role === 'admin');
  const isSales  = computed(() => user.value?.role === 'sales');
  const isStaff  = computed(() => ['admin', 'sales'].includes(user.value?.role));

  // ─── Granular Permissions ──────────────────────────────────────
  const canManageProducts = computed(() => user.value?.role === 'admin');
  const canManageWeights  = computed(() => user.value?.role === 'admin');
  const canProcessOrders  = computed(() => ['admin', 'sales'].includes(user.value?.role));
  const canPitchCredit    = computed(() => ['admin', 'sales'].includes(user.value?.role));

  // ─── Actions ──────────────────────────────────────────────────
  async function login(email, password) {
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      if (res.data.success) {
        token.value = res.data.data.token;
        user.value = res.data.data;
        localStorage.setItem('smartinfra_token', token.value);
        localStorage.setItem('smartlap_token', token.value);
        localStorage.setItem('smartinfra_user', JSON.stringify(user.value));
        localStorage.setItem('smartlap_user', JSON.stringify(user.value));
        return { success: true };
      }
      return { success: false, message: res.data.message };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Login gagal, periksa email dan password Anda.'
      };
    }
  }

  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem('smartinfra_token');
    localStorage.removeItem('smartlap_token');
    localStorage.removeItem('smartinfra_user');
    localStorage.removeItem('smartlap_user');
  }

  return {
    token,
    user,
    isAdmin,
    isSales,
    isStaff,
    canManageProducts,
    canManageWeights,
    canProcessOrders,
    canPitchCredit,
    login,
    logout
  };
});
