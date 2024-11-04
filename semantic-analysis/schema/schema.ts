export namespace Schema {
  export type NativeType = 'string' | 'number' | 'boolean';

  export type NativeOrSchemaOrTable = {
    type: 'native'
    native_type: Schema.NativeType
  } | {
    type: 'schema'
    schema_name: string
  } | {
    type: 'table'
    table_name: string
  } | {
    type: 'enum'
    enum_name: string
  }

  export interface Item {
    key: string
    type: NativeOrSchemaOrTable
    required?: boolean
    array?: boolean
  }

  export interface Schema {
    extends: boolean
    type: 'schema'
    name: string
    items: Item[]
  }
}
