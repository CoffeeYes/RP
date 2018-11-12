import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Splash from './views/splash.js'


class App extends Component {
  render() {
    return (
      <div className="main">
        <Splash />
      </div>
    );
  }
}

export default App;
