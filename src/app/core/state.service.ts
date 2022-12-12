import {BehaviorSubject, distinctUntilChanged, map, Observable} from 'rxjs'
import {ApiParams, ApiResponse} from './api.service'

type StorageLocation = 'localStorage' | 'sessionStorage'

export interface State<T> extends ApiResponse<T> {
  storageKey: string
  params: Required<ApiParams>
  isLoading?: boolean
  error?: string
  selectedTodoId?: number
}

export class StateService<T> {
  private initialState!: State<T>
  private stateSubject: BehaviorSubject<State<T>>
  protected get state(): State<T> {
    return this.stateSubject.getValue()
  }

  constructor(initialState: State<T>) {
    this.initialState = initialState
    this.stateSubject = new BehaviorSubject<State<T>>(
      this.getItemFromStorage(initialState.storageKey) ?? initialState,
    )
  }

  protected select<K>(mapFn: (state: State<T>) => K): Observable<K> {
    return this.stateSubject.asObservable().pipe(
      map((state) => mapFn(state)),
      distinctUntilChanged(),
    )
  }

  protected storeState(newState: Partial<State<T>>): void {
    this.setState(newState)
    this.setItemInStorage(this.initialState.storageKey, this.state)
  }

  protected setState(newState: Partial<State<T>>): void {
    console.info('newState: ', newState)
    this.stateSubject.next({
      ...this.state,
      ...newState,
    })
  }

  protected unstoreState(): void {
    this.resetState()
    this.removeItemFromStorage(this.initialState.storageKey)
  }

  protected resetState(): void {
    this.stateSubject.next(this.initialState)
  }

  private getItemFromStorage<T>(
    key: string,
    storageLocation?: StorageLocation,
  ): T | undefined {
    try {
      const storage = this.getStorage(storageLocation)
      const stringValue = storage.getItem(key)
      if (stringValue && typeof stringValue === 'string') {
        return (JSON.parse(stringValue) as {value: T | undefined})?.value
      }
      return undefined
    } catch {
      return undefined
    }
  }

  private setItemInStorage<T>(
    key: string,
    value: T,
    storageLocation?: StorageLocation,
  ): void {
    const storage = this.getStorage(storageLocation)
    return storage.setItem(key, JSON.stringify({value}))
  }

  private removeItemFromStorage(
    key: string,
    storageLocation?: StorageLocation,
  ): void {
    const storage = this.getStorage(storageLocation)
    return storage.removeItem(key)
  }

  private getStorage(storageLocation?: StorageLocation) {
    const storages = {
      localStorage: localStorage,
      sessionStorage: sessionStorage,
    }

    return storageLocation !== undefined
      ? storages[storageLocation]
      : storages.localStorage
  }
}
