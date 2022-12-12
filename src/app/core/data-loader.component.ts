import {CommonModule} from '@angular/common'
import {Component, Input} from '@angular/core'

interface State {
  isLoading?: boolean
  error?: string
  data: unknown[]
}

@Component({
  selector: 'app-data-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-container
      *ngIf="state !== null && !state.isLoading; else loadingTemplate"
    >
      <ng-container *ngIf="!state.error; else errorTemplate">
        <ng-container *ngIf="state.data.length; else emptyTemplate">
          <ng-content></ng-content>
        </ng-container>
      </ng-container>
    </ng-container>

    <ng-template #loadingTemplate>
      <p>Loading...</p>
    </ng-template>

    <ng-template #emptyTemplate>
      <p>Empty list !</p>
    </ng-template>

    <ng-template #errorTemplate>
      <p>Error occured !</p>
      <p>{{ state?.error }}</p>
    </ng-template>
  `,
  styles: [],
})
export class DataLoaderComponent {
  @Input() state!: State | null
}
