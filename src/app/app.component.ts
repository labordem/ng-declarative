import {Component} from '@angular/core'
import {RouterModule} from '@angular/router'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div id="layout">
      <header style="background: black; color: white">
        <a routerLink="home" style="padding: 0 4px" routerLinkActive="active"
          >Home</a
        >
        <a routerLink="todos" style="padding: 0 4px" routerLinkActive="active"
          >Todos</a
        >
      </header>
      <main>
        <router-outlet></router-outlet>
      </main>
      <!-- <footer style="background: black; color:white">Footer</footer> -->
    </div>
  `,
  styles: [
    `
      #layout {
        height: 100%;
        width: 100%;
        display: grid;
        grid-template-rows: auto 1fr;
      }

      .active {
        color: var(--accent);
      }
    `,
  ],
})
export class AppComponent {
  title = 'ng-declarative'
}
