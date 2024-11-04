import moo from 'moo';

export namespace AST_Flow {
  export interface GeneralFlow {
    id: moo.Token
    comments: moo.Token
  }

  export interface Terminal extends GeneralFlow {
    type: 'terminal'
  }

  export interface Notes extends GeneralFlow {
    type: 'notes'
  }

  export interface Input extends GeneralFlow {
    type: 'input'
  }

  export interface Conditional extends GeneralFlow {
    type: 'conditional'
  }

  export namespace P {
    export interface GeneralProcess extends GeneralFlow {
      type: 'process'
    }

    export interface APIProcess extends GeneralFlow {
      type: 'api'
      path: moo.Token
      method: moo.Token
    }

    export interface CrudAPIProcess extends GeneralFlow {
      type: 'api-crud'
      prefix_path: moo.Token
    }
  }

  export type Process = P.GeneralProcess | P.APIProcess | P.CrudAPIProcess;

  export type Item = Terminal | Notes | Input | Process | Conditional;

  export interface Flow {
    extends: boolean
    type: 'flow'
    name: moo.Token
    items: Item[]
  }
}
