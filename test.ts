import fs from 'fs';
import { SAResult } from './semantic-analysis/sem-analysis';
import { parse } from './index';

if (!process.argv[2]) {
  throw new Error(`argv[2] cannot be empty`);
}

async function main(filename: string) {
  try {
    const result: SAResult = await parse(filename);
    console.log(result);
  } catch (parse_error: any) {
    console.error(parse_error)
  }
};
main(process.argv[2]);
