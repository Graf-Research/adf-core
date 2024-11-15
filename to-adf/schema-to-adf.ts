import { Schema } from "../semantic-analysis/schema/schema";

export function schemaToADF(list_schema: Schema.Schema[]): string {
  return list_schema.map((schema: Schema.Schema) => [
    `schema ${schema.name} {`,
    schema.items.map((item: Schema.Item) => {
      switch (item.type.type) {
        case "native":
          return `  ${item.key}${item.array ? ' array' : ''} ${item.type.native_type} ${item.required ? 'required' : ''}`;
        case "schema":
          return `  ${item.key}${item.array ? ' array' : ''} schema.${item.type.schema_name} ${item.required ? 'required' : ''}`;
        case "table":
          return `  ${item.key}${item.array ? ' array' : ''} table.${item.type.table_name} ${item.required ? 'required' : ''}`;
        case "enum":
          return `  ${item.key}${item.array ? ' array' : ''} enum.${item.type.enum_name} ${item.required ? 'required' : ''}`;
      }
    }).join('\n'),
    `}`
  ].join('\n')).join('\n');
}
