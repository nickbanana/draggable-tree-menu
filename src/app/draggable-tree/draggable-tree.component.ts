import { Tree, TreeItem, TreeItemGroup } from '@angular/aria/tree';
import { NgTemplateOutlet } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { MenuItem } from '../entity/menu-item';

@Component({
  selector: 'app-draggable-tree',
  imports: [
    Tree,
    TreeItem,
    TreeItemGroup,
    NgTemplateOutlet,
    DragDropModule,
  ],
  templateUrl: './draggable-tree.component.html',
  styleUrl: './draggable-tree.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DraggableTreeComponent {
  nodes = model.required<MenuItem[]>();

  get mutableNodes() {
    return this.nodes();
  }
  set mutableNodes(value: MenuItem[]) {
    this.nodes.set(value);
  }


  drop(event: CdkDragDrop<MenuItem[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }
}
