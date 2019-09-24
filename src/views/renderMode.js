import React, { Component } from 'react';
import Navbar from './navbar.js';
import Koth from './koth.js';
import Bachelor from './bachelor.js'

class RenderMode extends Component {

  render() {
    if(this.props.mode.toLowerCase() == "king of the hill") {
      return (
        <Koth userType={this.props.userType} localUsername={this.props.localUsername} kickUserFromLobby={this.props.kickUserFromLobby}/>
      )
    }
    else if(this.props.mode.toLowerCase() == "bachelor") {
      return (
        <Bachelor/>
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
