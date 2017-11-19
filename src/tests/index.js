import React from 'react'; // eslint-disable-line no-unused-vars
import Item from './item'; // eslint-disable-line no-unused-vars
import ImportOption from './import';

import './styles.scss';

export default function Tests({ tests, addTest, generateTest, setTestValue, importTests, deleteTest }) {
  return <div
    className="test"
    onKeyPress={(ev) => {
      if (ev.key === 'Enter' && ev.shiftKey) {
        ev.preventDefault();
        addTest();
      }
    }} >
    <div className="test__list">
      {tests.map((t, index) =>
        <Item
          key={t.id}
          index={index}
          setTest={setTestValue}
          deleteTest={deleteTest}
          test={t}
        />
      )}
    </div>
    <div className="test__option-list">
      <div className="test__option" onClick={addTest}>+</div>
      <div className="test__option" onClick={generateTest}>Generate</div>
      <ImportOption importTests={importTests} />
    </div>
  </div>;
}
