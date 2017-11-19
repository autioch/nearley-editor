import React from 'react'; // eslint-disable-line no-unused-vars
import Inspector from 'react-inspector'; // eslint-disable-line no-unused-vars

export default function TestItem({ setTest, deleteTest, test, index, showResults }) {
  return (
    <div className={`test-item ${test.isMatch ? 'is-match' : ''} ${test.isAmbiguous ? 'is-ambiguous' : ''}`}>
      <div className="test-item__content">
        <input
          className="test-item__input"
          placeholder="Type a test..."
          onInput={(ev) => setTest(index, ev.target.value)}
          onChange={(ev) => setTest(index, ev.target.value)}
          value={test.value}
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
