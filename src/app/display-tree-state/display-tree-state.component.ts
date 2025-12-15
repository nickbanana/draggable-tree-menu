import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { MenuItem } from '../entity/menu-item';

@Component({
  selector: 'app-display-tree-state',
  imports: [],
  templateUrl: './display-tree-state.component.html',
  styleUrl: './display-tree-state.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisplayTreeStateComponent {
  private readonly INITIAL_TEXT = 'Click "Snapshot State" to capture the current state';
  currentTreeState = input.required<MenuItem[]>();
  snapshotedState = signal<string>(this.INITIAL_TEXT);

  snapshotState(): void {
    const currentTreeState = structuredClone(this.currentTreeState());
    this.snapshotedState.set(JSON.stringify(currentTreeState, null, 2));
  }
}
