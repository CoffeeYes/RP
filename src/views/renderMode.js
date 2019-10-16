import React, { Component } from 'react';
import Navbar from './navbar.js';
import Koth from './koth.js';
import Bachelor from './bachelor.js'

import openSocket from 'socket.io-client';

class RenderMode extends Component {

  constructor(props) {
    super(props)
    this.socket = openSocket('http://localhost:5001');

    this.state = {
      allMuted : true,
      allBlurred : true,
    }
  }

  muteAll = () => {
    for(var i = 1; i < 20; i++) {
      var video = document.querySelector('#cam' + i);
      if(video) {
        video.muted = true;
      }
    }

    this.setState({allMuted : true})
  }

  unmuteAll = () => {
    for(var i = 1; i < 20; i++) {
      var video = document.querySelector('#cam' + i);
      if(video) {
        video.muted = true;
      }
    }
    this.setState({allMuted : false})
  }

  blurAll = () => {
    this.setState({allBlurred : true})
  }

  unblurAll = () => {
    this.setState({allBlurred : false})
  }

  render() {
    if(this.props.mode.toLowerCase() == "king of the hill") {
      return (
        <Koth
        userType={this.props.userType}
        localUsername={this.props.localUsername}
        kickUserFromLobby={this.props.kickUserFromLobby}
        socket={this.socket}
        mode={this.props.mode}
        muteAll={this.muteAll}
        unmuteAll={this.unmuteAll}
        blurAll={this.blurAll}
        unblurAll={this.unblurAll}
        allBlurred={this.state.allBlurred}
        allMuted={this.state.allMuted}
        />
      )
    }
    else if(this.props.mode.toLowerCase() == "bachelor") {
      return (
        <Bachelor
        socket={this.socket}
        userType={this.props.userType}
        kickUserFromLobby={this.props.kickUserFromLobby}
        localUsername={this.props.localUsername}
        mode={this.props.mode}
        muteAll={this.muteAll}
        unmuteAll={this.unmuteAll}
        blurAll={this.blurAll}
        unblurAll={this.unblurAll}
        allBlurred={this.state.allBlurred}
        allMuted={this.state.allMuted}
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
