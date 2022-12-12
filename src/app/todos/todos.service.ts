import {HttpClient} from '@angular/common/http'
import {Injectable} from '@angular/core'
import {isEqual} from 'lodash-es'
import {catchError, delay, map, Observable, of, tap, timeout} from 'rxjs'
import {ApiParams, ApiResponse} from '../core/api.service'
import {ApiMeta} from '../core/paginate.component'
import {State, StateService} from '../core/state.service'

export interface Todo {
  userId: number
  id: number
  title: string
  completed: boolean
}
export interface ApiTodosOutput {
  todos: Todo[]
  skip: number
  limit: number
  total: number
}

const initialState: State<Todo> = {
  storageKey: 'todoState',
  params: {
    page: '1',
    limit: '10',
  },
  data: [],
  meta: {
    limit: 10,
    page: 1,
    pageCount: 0,
    count: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
}

@Injectable({
  providedIn: 'root',
})
export class TodosService extends StateService<Todo> {
  state$ = this.select((state) => state)

  constructor(private readonly http: HttpClient) {
    super(initialState)
  }

  getTodos$(params?: Partial<ApiParams>): Observable<ApiResponse<Todo>> {
    const updatedState: State<Todo> = {
      ...this.state,
      isLoading: true,
      error: undefined,
      params: {...this.state.params, ...params},
      meta: {
        ...this.state.meta,
        page: +(params?.page ?? this.state.meta?.page),
        limit: +(params?.limit ?? this.state.meta?.limit),
      },
    }
    if (!this.state.error && isEqual(this.state.params, updatedState.params)) {
      return of({
        data: this.state.data,
        meta: this.state.meta,
      } as ApiResponse<Todo>)
    }
    this.storeState(updatedState)

    return this.http
      .get<ApiTodosOutput>('https://dummyjson.com/todos', {
        params: {
          limit: updatedState.params?.limit,
          skip: (+updatedState.params?.page - 1) * +updatedState.params?.limit,
        },
      })
      .pipe(
        delay(1000),
        timeout(2000),
        map((response) => ({
          data: response.todos,
          meta: this.getMeta(response),
        })),
        tap((response) =>
          this.storeState({
            data: response.data,
            meta: response.meta,
            isLoading: false,
            error: undefined,
          }),
        ),
        catchError((error) => {
          this.storeState({
            error: error.message,
            isLoading: false,
          })
          return of(error)
        }),
      )
  }

  updateTodo$(id: number, body: Partial<Todo>): Observable<Todo> {
    return this.http.put<Todo>(`https://dummyjson.com/todos/${id}`, body).pipe(
      tap((newTodo) => {
        const newTodos = this.state.data.map((todo) =>
          +todo.id === +newTodo.id ? {...todo, ...newTodo, id: +todo.id} : todo,
        )
        this.storeState({...this.state, data: newTodos})
      }),
    )
  }

  setTodosParams(params: Partial<ApiParams>): void {
    this.storeState({params: {...this.state.params, ...params}})
  }

  private getMeta(response: ApiTodosOutput): ApiMeta {
    const page = (response.skip ?? 0) / response.limit + 1
    const limit = response.limit
    const count = response.total
    const pageCount = Math.ceil(response.total / response.limit)
    const hasPreviousPage = page > 1
    const hasNextPage = page < pageCount

    return {
      page,
      limit,
      count,
      pageCount,
      hasNextPage,
      hasPreviousPage,
    } as ApiMeta
  }
}
