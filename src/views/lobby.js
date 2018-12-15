import React, { Component } from 'react';
import Navbar from './navbar.js';

class Lobby extends Component {

  render() {
    if(this.props.mode.toLowerCase() == "king of the hill") {
      return (
        <p>king of the hill</p>
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
