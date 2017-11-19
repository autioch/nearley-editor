import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import Toggle from './toggle'; // eslint-disable-line no-unused-vars
import HeaderContent from './content'; // eslint-disable-line no-unused-vars

import './styles.scss';

export default class Header extends Component {
    state={
      hidden: false
    }

    toggleHidden() {
      this.setState({
        hidden: !this.state.hidden
      });
    }

    render() {
      return (
        <section className="header">
          <header className="header__title">
            <span className="header__label">Nearley Editor</span>
            <Toggle hidden={this.state.hidden} toggle={this.toggleHidden.bind(this)}/>
          </header>
          {this.state.hidden ? '' : <HeaderContent />}
        </section>
      );
    }
}
