import React,{Component} from 'react';
import Webrtc from 'simplewebrtc'

import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:5001')

export default class Webcam extends Component {

  constructor(props) {
    super(props)

    this.state = {
      videoSrc: null
    }
  }

  componentDidMount = () => {
    let constraints = {
      video : {width: 640,height : 480}
    }

    navigator.mediaDevices.getUserMedia(constraints)
    .then( (stream) => {
      this.setState({videoSrc : stream })
      var video = document.querySelector('#testCam')
      video.srcObject = stream
      socket.emit('webcamConnect')

      let thisPC = new RTCPeerConnection();
      thisPC.addStream(stream)
    })
    .catch( error => {
      console.log(error)
    })



  }
  render() {
    return(
      <video autoPlay={true} className="cam2" id="testCam"></video>
    )
  }
}
