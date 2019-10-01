import React, { Component } from 'react';

import Webcam from './webcam.js'
import Cam from './cam.js'

class Bachelor extends Component {
  constructor(props) {
    super(props)

    this.state = {
      users : [1,2]
    }
  }

  componentDidMount = () => {
    this.props.socket.on("receiveExternalUserList",(userlist) => {
      this.setState({users : userlist})
    })
  }

  render() {
    return (
      <div className="main-content">
        <Webcam
        socket={this.props.socket}
        userType={this.props.userType}
        localUsername={this.props.localUsername}
        kickUserFromLobby={this.kickUserFromLobby}
        />
        <div className="cams-container">
        {this.state.users.map( (item,index) => {
          return(
            <Cam camID={["cam"] + (index + 1)}/>
          )
        })}
        </div>
      </div>
    );
  }
}

export default Bachelor;
