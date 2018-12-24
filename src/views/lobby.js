import React, { Component } from 'react';
import Navbar from './navbar.js';
import Koth from './koth.js';
import Generate from './generate.js';
import RenderMode from './renderMode.js'

class Lobby extends Component {

  render() {
    return (
      <div>
        <div className="hor-center">
          <Generate createCode={this.props.createCode} generatedCode={this.props.generatedCode}/>
          <a href="/panel" className="panel-link">Panel</a>
        </div>
        <RenderMode mode={this.props.mode}/>
      </div>
    )
  }
}

export default Lobby;
