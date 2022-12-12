import {CommonModule} from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core'

interface Todo {
  userId: number
  id: number
  title: string
  completed: boolean
}

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <pre
      [style]="todo.completed ? 'color: var(--accent)' : ''"
      (click)="onSelect(todo)"
      >{{ todo | json }}</pre
    >
  `,
  styles: [],
})
export class TodoComponent implements OnInit {
  @Input() todo!: Todo
  @Output() select = new EventEmitter<Todo>()

  constructor() {}

  ngOnInit(): void {}

  onSelect(todo: Todo): void {
    this.select.emit(todo)
  }
}
