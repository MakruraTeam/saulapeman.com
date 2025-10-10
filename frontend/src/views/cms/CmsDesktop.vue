<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import Navbar from '@/components/Navbar.vue';
import { CmsDashboardNavItem } from '@/models/cms.dashboard.model';

const router = useRouter();

const addItems = computed<CmsDashboardNavItem[]>(() => [
  { label: 'Add User', route: 'add-user', icon: 'bi-person-plus' },
  { label: 'Add Folder', route: 'add-folder', icon: 'bi-folder-plus' },
  {
    label: 'Add Textfile',
    route: 'add-textfile',
    icon: 'bi-file-earmark-text',
  },
  {
    label: 'Add Image File',
    route: 'add-image',
    icon: 'bi-file-earmark-image',
  },
  {
    label: 'Add Audio File',
    route: 'add-audio',
    icon: 'bi-file-earmark-music',
  },
  { label: 'Add Link File', route: 'add-link', icon: 'bi-link-45deg' },
  { label: 'Add PDF File', route: 'add-pdf', icon: 'bi-file-earmark-pdf' },
]);

const viewItems = computed<CmsDashboardNavItem[]>(() => [
  { label: 'View Users', route: 'user-list', icon: 'bi-people' },
  { label: 'View Page', route: 'home', icon: 'bi-file-earmark-richtext' },
]);

const goTo = (name: string) => {
  router.push({ name });
};
</script>

<template>
  <div>
    <Navbar />
    <div class="container py-4 text-center">
      <h2 class="mb-4">CMS</h2>
      <div class="row g-3 justify-content-center">
        <div
          class="col-6 col-md-4 col-lg-3"
          v-for="item in addItems"
          :key="item.label"
        >
          <button
            class="tile w-100 square-tile d-flex flex-column align-items-center justify-content-center"
            @click="goTo(item.route)"
            type="button"
          >
            <i :class="['bi', item.icon, 'tile-icon']"></i>
            <span class="tile-label">{{ item.label }}</span>
          </button>
        </div>
      </div>

      <hr class="my-4" />

      <div class="row g-3 justify-content-center">
        <div
          class="col-6 col-md-4 col-lg-3"
          v-for="item in viewItems"
          :key="item.label"
        >
          <button
            class="tile w-100 square-tile d-flex flex-column align-items-center justify-content-center"
            @click="goTo(item.route)"
            type="button"
          >
            <i :class="['bi', item.icon, 'tile-icon']"></i>
            <span class="tile-label">{{ item.label }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tile {
  border: none;
  border-radius: 1rem;
  background: linear-gradient(
        180deg,
        rgba(255, 255, 255, 0.7),
        rgba(255, 255, 255, 0.55)
      )
      padding-box,
    linear-gradient(135deg, rgba(13, 110, 253, 0.25), rgba(111, 66, 193, 0.25))
      border-box;
  border: 1px solid transparent;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04), 0 4px 14px rgba(13, 110, 253, 0.08);
  transition: transform 150ms ease, box-shadow 150ms ease, background 150ms ease;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  cursor: pointer;
}

.tile:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 22px rgba(13, 110, 253, 0.18), 0 2px 6px rgba(0, 0, 0, 0.06);
}

.tile:active {
  transform: translateY(-1px) scale(0.99);
}

.square-tile {
  aspect-ratio: 1 / 1;
  padding: 1rem;
}

.tile-icon {
  font-size: 2rem;
  line-height: 1;
  margin-bottom: 0.5rem;
  color: #0d6efd;
}

.tile-label {
  font-size: 0.95rem;
  font-weight: 600;
  color: #0d6efd;
  letter-spacing: 0.2px;
}

@media (max-width: 576px) {
  .tile {
    border-radius: 1.25rem;
  }
}
</style>
