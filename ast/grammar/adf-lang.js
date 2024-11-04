// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const moo = require('moo');
const lexer = moo.compile(require('../grammar/lexer.js'));
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "main$ebnf$1", "symbols": []},
    {"name": "main$ebnf$1", "symbols": ["main$ebnf$1", "item"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "main", "symbols": ["main$ebnf$1", "__o"], "postprocess": id},
    {"name": "item", "symbols": ["__o", "import"], "postprocess": 
        ([_0, _1]) => _1
                },
    {"name": "item", "symbols": ["__o", "enum"], "postprocess": 
        ([_0, _1]) => _1
                },
    {"name": "item", "symbols": ["__o", "table"], "postprocess": 
        ([_0, _1]) => _1
                },
    {"name": "item", "symbols": ["__o", "flow"], "postprocess": 
        ([_0, _1]) => _1
                },
    {"name": "item", "symbols": ["__o", "schema"], "postprocess": 
        ([_0, _1]) => _1
                },
    {"name": "item", "symbols": ["__o", "api"], "postprocess": 
        ([_0, _1]) => _1
                },
    {"name": "import", "symbols": [{"literal":"import"}, "__r", (lexer.has("single_quoted_string") ? {type: "single_quoted_string"} : single_quoted_string)], "postprocess": 
        ([_0, _1, _2]) => ({
          type: 'import',
          source: _2
        })
                  },
    {"name": "import", "symbols": [{"literal":"import"}, "__r", (lexer.has("double_quoted_string") ? {type: "double_quoted_string"} : double_quoted_string)], "postprocess": 
        ([_0, _1, _2]) => ({
          type: 'import',
          source: _2
        })
                  },
    {"name": "enum$ebnf$1", "symbols": ["_extends_indicator"], "postprocess": id},
    {"name": "enum$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "enum$ebnf$2", "symbols": []},
    {"name": "enum$ebnf$2", "symbols": ["enum$ebnf$2", "enum_item"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "enum", "symbols": ["enum$ebnf$1", {"literal":"enum"}, "__r", (lexer.has("variable") ? {type: "variable"} : variable), "__r", (lexer.has("lbrack") ? {type: "lbrack"} : lbrack), "enum$ebnf$2", "__o", (lexer.has("rbrack") ? {type: "rbrack"} : rbrack)], "postprocess": 
        ([_extends, _1, _2, _3, _4, _5, _6]) => ({
          extends: _extends || false,
          type: 'enum',
          name: _3,
          items: _6
        })
        },
    {"name": "enum_item$ebnf$1", "symbols": []},
    {"name": "enum_item$ebnf$1", "symbols": ["enum_item$ebnf$1", (lexer.has("whitespace") ? {type: "whitespace"} : whitespace)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "enum_item", "symbols": ["enum_item$ebnf$1", (lexer.has("newline") ? {type: "newline"} : newline), "__o", (lexer.has("variable") ? {type: "variable"} : variable)], "postprocess": 
        ([_0, _1, _2, _3]) => _3
        },
    {"name": "table$ebnf$1", "symbols": ["_extends_indicator"], "postprocess": id},
    {"name": "table$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "table$ebnf$2", "symbols": []},
    {"name": "table$ebnf$2", "symbols": ["table$ebnf$2", "table_item"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "table", "symbols": ["table$ebnf$1", {"literal":"table"}, "__r", (lexer.has("variable") ? {type: "variable"} : variable), "__r", (lexer.has("lbrack") ? {type: "lbrack"} : lbrack), "table$ebnf$2", "__o", (lexer.has("rbrack") ? {type: "rbrack"} : rbrack)], "postprocess": 
        ([_extends, _1, _2, _3, _4, _5, _6]) => ({
          extends: _extends || false,
          type: 'table',
          name: _3,
          items: _6
        })
        },
    {"name": "table_item$ebnf$1", "symbols": []},
    {"name": "table_item$ebnf$1", "symbols": ["table_item$ebnf$1", (lexer.has("whitespace") ? {type: "whitespace"} : whitespace)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "table_item$ebnf$2", "symbols": []},
    {"name": "table_item$ebnf$2", "symbols": ["table_item$ebnf$2", "table_item_attribute"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "table_item", "symbols": ["table_item$ebnf$1", (lexer.has("newline") ? {type: "newline"} : newline), "__o", (lexer.has("variable") ? {type: "variable"} : variable), (lexer.has("whitespace") ? {type: "whitespace"} : whitespace), (lexer.has("variable") ? {type: "variable"} : variable), "table_item$ebnf$2"], "postprocess": 
        ([_0, _1, _2, _3, _4, _5, _6]) => ({
          name: _3,
          type: {
            kind: 'no-param',
            type: _5
          },
          attributes: _6
        })
                      },
    {"name": "table_item$ebnf$3", "symbols": []},
    {"name": "table_item$ebnf$3", "symbols": ["table_item$ebnf$3", (lexer.has("whitespace") ? {type: "whitespace"} : whitespace)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "table_item$ebnf$4", "symbols": []},
    {"name": "table_item$ebnf$4", "symbols": ["table_item$ebnf$4", "table_item_attribute"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "table_item", "symbols": ["table_item$ebnf$3", (lexer.has("newline") ? {type: "newline"} : newline), "__o", (lexer.has("variable") ? {type: "variable"} : variable), (lexer.has("whitespace") ? {type: "whitespace"} : whitespace), "table_item_one_param_type", "table_item$ebnf$4"], "postprocess": 
        ([_0, _1, _2, _3, _4, _5, _6]) => ({
          name: _3,
          type: _5,
          attributes: _6
        })
                      },
    {"name": "table_item$ebnf$5", "symbols": []},
    {"name": "table_item$ebnf$5", "symbols": ["table_item$ebnf$5", (lexer.has("whitespace") ? {type: "whitespace"} : whitespace)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "table_item$ebnf$6", "symbols": []},
    {"name": "table_item$ebnf$6", "symbols": ["table_item$ebnf$6", "table_item_attribute"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "table_item", "symbols": ["table_item$ebnf$5", (lexer.has("newline") ? {type: "newline"} : newline), "__o", (lexer.has("variable") ? {type: "variable"} : variable), (lexer.has("whitespace") ? {type: "whitespace"} : whitespace), "table_item_two_param_type", "table_item$ebnf$6"], "postprocess": 
        ([_0, _1, _2, _3, _4, _5, _6]) => ({
          name: _3,
          type: _5,
          attributes: _6
        })
                      },
    {"name": "table_item$ebnf$7", "symbols": []},
    {"name": "table_item$ebnf$7", "symbols": ["table_item$ebnf$7", (lexer.has("whitespace") ? {type: "whitespace"} : whitespace)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "table_item$ebnf$8", "symbols": []},
    {"name": "table_item$ebnf$8", "symbols": ["table_item$ebnf$8", "table_item_attribute"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "table_item", "symbols": ["table_item$ebnf$7", (lexer.has("newline") ? {type: "newline"} : newline), "__o", (lexer.has("variable") ? {type: "variable"} : variable), (lexer.has("whitespace") ? {type: "whitespace"} : whitespace), (lexer.has("variable_acccess") ? {type: "variable_acccess"} : variable_acccess), "table_item$ebnf$8"], "postprocess": 
        ([_0, _1, _2, _3, _4, _5, _6]) => ({
          name: _3,
          type: {
            kind: 'relation',
            name: _5
          },
          attributes: _6
        })
                      },
    {"name": "table_item_attribute", "symbols": [(lexer.has("whitespace") ? {type: "whitespace"} : whitespace), "table_item_attribute_default_value"], "postprocess": 
        ([_0, _1]) => _1
                                },
    {"name": "table_item_attribute", "symbols": [(lexer.has("whitespace") ? {type: "whitespace"} : whitespace), "table_item_attribute_general"], "postprocess": 
        ([_0, _1]) => _1
                                },
    {"name": "table_item_attribute_general", "symbols": [{"literal":"notnull"}], "postprocess": 
        id => ({
          type: 'null',
          value: false
        })
                                        },
    {"name": "table_item_attribute_general", "symbols": [{"literal":"null"}], "postprocess": 
        id => ({
          type: 'null',
          value: true
        })
                                        },
    {"name": "table_item_attribute_general", "symbols": [{"literal":"autoincrement"}], "postprocess": 
        id => ({
          type: 'autoincrement',
          value: true
        })
                                        },
    {"name": "table_item_attribute_general", "symbols": [{"literal":"inc"}], "postprocess": 
        id => ({
          type: 'autoincrement',
          value: true
        })
                                        },
    {"name": "table_item_attribute_general", "symbols": [{"literal":"increment"}], "postprocess": 
        id => ({
          type: 'autoincrement',
          value: true
        })
                                        },
    {"name": "table_item_attribute_general", "symbols": [{"literal":"primary-key"}], "postprocess": 
        id => ({
          type: 'primary-key',
          value: true
        })
                                        },
    {"name": "table_item_attribute_general", "symbols": [{"literal":"pk"}], "postprocess": 
        id => ({
          type: 'primary-key',
          value: true
        })
                                        },
    {"name": "table_item_attribute_general", "symbols": [{"literal":"unique"}], "postprocess": 
        id => ({
          type: 'unique',
          value: true
        })
                                        },
    {"name": "table_item_attribute_general", "symbols": [{"literal":"uniq"}], "postprocess": 
        id => ({
          type: 'unique',
          value: true
        })
                                        },
    {"name": "table_item_attribute_default_value", "symbols": [{"literal":"default"}, (lexer.has("eq") ? {type: "eq"} : eq), (lexer.has("double_quoted_string") ? {type: "double_quoted_string"} : double_quoted_string)], "postprocess": 
        ([_0, _1, _2]) => ({
          type: 'default',
          value: {
            type: 'string',
            name: _2
          }
        })
                                              },
    {"name": "table_item_attribute_default_value", "symbols": [{"literal":"default"}, (lexer.has("eq") ? {type: "eq"} : eq), (lexer.has("single_quoted_string") ? {type: "single_quoted_string"} : single_quoted_string)], "postprocess": 
        ([_0, _1, _2]) => ({
          type: 'default',
          value: {
            type: 'string',
            name: _2
          }
        })
                                              },
    {"name": "table_item_attribute_default_value", "symbols": [{"literal":"default"}, (lexer.has("eq") ? {type: "eq"} : eq), (lexer.has("number") ? {type: "number"} : number)], "postprocess": 
        ([_0, _1, _2]) => ({
          type: 'default',
          value: {
            type: 'number',
            name: _2
          }
        })
                                              },
    {"name": "table_item_attribute_default_value", "symbols": [{"literal":"default"}, (lexer.has("eq") ? {type: "eq"} : eq), (lexer.has("variable_acccess") ? {type: "variable_acccess"} : variable_acccess)], "postprocess": 
        ([_0, _1, _2]) => ({
          type: 'default',
          value: {
            type: 'enum',
            name: _2
          }
        })
                                              },
    {"name": "table_item_attribute_default_value", "symbols": [{"literal":"default"}, (lexer.has("eq") ? {type: "eq"} : eq), {"literal":"true"}], "postprocess": 
        ([_0, _1, _2]) => ({
          type: 'default',
          value: {
            type: 'boolean',
            value: true
          }
        })
                                              },
    {"name": "table_item_attribute_default_value", "symbols": [{"literal":"default"}, (lexer.has("eq") ? {type: "eq"} : eq), {"literal":"false"}], "postprocess": 
        ([_0, _1, _2]) => ({
          type: 'default',
          value: {
            type: 'boolean',
            value: false
          }
        })
                                              },
    {"name": "table_item_one_param_type$ebnf$1", "symbols": [(lexer.has("whitespace") ? {type: "whitespace"} : whitespace)], "postprocess": id},
    {"name": "table_item_one_param_type$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "table_item_one_param_type$ebnf$2", "symbols": [(lexer.has("whitespace") ? {type: "whitespace"} : whitespace)], "postprocess": id},
    {"name": "table_item_one_param_type$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "table_item_one_param_type", "symbols": [(lexer.has("variable") ? {type: "variable"} : variable), (lexer.has("lparen") ? {type: "lparen"} : lparen), "table_item_one_param_type$ebnf$1", (lexer.has("number") ? {type: "number"} : number), "table_item_one_param_type$ebnf$2", (lexer.has("rparen") ? {type: "rparen"} : rparen)], "postprocess": 
        ([_0, _1, _2, _3, _4, _5, _6, _7]) => ({
          kind: 'single-param',
          type: _0,
          p1: _3,
        })
        },
    {"name": "table_item_two_param_type$ebnf$1", "symbols": [(lexer.has("whitespace") ? {type: "whitespace"} : whitespace)], "postprocess": id},
    {"name": "table_item_two_param_type$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "table_item_two_param_type$ebnf$2", "symbols": [(lexer.has("whitespace") ? {type: "whitespace"} : whitespace)], "postprocess": id},
    {"name": "table_item_two_param_type$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "table_item_two_param_type$ebnf$3", "symbols": [(lexer.has("whitespace") ? {type: "whitespace"} : whitespace)], "postprocess": id},
    {"name": "table_item_two_param_type$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "table_item_two_param_type$ebnf$4", "symbols": [(lexer.has("whitespace") ? {type: "whitespace"} : whitespace)], "postprocess": id},
    {"name": "table_item_two_param_type$ebnf$4", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "table_item_two_param_type", "symbols": [(lexer.has("variable") ? {type: "variable"} : variable), (lexer.has("lparen") ? {type: "lparen"} : lparen), "table_item_two_param_type$ebnf$1", (lexer.has("number") ? {type: "number"} : number), "table_item_two_param_type$ebnf$2", (lexer.has("comma") ? {type: "comma"} : comma), "table_item_two_param_type$ebnf$3", (lexer.has("number") ? {type: "number"} : number), "table_item_two_param_type$ebnf$4", (lexer.has("rparen") ? {type: "rparen"} : rparen)], "postprocess": 
        ([_0, _1, _2, _3, _4, _5, _6, _7]) => ({
          kind: 'two-param',
          type: _0,
          p1: _3,
          p2: _7,
        })
        },
    {"name": "flow$ebnf$1", "symbols": ["_extends_indicator"], "postprocess": id},
    {"name": "flow$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "flow$ebnf$2", "symbols": []},
    {"name": "flow$ebnf$2", "symbols": ["flow$ebnf$2", "flow_item"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "flow", "symbols": ["flow$ebnf$1", {"literal":"flow"}, "__r", (lexer.has("variable") ? {type: "variable"} : variable), "__r", (lexer.has("lbrack") ? {type: "lbrack"} : lbrack), "flow$ebnf$2", "__o", (lexer.has("rbrack") ? {type: "rbrack"} : rbrack)], "postprocess": 
        ([_extends, _1, _2, _3, _4, _5, _6]) => ({
          extends: _extends || false,
          type: 'flow',
          name: _3,
          items: _6
        })
        },
    {"name": "flow_item$ebnf$1", "symbols": []},
    {"name": "flow_item$ebnf$1", "symbols": ["flow_item$ebnf$1", (lexer.has("whitespace") ? {type: "whitespace"} : whitespace)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "flow_item", "symbols": ["flow_item$ebnf$1", (lexer.has("newline") ? {type: "newline"} : newline), "__o", (lexer.has("number") ? {type: "number"} : number), (lexer.has("whitespace") ? {type: "whitespace"} : whitespace), {"literal":"terminal"}, (lexer.has("whitespace") ? {type: "whitespace"} : whitespace), (lexer.has("flow_comments") ? {type: "flow_comments"} : flow_comments)], "postprocess": 
        ([_0, _1, _2, _3, _4, _5, _6, _7]) => ({
          id: _3,
          type: 'terminal',
          comments: _7
        })
                      },
    {"name": "flow_item$ebnf$2", "symbols": []},
    {"name": "flow_item$ebnf$2", "symbols": ["flow_item$ebnf$2", (lexer.has("whitespace") ? {type: "whitespace"} : whitespace)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "flow_item", "symbols": ["flow_item$ebnf$2", (lexer.has("newline") ? {type: "newline"} : newline), "__o", (lexer.has("number") ? {type: "number"} : number), (lexer.has("whitespace") ? {type: "whitespace"} : whitespace), {"literal":"input"}, (lexer.has("whitespace") ? {type: "whitespace"} : whitespace), (lexer.has("flow_comments") ? {type: "flow_comments"} : flow_comments)], "postprocess": 
        ([_0, _1, _2, _3, _4, _5, _6, _7]) => ({
          id: _3,
          type: 'input',
          comments: _7
        })
                      },
    {"name": "flow_item$ebnf$3", "symbols": []},
    {"name": "flow_item$ebnf$3", "symbols": ["flow_item$ebnf$3", (lexer.has("whitespace") ? {type: "whitespace"} : whitespace)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "flow_item", "symbols": ["flow_item$ebnf$3", (lexer.has("newline") ? {type: "newline"} : newline), "__o", (lexer.has("number") ? {type: "number"} : number), (lexer.has("whitespace") ? {type: "whitespace"} : whitespace), {"literal":"output"}, (lexer.has("whitespace") ? {type: "whitespace"} : whitespace), (lexer.has("flow_comments") ? {type: "flow_comments"} : flow_comments)], "postprocess": 
        ([_0, _1, _2, _3, _4, _5, _6, _7]) => ({
          id: _3,
          type: 'output',
          comments: _7
        })
                      },
    {"name": "flow_item$ebnf$4", "symbols": []},
    {"name": "flow_item$ebnf$4", "symbols": ["flow_item$ebnf$4", (lexer.has("whitespace") ? {type: "whitespace"} : whitespace)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "flow_item", "symbols": ["flow_item$ebnf$4", (lexer.has("newline") ? {type: "newline"} : newline), "__o", (lexer.has("number") ? {type: "number"} : number), (lexer.has("whitespace") ? {type: "whitespace"} : whitespace), {"literal":"process"}, (lexer.has("whitespace") ? {type: "whitespace"} : whitespace), (lexer.has("flow_comments") ? {type: "flow_comments"} : flow_comments)], "postprocess": 
        ([_0, _1, _2, _3, _4, _5, _6, _7]) => ({
          id: _3,
          type: 'process',
          comments: _7
        })
                      },
    {"name": "flow_item$ebnf$5", "symbols": []},
    {"name": "flow_item$ebnf$5", "symbols": ["flow_item$ebnf$5", (lexer.has("whitespace") ? {type: "whitespace"} : whitespace)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "flow_item", "symbols": ["flow_item$ebnf$5", (lexer.has("newline") ? {type: "newline"} : newline), "__o", (lexer.has("number") ? {type: "number"} : number), (lexer.has("whitespace") ? {type: "whitespace"} : whitespace), {"literal":"notes"}, (lexer.has("whitespace") ? {type: "whitespace"} : whitespace), (lexer.has("flow_comments") ? {type: "flow_comments"} : flow_comments)], "postprocess": 
        ([_0, _1, _2, _3, _4, _5, _6, _7]) => ({
          id: _3,
          type: 'notes',
          comments: _7
        })
                      },
    {"name": "flow_item$ebnf$6", "symbols": []},
    {"name": "flow_item$ebnf$6", "symbols": ["flow_item$ebnf$6", (lexer.has("whitespace") ? {type: "whitespace"} : whitespace)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "flow_item", "symbols": ["flow_item$ebnf$6", (lexer.has("newline") ? {type: "newline"} : newline), "__o", (lexer.has("number") ? {type: "number"} : number), (lexer.has("whitespace") ? {type: "whitespace"} : whitespace), {"literal":"conditional"}, (lexer.has("whitespace") ? {type: "whitespace"} : whitespace), (lexer.has("flow_comments") ? {type: "flow_comments"} : flow_comments)], "postprocess": 
        ([_0, _1, _2, _3, _4, _5, _6, _7]) => ({
          id: _3,
          type: 'conditional',
          comments: _7
        })
                      },
    {"name": "flow_item$ebnf$7", "symbols": []},
    {"name": "flow_item$ebnf$7", "symbols": ["flow_item$ebnf$7", (lexer.has("whitespace") ? {type: "whitespace"} : whitespace)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "flow_item", "symbols": ["flow_item$ebnf$7", (lexer.has("newline") ? {type: "newline"} : newline), "__o", (lexer.has("number") ? {type: "number"} : number), (lexer.has("whitespace") ? {type: "whitespace"} : whitespace), {"literal":"api-crud"}, (lexer.has("whitespace") ? {type: "whitespace"} : whitespace), (lexer.has("api_path") ? {type: "api_path"} : api_path), (lexer.has("flow_comments") ? {type: "flow_comments"} : flow_comments)], "postprocess": 
        ([_0, _1, _2, _3, _4, _5, _6, _7, _8]) => ({
          id: _3,
          type: 'api-crud',
          prefix_path: _7,
          comments: _8
        })
                      },
    {"name": "flow_item$ebnf$8", "symbols": []},
    {"name": "flow_item$ebnf$8", "symbols": ["flow_item$ebnf$8", (lexer.has("whitespace") ? {type: "whitespace"} : whitespace)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "flow_item", "symbols": ["flow_item$ebnf$8", (lexer.has("newline") ? {type: "newline"} : newline), "__o", (lexer.has("number") ? {type: "number"} : number), (lexer.has("whitespace") ? {type: "whitespace"} : whitespace), {"literal":"api"}, (lexer.has("whitespace") ? {type: "whitespace"} : whitespace), (lexer.has("variable") ? {type: "variable"} : variable), (lexer.has("whitespace") ? {type: "whitespace"} : whitespace), (lexer.has("api_path") ? {type: "api_path"} : api_path), (lexer.has("flow_comments") ? {type: "flow_comments"} : flow_comments)], "postprocess": 
        ([_0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10]) => ({
          id: _3,
          type: 'api',
          method: _7,
          path: _9,
          comments: _10
        })
                      },
    {"name": "schema$ebnf$1", "symbols": ["_extends_indicator"], "postprocess": id},
    {"name": "schema$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "schema$ebnf$2", "symbols": []},
    {"name": "schema$ebnf$2", "symbols": ["schema$ebnf$2", "schema_item"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "schema", "symbols": ["schema$ebnf$1", {"literal":"schema"}, "__r", (lexer.has("variable") ? {type: "variable"} : variable), "__r", (lexer.has("lbrack") ? {type: "lbrack"} : lbrack), "schema$ebnf$2", "__o", (lexer.has("rbrack") ? {type: "rbrack"} : rbrack)], "postprocess": 
        ([_extends, _1, _2, _3, _4, _5, _6]) => ({
          extends: _extends || false,
          type: 'schema',
          name: _3,
          items: _6
        })
        },
    {"name": "schema_item", "symbols": ["native_var_declaration"], "postprocess": id},
    {"name": "schema_item$ebnf$1", "symbols": []},
    {"name": "schema_item$ebnf$1", "symbols": ["schema_item$ebnf$1", (lexer.has("whitespace") ? {type: "whitespace"} : whitespace)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "schema_item$ebnf$2", "symbols": ["schema_array_indicator"], "postprocess": id},
    {"name": "schema_item$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "schema_item$ebnf$3", "symbols": ["schema_attribute"], "postprocess": id},
    {"name": "schema_item$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "schema_item", "symbols": ["schema_item$ebnf$1", (lexer.has("newline") ? {type: "newline"} : newline), "__o", (lexer.has("variable") ? {type: "variable"} : variable), "schema_item$ebnf$2", (lexer.has("whitespace") ? {type: "whitespace"} : whitespace), (lexer.has("variable_acccess") ? {type: "variable_acccess"} : variable_acccess), "schema_item$ebnf$3"], "postprocess": 
        ([_0, _1, _2, _3, array, _5, _6, required]) => ({
          key: _3,
          type: {
            type: 'table-enum-schema',
            name: _6
          },
          array: array || false,
          required: required || false
        })
                      },
    {"name": "schema_item$ebnf$4", "symbols": []},
    {"name": "schema_item$ebnf$4", "symbols": ["schema_item$ebnf$4", (lexer.has("whitespace") ? {type: "whitespace"} : whitespace)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "schema_item$ebnf$5", "symbols": ["schema_array_indicator"], "postprocess": id},
    {"name": "schema_item$ebnf$5", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "schema_item$ebnf$6", "symbols": ["schema_attribute"], "postprocess": id},
    {"name": "schema_item$ebnf$6", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "schema_item", "symbols": ["schema_item$ebnf$4", (lexer.has("newline") ? {type: "newline"} : newline), "__o", (lexer.has("variable") ? {type: "variable"} : variable), "schema_item$ebnf$5", (lexer.has("whitespace") ? {type: "whitespace"} : whitespace), "schema", "schema_item$ebnf$6"], "postprocess": 
        ([_0, _1, _2, _3, array, _5, _6, required]) => ({
        key: _3,
        type: {
            type: 'new-schema',
            schema: _6
          },
          array: array || false,
          required: required || false
        })
                      },
    {"name": "schema_attribute", "symbols": [(lexer.has("whitespace") ? {type: "whitespace"} : whitespace), {"literal":"required"}], "postprocess": 
        ([_0, required]) => Boolean(required)
        },
    {"name": "schema_array_indicator", "symbols": [(lexer.has("whitespace") ? {type: "whitespace"} : whitespace), {"literal":"array"}], "postprocess": 
        ([_0, array]) => Boolean(array)
        },
    {"name": "api$ebnf$1", "symbols": ["_extends_indicator"], "postprocess": id},
    {"name": "api$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "api$ebnf$2", "symbols": []},
    {"name": "api$ebnf$2", "symbols": ["api$ebnf$2", "api_item"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "api", "symbols": ["api$ebnf$1", {"literal":"api"}, "__r", (lexer.has("variable") ? {type: "variable"} : variable), "__r", (lexer.has("api_path") ? {type: "api_path"} : api_path), "__r", (lexer.has("lbrack") ? {type: "lbrack"} : lbrack), "api$ebnf$2", "__o", (lexer.has("rbrack") ? {type: "rbrack"} : rbrack)], "postprocess": 
        ([_extends, _1, _2, _3, _4, _5, _6, _7, _8]) => ({
          extends: _extends || false,
          type: 'api',
          method: _3,
          path: _5,
          items: _8
        })
        },
    {"name": "api_item$ebnf$1", "symbols": []},
    {"name": "api_item$ebnf$1", "symbols": ["api_item$ebnf$1", (lexer.has("whitespace") ? {type: "whitespace"} : whitespace)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "api_item", "symbols": ["api_item$ebnf$1", (lexer.has("newline") ? {type: "newline"} : newline), "__o", {"literal":"description"}, (lexer.has("whitespace") ? {type: "whitespace"} : whitespace), "everything"], "postprocess": 
        ([_0, _1, _2, _3, _4, _5]) => ({
          key: 'description',
          data: _5[0].join('')
        })
                    },
    {"name": "api_item$ebnf$2", "symbols": []},
    {"name": "api_item$ebnf$2", "symbols": ["api_item$ebnf$2", (lexer.has("whitespace") ? {type: "whitespace"} : whitespace)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "api_item$ebnf$3", "symbols": []},
    {"name": "api_item$ebnf$3", "symbols": ["api_item$ebnf$3", "native_var_declaration"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "api_item", "symbols": ["api_item$ebnf$2", (lexer.has("newline") ? {type: "newline"} : newline), "__o", {"literal":"headers"}, "__r", (lexer.has("lbrack") ? {type: "lbrack"} : lbrack), "api_item$ebnf$3", "__o", (lexer.has("rbrack") ? {type: "rbrack"} : rbrack)], "postprocess": 
        ([_0, _1, _2, _3, _4, _5, _6]) => ({
          key: 'headers',
          data: _6
        })
                    },
    {"name": "api_item$ebnf$4", "symbols": []},
    {"name": "api_item$ebnf$4", "symbols": ["api_item$ebnf$4", (lexer.has("whitespace") ? {type: "whitespace"} : whitespace)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "api_item$ebnf$5", "symbols": []},
    {"name": "api_item$ebnf$5", "symbols": ["api_item$ebnf$5", "native_var_declaration"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "api_item", "symbols": ["api_item$ebnf$4", (lexer.has("newline") ? {type: "newline"} : newline), "__o", {"literal":"path"}, "__r", (lexer.has("lbrack") ? {type: "lbrack"} : lbrack), "api_item$ebnf$5", "__o", (lexer.has("rbrack") ? {type: "rbrack"} : rbrack)], "postprocess": 
        ([_0, _1, _2, _3, _4, _5, _6]) => ({
          key: 'path',
          data: _6
        })
                    },
    {"name": "api_item$ebnf$6", "symbols": []},
    {"name": "api_item$ebnf$6", "symbols": ["api_item$ebnf$6", (lexer.has("whitespace") ? {type: "whitespace"} : whitespace)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "api_item$ebnf$7", "symbols": []},
    {"name": "api_item$ebnf$7", "symbols": ["api_item$ebnf$7", "native_var_declaration"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "api_item", "symbols": ["api_item$ebnf$6", (lexer.has("newline") ? {type: "newline"} : newline), "__o", {"literal":"query"}, "__r", (lexer.has("lbrack") ? {type: "lbrack"} : lbrack), "api_item$ebnf$7", "__o", (lexer.has("rbrack") ? {type: "rbrack"} : rbrack)], "postprocess": 
        ([_0, _1, _2, _3, _4, _5, _6]) => ({
          key: 'query',
          data: _6
        })
                    },
    {"name": "api_item$ebnf$8", "symbols": []},
    {"name": "api_item$ebnf$8", "symbols": ["api_item$ebnf$8", (lexer.has("whitespace") ? {type: "whitespace"} : whitespace)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "api_item$ebnf$9", "symbols": []},
    {"name": "api_item$ebnf$9", "symbols": ["api_item$ebnf$9", "schema_item"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "api_item", "symbols": ["api_item$ebnf$8", (lexer.has("newline") ? {type: "newline"} : newline), "__o", {"literal":"body"}, "__r", (lexer.has("lbrack") ? {type: "lbrack"} : lbrack), "api_item$ebnf$9", "__o", (lexer.has("rbrack") ? {type: "rbrack"} : rbrack)], "postprocess": 
        ([_0, _1, _2, _3, _4, _5, _6]) => ({
          key: 'body',
          data: _6
        })
                    },
    {"name": "api_item$ebnf$10", "symbols": []},
    {"name": "api_item$ebnf$10", "symbols": ["api_item$ebnf$10", (lexer.has("whitespace") ? {type: "whitespace"} : whitespace)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "api_item$ebnf$11", "symbols": ["schema_array_indicator"], "postprocess": id},
    {"name": "api_item$ebnf$11", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "api_item$ebnf$12", "symbols": ["schema_attribute"], "postprocess": id},
    {"name": "api_item$ebnf$12", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "api_item", "symbols": ["api_item$ebnf$10", (lexer.has("newline") ? {type: "newline"} : newline), "__o", {"literal":"return"}, "api_item$ebnf$11", (lexer.has("whitespace") ? {type: "whitespace"} : whitespace), (lexer.has("variable") ? {type: "variable"} : variable), "api_item$ebnf$12"], "postprocess": 
        ([_0, _1, _2, _3, array, _5, _6, _7]) => ({
          key: 'return',
          type: {
            type: 'native',
            native_type: _6
          },
          array: array || false,
          required: _7 || false
        })
                    },
    {"name": "api_item$ebnf$13", "symbols": []},
    {"name": "api_item$ebnf$13", "symbols": ["api_item$ebnf$13", (lexer.has("whitespace") ? {type: "whitespace"} : whitespace)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "api_item$ebnf$14", "symbols": ["schema_array_indicator"], "postprocess": id},
    {"name": "api_item$ebnf$14", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "api_item$ebnf$15", "symbols": ["schema_attribute"], "postprocess": id},
    {"name": "api_item$ebnf$15", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "api_item", "symbols": ["api_item$ebnf$13", (lexer.has("newline") ? {type: "newline"} : newline), "__o", {"literal":"return"}, "api_item$ebnf$14", (lexer.has("whitespace") ? {type: "whitespace"} : whitespace), (lexer.has("variable_acccess") ? {type: "variable_acccess"} : variable_acccess), "api_item$ebnf$15"], "postprocess": 
        ([_0, _1, _2, _3, array, _5, _6, _7]) => ({
          key: 'return',
          type: {
            type: 'table-enum-schema',
            name: _6
          },
          array: array || false,
          required: _7 || false
        })
                    },
    {"name": "api_item$ebnf$16", "symbols": []},
    {"name": "api_item$ebnf$16", "symbols": ["api_item$ebnf$16", (lexer.has("whitespace") ? {type: "whitespace"} : whitespace)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "api_item$ebnf$17", "symbols": ["schema_array_indicator"], "postprocess": id},
    {"name": "api_item$ebnf$17", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "api_item$ebnf$18", "symbols": ["schema_attribute"], "postprocess": id},
    {"name": "api_item$ebnf$18", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "api_item", "symbols": ["api_item$ebnf$16", (lexer.has("newline") ? {type: "newline"} : newline), "__o", {"literal":"return"}, "api_item$ebnf$17", (lexer.has("whitespace") ? {type: "whitespace"} : whitespace), "schema", "api_item$ebnf$18"], "postprocess": 
        ([_0, _1, _2, _3, array, _5, _6, _7]) => ({
          key: 'return',
          type: {
            type: 'new-schema',
            schema: _6
          },
          array: array || false,
          required: _7 || false
        })
                    },
    {"name": "native_var_declaration$ebnf$1", "symbols": []},
    {"name": "native_var_declaration$ebnf$1", "symbols": ["native_var_declaration$ebnf$1", (lexer.has("whitespace") ? {type: "whitespace"} : whitespace)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "native_var_declaration$ebnf$2", "symbols": ["schema_array_indicator"], "postprocess": id},
    {"name": "native_var_declaration$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "native_var_declaration$ebnf$3", "symbols": ["schema_attribute"], "postprocess": id},
    {"name": "native_var_declaration$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "native_var_declaration", "symbols": ["native_var_declaration$ebnf$1", (lexer.has("newline") ? {type: "newline"} : newline), "__o", (lexer.has("variable") ? {type: "variable"} : variable), "native_var_declaration$ebnf$2", (lexer.has("whitespace") ? {type: "whitespace"} : whitespace), (lexer.has("variable") ? {type: "variable"} : variable), "native_var_declaration$ebnf$3"], "postprocess": 
        ([_0, _1, _2, _3, array, _5, _6, required]) => ({
          key: _3,
          type: {
            type: 'native',
            native_type: _6
          },
          array: array || false,
          required: required || false
        })
        },
    {"name": "__o$ebnf$1", "symbols": []},
    {"name": "__o$ebnf$1", "symbols": ["__o$ebnf$1", "__"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "__o", "symbols": ["__o$ebnf$1"]},
    {"name": "__r$ebnf$1", "symbols": ["__"]},
    {"name": "__r$ebnf$1", "symbols": ["__r$ebnf$1", "__"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "__r", "symbols": ["__r$ebnf$1"]},
    {"name": "__", "symbols": [(lexer.has("whitespace") ? {type: "whitespace"} : whitespace)]},
    {"name": "__", "symbols": [(lexer.has("newline") ? {type: "newline"} : newline)]},
    {"name": "_extends_indicator", "symbols": [{"literal":"extends"}, (lexer.has("whitespace") ? {type: "whitespace"} : whitespace)], "postprocess": 
        ([_extends, _1]) => Boolean(_extends)
        },
    {"name": "everything$ebnf$1", "symbols": []},
    {"name": "everything$ebnf$1", "symbols": ["everything$ebnf$1", /./], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "everything", "symbols": ["everything$ebnf$1"]}
]
  , ParserStart: "main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
