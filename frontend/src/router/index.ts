import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import DesktopView from '@/views/Desktop.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: DesktopView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
