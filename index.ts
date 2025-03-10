import { ast, AST_Item } from "./ast/ast";
import { analyze, SAResult } from './semantic-analysis/sem-analysis';
import fs from 'fs';
import axios from 'axios'
import path from 'path'

import { Schema } from './semantic-analysis/schema/schema';
import { Flow } from './semantic-analysis/flow/flow';
import { API } from './semantic-analysis/api/api';
import { Model } from './semantic-analysis/model/model';
import { Import } from './semantic-analysis/import/import';
import { AnalysisConfig, LookupItems } from "./semantic-analysis/sem-analysis.interface";
import { enumToADF, modelToADF, tableToADF } from "./to-adf/model-to-adf";
import { flowToADF } from "./to-adf/flow-to-adf";
import { schemaToADF } from "./to-adf/schema-to-adf";
import { apiToADF } from "./to-adf/api-to-adf";
import { FileItem } from "./file.types";
import _ from "lodash";
import { AST_Model } from "./ast/types/model";
import { AST_Schema } from "./ast/types/schema";
import { getASTSchemaFromAPI, getASTSchemaFromSchema } from "./semantic-analysis/schema/schema.utility";
import { AST_API } from "./ast/types/api";

export {
  Import,
  Schema,
  Flow,
  API,
  Model,
  SAResult
}

export async function parse(uri: string, relative_path: string = '', current_result?: SAResult, config?: AnalysisConfig): Promise<SAResult> {
  const url_regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}(\.[a-zA-Z0-9()]{1,6})?\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
  
  if (url_regex.test(uri)) {
    try {
      console.log(`downloading file '${uri}'...`)
      const response = await axios.get<string>(uri, { responseType: 'text' });
      const code = response.data;
      console.log(`download complete.`);
      return await analyze({
        list_ast: ast(code),
        relative_path: '', 
        current_result
      });
    } catch (err: any) {
      throw new Error(`from file: '${uri}'\n${err.toString()}`);
    }
  } else {
    const absolute_path = uri.startsWith('/') ? path.resolve(uri) : path.resolve(relative_path, uri);
    try {
      console.log(`file '${absolute_path}'`)
      const readFromFile = (f: string): Promise<string> => new Promise((resolve, reject) => fs.readFile(f, 'utf-8', (err, data: string) => { if (err) reject(err); else resolve(data)}));
      const code = await readFromFile(absolute_path);
      return await analyze({
        list_ast: ast(code), 
        relative_path: path.dirname(absolute_path), 
        current_result, 
        config
      });
    } catch (err: any) {
      throw new Error(`from file: '${absolute_path}'\n${err.toString()}`);
    }
  }
}

export async function parseString(code: string, current_result?: SAResult, config?: AnalysisConfig, filename?: string): Promise<SAResult> {
  return await analyze({
    list_ast: ast(code), 
    relative_path: '', 
    current_result, 
    config,
    filename
  });
}

export function JSONSpecificationToADF(result: SAResult): string {
  return [
    enumToADF(result.list_enum),
    tableToADF(result.list_table),
    flowToADF(result.list_flow),
    schemaToADF(result.list_schema),
    apiToADF(result.list_api)
  ].join('\n');
}


interface ItemAndAST {
  filename: string
  ast_item: AST_Item
}

interface ItemAndListAST {
  filename: string
  list_ast: AST_Item[]
}

export async function parseFromFileItems(items: FileItem[], config?: AnalysisConfig): Promise<SAResult> {
  const list_ast_all: ItemAndListAST[] = items.reduce((acc: ItemAndListAST[], item: FileItem) => [...acc, { filename: item.filename, list_ast: ast(item.content)}], []);
  const list_ast_models: ItemAndAST[] = [];
  const list_ast_non_models: ItemAndAST[] = [];

  // const ignore_item_names: IgnoreItemNames = getAllItemNameFromItemAndListASK(list_ast_all);
  
  for (const list_item of list_ast_all) {
    for (const ast_item of list_item.list_ast) {
      if (ast_item.type === 'enum' || ast_item.type === 'table') {
        list_ast_models.push({
          filename: list_item.filename,
          ast_item
        });
      }
    }
  }
  for (const list_item of list_ast_all) {
    for (const ast_item of list_item.list_ast) {
      if (ast_item.type === 'schema') {
        list_ast_models.push({
          filename: list_item.filename,
          ast_item
        });
      }
    }
  }
  for (const list_item of list_ast_all) {
    for (const ast_item of list_item.list_ast) {
      if (ast_item.type === 'api') {
        list_ast_non_models.push({
          filename: list_item.filename,
          ast_item
        });
      }
    }
  }

  let output: SAResult = {
    list_enum: [],
    list_table: [],
    list_flow: [],
    list_schema: [],
    list_api: [],
  };

  const lookup_source_list_ast_enum: AST_Model.Enum[] = list_ast_all.reduce((acc: AST_Model.Enum[], curr: ItemAndListAST) => [
    ...acc, 
    ...curr.list_ast.filter(a => a.type === 'enum')
  ], []);

  const lookup_source_list_ast_table: AST_Model.Table[] = list_ast_all.reduce((acc: AST_Model.Table[], curr: ItemAndListAST) => [
    ...acc, 
    ...curr.list_ast.filter(a => a.type === 'table')
  ], []);

  const lookup_source_list_ast_schema_1o: AST_Schema.Schema[] = list_ast_all.reduce((acc: AST_Schema.Schema[], curr: ItemAndListAST) => [
    ...acc, 
    ...curr.list_ast.filter(a => a.type === 'schema')
  ], []);

  const lookup_source_list_ast_api: AST_API.API[] = list_ast_all.reduce((acc: AST_API.API[], curr: ItemAndListAST) => [
    ...acc, 
    ...curr.list_ast.filter(a => a.type === 'api')
  ], []);
  const lookup_source_list_ast_schema_inline: AST_Schema.Schema[] = getASTSchemaFromSchema(lookup_source_list_ast_schema_1o);
  const lookup_source_list_ast_schema_api: AST_Schema.Schema[] = getASTSchemaFromAPI(lookup_source_list_ast_api);

  const lookup_source_list_ast_schema = [
    ...lookup_source_list_ast_schema_1o,
    ...lookup_source_list_ast_schema_inline,
    ...lookup_source_list_ast_schema_api
  ];

  const lookup_items: LookupItems = {
    list_ast_enum: lookup_source_list_ast_enum,
    list_ast_table: lookup_source_list_ast_table,
    list_ast_schema: lookup_source_list_ast_schema,
  };
  // console.log(lookup_source_list_ast_schema);

  // MODEL
  const group_ast_model_filename = _.groupBy(list_ast_models, x => x.filename);
  for (const filename of Object.keys(group_ast_model_filename)) {
    const list_items = group_ast_model_filename[filename];
    try {
      output = await analyze({
        list_ast: list_items.map(x => x.ast_item), 
        relative_path: '', 
        current_result: output, 
        config: {
          ...config,
          lookup_items
        },
        filename: filename
      });
    } catch (err: any) {
      throw new Error(`${filename ? `[file: ${filename}]` : '[On This File]'} ${err.message}`);
    }
  }

  console.log('+++++++11111');
  // NON MODEL
  // take all schema out
  const group_ast_non_model_filename = _.groupBy(list_ast_non_models, x => x.filename);
  for (const filename of Object.keys(group_ast_non_model_filename)) {
    const list_items = group_ast_non_model_filename[filename];
    try {
      output = await analyze({
        list_ast: list_items.map(x => x.ast_item), 
        relative_path: '', 
        current_result: output, 
        config: {
          schema: {
            ignoreMissingSchema: true
          },
          api: {
            schemaOnly: true
          },
        },
        filename: filename
      });
      
      output.list_api = [];
      // console.log(output)
    } catch (err: any) {
      // console.log(list_items.map(x => x.ast_item));
      throw new Error(`${filename ? `[file: ${filename}]` : '[On This File]'} ${err.message}`);
    }
  }

  console.log('+++++++22222');
  // NON MODEL
  // ignore schema, api use defined schema
  for (const filename of Object.keys(group_ast_non_model_filename)) {
    const list_items = group_ast_non_model_filename[filename];
    try {
      output = await analyze({
        list_ast: list_items.map(x => x.ast_item), 
        relative_path: '', 
        current_result: output, 
        config: {
          ...config,
          schema: {
            allInlineSchemaAlreadyDefined: true
          },
        },
        filename: filename
      });
    } catch (err: any) {
      throw new Error(`${filename ? `[file: ${filename}]` : '[On This File]'} ${err.message}`);
    }
  }

  return output;
}
