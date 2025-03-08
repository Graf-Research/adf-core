import { SAResult } from "../sem-analysis";

export namespace Import {
  export interface Import {
    type: 'import'
    source: string
    result: SAResult
    filename?: string
  }
}
