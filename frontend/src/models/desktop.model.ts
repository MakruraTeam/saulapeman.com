export type BP = 'sm' | 'md' | 'lg' | 'xl';
export type BreakpointsWidths = Record<BP, number>;

export type BgMode = 'fitHeight' | 'fitWidth';

export const BP_WIDTHS: BreakpointsWidths = {
  sm: 0,
  md: 768,
  lg: 992,
  xl: 1200,
};

export type ItemPos = { row: number; col: number; };
export type GridItem = {
  id: string;
  label: string;
  iconClass?: string;
  positions: Record<BP, ItemPos>;
};

export const GRID_DEFAULT = {
  sm: { cols: 4, rows: 10 },
  md: { cols: 8, rows: 10 },
  lg: { cols: 12, rows: 10 },
  xl: { cols: 16, rows: 10 },
  taskbarHeight: 28,
} as const;
