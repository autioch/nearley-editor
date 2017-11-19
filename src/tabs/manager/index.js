import compile from './compile';
import { retestTests, setLastId as setLastTestId } from '../../tests/manager';
import { newTab, basicTab, fancyTab, setLastId as setLastTabId } from './generate';

export function deleteTab(tabs, index, activeIndex) {
  if (tabs.length === 1) {
    return {
      tabs: [newTab()],
      activeIndex: 0
    };
  }

  tabs.splice(index, 1);

  const newActiveIndex = activeIndex > index ? activeIndex - 1 : Math.min(activeIndex, tabs.length - 1);

  return {
    activeIndex: newActiveIndex,
    tabs
  };
}

export function addTab(tabs) {
  const newTabs = tabs.concat(newTab());

  return {
    tabs: newTabs,
    activeIndex: newTabs.length - 1
  };
}

export function setEditorValue(value, activeTab, tabs) {
  const { compiledGrammar, errors } = compile(value);

  activeTab.editorValue = value;
  activeTab.compiledGrammar = compiledGrammar;
  activeTab.errors = errors;
  activeTab.tests = retestTests(activeTab.compiledGrammar, activeTab.tests);

  return {
    tabs: tabs.slice()
  };
}

export function setTabLabel(tabs, label, index) {
  tabs[index].label = label;

  return {
    tabs: tabs.slice()
  };
}

export function defaultTabs() {
  setLastTabId(0);
  setLastTestId(0);

  return {
    activeIndex: 0,
    tabs: [basicTab(), fancyTab()]
  };
}

/* TODO Fix this. */
export function setLastId(newLastId) {
  setLastTabId(newLastId);
}
