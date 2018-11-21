import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Splash from './views/splash.js';
import {Route} from 'react-router-dom';
import Code from './views/code.js'


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {

    }

    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogin(event) {
    event.preventDefault();
    console.log("click");
  }

  render() {
    return (
      <div className="main">
        <Route exact path="/" render={() => (
          <Splash handleLogin={this.handleLogin}/>
        )}/>
        <Route exact path="/code/" render={() => (
          <Code/>
        )} />
      </div>
    );
  }
}

export default App;
