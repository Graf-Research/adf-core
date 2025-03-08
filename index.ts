import { ast } from "./ast/ast";
import { analyze, SAResult } from './semantic-analysis/sem-analysis';
import fs from 'fs';
import axios from 'axios'
import path from 'path'

import { Schema } from './semantic-analysis/schema/schema';
import { Flow } from './semantic-analysis/flow/flow';
import { API } from './semantic-analysis/api/api';
import { Model } from './semantic-analysis/model/model';
import { Import } from './semantic-analysis/import/import';
import { AnalysisConfig } from "./semantic-analysis/sem-analysis.interface";
import { enumToADF, modelToADF, tableToADF } from "./to-adf/model-to-adf";
import { flowToADF } from "./to-adf/flow-to-adf";
import { schemaToADF } from "./to-adf/schema-to-adf";
import { apiToADF } from "./to-adf/api-to-adf";
import { FileItem } from "./file.types";

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

export async function parseFromFileItems(items: FileItem[]): Promise<SAResult> {
  const output: SAResult = {
    list_enum: [],
    list_table: [],
    list_flow: [],
    list_schema: [],
    list_api: [],
  };

  for (const item of items) {
    try {
      item.result = await parseString(item.content, output, undefined, item.filename);
      output.list_enum = [
        ...item.result.list_enum
      ];
      output.list_table = [
        ...item.result.list_table
      ];
      output.list_flow = [
        ...item.result.list_flow
      ];
      output.list_schema = [
        ...item.result.list_schema
      ];
      output.list_api = [
        ...item.result.list_api
      ];
    } catch (err: any) {
      throw new Error(`${item.filename ? `[file: ${item.filename}]` : '[On This File]'} ${err.message}`);
    }
  }

  return output;
}
