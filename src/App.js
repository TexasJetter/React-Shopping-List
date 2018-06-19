import React, { Component } from 'react';

import AppContextProvider from './AppContext';
import Header from './components/layout/Header';
import Content from './components/layout/Content';
import Nav from './components/feature/Nav';
//import categoryService from './service/categoryService';

import './App.css';

class App extends Component {
  render() {
    return (
      <AppContextProvider>
        <div className="app">
          <Header />
          <Content />
          <Nav />
        </div>
      </AppContextProvider>
    );
  }
}

export default App;
