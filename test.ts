import fs from 'fs';
import { SAResult } from './semantic-analysis/sem-analysis';
import { JSONSpecificationToADF, parse, parseFromFileItems } from './index';

if (!process.argv[2]) {
  throw new Error(`argv[2] cannot be empty`);
}

const adf_1 = `table A {
  id bigint pk notnull inc
}
  
api get /event {
  return string
}`;
const adf_2 = `table B {
}

table C {
  iduid bigint pk inc notnull
}`;
const adf_3 = `table F {
  id varchar(200)
}
  
api get /event {
  return number
}`;


async function main(filename: string) {
  try {
    const result: SAResult = await parseFromFileItems([
      {
        filename: 'API/A',
        content: adf_1
      },
      {
        filename: 'API/B',
        content: adf_2
      },
      {
        filename: 'API/C',
        content: adf_3
      }
    ]);
    console.log(result);
    // console.log(JSONSpecificationToADF(result));
  } catch (parse_error: any) {
    console.error(parse_error)
  }
};
main(process.argv[2]);
