import { Schema } from "../schema/schema"

export namespace API {
  export interface Headers {
    key: string
    type: Schema.NativeType
    required?: boolean
  }

  export interface Query {
    key: string
    type: Schema.NativeType
    required?: boolean
    array?: boolean
  }

  export interface Path {
    key: string
    type: 'string' | 'number' | 'boolean'
  }

  export interface Body {
    key: string
    type: Schema.NativeOrSchemaOrTable
    required?: boolean
    array?: boolean
  }

  export interface ErrorType {
    type: Schema.NativeOrSchemaOrTable
    required?: boolean
    array?: boolean
  }

  interface CommonAPIData {
    description?: string
    path: string
    headers?: Headers[]
    paths?: Path[]
    queries?: Query[]
    error_type?: ErrorType
    return: ReturnType
  }

  export interface ReturnType {
    type: Schema.NativeOrSchemaOrTable
    required?: boolean
    array?: boolean
  }

  export interface GET extends CommonAPIData {
    extends: boolean
    type: 'api'
    method: 'get'
  }

  export interface POST extends CommonAPIData {
    extends: boolean
    type: 'api'
    method: 'post'
    body?: Body[]
  }

  export interface PUT extends CommonAPIData {
    extends: boolean
    type: 'api'
    method: 'put'
    body?: Body[]
  }

  export interface DELETE extends CommonAPIData {
    extends: boolean
    type: 'api'
    method: 'delete'
  }

  export interface PATCH extends CommonAPIData {
    extends: boolean
    type: 'api'
    method: 'patch'
    body?: Body[]
  }
  
  export type API = GET | POST | PUT | DELETE | PATCH;
}
