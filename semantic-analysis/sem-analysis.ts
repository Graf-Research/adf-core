import { AST_Item } from "../ast/ast";
import { analyzeFlow } from "./flow/analyze-flow";
import { Flow } from "./flow/flow";
import { analyzeModel } from "./model/analyze-model";
import { Model } from "./model/model";
import { analyzeSchema } from "./schema/analyze-schema";
import { Schema } from "./schema/schema";
import { analyzeAPI } from "./api/analyze-api";
import { API } from "./api/api";
import { analyzeImport } from "./import/analyze-import";

export interface SAResult {
  list_enum: Model.Enum[]
  list_table: Model.Table[]
  list_flow: Flow.Flow[]
  list_schema: Schema.Schema[]
  list_api: API.API[]
}

export async function analyze(list_ast: AST_Item[], relative_path: string, current_result?: SAResult): Promise<SAResult> {
  const list_ast_enum = list_ast.filter(e => e.type === 'enum');
  const list_ast_table = list_ast.filter(e => e.type === 'table');
  const list_ast_flow = list_ast.filter(e => e.type === 'flow');
  const list_ast_schema = list_ast.filter(e => e.type === 'schema');
  const list_ast_api = list_ast.filter(e => e.type === 'api');
  const list_ast_import = list_ast.filter(e => e.type === 'import');

  const result_import = await analyzeImport(list_ast_import, relative_path, current_result);

  const result_enum_table = analyzeModel(list_ast_enum, list_ast_table, result_import.list_enum, result_import.list_table);
  const result_flow = analyzeFlow(list_ast_flow);
  const result_schema = analyzeSchema(list_ast_schema, list_ast_table, list_ast_enum, result_import.list_schema);
  const result_api = analyzeAPI(list_ast_api, result_schema, result_import.list_api);

  return {
    list_enum: result_enum_table.list_enum,
    list_table: result_enum_table.list_table,
    list_flow: [
      ...result_flow,
    ],
    list_schema: [
      ...result_schema,
      ...result_api.list_schema,
    ],
    list_api: result_api.list_api
  };
}
