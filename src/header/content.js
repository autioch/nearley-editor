import React from 'react'; // eslint-disable-line no-unused-vars

export default function HeaderContent() {
  return (
    <div className="header__content">
      <div>
This is editor for <a href="http://nearley.js.org/">Nearley Parser</a> created by <a href="https://hardmath123.github.io/">Hardmath123</a>.
You can find the Nearley syntax spec <a href="https://github.com/Hardmath123/nearley#parser-specification">here</a>,
more example grammars <a href="https://github.com/Hardmath123/nearley/tree/master/examples">here</a>.
      </div>
      <div className="header__mobile">
This app is not designed to run on small screens. Please use larger screen or turn the device horizontal.
      </div>
    </div>
  );
}
