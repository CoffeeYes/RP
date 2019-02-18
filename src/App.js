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
import AddUser from './views/addUser.js';
import UserList from './views/userlist.js';
import VotingPoll from './views/votingPoll.js'


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
      authenticated: sessionStorage.getItem('authenticated') || false,
      user_type : sessionStorage.getItem('user_type') || '',
      showCopied : false,
      addUser : {
        username : '',
        password : '',
        displayname : '',
      },
      userlist : JSON.parse(sessionStorage.getItem('userlist')) || [],
      inputCount : [1],
      pollData : {},
      pollResult : [],
      voteChoice : ''
    }

    this.handleLogin = this.handleLogin.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.fetchModes = this.fetchModes.bind(this);
    this.prepLobby = this.prepLobby.bind(this);
    this.handleCode = this.handleCode.bind(this);
    this.createCode = this.createCode.bind(this);
    this.getUsers = this.getUsers.bind(this);
    this.addUser = this.addUser.bind(this);
    this.updateAddUser = this.updateAddUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.addField = this.addField.bind(this);
    this.handleFieldText = this.handleFieldText.bind(this);
    this.handleAddPoll = this.handleAddPoll.bind(this);
    this.fetchPoll = this.fetchPoll.bind(this);
    this.handleVote = this.handleVote.bind(this);
    this.clickVote = this.clickVote.bind(this);
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
        sessionStorage.setItem('user_type',data.user_type);
        this.getMode('/lobby');
      }
    })
  }

  handleTextChange(event) {
    this.setState({[event.target.name] : event.target.value});
  }

  //fetch all modes for admin select
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

  //fetch current mode, renders different lobbies
  getMode(redirect) {
    fetch('../mode')
    .then(res => res.json())
    .then(data => {
      localStorage.setItem("mode",JSON.stringify(data.mode))
    })
    .then( () => {
      window.location = redirect;
    })
  }

  prepLobby(event) {
    event.preventDefault()
    //get current mode
    this.getMode('/lobby');
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
          sessionStorage.setItem('authenticated',true);
          sessionStorage.setItem('user_type',data.user_type);
          this.getMode('/lobby');
        }
      })
  }

  createCode(event) {
    event.preventDefault();
    //generate random string for room code
    var code = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    this.setState({generatedCode : code});
    navigator.clipboard.writeText(code);
    this.setState({showCopied: true})

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

    setTimeout( () => {
      this.setState({showCopied: false})
    },1500)
  }

  getUsers(event) {
    event.preventDefault();
    fetch('/getUsers')
    .then(res => res.json())
    .then( (data) => {
      console.log(data)
      window.location = '/panel/users'
      sessionStorage.setItem('userlist',JSON.stringify(data.list))
    })
  }

  addUser(event) {
    event.preventDefault();

    if(this.state.addUser.username.trim() == "" || this.state.addUser.password.trim() == "" ||this.state.addUser.displayname.trim() == "") {
      return this.setState({error : "fields cannot be empty"})
    }
    else {
      fetch('/addUser',{
        method : 'POST',
        headers : {
          'Content-type' : 'application/json'
        },
        body : JSON.stringify({
          username : this.state.addUser.username,
          password : this.state.addUser.password,
          displayname : this.state.addUser.displayname
        })
      })
      .then( res => res.json())
      .then( data => {
        if(data.error) {
          this.setState({error: data.error})
        }
        else {
          fetch('/getUsers')
          .then(res => res.json())
          .then( (data) => {
            window.location = '/panel/users'
            sessionStorage.setItem('userlist',JSON.stringify(data.list))
          })
        }
      })
    }
  }

  deleteUser(event) {
    fetch('/getUsers')
    .then(res => res.json())
    .then( (data) => {
      window.location = '/panel/users'
      sessionStorage.setItem('userlist',JSON.stringify(data.list))
    })
  }

  updateAddUser(event) {
    this.setState({addUser : {...this.state.addUser,[event.target.name] : event.target.value}})
  }

  addField(event) {
    event.preventDefault();
    let newValue = this.state.inputCount[this.state.inputCount.length-1] + 1;
    this.setState({inputCount : [...this.state.inputCount,newValue]});
  }

  handleFieldText(event) {
    this.setState({pollData : {...this.state.pollData,[event.target.name] : event.target.value}})
  }

  handleAddPoll(event) {
    event.preventDefault();

    fetch('/addVotingPoll',{
      method : 'POST',
      headers : {
        'Content-type' : 'application/json'
      },
      body : JSON.stringify(this.state.pollData),
    })
  }

  fetchPoll() {
    let pollCode = window.location.href.split('?q=')[1];

    if(pollCode != undefined) {
      fetch(['/getPoll?code=' + pollCode])
      .then(res => res.json())
      .then(data => {
        if(data.error) {
          this.setState({error: data.error})
        }
        else {
          this.setState({pollResult : data.pollResult})
        }
      })
    }
  }

  handleVote(event) {
    event.preventDefault();

    let pollCode = window.location.href.split('?q=')[1];

    fetch('/addVote', {
      method: 'POST',
      headers : {
        'Content-type' : 'application/json'
      },
      body : JSON.stringify({
      voteChoice : this.state.voteChoice,
      pollCode : pollCode
    })
    })
  }

  clickVote(event) {
    this.setState({voteChoice : event.target.value});
  }
  render = () => {
    if(this.state.authenticated) {
      //render full panel and allow access to other routes if admin login
      if(this.state.user_type == 'admin') {
        return (
          <div className="main">
            <Route exact path="/" render={() => (
              <Splash handleLogin={this.handleLogin} handleTextChange={this.handleTextChange} error={this.state.error}/>
            )}/>
            <Route exact path="/code/" render={() => (
              <Code handleCode={this.handleCode} handleTextChange={this.handleTextChange} error={this.state.error}/>
            )} />
            <Route path='/panel' render={() => (
              <Panel fetchModes={this.fetchModes} prepLobby={this.prepLobby} getUsers={this.getUsers}/>
            )}/>
            <Route path='/lobby' render={() => (
              <Lobby mode={this.state.mode} createCode={this.createCode} generatedCode={this.state.generatedCode} renderFull={true} showCopied={this.state.showCopied}/>
            )}/>
            <Route path='/panel/mode' render={() => (
              <Mode modes={this.state.modes} changeMode={this.changeMode}/>
            )}/>
            <Route path='/panel/vote' render={() => (
              <Vote inputCount={this.state.inputCount} addField={this.addField} handleFieldText={this.handleFieldText} handleAddPoll={this.handleAddPoll}/>
            )}/>
            <Route path='/panel/users' render={() => (
              <div>
                <AddUser addUser={this.addUser} update={this.updateAddUser} error={this.state.error}/>
                <UserList list={this.state.userlist} deleteUser={this.deleteUser}/>
              </div>
            )}/>
          </div>
        );
      }
      else {
        return(
          //if not admin only allow access to the lobby
          <Route path='/lobby' render={() => (
            <Lobby mode={this.state.mode} createCode={this.createCode} generatedCode={this.state.generatedCode} renderFull={false}/>
          )}/>
        )
      }
    }
    else {
      return (
        //unauthenticated users only have access to the splash and code pages
        <Switch>
          <Route exact path="/code/" render={() => (
            <Code handleCode={this.handleCode} handleTextChange={this.handleTextChange} error={this.state.error}/>
          )} />
          <Route path="/poll/*" render={() => (
            <VotingPoll fetchPoll={this.fetchPoll} error={this.state.error} pollResult={this.state.pollResult} handleVote={this.handleVote} clickVote={this.clickVote}/>
          )}/>
          <Route path="/" render={() => (
            <Splash handleLogin={this.handleLogin} handleTextChange={this.handleTextChange} error={this.state.error}/>
          )}/>
        </Switch>
      )
    }
  }
}

export default App;
