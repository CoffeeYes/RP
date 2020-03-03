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
    if(this.props.userType == "admin") {
      if(this.props.mode == "king of the hill") {
        return (
            <div className="hor-center">
              <Generate createCode={this.props.createCode} generatedCode={this.props.generatedCode} showCopied={this.props.showCopied}/>
              <a href="/panel/mode" className="panel-link">
                  <p>Panel</p>
              </a>
            <RenderMode mode={this.props.mode} userType={this.props.userType} localUsername={this.props.localUsername} kickUserFromLobby={this.props.kickUserFromLobby}/>
          </div>
        )
      }
      else {
        return (
            <RenderMode mode={this.props.mode} userType={this.props.userType} localUsername={this.props.localUsername} kickUserFromLobby={this.props.kickUserFromLobby}/>
        )
      }

    }
    else {
      return (
          <RenderMode mode={this.props.mode} userType={this.props.userType} localUsername={this.props.localUsername} kickUserFromLobby={this.props.kickUserFromLobby}/>
      )
    }
  }
}

export default Lobby;
