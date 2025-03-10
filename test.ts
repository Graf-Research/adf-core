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
    const result: SAResult = await parseFromFileItems(
      [
        {
            "filename": "Schema/MessageWithAttachments",
            "content": "schema MessageWithAttachments {\n  message table.Message required\n  list_attachment array table.MessageAttachment required\n}\n"
        },
        {
            "filename": "Schema/CommunityWithMembers",
            "content": "schema CommunityWithMembers {\n  community table.Community required\n  list_members array table.CommunityMember required\n}\n"
        },
        {
            "filename": "Model/Message",
            "content": "table Message {\n  id bigint pk inc notnull\n  id_community_to Community.id\n  id_community_topic_to CommunityTopic.id\n  id_user_to User.id\n  id_user_from User.id notnull\n  is_latest_message boolean notnull default=false\n  data text notnull\n  ts timestamp notnull\n}\n\nenum AttachmentType {\n  IMAGE\n  VIDEO\n  FILE\n}\n\ntable MessageAttachment {\n  id bigint pk inc notnull\n  id_message Message.id notnull\n  filename varchar(255)\n  type AttachmentType notnull\n  url varchar(255)\n  is_uploaded boolean notnull default=false\n  upload_token varchar(255) notnull\n  uploaded_at timestamp\n}\n"
        },
        {
            "filename": "API/Community",
            "content": "api post /community {\n  description Buat komunitas (nama komunitas dan daftar public ID anggota)\n  headers {\n    authorization string required\n  }\n  body {\n    data schema CommunityPayload {\n      thumbnail string\n      name string required\n      members_public_id array string required\n    } required\n  }\n  return table.Community required\n}\n\napi get /community/by-public-id/:public_id {\n  description Get community data by public ID\n  headers {\n    authorization string required\n  }\n  path {\n    public_id string required\n  }\n  return schema GetCommunityDataResponse {\n    community table.Community required\n    is_admin boolean required\n  } required\n}\n\napi delete /community/by-public-id/:public_id {\n  description Hapus komunitas (soft delete)\n  headers {\n    authorization string required\n  }\n  path {\n    public_id string required\n  }\n  return boolean required\n}\n\napi post /community/by-public-id/:public_id/leave {\n  description Keluar dari komunitas\n  headers {\n    authorization string required\n  }\n  path {\n    public_id string required\n  }\n  body {\n    __nobody string\n  }\n  return boolean required\n}\n\napi get /community/by-public-id/:public_id/member {\n  description daftar anggota komunitas\n  headers {\n    authorization string required\n  }\n  path {\n    public_id string required\n  }\n  return array table.CommunityMember required\n}\n\napi post /community/by-public-id/:public_id/member {\n  description Tambah list anggota baru komunitas\n  headers {\n    authorization string required\n  }\n  path {\n    public_id string required\n  }\n  body {\n    list_member_public_hash array string required\n  }\n  return schema.GetCommunityDataResponse required\n}\n\napi delete /community/by-public-id/:public_id/member/:public_hash {\n  description Hapus anggota dari komunitas\n  headers {\n    authorization string required\n  }\n  path {\n    public_id string required\n    public_hash string required\n  }\n  return schema.GetCommunityDataResponse required\n}\n\napi delete /community/by-public-id/:public_id/member/:public_hash/delete-admin {\n  description Hapus anggota dari admin komunitas\n  headers {\n    authorization string required\n  }\n  path {\n    public_id string required\n    public_hash string required\n  }\n  return schema.GetCommunityDataResponse required\n}\n\napi post /community/by-public-id/:public_id/member/:public_hash/set-admin {\n  description Jadikan anggota admin komunitas\n  headers {\n    authorization string required\n  }\n  path {\n    public_id string required\n    public_hash string required\n  }\n  body {\n    __nobody string\n  }\n  return schema.GetCommunityDataResponse required\n}\n\napi post /community/by-public-id/:public_id/topic {\n  description Tambah topik komunitas\n  headers {\n    authorization string required\n  }\n  path {\n    public_id string required\n    public_hash string required\n  }\n  body {\n    data schema TopicPayload {\n      icon_url string required\n      name string required\n      color string required\n      list_community_member_id array number required\n    } required\n  }\n  return table.CommunityTopic required\n}\n\napi get /community/by-public-id/:public_id/topic/:topic_id {\n  description Detail topik komunitas\n  headers {\n    authorization string required\n  }\n  path {\n    public_id string required\n    public_hash string required\n    topic_id number required\n  }\n  return table.CommunityTopic required\n}\n\napi delete /community/by-public-id/:public_id/topic/:topic_id {\n  description Hapus topik komunitas (soft delete)\n  headers {\n    authorization string required\n  }\n  path {\n    public_id string required\n    public_hash string required\n    topic_id number required\n  }\n  return boolean required\n}\n\napi put /community/by-public-id/:public_id/topic/:topic_id {\n  description Ubah topik komunitas\n  headers {\n    authorization string required\n  }\n  path {\n    public_id string required\n    public_hash string required\n    topic_id number required\n  }\n  body {\n    data schema.TopicPayload required\n  }\n  return table.CommunityTopic required\n}\n\napi get /community/message/:public_id {\n  description Ambil percakapan dari komunitas (public_id). Tambahkan parameter opsional \"ID pesan terakhir\" untuk mengambil hanya beberapa pesan terakhir.\n  headers {\n    authorization string required\n  }\n  path {\n    public_id string required\n  }\n  query {\n    limit number\n    offset number\n    latest_message_id number\n  }\n  return schema CommunityRoomMessagesData {\n    messages array schema.MessageWithAttachments required\n    community table.Community required\n  } required\n}\n\napi post /community/message/:public_id/send {\n  description Kirim pesan ke komunitas (public_id). Update data pesan terakhir.\n  headers {\n    authorization string required\n  }\n  path {\n    public_id string required\n  }\n  body {\n    data schema.MessagePayload required\n  }\n  return schema.SendMessageResponse required\n}\n\napi get /my-community {\n  description Ambil data komunitas yang diikuti oleh user yang sedang login\n  headers {\n    authorization string required\n  }\n  query {\n    limit number\n    offst number\n  }\n  return schema MyCommunityResult {\n    total number required\n    data array table.CommunityMember required\n  } required\n}\n"
        },
        {
            "filename": "Schema/MessageData",
            "content": "schema MessageAttachmentData {\n  type string required\n  filename string required\n}\n\nschema MessagePayload {\n  message string\n  attachment schema.MessageAttachmentData\n}\n\nschema SendMessageResponse {\n  messages array schema.MessageWithAttachments required\n  upload_token string\n}\n"
        },
        {
            "filename": "API/Wilayah",
            "content": "api get /adm/provinsi {\n  description Data Provinsi\n  headers {\n    authorization string required\n  }\n  return array table.Provinsi required\n}\n\napi get /adm/provinsi/:id_provinsi/kota-kab {\n  description Data Kota/Kabupaten berdasarkan ID Provinsi\n  path {\n    id_provinsi number required\n  }\n  headers {\n    authorization string required\n  }\n  return array table.KotaKabupaten required\n}\napi get /adm/provinsi/:id_provinsi/kota-kab/:id_kota_kab/kecamatan {\n  description Data Kecamatan berdasarkan ID Provinsi dan ID Kota Kabupaten\n  path {\n    id_provinsi number required\n    id_kota_kab number required\n  }\n  headers {\n    authorization string required\n  }\n  return array table.Kecamatan required\n}\napi get /adm/provinsi/:id_provinsi/kota-kab/:id_kota_kab/kecamatan/:id_kecamatan {\n  description Data Kecamatan berdasarkan ID Provinsi dan ID Kota Kabupaten\n  path {\n    id_provinsi number required\n    id_kota_kab number required\n    id_kecamatan number required\n  }\n  headers {\n    authorization string required\n  }\n  return array table.DesaKelurahan required\n}\n"
        },
        {
            "filename": "Model/Etc",
            "content": "// Laporan user/komunitas/topik \n// yang tidak sesuai aturan dari user\ntable UserReport {\n  id bigint pk inc notnull\n  id_user User.id notnull\n  id_user_reported User.id\n  id_community_reported Community.id\n  id_topic_community_reported CommunityTopic.id\n  reason text notnull\n  created_at timestamp notnull\n}\n\ntable Notification {\n  id bigint pk inc notnull\n  id_user User.id notnull\n  content text notnull\n  id_ref_community Community.id\n  id_ref_community_topic CommunityTopic.id\n  id_ref_posting Posting.id\n  id_ref_user_transaction UserTransaction.id\n  created_at timestamp notnull\n}\n"
        },
        {
            "filename": "API/FCM Token",
            "content": "api post /fcm-token {\n  description Update FCM Token\n  headers {\n    authorization string required\n  }\n  body {\n    token string required\n  }\n  return boolean required\n}\n"
        },
        {
            "filename": "Model/Posting",
            "content": "enum PostingType {\n  PLAIN_TEXT\n  IMAGE_STATIC\n  IMAGE_GIF\n  AUDIO\n  VIDEO\n  POOL\n  FILE\n  SELL_PRODUCT\n  JOB_VACANCY\n}\n\ntable Posting {\n  id bigint pk inc notnull\n  id_community Community.id\n  id_user User.id notnull\n  type PostingType\n  hash varchar(255) notnull\n  visibility_only_me boolean notnull default=false\n  created_at timestamp notnull\n  deleted_at timestamp\n}\n\ntable PostingFile {\n  id bigint pk inc notnull\n  id_posting Posting.id notnull\n  file_url varchar(255) notnull\n  caption text\n}\n\ntable ProductCategory {\n  id bigint pk inc notnull\n  label varchar(255) notnull\n}\n\ntable PostingSellProduct {\n  id bigint pk inc notnull\n  id_posting Posting.id notnull\n  id_product_category ProductCategory.id notnull\n  name varchar(255) notnull\n  price bigint notnull\n  description text\n  new_product boolean default=true\n  location varchar(255)\n  quantity float notnull default=1\n}\n\ntable ProductImage {\n  id bigint pk inc notnull\n  id_posting_sell_product PostingSellProduct.id notnull\n  image_url varchar(255) notnull\n  caption text\n}\n\ntable PostingPlainText {\n  id bigint pk inc notnull\n  id_posting Posting.id notnull\n  content text notnull\n}\n\ntable PostingImageStatic {\n  id bigint pk inc notnull\n  id_posting Posting.id notnull\n  image_url varchar(255) notnull\n  caption text\n}\n\ntable PostingImageGIF {\n  id bigint pk inc notnull\n  id_posting Posting.id notnull\n  image_url varchar(255) notnull\n  caption text\n}\n\ntable PostingAudio {\n  id bigint pk inc notnull\n  id_posting Posting.id notnull\n  audio_url varchar(255) notnull\n  caption text\n}\n\ntable PostingVideo {\n  id bigint pk inc notnull\n  id_posting Posting.id notnull\n  video_url varchar(255) notnull\n  caption text\n}\n\ntable PostingPool {\n  id bigint pk inc notnull\n  id_posting Posting.id notnull\n  question text\n}\n\ntable PostingPoolOption {\n  id bigint pk inc notnull\n  id_posting_pool PostingPool.id notnull\n  data varchar(1000) notnull\n}\n\ntable PostingPoolVote {\n  id bigint pk inc notnull\n  id_posting_pool_option PostingPoolOption.id notnull\n  id_posting_pool PostingPool.id notnull\n  id_user User.id notnull\n  voted_at timestamp\n}\n\ntable Comment {\n  id bigint pk inc notnull\n  id_user User.id notnull\n  id_posting Posting.id\n  id_parent_comment Comment.id\n  has_children boolean notnull default=false\n  content text notnull\n  created_at timestamp notnull\n}\n\nenum VoteType {\n  UP\n  DOWN\n}\n\ntable Vote {\n  id bigint pk inc notnull\n  id_posting Posting.id notnull\n  id_user User.id notnull\n  type VoteType notnull\n}\n\ntable CommentVote {\n  id bigint pk inc notnull\n  id_comment Comment.id notnull\n  type VoteType notnull\n}\n\n\ntable PostingJobVacancy {\n  id bigint pk inc notnull\n  id_posting Posting.id notnull\n  id_company JobCompany.id\n  position varchar(255) notnull\n  location varchar(255) notnull\n  type varchar(255) notnull\n  description text\n  salary text\n}\n\ntable JobCompany {\n  id bigint pk inc notnull\n  name varchar(255) notnull\n  logo varchar(255) notnull\n  description text\n  address text\n}\n\ntable JobDescription {\n  id bigint pk inc notnull\n  id_posting_job_vacancy PostingJobVacancy.id notnull\n  data text\n}\n\ntable JobQualification {\n  id bigint pk inc notnull\n  id_posting_job_vacancy PostingJobVacancy.id notnull\n  data text\n}\n\ntable JobApplicant {\n  id bigint pk inc notnull\n  id_posting_job_vacancy PostingJobVacancy.id notnull\n  id_user User.id notnull\n  resume_url varchar(255)\n  applied_at timestamp\n}\n"
        },
        {
            "filename": "Schema/OTPHashResponse",
            "content": "schema OTPHashResponse {\n  hash string required\n}\n"
        },
        {
            "filename": "Model/Marketplace Cart/Trx",
            "content": "table UserCart {\n  id bigint pk inc notnull\n  id_user User.id notnull\n  id_posting_sell_product PostingSellProduct.id notnull\n  qty int notnull\n  created_at timestamp notnull\n  updated_at timestamp\n}\n\nenum UserTransactionHistoryType {\n  WAITING_FOR_PAYMENT\n  CANCELLED\n  PROCESSING\n  SENDING\n  RECEIVED\n}\n\ntable UserTransaction {\n  id bigint pk inc notnull\n  id_user User.id notnull\n  type UserTransactionHistoryType notnull\n  created_at timestamp notnull\n\n  // data alamat penerima\n  penerima_nama varchar(255) notnull\n  penerima_provinsi varchar(255) notnull\n  penerima_kota_kab varchar(255) notnull\n  penerima_kecamatan varchar(255) notnull\n  penerima_desa_kelurahan varchar(255) notnull\n  penerima_kode_pos varchar(255) notnull\n  penerima_alamat varchar(255) notnull\n\n  // data metode pengiriman\n  pengiriman_metode varchar(255) notnull\n  pengiriman_logo varchar(255) notnull\n  pengiriman_biaya bigint notnull\n\n  // biaya lain-lain\n  biaya_admin bigint notnull default=0\n}\n\ntable UserTransactionItem {\n  id bigint pk inc notnull\n  id_user_transaction UserTransaction.id notnull\n  id_posting_sell_product PostingSellProduct.id notnull\n  qty int notnull\n}\n\ntable UserTransactionHistory {\n  id bigint pk inc notnull\n  type UserTransactionHistoryType notnull\n  id_user_transaction UserTransaction.id notnull\n  notes text\n  created_at timestamp notnull\n}\n"
        },
        {
            "filename": "Schema/jadab",
            "content": "schema DaftarUsaha {\r\n    total number required\r\n    data array table.JadabBussiness required\r\n}\r\n\r\nschema DaftarPayment {\r\n    total number required\r\n    data array table.Payment required\r\n}"
        },
        {
            "filename": "API/Marketplace",
            "content": "api post /checkout {\n  description Daftar produk di keranjang saya\n  headers {\n    authorization string required\n  }\n  body {\n    data schema CheckoutPayload {\n      alamat_penerima schema DataAlamatPenerima {\n        nama_penerima string required\n        provinsi string required\n        kota_kabupaten string required\n        kecamatan string required\n        desa_kelurahan string required\n        kode_pos string required\n        alamat string required\n      } required\n      metode_pengiriman schema DataMetodePengiriman {\n        metode string required\n        logo string required\n        biaya number required\n      } required\n      list_item array schema ItemCheckout {\n        id_product number required\n        qty number required\n      } required\n      biaya_admin number required\n    } required\n  }\n  return array table.UserTransaction required\n}\n\napi get /marketplace {\n  description List Produk Marketplace\n  headers {\n    authorization string required\n  }\n  query {\n    q string\n  }\n  return array table.PostingSellProduct required\n}\n\napi get /marketplace/:id {\n  description Detail Produk\n  headers {\n    authorization string required\n  }\n  path {\n    id number required\n  }\n  return table.PostingSellProduct required\n}\n\napi post /marketplace/:id/add-to-cart {\n  description Tambah produk ke keranjang\n  headers {\n    authorization string required\n  }\n  path {\n    id number required\n  }\n  body {\n    qty number required\n  }\n  return table.UserCart required\n}\n\napi get /my-cart {\n  description Daftar produk di keranjang saya\n  headers {\n    authorization string required\n  }\n  return array table.UserCart required\n}\n\napi get /my-transaction {\n  description List My Transaction\n  headers {\n    authorization string required\n  }\n  query {\n    list_type_csv string\n  }\n  return array table.UserTransaction required\n}\n\napi get /my-transaction/:id {\n  description Detail My Transaction\n  headers {\n    authorization string required\n  }\n  path {\n    id number required\n  }\n  return table.UserTransaction required\n}\n\napi get /product-category {\n  description Ambil daftar kategori produk\n  headers {\n    authorization string required\n  }\n  return array table.ProductCategory required\n}\n"
        },
        {
            "filename": "Model/Jadab",
            "content": "enum JenisKelamin {\n  L\n  P\n}\n\ntable RegistrasiJadab {\n  id bigint pk inc notnull\n  id_user User.id notnull\n\n  // Step 1\n  nama_lengkap varchar(255) notnull\n  nomor_ktp varchar(16) notnull\n  tempat_lahir varchar(255) notnull\n  tanggal_lahir date notnull\n  jenis_kelamin JenisKelamin notnull\n\n  // Step 2\n  id_provinsi Provinsi.id\n  id_kota_kabupaten KotaKabupaten.id\n  id_desa_keluarahan DesaKelurahan.id\n  id_kecamatan Kecamatan.id\n  kodepos varchar(5)\n  rt varchar(2)\n  rw varchar(2)\n\n  // Step 3\n  nomor_telepon varchar(255)\n  email varchar(255)\n  pekerjaan varchar(255)\n  url_foto_ktp varchar(255)\n\n  completed_at timestamp\n  verified_at timestamp\n}\n\nenum kredit {\n  Ya\n  Tidak\n}\n\nenum StatusPengajuanUsaha {\n  Pending\n  Ditolak\n  Disetujui\n}\n\ntable JadabBussiness {\n  id bigint pk inc notnull\n  //user_id User.id notnull\n  nama_usaha  varchar(255) notnull\n  bidang varchar(255) notnull\n  alamat varchar(255) notnull\n  deskripsi varchar(255) notnull\n  foto_usaha_url varchar(255) notnull\n  jumlah_modal decimal notnull\n  rencana varchar(255) notnull\n  estimasi_untung decimal notnull\n  bagi_hasil decimal notnull\n  aset varchar(255) notnull\n  kredit kredit notnull\n  //rekomendasi User.id\n  nomor_rekening varchar(50) notnull\n  pemilik_rekening varchar(255) notnull\n  status StatusPengajuanUsaha notnull\n  approved_at timestamp\n  jatuh_tempo timestamp\n}\n\ntable Payment {\n  id bigint pk inc notnull\n  //bussiness_id JadabBussiness.id notnull\n  bukti_pembayaran_url varchar(255) notnull\n  created_at timestamp notnull\n  verified_at timestamp\n}\n\ntable JatuhTempo {\n  id bigint pk inc notnull\n  //bussiness_id JadabBussiness.id notnull\n  jatuh_tempo timestamp notnull\n}"
        },
        {
            "filename": "API/Messages",
            "content": "api get /latest-messages {\n  description Ambil seluruh daftar pesan terakhir. Gunakan limit/offset.\n  headers {\n    authorization string required\n  }\n  query {\n    limit number\n    offset number\n  }\n  return array schema.MessageWithAttachments required\n}\n\napi get /message/:public_hash {\n  description Ambil percakapan dari pengguna (public_hash). Tambahkan parameter opsional \"ID pesan terakhir\" untuk mengambil hanya beberapa pesan terakhir.\n  headers {\n    authorization string required\n  }\n  path {\n    public_hash string required\n  }\n  query {\n    limit number\n    offset number\n    latest_message_id number\n  }\n  return schema RoomMessagesData {\n    messages array schema.MessageWithAttachments required\n    user table.User required\n  } required\n}\n\napi get /message/:public_hash/find {\n  description Cari pesan berdasarkan query dan filter.\n  headers {\n    authorization string required\n  }\n  query {\n    q string\n  }\n  return array schema.MessageWithAttachments required\n}\n\napi post /message/:public_hash/send {\n  description Kirim pesan ke pengguna (public_hash). Update data pesan terakhir.\n  headers {\n    authorization string required\n  }\n  path {\n    public_hash string required\n  }\n  body {\n    data schema.MessagePayload required\n  }\n  return schema.SendMessageResponse required\n}\n"
        },
        {
            "filename": "Schema/PostingPayload",
            "content": "schema PostingKindVideo {\n  video_url string required\n  caption string\n}\n\nschema PostingKindPlainText {\n  text string required\n}\n\nschema PostingKindImageGIF {\n  image_url string required\n  caption string\n}\n\nschema PostingKindFile {\n  file_url string required\n  caption string\n}\n\nschema PostingKindAudio {\n  audio_url string required\n  caption string\n}\n\nschema PostingKindImageStatic {\n  image_url string required\n  caption string\n}\n\nschema PostingKindSeelingProductImage {\n  image_url string required\n  caption string\n}\n\nschema PostingKindSellingProduct {\n  id_product_category number required\n  name string required\n  price number required\n  description string\n  is_new_product boolean required\n  location string required\n  quantity number required\n  images array schema.PostingKindSeelingProductImage required\n}\n\nschema PostingKindPoolOption {\n  id number\n  option string required\n}\n\nschema PostingKindPool {\n  question string required\n  list_option array schema.PostingKindPoolOption required\n}\n\nschema PostingKindJobVacancyCompany {\n  name string required\n  logo string required\n  description string\n  address string\n}\n\nschema PostingKindJobVacancy {\n  is_create_new_company boolean required\n  id_company number\n  company_data schema.PostingKindJobVacancyCompany\n  position string required\n  location string required\n  type string required\n  description string\n  salary string\n  list_job_description array string required\n  list_job_qualification array string required\n}\n\nschema PostingPayload {\n  type string required\n  data_video schema.PostingKindVideo\n  data_plain_text schema.PostingKindPlainText\n  data_image_gif schema.PostingKindImageGIF\n  data_file schema.PostingKindFile\n  data_audio schema.PostingKindAudio\n  data_image_static schema.PostingKindImageStatic\n  data_selling_product schema.PostingKindSellingProduct\n  data_pool schema.PostingKindPool\n  data_job_vacancy schema.PostingKindJobVacancy\n}\n"
        },
        {
            "filename": "Model/Wilayah",
            "content": "table Provinsi {\n  id bigint pk inc notnull\n  kode varchar\n  nama varchar(255) notnull\n}\n\ntable KotaKabupaten {\n  id bigint pk inc notnull\n  id_provinsi Provinsi.id notnull\n  kode varchar\n  nama varchar(255) notnull\n}\n\ntable Kecamatan {\n  id bigint pk inc notnull\n  id_provinsi Provinsi.id notnull\n  id_kota_kabupaten KotaKabupaten.id notnull\n  kode varchar\n  nama varchar(255) notnull\n}\n\ntable DesaKelurahan {\n  id bigint pk inc notnull\n  id_kecamatan Kecamatan.id notnull\n  id_provinsi Provinsi.id notnull\n  id_kota_kabupaten KotaKabupaten.id notnull\n  kode varchar\n  kodepos varchar\n  nama varchar(255) notnull\n}\n"
        },
        {
            "filename": "API/Posting",
            "content": "api get /posting {\n  description Ambil data posting, gunakan limit & offset\n  headers {\n    authorization string required\n  }\n  query {\n    type string\n    limit number\n    offset number\n  }\n  return schema PostingResult {\n    total number required\n    data array schema.PostingFullData required\n  } required\n}\n\napi post /posting {\n  description Buat posting baru\n  headers {\n    authorization string required\n  }\n  body {\n    data schema.PostingPayload required\n  }\n  return schema.PostingFullData required\n}\n\napi get /posting/:hash {\n  description Ambil data posting spesifik berdasarkan hash\n  headers {\n    authorization string required\n  }\n  path {\n    hash string required\n  }\n  return schema.PostingFullData required\n}\n\napi delete /posting/:hash {\n  description Hapus data posting spesifik berdasarkan hash (soft delete)\n  headers {\n    authorization string required\n  }\n  path {\n    hash string required\n  }\n  return boolean required\n}\n\napi post /posting/:hash/comment {\n  description Berikan komentar pada posting\n  headers {\n    authorization string required\n  }\n  path {\n    hash string required\n  }\n  body {\n    data schema CommentPayload {\n      id_parent_comment number\n      content string required\n    } required\n  }\n  return table.Comment required\n}\n\napi get /posting/:hash/comments {\n  description Ambil data komentar dari posting spesifik berdasarkan hash\n  headers {\n    authorization string required\n  }\n  path {\n    hash string required\n  }\n  query {\n    limit number\n    offset number\n  }\n  return schema PostingCommentsResult {\n    total number required\n    data array table.Comment required\n  } required\n}\n\napi post /posting/:hash/vote {\n  description Berikan up/down vote pada posting\n  headers {\n    authorization string required\n  }\n  path {\n    hash string required\n  }\n  body {\n    type string required\n  }\n  return schema.TotalUpDownVote required\n}\n\napi get /posting/:hash/votes {\n  description Ambil data total vote dari posting spesifik berdasarkan hash\n  headers {\n    authorization string required\n  }\n  path {\n    hash string required\n  }\n  return schema.TotalUpDownVote required\n}\n\napi get /profile/:username/posting {\n  description Ambil data posting pengguna\n  headers {\n    authorization string required\n  }\n  path {\n    username string required\n  }\n  query {\n    limit number\n    offset number\n  }\n  return schema UserPostingResult {\n    total number required\n    data array schema.PostingFullData required\n  } required\n}\n"
        },
        {
            "filename": "Schema/TotalUpDownVote",
            "content": "schema TotalUpDownVote {\n  upvote number required\n  downvote number required\n}\n"
        },
        {
            "filename": "Model/Admin",
            "content": "table Admin {\n  id bigint pk inc notnull\n  user_id User.id notnull\n}"
        },
        {
            "filename": "Schema/SearchFriendResponse",
            "content": "schema SearchFriendResponse {\n  already_friend boolean required\n  user table.User required\n}\n"
        },
        {
            "filename": "Schema/AuthResponse",
            "content": "schema AuthResponse {\r\n  user table.User required\r\n  token string required\r\n}\r\n"
        },
        {
            "filename": "API/Login & Register",
            "content": "api post /login {\n  description Login dengan nomor hp\n  body {\n    data schema LoginPayload {\n      nomor_hp string required\n    } required\n  }\n  return schema.OTPHashResponse required\n}\n\napi post /forgot-password {\n  description Kirim email lupa password jika email ditemukan, abaikan jika email tidak ditemukan.\n  body {\n    email string required\n  }\n  return boolean required\n}\n\napi post /onboarding/accept-snk {\n  description Finalisasi onboarding, setuju SnK\n  headers {\n    authorization string required\n  }\n  body {\n    __nobody string\n  }\n  return boolean required\n}\n\napi post /onboarding/data-diri {\n  description Submit data onboarding data diri\n  headers {\n    authorization string required\n  }\n  body {\n    data schema OnboardingDataDiriPayload {\n      fullname string required\n      email string required\n      tanggal_lahir string required\n      domisili string\n    } required\n  }\n  return boolean required\n}\n\napi post /onboarding/photo-username {\n  description Submit data onboarding photo & username\n  headers {\n    authorization string required\n  }\n  body {\n    data schema OnboardingPhotoUsernamePayload {\n      username string required\n      profile_picture_url string\n    } required\n  }\n  return boolean required\n}\n\napi post /register {\n  description Daftar dengan nomor hp\n  body {\n    data schema RegisterPayload {\n      nomor_hp string required\n    } required\n  }\n  return schema.OTPHashResponse required\n}\n\napi post /reset-password/:token {\n  description Reset password berdasarkan token dengan password baru\n  path {\n    token string required\n  }\n  body {\n    data schema ResetPasswordPayload {\n      password string required\n      confirm_password string required\n    } required\n  }\n  return boolean required\n}\n\napi get /reset-password/:token/is-valid {\n  description Periksa apakah token reset password valid\n  path {\n    token string required\n  }\n  return boolean required\n}\n\napi post /verify-email/:token {\n  description Verifikasi email berdasarkan token pada tautan verifikasi email\n  path {\n    token string required\n  }\n  return schema.AuthResponse required\n}\n\napi post /verify-otp {\n  description Verifikasi kode OTP\n  body {\n    data schema OTPSubmissionPayload {\n      hash string required\n      type string required\n      code string required\n    } required\n  }\n  return schema.AuthResponse required\n}\n"
        },
        {
            "filename": "API/Jadab",
            "content": "api get /daftar-jadab {\r\n  description Lihat status pendaftaran Jadab terakhir\r\n  headers {\r\n    authorization string required\r\n  }\r\n  return table.RegistrasiJadab required\r\n}\r\n\r\napi post /daftar-jadab/1 {\r\n  description Daftar peserta Jadab tahap 1\r\n  headers {\r\n    authorization string required\r\n  }\r\n  body {\r\n    data schema FormPendaftaranJadab1 {\r\n      nama_lengkap string required\r\n      nomor_ktp string required\r\n      tempat_lahir string required\r\n      tanggal_lahir string required\r\n      jenis_kelamin string required\r\n    } required\r\n  }\r\n  return table.RegistrasiJadab required\r\n}\r\n\r\napi post /daftar-jadab/2 {\r\n  description Daftar peserta Jadab tahap 2\r\n  headers {\r\n    authorization string required\r\n  }\r\n  body {\r\n    data schema FormPendaftaranJadab2 {\r\n      id_provinsi number required\r\n      id_kota_kabupaten number required\r\n      id_kecamatan number required\r\n      id_desa_keluarahan number required\r\n      kodepos string required\r\n      rt string required\r\n      rw string required\r\n    } required\r\n  }\r\n  return table.RegistrasiJadab required\r\n}\r\n\r\napi post /daftar-jadab/3 {\r\n  description Daftar peserta Jadab tahap 3\r\n  headers {\r\n    authorization string required\r\n  }\r\n  body {\r\n    data schema FormPendaftaranJadab3 {\r\n      nomor_telepon string required\r\n      email string required\r\n      pekerjaan string required\r\n      url_foto_ktp string required\r\n    } required\r\n  }\r\n  return table.RegistrasiJadab required\r\n}\r\n\r\napi post /jadab/daftar-usaha {\r\n  headers {\r\n    authorization string required\r\n  }\r\n  body {\r\n    data schema FormPendaftaranUsaha {\r\n      nama_usaha string required\r\n      bidang string required\r\n      alamat string required\r\n      deskripsi string required\r\n      foto_usaha_url string required\r\n      jumlah_modal number required\r\n      rencana string required\r\n      estimasi_untung number required\r\n      bagi_hasil number required\r\n      aset string required\r\n      kredit string required\r\n      rekomendasi number\r\n      nomor_rekening string required\r\n      pemilik_rekening string required\r\n    } required\r\n  }\r\n  return table.JadabBussiness required\r\n}\r\n\r\napi get /jadab/daftar-usaha {\r\n  headers {\r\n    authorization string required\r\n  }\r\n  query {\r\n    page string required\r\n  }\r\n  return schema.DaftarUsaha required\r\n}\r\n\r\napi get /jadab/detail-usaha/:id {\r\n  headers {\r\n    authorization string required\r\n  }\r\n  path {\r\n    id number required\r\n  }\r\n  return table.JadabBussiness required\r\n}\r\n\r\napi post /jadab/bayar-bagi-hasil {\r\n  headers {\r\n      authorization string required\r\n  }\r\n  body {\r\n    bussiness_id number required\r\n    bukti_pembayaran_url string required\r\n  }\r\n  return table.Payment required\r\n}\r\n\r\napi get /jadab/bagi-hasil/:id {\r\n  headers {\r\n    authorization string required\r\n  }\r\n  path {\r\n    bussiness_id number required\r\n  }\r\n  return schema.DaftarPayment required\r\n}\r\n\r\n// api get /jadab/daftar-usaha/:id {\r\n//   headers {\r\n//     authorization string required\r\n//   }\r\n//   path {\r\n//     id number required\r\n//   }\r\n//   return table.JadabBussiness required\r\n// }\r\n"
        },
        {
            "filename": "API/User",
            "content": "api get /my-friends {\r\n  description Get my friends list\r\n  headers {\r\n    authorization string required\r\n  }\r\n  query {\r\n    limit number\r\n    offset number\r\n    q string\r\n  }\r\n  return schema MyFriendResult {\r\n    total number required\r\n    data array table.User required\r\n  } required\r\n}\r\n\r\napi get /profile {\r\n  description Ambil data profile berdasarkan token jwt \"wi\"\r\n  headers {\r\n    authorization string required\r\n  }\r\n  return schema ProfileData {\r\n    user table.User required\r\n    verified boolean required\r\n    total_unread_notification number required\r\n    total_unread_message number required\r\n  } required\r\n}\r\n\r\napi get /profile/:username {\r\n  description Ambil detail data profil pengguna berdasarkan username\r\n  headers {\r\n    authorization string required\r\n  }\r\n  path {\r\n    username string required\r\n  }\r\n  return table.User required\r\n}\r\n\r\napi post /profile/update {\r\n  description Ubah data profil\r\n  headers {\r\n    authorization string required\r\n  }\r\n  body {\r\n    data schema UpdateProfilePayload {\r\n      profile_picture_url string\r\n      fullname string required\r\n      email string required\r\n      tanggal_lahir string required\r\n      domisili string\r\n    } required\r\n  }\r\n  return table.User required\r\n}\r\n\r\napi get /search {\r\n  description Search user by query\r\n  headers {\r\n    authorization string required\r\n  }\r\n  query {\r\n    q string required\r\n  }\r\n  return array schema.SearchFriendResponse required\r\n}\r\n\r\napi get /search/by-id-user {\r\n  description Cari pengguna berdasarkan ID User\r\n  headers {\r\n    authorization string required\r\n  }\r\n  query {\r\n    username string required\r\n  }\r\n  return schema.SearchFriendResponse required\r\n}\r\n\r\napi get /search/by-phone-number {\r\n  description Cari pengguna berdasarkan Nomor HP\r\n  headers {\r\n    authorization string required\r\n  }\r\n  query {\r\n    phone_number string required\r\n  }\r\n  return schema.SearchFriendResponse required\r\n}\r\n\r\napi post /user/:public_id/add-friend {\r\n  description Tambahkan pengguna sebagai teman\r\n  headers {\r\n    authorization string required\r\n  }\r\n  path {\r\n    public_id string required\r\n  }\r\n  body {\r\n    __nobody string\r\n  }\r\n  return schema.SearchFriendResponse required\r\n}\r\n\r\napi get /username/:username/check {\r\n  description Cek ketersediaan username\r\n  headers {\r\n    authorization string required\r\n  }\r\n  path {\r\n    username string required\r\n  }\r\n  return boolean required\r\n}\r\n"
        },
        {
            "filename": "API/Admin",
            "content": "api post /admin/login {\r\n  body {\r\n    data schema AdminPayload {\r\n      nomor_hp string required\r\n    } required\r\n  }\r\n  return schema.OTPHashResponse required\r\n}\r\n\r\n\r\napi get /admin/daftar-usaha {\r\n  headers {\r\n    authorization string required\r\n  }\r\n  return schema.DaftarUsaha required\r\n}\r\n\r\napi get /admin/detail-usaha/:id {\r\n  headers {\r\n    authorization string required\r\n  }\r\n  path {\r\n    id number required\r\n  }\r\n  return table.JadabBussiness required\r\n}\r\n\r\napi post /admin/pengajuan-modal/approved/:id {\r\n  headers {\r\n    authorization string required\r\n  }\r\n  path {\r\n    id number required\r\n  }\r\n  return table.JadabBussiness required\r\n}\r\n\r\napi post /admin/pengajuan-modal/reject/:id {\r\n  headers {\r\n    authorization string required\r\n  }\r\n  path {\r\n    id number required\r\n  }\r\n  return table.JadabBussiness required\r\n}"
        },
        {
            "filename": "Schema/Common Posting Relation",
            "content": "schema PostingFullData {\n  posting table.Posting required\n  list_file array table.PostingFile required\n  list_sell_product array schema.PostingProductWithImages required\n  list_plain_text array table.PostingPlainText required\n  list_image_static array table.PostingImageStatic required\n  list_image_gif array table.PostingImageGIF required\n  list_audio array table.PostingAudio required\n  list_video array table.PostingVideo required\n  list_pool array schema.PostingPoolWithOptions required\n  list_job array schema.PostingJobWithDetails required\n\n  list_vote array table.Vote required\n  list_comment array table.Comment required\n}\n\nschema PostingVotesComments {\n  posting table.Posting required\n  list_vote array table.Vote required\n  list_comment array table.Comment required\n}\n\nschema PostingProductWithImages {\n  posting_product table.PostingSellProduct required\n  list_images array table.ProductImage required\n}\n\nschema PostingPoolWithOptions {\n  posting_pool table.PostingPool required\n  list_options array table.PostingPoolOption required\n}\n\nschema PostingJobWithDetails {\n  posting_job table.PostingJobVacancy required\n  list_descriptions array table.JobDescription required\n  list_qualifications array table.JobQualification required\n}\n"
        },
        {
            "filename": "Model/Community",
            "content": "table Community {\n  id bigint pk inc notnull\n  id_creator User.id notnull\n  public_identifier varchar(255) notnull\n  total_member bigint notnull default=0\n  name varchar(255) notnull\n  logo varchar(255) notnull\n  created_at timestamp notnull\n  deleted_at timestamp\n}\n\ntable CommunityTopic {\n  id bigint pk inc notnull\n  id_community Community.id notnull\n  name varchar(255) notnull\n  icon_url varchar(255) notnull\n  color varchar(50) notnull\n  created_at timestamp notnull\n  deleted_at timestamp\n}\n\ntable CommunityMember {\n  id bigint pk inc notnull\n  id_community Community.id notnull\n  id_user User.id notnull\n  is_admin boolean notnull default=false\n  approved boolean notnull default=false\n  join_request_at timestamp notnull\n  join_approved_at timestamp\n  leave_at timestamp\n}\n\ntable CommunityTopicMember {\n  id bigint pk inc notnull\n  id_community_topic CommunityTopic.id notnull\n  id_community_member CommunityMember.id notnull\n  created_at timestamp notnull\n  deleted_at timestamp\n}\n"
        },
        {
            "filename": "Model/User",
            "content": "table User {\n  id bigint pk inc notnull\n  name varchar(255) notnull\n  email varchar(255) notnull\n  username varchar(255)\n  public_hash varchar(255) notnull\n  phone_number varchar(255)\n  email_verification_token varchar(255)\n  email_forgot_password_token varchar(255)\n  email_verified_at timestamp\n  created_at timestamp notnull\n  date_of_birth date\n  address text\n  last_socket_id varchar(255)\n  fcm_token varchar(255)\n  profile_picture_url varchar(255)\n  profile_banner_url varchar(255)\n  accept_snk_at timestamp\n\n  // nomor rekening untuk marketplace\n  mp_bank_name varchar(255)\n  mp_bank_acc_name varchar(255)\n  mp_bank_acc_number varchar(255)\n  mp_bank_acc_branch varchar(255)\n}\n\ntable FriendList {\n  id bigint pk inc notnull\n  id_user User.id notnull\n  id_user_requested User.id notnull\n  created_at timestamp notnull\n}\n\ntable BlockList {\n  id bigint pk inc notnull\n  id_user User.id notnull\n  id_user_blocked User.id notnull\n  created_at timestamp notnull\n\n  // kolom ini digunakan ketika user sebelumnya\n  // telah memblokir pengguna\n  // Jika pengguna memblokir lagi user yang\n  // telah diunblock, maka baris baru ditambahkan\n  // riwayat pemblokiran yang lama tetap ada\n  unblocked_at timestamp\n}\n\nenum OTPType {\n  LOGIN\n  REGISTER\n  OTHER\n}\n\ntable OTP {\n  id bigint pk inc notnull\n  id_user User.id notnull\n  hash varchar(100) notnull\n  code varchar(6) notnull\n  type OTPType notnull\n  verified_at timestamp\n  sent_at timestamp notnull\n}\n"
        },
        {
            "filename": "This File",
            "content": ""
        }
    ]
    );
    // const result: SAResult = await parse('./sample.adf');
    console.log(result);
    // console.log(JSONSpecificationToADF(result));
  } catch (parse_error: any) {
    console.error(parse_error)
  }
};
main(process.argv[2]);


