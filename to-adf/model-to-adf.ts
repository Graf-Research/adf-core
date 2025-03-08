import { Model } from "../semantic-analysis/model/model";

export function tableToADF(list_table: Model.Table[]): string {
  return list_table.map((t: Model.Table) => [
    `table ${t.name} {`,
    t.columns.map((tc: Model.TableColumn) => {
      let type_str = '';
      switch (tc.type.kind) {
        case "common": type_str = tc.type.type; break;
        case "decimal": type_str = `${tc.type.type}${
          !isNaN(tc.type.precision as any) && !isNaN(tc.type.scale as any) 
          ? `(${tc.type.precision}, ${tc.type.scale})` 
          : !isNaN(tc.type.precision as any)
            ? `(${tc.type.precision})` 
            : ''
        }`; break;
        case "chars": type_str = `${tc.type.type}${!isNaN(tc.type.size as any) ? `(${tc.type.size})` : ''}`; break;
        case "enum": type_str = tc.type.enum_name; break;
        case "relation": type_str = `${tc.type.table_name}.${tc.type.foreign_key}`; break;
      }
      return [
        `  ${tc.name} ${type_str} ${(tc.attributes ?? []).map(attr => {
          switch (attr.type) {
            case "null": return attr.value ? '' : 'notnull';
            case "primary-key": return attr.value ? 'pk' : '';
            case "unique": return attr.value ? 'unique' : '';
            case "default":
              switch (attr.value.type) {
                case "string": return `default="${attr.value.data}"`;
                case "number": return `default=${attr.value.data}`;
                case "boolean": return `default=${attr.value.data ? 'true' : 'false'}`;
                case "enum": return `default=${attr.value.enum_name}.${attr.value.enum_value}`;
              }
            case "autoincrement": return attr.value ? 'inc' : '';
          }
        }).join(' ')}`
      ].join('\n');
    }).join('\n'),
    `}`
  ].join('\n')).join('\n');
}

export function enumToADF(list_enum: Model.Enum[]): string {
  return list_enum.map((e: Model.Enum) => [
    `enum ${e.name} {`,
    e.items.map(item => `  ${item}`).join('\n'),
    `}`
  ].join('\n')).join('\n');
}

export function modelToADF(list_item: Model.Item[]): string {
  const list_enum: Model.Enum[] = [];
  const list_table: Model.Table[] = [];
  for (let i = 0; i < list_item.length; i++) {
    switch (list_item[i].type) {
      case "table": list_table.push(list_item[i] as Model.Table); break;
      case "enum": list_enum.push(list_item[i] as Model.Enum); break;
    }
  }
  return `${enumToADF(list_enum)}\n${tableToADF(list_table)}`;
}
