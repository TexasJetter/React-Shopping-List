import React, { Component } from 'react';
import { AppContext } from '../../AppContext';

class Content extends Component {
  render() {
    return (
      <AppContext.Consumer>
        {context => (
          <div className="app-content-title">
            {context.state.settings.category.Name}
          </div>
        )}
      </AppContext.Consumer>
    );
  }
}
export default Content;
