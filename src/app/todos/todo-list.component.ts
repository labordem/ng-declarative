import {CommonModule} from '@angular/common'
import {ChangeDetectionStrategy, Component, Input} from '@angular/core'
import {switchMap, tap} from 'rxjs'
import {ApiParams} from '../core/api.service'
import {DataLoaderComponent} from '../core/data-loader.component'
import {PaginateComponent} from '../core/paginate.component'
import {UrlService} from '../core/url.service'
import {TodoComponent} from './todo.component'
import {Todo, TodosService} from './todos.service'

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [
    CommonModule,
    TodoComponent,
    DataLoaderComponent,
    PaginateComponent,
  ],
  template: `
    <section
      *ngIf="{todosState: todosState$ | async, params: params$ | async} as $"
    >
      <h1>{{ title }}</h1>

      <app-paginate
        *ngIf="$.todosState?.data?.length"
        [meta]="$.todosState?.meta"
        (paramsChange)="onParamsChanged($event)"
      ></app-paginate>

      <app-data-loader [state]="$.todosState">
        <app-todo
          *ngFor="let todo of $.todosState?.data"
          [todo]="todo"
          (select)="onCompleteTodo(todo)"
        ></app-todo>
      </app-data-loader>
    </section>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoListComponent {
  @Input() title!: string

  constructor(
    private todosService: TodosService,
    private urlService: UrlService,
  ) {}

  params$ = this.urlService.params$.pipe(
    switchMap((params) => this.todosService.getTodos$(params)),
  )

  todosState$ = this.todosService.state$.pipe(
    tap((state) => this.urlService.setParams(state.params)),
  )

  onCompleteTodo(todo: Todo): void {
    this.todosService
      .updateTodo$(todo.id, {completed: !todo.completed})
      .subscribe()
  }

  onParamsChanged(params: ApiParams): void {
    this.urlService.setParams(params)
  }
}
