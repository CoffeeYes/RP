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

  swapContestants() {
    var contestant1 = document.querySelector('#contestant1');
    var contestant2 = document.querySelector('#contestant2');
    
    var temp = contestant2.srcObject;
    contestant2.srcObject = contestant1.srcObject;
    contestant1.srcObject = temp;
    }
  render() {

    return (
      <div className="cam-container">
        <div className="cam-col">
            <Cam camName={this.props.localUsername} camID="localCam" camType="guestCam" userType={this.props.userType} containerType="localCam guest"/>
            <Webcam userType={this.props.userType} localUsername={this.props.localUsername} updateUsername={(number,name) => this.updateUsername(number,name)}/>
            <Cam camName={this.state.name1} camID="remote1" camType="guestCam" userType={this.props.userType} containerType="remoteCam guest"/>
        </div>
        <div className="cam-col">
            <Cam camName="Contestant" camID="contestant1" camType="contestantCam" userType={this.props.userType} containerType="remoteCam contestant"/>
            <Cam camName="King" camID="contestant2" camType="contestantCam" userType={this.props.userType} containerType="remoteCam contestant"/>
            <button onClick={this.swapContestants}>Swap</button>
        </div>
        <div className="cam-col">
            <Cam camName={this.state.name2} camID="remote2" camType="guestCam" userType={this.props.userType} containerType="remoteCam guest"/>
            <Cam camName={this.state.name3} camID="remote3" camType="guestCam" userType={this.props.userType} containerType="remoteCam guest"/>
        </div>
      </div>
    );
  }
}

export default Koth;
