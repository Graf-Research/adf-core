import moo from 'moo';

export namespace AST_Schema {
  export type NativeOrExistingSchemaOrTable = {
    type: 'native'
    native_type: moo.Token
  } | {
    type: 'table-enum-schema'
    name: moo.Token
  }

  export interface NewSchema {
    type: 'new-schema'
    schema: Schema
  }

  export type ItemType = NativeOrExistingSchemaOrTable | NewSchema

  export interface Item {
    key: moo.Token
    type: ItemType
    required: boolean
    array: boolean
  }

  export interface Schema {
    extends: boolean
    type: 'schema'
    name: moo.Token
    items: Item[]
  }
}
