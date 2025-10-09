import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import DesktopView from '@/views/Desktop.vue';
import LoginView from '@/views/cms/Login.vue';
import CmsDesktop from '@/views/cms/CmsDesktop.vue';
import { useAuthStore } from '@/stores/auth';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: DesktopView,
  },
  {
    path: '/admin-panel',
    name: 'admin-panel',
    component: LoginView,
  },
  {
    path: '/admin-panel/desktop',
    name: 'admin-desktop',
    component: CmsDesktop,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to) => {
  const auth = useAuthStore();

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'admin-panel', query: { redirect: to.fullPath } };
  }

  if (to.name === 'admin-panel' && auth.isAuthenticated) {
    return { name: 'admin-desktop' };
  }
});

export default router;
