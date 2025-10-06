<script setup lang="ts">
import type { GridItem } from '@/models/desktop.model';

const props = defineProps<GridItem>();
</script>

<template>
  <div class="tile" role="button" tabindex="0">
    <div class="tile-content">
      <i :class="props.iconClass || 'bi bi-file-earmark'"></i>
      <div class="tile-label" :title="props.label">{{ props.label }}</div>
    </div>
  </div>
</template>

<style scoped>
.tile {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  background: #111827;
  color: #e5e7eb;
  border-radius: 0.25rem;
  transition: transform 120ms ease, box-shadow 120ms ease;
  user-select: none;
}
.tile:hover,
.tile:focus {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.35);
}

.tile-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
}
.tile-content i {
  font-size: 1.5rem;
  line-height: 1;
}
.tile-label {
  font-size: 0.8rem;
  line-height: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
