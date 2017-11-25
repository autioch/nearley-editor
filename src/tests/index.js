import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import Item from './item'; // eslint-disable-line no-unused-vars
import ImportOption from './importOption';
import FilterOption from './filterOption';

import './styles.scss';

export default class Tests extends Component {
  constructor(props) {
    super(props);

    this.checkKeyPress = this.checkKeyPress.bind(this);
    this.toggle = this.toggle.bind(this);
    this.state = {
      errors: true,
      amb: true,
      matches: true,
      results: false
    };
  }

  checkKeyPress(ev) {
    if (ev.key === 'Enter' && ev.shiftKey) {
      ev.preventDefault();
      this.props.addTest();
    }
  }

  toggle(option) {
    this.setState({
      [option]: !this.state[option]
    });
  }

  /* TODO This must be cleanedup. */
  render() {
    const { tests, addTest, generateTest, setTestValue, importTests, deleteTest, exportTests } = this.props;
    const { errors, amb, matches, results } = this.state;

    let visibleTests = tests;
    const ambCount = tests.filter((test) => test.isamb).length;
    const errorsCount = tests.filter((test) => !test.isMatch).length;
    const matchesCount = tests.filter((test) => test.isMatch).length;

    if (!amb) {
      visibleTests = visibleTests.filter((test) => !test.isamb);
    }

    if (!errors) {
      visibleTests = visibleTests.filter((test) => test.isMatch);
    }

    if (!matches) {
      visibleTests = visibleTests.filter((test) => !test.isMatch);
    }

    return (
      <div className="test" onKeyPress={this.checkKeyPress} >
        <div className="test__list">
          {visibleTests.map((t, index) =>
            <Item
              key={t.id}
              index={index}
              setTest={setTestValue}
              deleteTest={deleteTest}
              test={t}
              showResults={results}
            />
          )}
        </div>
        <div className="test__option-list">
          <FilterOption isActive={errors} count={errorsCount} label="error" stateKey="errors" toggle={this.toggle} />
          <FilterOption isActive={amb} count={ambCount} label="ambiguous" stateKey="ambiguous" toggle={this.toggle} />
          <FilterOption isActive={matches} count={matchesCount} label="match" stateKey="matches" toggle={this.toggle} />
          <div
            className={`test__option test__option--results ${results ? 'is-active' : ''}`}
            onClick={() => this.toggle('results')}
          >Results</div>
        </div>
        <div className="test__option-list">
          <div className="test__option" onClick={addTest}>Add</div>
          <div className="test__option" onClick={generateTest}>Generate</div>
          <ImportOption importTests={importTests} />
          <div className="test__option" onClick={exportTests}>Export</div>
        </div>
      </div>
    );
  }
}
