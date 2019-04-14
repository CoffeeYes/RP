import React, { Component } from 'react';
import Navbar from './navbar.js';
import Koth from './koth.js';
import Generate from './generate.js';
import RenderMode from './renderMode.js'

class Lobby extends Component {

  componentDidMount() {
    this.props.getMode();
  }

  render() {
    if(this.props.renderFull) {
      return (
        <div>
          <div className="hor-center">
            <Generate createCode={this.props.createCode} generatedCode={this.props.generatedCode} showCopied={this.props.showCopied}/>
            <a href="/panel" className="panel-link">Panel</a>
          </div>
          <RenderMode mode={this.props.mode} userType={this.props.userType}/>
        </div>
      )
    }
    else {
      return (
        <div>
          <RenderMode mode={this.props.mode} userType={this.props.userType}/>
        </div>
      )
    }
  }
}

export default Lobby;
