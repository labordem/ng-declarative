import {CommonModule} from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core'
import {ApiParams} from './api.service'

export interface ApiMeta {
  page: number
  limit: number
  count: number
  pageCount: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

@Component({
  selector: 'app-paginate',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="paginate">
      <button
        *ngFor="
          let page of [].constructor(meta?.pageCount || 0);
          let index = index
        "
        [class]="(meta?.page ?? 1) === index + 1 ? 'active' : ''"
        (click)="onIndexChanged(index)"
      >
        {{ index + 1 }}
      </button>

      <select
        #limitSelect
        [value]="meta?.limit"
        (change)="onLimitChanged(limitSelect.value)"
      >
        <option value="5">5</option>
        <option value="10">10</option>
      </select>
    </div>
  `,
  styles: [
    `
      .paginate {
        display: inline-block;
      }

      .paginate button {
        color: black;
        float: left;
        padding: 4px 8px;
        text-decoration: none;
        transition: background-color 0.3s;
        border: 1px solid #ddd;
      }

      .paginate select {
        margin: 2px 10px;
      }

      .paginate button.active {
        background-color: var(--accent);
        color: white;
        border: 1px solid var(--accent);
      }

      .paginate button:hover:not(.active) {
        background-color: #ddd;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginateComponent {
  @Input() meta?: ApiMeta
  @Output() paramsChange = new EventEmitter<ApiParams>()

  onIndexChanged(index: number): void {
    this.paramsChange.emit({page: `${index + 1}`})
  }

  onLimitChanged(limit: string): void {
    this.paramsChange.emit({limit})
  }
}
