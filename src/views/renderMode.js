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

  componentDidMount = () => {
    this.socket.on("receiveSocketsAndPositions",(sockets) => {
      for(var item in sockets) {
        this.setState({["socketID_cam" + sockets[item].position] : sockets[item].socket})
      }
    })
  }

  muteAll = () => {
    this.setState({allMuted : true})
  }

  unmuteAll = () => {
    this.setState({allMuted : false})
  }

  blurAll = () => {
    this.setState({allBlurred : true})
  }

  unblurAll = () => {
    this.setState({allBlurred : false})
  }

  kickUser(camID) {

    if(this.state["socketID_" + camID] != "") {
      this.socket.emit("kickUser",this.state["socketID_" + camID])

      this.setState({["socketID_" + camID] : ""})
    }
  }

  highlightCam() {
    console.log("highlight")
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
        kickUser={(camID) => this.kickUser(camID)}
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
        kickUser={(camID) => this.kickUser(camID)}
        highlightCam={this.highlightCam}
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
