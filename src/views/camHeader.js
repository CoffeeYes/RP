import React, { Component } from 'react';

class camHeader extends Component {

  render() {
    if(this.props.userType == "admin") {
      if(this.props.camType == "guestCam") {
        return(
          <div className="camHeader">
              <p className="usersName">{this.props.camName}</p>
              <div className="buttonContainer">
                <img src={this.props.tickIcon} id={["tick" + this.props.iconID]} alt="tick icon"/>
                <img src={this.props.crossIcon} id={["cross" + this.props.iconID]} alt="cross icon"/>
                <button className="cameraButton" onClick={this.props.toggleFilter}>
                  <img src={this.props.videoIcon} alt="video icon"/>
                </button>
                <button className="cameraButton" onClick={this.props.toggleMute}>
                  <img src={this.props.muteIcon} alt="mute icon"/>
                </button>
                <button className="cameraButton" onClick={() => this.props.kickUser(this.props.camID)}>Kick</button>
              </div>
          </div>
        )
      }
      else {
        return(
          <div className="camHeader">
              <p className="usersName">{this.props.camName}</p>
              <div className="buttonContainer">
                <button className="cameraButton" onClick={this.props.toggleFilter}>
                  <img src={this.props.videoIcon} alt="video icon"/>
                </button>
                <button className="cameraButton" onClick={this.props.toggleMute}>
                  <img src={this.props.muteIcon} alt="mute icon"/>
                </button>
                <button className="cameraButton" onClick={() => this.props.kickUser(this.props.camID)}>Kick</button>
              </div>
          </div>
        )
      }
    }
    else {
      if(this.props.camType == "guestCam") {
        return(
          <div className="camHeader">
              <p className="usersName">{this.props.camName}</p>
              <div className="buttonContainer">
                <img src={this.props.tickIcon} id={["tick" + this.props.iconID]} alt="tick icon"/>
                <img src={this.props.crossIcon} id={["cross" + this.props.iconID]} alt="cross icon"/>
                <button className="cameraButton" onClick={this.props.toggleFilter}>
                  <img src={this.props.videoIcon} alt="video icon"/>
                </button>
                <button className="cameraButton" onClick={this.props.toggleMute}>
                  <img src={this.props.muteIcon} alt="mute icon"/>
                </button>
                <button className="cameraButton" onClick={() => this.props.kickUser(this.props.camID)}>Kick</button>
              </div>
          </div>
        )
      }
      else {
        return(
          <div className="camHeader">
              <p className="usersName">{this.props.camName}</p>
              <div className="buttonContainer">
                <button className="cameraButton" onClick={this.props.toggleFilter}>
                  <img src={this.props.videoIcon} alt="video icon"/>
                </button>
                <button className="cameraButton" onClick={this.props.toggleMute}>
                  <img src={this.props.muteIcon} alt="mute icon"/>
                </button>
                <button className="cameraButton" onClick={() => this.props.kickUser(this.props.camID)}>Kick</button>
              </div>
          </div>
        )
      }
    }
  }
}

export default camHeader;
