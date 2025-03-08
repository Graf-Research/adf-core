import fs from 'fs';
import { SAResult } from './semantic-analysis/sem-analysis';
import { JSONSpecificationToADF, parse, parseFromFileItems, parseString } from './index';

if (!process.argv[2]) {
  throw new Error(`argv[2] cannot be empty`);
}

const adf_1 = `
// --- Start of LLM Generated Code 2025-03-08 12:36:26 ---
enum PaymentMethod {
  CreditCard
  BankTransfer
  EWallet
}

table User {
  id bigint pk inc notnull
  username varchar(150) notnull unique
  email varchar(200) notnull unique
  password varchar(255) notnull
  created_at timestamp notnull
}

table Event {
  id bigint pk inc notnull
  nama varchar(200) notnull
  deskripsi varchar(500)
  tanggal timestamp notnull
  lokasi varchar(300) notnull
  harga decimal(10,2) notnull
}

table Ticket {
  id bigint pk inc notnull
  event_id Event.id notnull
  jenis_tiket varchar(100) notnull
  harga decimal(10,2) notnull
  kuota int notnull
}

table TicketOrder {
  id bigint pk inc notnull
  user_id User.id notnull
  ticket_id Ticket.id notnull
  jumlah_tiket int notnull
  total_harga decimal(10,2) notnull
  status boolean notnull default=true
  metode_pembayaran PaymentMethod notnull
  created_at timestamp notnull
}
// --- End of LLM Generated Code 2025-03-08 12:36:26 ---

`;
const adf_2 = `
// --- Start of LLM Generated Code 2025-03-08 12:42:17 ---
api get /admin/events {
  description get list of events by admin



  return schema.EventsResponse required
}

api get /admin/event/:id {
  description get event details by event id for admin


  path {
    id number required
  }

  return schema.EventDetailResponse required
}

api POST /admin/event {
  description create a new event



  body {
    nama string required
    deskripsi string 
    tanggal number required
    lokasi string required
    harga number required
  } 

  return schema.EventDetailResponse required
}

api PUT /admin/event/:id {
  description update an existing event


  path {
    id number required
  }

  body {
    nama string required
    deskripsi string 
    tanggal number required
    lokasi string required
    harga number required
  }  

  return schema.EventDetailResponse required
}

api DELETE /admin/event/:id {
  description delete an event


  path {
    id number required
  } 

  return boolean required
}
// --- End of LLM Generated Code 2025-03-08 12:42:17 ---

`;
const adf_3 = `
// --- Start of LLM Generated Code 2025-03-08 12:37:47 ---
api GET /events {
  description get list of events with their details
  return schema EventsResponse {
    total number required
    data array schema EventDetail {
      id number required
      nama string required
      deskripsi string
      tanggal number required
      lokasi string required
      harga number required
    } required
  } required
}

api GET /event/:id {
  description get event details by event id
  path {
    id number required
  }
  return schema EventDetailResponse {
    id number required
    nama string required
    deskripsi string
    tanggal number required
    lokasi string required
    harga number required
  } required
}
// --- End of LLM Generated Code 2025-03-08 12:37:47 ---
`;


async function main(filename: string) {
  try {
    const result: SAResult = await parseFromFileItems([{
      filename: 'Model/Main',
      content: adf_1
    }, {
      filename: 'API/Admin/Event',
      content: adf_3
    }, {
      filename: 'API/User/Event',
      content: adf_2
    }]);
    console.log(result);
    // console.log(JSONSpecificationToADF(result));
  } catch (parse_error: any) {
    console.error(parse_error)
  }
};
main(process.argv[2]);
