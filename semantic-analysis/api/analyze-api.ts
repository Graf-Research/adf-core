import { AST_API } from "../../ast/types/api";
import { generateSchemaItemType } from "../schema/analyze-schema";
import { Schema } from "../schema/schema";
import { API } from "./api";

export interface AnalyzeAPIResult {
  list_api: API.API[]
  list_schema: Schema.Schema[]
}

export function analyzeAPI(list_ast_api: AST_API.API[], list_existing_schema: Schema.Schema[], list_existing_api: API.API[]): AnalyzeAPIResult {
  const list_api: API.API[] = list_existing_api;
  const list_schema: Schema.Schema[] = list_existing_schema;

  for (const ast_api of list_ast_api) {
    if (!['get', 'post', 'put', 'patch', 'delete'].includes(ast_api.method.text.toLowerCase())) {
      throw new Error(`Error line ${ast_api.method.line} col ${ast_api.method.col} method '${ast_api.method.text}' is not supported`);
    }

    const method = (ast_api.method.text.toLowerCase()) as 'get' | 'post' | 'put' | 'patch' | 'delete';
    const return_item = ast_api.items.find(item => item.key === 'return');
    if (!return_item) {
      throw new Error(`Error line ${ast_api.method.line} api '${ast_api.method.text} ${ast_api.path.text}' return value missing`);
    }
    const _return = extractReturn(return_item, list_schema);

    const description = ast_api.items.find(item => item.key === 'description');
    const body_item = ast_api.items.find(item => item.key === 'body');
    const headers_item = ast_api.items.find(item => item.key === 'headers');
    const path_item = ast_api.items.find(item => item.key === 'path');
    const query_item = ast_api.items.find(item => item.key === 'query');

    const _headers = headers_item ? extractHeaders(headers_item, list_schema) : undefined;
    const _path = path_item ? extractPaths(path_item, list_schema) : undefined;
    const _query = query_item ? extractQueries(query_item, list_schema) : undefined;
    const _body = body_item ? extractBody(body_item, list_schema) : undefined;

    let api: API.API;
    switch (method) {
      case "get":
        api = {
          extends: ast_api.extends,
          description: description?.data,
          type: 'api',
          method: 'get',
          path: ast_api.path.text,
          headers: _headers,
          paths: _path,
          queries: _query,
          return: _return.data
        } as API.GET;
        break;
      case "delete":
        api = {
          extends: ast_api.extends,
          description: description?.data,
          type: 'api',
          method: 'delete',
          path: ast_api.path.text,
          headers: _headers,
          paths: _path,
          queries: _query,
          return: _return.data
        } as API.DELETE;
        break;
      case "post":
        api = {
          extends: ast_api.extends,
          description: description?.data,
          type: 'api',
          method: 'post',
          path: ast_api.path.text,
          headers: _headers,
          body: _body?.data,
          paths: _path,
          queries: _query,
          return: _return.data
        } as API.POST;
        break;
      case "put":
        api = {
          extends: ast_api.extends,
          description: description?.data,
          type: 'api',
          method: 'put',
          path: ast_api.path.text,
          headers: _headers,
          body: _body?.data,
          paths: _path,
          queries: _query,
          return: _return.data
        } as API.PUT;
        break;
      case "patch":
        api = {
          extends: ast_api.extends,
          description: description?.data,
          type: 'api',
          method: 'patch',
          path: ast_api.path.text,
          headers: _headers,
          paths: _path,
          queries: _query,
          body: _body?.data,
          return: _return.data
        } as API.PATCH;
        break;
    }

    const existing_api_index: number = list_api.findIndex((a: API.API) => (a.method.toLowerCase() === ast_api.method.text.toLowerCase()) && (a.path == ast_api.path.text));
    if (ast_api.extends) {
      if (existing_api_index === -1) {
        throw new Error(`Error line ${ast_api.method.line} col ${ast_api.method.col} endpoint '${ast_api.method.text} ${ast_api.path.text}' doesnt find existing api`);
      }
      list_api[existing_api_index].extends = true;

      // Paths
      for (const p of api.paths ?? []) {
        const i = (list_api[existing_api_index].paths ?? []).findIndex((_p: API.Path) => _p.key == p.key);
        if (i > -1) {
          list_api[existing_api_index].paths![i] = p;
        } else {
          if (!list_api[existing_api_index].paths) {
            list_api[existing_api_index].paths = []
          }
          list_api[existing_api_index].paths.push(p);
        }
      }

      // Query
      for (const q of api.queries ?? []) {
        const i = (list_api[existing_api_index].queries ?? []).findIndex((_q: API.Query) => _q.key == q.key);
        if (i > -1) {
          list_api[existing_api_index].queries![i] = q;
        } else {
          if (!list_api[existing_api_index].queries) {
            list_api[existing_api_index].queries = []
          }
          list_api[existing_api_index].queries.push(q);
        }
      }

      // Headers
      for (const h of api.headers ?? []) {
        const i = (list_api[existing_api_index].headers ?? []).findIndex((_h: API.Headers) => _h.key == h.key);
        if (i > -1) {
          list_api[existing_api_index].headers![i] = h;
        } else {
          if (!list_api[existing_api_index].headers) {
            list_api[existing_api_index].headers = []
          }
          list_api[existing_api_index].headers.push(h);
        }
      }

      // Body
      if (
        (api.method === 'post' || api.method === 'patch' || api.method === 'put')
        && (list_api[existing_api_index].method === 'post' || list_api[existing_api_index].method === 'patch' || list_api[existing_api_index].method === 'put')
      ) {
        for (const b of api.body ?? []) {
          const i = (list_api[existing_api_index].body ?? []).findIndex((_b: API.Body) => _b.key == b.key);
          if (i > -1) {
            list_api[existing_api_index].body![i] = b;
          } else {
            if (!list_api[existing_api_index].body) {
              list_api[existing_api_index].body = []
            }
            list_api[existing_api_index].body.push(b);
          }
        }
      }

      list_api[existing_api_index].description = api.description;
      list_api[existing_api_index].return = api.return;
    } else {
      if (existing_api_index > -1) {
        throw new Error(`Error line ${ast_api.method.line} col ${ast_api.method.col} endpoint '${ast_api.method.text} ${ast_api.path.text}' already defined before`);
      }
      list_api.push(api);
    }
    list_schema.push(..._return.list_new_schema);
    list_schema.push(...(_body?.list_new_schema ?? []));
  }

  return {
    list_api,
    list_schema
  };
}

function extractHeaders(ast_api_header: AST_API.APIItemHeaders, list_existing_schema: Schema.Schema[]): API.Headers[] {
  const data: API.Query[] = [];
  for (const header of ast_api_header.data) {
    if (header.array) {
      throw new Error(`Error line ${header.key.line} col ${header.key.col} schema header '${header.key.text}' attribute cannot be an array.`);
    }
    const generated_item_type = generateSchemaItemType(header.type, [], list_existing_schema);
    if (generated_item_type.type.type !== 'native') {
      throw new Error(`Error line ${header.key.line} col ${header.key.col} schema header '${header.key.text}' attribute only accepting native types only.`)
    }
    data.push({
      key: header.key.text,
      type: generated_item_type.type.native_type,
      required: header.required
    });
  }
  return data;
}

function extractPaths(ast_api_path: AST_API.APIItemPath, list_existing_schema: Schema.Schema[]): API.Path[] {
  const data: API.Path[] = [];
  for (const path of ast_api_path.data) {
    if (path.array) {
      throw new Error(`Error line ${path.key.line} col ${path.key.col} schema path '${path.key.text}' attribute cannot be an array.`);
    }
    if (!path.required) {
      throw new Error(`Error line ${path.key.line} col ${path.key.col} schema path '${path.key.text}' must have 'required' attribute.`);
    }
    const generated_item_type = generateSchemaItemType(path.type, [], list_existing_schema);
    if (generated_item_type.type.type !== 'native') {
      throw new Error(`Error line ${path.key.line} col ${path.key.col} schema path '${path.key.text}' attribute only accepting native types only.`)
    }
    data.push({
      key: path.key.text,
      type: generated_item_type.type.native_type,
    });
  }
  return data;
}

function extractQueries(ast_api_query: AST_API.APIItemQuery, list_existing_schema: Schema.Schema[]): API.Query[] {
  const data: API.Query[] = [];
  for (const query of ast_api_query.data) {
    const generated_item_type = generateSchemaItemType(query.type, [], list_existing_schema);
    if (generated_item_type.type.type !== 'native') {
      throw new Error(`Error line ${query.key.line} col ${query.key.col} schema query '${query.key.text}' attribute only accepting native types only.`)
    }
    data.push({
      key: query.key.text,
      type: generated_item_type.type.native_type,
      required: query.required,
      array: query.array
    });
  }
  return data;
}

interface ExtractBodyResult {
  data: API.Body[]
  list_new_schema: Schema.Schema[]
}

function extractBody(ast_api_body: AST_API.APIItemBody, list_existing_schema: Schema.Schema[]): ExtractBodyResult {
  const data: API.Body[] = [];
  const list_new_schema: Schema.Schema[] = [];

  for (const body of ast_api_body.data) {
    const generated_item_type = generateSchemaItemType(body.type, [], list_existing_schema);
    data.push({
      key: body.key.text,
      type: generated_item_type.type,
      required: body.required,
      array: body.array
    });
    list_new_schema.push(...generated_item_type.list_new_schema);
  }

  return {
    data,
    list_new_schema
  };
}

interface ExtractReturnResult {
  data: API.ReturnType
  list_new_schema: Schema.Schema[]
}

function extractReturn(ast_api_return: AST_API.APIItemReturn, list_existing_schema: Schema.Schema[]): ExtractReturnResult {
  const generated_item_type = generateSchemaItemType(ast_api_return.type, [], list_existing_schema);
  return {
    data: {
      type: generated_item_type.type,
      required: ast_api_return.required,
      array: ast_api_return.array
    },
    list_new_schema: generated_item_type.list_new_schema
  };
}