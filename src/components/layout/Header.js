import React, { Component } from 'react';
import logo from '../../assets/img/logo.png';
import { AppContext } from '../../AppContext';

class Header extends Component {
  render() {
    return (
      <AppContext.Consumer>
        {context => (
          <div className="app-header">
            <img src={logo} className="app-logo" alt="logo" />
            <div className="app-title">Shopping List</div>
            <div
              className="app-actions"
              onClick={() =>
                context.setShowNav(!context.state.settings.showNav)
              }
            >
              =
            </div>
          </div>
        )}
      </AppContext.Consumer>
    );
  }
}

export default Header;
