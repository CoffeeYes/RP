import React, { Component } from 'react';
import Webcam from './webcam.js'

class Koth extends Component {

  render() {

    return (
      <div className="cam-container">
        <div className="cam-col">
          <div className="camBox localCam guest">
            <p>{this.props.localUsername}</p>
            <Webcam userType={this.props.userType}/>
          </div>
          <div className="camBox remoteCam guest">
            <p>name3</p>
            <video autoPlay={true} className="guestCam" id="remote1"></video>
          </div>
        </div>
        <div className="cam-col">
          <div className="camBox remoteCam contestant">
            <p>Contestant</p>
            <video autoPlay={true} className="contestantCam" id="contestant"></video>
          </div>
          <div className="camBox remoteCam contestant">
            <p>King</p>
            <video autoPlay={true} className="contestantCam" id="king"></video>
          </div>
        </div>
        <div className="cam-col">
          <div className="camBox remoteCam guest">
            <p>name2</p>
            <video autoPlay={true} className="guestCam" id="remote2"></video>
          </div>
          <div className="camBox remoteCam guest">
            <p>name4</p>
            <video autoPlay={true} className="guestCam" id="remote3"></video>
          </div>
        </div>
      </div>
    );
  }
}

export default Koth;
