<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import FileItem from '@/components/File.vue';
import {
  BgMode,
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
  {
    id: 'test-2',
    label: 'A file with a very long name.txt',
    iconClass: 'bi bi-file-text',
    positions: {
      sm: { row: 5, col: 1 },
      md: { row: 5, col: 6 },
      lg: { row: 5, col: 8 },
      xl: { row: 5, col: 10 },
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

const bgMode = ref<BgMode>('fitHeight');
const imgNaturalW = ref<number | null>(null);
const imgNaturalH = ref<number | null>(null);

function computeBgMode() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  if (!imgNaturalW.value || !imgNaturalH.value) {
    bgMode.value = 'fitHeight';
    return;
  }
  const aspect = imgNaturalW.value / imgNaturalH.value;
  const widthIfFitHeight = aspect * vh;
  bgMode.value = vw > widthIfFitHeight ? 'fitWidth' : 'fitHeight';
}

function preloadDesktopImage() {
  const img = new Image();
  img.src = desktopImg;
  if (img.complete && img.naturalWidth && img.naturalHeight) {
    imgNaturalW.value = img.naturalWidth;
    imgNaturalH.value = img.naturalHeight;
    computeBgMode();
  } else {
    img.onload = () => {
      imgNaturalW.value = img.naturalWidth;
      imgNaturalH.value = img.naturalHeight;
      computeBgMode();
    };
  }
}

onMounted(() => {
  computeBP();
  preloadDesktopImage();
  window.addEventListener('resize', computeBP, { passive: true });
  window.addEventListener('resize', computeBgMode, { passive: true });
});
onBeforeUnmount(() => {
  window.removeEventListener('resize', computeBP);
  window.removeEventListener('resize', computeBgMode);
});

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

const desktopBgStyle = computed(() => {
  const size = bgMode.value === 'fitHeight' ? 'auto 100%' : '100% auto';
  return {
    backgroundImage: `url(${desktopImg})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
    backgroundSize: size,
    backgroundColor: '#1f2937',
  } as Record<string, string>;
});

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
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  color: #e5e7eb;
}

.desktop-grid {
  position: absolute;
  inset: 0 0 var(--taskbar-height, 28px) 0;
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
