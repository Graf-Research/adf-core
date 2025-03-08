import fs from 'fs';
import { SAResult } from './semantic-analysis/sem-analysis';
import { JSONSpecificationToADF, parse, parseFromFileItems } from './index';

if (!process.argv[2]) {
  throw new Error(`argv[2] cannot be empty`);
}

const adf_1 = `

// START:a8791432-4b80-4760-8973-42c9219cbc5d
table A {}

table CC {}

// END:a8791432-4b80-4760-8973-42c9219cbc5d
// START:f9f25951-4cdf-4a27-b69e-3c11117fb231
table B {}

// END:f9f25951-4cdf-4a27-b69e-3c11117fb231
// START:160c87bf-aeec-4758-8204-a1f46ce85b28



api get /user/:id {
  description get user by id
  headers {
    authorization string required
  }
  path {
    id number required
  }
  return table.User required
}


// END:160c87bf-aeec-4758-8204-a1f46ce85b28
// START:4b4b714c-14a1-42b1-985c-c1697c2f2719
schema NZD {
  id number required
}

// END:4b4b714c-14a1-42b1-985c-c1697c2f2719
// START:b9b67ff9-f924-48e1-89c5-7dd01aa8fd8c


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
    user table.User required
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
    user table.User required
  } required
}


// END:b9b67ff9-f924-48e1-89c5-7dd01aa8fd8c`;
const adf_2 = `table Y {
}

table C {
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
