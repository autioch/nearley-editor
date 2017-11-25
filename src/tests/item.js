import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import Inspector from 'react-inspector'; // eslint-disable-line no-unused-vars

function removeScroll(el) {
  el.style.height = 0;
  el.style.height = `${el.scrollHeight}px`;
}

export default class TestItem extends Component {
  constructor(props) {
    super(props);
    this.updateDimensions = this.updateDimensions.bind(this);
  }

  componentDidMount() {
    removeScroll(this.inputEl);
    window.addEventListener('resize', this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  componentDidUpdate() {
    removeScroll(this.inputEl);
  }

  updateDimensions() {
    removeScroll(this.inputEl);
  }

  setInputRef(el) {
    this.inputEl = el;
  }

  render() {
    const { setTest, deleteTest, test, index, showResults } = this.props;

    return (
      <div className={`test-item ${test.isMatch ? 'is-match' : ''} ${test.isAmbiguous ? 'is-ambiguous' : ''}`}>
        <div className="test-item__content">
          <textarea
            className="test-item__input"
            placeholder="Type a test..."
            onInput={(ev) => setTest(index, ev.target.value)}
            onChange={(ev) => setTest(index, ev.target.value)}
            value={test.value}
            ref={(el) => this.setInputRef(el)}
            onKeyDown={(ev) => {
              if (ev.key === 'Backspace' && ev.target.value === '') {
                deleteTest(index);
              }
            }}
          />
          <div
            className="test-item__remove"
            onClick={() => deleteTest(index)}
            title="Remove test"
          >x</div>
        </div>
        {showResults ? test.results.map((result, resultIndex) =>
          <div className="test-item__output" key={resultIndex}>
            <Inspector data={result}/>
          </div>) : null}
      </div>
    );
  }
}
