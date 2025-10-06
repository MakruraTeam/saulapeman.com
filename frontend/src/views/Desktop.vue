<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import FileItem from '@/components/File.vue';
import {
  BP,
  BP_WIDTHS,
  GRID_DEFAULT,
  type GridItem,
} from '@/models/desktop.model';

import desktopImg from '@/assets/desktop-bg.png';

const items = ref<GridItem[]>([
  {
    id: 'folder-1',
    label: 'Projects',
    iconClass: 'bi bi-folder-fill',
    positions: {
      sm: { row: 2, col: 1 },
      md: { row: 2, col: 1 },
      lg: { row: 2, col: 1 },
      xl: { row: 2, col: 1 },
    },
  },
  {
    id: 'img-1',
    label: 'Logo.png',
    iconClass: 'bi bi-file-image',
    positions: {
      sm: { row: 3, col: 2 },
      md: { row: 3, col: 3 },
      lg: { row: 3, col: 5 },
      xl: { row: 3, col: 7 },
    },
  },
  {
    id: 'txt-1',
    label: 'Readme.txt',
    iconClass: 'bi bi-file-text',
    positions: {
      sm: { row: 6, col: 1 },
      md: { row: 4, col: 6 },
      lg: { row: 4, col: 8 },
      xl: { row: 4, col: 10 },
    },
  },
]);

const currentBP = ref<BP>('lg');
const computeBP = () => {
  const width = window.innerWidth;
  if (width >= BP_WIDTHS.xl) currentBP.value = 'xl';
  else if (width >= BP_WIDTHS.lg) currentBP.value = 'lg';
  else if (width >= BP_WIDTHS.md) currentBP.value = 'md';
  else currentBP.value = 'sm';
};

onMounted(() => {
  computeBP();
  window.addEventListener('resize', computeBP, { passive: true });
});
onBeforeUnmount(() => window.removeEventListener('resize', computeBP));

const gridStyle = computed(() => {
  const { cols, rows } = GRID_DEFAULT[currentBP.value];
  return {
    display: 'grid',
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    gridTemplateRows: `repeat(${rows}, 1fr)`,
    gap: '0px',
    '--cols': String(cols),
    '--rows': String(rows),
    '--taskbar-height': `${GRID_DEFAULT.taskbarHeight}px`,
  } as Record<string, string>;
});

// Background image: fit height, crop sides, centered
const desktopBgStyle = computed(() => ({
  backgroundImage: `url(${desktopImg})`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center center',
  backgroundSize: 'auto 100%', // height = 100vh, width scales; sides crop if wider
  backgroundColor: '#1f2937', // fallback dark gray behind image
}));

function cellStyleFor(item: GridItem) {
  const itemPosition = item.positions[currentBP.value];
  return {
    gridColumn: `${itemPosition.col} / span 1`,
    gridRow: `${itemPosition.row} / span ${itemPosition.h ?? 1}`,
  } as Record<string, string>;
}
</script>

<template>
  <div class="desktop-root" :style="desktopBgStyle">
    <div class="desktop-grid" :style="gridStyle">
      <FileItem
        v-for="item in items"
        :key="item.id"
        v-bind="item"
        :style="cellStyleFor(item)"
      />
    </div>
    <div class="taskbar"></div>
  </div>
</template>

<style scoped>
.desktop-root {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  /* background is now applied inline via :style to support imported image */
  color: #e5e7eb;
  position: relative;
}

.desktop-grid {
  position: absolute;
  inset: 0 0 var(--taskbar-height, 28px) 0;
  /* grid lines sit ON TOP of the background image layers from .desktop-root */
  background-image: linear-gradient(
      to right,
      rgba(255, 255, 255, 0.08) 1px,
      transparent 1px
    ),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px);
  background-size: calc(100% / var(--cols)) 100%, 100% calc(100% / var(--rows));
  background-repeat: repeat;
}

.taskbar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: var(--taskbar-height, 28px);
  background: rgba(17, 24, 39, 0.7);
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(6px);
}
</style>
