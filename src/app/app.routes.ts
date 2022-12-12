import {Route} from '@angular/router'

export const routes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'home',
    title: `Home`,
    loadComponent: () =>
      import('./home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'todos',
    title: `Todos`,
    loadComponent: () =>
      import('./todos/todos.component').then((m) => m.TodosComponent),
  },
]
