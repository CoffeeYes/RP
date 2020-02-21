import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {Route, Redirect, Switch} from 'react-router-dom';

import Code from './views/code.js';
import Splash from './views/splash.js';
import Panel from './views/panel.js';
import Lobby from './views/lobby.js';
import Mode from './views/mode.js';
import AddUser from './views/addUser.js';
import UserList from './views/userlist.js';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username : sessionStorage.getItem('username')|| '',
      password : '',
      error: '',
      codeInput : '',
      generatedCode : '',
      loggedIn : false,
      modes : JSON.parse(localStorage.getItem('modes')) || [],
      mode: JSON.parse(localStorage.getItem('mode')) || '',
      nextMode : '',
      authenticated: JSON.parse(sessionStorage.getItem('authenticated')) || false,
      user_type : sessionStorage.getItem('user_type') || '',
      showCopied : false,
      addUser : {
        username : '',
        password : '',
        displayname : '',
      },
      userlist : [],
      inputCount : [1],
      pollData : {},
      pollsData : [],
      pollResult : [],
      voteChoice : ''
    }

    this.handleLogin = this.handleLogin.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.fetchModes = this.fetchModes.bind(this);
    this.getMode = this.getMode.bind(this);
    this.handleCode = this.handleCode.bind(this);
    this.createCode = this.createCode.bind(this);
    this.getUsers = this.getUsers.bind(this);
    this.addUser = this.addUser.bind(this);
    this.updateAddUser = this.updateAddUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
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
        if(data.username) {
          sessionStorage.setItem('username',data.username);
        }
        window.location = '/lobby'
      }
    })
  }

  handleTextChange(event) {
    this.setState({[event.target.name] : event.target.value});
  }

  //fetch all modes for admin select
  fetchModes(event) {
    fetch('/modes')
    .then(res => res.json())
    .then(data => {
      localStorage.setItem('modes',JSON.stringify(data.modes));
    })
  }

  //fetch current mode, renders different lobbies
  getMode() {
    fetch('/mode')
    .then(res => res.json())
    .then(data => {
      this.setState({mode : data.mode})
      localStorage.setItem("mode",JSON.stringify(data.mode))
    })
  }

  //update mode state based on users form choice
  changeMode = (event) => {
    this.setState({nextMode : event.target.value})
  }

  //send update mode choice to backend
  updateModeOnBackend = (event) => {
    event.preventDefault()
    this.setState({error : ""})

    if(this.state.nextMode == "") {
      return this.setState({error : "please select a mode"})
    }

    fetch('/updateMode',{
      method : 'POST',
      headers : {
        'Content-type' : 'application/json'
      },
      body : JSON.stringify({
        modeChoice : this.state.nextMode
      })
    })
    .then( res => res.json())
    .then( data => {
      if(data.success == true) {
        this.setState({error : "Mode Updated"})
        setTimeout(() => {
          this.setState({error : ""})
        },800)
      }
      else {
        this.setState({error : "Could not update Mode"})
      }
    })
  }

  //allow anon users to join if they have a room code created by backend
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
          window.location = '/lobby'
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

  //fetch list of all users stored in DB
  getUsers() {
    fetch('/getUsers')
    .then(res => res.json())
    .then( (data) => {
      this.setState({userlist : data.list})
    })
  }

  //add new user to db
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
          this.getUsers()
        }
      })
    }
  }
  //remove user from db
  deleteUser(event) {
    event.preventDefault();
    fetch('/deleteUser',{
      method : 'POST',
      headers : {
        'Content-type' : 'application/json'
      },
      body : JSON.stringify({
        username : event.target.value
      })
    })
    this.getUsers()
  }

  //re-fetch userlist after admin adds a new user
  updateAddUser(event) {
    this.setState({addUser : {...this.state.addUser,[event.target.name] : event.target.value}})
  }

  //fires when THIS user is removed from lobby
  kickUserFromLobby = () => {
    sessionStorage.setItem("authenticated",false)
    this.setState({authenticated : false})

    window.close()

    this.setState({error : "You were kicked from the Lobby"})
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
              <Lobby
              mode={this.state.mode}
              createCode={this.createCode}
              generatedCode={this.state.generatedCode}
              renderFull={true}
              showCopied={this.state.showCopied}
              getMode={this.getMode}
              userType={this.state.user_type}
              localUsername={this.state.username}
              kickUserFromLobby={this.kickUserFromLobby}
              />
            )}/>
            <Route path='/panel/mode' render={() => (
              <Mode
              modes={this.state.modes}
              changeMode={this.changeMode}
              updateModeOnBackend={this.updateModeOnBackend}
              fetchModes={this.fetchModes}
              error={this.state.error}
              />
            )}/>
            <Route path='/panel/users' render={() => (
              <div>
                <AddUser addUser={this.addUser} update={this.updateAddUser} error={this.state.error}/>
                <UserList list={this.state.userlist} deleteUser={this.deleteUser} getUsers={this.getUsers}/>
              </div>
            )}/>
          </div>
        );
      }
      else {
        return(
          //if not admin only allow access to the lobby
          <div className="main">
          <Route path='/lobby' render={() => (
            <Lobby
            mode={this.state.mode}
            createCode={this.createCode}
            generatedCode={this.state.generatedCode}
            renderFull={false}
            getMode={this.getMode}
            userType={this.state.user_type}
            localUsername={this.state.username}
            kickUserFromLobby={this.kickUserFromLobby}
            />
          )}/>
          </div>
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
          <Route path="/" render={() => (
            <Splash handleLogin={this.handleLogin} handleTextChange={this.handleTextChange} error={this.state.error}/>
          )}/>
        </Switch>
      )
    }
  }
}

export default App;
