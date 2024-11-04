import moo from 'moo';

export namespace AST_Import {
  export interface Import {
    type: 'import'
    source: moo.Token
  }
}