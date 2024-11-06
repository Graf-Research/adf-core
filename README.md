<div align="center">
  <a href="http://typeorm.io/">
    <img src="https://adf-lang.com/logo.png" height="120">
  </a>
  <br>
  <br>
	<a href="https://badge.fury.io/js/@graf-research%2Fadf-core">
	    <img src="https://badge.fury.io/js/@graf-research%2Fadf-core.svg" alt="npm version" height="18" />
    </a>
  <br>
  <br>
</div>

DSL (Domain Specific Language) ADF didesain untuk mendokumentasikan sistem/program dan men-generate kode sesuai spesifikasi ADF. Kode ADF mendokumentasikan desain model data dan mekanisme komunikasi antar program dalam sebuah sistem. Lihat [Spesifikasi Bahasa ADF](https://adf-lang.com/docs/syntax) untuk panduan menulis desain ADF.

**Generator Kode**

Spesifikasi ADF memiliki informasi minimal untuk desain sebuah sistem berbasis data. Informasi pada ADF dapat digunakan untuk men-generate kode program langsung/template kode program. Generator kode yang ada saat ini:

- [adf-codegen-api-nodejs](https://github.com/Graf-Research/adf-codegen-api-nodejs) Template Backend REST API dengan ExpressJS+TypeORM
- [adf-codegen-schema-typescript](https://github.com/Graf-Research/adf-codegen-schema-typescript) Schema data dalam bentuk interface Typescript
- [adf-codegen-model-typescript](https://github.com/Graf-Research/adf-codegen-model-typescript) Model data dalam bentuk interface Typescript
- [adf-codegen-model-typeorm](https://github.com/Graf-Research/adf-codegen-model-typeorm) Model data dalam bentuk kelas [TypeORM](https://github.com/typeorm/typeorm)

**Todo List Generator Kode**:
1. Generator API Tester (seperti Swagger, Postman, Apiary, dll).
2. HTTP Client secara umum untuk segala jenis framework frontend web.
3. React `useAPI` HTTP Client, mirip poin nomor 2, namun untuk framework react dengan fitur hook.
4. HTTP Client untuk bahasa pemrograman lain, kasus pemakaiannya untuk koneksi host-to-host.
5. dll

## Library

```bash
npm install --save @graf-research/adf-core
```

### Fungsi

#### parse(uri: string)

Menerima masukan berupa path (absolute/relative) ke file `*.adf` atau url file ADF.

```typescript
async function parse(uri: string): Promise<SAResult>
```

#### parseString(code: string)

Menerima masukan berupa kode ADF dengan format string.

```typescript
async function parseString(code: string): Promise<SAResult>
```

### Contoh Penggunaan

```typescript
import { parse, SAResult } from '@graf-research/adf-core';

async function main() {
  const adf_url = 'https://gitlab.graf.run/api/v4/projects/rio%2Fblueprint-collection/repository/files/contoh-marketplace.adf/raw';
  const result: SAResult = await parse(adf_url);
  console.log(result)
}

main();
```

## ADF Core

ADF Core berisi program parser file desain ADF yang berisi format [Spesifikasi Bahasa ADF](https://adf-lang.com/docs/syntax) menjadi spesifikasi JSON. Proses parsing ADF terdiri dari tiga tahap:

- Lexer
- Parser
- Analisis Semantik

### Lexer

ADF menggunakan [no-context/moo](https://github.com/no-context/moo) sebagai lexer. Daftar token lexer dapat dilihat di file [ast/grammar/lexer.js](ast/grammar/lexer.js).

### Parser

ADF menggunakan grammar dan parser [nearley.js](https://nearley.js.org/). Grammar ADF dapat dilihat di file [ast/grammar/adf-lang.ne](ast/grammar/adf-lang.ne). Parser ADF menghasilkan bentuk JSON sementara representasi AST (abstract syntax tree) dengan skema/jenis data berikut:

- `AST_Import`
- `AST_Model`
- `AST_Flow`
- `AST_Schema`
- `AST_API`

### Analisis Semantik

Data JSON hasil parser dianalisis memastikan seluruh sintaks sesuai aturan ADF. Proses analisis semantik dilakukan pada:

- **API** memastikan method, path, paths param, query, headers, body, dan return value pada AST valid dan jenis data yang digunakan ada pada skema, tabel, atau enum.
- **Schema** memastikan jenis data skema valid, referensi ke table, enum, atau skema lain valid.
- **Model** memastikan item enum valid, kolom tabel sesuai semantik yang seharusnya.
- **Import** mengimpor data dari file atau url lain.
- **Flow** *&lt;pending&gt;*

Analisis semantik menghasilkan spesifikasi JSON dengan format berikut:

```typescript
export interface SAResult {
  list_enum: Model.Enum[]
  list_table: Model.Table[]
  list_flow: Flow.Flow[]
  list_schema: Schema.Schema[]
  list_api: API.API[]
}
```

`SAResult` merupakan keluaran akhir dari parser (lexer, parser, semantic analysis).

