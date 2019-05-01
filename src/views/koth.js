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

  render() {

    return (
      <div className="cam-container">
        <div className="cam-col">
          <div className="camBox localCam guest">
            <Cam camName={this.props.localUsername} camID="localCam" camType="guestCam"/>
            <Webcam userType={this.props.userType} localUsername={this.props.localUsername} updateUsername={(number,name) => this.updateUsername(number,name)}/>
          </div>
          <div className="camBox remoteCam guest">
            <Cam camName={this.state.name1} camID="remote1" camType="guestCam"/>
          </div>
        </div>
        <div className="cam-col">
          <div className="camBox remoteCam contestant">
            <Cam camName="Contestant" camID="contestantCam" camType="contestantCam"/>
          </div>
          <div className="camBox remoteCam contestant">
            <Cam camName="King" camID="king" camType="contestantCam"/>
          </div>
        </div>
        <div className="cam-col">
          <div className="camBox remoteCam guest">
            <Cam camName={this.state.name2} camID="remote2" camType="guestCam"/>
          </div>
          <div className="camBox remoteCam guest">
            <Cam camName={this.state.name3} camID="remote3" camType="guestCam"/>
          </div>
        </div>
      </div>
    );
  }
}

export default Koth;
