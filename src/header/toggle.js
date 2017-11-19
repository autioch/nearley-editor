import React from 'react'; // eslint-disable-line no-unused-vars

export default function Toggle({ hidden, toggle }) {
  const content = hidden ? 'Show header' : 'Hide header';

  return <div className="header__toggle" onClick={toggle}>[{content}]</div>;
}
