module.exports = {
  flow_comments        : { match: /(?<=\d+ +conditional |\d+ +input |\d+ +terminal |\d+ +process |\d+ +output |\d+ +api\-crud +[\w\/\:\-]+|\d+ +api +\w+ +[\w\/\:\-]+).+(?! \{)/, lineBreaks: false },
  whitespace           : /[ \t]+/,
  number               : /\-?[0-9]+/,
  double_quoted_string : /"(?:\\["\\]|[^\n"\\])*"/,
  single_quoted_string : /'(?:\\['\\]|[^\n'\\])*'/,
  variable_acccess     : /[A-Za-z\_]\w*\.[A-Za-z\_]\w*/,
  variable             : /[A-Za-z\_][\w\-]*/,
  api_path             : /(?:(?:\/[\w\-\:]+)+|\/)/,
  lparen               : '(',
  rparen               : ')',
  lbrack               : '{',
  rbrack               : '}',
  eq                   : '=',
  dot                  : '.',
  comma                : ',',
  newline              : { match: /\n|\r\n/, lineBreaks: true },
  anyelse              : /./
}
