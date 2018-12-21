import React, { Component } from 'react';
import Navbar from './navbar.js';
import Koth from './koth.js';
import Generate from './generate.js';
import RenderMode from './renderMode.js'

class Lobby extends Component {

  render() {
    return (
      <div>
        <Generate />
        <RenderMode mode={this.props.mode}/>
      </div>
    )
  }
}

export default Lobby;
