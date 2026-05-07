import { DragConfig } from './drag-state.interface';

export const DEFAULT_DRAG_CONFIG: DragConfig = {
  listNodeName: 'ul',
  itemNodeName: 'li',
  rootClass: 'list_wrap',
  listClass: 'list_items',
  itemClass: 'list_item',
  handleClass: 'list_handle',
  dragClass: 'list_dragel',
  collapsedClass: 'list_collapsed',
  placeClass: 'list_placeholder',
  noDragClass: 'list_nodrag',
  emptyClass: 'list_empty',
  expandBtnHTML: '<button data-action="expand" type="button">Expand</button>',
  collapseBtnHTML: '<button data-action="collapse" type="button">Collapse</button>',
  group: 0,
  maxDepth: 4,
  threshold: 20,
  sleepTime: 150,
  longClick: false
};

/**
 * DOM helper utilities for drag operations
 */
export class DragDOMHelper {
  /**
   * Check if element has a specific CSS class
   */
  static hasClass(el: HTMLElement, className: string): boolean {
    return el.classList.contains(className);
  }

  /**
   * Add CSS class to element
   */
  static addClass(el: HTMLElement, className: string): void {
    el.classList.add(className);
  }

  /**
   * Remove CSS class from element
   */
  static removeClass(el: HTMLElement, className: string): void {
    el.classList.remove(className);
  }

  /**
   * Toggle CSS class on element
   */
  static toggleClass(el: HTMLElement, className: string, force?: boolean): void {
    el.classList.toggle(className, force);
  }

  /**
   * Find first parent matching selector
   */
  static closest(el: HTMLElement, selector: string): HTMLElement | null {
    return el.closest(selector) as HTMLElement | null;
  }

  /**
   * Find all children matching selector
   */
  static find(el: HTMLElement, selector: string): HTMLElement[] {
    return Array.from(el.querySelectorAll(selector));
  }

  /**
   * Get direct children matching node name
   */
  static children(el: HTMLElement, nodeName: string): HTMLElement[] {
    return Array.from(el.children).filter(
      (child) => (child as HTMLElement).tagName.toLowerCase() === nodeName.toLowerCase()
    ) as HTMLElement[];
  }

  /**
   * Get direct parent matching node name
   */
  static parent(el: HTMLElement, nodeName: string): HTMLElement | null {
    const parentEl = el.parentElement;
    if (!parentEl) return null;
    return parentEl.tagName.toLowerCase() === nodeName.toLowerCase() ? parentEl : null;
  }

  /**
   * Get all parents of type nodeName
   */
  static parents(el: HTMLElement, nodeName: string): HTMLElement[] {
    const result: HTMLElement[] = [];
    let current = el.parentElement;
    while (current) {
      if (current.tagName.toLowerCase() === nodeName.toLowerCase()) {
        result.push(current);
      }
      current = current.parentElement;
    }
    return result;
  }

  /**
   * Create element from HTML string
   */
  static createElement(tagName: string, className?: string): HTMLElement {
    const el = document.createElement(tagName);
    if (className) {
      el.className = className;
    }
    return el;
  }

  /**
   * Set CSS styles on element
   */
  static setStyle(el: HTMLElement, styles: Record<string, string | number>): void {
    Object.assign(el.style, styles);
  }

  /**
   * Get element height
   */
  static getHeight(el: HTMLElement): number {
    return el.offsetHeight;
  }

  /**
   * Get element width
   */
  static getWidth(el: HTMLElement): number {
    return el.offsetWidth;
  }

  /**
   * Get element's offset position relative to page
   */
  static getOffset(el: HTMLElement): { top: number; left: number } {
    const rect = el.getBoundingClientRect();
    return {
      top: rect.top + window.pageYOffset,
      left: rect.left + window.pageXOffset
    };
  }

  /**
   * Insert element before another element
   */
  static insertBefore(newEl: HTMLElement, referenceEl: HTMLElement): void {
    referenceEl.parentElement?.insertBefore(newEl, referenceEl);
  }

  /**
   * Insert element after another element
   */
  static insertAfter(newEl: HTMLElement, referenceEl: HTMLElement): void {
    referenceEl.parentElement?.insertBefore(newEl, referenceEl.nextSibling);
  }

  /**
   * Append element to parent
   */
  static append(parentEl: HTMLElement, childEl: HTMLElement): void {
    parentEl.appendChild(childEl);
  }

  /**
   * Detach element from DOM
   */
  static detach(el: HTMLElement): void {
    el.remove();
  }

  /**
   * Replace element with another
   */
  static replaceWith(oldEl: HTMLElement, newEl: HTMLElement): void {
    oldEl.parentElement?.replaceChild(newEl, oldEl);
  }

  /**
   * Check if browser supports pointer events
   */
  static supportsPointerEvents(): boolean {
    const el = document.createElement('div');
    const docEl = document.documentElement;
    if (!('pointerEvents' in el.style)) {
      return false;
    }
    el.style.pointerEvents = 'auto';
    el.style.pointerEvents = 'x';
    docEl.appendChild(el);
    const supports = globalThis.getComputedStyle(el, '').pointerEvents === 'auto';
    el.remove();
    return supports;
  }
}
