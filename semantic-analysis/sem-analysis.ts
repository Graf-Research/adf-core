import { AST_Item } from "../ast/ast";
import { analyzeFlow } from "./flow/analyze-flow";
import { Flow } from "./flow/flow";
import { analyzeModel, ModelAnalysisConfig } from "./model/analyze-model";
import { Model } from "./model/model";
import { analyzeSchema } from "./schema/analyze-schema";
import { Schema } from "./schema/schema";
import { analyzeAPI } from "./api/analyze-api";
import { API } from "./api/api";
import { analyzeImport } from "./import/analyze-import";
import { AnalysisConfig } from "./sem-analysis.interface";
import { AST_API } from "../ast/types/api";
import { AST_Schema } from "../ast/types/schema";
import { getASTSchemaFromAPI, getASTSchemaFromSchema } from "./schema/schema.utility";
import { AST_Model } from "../ast/types/model";

export interface SAResult {
  list_enum: Model.Enum[]
  list_table: Model.Table[]
  list_flow: Flow.Flow[]
  list_schema: Schema.Schema[]
  list_api: API.API[]
  filename?: string
}

export interface AnalyzeParams {
  list_ast: AST_Item[]
  relative_path: string
  current_result?: SAResult
  config?: AnalysisConfig
  filename?: string
}

export async function analyze(param: AnalyzeParams): Promise<SAResult> {
  const list_ast_enum = param.list_ast.filter(e => e.type === 'enum');
  const list_ast_table = param.list_ast.filter(e => e.type === 'table');
  const list_ast_flow = param.list_ast.filter(e => e.type === 'flow');
  const list_ast_api = param.list_ast.filter(e => e.type === 'api');
  const list_schema_first_order = param.list_ast.filter(e => e.type === 'schema');
  const list_ast_schema = [
    ...list_schema_first_order,
    ...getASTSchemaFromSchema(list_schema_first_order),
    ...getASTSchemaFromAPI(list_ast_api)
  ];
  const list_ast_import = param.list_ast.filter(e => e.type === 'import');

  const result_import = await analyzeImport({
    list_ast_import, 
    relative_path: param.relative_path, 
    current_result: param.current_result, 
    config: param.config,
    filename: param.filename
  });

  const result_enum_table = analyzeModel({
    list_ast_enum, 
    list_ast_table, 
    list_existing_enum: result_import.list_enum, 
    list_existing_table: result_import.list_table, 
    config: param.config,
    filename: param.filename,
  });
  const result_flow = analyzeFlow({
    list_ast_flow,
    filename: param.filename,
    config: param.config,
  });
  const result_schema = analyzeSchema({
    list_ast_enum,
    list_ast_table,
    list_ast_schema, 
    list_existing_enum: result_enum_table.list_enum,
    list_existing_table: result_enum_table.list_table,
    list_existing_schema: result_import.list_schema,
    config: {
      ...param.config,
      schema: {
        ...param.config?.schema,
        allInlineSchemaAlreadyDefined: true
      }
    },
    filename: param.filename,
  });
  const result_api = analyzeAPI({
    list_ast_enum,
    list_ast_table,
    list_ast_schema, 
    list_ast_api, 
    list_existing_schema: result_schema, 
    list_existing_api: result_import.list_api,
    list_existing_enum: result_enum_table.list_enum,
    list_existing_table: result_enum_table.list_table,
    config: {
      ...param.config,
      schema: {
        ...param.config?.schema,
        allInlineSchemaAlreadyDefined: true
      }
    },
    filename: param.filename,
  });

  return {
    list_enum: result_enum_table.list_enum,
    list_table: result_enum_table.list_table,
    list_flow: result_flow,
    list_schema: result_api.list_schema,
    list_api: result_api.list_api,
    filename: param.filename
  };
}
