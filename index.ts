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

export {
  Import,
  Schema,
  Flow,
  API,
  Model,
  SAResult
}

export async function parse(uri: string, relative_path: string = '', current_result?: SAResult): Promise<SAResult> {
  const url_regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
  
  if (url_regex.test(uri)) {
    try {
      console.log(`downloading file '${uri}'...`)
      const response = await axios.get<string>(uri, { responseType: 'text' });
      const code = response.data;
      console.log(`download complete.`);
      return await analyze(ast(code), '', current_result);
    } catch (err: any) {
      throw new Error(`from file: '${uri}'\n${err.toString()}`);
    }
  } else {
    const absolute_path = uri.startsWith('/') ? path.resolve(uri) : path.resolve(relative_path, uri);
    try {
      console.log(`file '${absolute_path}'`)
      const readFromFile = (f: string): Promise<string> => new Promise((resolve, reject) => fs.readFile(f, 'utf-8', (err, data: string) => { if (err) reject(err); else resolve(data)}));
      const code = await readFromFile(absolute_path);
      return await analyze(ast(code), path.dirname(absolute_path), current_result);
    } catch (err: any) {
      throw new Error(`from file: '${absolute_path}'\n${err.toString()}`);
    }
  }
}

export async function parseString(code: string, current_result?: SAResult): Promise<SAResult> {
  return await analyze(ast(code), '', current_result);
}
