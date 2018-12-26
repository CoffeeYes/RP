import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {Route, Redirect, Switch} from 'react-router-dom';

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
      codeInput : '',
      generatedCode : '',
      loggedIn : false,
      modes : JSON.parse(localStorage.getItem('modes')) || [],
      mode: JSON.parse(localStorage.getItem('mode')) || '',
      authenticated: sessionStorage.getItem('authenticated') || false
    }

    this.handleLogin = this.handleLogin.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.fetchModes = this.fetchModes.bind(this);
    this.prepLobby = this.prepLobby.bind(this);
    this.handleCode = this.handleCode.bind(this);
    this.createCode = this.createCode.bind(this);
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
        sessionStorage.setItem('authenticated',true);
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
    event.preventDefault()
    //get current mode
    fetch('../mode')
    .then(res => res.json())
    .then(data => {
      localStorage.setItem("mode",JSON.stringify(data.mode))
    })
    .then(() => {
      window.location = '/lobby'
    })
  }

  handleCode(event) {
    event.preventDefault();
    this.setState({error : ""})

    //check empty
    if(this.state.codeInput.trim() == "") {
      return this.setState({error : "field cannot be empty"})
    }
    //post code to backend and handle response
      fetch('/roomCode',{
        method : 'POST',
        headers : {
          'Content-type' : 'application/json'
        },
        body : JSON.stringify({
          code : this.state.codeInput
        })
      })
      .then(res => res.json())
      .then(data => {
        if(data.sucess == false) {
          return this.setState({error : data.error})
        }
        else {
          window.location = "/lobby"
        }
      })
  }

  createCode(event) {
    event.preventDefault();
    //generate random string for room code
    var code = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    this.setState({generatedCode : code});

    //post to backend and update database
    fetch('/createCode',{
      method : 'POST',
      headers : {
        'Content-type' : 'application/json'
      },
      body : JSON.stringify({
        code : code
      })
    })
  }

  render = () => {
    if(this.state.authenticated) {
      return (
        <div className="main">
          <Route exact path="/" render={() => (
            <Splash handleLogin={this.handleLogin} handleTextChange={this.handleTextChange} error={this.state.error}/>
          )}/>
          <Route exact path="/code/" render={() => (
            <Code handleCode={this.handleCode} handleTextChange={this.handleTextChange} error={this.state.error}/>
          )} />
          <Route path='/panel' render={() => (
            <Panel fetchModes={this.fetchModes} prepLobby={this.prepLobby}/>
          )}/>
          <Route path='/lobby' render={() => (
            <Lobby mode={this.state.mode} createCode={this.createCode} generatedCode={this.state.generatedCode}/>
          )}/>
          <Route path='/panel/mode' render={() => (
            <Mode modes={this.state.modes} changeMode={this.changeMode}/>
          )}/>
          <Route path='/panel/vote' Component={Vote}/>
        </div>
      );
    }
    else {
      return (
        <Switch>
          <Route exact path="/code/" render={() => (
            <Code handleCode={this.handleCode} handleTextChange={this.handleTextChange} error={this.state.error}/>
          )} />
          <Route path="/" render={() => (
            <Splash handleLogin={this.handleLogin} handleTextChange={this.handleTextChange} error={this.state.error}/>
          )}/>
        </Switch>
      )
    }
  }
}

export default App;
