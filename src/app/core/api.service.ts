import {Injectable} from '@angular/core'

export interface ApiParams {
  page?: string
  limit?: string
}

export interface ApiResponse<T> {
  data: T[]
  meta: {
    page: number
    limit: number
    count: number
    pageCount: number
    hasPreviousPage: boolean
    hasNextPage: boolean
  }
}

export interface ApiParams {}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor() {}
}
