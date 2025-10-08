import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import DesktopView from '@/views/Desktop.vue';
import LoginView from '@/views/cms/Login.vue';

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
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
