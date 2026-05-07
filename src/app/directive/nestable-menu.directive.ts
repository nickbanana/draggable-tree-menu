import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  Renderer2,
  signal
} from '@angular/core';
import { MenuItem } from '../entity/menu-item';
import { DEFAULT_DRAG_CONFIG, DragDOMHelper } from './drag-config.constant';
import { DragConfig, DragState, MenuStructureItem, MouseState } from './drag-state.interface';

/**
 * Nestable menu directive for drag-and-drop hierarchical menu reordering
 * Modernized version: No jQuery, uses signals, Renderer2, and typed state
 */
@Directive({
  selector: '[appNestableMenu]',
  exportAs: 'appNestableMenu',
  standalone: true
})
export class NestableMenuDirective implements AfterViewInit, OnDestroy {
  @Input() menuItems: MenuItem[] = [];
  @Output() menuStructureChanged = new EventEmitter<MenuStructureItem[]>();

  private readonly config: DragConfig = DEFAULT_DRAG_CONFIG;
  private readonly el: HTMLElement;

  // State as signals
  private readonly mouseState = signal<MouseState>({
    offsetX: 0,
    offsetY: 0,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    nowX: 0,
    nowY: 0,
    distX: 0,
    distY: 0,
    dirX: 0,
    dirY: 0,
    dirAx: 0,
    lastDirX: 0,
    lastDirY: 0,
    distAxX: 0,
    distAxY: 0,
    isMoving: false,
  });


  private readonly dragState = signal<DragState>({
    dragEl: null,
    dragRootEl: null,
    dragDepth: 0,
    hasNewRoot: false,
    pointEl: null,
    placeEl: null,
    isMoving: false,
    draggedItemId: null
  });

  private readonly timeoutId: ReturnType<typeof setTimeout> | null = null;
  private documentMouseMoveListener: (() => void) | null = null;
  private documentMouseUpListener: (() => void) | null = null;

  constructor(
    private readonly elementRef: ElementRef,
    private readonly renderer: Renderer2
  ) {
    this.el = this.elementRef.nativeElement;
  }

  private getDirection(distance: number): number {
    if (distance === 0) return 0;
    return distance > 0 ? 1 : -1;
  }

  private applyPreviewItemStyle(item: HTMLElement): void {
    DragDOMHelper.setStyle(item, {
      border: '2px dashed #7bb5c0',
      borderRadius: '14px',
      background: '#ffffff',
      boxShadow: '0 10px 24px rgba(16, 24, 40, 0.12)'
    });
  }

  private resetPreviewItemStyle(item: HTMLElement): void {
    item.style.removeProperty('border');
    item.style.removeProperty('border-radius');
    item.style.removeProperty('background');
    item.style.removeProperty('box-shadow');
  }

  ngAfterViewInit(): void {
    this.bindDragEvents();
  }

  ngOnDestroy(): void {
    this.unbindDragEvents();
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  private bindDragEvents(): void {
    // Create event handlers as arrow functions to preserve 'this'
    const onMoveEvent = (evt: MouseEvent) => {
      const dragState = this.dragState();
      if (dragState.dragEl) {
        this.onDragMove(evt);
      }
    };

    const onEndEvent = (evt: MouseEvent) => {
      const dragState = this.dragState();
      if (dragState.dragEl) {
        evt.preventDefault();
        this.onDragStop();
      }
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }
    };

    // Use Renderer2 to attach global listeners
    this.documentMouseMoveListener = this.renderer.listen('document', 'mousemove', onMoveEvent);
    this.documentMouseUpListener = this.renderer.listen('document', 'mouseup', onEndEvent);

    // Attach to element (for drag start)
    this.renderer.listen(this.el, 'mousedown', (evt: MouseEvent) => this.onStartEvent(evt));
    this.renderer.listen(this.el, 'click', (evt: MouseEvent) => this.handleCollapseExpand(evt));
  }

  private unbindDragEvents(): void {
    if (this.documentMouseMoveListener) {
      this.documentMouseMoveListener();
    }
    if (this.documentMouseUpListener) {
      this.documentMouseUpListener();
    }
  }

  private onStartEvent(evt: MouseEvent): void {
    evt.preventDefault();
    const target = evt.target as HTMLElement;

    if (!target || this.dragState().dragEl || target.tagName === 'I') {
      return;
    }

    if (target.tagName === 'BUTTON') {
      // Handled by handleCollapseExpand
      return;
    }

    // Start drag
    const dragItem = DragDOMHelper.closest(target, this.config.itemNodeName);
    if (dragItem) {
      const itemId = Number.parseInt(dragItem.dataset['id'] || '0', 10);
      this.onDragStart(evt, itemId);
    }
  }

  private handleCollapseExpand(evt: MouseEvent): void {
    const target = evt.target as HTMLElement;
    if (target.tagName !== 'BUTTON') return;

    const action = target.dataset['action'];
    const item = DragDOMHelper.closest(target, this.config.itemNodeName);

    if (action && item) {
      if (action === 'collapse') {
        this.collapseItem(item);
      } else if (action === 'expand') {
        this.expandItem(item);
      }
    }
  }

  private onDragStart(evt: MouseEvent, draggedItemId: number): void {
    const mouse = this.mouseState();
    const target = evt.target as HTMLElement;
    const dragItem = DragDOMHelper.closest(target, this.config.itemNodeName);

    if (!dragItem) return;

    const placeEl = DragDOMHelper.createElement(this.config.itemNodeName, this.config.placeClass);
    const dragEl = DragDOMHelper.createElement(this.config.listNodeName);

    // Setup placeholder
    const dragItemHeight = DragDOMHelper.getHeight(dragItem);
    const dragItemWidth = DragDOMHelper.getWidth(dragItem);
    DragDOMHelper.setStyle(placeEl, {
      height: `${dragItemHeight}px`,
      width: `${dragItemWidth}px`,
      border: '2px dashed #7bb5c0',
      borderRadius: '14px',
    });

    // Setup mouse state
    mouse.offsetX = evt.offsetX || evt.pageX - DragDOMHelper.getOffset(target).left;
    mouse.offsetY = evt.offsetY || evt.pageY - DragDOMHelper.getOffset(target).top;
    mouse.startX = mouse.lastX = evt.pageX;
    mouse.startY = mouse.lastY = evt.pageY;

    // Setup drag element
    const dragRootEl = DragDOMHelper.closest(this.el, `.${this.config.rootClass}`);
    DragDOMHelper.addClass(dragEl, this.config.listClass);
    DragDOMHelper.addClass(dragEl, this.config.dragClass);
    DragDOMHelper.setStyle(dragEl, { width: `${DragDOMHelper.getWidth(dragItem)}px` });

    // Insert placeholder and move item to drag element
    DragDOMHelper.insertAfter(placeEl, dragItem);
    dragItem.remove();
    dragEl.appendChild(dragItem);
    document.body.appendChild(dragEl);

    // The drag preview is mounted under body, so apply inline preview styles.
    DragDOMHelper.setStyle(dragEl, {
      position: 'fixed',
      zIndex: 1200,
      pointerEvents: 'none',
      opacity: 0.96,
      transform: 'rotate(-1deg)'
    });
    this.applyPreviewItemStyle(dragItem);

    // Position drag element
    DragDOMHelper.setStyle(dragEl, {
      left: `${evt.clientX - mouse.offsetX}px`,
      top: `${evt.clientY - mouse.offsetY}px`
    });

    // Calculate drag depth
    let dragDepth = 0;
    const items = DragDOMHelper.find(dragEl, this.config.itemNodeName);
    for (const item of items) {
      const depth = DragDOMHelper.parents(item, this.config.listNodeName).length;
      if (depth > dragDepth) {
        dragDepth = depth;
      }
    }

    // Mark items as clicked
    DragDOMHelper.find(dragEl, this.config.itemNodeName).forEach((item) => {
      DragDOMHelper.addClass(item, 'click');
    });

    // Update drag state
    this.dragState.set({
      dragEl,
      dragRootEl,
      dragDepth,
      hasNewRoot: false,
      pointEl: null,
      placeEl,
      isMoving: false,
      draggedItemId
    });

    this.mouseState.set(mouse);
  }

  private onDragMove(evt: MouseEvent): void {
    const mouse = this.mouseState();
    const dragState = this.dragState();
    const opt = this.config;

    if (!dragState.dragEl) return;

    // Update position
    DragDOMHelper.setStyle(dragState.dragEl, {
      left: `${evt.clientX - mouse.offsetX}px`,
      top: `${evt.clientY - mouse.offsetY}px`
    });

    // Update mouse state
    mouse.lastX = mouse.nowX;
    mouse.lastY = mouse.nowY;
    mouse.nowX = evt.pageX;
    mouse.nowY = evt.pageY;
    mouse.distX = mouse.nowX - mouse.lastX;
    mouse.distY = mouse.nowY - mouse.lastY;
    mouse.lastDirX = mouse.dirX;
    mouse.lastDirY = mouse.dirY;
    mouse.dirX = this.getDirection(mouse.distX);
    mouse.dirY = this.getDirection(mouse.distY);

    const newAx = Math.abs(mouse.distX) > Math.abs(mouse.distY) ? 1 : 0;

    // On first move
    if (!mouse.isMoving) {
      mouse.dirAx = newAx;
      mouse.isMoving = true;
      this.mouseState.set(mouse);
      return;
    }

    // Calculate axis distance
    if (mouse.dirAx === newAx) {
      mouse.distAxX += Math.abs(mouse.distX);
      if (mouse.dirX !== 0 && mouse.dirX !== mouse.lastDirX) {
        mouse.distAxX = 0;
      }
      mouse.distAxY += Math.abs(mouse.distY);
      if (mouse.dirY !== 0 && mouse.dirY !== mouse.lastDirY) {
        mouse.distAxY = 0;
      }
    } else {
      mouse.distAxX = 0;
      mouse.distAxY = 0;
    }
    mouse.dirAx = newAx;

    this.mouseState.set(mouse);

    // Handle horizontal movement (nesting)
    if (mouse.dirAx && mouse.distAxX >= opt.threshold && dragState.placeEl) {
      mouse.distAxX = 0;
      const prevSibling = dragState.placeEl.previousElementSibling as HTMLElement | null;
      const prev = prevSibling?.tagName.toLowerCase() === opt.itemNodeName ? prevSibling : null;

      if (mouse.dirX > 0 && prev && !DragDOMHelper.hasClass(prev, opt.collapsedClass)) {
        // Increase level
        const prevLists = DragDOMHelper.find(prev, opt.listNodeName);
        let list = prevLists.at(-1) ?? null;
        const depth = DragDOMHelper.parents(dragState.placeEl, opt.listNodeName).length;

        if (depth + dragState.dragDepth <= opt.maxDepth) {
          if (!list) {
            list = DragDOMHelper.createElement(opt.listNodeName, opt.listClass);
            if (dragState.placeEl) {
              dragState.placeEl.remove();
              list.appendChild(dragState.placeEl);
            }
            prev.appendChild(list);
            this.setParent(prev);
          } else if (dragState.placeEl) {
            dragState.placeEl.remove();
            list.appendChild(dragState.placeEl);
          }
        }
      }

      // Decrease level
      if (mouse.distX < 0 && dragState.placeEl) {
        const nextEl = dragState.placeEl.nextElementSibling as HTMLElement;
        if (!nextEl) {
          const parent = dragState.placeEl.parentElement;
          const itemParent = DragDOMHelper.closest(dragState.placeEl, opt.itemNodeName);
          if (itemParent) {
            itemParent.after(dragState.placeEl);
            if (parent?.children.length === 0) {
              const parentItem = DragDOMHelper.closest(parent, opt.itemNodeName);
              if (parentItem) {
                this.unsetParent(parentItem);
              }
            }
          }
        }
      }
    }

    // Find element under cursor
    const supportsPointerEvents = DragDOMHelper.supportsPointerEvents();
    if (!supportsPointerEvents && dragState.dragEl) {
      dragState.dragEl.style.visibility = 'hidden';
    }

    const pointEl = document.elementFromPoint(
      evt.pageX - document.body.scrollLeft,
      evt.pageY - (window.pageYOffset || document.documentElement.scrollTop)
    ) as HTMLElement;

    if (!supportsPointerEvents && dragState.dragEl) {
      dragState.dragEl.style.visibility = 'visible';
    }

    let targetEl: HTMLElement | null = null;
    if (pointEl) {
      if (DragDOMHelper.hasClass(pointEl, opt.handleClass)) {
        targetEl = DragDOMHelper.closest(pointEl, opt.itemNodeName);
      } else if (DragDOMHelper.hasClass(pointEl, opt.itemClass)) {
        targetEl = pointEl;
      }
    }

    if (!targetEl || !dragState.placeEl) return;

    // Handle vertical movement
    if (!mouse.dirAx || DragDOMHelper.hasClass(targetEl, opt.emptyClass)) {
      const depth = dragState.dragDepth - 1 + DragDOMHelper.parents(dragState.placeEl, opt.listNodeName).length;
      if (depth > opt.maxDepth) return;

      const targetOffset = DragDOMHelper.getOffset(targetEl);
      const targetHeight = DragDOMHelper.getHeight(targetEl);
      const before = evt.pageY < targetOffset.top + targetHeight / 2;

      const parent = dragState.placeEl.parentElement;

      if (DragDOMHelper.hasClass(targetEl, opt.emptyClass)) {
        const list = DragDOMHelper.createElement(opt.listNodeName, opt.listClass);
        dragState.placeEl.remove();
        list.appendChild(dragState.placeEl);
        targetEl.appendChild(list);
      } else if (before) {
        targetEl.before(dragState.placeEl);
      } else {
        targetEl.after(dragState.placeEl);
      }

      if (parent?.children.length === 0) {
        const parentItem = DragDOMHelper.closest(parent, opt.itemNodeName);
        if (parentItem) {
          this.unsetParent(parentItem);
        }
      }

      if (dragState.dragRootEl && DragDOMHelper.find(dragState.dragRootEl, opt.itemNodeName).length === 0) {
        const emptyDiv = DragDOMHelper.createElement('div', opt.emptyClass);
        dragState.dragRootEl.appendChild(emptyDiv);
      }
    }
  }

  private onDragStop(): void {
    const dragState = this.dragState();
    if (!dragState.dragEl) return;

    const firstItem = dragState.dragEl.querySelector(this.config.itemNodeName) as HTMLElement;
    if (firstItem) {
      this.resetPreviewItemStyle(firstItem);
      DragDOMHelper.find(firstItem, '.click').forEach((el) => {
        DragDOMHelper.removeClass(el, 'click');
      });
      DragDOMHelper.addClass(firstItem, 'click');
      dragState.placeEl?.replaceWith(firstItem);
    }

    dragState.dragEl.remove();
    this.el.dispatchEvent(new Event('change', { bubbles: true }));

    if (dragState.hasNewRoot && dragState.dragRootEl) {
      dragState.dragRootEl.dispatchEvent(new Event('change', { bubbles: true }));
    }

    // Notify about menu structure change (mock - easy to migrate to real API)
    this.notifyMenuStructureChange();

    this.reset();
  }

  private setParent(li: HTMLElement): void {
    const children = DragDOMHelper.children(li, this.config.listNodeName);
    if (children.length) {
      const expandBtn = DragDOMHelper.createElement('button');
      expandBtn.dataset['action'] = 'expand';
      expandBtn.textContent = 'Expand';
      expandBtn.style.display = 'none';

      const collapseBtn = DragDOMHelper.createElement('button');
      collapseBtn.dataset['action'] = 'collapse';
      collapseBtn.textContent = 'Collapse';

      li.prepend(expandBtn);
      li.prepend(collapseBtn);
    }
  }

  private unsetParent(li: HTMLElement): void {
    DragDOMHelper.removeClass(li, this.config.collapsedClass);
    DragDOMHelper.find(li, '[data-action]').forEach((el) => el.remove());
    DragDOMHelper.find(li, this.config.listNodeName).forEach((el) => el.remove());
  }

  private collapseItem(li: HTMLElement): void {
    const lists = DragDOMHelper.children(li, this.config.listNodeName);
    if (lists.length) {
      this.updateExpandedStateFromElement(li, false);
      DragDOMHelper.addClass(li, this.config.collapsedClass);
      const collapseBtn = li.querySelector('[data-action="collapse"]') as HTMLElement;
      const expandBtn = li.querySelector('[data-action="expand"]') as HTMLElement;
      if (collapseBtn) collapseBtn.style.display = 'none';
      if (expandBtn) expandBtn.style.display = '';
      lists.forEach((list) => (list.style.display = 'none'));
    }
  }

  private expandItem(li: HTMLElement): void {
    this.updateExpandedStateFromElement(li, true);
    DragDOMHelper.removeClass(li, this.config.collapsedClass);
    const expandBtn = li.querySelector('[data-action="expand"]') as HTMLElement;
    const collapseBtn = li.querySelector('[data-action="collapse"]') as HTMLElement;
    if (expandBtn) expandBtn.style.display = 'none';
    if (collapseBtn) collapseBtn.style.display = '';
    DragDOMHelper.children(li, this.config.listNodeName).forEach((list) => {
      list.style.display = '';
    });
  }

  private updateExpandedStateFromElement(li: HTMLElement, expanded: boolean): void {
    const itemId = Number.parseInt(li.dataset['id'] || '', 10);
    if (!Number.isFinite(itemId)) {
      return;
    }

    this.menuItems = this.updateExpandedState(this.menuItems, itemId, expanded);
  }

  private updateExpandedState(items: MenuItem[], itemId: number, expanded: boolean): MenuItem[] {
    let hasChanged = false;

    const updatedItems = items.map((item) => {
      const updatedChildren = item.menus ? this.updateExpandedState(item.menus, itemId, expanded) : item.menus;
      const isTarget = item.id === itemId;
      const nextExpanded = isTarget ? expanded : item.expanded;

      if (isTarget || updatedChildren !== item.menus) {
        hasChanged = true;
      }

      if (!isTarget && updatedChildren === item.menus) {
        return item;
      }

      return {
        ...item,
        expanded: nextExpanded,
        menus: updatedChildren,
      };
    });

    return hasChanged ? updatedItems : items;
  }

  private reset(): void {
    this.mouseState.set({
      offsetX: 0,
      offsetY: 0,
      startX: 0,
      startY: 0,
      lastX: 0,
      lastY: 0,
      nowX: 0,
      nowY: 0,
      distX: 0,
      distY: 0,
      dirX: 0,
      dirY: 0,
      dirAx: 0,
      lastDirX: 0,
      lastDirY: 0,
      distAxX: 0,
      distAxY: 0,
      isMoving: false
    });

    this.dragState.set({
      dragEl: null,
      dragRootEl: null,
      dragDepth: 0,
      hasNewRoot: false,
      pointEl: null,
      placeEl: null,
      isMoving: false,
      draggedItemId: null
    });
  }

  /**
   * Mock function for menu structure change notification
   * Replace with actual API call when ready
   */
  private notifyMenuStructureChange(): void {
    const structure = this.buildMenuStructure(this.el);
    this.menuStructureChanged.emit(structure);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // eslint-disable-next-line no-console, sonarjs/no-commented-code
    // eslint-disable-next-line sonarjs/no-commented-code, no-console, no-todo-comments
    // TODO: Replace with actual API call when authHttpService is available
    // Example:
    // this.apiService.updateMenuStructure(structure).subscribe(
    //   () => console.log('Menu structure updated'),
    //   (error) => console.error('Failed to update menu structure', error)
    // );
    // eslint-disable-next-line no-console
    console.debug('Menu structure changed:', structure);
  }

  private buildMenuStructure(container: HTMLElement): MenuStructureItem[] {
    const result: MenuStructureItem[] = [];
    const items = DragDOMHelper.children(container, this.config.itemNodeName);

    for (const item of items) {
      const itemId = Number.parseInt(item.dataset['id'] || '0', 10);
      const lists = DragDOMHelper.children(item, this.config.listNodeName);
      const subItems = lists.length > 0 ? this.buildMenuStructure(lists[0]) : [];
      const dragState = this.dragState();

      result.push({
        id: itemId,
        menus: subItems,
        edited: itemId === dragState.draggedItemId
      });
    }

    return result;
  }
}
