export namespace Flow {
  export interface GeneralFlow {
    id: number
    description?: string
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
    yes_flow_id?: number
    no_flow_id: number
  }

  export namespace P {
    export interface GeneralProcess extends GeneralFlow {
      type: 'process'
    }

    export type APIMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

    export interface APIProcess extends GeneralFlow {
      type: 'api'
      path: string
      method: APIMethod
    }

    export interface CrudAPIProcess extends GeneralFlow {
      type: 'api-crud'
      prefix_path: string
    }
  }

  export type Process = P.GeneralProcess | P.APIProcess | P.CrudAPIProcess;

  export type Item = Terminal | Notes | Input | Process | Conditional;

  export interface Flow {
    extends: boolean
    type: 'flow'
    name: string
    items: Item[]
    filename?: string
  }
}
