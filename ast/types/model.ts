import moo from 'moo';

export namespace AST_Model {
  export interface Enum {
    extends: boolean
    type: 'enum'
    name: moo.Token
    items: moo.Token[]
  }

  export namespace CommonSQLType {
    export interface NoParam {
      kind: 'no-param'
      type: moo.Token
    }

    export interface SingleParam {
      kind: 'single-param'
      type: moo.Token
      p1: moo.Token
    }

    export interface DoubleParam {
      kind: 'two-param'
      type: moo.Token
      p1: moo.Token
      p2: moo.Token
    }

    export interface Relation {
      kind: 'relation'
      name: moo.Token
    }

    export type Types = NoParam | SingleParam | DoubleParam | Relation;
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

    export interface DefaultValue {
      type: 'default'
      value: {
        type: 'number'
        name: moo.Token
      } | {
        type: 'string'
        name: moo.Token
      } | {
        type: 'enum'
        name: moo.Token
      } | {
        type: 'boolean'
        value: boolean
      }
    }

    export interface AutoIncrement {
      type: 'autoincrement'
      value: boolean
    }

    export type Attributes = Nullable | PrimaryKey | Unique | DefaultValue | AutoIncrement
  }

  export interface TableColumn {
    name: moo.Token
    type: CommonSQLType.Types
    attributes: ColumnAttribute.Attributes[]
  }

  export interface Table {
    extends: boolean
    type: 'table'
    name: moo.Token
    items: TableColumn[]
  }
}
