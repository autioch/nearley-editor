import codeMirror from 'codemirror';
import 'codemirror/addon/mode/multiplex';
import 'codemirror/keymap/sublime';

import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/ebnf/ebnf';
import 'codemirror/mode/javascript/javascript';

// import 'codemirror/theme/elegant.css';

// import 'codemirror/theme/erlang-dark.css';
// import 'codemirror/theme/midnight.css';
import 'codemirror/theme/twilight.css';

// import 'codemirror/theme/seti.css';

// import 'codemirror/theme/rubyblue.css';

import './codeMirror.scss';

codeMirror.defineMode('nearley', (config) =>
  codeMirror.multiplexingMode(
    codeMirror.getMode(config, 'ebnf'),
    {
      open: '{%',
      close: '%}',
      mode: codeMirror.getMode(config, 'javascript'),
      delimStyle: 'js-delimit'
    },
    {
      open: /^\s*#/,
      close: /.*$/,
      mode: codeMirror.getMode(config, 'text/plain'),
      delimStyle: 'comment-delimit'
    }
  )
);

const INDENTATION = 2;

export default function factory(ref, value) {
  return codeMirror(ref, {
    mode: 'nearley',
    value,
    tabSize: INDENTATION,
    matchBrackets: true,
    autoCloseBrackets: true,
    indentUnit: INDENTATION,
    keyMap: 'sublime',
    indentWithTabs: true,
    lineWrapping: true,
    theme: 'twilight',
    viewportMargin: Infinity
  });
}
