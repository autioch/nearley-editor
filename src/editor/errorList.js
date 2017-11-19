import React from 'react'; // eslint-disable-line no-unused-vars

export default function ErrorList({ errors }) {
  if (errors.length > 0) {
    return (
      <div className="editor__errors">
        {errors.map((error, index) => <div className="error-item" key={index}>{error}</div>)}
      </div>
    );
  }

  return null;
}
