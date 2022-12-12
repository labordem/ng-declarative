import {Injectable} from '@angular/core'
import {ActivatedRoute, Params, Router} from '@angular/router'
import {BehaviorSubject, distinctUntilChanged} from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class UrlService {
  private paramsSubject = new BehaviorSubject<Params>({})
  params$ = this.paramsSubject.asObservable()

  constructor(private activatedRoute: ActivatedRoute, private router: Router) {
    this.activatedRoute.queryParams.pipe(distinctUntilChanged()).subscribe({
      next: (params) => this.paramsSubject.next(params),
      error: () => this.paramsSubject.next({}),
    })
  }

  getParams(): Params {
    return this.activatedRoute.snapshot.queryParams
  }

  setParams(params: Params): void {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: params,
      queryParamsHandling: 'merge',
    })
  }
}
