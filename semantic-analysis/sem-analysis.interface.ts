import { APIAnalysisConfig } from "./api/analyze-api";
import { ModelAnalysisConfig } from "./model/analyze-model";
import { SchemaAnalysisConfig } from "./schema/analyze-schema";

export interface AnalysisConfig {
  model?: ModelAnalysisConfig
  schema?: SchemaAnalysisConfig
  api?: APIAnalysisConfig
}
