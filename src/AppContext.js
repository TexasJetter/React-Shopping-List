import React, { Component } from 'react';
import categoryService from './service/categoryService';

//https://stackoverflow.com/questions/49809884/access-react-context-outside-of-render-function

export const AppContext = React.createContext();

class AppContextProvider extends Component {
  state = {
    settings: {
      email: '',
      name: '',
      category: { Id: 0, Name: '' },
      showNav: false
    }
  };
  componentDidMount() {
    categoryService.getSelectedCategoryId(response => {
      if (response !== null) {
        this.setState((prevState, props) => ({
          settings: {
            ...prevState.settings,
            category: { Id: response.Id, Name: response.Name },
            showNav: false
          }
        }));
      }
    });
  }
  render() {
    return (
      <AppContext.Provider
        value={{
          state: this.state,
          handleChange: event => {
            const value = event.target.value;
            const name = event.target.name;
            this.setState((prevState, props) => ({
              settings: { ...prevState.settings, [name]: value }
            }));
          },
          updateCategory: event => {
            const newValue = event.target.value;
            const categoryId = event.target.name;
            categoryService.getCategory(categoryId, null, response => {
              if (response.Name !== newValue) {
                categoryService.saveCategory(categoryId, newValue, false);
              }
            });
          },
          deleteCategory: categoryId => {
            categoryService.deleteCategory(categoryId, () => {
              categoryService.saveSelectedCategoryId(null);
              this.setState((prevState, props) => ({
                settings: {
                  ...prevState.settings,
                  category: {},
                  showNav: false
                }
              }));
            });
          },
          setCategory: categoryId => {
            categoryService.saveSelectedCategoryId(categoryId);
            categoryService.getCategory(categoryId, null, response => {
              this.setState((prevState, props) => ({
                settings: {
                  ...prevState.settings,
                  category: { Id: categoryId, Name: response.Name },
                  showNav: false
                }
              }));
            });
          },

          setShowNav: showHide => {
            this.setState((prevState, props) => ({
              settings: {
                ...prevState.settings,
                showNav: showHide
              }
            }));
          }
        }}
      >
        {this.props.children}
      </AppContext.Provider>
    );
  }
}
export default AppContextProvider;
