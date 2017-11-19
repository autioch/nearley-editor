import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import Item from './item'; // eslint-disable-line no-unused-vars
import ImportOption from './import';

import './styles.scss';

export default class Tests extends Component {
  constructor(props) {
    super(props);

    this.checkKeyPress = this.checkKeyPress.bind(this);
    this.state = {
      errors: true,
      ambiguous: true,
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
    const { errors, ambiguous, matches, results } = this.state;

    let visibleTests = tests;
    const ambiguousCount = tests.filter((test) => test.isAmbiguous).length;
    const errorsCount = tests.filter((test) => !test.isMatch).length;
    const matchesCount = tests.filter((test) => test.isMatch).length;

    if (!ambiguous) {
      visibleTests = visibleTests.filter((test) => !test.isAmbiguous);
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
          <div
            className={`test__option test__option--errors ${errors ? 'is-active' : ''}`}
            onClick={() => this.toggle('errors')}
          >{errorsCount} error</div>
          <div
            className={`test__option test__option--ambiguous ${ambiguous ? 'is-active' : ''}`}
            onClick={() => this.toggle('ambiguous')}
          >{ambiguousCount} ambiguous</div>
          <div
            className={`test__option test__option--matches ${matches ? 'is-active' : ''}`}
            onClick={() => this.toggle('matches')}
          >{matchesCount} match</div>
          <div
            className={`test__option test__option--results ${results ? 'is-active' : ''}`}
            onClick={() => this.toggle('results')}
          >Results</div>
        </div>
        <div className="test__option-list">
          <div className="test__option" onClick={addTest}>+</div>
          <div className="test__option" onClick={generateTest}>Generate</div>
          <ImportOption importTests={importTests} />
          <div className="test__option" onClick={exportTests}>Export</div>
        </div>
      </div>
    );
  }
}
