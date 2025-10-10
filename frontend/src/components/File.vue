<script setup lang="ts">
import type { GridItem } from '@/models/desktop.model';
const props = defineProps<GridItem>();
</script>

<template>
  <div class="tile" role="button" tabindex="0">
    <div class="tile-content">
      <div class="icon-wrap">
        <i :class="props.iconClass || 'bi bi-file-earmark'"></i>
      </div>
      <div class="label-wrap">
        <div class="tile-label" :title="props.label">{{ props.label }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tile {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  background: transparent;
  border-radius: 0.25rem;
  transition: background-color 150ms ease, transform 120ms ease;
  user-select: none;
}

.tile:hover,
.tile:focus {
  background-color: rgba(255, 255, 255, 0.1);
}

.tile-content {
  display: grid;
  grid-template-rows: 2.5fr 1fr;
  width: 100%;
  height: 100%;
}

.icon-wrap,
.label-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
}

.icon-wrap i {
  font-size: clamp(1.25rem, 7vmin, 2.5rem);
  line-height: 1;
}

.tile-label {
  text-align: center;
  white-space: normal;
  overflow: hidden;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;

  font-size: clamp(0.85rem, 1.8vmin, 1rem);
  line-height: 1.2;
  padding: 0 4px;
}
</style>
