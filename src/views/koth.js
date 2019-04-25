import React, { Component } from 'react';
import Webcam from './webcam.js'

class Koth extends Component {
  constructor(props) {
    super(props)

    this.state = {
      name1 : '',
      name2 : '',
      name3 : '',
    }
  }

  updateUsername(number,name) {
    this.setState({['name' + number] : name})
  }

  render() {

    return (
      <div className="cam-container">
        <div className="cam-col">
          <div className="camBox localCam guest">
            <p>{this.props.localUsername}</p>
            <Webcam userType={this.props.userType} localUsername={this.props.localUsername} updateUsername={(number,name) => this.updateUsername(number,name)}/>
          </div>
          <div className="camBox remoteCam guest">
            <p>{this.state.name1}</p>
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
            <p>{this.state.name2}</p>
            <video autoPlay={true} className="guestCam" id="remote2"></video>
          </div>
          <div className="camBox remoteCam guest">
            <p>{this.state.name3}</p>
            <video autoPlay={true} className="guestCam" id="remote3"></video>
          </div>
        </div>
      </div>
    );
  }
}

export default Koth;
