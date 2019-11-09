import React, { Component } from 'react';
import Webcam from './webcam.js'
import Cam from './cam.js'

import tick_empty from '../assets/tick_empty.svg'
import tick_filled from '../assets/tick_filled.svg'
import x_empty from '../assets/x_empty.svg'
import x_filled from '../assets/x_filled.svg'

import AdminButtons from './adminButtons.js'

class Koth extends Component {
  constructor(props) {
    super(props)

    this.state = {
      name1 : '',
      name2 : '',
      name3 : '',
      name4 : '',
      socketID_cam1 : '',
      socketID_cam2 : '',
      socketID_cam3 : '',
      socketID_cam4 : '',
      socketID_cam5 : '',
      socketID_cam6 : '',
      tick1 : tick_empty,
      tick2 : tick_empty,
      tick3 : tick_empty,
      tick4 : tick_empty,
      cross1 : x_empty,
      cross2 : x_empty,
      cross3 : x_empty,
      cross4 : x_empty,
      personalPosition : -1
    }

  }


  componentDidMount() {

    this.props.socket.emit("getUserVoteStates")
    this.props.socket.emit("getPersonalPosition")
    this.props.socket.emit("getUsernames")

    this.props.socket.on("hostVotedYes",(iconID) => {
      this.setState({["tick" + iconID] : tick_filled})
      this.setState({["cross" + iconID] : x_empty})
    })

    this.props.socket.on("hostVotedNo",(iconID) => {
      this.setState({["tick" + iconID] : tick_empty})
      this.setState({["cross" + iconID] : x_filled})
    })

    this.props.socket.on("resetAllVote",() => {
      for(var iconNum = 1; iconNum < 5; iconNum++) {
        this.setState({["tick" + iconNum] : tick_empty})
        this.setState({["cross" + iconNum] : x_empty})
      }
    })

    this.props.socket.on("receiveUserVoteStates",(voteStates) => {
      for(var i = 0; i < voteStates.length; i++) {
        if(voteStates[i] == "yes") {
          this.setState({["tick" + (i+1)] : tick_filled})
        }
        else if(voteStates[i] == "no") {
          this.setState({["cross" + (i+1)] : x_filled})
        }
      }
    })

    this.props.socket.on("resetSingleVote",(iconID) => {
      this.setState({["tick" + iconID] : tick_empty})
      this.setState({["cross" + iconID] : x_empty})
    })

    this.props.socket.on("receivePersonalPosition",(position) => {
      this.setState({personalPosition : position})
    })

    this.props.socket.on("receiveUsernames", (usernames) => {
      for(var i = 0; i < usernames.length ; i++){
        console.log("position : " + usernames[i].position + "  name : " + usernames[i].username)
        this.setState({["name" + usernames[i].position] : usernames[i].username})
      }
    })

    this.props.socket.on("receiveSocketsAndPositions",(sockets) => {
      for(var item in sockets) {
        this.setState({["socketID_cam" + sockets[item].position] : sockets[item].socket})
      }
    })

    this.props.socket.on("contestantsWereSwapped", () => {
      var contestant1 = document.querySelector('#cam5');
      var contestant2 = document.querySelector('#cam6');

      var temp = contestant2.srcObject;
      contestant2.srcObject = contestant1.srcObject;
      contestant1.srcObject = temp;
    })
  }

  updateUsername(number,name) {
    this.setState({['name' + number] : name})
  }

  swapContestants = () => {
    this.props.socket.emit("swapContestants")
  }

  muteAll = () => {
    for(var i = 1; i < 7; i++) {
      var video = document.querySelector('#cam' + i);
      if(video) {
        video.muted = true;
      }
    }

    this.setState({allMuted : true})
  }

  unmuteAll = () => {
    for(var i = 1; i < 7; i++) {
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

  hostVoteYes = () => {
    this.props.socket.emit("hostVoteYes");
  }

  hostVoteNo = () => {
    this.props.socket.emit("hostVoteNo");
  }

  resetHostVote = () => {
    this.props.socket.emit("resetHostVote")
  }

  resetAll = () => {
    this.props.socket.emit("resetAllVotes");
  }
  render() {
    if(this.props.userType == "admin") {
      return (
        <div className="cam-container">
          <div className="cam-col">
              <Cam camName={this.state.name1}
               camID="cam1" camType="guestCam"
               userType={this.props.userType}
               containerType="localCam guest"
               allMuted={this.props.allMuted}
               allBlurred={this.props.allBlurred}
               iconID={1} tickIcon={this.state.tick1}
               crossIcon={this.state.cross1}
               kickUser={(camID) => this.props.kickUser(camID)}
               />

              <Webcam
              userType={this.props.userType}
              localUsername={this.props.localUsername}
              updateUsername={(number,name) => this.updateUsername(number,name)}
              {...this.props}
              socket={this.props.socket}
              personalPosition={this.state.personalPosition}
              kickUserFromLobby={this.kickUserFromLobby}
               />

              <Cam
              camName={this.state.name2}
              camID="cam2" camType="guestCam"
              userType={this.props.userType}
              containerType="remoteCam guest"
              audioID="audioGuest1"
              allMuted={this.props.allMuted}
              allBlurred={this.props.allBlurred}
              iconID={2}
              tickIcon={this.state.tick2}
              crossIcon={this.state.cross2}
              kickUser={(camID) => this.props.kickUser(camID)}
              />

          </div>
          <div className="cam-col">
              <Cam
              camName="Contestant"
              camID="cam5"
              camType="contestantCam"
              userType={this.props.userType}
              containerType="remoteCam contestant"
              audioID="audioContestant1"
              allMuted={this.props.allMuted}
              allBlurred={this.props.allBlurred}
              kickUser={(camID) => this.props.kickUser(camID)}
              />

              <Cam
              camName="King"
              camID="cam6"
              camType="contestantCam"
              userType={this.props.userType}
              containerType="remoteCam contestant"
              audioID="audioContestant2"
              allMuted={this.props.allMuted}
              allBlurred={this.props.allBlurred}
              kickUser={(camID) => this.props.kickUser(camID)}
              />

              <AdminButtons
              swapContestants={this.swapContestants}
              mutAll={this.props.muteAll}
              unmuteAll={this.props.unmuteAll}
              blurAll={this.props.blurAll}
              unblurAll={this.props.unblurAll}
              resetAll={this.resetAll}
              mode={this.props.mode}
              />
          </div>
          <div className="cam-col">
              <Cam
              camName={this.state.name3}
              camID="cam3" camType="guestCam"
              userType={this.props.userType}
              containerType="remoteCam guest"
              audioID="audioGuest2"
              allMuted={this.props.allMuted}
              allBlurred={this.props.allBlurred}
              iconID={3}
              tickIcon={this.state.tick3}
              crossIcon={this.state.cross3}
              kickUser={(camID) => this.props.kickUser(camID)}/>

              <Cam
              camName={this.state.name4}
              camID="cam4" camType="guestCam"
              userType={this.props.userType}
              containerType="remoteCam guest"
              audioID="audioGuest3"
              allMuted={this.props.allMuted}
              allBlurred={this.props.allBlurred}
              iconID={4} tickIcon={this.state.tick4}
              crossIcon={this.state.cross4}
              kickUser={(camID) => this.props.kickUser(camID)}/>

          </div>
        </div>
      );
    }
    else if(this.props.userType == "host") {
      return (
          <div className="cam-container">
            <div className="cam-col">
                <Cam camName={this.state.name1} camID="cam1" camType="guestCam" userType={this.props.userType} containerType="localCam guest" iconID={1} tickIcon={this.state.tick1} crossIcon={this.state.cross1}/>
                <Webcam userType={this.props.userType} localUsername={this.props.localUsername} updateUsername={(number,name) => this.updateUsername(number,name)} {...this.props} socket={this.props.socket} personalPosition={this.state.personalPosition} kickUserFromLobby={this.props.kickUserFromLobby}/>
                <Cam camName={this.state.name2} camID="cam2" camType="guestCam" userType={this.props.userType} containerType="remoteCam guest" audioID="audioGuest1" iconID={2} tickIcon={this.state.tick2} crossIcon={this.state.cross2}/>
            </div>
            <div className="cam-col">
                <Cam camName="Contestant" camID="cam5" camType="contestantCam" userType={this.props.userType} containerType="remoteCam contestant" audioID="audioContestant1"/>
                <Cam camName="King" camID="cam6" camType="contestantCam" userType={this.props.userType} containerType="remoteCam contestant" audioID="audioContestant2"/>
                <div className="buttonsContainer-host">
                  <button onClick={this.hostVoteYes}>Yes</button>
                  <button onClick={this.hostVoteNo}>No</button>
                  <button onClick={this.resetHostVote}>Reset</button>
                </div>
            </div>
            <div className="cam-col">
                <Cam camName={this.state.name3} camID="cam3" camType="guestCam" userType={this.props.userType} containerType="remoteCam guest" audioID="audioGuest2" iconID={3} tickIcon={this.state.tick3} crossIcon={this.state.cross3}/>
                <Cam camName={this.state.name4} camID="cam4" camType="guestCam" userType={this.props.userType} containerType="remoteCam guest" audioID="audioGuest3" iconID={4} tickIcon={this.state.tick4} crossIcon={this.state.cross4}/>
            </div>
          </div>
      )
    }
    else {
      return (
        <div className="cam-container">
          <div className="cam-col">
              <Cam camName={this.state.name1} camID="cam1" camType="guestCam" userType={this.props.userType} containerType="localCam guest" iconID={1} tickIcon={this.state.tick1} crossIcon={this.state.cross1}/>
              <Webcam userType={this.props.userType} localUsername={this.props.localUsername} updateUsername={(number,name) => this.updateUsername(number,name)} personalPosition={this.state.personalPosition} socket={this.props.socket} kickUserFromLobby={this.props.kickUserFromLobby}/>
              <Cam camName={this.state.name2} camID="cam2" camType="guestCam" userType={this.props.userType} containerType="remoteCam guest" audioID="audioGuest1" iconID={2} tickIcon={this.state.tick2} crossIcon={this.state.cross2}/>
          </div>
          <div className="cam-col">
              <Cam camName="Contestant" camID="cam5" camType="contestantCam" userType={this.props.userType} containerType="remoteCam contestant" audioID="audioContestant1"/>
              <Cam camName="King" camID="cam6" camType="contestantCam" userType={this.props.userType} containerType="remoteCam contestant" audioID="audioContestant2"/>
          </div>
          <div className="cam-col">
              <Cam camName={this.state.name3} camID="cam3" camType="guestCam" userType={this.props.userType} containerType="remoteCam guest" audioID="audioGuest2" iconID={3} tickIcon={this.state.tick3} crossIcon={this.state.cross3}/>
              <Cam camName={this.state.name4} camID="cam4" camType="guestCam" userType={this.props.userType} containerType="remoteCam guest" audioID="audioGuest3" iconID={4} tickIcon={this.state.tick4} crossIcon={this.state.cross4}/>
          </div>
        </div>
      )
    }
  }
}

export default Koth;
