import React, { Component } from 'react';
import Navbar from './navbar.js';
import Koth from './koth.js'

class RenderMode extends Component {

  render() {
    if(this.props.mode.toLowerCase() == "king of the hill") {
      return (
        <Koth userType={this.props.userType}/>
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
