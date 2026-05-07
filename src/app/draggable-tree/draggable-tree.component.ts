import { ChangeDetectionStrategy, Component, computed, model, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItem } from '../entity/menu-item';
import { NestableMenuDirective } from '../directive/nestable-menu.directive';
import { MenuStructureItem } from '../directive/drag-state.interface';

@Component({
  selector: 'app-draggable-tree',
  imports: [CommonModule, NestableMenuDirective],
  templateUrl: './draggable-tree.component.html',
  styleUrl: './draggable-tree.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DraggableTreeComponent {
  nodes = model.required<MenuItem[]>();
  lastMenuStructure = signal<MenuStructureItem[] | null>(null);
  searchKeyword = signal('');
  treeExpansionState = computed(() => this.getTreeExpansionState(this.nodes()));
  hasExpandableNodes = computed(() => this.treeExpansionState().hasBranch);
  areAllExpanded = computed(() => this.treeExpansionState().hasBranch && this.treeExpansionState().allExpanded);
  filteredNodes = computed(() => {
    const keyword = this.searchKeyword().trim().toLowerCase();

    if (!keyword) {
      return this.nodes();
    }

    return this.filterMenuItems(this.nodes(), keyword);
  });

  get mutableNodes() {
    return this.nodes();
  }

  set mutableNodes(value: MenuItem[]) {
    this.nodes.set(value);
  }

  onMenuStructureChanged(structure: MenuStructureItem[]): void {
    this.lastMenuStructure.set(structure);
    console.log('Menu structure updated:', structure);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // eslint-disable-next-line no-console, sonarjs/no-commented-code
    // eslint-disable-next-line sonarjs/no-commented-code, no-console, no-todo-comments
    // API persistence hook can be added here when backend endpoint is ready.
    // this.apiService.updateMenuStructure(structure).subscribe(
    //   () => console.log('Menu structure saved successfully'),
    //   (error) => console.error('Failed to save menu structure', error)
    // );
  }

  onSearchKeywordInput(keyword: string): void {
    this.searchKeyword.set(keyword);
  }

  onToggleExpandCollapseAll(): void {
    const targetExpandedState = !this.areAllExpanded();
    this.mutableNodes = this.applyExpandedState(this.nodes(), targetExpandedState);
  }

  private filterMenuItems(items: MenuItem[], keyword: string): MenuItem[] {
    return items.reduce<MenuItem[]>((accumulator, item) => {
      const filteredChildren = item.menus ? this.filterMenuItems(item.menus, keyword) : [];
      const selfMatched = this.isMenuMatched(item, keyword);

      if (!selfMatched && filteredChildren.length === 0) {
        return accumulator;
      }

      accumulator.push({
        ...item,
        expanded: filteredChildren.length > 0 ? true : item.expanded,
        menus: filteredChildren.length > 0 ? filteredChildren : undefined,
      });

      return accumulator;
    }, []);
  }

  private isMenuMatched(item: MenuItem, keyword: string): boolean {
    return (
      item.name.toLowerCase().includes(keyword) ||
      item.path.toLowerCase().includes(keyword)
    );
  }

  private applyExpandedState(items: MenuItem[], expanded: boolean): MenuItem[] {
    return items.map((item) => {
      const hasChildren = !!item.menus && item.menus.length > 0;

      return {
        ...item,
        expanded: hasChildren ? expanded : item.expanded,
        menus: item.menus ? this.applyExpandedState(item.menus, expanded) : undefined,
      };
    });
  }

  private getTreeExpansionState(items: MenuItem[]): { hasBranch: boolean; allExpanded: boolean } {
    let hasBranch = false;
    let allExpanded = true;

    for (const item of items) {
      const hasChildren = !!item.menus && item.menus.length > 0;

      if (hasChildren) {
        hasBranch = true;
        if (item.expanded !== true) {
          allExpanded = false;
        }

        const childState = this.getTreeExpansionState(item.menus ?? []);
        if (childState.hasBranch) {
          allExpanded = allExpanded && childState.allExpanded;
        }
      }
    }

    return { hasBranch, allExpanded };
  }
}
