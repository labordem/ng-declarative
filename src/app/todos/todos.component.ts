import {CommonModule} from '@angular/common'
import {ChangeDetectionStrategy, Component} from '@angular/core'
import {DataLoaderComponent} from '../core/data-loader.component'
import {PaginateComponent} from '../core/paginate.component'
import {TodoListComponent} from './todo-list.component'
import {TodoComponent} from './todo.component'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    TodoComponent,
    DataLoaderComponent,
    PaginateComponent,
    TodoListComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="grid">
      <app-todo-list title="Component 1"></app-todo-list>
      <app-todo-list title="Component 2"></app-todo-list>
    </section>
  `,
  styles: [
    `
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(400px, 50%));
      }
    `,
  ],
})
export class TodosComponent {}
