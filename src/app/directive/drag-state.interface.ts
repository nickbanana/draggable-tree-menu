/**
 * Mouse coordinate and movement tracking
 */
export interface MouseState {
  offsetX: number;
  offsetY: number;
  startX: number;
  startY: number;
  lastX: number;
  lastY: number;
  nowX: number;
  nowY: number;
  distX: number;
  distY: number;
  dirX: number;
  dirY: number;
  dirAx: number;
  lastDirX: number;
  lastDirY: number;
  distAxX: number;
  distAxY: number;
  isMoving: boolean;
}

/**
 * Drag configuration with CSS selectors and behavior settings
 */
export interface DragConfig {
  listNodeName: string;
  itemNodeName: string;
  rootClass: string;
  listClass: string;
  itemClass: string;
  handleClass: string;
  dragClass: string;
  collapsedClass: string;
  placeClass: string;
  noDragClass: string;
  emptyClass: string;
  expandBtnHTML: string;
  collapseBtnHTML: string;
  group: number;
  maxDepth: number;
  threshold: number;
  sleepTime: number;
  longClick: boolean;
}

/**
 * Current drag operation state
 */
export interface DragState {
  dragEl: HTMLElement | null;
  dragRootEl: HTMLElement | null;
  dragDepth: number;
  hasNewRoot: boolean;
  pointEl: HTMLElement | null;
  placeEl: HTMLElement | null;
  isMoving: boolean;
  draggedItemId: number | null;
}

/**
 * Updated menu structure for API/state updates
 */
export interface MenuStructureItem {
  id: number;
  menus: MenuStructureItem[];
  edited: boolean;
}
