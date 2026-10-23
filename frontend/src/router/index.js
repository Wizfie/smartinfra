import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

import HomeView from '../views/HomeView.vue';
import CatalogView from '../views/CatalogView.vue';
import ProductDetailView from '../views/ProductDetailView.vue';
import CheckoutView from '../views/CheckoutView.vue';
import InvoiceView from '../views/InvoiceView.vue';
import OrderTrackingView from '../views/OrderTrackingView.vue';
import LoginView from '../views/LoginView.vue';
import AdminDashboardView from '../views/AdminDashboardView.vue';

const routes = [
  // ── Halaman Publik ──────────────────────────────────────────────
  { path: '/', name: 'Home', component: HomeView },
  { path: '/katalog', name: 'Catalog', component: CatalogView },
  { path: '/infrastructure/:id', name: 'ProductDetail', component: ProductDetailView },
  { path: '/laptop/:id', redirect: to => `/infrastructure/${to.params.id}` },
  { path: '/checkout', name: 'Checkout', component: CheckoutView },
  { path: '/cek-pesanan', name: 'OrderTracking', component: OrderTrackingView },
  { path: '/pesanan/:orderNumber', name: 'Invoice', component: InvoiceView },
  { path: '/login', name: 'Login', component: LoginView },

  // ── Panel Admin Eksekutif ───────────────────────────────────────
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: AdminDashboardView,
    meta: { requiresAuth: true, roles: ['admin'] }
  },

  // ── Portal Kerja Sales & Pembiayaan Kredit ──────────────────────
  {
    path: '/sales',
    name: 'SalesDashboard',
    component: () => import('../views/SalesDashboardView.vue'),
    meta: { requiresAuth: true, roles: ['sales', 'admin'] }
  },

  // ── Catch-all ──────────────────────────────────────────────────
  { path: '/:pathMatch(.*)*', redirect: '/' }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  }
});

// ── Navigation Guard ────────────────────────────────────────────
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth) {
    if (!authStore.token || !authStore.user) {
      return next({ name: 'Login', query: { redirect: to.fullPath } });
    }

    if (to.meta.roles && !to.meta.roles.includes(authStore.user.role)) {
      // Redirect ke portal sesuai role
      if (authStore.user.role === 'sales') return next('/sales');
      if (authStore.user.role === 'admin') return next('/admin');
      return next('/');
    }
  }

  next();
});

export default router;
