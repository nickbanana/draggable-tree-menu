import { Component, signal } from '@angular/core';
import { DisplayTreeStateComponent } from "./display-tree-state/display-tree-state.component";
import { DraggableTreeComponent } from './draggable-tree/draggable-tree.component';
import { INITIAL_MENU_STATE } from './const/initial-menu-state';

@Component({
  selector: 'app-root',
  imports: [
    DraggableTreeComponent,
    DisplayTreeStateComponent
],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('draggable-tree-menu');
  menuState = signal(INITIAL_MENU_STATE);
}
