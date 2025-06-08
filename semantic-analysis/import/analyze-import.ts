import { parse, parseSync, SAResult } from "../../index"
import { AST_Import } from "../../ast/types/import"
import { AnalysisConfig } from "../sem-analysis.interface";
import { AST_Model } from "../../ast/types/model";
import { AST_Schema } from "../../ast/types/schema";

export interface AnalyzeImportParams {
  list_ast_import: AST_Import.Import[]
  relative_path: string
  current_result?: SAResult
  config?: AnalysisConfig
  filename?: string
}

export async function analyzeImport(param: AnalyzeImportParams): Promise<SAResult> {
  let temporary_sa_result: SAResult = {
    list_enum: param.current_result ? [...param.current_result.list_enum] : [],
    list_table: param.current_result ? [...param.current_result.list_table] : [],
    list_flow: param.current_result ? [...param.current_result.list_flow] : [],
    list_schema: param.current_result ? [...param.current_result.list_schema] : [],
    list_api: param.current_result ? [...param.current_result.list_api] : [],
    filename: param.filename
  };

  for (const ast_import of param.list_ast_import) {
    const source = ast_import.source.text.slice(1, -1); // remove quotes
    temporary_sa_result = await parse(source, param.relative_path, temporary_sa_result, param.config);
  }

  return temporary_sa_result;
}

export function analyzeImportSync(param: AnalyzeImportParams): SAResult {
  let temporary_sa_result: SAResult = {
    list_enum: param.current_result ? [...param.current_result.list_enum] : [],
    list_table: param.current_result ? [...param.current_result.list_table] : [],
    list_flow: param.current_result ? [...param.current_result.list_flow] : [],
    list_schema: param.current_result ? [...param.current_result.list_schema] : [],
    list_api: param.current_result ? [...param.current_result.list_api] : [],
    filename: param.filename
  };

  for (const ast_import of param.list_ast_import) {
    const source = ast_import.source.text.slice(1, -1); // remove quotes
    temporary_sa_result = parseSync(source, param.relative_path, temporary_sa_result, param.config);
  }

  return temporary_sa_result;
}
