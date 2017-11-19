import nearley from 'nearley';

import innerCompile from './compile';
import { ParserRules, ParserStart } from 'nearley/lib/nearley-language-bootstrapped';
import generate from 'nearley/lib/generate.js';
import lint from 'nearley/lib/lint.js';

function stream() {
  const out = [];

  return {
    write(str) {
      out.push(str);
    },
    dump() {
      return out;
    }
  };
}

function annotatePositions(rules) {
  return rules.map((rule) =>
    new nearley.Rule(rule.name, rule.symbols, rule.postprocess && ((data, ref, reject) => {
      const orig = rule.postprocess(data, ref, reject);

      if (typeof orig === 'object' && !orig.slice) {
        orig.pos = ref;
      }

      return orig;
    }))
  );
}

function getExports(source) {
  const module = { // eslint-disable-line no-shadow
    exports: ''
  };

  eval(source); // eslint-disable-line no-eval

  return module.exports;
}

export default function compile(grammar) {
  const parser = new nearley.Parser(annotatePositions(ParserRules), ParserStart);

  const errors = stream();
  let compiledGrammar = '';
  const positions = {};

  try {
    parser.feed(grammar);
    if (parser.results[0]) {
      const c = innerCompile(parser.results[0], {
        rangeCallback(rangeName, start, end) {
          positions[rangeName] = [start, end];
        }
      });

      lint(c, {
        out: errors
      });

      compiledGrammar = generate(c, 'grammar');
    }
  } catch (err) {
    errors.write(err);
  }

  return {
    errors: errors.dump(),
    positions,
    compiledGrammar: getExports(compiledGrammar)
  };
}
