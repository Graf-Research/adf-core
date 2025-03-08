export namespace Model {
  export interface Enum {
    extends: boolean
    name: string
    type: 'enum'
    items: string[]
    filename?: string
  }

  export namespace CommonSQLType {
    export type NoParamsType = 'tinyint'
      | 'smallint'
      | 'int'
      | 'bigint'
      | 'float'
      | 'real'
      | 'boolean'
      | 'date'
      | 'timestamp'
      | 'text'
      | 'decimal'
      | 'varchar';

    export interface Common {
      kind: 'common'
      type: NoParamsType
    }

    export interface Decimal {
      kind: 'decimal'
      type: 'decimal'
      precision?: number
      scale?: number
    }

    export interface Chars {
      kind: 'chars'
      type: 'varchar'
      size?: number
    }

    export interface Enum {
      kind: 'enum'
      type: 'enum'
      enum_name: string
    }

    export interface Relation {
      kind: 'relation'
      type: 'relation'
      table_name: string
      foreign_key: string
    }

    export type Types = Common | Decimal | Chars | Enum | Relation;
  }

  export namespace ColumnAttribute {
    export interface Nullable {
      type: 'null'
      value: boolean
    }

    export interface PrimaryKey {
      type: 'primary-key'
      value: boolean
    }

    export interface Unique {
      type: 'unique'
      value: boolean
    }

    export type DefaultValueType = {
      type: 'enum',
      enum_name: string
      enum_value: string
    } | {
      type: 'string',
      data: string
    } | {
      type: 'number',
      data: number
    } | {
      type: 'boolean',
      data: boolean
    };

    export interface DefaultValue {
      type: 'default'
      value: DefaultValueType
    }

    export interface AutoIncrement {
      type: 'autoincrement'
      value: boolean
    }

    export type Attributes = Nullable | PrimaryKey | Unique | DefaultValue | AutoIncrement
  }

  export interface TableColumn {
    name: string
    description?: string
    type: CommonSQLType.Types
    attributes?: ColumnAttribute.Attributes[]
  }

  export interface Table {
    extends: boolean
    type: 'table'
    name: string
    columns: TableColumn[]
    filename?: string
  }

  export type Item = Table | Enum;
}
