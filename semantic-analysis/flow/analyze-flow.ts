import { AST_Flow } from "../../ast/types/flow";
import { AnalysisConfig } from "../sem-analysis.interface";
import { Flow } from "./flow";


export interface AnalyzeFlowParams {
  list_ast_flow: AST_Flow.Flow[]
  filename?: string
  config?: AnalysisConfig
}

export function analyzeFlow(param: AnalyzeFlowParams): Flow.Flow[] {
  const list_flow: Flow.Flow[] = [];

  for (const ast_flow of param.list_ast_flow) {
    // TODO: check flow name duplicate
    const flow: Flow.Flow = {
      extends: ast_flow.extends,
      type: 'flow',
      name: ast_flow.name.text,
      items: [],
      filename: param.filename
    };

    for (const item of ast_flow.items) {
      switch (item.type) {
        case "terminal":
        case "notes":
        case "input":
        case "process":
          flow.items.push({
            id: +item.id.text,
            description: item.comments.text ?? '',
            type: item.type
          });
          break;
        case "conditional":
          flow.items.push({
            id: +item.id.text,
            description: item.comments.text ?? '',
            type: 'conditional',

            // TODO: get "yes" and "no" id destination
            // TODO: conditional cannot be on the end of the flow
            no_flow_id: -1,
            yes_flow_id: -1
          });
          break;
        case "api":
          if (!['get', 'post', 'put', 'patch', 'delete'].includes(item.method.text.toLowerCase())) {
            throw new Error(`line ${item.method.line} col ${item.method.col} api method '${item.method.text}' is not supported`);
          }
          flow.items.push({
            id: +item.id.text,
            description: item.comments.text ?? '',
            type: 'api',
            path: item.path.text,
            method: item.method.text.toLowerCase() as Flow.P.APIMethod
          });
          break;
        case "api-crud":
          flow.items.push({
            id: +item.id.text,
            description: item.comments.text ?? '',
            type: 'api-crud',
            prefix_path: item.prefix_path.text,
          });
          break;
      }
    }

    list_flow.push(flow);
  }

  return list_flow;
}
