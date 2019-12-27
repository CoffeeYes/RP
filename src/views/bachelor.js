import React, { Component } from 'react';

import Webcam from './webcam.js'
import Cam from './cam.js'
import AdminButtons from './adminButtons';
import Timer from './timer.js'
var timerInterval;

class Bachelor extends Component {
  constructor(props) {
    super(props)


    this.state = {
      users : [],
      hideOtherCams: false,
      timerMinutes : 1,
      timerSeconds : 0,
      startingMinutes : 0,
      startingSeconds : 5,
      timerText : ""
    }
  }

  //create text for timer and prefix zeros if necessary
  generateTimerText = (minutes,seconds) => {
    var timerText
    if(minutes < 10) {
      timerText = "0" + minutes + ":"
    }
    else {
      timerText = minutes + ":"
    }

    if(seconds < 10) {
      timerText += "0" + seconds;
    }
    else {
      timerText += seconds;
    }
    return timerText;
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

    this.props.socket.on("receiveKick",() => {
      this.props.kickUserFromLobby();
    })

    this.props.socket.on("userWasKicked", () => {
      this.setState({hideOtherCams: false})
    })

    var initialTimer = this.generateTimerText(this.state.startingMinutes,this.state.startingSeconds);
    this.setState({timerText : initialTimer})
  }

  updateUsername = (number,name) => {
    this.setState({['name' + number] : name})
  }

  toggleHideNonHighlightedCams = () => {
    this.setState({hideOtherCams : !(this.state.hideOtherCams)})
  }

  startTimer = () => {
    if(timerInterval == null) {
      timerInterval = setInterval( () => {
        var currentSeconds = this.state.timerSeconds
        var currentMinutes = this.state.timerMinutes

        if(currentSeconds > 0) {
          currentSeconds -= 1;
          this.setState({timerSeconds : currentSeconds})
        }
        else {
          if(currentMinutes > 0) {
            currentMinutes -= 1;
            currentSeconds = 59;
            return this.setState({timerSeconds : currentSeconds,timerMinutes : currentMinutes})
          }
          else {
            clearInterval(timerInterval);
          }
        }

        var currentTimerText = this.generateTimerText(currentMinutes,currentSeconds);
        this.setState({timerText : currentTimerText})
      },1000)
    }
  }

  resetTimer = () => {
    clearInterval(timerInterval);
    timerInterval = null;

    this.setState({timerMinutes : this.state.startingMinutes})
    this.setState({timerSeconds : this.state.startingSeconds})

    var resetTimerText = this.generateTimerText(this.state.startingMinutes,this.state.startingSeconds);
    this.setState({timerText : resetTimerText})
  }

  render() {
    if(this.props.userType == "admin") {
      return (
        <div>
          <div className="bachelor-main">
            <Webcam
            socket={this.props.socket}
            userType={this.props.userType}
            localUsername={this.props.localUsername}
            kickUserFromLobby={this.kickUserFromLobby}
            personalPosition={this.state.personalPosition}
            updateUsername={this.updateUsername}
            kickUserFromLobby={this.props.kickUserFromLobby}
            />
            <div className="hor-center">
            <Timer
            currentTime={this.state.timerText}
            startTimer={this.startTimer}
            resetTimer={this.resetTimer}
            />
            </div>
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
                key={index}
                allMuted={this.props.allMuted}
                allBlurred={this.props.allBlurred}
                kickUser={(camID) => this.props.kickUser(camID)}
                mode={this.props.mode}
                toggleHideNonHighlightedCams={this.toggleHideNonHighlightedCams}
                hideOtherCams={this.state.hideOtherCams}
                />
              )
            })}
            </div>
          </div>
            <div className="bottomBar">
              <AdminButtons
              muteAll={this.props.muteAll}
              unmuteAll={this.props.unmuteAll}
              blurAll={this.props.blurAll}
              unblurAll={this.props.unblurAll}
              mode={this.props.mode}
              />
            </div>
          </div>
      );
    }
    else {
      return (
        <div>
          <div className="bachelor-main">
            <Webcam
            socket={this.props.socket}
            userType={this.props.userType}
            localUsername={this.props.localUsername}
            kickUserFromLobby={this.kickUserFromLobby}
            personalPosition={this.state.personalPosition}
            updateUsername={this.updateUsername}
            kickUserFromLobby={this.props.kickUserFromLobby}
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
                key={index}
                allMuted={this.props.allMuted}
                allBlurred={this.props.allBlurred}
                kickUser={(camID) => this.props.kickUser(camID)}
                mode={this.props.mode}
                toggleHideNonHighlightedCams={this.toggleHideNonHighlightedCams}
                hideOtherCams={this.state.hideOtherCams}
                />
              )
            })}
            </div>
          </div>
        </div>
      );
    }
  }
}

export default Bachelor;
