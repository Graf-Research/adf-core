import moo from 'moo';
import nearley from 'nearley';
import { AST_API } from './types/api';
import { AST_Flow } from './types/flow';
import { AST_Model } from './types/model';
import { AST_Schema } from './types/schema';
import { AST_Import } from './types/import';

export type AST_Item = AST_API.API | AST_Flow.Flow | AST_Model.Table | AST_Model.Enum | AST_Schema.Schema | AST_Import.Import;

export function ast(code: string): AST_Item[] {
  const grammar = require('../ast/grammar/adf-lang.js');
  const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
  
  // const lexer = moo.compile(require('../ast/grammar/lexer.js'));
  // console.log(Array.from(lexer.reset(code)).map(x => `${x.type} => ${x.text.trim()}`));

  console.log(code);
  parser.feed(code.split('\n').map(x => {
    if (x.trim().startsWith('//')) {
      return '';
    }
    return x;
  }).join('\n'));
  if (parser.results.length > 1) {
    throw new Error(`Syntax ambiguity`);
  }
  // console.log(parser.results[0][0].items[4])
  return parser.results[0];
}
