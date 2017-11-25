import ReactDOM from 'react-dom';
import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import Tabs from './tabs'; // eslint-disable-line no-unused-vars
import Editor from './editor'; // eslint-disable-line no-unused-vars
import Tests from './tests'; // eslint-disable-line no-unused-vars
import { deleteTab, addTab, setEditorValue, setTabLabel, defaultTabs, setLastId } from './tabs/manager';
import {
  generateTest, addTest, setTestValue, deleteTest, setLastId as setLastTestId, importTests, exportTests
} from './tests/manager';
import debounce from 'lodash.debounce';

import './styles.scss';
import './favicon.ico';

const LOCAL_STORAGE_ID = 'nearley-editor-1.0.0';
const INPUT_DEBOUNCE = 250;

class App extends Component { // eslint-disable-line no-unused-vars
  constructor(props) {
    super(props);

    this.addTab = this.addTab.bind(this);
    this.addTest = this.addTest.bind(this);
    this.deleteTab = this.deleteTab.bind(this);
    this.deleteTest = this.deleteTest.bind(this);
    this.exportTests = this.exportTests.bind(this);
    this.generateTest = this.generateTest.bind(this);
    this.importTests = this.importTests.bind(this);
    this.resetTabs = this.resetTabs.bind(this);
    this.setActive = this.setActive.bind(this);
    this.setEditorValue = debounce(this.setEditorValue.bind(this), INPUT_DEBOUNCE);
    this.setTabLabel = this.setTabLabel.bind(this);
    this.setTestValue = this.setTestValue.bind(this);

    this.state = defaultTabs();
  }

  componentWillMount() {
    if (localStorage[LOCAL_STORAGE_ID]) {
      const { activeIndex, tabs } = JSON.parse(localStorage[LOCAL_STORAGE_ID]);

      setLastId(Math.max(...tabs.map((tab) => tab.id)));
      setLastTestId(Math.max(...tabs.reduce((ids, tab) => ids.concat(tab.tests.map((test) => test.id)), [])));
      this.state = {
        activeIndex,
        tabs
      };
    }
  }

    componentWillUpdate(nextProps, nextState) { // eslint-disable-line
    localStorage[LOCAL_STORAGE_ID] = JSON.stringify(nextState);
  }

  activeTab() {
    return this.state.tabs[this.state.activeIndex];
  }

  setTabLabel(index, label) {
    this.setState(setTabLabel(this.state.tabs, label, index));
  }

  setActive(index) {
    this.setState({
      activeIndex: index
    });
  }

  deleteTab(index) {
    this.setState(deleteTab(this.state.tabs, index, this.state.activeIndex));
  }

  resetTabs() {
    this.setState(defaultTabs());
  }

  addTab() {
    this.setState(addTab(this.state.tabs));
  }

  setEditorValue(value) {
    this.setState(setEditorValue(value, this.activeTab(), this.state.tabs));
  }

  addTest() {
    this.setState(addTest(this.state.tabs, this.activeTab()));
  }

  generateTest() {
    this.setState(generateTest(this.state.tabs, this.activeTab()));
  }

  setTestValue(index, value) {
    this.setState(setTestValue(this.state.tabs, this.activeTab(), index, value));
  }

  forceContentRefresh() {
    this.setState({
      tabs: this.state.tabs.slice()
    });
  }

  deleteTest(index) {
    this.setState(deleteTest(this.state.tabs, this.activeTab(), index));
  }

  importTests(ev) { // eslint-disable-line class-methods-use-this
    if (ev.target.files.length !== 1) {
      return;
    }

    const reader = new FileReader();

    reader.onload = (readerEv) => this.setState(importTests(this.state.tabs, this.activeTab(), readerEv.target.result));
    reader.readAsText(ev.target.files[0]);
  }

  exportTests() {
    exportTests(this.activeTab());
  }

  render() {
    const { activeIndex, tabs } = this.state;
    const { editorValue, tests, errors } = this.activeTab();

    return (
      <div className="app">
        <Tabs
          tabs={tabs}
          activeIndex={activeIndex}
          setTabLabel={this.setTabLabel}
          setActiveTab={this.setActive}
          deleteTab={this.deleteTab}
          addTab={this.addTab}
          resetTabs={this.resetTabs}
        />
        <div className="tab-content">
          <Editor
            value={editorValue}
            errors={errors}
            onChange={this.setEditorValue}
          />
          <Tests
            tests={tests}
            addTest={this.addTest}
            generateTest={this.generateTest}
            setTestValue={this.setTestValue}
            deleteTest={this.deleteTest}
            exportTests={this.exportTests}
            importTests={this.importTests}
          />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App/>, document.body);
