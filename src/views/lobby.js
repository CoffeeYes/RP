import React, { Component } from 'react';
import Navbar from './navbar.js';
import Koth from './koth.js';
import Generate from './generate.js';
import RenderMode from './renderMode.js'

class Lobby extends Component {

  render() {
    return (
      <div>
        <Generate createCode={this.props.createCode} generatedCode={this.props.generatedCode}/>
        <RenderMode mode={this.props.mode}/>
      </div>
    )
  }
}

export default Lobby;
