import { SAResult } from "./semantic-analysis/sem-analysis"

export interface FileItem {
  filename: string
  content: string
  result?: SAResult
}
