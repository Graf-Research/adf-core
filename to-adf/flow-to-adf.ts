import { Flow } from "../semantic-analysis/flow/flow";

export function flowToADF(list_flow: Flow.Flow[]): string {
  return list_flow.map((f: Flow.Flow) => [
    `flow ${f.name} {`,
    f.items.map((item: Flow.Item) => {
      switch (item.type) {
        case "terminal": return `  ${item.id} ${item.type} ${item.description}`;
        case "notes": return `  ${item.id} ${item.type} ${item.description}`;
        case "input": return `  ${item.id} ${item.type} ${item.description}`;
        case "process": return `  ${item.id} ${item.type} ${item.description}`;
        case "api": return `  ${item.id} ${item.type} ${item.method} ${item.path} ${item.description}`;
        case "api-crud": return `  ${item.id} ${item.type} ${item.prefix_path} ${item.description}`;
        case "conditional": return `  ${item.id} ${item.type} ${item.description}`;
      }
    }).join('\n'),
    `}`
  ].join('\n')).join('\n');
}
