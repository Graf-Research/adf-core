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

## Library

```bash
npm install --save @graf-research/adf-core
```

### Fungsi Utama

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

