import nearley from 'nearley';
import { ParserRules, ParserStart } from 'nearley/lib/nearley-language-bootstrapped';

export default function compile(structure, opts) {
  const unique = uniquer();

  if (!opts.alreadycompiled) {
    opts.alreadycompiled = [];
  }

  const result = {
    rules: [],
    body: [], // @directives list
    config: {}, // @config value
    macros: {},
    start: ''
  };

  for (let i = 0; i < structure.length; i++) {
    const productionRule = structure[i];

    markRange(productionRule.name, productionRule.pos, productionRule.name && productionRule.name.length);

    if (productionRule.body) {
      // This isn't a rule, it's an @directive.
      if (!opts.nojs) {
        result.body.push(productionRule.body);
      }
    } else if (productionRule.include) {
      // Include file
      var path;

      if (!productionRule.builtin) {
        path = require('path').resolve(
          opts.file ? require('path').dirname(opts.file) : process.cwd(),
          productionRule.include
        );
      } else {
        path = require('path').resolve(
          __dirname,
          '../builtin/',
          productionRule.include
        );
      }
      if (opts.alreadycompiled.indexOf(path) === -1) {
        // console.log('alreadycompiled', path)
        opts.alreadycompiled.push(path);
        if (path === '/builtin/postprocessors.ne') {
          var f = require('nearley/builtin/postprocessors.ne');
        } else if (path === '/builtin/whitespace.ne') {
          var f = require('nearley/builtin/whitespace.ne');
        } else if (path === '/builtin/string.ne') {
          var f = require('nearley/builtin/string.ne');
        } else if (path === '/builtin/number.ne') {
          var f = require('nearley/builtin/number.ne');
        } else if (path === '/builtin/cow.ne') {
          var f = require('nearley/builtin/cow.ne');
        }

        // console.log(f)
        // f = require('fs').readFileSync(path).toString();
        // var parserGrammar = new require('nearley/lib/nearley-language-bootstrapped');
        const parser = new nearley.Parser(ParserRules, ParserStart);

        parser.feed(f);
        var c = Compile(parser.results[0], {
          path,
          __proto__: opts
        });

        // require('nearley/lib/lint.js')(c, {out: process.stderr});

        result.rules = result.rules.concat(c.rules);
        result.body = result.body.concat(c.body);
        Object.keys(c.config).forEach((k) => {
          result.config[k] = c.config[k];
        });
        Object.keys(c.macros).forEach((k) => {
          result.macros[k] = c.macros[k];
        });
      }
    } else if (productionRule.macro) {
      result.macros[productionRule.macro] = {
        args: productionRule.args,
        exprs: productionRule.exprs
      };
    } else if (productionRule.config) {
      // This isn't a rule, it's an @config.
      result.config[productionRule.config] = productionRule.value;
    } else {
      produceRules(productionRule.name, productionRule.rules, {});
      if (!result.start) {
        result.start = productionRule.name;
      }
    }
  }

  return result;

  function markRange(name, start, length) {
    // console.log(name, [start, start + length])
    if (opts.rangeCallback) {
      opts.rangeCallback(name, start, start + length);
    }
  }

  function produceRules(name, rules, env) {
    for (let i = 0; i < rules.length; i++) {
      const rule = buildRule(name, rules[i], env);

      if (opts.nojs) {
        rule.postprocess = null;
      }
      result.rules.push(rule);
    }
  }

  function buildRule(ruleName, rule, env) {
    const tokens = [];

    for (let i = 0; i < rule.tokens.length; i++) {
      const token = buildToken(ruleName, rule.tokens[i], env);

      if (token !== null) {
        tokens.push(token);
      }
    }

    return new nearley.Rule(
      ruleName,
      tokens,
      rule.postprocess
    );
  }

  function buildToken(ruleName, token, env) {
    if (typeof token === 'string') {
      if (token === 'null') {
        return null;
      }

      return token;
    }

    if (token instanceof RegExp) {
      return token;
    }

    if (token.literal) {
      if (!token.literal.length) {
        return null;
      }
      if (token.literal.length === 1) {
        return token;
      }

      return buildStringToken(ruleName, token, env);
    }
    if (token.token) {
      return token;
    }

    if (token.subexpression) {
      return buildSubExpressionToken(ruleName, token, env);
    }

    if (token.ebnf) {
      return buildEBNFToken(ruleName, token, env);
    }

    if (token.macrocall) {
      return buildMacroCallToken(ruleName, token, env);
    }

    if (token.mixin) {
      if (env[token.mixin]) {
        return buildToken(ruleName, env[token.mixin], env);
      }
      throw new Error(`Unbound variable: ${token.mixin}`);
    }

    throw new Error(`unrecognized token: ${JSON.stringify(token)}`);
  }

  function buildStringToken(ruleName, token, env) {
    const newname = unique(`${ruleName}$string`);

    markRange(newname, token.pos, JSON.stringify(token.literal).length);

    produceRules(newname, [
      {
        tokens: token.literal.split('').map(function charLiteral(d) {
          return {
            literal: d
          };
        }),
        postprocess: {
          builtin: 'joiner'
        }
      }
    ], env);

    return newname;
  }

  function buildSubExpressionToken(ruleName, token, env) {
    const data = token.subexpression;
    const name = unique(`${ruleName}$subexpression`);

    // structure.push({"name": name, "rules": data});

    produceRules(name, data, env);

    return name;
  }

  function buildEBNFToken(ruleName, token, env) {
    switch (token.modifier) {
      case ':+':
        return buildEBNFPlus(ruleName, token, env);
      case ':*':
        return buildEBNFStar(ruleName, token, env);
      case ':?':
        return buildEBNFOpt(ruleName, token, env);
    }
  }

  function buildEBNFPlus(ruleName, token, env) {
    const name = unique(`${ruleName}$ebnf`);

    /*
        structure.push({
            name: name,
            rules: [{
                tokens: [token.ebnf],
            }, {
                tokens: [token.ebnf, name],
                postprocess: {builtin: "arrconcat"}
            }]
        });
        */

    produceRules(name,
                 [{
                   tokens: [token.ebnf]
                 }, {
                   tokens: [token.ebnf, name],
                   postprocess: {
                     builtin: 'arrconcat'
                   }
                 }],
                 env
    );

    return name;
  }

  function buildEBNFStar(ruleName, token, env) {
    const name = unique(`${ruleName}$ebnf`);

    /*
        structure.push({
            name: name,
            rules: [{
                tokens: [],
            }, {
                tokens: [token.ebnf, name],
                postprocess: {builtin: "arrconcat"}
            }]
        });
        */

    produceRules(name,
                 [{
                   tokens: []
                 }, {
                   tokens: [token.ebnf, name],
                   postprocess: {
                     builtin: 'arrconcat'
                   }
                 }],
                 env
    );

    return name;
  }

  function buildEBNFOpt(ruleName, token, env) {
    const name = unique(`${ruleName}$ebnf`);

    /*
        structure.push({
            name: name,
            rules: [{
                tokens: [token.ebnf],
                postprocess: {builtin: "id"}
            }, {
                tokens: [],
                postprocess: {builtin: "nuller"}
            }]
        });
        */

    produceRules(name,
                 [{
                   tokens: [token.ebnf],
                   postprocess: {
                     builtin: 'id'
                   }
                 }, {
                   tokens: [],
                   postprocess: {
                     builtin: 'nuller'
                   }
                 }],
                 env
    );

    return name;
  }

  function buildMacroCallToken(ruleName, token, env) {
    const name = unique(`${ruleName}$macrocall`);
    const macro = result.macros[token.macrocall];

    if (!macro) {
      throw new Error(`Unkown macro: ${token.macrocall}`);
    }
    if (macro.args.length !== token.args.length) {
      throw new Error('Argument count mismatch.');
    }
    const newenv = {
      __proto__: env
    };

    for (let i = 0; i < macro.args.length; i++) {
      const argrulename = unique(`${ruleName}$macrocall`);

      newenv[macro.args[i]] = argrulename;
      produceRules(argrulename, [token.args[i]], env);

      // structure.push({"name": argrulename, "rules":[token.args[i]]});
      // buildRule(name, token.args[i], env);
    }
    produceRules(name, macro.exprs, newenv);

    return name;
  }
}

function uniquer() {
  const uns = {};

  return unique;
  function unique(name) {
    const un = uns[name] = (uns[name] || 0) + 1;

    return `${name}$${un}`;
  }
}
