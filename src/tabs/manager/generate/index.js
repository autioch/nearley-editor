import arithmetic from './arithmetic.ne';
import sentence from './sentence.ne';
import compile from '../compile';
import { valueArrayToTests } from '../../../tests/manager';

const newTabEditorValue = `Main -> "What's up, " Person "?"\nPerson -> "@biject" | "@antimatter15" | "Hardmath123"`;

let lastId = 0;

function getId() {
  lastId++; // eslint-disable-line no-plusplus

  return lastId;
}

export function newTab() {
  const { compiledGrammar, errors } = compile(newTabEditorValue);
  const id = getId();

  return {
    id,
    name: `Tab ${id}`,
    editorValue: newTabEditorValue,
    compiledGrammar,
    errors,
    tests: valueArrayToTests(compiledGrammar, ['What\'s up, @biject?', `Tab no ${id}`])
  };
}

export function basicTab() {
  const { compiledGrammar, errors } = compile(sentence);

  return {
    id: getId(),
    name: 'Basic Grammar',
    editorValue: sentence,
    compiledGrammar,
    errors,
    tests: valueArrayToTests(compiledGrammar, [
      'Charles sleeps while thinking about snakes.',
      'A typical Reddit user sleeps with a hammer.',
      'This test doesn\'t match :('
    ])
  };
}

export function fancyTab() {
  const { compiledGrammar, errors } = compile(arithmetic);

  return {
    id: getId(),
    name: 'Fancier Grammar',
    editorValue: arithmetic,
    compiledGrammar,
    errors,
    tests: valueArrayToTests(compiledGrammar, ['1 + 1', 'ln(5 + sin(3 + 4*e))'])
  };
}

export function setLastId(newLastId) {
  lastId = newLastId;
}
