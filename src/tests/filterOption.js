import React from 'react'; // eslint-disable-line no-unused-vars
import Item from './item'; // eslint-disable-line no-unused-vars

import './styles.scss';

export default function FilterOption({ isActive, count, label, stateKey, toggle }) {
  return (
    <div
      className={`test__option test__option--${stateKey} ${isActive ? 'is-active' : ''}`}
      onClick={() => toggle(stateKey)}
    >
      {count} {label}
    </div>
  );
}
