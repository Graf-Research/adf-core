import _ from "lodash";
import { AST_Model } from "../../ast/types/model";
import { Model } from "./model";

export interface AnalyzeModelResult {
  list_table: Model.Table[]
  list_enum: Model.Enum[]
}

function isTableWithKeyExist(table_name: string, column_name: string, list_ast_table: AST_Model.Table[], list_table: Model.Table[]): boolean {
  for (const t of list_ast_table) {
    if (t.name.text === table_name) {
      for (const c of t.items) {
        if (c.name.text === column_name) {
          return true;
        }
      }
    }
  }
  for (const t of list_table) {
    if (t.name === table_name) {
      for (const c of t.columns) {
        if (c.name === column_name) {
          return true;
        }
      }
    }
  }

  return false;
}

function isEnumExist(enum_name: string, list_ast_enum: Model.Enum[]): boolean {
  for (const t of list_ast_enum) {
    if (t.name === enum_name) {
      return true;
    }
  }

  return false;
}

function isEnumExistWithValue(enum_name: string, enum_value: string, list_enum: Model.Enum[]): boolean {
  for (const e of list_enum) {
    if (e.name === enum_name) {
      for (const ev of e.items) {
        if (ev == enum_value) {
          return true;
        }
      }
    }
  }

  return false;
}

function findDuplicateColumn(column_name: string, list_column: AST_Model.TableColumn[]): AST_Model.TableColumn | null {
  let tick = false;
  for (const c of list_column) {
    if (c.name.text === column_name) {
      if (!tick) {
        tick = true;
        continue;
      }
      return c;
    }
  }

  return null;
}

function getTableFields(ast_table: AST_Model.Table, list_ast_table: AST_Model.Table[], list_enum: Model.Enum[], list_table: Model.Table[], config?: ModelAnalysisConfig) {
  const list_fields: Model.TableColumn[] = [];
  for (const field of ast_table.items) {
    if (field.name.text.includes('-')) {
      throw new Error(`line ${field.name.line} col ${field.name.col + field.name.text.indexOf('-')}: table field '${field.name.text}' contains illegal character '-'`);
    }

    const duplicate_column = findDuplicateColumn(field.name.text, ast_table.items);
    if (duplicate_column) {
      throw new Error(`line ${field.name.line} col ${field.name.col}: table field '${field.name.text}' existing name duplicate declaration on line ${duplicate_column.name.line} col ${duplicate_column.name.col}`);
    }

    let type: Model.CommonSQLType.Types;
    switch (field.type.kind) {
      case "no-param":
        switch (field.type.type.text) {
          case 'tinyint':
          case 'smallint':
          case 'int':
          case 'bigint':
          case 'float':
          case 'real':
          case 'boolean':
          case 'date':
          case 'timestamp':
          case 'text':
          case 'varchar':
          case 'decimal':
            type = {
              kind: 'common',
              type: field.type.type.text
            }
            break;
          default:
            if (isEnumExist(field.type.type.text, list_enum) || config?.ignoreMissingEnum) {
              type = {
                kind: 'enum',
                type: 'enum',
                enum_name: field.type.type.text
              }
            } else {
              throw new Error(`line ${field.type.type.line} col ${field.type.type.col} data type no-param '${field.type.type.text}' is not supported`);
            }
        }
        break;
      case "single-param":
        switch (field.type.type.text) {
          case 'varchar':
            type = {
              kind: 'chars',
              type: field.type.type.text,
              size: +field.type.p1.value
            }
            break;
          default:
            throw new Error(`line ${field.type.type.line} col ${field.type.type.col} data type single-param '${field.type.type.text}(${field.type.p1.value})' is not supported`);
        }
        break;
      case "two-param":
        switch (field.type.type.text) {
          case 'decimal':
            type = {
              kind: 'decimal',
              type: field.type.type.text,
              precision: +field.type.p1.value,
              scale: +field.type.p2.value
            }
            break;
          default:
            throw new Error(`line ${field.type.type.line} col ${field.type.type.col} data type single-param '${field.type.type.text}(${field.type.p1.value}, ${field.type.p2.value})' is not supported`);
        }
        break;
      case "relation":
        const [foreign_table, foreign_key] = field.type.name.text.split('.');
        if (!isTableWithKeyExist(foreign_table, foreign_key, list_ast_table, list_table) && !config?.ignoreTableRelation) {
          throw new Error(`line ${field.type.name.line} col ${field.type.name.col} relation table or field '${field.type.name.text}' doesnt exist`);
        }
        type = {
          kind: 'relation',
          type: 'relation',
          table_name: foreign_table,
          foreign_key
        };
        break;
    }

    const attributes: Model.ColumnAttribute.Attributes[] = [];
    for (const attr of field.attributes) {
      switch (attr.type) {
        case "null":
        case "primary-key":
        case "unique":
        case "autoincrement":
          attributes.push({
            type: attr.type,
            value: attr.value
          });
          break;
        case "default":
          switch (attr.value.type) {
            case "string":
              if (![
                'varchar',
                'text'
              ].includes(type.type)) {
                throw new Error(`line ${field.name.line} col ${field.name.col} field '${field.name.text}' with string '${type.type}' is not compatible with number default value '${String(attr.value.name.text)}'`);
              }
              attributes.push({
                type: 'default',
                value: {
                  type: 'string',
                  data: attr.value.name.text.slice(1, -1)
                }
              });
              break;
            case "number":
              if (![
                'tinyint',
                'smallint',
                'int',
                'bigint',
                'float',
                'real',
                'decimal'
              ].includes(type.type)) {
                throw new Error(`line ${field.name.line} col ${field.name.col} field '${field.name.text}' with type '${type.type}' is not compatible with number default value '${String(attr.value.name.text)}'`);
              }
              attributes.push({
                type: 'default',
                value: {
                  type: 'number',
                  data: +attr.value.name.text
                }
              });
              break;
            case "boolean":
              if (type.type !== 'boolean') {
                throw new Error(`line ${field.name.line} col ${field.name.col} field '${field.name.text}' with type '${type.type}' is not compatible with boolean default value '${String(attr.value.value)}'`);
              }
              attributes.push({
                type: 'default',
                value: {
                  type: 'boolean',
                  data: attr.value.value
                }
              });
              break;
            case "enum":
              if (type.kind !== 'enum') {
                throw new Error(`line ${field.name.line} col ${field.name.col} field '${field.name.text}' with type '${type.type}' is not compatible with enum default value '${String(attr.value.name.text)}'`);
              }
              const [enum_name, enum_value] = attr.value.name.text.split('.');
              if (!isEnumExistWithValue(enum_name, enum_value, list_enum)) {
                throw new Error(`line ${attr.value.name.line} col ${attr.value.name.col} enum value '${attr.value.name.text}' doesnt exist`);
              }
              attributes.push({
                type: 'default',
                value: {
                  type: 'enum',
                  enum_name,
                  enum_value
                }
              });
              break;
          }
          break;
      }
    }

    list_fields.push({
      name: field.name.text,
      type,
      attributes
    });
  }

  return list_fields;
}

export interface ModelAnalysisConfig {
  ignoreTableRelation?: boolean
  ignoreMissingEnum?: boolean
}

export interface AnalyzeModelParams {
  list_ast_enum: AST_Model.Enum[]
  list_ast_table: AST_Model.Table[]
  list_existing_enum: Model.Enum[]
  list_existing_table: Model.Table[]
  config?: ModelAnalysisConfig
  filename?: string
}

export function analyzeModel(param: AnalyzeModelParams): AnalyzeModelResult {
  const list_enum: Model.Enum[] = param.list_existing_enum;
  const list_table: Model.Table[] = param.list_existing_table;

  for (const ast_enum of param.list_ast_enum) {
    // TODO: check enum name duplicate
    if (ast_enum.name.text.includes('-')) {
      throw new Error(`line ${ast_enum.name.line} col ${ast_enum.name.col + ast_enum.name.text.indexOf('-')}: enum name '${ast_enum.name.text}' contains illegal character '-'`);
    }

    const existing_enum_index: number = list_enum.findIndex((e: Model.Enum) => e.name === ast_enum.name.text);
    if (ast_enum.extends) {
      if (existing_enum_index === -1) {
        throw new Error(`line ${ast_enum.name.line} col ${ast_enum.name.col + ast_enum.name.text.indexOf('-')}: extended enum '${ast_enum.name.text}' doesnt find existing enum`);
      }
      list_enum[existing_enum_index].extends = true;
      list_enum[existing_enum_index].items = _.union(list_enum[existing_enum_index].items, ast_enum.items.map(t => t.text));
    } else {
      // enum exists
      if (existing_enum_index > -1) {
        const existing_enum = list_enum[existing_enum_index];
        throw new Error(`line ${ast_enum.name.line} col ${ast_enum.name.col + ast_enum.name.text.indexOf('-')}: enum '${ast_enum.name.text}' already defined on ${existing_enum?.filename ?? 'this file'}`);
      }
      list_enum.push({
        extends: ast_enum.extends,
        name: ast_enum.name.text,
        type: 'enum',
        items: ast_enum.items.map(t => t.text),
        filename: param.filename
      });
    }
  }

  for (const ast_table of param.list_ast_table) {
    // TODO: check table name duplicate
    if (ast_table.name.text.includes('-')) {
      throw new Error(`line ${ast_table.name.line} col ${ast_table.name.col + ast_table.name.text.indexOf('-')}: table name '${ast_table.name.text}' contains illegal character '-'`);
    }

    const list_fields = getTableFields(ast_table, param.list_ast_table, list_enum, list_table, param.config);
    const existing_table_index: number = list_table.findIndex((t: Model.Table) => t.name === ast_table.name.text);
    if (ast_table.extends) {
      if (existing_table_index === -1) {
        throw new Error(`line ${ast_table.name.line} col ${ast_table.name.col + ast_table.name.text.indexOf('-')}: extended name '${ast_table.name.text}' doesnt find existing table`);
      }
      list_table[existing_table_index].extends = true;
      for (const field of list_fields) {
        const existing_field_index = list_table[existing_table_index].columns.findIndex((c: Model.TableColumn) => c.name == field.name);
        if (existing_field_index > -1) {
          list_table[existing_table_index].columns[existing_field_index] = field;
        } else {
          list_table[existing_table_index].columns.push(field);
        }
      }
    } else {
      if (existing_table_index > -1) {
        const existing_table = list_table[existing_table_index];
        throw new Error(`line ${ast_table.name.line} col ${ast_table.name.col + ast_table.name.text.indexOf('-')}: table '${ast_table.name.text}' already defined on ${existing_table?.filename ?? 'this file'}`);
      }

      const table: Model.Table = {
        extends: ast_table.extends,
        name: ast_table.name.text,
        type: 'table',
        columns: list_fields,
        filename: param.filename
      };
      list_table.push(table);
    }
  }

  return {
    list_table,
    list_enum
  };
}
