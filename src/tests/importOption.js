import React from 'react'; // eslint-disable-line no-unused-vars
import Item from './item'; // eslint-disable-line no-unused-vars

import './styles.scss';

const importAvailable = window.File && window.FileReader && window.FileList && window.Blob;

export default function ImportOption({ importTests }) {
  if (!importAvailable) {
    return null;
  }

  return (
    <label className="test__option test__option--import">
      Import
      <input className="test__import" type="file" onChange={importTests} />
    </label>
  );
}
