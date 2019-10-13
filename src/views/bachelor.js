import React, { Component } from 'react';

import Webcam from './webcam.js'
import Cam from './cam.js'

class Bachelor extends Component {
  constructor(props) {
    super(props)

    this.state = {
      users : [1,2,3,4,5,6,7,8,9,10,11,12]
    }
  }

  componentDidMount = () => {
    this.props.socket.on("receiveExternalUserList",(userlist) => {
      this.setState({users : userlist})
    })

    this.props.socket.emit("getPersonalPosition")

    this.props.socket.on("receivePersonalPosition",(position) => {
      this.setState({personalPosition : position})
    })

    this.props.socket.emit("userJoinedBachelorLobby",this.props.userType)

    this.props.socket.on("receiveBachelorUserList",(bachelorUserList) => {
      this.setState({users : bachelorUserList})
    })
  }

  updateUsername = (number,name) => {
    this.setState({['name' + number] : name})
  }

  render() {
    return (
      <div className="bachelor-main">
        <Webcam
        socket={this.props.socket}
        userType={this.props.userType}
        localUsername={this.props.localUsername}
        kickUserFromLobby={this.kickUserFromLobby}
        personalPosition={this.state.personalPosition}
        updateUsername={this.updateUsername}
        />
        <div className="cams-container">
        {this.state.users.map( (item,index) => {
          return(
            <Cam
            camID={["cam"] + (item.position)}
            userType={this.props.userType}
            tickIcon={"//:0"}
            crossIcon={"//:0"}
            camName={item.username}
            camType="bachelorCam"
            containerType="bachelorCamBox"
            />
          )
        })}
        </div>
      </div>
    );
  }
}

export default Bachelor;
