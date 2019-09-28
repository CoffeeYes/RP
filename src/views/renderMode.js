import React, { Component } from 'react';
import Navbar from './navbar.js';
import Koth from './koth.js';
import Bachelor from './bachelor.js'

import openSocket from 'socket.io-client';

class RenderMode extends Component {

  constructor(props) {
    super(props)
    this.socket = openSocket('http://localhost:5001');
  }

  render() {
    if(this.props.mode.toLowerCase() == "king of the hill") {
      return (
        <Koth userType={this.props.userType} localUsername={this.props.localUsername} kickUserFromLobby={this.props.kickUserFromLobby} socket={this.socket}/>
      )
    }
    else if(this.props.mode.toLowerCase() == "bachelor") {
      return (
        <Bachelor
        socket={this.socket}
        userType={this.props.userType}
        kickUserFromLobby={this.props.kickUserFromLobby}
        localUsername={this.props.localUsername}
        />
      )
    }
    else {
      return (
        <p>mode not defined</p>
      )
    }
  }
}

export default RenderMode;
