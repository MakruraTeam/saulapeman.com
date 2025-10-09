<script setup lang="ts">
import { logout } from '@/services/auth/auth.service';
import { useRouter } from 'vue-router';

const router = useRouter();

const logoutUser = async () => {
  try {
    await logout();
  } catch (err) {
    console.error('Logout failed:', err);
  } finally {
    router.push({ name: 'admin-panel' });
  }
};
</script>

<template>
  <div class="p-4">
    <h2 class="mb-3">CMS LOGGED IN</h2>
    <button class="btn btn-outline-danger" @click="logoutUser">Logout</button>
  </div>
</template>
