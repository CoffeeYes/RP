import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {Route} from 'react-router-dom';

import Code from './views/code.js';
import Splash from './views/splash.js';


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username : '',
      password : '',
      error: '',
      loggedIn : false
    }

    this.handleLogin = this.handleLogin.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
  }

  handleLogin(event) {
    event.preventDefault();
    this.setState({error: ''})
    if(this.state.username.trim() == "" || this.state.password.trim() == "") {
      return this.setState({error: 'fields cannot be empty'})
    }
    fetch('/login',{
      method : 'POST',
      headers : {
        'Content-type' : 'application/json'
      },
      body : JSON.stringify({
        username : this.state.username,
        password : this.state.password
      })
    })
    .then(res => res.json())
    .then(data => {
      if(data.error) {
        this.setState({error : data.error})
      }
      else if(data.loggedIn === true){
        this.setState({loggedIn: true})
      }
    })
  }

  handleTextChange(event) {
    this.setState({[event.target.name] : event.target.value});
  }

  render() {
    return (
      <div className="main">
        <Route exact path="/" render={() => (
          <Splash handleLogin={this.handleLogin} handleTextChange={this.handleTextChange} error={this.state.error}/>
        )}/>
        <Route exact path="/code/" render={() => (
          <Code/>
        )} />
      </div>
    );
  }
}

export default App;
