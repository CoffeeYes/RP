import React, { Component } from 'react';
import Webcam from './webcam.js'
import Cam from './cam.js'

import tick_empty from '../assets/tick_empty.svg'
import tick_filled from '../assets/tick_filled.svg'
import x_empty from '../assets/x_empty.svg'
import x_filled from '../assets/x_filled.svg'

import openSocket from 'socket.io-client';

var socket;

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
      allMuted : true,
      allBlurred : true,
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

    this.socket = openSocket('http://localhost:5001');
  }


  componentDidMount() {

    this.socket.emit("getUserVoteStates")
    this.socket.emit("getPersonalPosition")
    this.socket.emit("getUsernames")

    this.socket.on("hostVotedYes",(iconID) => {
      this.setState({["tick" + iconID] : tick_filled})
      this.setState({["cross" + iconID] : x_empty})
    })

    this.socket.on("hostVotedNo",(iconID) => {
      this.setState({["tick" + iconID] : tick_empty})
      this.setState({["cross" + iconID] : x_filled})
    })

    this.socket.on("resetAllVote",() => {
      for(var iconNum = 1; iconNum < 5; iconNum++) {
        this.setState({["tick" + iconNum] : tick_empty})
        this.setState({["cross" + iconNum] : x_empty})
      }
    })

    this.socket.on("receiveUserVoteStates",(voteStates) => {
      for(var i = 0; i < voteStates.length; i++) {
        if(voteStates[i] == "yes") {
          this.setState({["tick" + (i+1)] : tick_filled})
        }
        else if(voteStates[i] == "no") {
          this.setState({["cross" + (i+1)] : x_filled})
        }
      }
    })

    this.socket.on("resetSingleVote",(iconID) => {
      this.setState({["tick" + iconID] : tick_empty})
      this.setState({["cross" + iconID] : x_empty})
    })

    this.socket.on("receivePersonalPosition",(position) => {
      this.setState({personalPosition : position})
    })

    this.socket.on("receiveUsernames", (usernames) => {
      for(var i = 0; i < usernames.length ; i++){
        console.log("position : " + usernames[i].position + "  name : " + usernames[i].username)
        this.setState({["name" + usernames[i].position] : usernames[i].username})
      }
    })

    this.socket.on("receiveSocketsAndPositions",(sockets) => {
      for(var item in sockets) {
        this.setState({["socketID_cam" + sockets[item].position] : sockets[item].socket})
      }
    })

    socket = this.socket;
  }

  updateUsername(number,name) {
    this.setState({['name' + number] : name})
  }

  swapContestants() {
    var contestant1 = document.querySelector('#cam5');
    var contestant2 = document.querySelector('#cam6');

    var temp = contestant2.srcObject;
    contestant2.srcObject = contestant1.srcObject;
    contestant1.srcObject = temp;

    socket.emit("swapContestants")
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
    this.socket.emit("hostVoteYes");
  }

  hostVoteNo = () => {
    this.socket.emit("hostVoteNo");
  }

  resetHostVote = () => {
    this.socket.emit("resetHostVote")
  }

  resetAll = () => {
    this.socket.emit("resetAllVotes");
  }
  kickUser(camID) {

    if(this.state["socketID_" + camID]) {
      this.socket.emit("kickUser",this.state["socketID_" + camID])
    }
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
               allMuted={this.state.allMuted}
               allBlurred={this.state.allBlurred}
               iconID={1} tickIcon={this.state.tick1}
               crossIcon={this.state.cross1}
               kickUser={(camID) => this.kickUser(camID)}/>

              <Webcam userType={this.props.userType} localUsername={this.props.localUsername} updateUsername={(number,name) => this.updateUsername(number,name)} {...this.props} socket={this.socket} personalPosition={this.state.personalPosition}/>

              <Cam
              camName={this.state.name2}
              camID="cam2" camType="guestCam"
              userType={this.props.userType}
              containerType="remoteCam guest"
              audioID="audioGuest1"
              allMuted={this.state.allMuted}
              allBlurred={this.state.allBlurred}
              iconID={2}
              tickIcon={this.state.tick2}
              crossIcon={this.state.cross2}
              kickUser={(camID) => this.kickUser(camID)}/>

          </div>
          <div className="cam-col">
              <Cam
              camName="Contestant"
              camID="cam5"
              camType="contestantCam"
              userType={this.props.userType}
              containerType="remoteCam contestant"
              audioID="audioContestant1"
              allMuted={this.state.allMuted}
              allBlurred={this.state.allBlurred}
              kickUser={(camID) => this.kickUser(camID)}/>

              <Cam
              camName="King"
              camID="cam6"
              camType="contestantCam"
              userType={this.props.userType}
              containerType="remoteCam contestant"
              audioID="audioContestant2"
              allMuted={this.state.allMuted}
              allBlurred={this.state.allBlurred}
              kickUser={(camID) => this.kickUser(camID)}/>

              <div className="buttonsContainer">
                <button onClick={this.swapContestants}>Swap</button>
                <button onClick={this.muteAll}>Mute All</button>
                <button onClick={this.unmuteAll}>Unmute All</button>
                <button onClick={this.blurAll}>Blur All</button>
                <button onClick={this.unblurAll}>Unblur All</button>
                <button onClick={this.resetAll}>Reset Votes</button>
              </div>
          </div>
          <div className="cam-col">
              <Cam
              camName={this.state.name3}
              camID="cam3" camType="guestCam"
              userType={this.props.userType}
              containerType="remoteCam guest"
              audioID="audioGuest2"
              allMuted={this.state.allMuted}
              allBlurred={this.state.allBlurred}
              iconID={3}
              tickIcon={this.state.tick3}
              crossIcon={this.state.cross3}
              kickUser={(camID) => this.kickUser(camID)}/>

              <Cam
              camName={this.state.name4}
              camID="cam4" camType="guestCam"
              userType={this.props.userType}
              containerType="remoteCam guest"
              audioID="audioGuest3"
              allMuted={this.state.allMuted}
              allBlurred={this.state.allBlurred}
              iconID={4} tickIcon={this.state.tick4}
              crossIcon={this.state.cross4}
              kickUser={(camID) => this.kickUser(camID)}/>

          </div>
        </div>
      );
    }
    else if(this.props.userType == "host") {
      return (
          <div className="cam-container">
            <div className="cam-col">
                <Cam camName={this.state.name1} camID="cam1" camType="guestCam" userType={this.props.userType} containerType="localCam guest" iconID={1} tickIcon={this.state.tick1} crossIcon={this.state.cross1}/>
                <Webcam userType={this.props.userType} localUsername={this.props.localUsername} updateUsername={(number,name) => this.updateUsername(number,name)} {...this.props} socket={this.socket} personalPosition={this.state.personalPosition} />
                <Cam camName={this.state.name2} camID="cam2" camType="guestCam" userType={this.props.userType} containerType="remoteCam guest" audioID="audioGuest1" iconID={2} tickIcon={this.state.tick2} crossIcon={this.state.cross2}/>
            </div>
            <div className="cam-col">
                <Cam camName="Contestant" camID="cam5" camType="contestantCam" userType={this.props.userType} containerType="remoteCam contestant" audioID="audioContestant1"/>
                <Cam camName="King" camID="cam6" camType="contestantCam" userType={this.props.userType} containerType="remoteCam contestant" audioID="audioContestant2"/>
                <div className="buttonsContainer">
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
              <Webcam userType={this.props.userType} localUsername={this.props.localUsername} updateUsername={(number,name) => this.updateUsername(number,name)} personalPosition={this.state.personalPosition} socket={this.socket} />
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
