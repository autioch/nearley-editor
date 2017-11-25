import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import codeMirror from './codemirror';
import './styles.scss';
import ErrorList from './errorList'; // eslint-disable-line no-unused-vars

export default class Editor extends Component {
  componentDidMount() {
    this.cm = codeMirror(this.refs.wrap, this.props.value);

    this.cm.on('change', (cm, change) => {
      if (change.origin !== 'setValue') {
        this.props.onChange(cm.getValue());
      }
    });
  }

  componentWillReceiveProps(nextprops) {
    if (nextprops.value !== this.cm.getValue()) {
      this.cm.setValue(nextprops.value);
    }
  }

  render() {
    return <div className="editor">
      <div className="cm-wrap" ref="wrap"></div>
      <ErrorList errors={this.props.errors}/>
    </div>;
  }
}
