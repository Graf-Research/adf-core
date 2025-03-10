import { AST_Model } from "../ast/types/model";
import { AST_Schema } from "../ast/types/schema";
import { APIAnalysisConfig } from "./api/analyze-api";
import { ModelAnalysisConfig } from "./model/analyze-model";
import { SchemaAnalysisConfig } from "./schema/analyze-schema";

export interface AnalysisConfig {
  model?: ModelAnalysisConfig
  schema?: SchemaAnalysisConfig
  api?: APIAnalysisConfig
  lookup_items?: LookupItems
}

export interface LookupItems {
  list_ast_enum: AST_Model.Enum[]
  list_ast_table: AST_Model.Table[]
  list_ast_schema: AST_Schema.Schema[]
}
