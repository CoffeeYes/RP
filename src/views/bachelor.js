import React, { Component } from 'react';
import Webcam from './webcam.js'

class Bachelor extends Component {

  render() {
    return (
      <div className="main-content">
        <Webcam
        socket={this.props.socket}
        userType={this.props.userType}
        localUsername={this.props.localUsername}
        kickUserFromLobby={this.kickUserFromLobby}
        />
      </div>
    );
  }
}

export default Bachelor;
