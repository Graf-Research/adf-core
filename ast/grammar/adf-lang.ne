@{%
const moo = require('./moo');
const lexer = moo.compile(require('../grammar/lexer.js'));
%}

@lexer lexer

main -> item:* __o {% id %}

item -> __o import {%
          ([_0, _1]) => _1
        %}
      | __o enum {%
          ([_0, _1]) => _1
        %}
      | __o table {%
          ([_0, _1]) => _1
        %}
      | __o flow {%
          ([_0, _1]) => _1
        %}
      | __o schema {%
          ([_0, _1]) => _1
        %}
      | __o api {%
          ([_0, _1]) => _1
        %}

import -> "import" __r %single_quoted_string {%
            ([_0, _1, _2]) => ({
              type: 'import',
              source: _2
            })
          %}
        | "import" __r %double_quoted_string {%
            ([_0, _1, _2]) => ({
              type: 'import',
              source: _2
            })
          %}

enum -> _extends_indicator:? "enum" __r %variable __r %lbrack enum_item:* __o %rbrack {%
  ([_extends, _1, _2, _3, _4, _5, _6]) => ({
    extends: _extends || false,
    type: 'enum',
    name: _3,
    items: _6
  })
%}

enum_item -> %whitespace:* %newline __o %variable {%
  ([_0, _1, _2, _3]) => _3
%}

table -> _extends_indicator:? "table" __r %variable __r %lbrack table_item:* __o %rbrack {%
  ([_extends, _1, _2, _3, _4, _5, _6]) => ({
    extends: _extends || false,
    type: 'table',
    name: _3,
    items: _6
  })
%}

table_item -> %whitespace:* %newline __o %variable %whitespace %variable table_item_attribute:* {%
                ([_0, _1, _2, _3, _4, _5, _6]) => ({
                  name: _3,
                  type: {
                    kind: 'no-param',
                    type: _5
                  },
                  attributes: _6
                })
              %}
            | %whitespace:* %newline __o %variable %whitespace table_item_one_param_type table_item_attribute:* {%
                ([_0, _1, _2, _3, _4, _5, _6]) => ({
                  name: _3,
                  type: _5,
                  attributes: _6
                })
              %}
            | %whitespace:* %newline __o %variable %whitespace table_item_two_param_type table_item_attribute:* {%
                ([_0, _1, _2, _3, _4, _5, _6]) => ({
                  name: _3,
                  type: _5,
                  attributes: _6
                })
              %}
            | %whitespace:* %newline __o %variable %whitespace %variable_acccess table_item_attribute:* {%
                ([_0, _1, _2, _3, _4, _5, _6]) => ({
                  name: _3,
                  type: {
                    kind: 'relation',
                    name: _5
                  },
                  attributes: _6
                })
              %}

table_item_attribute -> %whitespace table_item_attribute_default_value {%
                          ([_0, _1]) => _1
                        %}
                      | %whitespace table_item_attribute_general {%
                          ([_0, _1]) => _1
                        %}

table_item_attribute_general -> "notnull" {%
                                  id => ({
                                    type: 'null',
                                    value: false
                                  })
                                %}
                              | "null" {%
                                  id => ({
                                    type: 'null',
                                    value: true
                                  })
                                %}
                              | "autoincrement" {%
                                  id => ({
                                    type: 'autoincrement',
                                    value: true
                                  })
                                %}
                              | "inc" {%
                                  id => ({
                                    type: 'autoincrement',
                                    value: true
                                  })
                                %}
                              | "increment" {%
                                  id => ({
                                    type: 'autoincrement',
                                    value: true
                                  })
                                %}
                              | "primary-key" {%
                                  id => ({
                                    type: 'primary-key',
                                    value: true
                                  })
                                %}
                              | "pk" {%
                                  id => ({
                                    type: 'primary-key',
                                    value: true
                                  })
                                %}
                              | "unique" {%
                                  id => ({
                                    type: 'unique',
                                    value: true
                                  })
                                %}
                              | "uniq" {%
                                  id => ({
                                    type: 'unique',
                                    value: true
                                  })
                                %}

table_item_attribute_default_value -> "default" %eq %double_quoted_string {%
                                        ([_0, _1, _2]) => ({
                                          type: 'default',
                                          value: {
                                            type: 'string',
                                            name: _2
                                          }
                                        })
                                      %}
                                    | "default" %eq %single_quoted_string {%
                                        ([_0, _1, _2]) => ({
                                          type: 'default',
                                          value: {
                                            type: 'string',
                                            name: _2
                                          }
                                        })
                                      %}
                                    | "default" %eq %number {%
                                        ([_0, _1, _2]) => ({
                                          type: 'default',
                                          value: {
                                            type: 'number',
                                            name: _2
                                          }
                                        })
                                      %}
                                    | "default" %eq %variable_acccess {%
                                        ([_0, _1, _2]) => ({
                                          type: 'default',
                                          value: {
                                            type: 'enum',
                                            name: _2
                                          }
                                        })
                                      %}
                                    | "default" %eq "true" {%
                                        ([_0, _1, _2]) => ({
                                          type: 'default',
                                          value: {
                                            type: 'boolean',
                                            value: true
                                          }
                                        })
                                      %}
                                    | "default" %eq "false" {%
                                        ([_0, _1, _2]) => ({
                                          type: 'default',
                                          value: {
                                            type: 'boolean',
                                            value: false
                                          }
                                        })
                                      %}

table_item_one_param_type -> %variable %lparen %whitespace:? %number %whitespace:? %rparen {%
  ([_0, _1, _2, _3, _4, _5, _6, _7]) => ({
    kind: 'single-param',
    type: _0,
    p1: _3,
  })
%}

table_item_two_param_type -> %variable %lparen %whitespace:? %number %whitespace:? %comma %whitespace:? %number %whitespace:? %rparen {%
  ([_0, _1, _2, _3, _4, _5, _6, _7]) => ({
    kind: 'two-param',
    type: _0,
    p1: _3,
    p2: _7,
  })
%}

flow -> _extends_indicator:? "flow" __r %variable __r %lbrack flow_item:* __o %rbrack {%
  ([_extends, _1, _2, _3, _4, _5, _6]) => ({
    extends: _extends || false,
    type: 'flow',
    name: _3,
    items: _6
  })
%}

flow_item -> %whitespace:* %newline __o %number %whitespace "terminal" %whitespace %flow_comments {%
                ([_0, _1, _2, _3, _4, _5, _6, _7]) => ({
                  id: _3,
                  type: 'terminal',
                  comments: _7
                })
              %}
            | %whitespace:* %newline __o %number %whitespace "input" %whitespace %flow_comments {%
                ([_0, _1, _2, _3, _4, _5, _6, _7]) => ({
                  id: _3,
                  type: 'input',
                  comments: _7
                })
              %}
            | %whitespace:* %newline __o %number %whitespace "output" %whitespace %flow_comments {%
                ([_0, _1, _2, _3, _4, _5, _6, _7]) => ({
                  id: _3,
                  type: 'output',
                  comments: _7
                })
              %}
            | %whitespace:* %newline __o %number %whitespace "process" %whitespace %flow_comments {%
                ([_0, _1, _2, _3, _4, _5, _6, _7]) => ({
                  id: _3,
                  type: 'process',
                  comments: _7
                })
              %}
            | %whitespace:* %newline __o %number %whitespace "notes" %whitespace %flow_comments {%
                ([_0, _1, _2, _3, _4, _5, _6, _7]) => ({
                  id: _3,
                  type: 'notes',
                  comments: _7
                })
              %}
            | %whitespace:* %newline __o %number %whitespace "conditional" %whitespace %flow_comments {%
                ([_0, _1, _2, _3, _4, _5, _6, _7]) => ({
                  id: _3,
                  type: 'conditional',
                  comments: _7
                })
              %}
            | %whitespace:* %newline __o %number %whitespace "api-crud" %whitespace %api_path %flow_comments {%
                ([_0, _1, _2, _3, _4, _5, _6, _7, _8]) => ({
                  id: _3,
                  type: 'api-crud',
                  prefix_path: _7,
                  comments: _8
                })
              %}
            | %whitespace:* %newline __o %number %whitespace "api" %whitespace %variable %whitespace %api_path %flow_comments {%
                ([_0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10]) => ({
                  id: _3,
                  type: 'api',
                  method: _7,
                  path: _9,
                  comments: _10
                })
              %}

schema -> _extends_indicator:? "schema" __r %variable __r %lbrack schema_item:* __o %rbrack {%
  ([_extends, _1, _2, _3, _4, _5, _6]) => ({
    extends: _extends || false,
    type: 'schema',
    name: _3,
    items: _6
  })
%}

schema_item -> native_var_declaration {% id %}
              | %whitespace:* %newline __o %variable schema_array_indicator:? %whitespace %variable_acccess schema_attribute:? {%
                ([_0, _1, _2, _3, array, _5, _6, required]) => ({
                  key: _3,
                  type: {
                    type: 'table-enum-schema',
                    name: _6
                  },
                  array: array || false,
                  required: required || false
                })
              %}
              | %whitespace:* %newline __o %variable schema_array_indicator:? %whitespace schema schema_attribute:? {%
                ([_0, _1, _2, _3, array, _5, _6, required]) => ({
                key: _3,
                type: {
                    type: 'new-schema',
                    schema: _6
                  },
                  array: array || false,
                  required: required || false
                })
              %}

schema_attribute -> %whitespace "required" {%
  ([_0, required]) => Boolean(required)
%}

schema_array_indicator -> %whitespace "array" {%
  ([_0, array]) => Boolean(array)
%}

api -> _extends_indicator:? "api" __r %variable __r %api_path __r %lbrack api_item:* __o %rbrack {%
  ([_extends, _1, _2, _3, _4, _5, _6, _7, _8]) => ({
    extends: _extends || false,
    type: 'api',
    method: _3,
    path: _5,
    items: _8
  })
%}

api_item -> %whitespace:* %newline __o "description" %whitespace everything {%
              ([_0, _1, _2, _3, _4, _5]) => ({
                key: 'description',
                data: _5[0].join('')
              })
            %}
          | %whitespace:* %newline __o "headers" __r %lbrack native_var_declaration:* __o %rbrack {%
              ([_0, _1, _2, _3, _4, _5, _6]) => ({
                key: 'headers',
                data: _6
              })
            %}
          | %whitespace:* %newline __o "path" __r %lbrack native_var_declaration:* __o %rbrack {%
              ([_0, _1, _2, _3, _4, _5, _6]) => ({
                key: 'path',
                data: _6
              })
            %}
          | %whitespace:* %newline __o "query" __r %lbrack native_var_declaration:* __o %rbrack {%
              ([_0, _1, _2, _3, _4, _5, _6]) => ({
                key: 'query',
                data: _6
              })
            %}
          | %whitespace:* %newline __o "body" __r %lbrack schema_item:* __o %rbrack {%
              ([_0, _1, _2, _3, _4, _5, _6]) => ({
                key: 'body',
                data: _6
              })
            %}
          | %whitespace:* %newline __o "return" schema_array_indicator:? %whitespace %variable schema_attribute:? {%
              ([_0, _1, _2, _3, array, _5, _6, _7]) => ({
                key: 'return',
                type: {
                  type: 'native',
                  native_type: _6
                },
                array: array || false,
                required: _7 || false
              })
            %}
          | %whitespace:* %newline __o "return" schema_array_indicator:? %whitespace %variable_acccess schema_attribute:? {%
              ([_0, _1, _2, _3, array, _5, _6, _7]) => ({
                key: 'return',
                type: {
                  type: 'table-enum-schema',
                  name: _6
                },
                array: array || false,
                required: _7 || false
              })
            %}
          | %whitespace:* %newline __o "return" schema_array_indicator:? %whitespace schema schema_attribute:? {%
              ([_0, _1, _2, _3, array, _5, _6, _7]) => ({
                key: 'return',
                type: {
                  type: 'new-schema',
                  schema: _6
                },
                array: array || false,
                required: _7 || false
              })
            %}

native_var_declaration -> %whitespace:* %newline __o %variable schema_array_indicator:? %whitespace %variable schema_attribute:? {%
  ([_0, _1, _2, _3, array, _5, _6, required]) => ({
    key: _3,
    type: {
      type: 'native',
      native_type: _6
    },
    array: array || false,
    required: required || false
  })
%}

__o -> __:*
__r -> __:+

__ -> %whitespace | %newline

_extends_indicator -> "extends" %whitespace {%
  ([_extends, _1]) => Boolean(_extends)
%}

everything -> .:*
