import React from 'react'; // eslint-disable-line no-unused-vars

export default function Item({ index, label, isActive, setTabLabel, setActiveTab, deleteTab }) {
  return (
    <div className={`tab${isActive ? ' is-active' : ''}`} onClick={() => setActiveTab(index)}>
      <input
        className="tab__input"
        defaultValue={label}
        spellCheck="false"
        onInput={(ev) => setTabLabel(index, ev.target.value)}
      />
      <div
        className="tab__remove"
        onClick={(ev) => {
          // prevents selection when removing last tab.
          ev.stopPropagation();
          deleteTab(index);
        }}
      >
        <div title="Remove tab">x</div>
      </div>
    </div>
  );
}
