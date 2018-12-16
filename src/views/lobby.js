import React, { Component } from 'react';
import Navbar from './navbar.js';
import Koth from './koth.js'

class Lobby extends Component {

  render() {
    if(this.props.mode.toLowerCase() == "king of the hill") {
      return (
        <Koth />
      )
    }
    else {
      return (
        <p>lobby</p>
      )
    }
  }
}

export default Lobby;
