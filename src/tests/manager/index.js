import nearley from 'nearley';
import generate from './generate';

let lastId = 0;

function getId() {
  lastId++; // eslint-disable-line no-plusplus

  return lastId;
}

function test(compiledGammar, value, id = getId()) {
  const result = {
    id,
    value,
    isMatch: true,
    isAmbiguous: false,
    results: [],
    error: null
  };

  try {
    const { ParserRules, ParserStart } = compiledGammar;

    result.results = new nearley.Parser(ParserRules, ParserStart).feed(value).results;
    result.isAmbiguous = result.results.length > 1;
  } catch (error) {
    result.isMatch = false;
    result.error = error;
  }

  return result;
}

export function generateTest(tabs, activeTab) {
  const { compiledGrammar } = activeTab;

  const generated = generate(compiledGrammar, compiledGrammar.ParserStart);
  const tested = test(compiledGrammar, generated);

  activeTab.tests = activeTab.tests.concat(tested);

  return {
    tabs: tabs.slice()
  };
}

export function addTest(tabs, activeTab) {
  activeTab.tests = activeTab.tests.concat(test(activeTab.compiledGrammar, ''));

  return {
    tabs: tabs.slice()
  };
}

export function setTestValue(tabs, activeTab, index, value) {
  activeTab.tests = activeTab.tests.slice();
  activeTab.tests[index] = test(activeTab.compiledGrammar, value, activeTab.tests[index].id);

  return {
    tabs: tabs.slice()
  };
}

export function deleteTest(tabs, activeTab, index) {
  activeTab.tests.splice(index, 1);

  return {
    tabs: tabs.slice()
  };
}

export function valueArrayToTests(compiledGrammar, valueArray) {
  return valueArray.map((testValue) => test(compiledGrammar, testValue));
}

export function retestTests(compiledGammar, testsArray) {
  return testsArray.map((oldTest) => test(compiledGammar, oldTest.value, oldTest.id));
}

export function setLastId(newLastId) {
  lastId = newLastId;
}

export function importTests(tabs, activeTab, fileContents) {
  const rawTests = fileContents.split('\n').map((line) => line.trim()).filter((line) => line.length > 0);

  activeTab.tests = valueArrayToTests(activeTab.compiledGammar, rawTests);

  return {
    tabs: tabs.slice()
  };
}

const URL_DECAY_TIMEOUT = 5000;

const windowURL = window.URL || window.webkitURL;

export function exportTests(activeTab) {
  const anchorElement = document.createElement('a');
  const lines = activeTab.tests.map((testItem) => testItem.value).join('\n');
  const href = windowURL.createObjectURL(new Blob([lines], {
    type: 'text/json'
  }));

  anchorElement.href = href;
  anchorElement.download = `${activeTab.name}.tests.txt`;
  anchorElement.click();

  setTimeout(() => windowURL.revokeObjectURL(href), URL_DECAY_TIMEOUT);
}
