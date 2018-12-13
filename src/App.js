import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {Route, Redirect} from 'react-router-dom';

import Code from './views/code.js';
import Splash from './views/splash.js';
import Panel from './views/panel.js';
import Lobby from './views/lobby.js';
import Vote from './views/vote.js';
import Mode from './views/mode.js';


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username : '',
      password : '',
      error: '',
      loggedIn : false,
      modes : JSON.parse(localStorage.getItem('modes')) || [],
      mode: ''
    }

    this.handleLogin = this.handleLogin.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.fetchModes = this.fetchModes.bind(this);
    this.prepLobby = this.prepLobby.bind(this);
  }

  handleLogin = (event) => {
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
      else if(data.loggedIn == true){
        this.setState({loggedIn: true});
        window.location = '/panel'
      }
    })
  }

  handleTextChange(event) {
    this.setState({[event.target.name] : event.target.value});
  }

  fetchModes(event) {
    event.preventDefault()
    fetch('/modes')
    .then(res => res.json())
    .then(data => {
      localStorage.setItem('modes',JSON.stringify(data.modes));
    })
    .then(() => {
      window.location = '/panel/mode'
    })
  }

  prepLobby(event) {
    //get current mode
    fetch('../mode')
    .then(res => res.json())
    .then(data => this.setState({mode : data.mode},function() {
      window.location = '/lobby'
    }))
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
        <Route path='/panel' render={() => (
          <Panel fetchModes={this.fetchModes} prepLobby={this.prepLobby}/>
        )}/>
        <Route path='/lobby' render={() => (
          <Lobby/>
        )}/>
        <Route path='/panel/mode' render={() => (
          <Mode modes={this.state.modes} changeMode={this.changeMode}/>
        )}/>
        <Route path='/panel/vote' Component={Vote}/>
      </div>
    );
  }
}

export default App;
