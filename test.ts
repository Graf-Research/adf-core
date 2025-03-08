import fs from 'fs';
import { SAResult } from './semantic-analysis/sem-analysis';
import { JSONSpecificationToADF, parse, parseFromFileItems, parseString } from './index';

if (!process.argv[2]) {
  throw new Error(`argv[2] cannot be empty`);
}

const adf_1 = `

// --- Start of LLM Generated Code 2025-03-08 11:15:24 ---
api get /user/:id {
  description get user by id
  headers {
    authorization string required
  }
  path {
    id number required
  }
  return table.B required
}
// --- End of LLM Generated Code 2025-03-08 11:15:24 ---

schema NZD {
  id number required
}


// --- Start of LLM Generated Code 2025-03-08 11:04:28 ---
api POST /login {
  description user login
  headers {
    Content-Type string required
  }
  body {
    email string required
    password string required
  }
  return schema LoginResponse {
    token string required
    user table.B required
  } required
}

api POST /register {
  description user registration
  headers {
    Content-Type string required
  }
  body {
    email string required
    password string required
    nama string required
    nomor_karyawan string required
  }
  return schema RegisterResponse {
    message string required
    user table.B required
  } required
}
// --- End of LLM Generated Code 2025-03-08 11:04:28 ---


// `;
const adf_2 = `table Y {
}

table C2 {
  iduid bigint pk inc notnull
}`;
const adf_3 = `table O {
  id varchar(200)
}
  
api get /event {
  return number
}`;


async function main(filename: string) {
  try {
    const result: SAResult = await parseString(adf_1, undefined, { schema: {
      ignoreMissingEnum: true,
      ignoreMissingSchema: true,
      ignoreMissingTable: true
    } });
    console.log(result);
    // console.log(JSONSpecificationToADF(result));
  } catch (parse_error: any) {
    console.error(parse_error)
  }
};
main(process.argv[2]);
