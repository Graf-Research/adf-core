import { AST_Schema } from "./schema"
import moo from 'moo';

export namespace AST_API {
  export interface Headers {
    key: moo.Token
    type: AST_Schema.NativeOrExistingSchemaOrTable
    required: boolean
    array?: boolean
  }

  export interface Query {
    key: moo.Token
    type: AST_Schema.NativeOrExistingSchemaOrTable
    required: boolean
    array?: boolean
  }

  export interface Path {
    key: moo.Token
    type: AST_Schema.NativeOrExistingSchemaOrTable
    required: boolean
    array?: boolean
  }

  export interface Body {
    key: moo.Token
    type: AST_Schema.ItemType
    required: boolean
    array?: boolean
  }

  export interface APIItemDescription {
    key: 'description'
    data: moo.Token
  }

  export interface APIItemHeaders {
    key: 'headers'
    data: Headers[]
  }

  export interface APIItemQuery {
    key: 'query'
    data: Query[]
  }

  export interface APIItemPath {
    key: 'path'
    data: Path[]
  }

  export interface APIItemBody {
    key: 'body'
    data: Body[]
  }

  export interface APIItemReturn {
    key: 'return'
    type: AST_Schema.ItemType
    required: boolean
    array?: boolean
  }

  export type APIItem = APIItemDescription
    | APIItemHeaders
    | APIItemQuery
    | APIItemPath
    | APIItemBody
    | APIItemReturn

  export interface API {
    extends: boolean
    description?: string
    type: 'api'
    method: moo.Token
    path: moo.Token
    items: APIItem[]
  }
}
