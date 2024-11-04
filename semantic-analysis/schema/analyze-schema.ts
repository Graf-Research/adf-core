import { AST_Model } from "../../ast/types/model";
import { AST_Schema } from "../../ast/types/schema";
import { Schema } from "./schema";

export function analyzeSchema(list_ast_schema: AST_Schema.Schema[], list_ast_table: AST_Model.Table[], list_ast_enum: AST_Model.Enum[], list_existing_schema: Schema.Schema[]): Schema.Schema[] {
  const list_schema: Schema.Schema[] = list_existing_schema;

  for (const ast_schema of list_ast_schema) {
    if (ast_schema.name.text.includes('-')) {
      throw new Error(`Error line ${ast_schema.name.line} col ${ast_schema.name.col + ast_schema.name.text.indexOf('-')}: schema name '${ast_schema.name.text}' contains illegal character '-'`);
    }
    
    const create_schema_from_ast_result: CreateSchemaFromASTResult = createSchemaFromAST(ast_schema, list_ast_schema, list_schema);
    for (const i of Object.keys(create_schema_from_ast_result.updated_schema)) {
      list_schema[+i] = create_schema_from_ast_result.updated_schema[+i];
    }
    list_schema.push(...create_schema_from_ast_result.list_new_schema);
  }

  return list_schema;
}

interface CreateSchemaFromASTResult {
  list_new_schema: Schema.Schema[]
  updated_schema: {[key: number]: Schema.Schema}
}

function createSchemaFromAST(ast_schema: AST_Schema.Schema, list_ast_schema: AST_Schema.Schema[], list_existing_schema: Schema.Schema[]): CreateSchemaFromASTResult {
  // TODO: check schema name duplicate

  const schema_items_result: SchemaItemsResult = getSchemaItems(ast_schema.items, list_ast_schema, list_existing_schema);
  const existing_schema_index: number = list_existing_schema.findIndex((s: Schema.Schema) => s.name === ast_schema.name.text);
  if (ast_schema.extends) {
    if (existing_schema_index === -1) {
      throw new Error(`Error line ${ast_schema.name.line} col ${ast_schema.name.col + ast_schema.name.text.indexOf('-')}: extended schema '${ast_schema.name.text}' doesnt find existing schema`);
    }
    const updated_schema: Schema.Schema = { ...list_existing_schema[existing_schema_index] };
    updated_schema.extends = true;
    for (const item of schema_items_result.list_item) {
      const existing_item_index = updated_schema.items.findIndex((i: Schema.Item) => i.key === item.key);
      if (existing_item_index > -1) {
        updated_schema.items[existing_item_index] = item;
      } else {
        updated_schema.items.push(item);
      }
    }
    return {
      list_new_schema: schema_items_result.list_new_schema,
      updated_schema: {
        [existing_schema_index]: updated_schema
      }
    };
  } else {
    if (existing_schema_index > -1) {
      throw new Error(`Error line ${ast_schema.name.line} col ${ast_schema.name.col + ast_schema.name.text.indexOf('-')}: schema '${ast_schema.name.text}' already defined before`);
    }
    const list_new_schema: Schema.Schema[] = [{
      extends: ast_schema.extends,
      type: 'schema',
      name: ast_schema.name.text,
      items: []
    }];
    list_new_schema.push(...schema_items_result.list_new_schema);
    list_new_schema[0].items = schema_items_result.list_item;
    return {
      list_new_schema,
      updated_schema: {}
    };
  }
}

export interface SchemaItemsResult {
  list_item: Schema.Item[]
  list_new_schema: Schema.Schema[]
}

export function getSchemaItems(items: AST_Schema.Item[], list_ast_schema: AST_Schema.Schema[], list_existing_schema: Schema.Schema[]): SchemaItemsResult {
  const list_new_schema: Schema.Schema[] = [];
  const list_item: Schema.Item[] = [];

  for (const prop of items) {
    const generated_item_type = generateSchemaItemType(prop.type, list_ast_schema, list_existing_schema);
    list_new_schema.push(...generated_item_type.list_new_schema);
    list_item.push({
      key: prop.key.text,
      type: generated_item_type.type,
      required: prop.required,
      array: prop.array
    });
  }

  return {
    list_new_schema,
    list_item
  };
}

export interface GetSchemaItemTypeResult {
  type: Schema.NativeOrSchemaOrTable
  list_new_schema: Schema.Schema[]
}

export function generateSchemaItemType(prop: AST_Schema.ItemType, list_ast_schema: AST_Schema.Schema[], list_existing_schema: Schema.Schema[]): GetSchemaItemTypeResult {
  switch (prop.type) {
    case "native":
      if (!['string', 'number', 'boolean'].includes(prop.native_type.text)) {
        throw new Error(`Error line ${prop.native_type.line} col ${prop.native_type.col} native type '${prop.native_type.text}' is not supported`);
      }
      return {
        type: {
          type: 'native',
          native_type: prop.native_type.text as Schema.NativeType
        },
        list_new_schema: []
      };
    case "table-enum-schema":
      const [ste_type, ste_value] = prop.name.text.split('.');
      switch (ste_type) {
        case 'table':
          // TODO: check table existence
          return {
            type: {
              type: 'table',
              table_name: ste_value
            },
            list_new_schema: []
          };
        case 'enum':
          // TODO: check enum existence
          return {
            type: {
              type: 'enum',
              enum_name: ste_value
            },
            list_new_schema: []
          };
        case 'schema':
          // TODO: check schema existence
          return {
            type: {
              type: 'schema',
              schema_name: ste_value
            },
            list_new_schema: []
          };
      }
      break;
    case "new-schema":
      const create_schema_from_ast_result: CreateSchemaFromASTResult = createSchemaFromAST(prop.schema, list_ast_schema, list_existing_schema);
      return {
        type: {
          type: 'schema',
          schema_name: create_schema_from_ast_result.list_new_schema[0].name
        },
        list_new_schema: create_schema_from_ast_result.list_new_schema
      };
  }
  throw new Error(`Unknown data: ${JSON.stringify(prop)}`);
}
