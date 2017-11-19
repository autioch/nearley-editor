const Randexp = require('randexp');

const LARGE_STACK = 7;

Randexp.max = LARGE_STACK;

function chooseRule(rules, stack) {
  if (stack.length > LARGE_STACK) {
    return rules.sort((a, b) => a.symbols.length - b.symbols.length)[0];
  }

  return rules[Math.floor(Math.random() * rules.length)];
}

// based on https://github.com/Hardmath123/nearley/blob/master/bin/nearley-unparse.js
export default function generate(grammar, ruleName) {
  const stack = [ruleName];
  const result = [];

  while (stack.length > 0) {
    const currentRule = stack.pop();

    if (typeof currentRule === 'string') {
      const goodrules = grammar.ParserRules.filter((x) => x.name === currentRule);

      if (!goodrules.length) {
        throw new Error(`Nothing matches rule: ${currentRule}!`);
      }

      stack.push(...chooseRule(goodrules, stack).symbols.slice().reverse());
    } else if (currentRule.test) {
      result.push(new Randexp(currentRule).gen());
    } else if (currentRule.literal) {
      result.push(currentRule.literal);
    }
  }

  return result.join('');
}
