import { AST_API } from "../../ast/types/api";
import { AST_Schema } from "../../ast/types/schema";

export function getASTSchemaFromAPI(list_ast_api: AST_API.API[]): AST_Schema.Schema[] {
  const out: AST_Schema.Schema[] = [];
  for (const ast_api of list_ast_api) {
    for (const item of ast_api.items) {
      switch (item.key) {
        case "description":
        case "headers":
        case "query":
        case "path":
          continue;
        case "body":
          for (const body_item of item.data) {
            if (body_item.type.type === 'new-schema') {
              out.push(body_item.type.schema);
              out.push(...getASTSchemaFromSchema([body_item.type.schema]));
            }
          }
          break;
        case "return":
          if (item.type.type === 'new-schema') {
            out.push(item.type.schema);
            out.push(...getASTSchemaFromSchema([item.type.schema]));
          }
      }
    }
  }
  return out;
}

export function getASTSchemaFromSchema(list_ast_schema: AST_Schema.Schema[]): AST_Schema.Schema[] {
  const out: AST_Schema.Schema[] = [];
  for (const ast_schema of list_ast_schema) {
    for (const item of ast_schema.items) {
      if (item.type.type === 'new-schema') {
        if (item.type.type === 'new-schema') {
          out.push(item.type.schema);
          out.push(...getASTSchemaFromSchema([item.type.schema]));
        }
      }
    }
  }
  return out;
}
