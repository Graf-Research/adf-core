import { API } from "../semantic-analysis/api/api";

export function apiToADF(list_api: API.API[]): string {
  return list_api.map((api: API.API) => [
    `api ${api.method} ${api.path} {`,
    api.description ? `  description ${api.description}` : '',
    api.headers ? [
      `  headers {`,
      api.headers.map((headers: API.Headers) => `    ${headers.key} ${headers.type} ${headers.required ? 'required' : ''}`).join('\n'),
      `  }`
    ].join('\n') : '',
    api.queries ? [
      `  query {`,
      api.queries.map((queries: API.Query) => `    ${queries.key} ${queries.type} ${queries.required ? 'required' : ''}`).join('\n'),
      `  }`
    ].join('\n') : '',
    api.paths ? [
      `  path {`,
      api.paths.map((paths: API.Path) => `    ${paths.key} ${paths.type} required`).join('\n'),
      `  }`
    ].join('\n') : '',
    (() => {
      switch (api.method) {
        case "get":
        case "delete":
          return '';
        case "post":
        case "put":
        case "patch":
          return api.body ? [
            `  body {`,
            api.body.map((body: API.Body) => {
              switch (body.type.type) {
                case "native":
                  return `    ${body.key}${body.array ? ' array' : ''} ${body.type.native_type} ${body.required ? 'required' : ''}`;
                case "schema":
                  return `    ${body.key}${body.array ? ' array' : ''} schema.${body.type.schema_name} ${body.required ? 'required' : ''}`;
                case "table":
                  return `    ${body.key}${body.array ? ' array' : ''} table.${body.type.table_name} ${body.required ? 'required' : ''}`;
                case "enum":
                  return `    ${body.key}${body.array ? ' array' : ''} enum.${body.type.enum_name} ${body.required ? 'required' : ''}`;
              }
            }).join('\n'),
            `  }`
          ].join('\n') : ''
      }
    })(),
    (() => {
      switch (api.return.type.type) {
        case "native":
          return `  return${api.return.array ? ' array' : ''} ${api.return.type.native_type} ${api.return.required ? 'required' : ''}`;
        case "schema":
          return `  return${api.return.array ? ' array' : ''} schema.${api.return.type.schema_name} ${api.return.required ? 'required' : ''}`;
        case "table":
          return `  return${api.return.array ? ' array' : ''} table.${api.return.type.table_name} ${api.return.required ? 'required' : ''}`;
        case "enum":
          return `  return${api.return.array ? ' array' : ''} enum.${api.return.type.enum_name} ${api.return.required ? 'required' : ''}`;
      }
    })(),
    `}`
  ].join('\n')).join('\n')
}
