import { parse, SAResult } from "../../index"
import { AST_Import } from "../../ast/types/import"

export async function analyzeImport(list_ast_import: AST_Import.Import[], relative_path: string, current_result?: SAResult): Promise<SAResult> {
  let temporary_sa_result: SAResult = {
    list_enum: current_result ? [...current_result.list_enum] : [],
    list_table: current_result ? [...current_result.list_table] : [],
    list_flow: current_result ? [...current_result.list_flow] : [],
    list_schema: current_result ? [...current_result.list_schema] : [],
    list_api: current_result ? [...current_result.list_api] : []
  };

  for (const ast_import of list_ast_import) {
    const source = ast_import.source.text.slice(1, -1); // remove quotes
    temporary_sa_result = await parse(source, relative_path, temporary_sa_result);
  }

  return temporary_sa_result;
}
