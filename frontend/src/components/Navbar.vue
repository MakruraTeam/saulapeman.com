<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/auth';
import { logout } from '@/services/auth/auth.service';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const { getUsername } = storeToRefs(auth);
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
  <nav class="navbar navbar-dark bg-dark px-3">
    <a class="navbar-brand" href="#">CMS</a>

    <div class="ms-auto d-flex align-items-center">
      <span v-if="getUsername" class="me-3">
        <strong class="text-light">{{ getUsername }}</strong>
      </span>
      <button class="btn btn-outline-light btn-sm" @click="logoutUser">
        Logout
      </button>
    </div>
  </nav>
</template>
