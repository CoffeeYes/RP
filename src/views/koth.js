import React, { Component } from 'react';
import Webcam from './webcam.js'
import Cam from './cam.js'

class Koth extends Component {
  constructor(props) {
    super(props)

    this.state = {
      name1 : '',
      name2 : '',
      name3 : '',
      allMuted : true,
      allBlurred : true,
    }
  }

  componentDidMount() {
    fetch('/getUsernames')
    .then(res => res.json())
    .then(data => {
      console.log(data)
      for(var item in data) {
        this.setState({['name' + data[item].number] : data[item].name})
      }
    })
  }

  updateUsername(number,name) {
    this.setState({['name' + number] : name})
  }

  swapContestants() {
    var contestant1 = document.querySelector('#contestant1');
    var contestant2 = document.querySelector('#contestant2');

    var temp = contestant2.srcObject;
    contestant2.srcObject = contestant1.srcObject;
    contestant1.srcObject = temp;
    }

  muteAll = () => {
    for(var i = 1; i < 4; i++) {
      var video = document.querySelector('#remote' + i);
      video.muted = true;
      if(i < 3) {
        video = document.querySelector('#contestant' + i);
        video.muted = true;
      }
    }

    this.setState({allMuted : true})
  }

  unmuteAll = () => {
    for(var i = 1; i < 4; i++) {
      var video = document.querySelector('#remote' + i);
      video.muted = true;
      if(i < 3) {
        video = document.querySelector('#contestant' + i);
        video.muted = undefined;
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
    if(this.props.userType == "admin") {
      return (
        <div className="cam-container">
          <div className="cam-col">
              <Cam camName={this.props.localUsername} camID="localCam" camType="guestCam" userType={this.props.userType} containerType="localCam guest" allMuted={this.state.allMuted} allBlurred={this.state.allBlurred}/>
              <Webcam userType={this.props.userType} localUsername={this.props.localUsername} updateUsername={(number,name) => this.updateUsername(number,name)}/>
              <Cam camName={this.state.name1} camID="remote1" camType="guestCam" userType={this.props.userType} containerType="remoteCam guest" audioID="audioGuest1" allMuted={this.state.allMuted} allBlurred={this.state.allBlurred}/>
          </div>
          <div className="cam-col">
              <Cam camName="Contestant" camID="contestant1" camType="contestantCam" userType={this.props.userType} containerType="remoteCam contestant" audioID="audioContestant1" allMuted={this.state.allMuted} allBlurred={this.state.allBlurred}/>
              <Cam camName="King" camID="contestant2" camType="contestantCam" userType={this.props.userType} containerType="remoteCam contestant" audioID="audioContestant2" allMuted={this.state.allMuted} allBlurred={this.state.allBlurred}/>
              <div className="buttonsContainer">
                <button onClick={this.swapContestants}>Swap</button>
                <button onClick={this.muteAll}>Mute All</button>
                <button onClick={this.unmuteAll}>Unmute All</button>
                <button onClick={this.blurAll}>Blur All</button>
                <button onClick={this.unblurAll}>Unblur All</button>
              </div>
          </div>
          <div className="cam-col">
              <Cam camName={this.state.name2} camID="remote2" camType="guestCam" userType={this.props.userType} containerType="remoteCam guest" audioID="audioGuest2" allMuted={this.state.allMuted} allBlurred={this.state.allBlurred}/>
              <Cam camName={this.state.name3} camID="remote3" camType="guestCam" userType={this.props.userType} containerType="remoteCam guest" audioID="audioGuest3" allMuted={this.state.allMuted} allBlurred={this.state.allBlurred}/>
          </div>
        </div>
      );
    }
    else if(this.props.userType == "host") {
      return (
          <div className="cam-container">
            <div className="cam-col">
                <Cam camName={this.props.localUsername} camID="localCam" camType="guestCam" userType={this.props.userType} containerType="localCam guest"/>
                <Webcam userType={this.props.userType} localUsername={this.props.localUsername} updateUsername={(number,name) => this.updateUsername(number,name)}/>
                <Cam camName={this.state.name1} camID="remote1" camType="guestCam" userType={this.props.userType} containerType="remoteCam guest" audioID="audioGuest1"/>
            </div>
            <div className="cam-col">
                <Cam camName="Contestant" camID="contestant1" camType="contestantCam" userType={this.props.userType} containerType="remoteCam contestant" audioID="audioContestant1"/>
                <Cam camName="King" camID="contestant2" camType="contestantCam" userType={this.props.userType} containerType="remoteCam contestant" audioID="audioContestant2"/>
                <div className="buttonsContainer">
                  <button>Yes</button>
                  <button>No</button>
                </div>
            </div>
            <div className="cam-col">
                <Cam camName={this.state.name2} camID="remote2" camType="guestCam" userType={this.props.userType} containerType="remoteCam guest" audioID="audioGuest2" />
                <Cam camName={this.state.name3} camID="remote3" camType="guestCam" userType={this.props.userType} containerType="remoteCam guest" audioID="audioGuest3" />
            </div>
          </div>
      )
    }
    else {
      return (
        <div className="cam-container">
          <div className="cam-col">
              <Cam camName={this.props.localUsername} camID="localCam" camType="guestCam" userType={this.props.userType} containerType="localCam guest"/>
              <Webcam userType={this.props.userType} localUsername={this.props.localUsername} updateUsername={(number,name) => this.updateUsername(number,name)}/>
              <Cam camName={this.state.name1} camID="remote1" camType="guestCam" userType={this.props.userType} containerType="remoteCam guest" audioID="audioGuest1"/>
          </div>
          <div className="cam-col">
              <Cam camName="Contestant" camID="contestant1" camType="contestantCam" userType={this.props.userType} containerType="remoteCam contestant" audioID="audioContestant1"/>
              <Cam camName="King" camID="contestant2" camType="contestantCam" userType={this.props.userType} containerType="remoteCam contestant" audioID="audioContestant2"/>
          </div>
          <div className="cam-col">
              <Cam camName={this.state.name2} camID="remote2" camType="guestCam" userType={this.props.userType} containerType="remoteCam guest" audioID="audioGuest2" />
              <Cam camName={this.state.name3} camID="remote3" camType="guestCam" userType={this.props.userType} containerType="remoteCam guest" audioID="audioGuest3" />
          </div>
        </div>
      )
    }
  }
}

export default Koth;
