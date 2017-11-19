import React from 'react'; // eslint-disable-line no-unused-vars
import Item from './item'; // eslint-disable-line no-unused-vars

import './styles.scss';

export default function Tabs({ tabs, activeIndex, setTabLabel, setActiveTab, deleteTab, addTab, resetTabs }) {
  const resetVisible = tabs.length === 1 && tabs[0].editorValue === '';

  return (
    <div className="tabs">
      {tabs.map(({ name: label, id }, index) => <Item
        index={index}
        label={label}
        isActive={activeIndex === index}
        setTabLabel={setTabLabel}
        setActiveTab={setActiveTab}
        deleteTab={deleteTab}
        key={id}
      />)}
      <div className="tab tab__add" onClick={addTab} title="Add tab">+</div>
      {resetVisible ? <div className="tab" onClick={resetTabs}>Reset Examples?</div> : null}
    </div>
  );
}
