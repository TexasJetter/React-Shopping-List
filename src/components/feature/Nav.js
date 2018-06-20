import React, { Component } from 'react';

import { AppContext } from '../../AppContext';
import categoryService from '../../service/categoryService';
import selectIcon from '../../assets/img/one-finger.png';
import deleteIcon from '../../assets/img/delete.png';

//because each item in the list needs access to the
//context actions we have to make a component
//wrapped with the consumer.
const NavItem = props => (
  <AppContext.Consumer>
    {context => (
      <div key={props.category.Id} className="app-nav-item">
        <img
          src={deleteIcon}
          className="pull-right"
          alt="select"
          onClick={() => context.deleteCategory(props.category.Id)}
        />
        <img
          src={selectIcon}
          className="pull-left"
          alt="select"
          onClick={() => context.setCategory(props.category.Id)}
        />
        <input
          type="text"
          defaultValue={props.category.Name}
          name={props.category.Id}
          onBlur={context.updateCategory}
        />
      </div>
    )}
  </AppContext.Consumer>
);

class Nav extends Component {
  state = {
    categories: []
  };
  componentDidMount() {
    categoryService.getCategories(response => {
      this.setState({ categories: response });
    });
  }
  render() {
    let categoriesList = this.state.categories.map(c => {
      //we can't access the context here, so use a component that can
      return <NavItem key={c.Id} category={c} />;
    });
    return (
      <AppContext.Consumer>
        {context => (
          <div
            className={
              'app-nav' +
              (context.state.settings.showNav === true ? ' show' : '')
            }
          >
            {categoriesList}
          </div>
        )}
      </AppContext.Consumer>
    );
  }
}

export default Nav;
